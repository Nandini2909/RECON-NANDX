const express = require('express');
const router = express.Router();
const Org = require('../models/Org');
const Task = require('../models/Task');
const Asset = require('../models/Asset');
const { enqueueTask } = require('../workers/taskRunner');

// --- Organizations ---
router.get('/orgs', async (req, res) => {
    try {
        const orgs = await Org.find().sort({ createdAt: -1 });
        res.json(orgs);
    } catch (err) {
         res.status(500).json({ error: err.message });
    }
});

router.post('/orgs', async (req, res) => {
    try {
         const org = new Org(req.body);
         await org.save();
         res.status(201).json(org);
    } catch(err) {
         res.status(500).json({ error: err.message });
    }
});

router.delete('/orgs/:id', async (req, res) => {
    try {
        await Org.findByIdAndDelete(req.params.id);
        await Asset.deleteMany({ orgId: req.params.id });
        await Task.deleteMany({ orgId: req.params.id });
        res.json({ success: true });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Tasks / Scanner ---
router.get('/tasks/:orgId', async (req, res) => {
    try {
         const tasks = await Task.find({ orgId: req.params.orgId }).sort({ startedAt: -1, _id: -1 });
         res.json(tasks);
    } catch(err) {
         res.status(500).json({ error: err.message });
    }
});

router.post('/tasks/start', async (req, res) => {
    try {
        let { orgId, target, name, modules } = req.body;
        
        // If dummy or invalid orgId, use a Default Org
        if (!orgId || orgId.length !== 24) {
            let defaultOrg = await Org.findOne({ name: 'Default Organization' });
            if (!defaultOrg) {
                defaultOrg = new Org({ name: 'Default Organization', description: 'Auto-created for basic scans' });
                await defaultOrg.save();
            }
            orgId = defaultOrg._id;
        }

        const task = new Task({ orgId, target, name, modules });
        await task.save();

        // Enqueue background processing
        const io = req.app.get('io');
        enqueueTask(task._id, io);

        res.status(201).json(task);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Assets ---
router.get('/assets/:orgId', async (req, res) => {
    try {
        const { type } = req.query; // optional filter
        const filter = { orgId: req.params.orgId };
        if (type) filter.type = type;

        const assets = await Asset.find(filter).sort({ discoveredAt: -1 }).limit(1000);
        res.json(assets);
    } catch(err) {
         res.status(500).json({ error: err.message });
    }
});

module.exports = router;
