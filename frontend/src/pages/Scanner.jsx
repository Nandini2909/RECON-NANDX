import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Scanner = () => {
    const [target, setTarget] = useState('example.com');
    const [name, setName] = useState('My First Scan');
    const [modules, setModules] = useState({
        subdomains: true,
        ports: false,
        web: false,
        urls: false
    });
    
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState(null);
    
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    const handleToggle = (key) => {
        setModules(prev => ({ ...prev, [key]: !prev[key] }));
    }

    const startScan = async (e) => {
        e.preventDefault();
        setIsScanning(true);
        setError(null);
        
        try {
            // Filter only active modules
            const activeModules = Object.keys(modules).filter(k => modules[k]);

            const res = await fetch('http://localhost:5000/api/tasks/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    target,
                    name,
                    modules: activeModules
                })
            });

            const data = await res.json();
            
            if (res.ok) {
                // Navigate to the live graphical tracking dashboard
                navigate(`/task/${data._id}`);
            } else {
                setError(data.error || 'Failed to start scan');
                setIsScanning(false);
            }
        } catch (err) {
            setError(err.message);
            setIsScanning(false);
        }
    };

    return (
        <div style={{ display: 'flex', gap: '2rem', height: '100%', justifyContent: 'center' }}>
            <div className="card" style={{ flex: 1, maxWidth: '600px', display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ color: 'var(--text-main)', marginBottom: '1.5rem' }}>Start New Reconnaissance</h2>
                
                {error && <div style={{background: 'var(--error)', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1rem'}}>{error}</div>}

                <form onSubmit={startScan} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div className="form-group">
                        <label className="form-label">Scan Name</label>
                        <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Weekly Example.com Recon" required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Target Domain</label>
                        <input className="form-input" value={target} onChange={e => setTarget(e.target.value)} placeholder="e.g. example.com" required />
                    </div>

                    <div style={{ marginBottom: '1.5rem', flex: 1 }}>
                        <label className="form-label">Enumeration Modules</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                            {Object.keys(modules).map((mod) => (
                                <label key={mod} style={{ 
                                    display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer',
                                    border: modules[mod] ? '2px solid var(--primary-blue)' : '1px solid var(--border-color)',
                                    padding: '1rem', borderRadius: '8px',
                                    background: modules[mod] ? 'var(--secondary-blue)' : 'var(--panel-bg)',
                                    transition: 'all 0.2s'
                                }}>
                                    <input 
                                        type="checkbox" 
                                        checked={modules[mod]} 
                                        onChange={() => handleToggle(mod)}
                                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary-blue)' }} 
                                    />
                                    <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{mod}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginTop: 'auto' }}>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem' }} disabled={isScanning}>
                            {isScanning ? 'Initializing Engine...' : 'Launch Recon'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Scanner;
