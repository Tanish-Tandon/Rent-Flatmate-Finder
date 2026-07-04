import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

// Import our Global Components
import Navbar from './components/Navbar';

// Import our Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Import Dashboards
import OwnerDashboard from './pages/Owner/OwnerDashboard';
import TenantDashboard from './pages/Tenant/TenantDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard'; // 🔥 Yeh naya import add kiya

// Import Chat Window
import ChatWindow from "./Chat/ChatWindow";

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div className="flex justify-center mt-24 text-indigo-400 font-medium">Loading AI Engine...</div>;
    
    if (!user) return <Navigate to="/login" replace />;
    
    // Check if user role matches the allowed roles for this route
    if (allowedRoles && !allowedRoles.includes(user.role)){
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
                <Navbar />
                
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Protected Role-Based Routes */}
                    <Route 
                        path="/owner-dashboard" 
                        element={
                            <ProtectedRoute allowedRoles={['owner']}>
                                <OwnerDashboard />
                            </ProtectedRoute>
                        } 
                    />
                    
                    <Route 
                        path="/tenant-dashboard" 
                        element={
                            <ProtectedRoute allowedRoles={['tenant']}>
                                <TenantDashboard />
                            </ProtectedRoute>
                        } 
                    />

                    {/* 🔥 Admin Dashboard Route: Only for Admin */}
                    <Route 
                        path="/admin-dashboard" 
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        } 
                    />

                    {/* Chat Route: Accessible by both Owners and Tenants */}
                    <Route 
                        path="/chat/:matchId" 
                        element={
                            <ProtectedRoute allowedRoles={['owner', 'tenant']}>
                                <ChatWindow />
                            </ProtectedRoute>
                        } 
                    />
                    
                    <Route path="/unauthorized" element={
                        <div className="pt-24 p-10 text-center text-red-500 font-bold text-2xl bg-slate-950 min-h-screen">
                            Access Denied
                        </div>
                    } />
                    
                    <Route path="*" element={
                        <div className="pt-24 p-10 text-center font-bold text-2xl text-slate-500 bg-slate-950 min-h-screen">
                            404 - Space Not Found
                        </div>
                    } />
                </Routes>
            </div>
        </Router>
    );
}

export default App;