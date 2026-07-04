import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Ensures only authenticated users with specific roles can access routes.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>; // Keep this aesthetic in your final app

    if (!user) {
        return <Navigate to="/login" />;
    }

    // Role-based access check
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" />; // Redirect unauthorized users to home
    }

    return children;
};

export default ProtectedRoute;