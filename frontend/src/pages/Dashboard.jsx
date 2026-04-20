import { Activity, Shield, Globe, HardDrive } from 'lucide-react';

const StatCard = ({ title, value, icon, color }) => (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{
            background: color,
            padding: '1rem',
            borderRadius: '12px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {icon}
        </div>
        <div>
            <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {title}
            </p>
            <h2 style={{ margin: 0, fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {value}
            </h2>
        </div>
    </div>
);

const Dashboard = () => {
    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontWeight: 600, color: 'var(--text-main)' }}>Overview</h1>
                <p style={{ color: 'var(--text-muted)' }}>Real-time statistics for your current organization.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <StatCard title="Active Targets" value="3" icon={<Target size={24} />} color="var(--primary-blue)" />
                <StatCard title="Subdomains" value="1,204" icon={<Globe size={24} />} color="var(--primary-blue)" />
                <StatCard title="Open Ports" value="48" icon={<HardDrive size={24} />} color="var(--success)" />
                <StatCard title="Live Web Apps" value="312" icon={<Activity size={24} />} color="var(--primary-blue)" />
            </div>

            <div className="card" style={{ minHeight: '400px' }}>
                <h3>Recent Activity</h3>
                <p>No recent scans run yet. Head over to the Scanner to begin enumeration.</p>
            </div>
        </div>
    );
};

// Hack to prevent undefined component Target in StatCard
import { Target } from 'lucide-react';

export default Dashboard;
