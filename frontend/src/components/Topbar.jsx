const Topbar = () => {
    return (
        <div style={{
            height: '70px',
            background: 'var(--panel-bg)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 2rem',
            justifyContent: 'space-between',
            zIndex: 9
        }}>
            <div>
                <h3 style={{ margin: 0, fontWeight: 500, color: 'var(--text-main)' }}>Organization Context</h3>
                {/* Future: Org selector dropdown here */}
            </div>
            <div>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--primary-blue)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    User
                </div>
            </div>
        </div>
    );
};

export default Topbar;
