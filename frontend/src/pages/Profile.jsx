import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Shield, User, Key, Server } from 'lucide-react';

const Profile = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>User Profile</h1>
                <p style={{ color: 'var(--text-muted)' }}>Manage your centralized Recon Nandx access.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
                {/* Profile Identity Card */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '3rem 2rem' }}>
                    <div style={{ 
                        width: '100px', height: '100px', 
                        borderRadius: '50%', background: 'var(--secondary-blue)', color: 'var(--primary-blue)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem'
                    }}>
                        <User size={48} />
                    </div>
                    <h2 style={{ marginBottom: '0.25rem', color: 'var(--text-main)' }}>{user?.email?.split('@')[0] || 'Administrator'}</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{user?.email}</p>

                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                        {user?.role === 'admin' ? (
                            <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Shield size={14} /> System Admin</span>
                        ) : (
                            <span className="badge badge-blue">Standard User</span>
                        )}
                        <span className="badge badge-warning">Active Connection</span>
                    </div>

                    <button className="btn btn-outline" style={{ width: '100%', borderColor: 'var(--error)', color: 'var(--error)' }} onClick={logout}>
                        Log Out
                    </button>
                </div>

                {/* System Settings & Permissions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                     <div className="card">
                         <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                             <Key size={20} className="text-blue" />
                             Access Privileges
                         </h3>
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                 <span style={{ fontWeight: 500 }}>Launch Recon Pipelines</span>
                                 <span style={{ color: 'var(--success)' }}>Granted</span>
                             </div>
                             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                 <span style={{ fontWeight: 500 }}>Database Deletion Operations</span>
                                 <span style={{ color: user?.role === 'admin' ? 'var(--success)' : 'var(--error)' }}>
                                    {user?.role === 'admin' ? 'Granted' : 'Denied'}
                                 </span>
                             </div>
                             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                 <span style={{ fontWeight: 500 }}>Global Org Scope</span>
                                 <span style={{ color: 'var(--success)' }}>Granted</span>
                             </div>
                         </div>
                     </div>

                     <div className="card" style={{ background: '#0f172a', color: 'white', border: 'none' }}>
                         <h3 style={{ borderBottom: '1px solid #1e293b', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white' }}>
                             <Server size={20} color="#38bdf8" />
                             Backend Node Information
                         </h3>
                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
                             <div>
                                 <span style={{ color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>API Endpoint</span>
                                 <code>http://localhost:5000/api</code>
                             </div>
                             <div>
                                 <span style={{ color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>WS Engine</span>
                                 <code>Socket.io (v4)</code>
                             </div>
                             <div>
                                 <span style={{ color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Session Token</span>
                                 <code style={{ wordBreak: 'break-all', color: '#10b981' }}>Valid JWT Issuer</code>
                             </div>
                         </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
