import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Target, Database, Settings, User } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    const location = useLocation();

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2>Recon <span className="text-blue">Nandx</span></h2>
            </div>
            <nav className="sidebar-nav">
                <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </Link>
                <Link to="/scanner" className={`nav-item ${location.pathname === '/scanner' ? 'active' : ''}`}>
                    <Target size={20} />
                    <span>Scanner</span>
                </Link>
                <Link to="/results" className={`nav-item ${location.pathname === '/results' ? 'active' : ''}`}>
                    <Database size={20} />
                    <span>Results</span>
                </Link>
                <Link to="/profile" className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
                    <User size={20} />
                    <span>Profile (Admin)</span>
                </Link>
            </nav>
        </div>
    );
};

export default Sidebar;
