import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('admin_token') || null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = (newToken, userData) => {
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('admin_token', newToken);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('admin_token');
    };

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        // Validate token with backend
        fetch('http://localhost:5000/api/auth/verify', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.valid) {
                setUser(data.user);
            } else {
                logout();
            }
            setLoading(false);
        })
        .catch(err => {
            console.error('Auth verification error', err);
            logout();
            setLoading(false);
        });

    }, [token]);

    return (
        <AuthContext.Provider value={{ token, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
