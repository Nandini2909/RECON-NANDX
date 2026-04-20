const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const Task = require('../models/Task');
const Asset = require('../models/Asset');
const { default: PQueue } = require('p-queue');

// Concurrency queue so we don't nuke the local system
const queue = new PQueue({ concurrency: 1 });

/**
 * Streams real-time messages via socket.io and updates the DB.
 */
const logToDbAndSocket = async (io, taskId, message, level = 'info') => {
    // We append the log to the DB and broadcast it via WS
    if (io) {
        io.to(taskId.toString()).emit('task_log', { message, level, timestamp: new Date() });
    }
    await Task.findByIdAndUpdate(taskId, {
        $push: { logs: { message, level, timestamp: new Date() } }
    });
};

const emitMetrics = (io, taskId, metrics) => {
    if (io) {
        io.to(taskId.toString()).emit('metrics_update', metrics);
    }
};

/**
 * Wraps spawn in a promise.
 */
const runCommand = (cmd, args, io, taskId) => {
    return new Promise((resolve, reject) => {
        const proc = spawn(cmd, args);
        let stdoutData = '';
        let stderrData = '';

        proc.stdout.on('data', (data) => {
            const str = data.toString();
            stdoutData += str;
            // Send each line out
            str.split('\n').filter(Boolean).forEach(line => {
                logToDbAndSocket(io, taskId, line, 'info');
            });
        });

        proc.stderr.on('data', (data) => {
            const str = data.toString();
            stderrData += str;
            // Tools like subfinder write banners to stderr, so it's not strictly error
            str.split('\n').filter(Boolean).forEach(line => {
                 logToDbAndSocket(io, taskId, `LOG: ${line}`, 'info');
            });
        });

        proc.on('close', (code) => {
            if (code !== 0) {
                // Warning, some tools exit with non-zero on minor issues, so we just log it
                logToDbAndSocket(io, taskId, `${cmd} exited with code ${code}`, 'error');
            }
            resolve({ stdout: stdoutData, stderr: stderrData, code });
        });

        proc.on('error', (err) => {
            logToDbAndSocket(io, taskId, `Failed to start ${cmd}: ${err.message}`, 'error');
            reject(err);
        });
    });
};

// Main Execution Flow
const executeTask = async (taskId, io) => {
    try {
        const task = await Task.findById(taskId);
        if (!task) return;

        task.status = 'Running';
        task.startedAt = new Date();
        await task.save();

        const { target, modules, orgId } = task;

        await logToDbAndSocket(io, taskId, `Starting task on target: ${target}`);

        // Temporary directory for tool outputs
        const tmpDir = path.join(__dirname, '..', 'tmp');
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
        
        let targetSubdomains = [target]; // Starting array of domains

        // 1. MODULE: Subdomains
        if (modules.includes('subdomains')) {
            await logToDbAndSocket(io, taskId, `--- Running Subdomain Enumeration ---`, 'info');
            
            // We use subfinder. We write output to a file because it's easier to parse if stdout is large
            const outPath = path.join(tmpDir, `${taskId}_subdomains.txt`);
            await runCommand('subfinder', ['-d', target, '-all', '-silent', '-o', outPath], io, taskId);
            
            if (fs.existsSync(outPath)) {
                const results = fs.readFileSync(outPath, 'utf8').split('\n').filter(Boolean);
                await logToDbAndSocket(io, taskId, `Found ${results.length} subdomains. Saving to DB...`, 'success');
                emitMetrics(io, taskId, { type: 'subdomains', count: results.length });
                
                // Save to Asset
                for (const sub of results) {
                    await Asset.findOneAndUpdate(
                        { orgId, type: 'subdomain', value: sub },
                        { orgId, type: 'subdomain', value: sub, target },
                        { upsert: true, new: true, setDefaultsOnInsert: true }
                    );
                }
                
                targetSubdomains = results;
            }
        }

        // 2. MODULE: Port Scanning
        let targetIPsAndPorts = [];
        if (modules.includes('ports')) {
            await logToDbAndSocket(io, taskId, `--- Running Port Scanning ---`, 'info');
            
            // Create inputs for naabu
            const domainsPath = path.join(tmpDir, `${taskId}_domains_for_ports.txt`);
            fs.writeFileSync(domainsPath, targetSubdomains.join('\n'));

            const portsOutPath = path.join(tmpDir, `${taskId}_ports.txt`);
            // Naabu with json output is better for parsing
            await runCommand('naabu', ['-list', domainsPath, '-json', '-o', portsOutPath], io, taskId);

            if (fs.existsSync(portsOutPath)) {
                 const lines = fs.readFileSync(portsOutPath, 'utf8').split('\n').filter(Boolean);
                 await logToDbAndSocket(io, taskId, `Found ${lines.length} open ports.`, 'success');
                 emitMetrics(io, taskId, { type: 'ports', count: lines.length });
                 
                 for (const line of lines) {
                     try {
                        const parsed = JSON.parse(line);
                        // naabu JSON { host: string, ip: string, port: number }
                        await Asset.findOneAndUpdate(
                            { orgId, type: 'ip', value: parsed.ip },
                            { 
                                $addToSet: { ports: { port: parsed.port, service: 'unknown' } },
                                target 
                            },
                            { upsert: true, new: true, setDefaultsOnInsert: true }
                        );
                     } catch(e) {}
                 }
            }
        }

        // 3. MODULE: Web Stack
        if (modules.includes('web')) {
            await logToDbAndSocket(io, taskId, `--- Running Web Probing (httpx) ---`, 'info');
            const domainsPath = path.join(tmpDir, `${taskId}_domains_for_web.txt`);
            fs.writeFileSync(domainsPath, targetSubdomains.join('\n'));

            const httpOutPath = path.join(tmpDir, `${taskId}_httpx.json`);
            // httpx -sc -title -td -t 200 -status-code -tech-detect -json
            await runCommand('httpx', [
                '-l', domainsPath, 
                '-sc', '-title', '-td', '-status-code', '-tech-detect',
                '-json', '-o', httpOutPath
            ], io, taskId);

            if (fs.existsSync(httpOutPath)) {
                const lines = fs.readFileSync(httpOutPath, 'utf8').split('\n').filter(Boolean);
                await logToDbAndSocket(io, taskId, `Found ${lines.length} web assets.`, 'success');
                emitMetrics(io, taskId, { type: 'web', count: lines.length });

                for (const line of lines) {
                    try {
                        const { url, title, status_code, tech, host } = JSON.parse(line);
                        
                        // Update the subdomain asset with web info
                        await Asset.findOneAndUpdate(
                            { orgId, type: 'subdomain', value: host },
                            {
                                $set: {
                                    isLive: true,
                                    statusCode: status_code,
                                    title: title || '',
                                    techStack: tech || []
                                }
                            }
                        );
                    } catch(e) {}
                }
            }
        }

        // 4. MODULE: Wayback / Gau
        if (modules.includes('urls')) {
             await logToDbAndSocket(io, taskId, `--- Fetching URLs (gau) ---`, 'info');
             // For performance in prototype, just run gau on the main target
             const urlOutPath = path.join(tmpDir, `${taskId}_urls.txt`);
             await runCommand('gau', [target, '--o', urlOutPath], io, taskId);
             
             if (fs.existsSync(urlOutPath)) {
                 const results = fs.readFileSync(urlOutPath, 'utf8').split('\n').filter(Boolean);
                 // Limiting URL saving to first 1000 to prevent DB overload during tests
                 const slice = results.slice(0, 1000);
                 await logToDbAndSocket(io, taskId, `Found ${results.length} URLs. Saving max 1000 to DB...`, 'success');
                 emitMetrics(io, taskId, { type: 'urls', count: results.length });
                 
                 for (const u of slice) {
                    await Asset.findOneAndUpdate(
                        { orgId, type: 'url', value: u },
                        { orgId, type: 'url', value: u, target },
                        { upsert: true }
                    );
                 }
             }
        }

        // Completion
        task.status = 'Completed';
        task.finishedAt = new Date();
        await task.save();
        await logToDbAndSocket(io, taskId, '--- TASK COMPLETED SUCCESSFULLY ---', 'success');

    } catch (err) {
        await logToDbAndSocket(io, taskId, `Fatal error during task: ${err.message}`, 'error');
        await Task.findByIdAndUpdate(taskId, { status: 'Failed', finishedAt: new Date() });
    }
};

/**
 * Interface to push things to the queue
 */
const enqueueTask = (taskId, io) => {
    queue.add(() => executeTask(taskId, io));
};

module.exports = { enqueueTask, executeTask };
