import { useState } from 'react';

const Results = () => {
    const [activeTab, setActiveTab] = useState('subdomains');

    // Mock data based on schema structure
    const mockSubdomains = [
        { _id: 1, value: "api.example.com", isLive: true, statusCode: 200, title: "API Gateway", techStack: ["Nginx", "Node.js"] },
        { _id: 2, value: "admin.example.com", isLive: true, statusCode: 403, title: "Forbidden", techStack: ["Apache"] },
        { _id: 3, value: "dev.example.com", isLive: false, statusCode: null, title: "", techStack: [] },
    ];

    const mockPorts = [
        { _id: 1, ip: "192.168.1.10", ports: [{ port: 80, service: 'http' }, { port: 443, service: 'https' }] },
        { _id: 2, ip: "192.168.1.15", ports: [{ port: 22, service: 'ssh' }, { port: 3306, service: 'mysql' }] },
    ];

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Enumeration Results</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Discovered assets across your target perimeter.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline" onClick={() => window.alert('Export to CSV coming soon')}>
                        Export CSV
                    </button>
                </div>
            </div>

            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', background: 'var(--panel-bg)' }}>
                    {['subdomains', 'ports', 'urls'].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '1rem 1.5rem',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: activeTab === tab ? '2px solid var(--primary-blue)' : '2px solid transparent',
                                color: activeTab === tab ? 'var(--primary-blue)' : 'var(--text-muted)',
                                fontWeight: activeTab === tab ? 600 : 500,
                                textTransform: 'capitalize',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Table Content */}
                <div style={{ flex: 1, overflow: 'auto' }}>
                    {activeTab === 'subdomains' && (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Subdomain</th>
                                    <th>Status</th>
                                    <th>HTTP Code</th>
                                    <th>Title</th>
                                    <th>Tech Stack</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockSubdomains.map(sub => (
                                    <tr key={sub._id}>
                                        <td style={{ fontWeight: 500 }}>{sub.value}</td>
                                        <td>
                                            {sub.isLive ? <span className="badge badge-success">Live</span> : <span className="badge badge-warning">Dead/Unprobed</span>}
                                        </td>
                                        <td>{sub.statusCode || '-'}</td>
                                        <td>{sub.title || '-'}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                {sub.techStack.map((tech, i) => (
                                                    <span key={i} className="badge badge-blue">{tech}</span>
                                                ))}
                                                {sub.techStack.length === 0 && '-'}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {activeTab === 'ports' && (
                         <table className="data-table">
                         <thead>
                             <tr>
                                 <th>IP Address</th>
                                 <th>Open Ports & Services</th>
                             </tr>
                         </thead>
                         <tbody>
                             {mockPorts.map(ipData => (
                                 <tr key={ipData._id}>
                                     <td style={{ fontWeight: 500, width: '250px' }}>{ipData.ip}</td>
                                     <td>
                                         <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                             {ipData.ports.map((p, i) => (
                                                 <span key={i} className="badge badge-success">
                                                     {p.port} ({p.service})
                                                 </span>
                                             ))}
                                         </div>
                                     </td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                    )}

                    {activeTab === 'urls' && (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            URL extraction data will appear here. No data yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Results;
