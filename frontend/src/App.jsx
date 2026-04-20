import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Scanner from './pages/Scanner';
import Results from './pages/Results';
import Profile from './pages/Profile';
import TaskDashboard from './pages/TaskDashboard';
import Login from './pages/Login';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import './index.css';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    
    if (loading) return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading...</div>;
    
    if (!user) {
        return <Login />;
    }
    
    return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
           <Route path="/login" element={<Login />} />
           <Route path="/*" element={
              <ProtectedRoute>
                <div className="app-container">
                  <Sidebar />
                  <div className="main-content">
                    <Topbar />
                    <div className="page-content">
                       <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/scanner" element={<Scanner />} />
                          <Route path="/results" element={<Results />} />
                          <Route path="/profile" element={<Profile />} />
                          <Route path="/task/:id" element={<TaskDashboard />} />
                       </Routes>
                    </div>
                  </div>
                </div>
              </ProtectedRoute>
           } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
