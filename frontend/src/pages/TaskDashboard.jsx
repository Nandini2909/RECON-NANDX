import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

const StatCard = ({ title, value, color }) => (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', borderTop: `4px solid ${color}` }}>
        <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            {title}
        </p>
        <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {value}
        </h2>
    </div>
);

const TaskDashboard = () => {
    const { id } = useParams();
    const [metrics, setMetrics] = useState({
        subdomains: 0,
        ports: 0,
        web: 0,
        urls: 0
    });
    
    // Time series for Area Chart
    const [history, setHistory] = useState([
        { time: 'Start', subdomains: 0, ports: 0, web: 0, urls: 0 }
    ]);

    const [status, setStatus] = useState('Pending');
    const [logs, setLogs] = useState([]);
    const socketRef = useRef(null);
    const logsEndRef = useRef(null);

    useEffect(() => {
        socketRef.current = io('http://localhost:5000');
        
        socketRef.current.emit('join_task', id);
        
        socketRef.current.on('task_log', (log) => {
            setLogs(prev => [...prev.slice(-49), log]); // Keep last 50
            if(log.message.includes('COMPLETED')) setStatus('Completed');
            else if(log.level === 'error' && log.message.includes('Fatal')) setStatus('Failed');
            else if(status === 'Pending') setStatus('Running');
        });

        socketRef.current.on('metrics_update', (data) => {
             // data looks like { type: 'subdomains', count: 50 }
             setMetrics(prev => {
                  const newMetrics = { ...prev, [data.type]: prev[data.type] + data.count };
                  
                  // Add to history for the graph
                  setHistory(h => [...h, { time: new Date().toLocaleTimeString(), ...newMetrics }]);
                  
                  return newMetrics;
             });
        });

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
        }
    }, [id]);

    useEffect(() => {
        if(logsEndRef.current) logsEndRef.current.scrollIntoView();
    }, [logs]);

    const chartData = [
        { name: 'Subdomains', count: metrics.subdomains, fill: '#0056b3' },
        { name: 'Open Ports', count: metrics.ports, fill: '#10b981' },
        { name: 'Live Web', count: metrics.web, fill: '#f59e0b' },
        { name: 'URLs', count: metrics.urls, fill: '#8b5cf6' }
    ];

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Pipeline Tracker: {id}</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Status: <span style={{ fontWeight: 'bold', color: status === 'Running' ? 'var(--warning)' : status === 'Completed' ? 'var(--success)' : 'var(--text-main)' }}>{status}</span></p>
                </div>
                <Link to="/results" className="btn btn-outline">View Full Results DB</Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                <StatCard title="Found Subdomains" value={metrics.subdomains} color="#0056b3" />
                <StatCard title="Open Ports" value={metrics.ports} color="#10b981" />
                <StatCard title="Live Web Apps" value={metrics.web} color="#f59e0b" />
                <StatCard title="Total URLs" value={metrics.urls} color="#8b5cf6" />
            </div>

            <div style={{ display: 'flex', gap: '2rem', flex: 1, minHeight: '300px' }}>
                {/* Visual Graphs */}
                <div className="card" style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Asset Discovery Over Time</h3>
                    <div style={{ flex: 1 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={history}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="time" hide />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Area type="monotone" dataKey="subdomains" stackId="1" stroke="#0056b3" fill="#0056b3" />
                                <Area type="monotone" dataKey="urls" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Asset Distribution</h3>
                    <div style={{ flex: 1 }}>
                         <ResponsiveContainer width="100%" height="100%">
                             <BarChart data={chartData}>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                 <XAxis dataKey="name" />
                                 <YAxis />
                                 <Tooltip />
                                 <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                             </BarChart>
                         </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Minimzed raw logs at bottom instead of full terminal */}
            <div className="card" style={{ marginTop: '2rem', maxHeight: '150px', overflowY: 'auto', background: '#0f172a', color: '#e2e8f0', fontSize: '13px', fontFamily: 'monospace' }}>
                 {logs.map((L, i) => (
                      <div key={i} style={{ color: L.level === 'error' ? '#ef4444' : L.level === 'success' ? '#10b981' : '#38bdf8', padding: '2px 0' }}>
                           [{new Date(L.timestamp).toLocaleTimeString()}] {L.message}
                      </div>
                 ))}
                 <div ref={logsEndRef} />
            </div>
        </div>
    );
};

export default TaskDashboard;
