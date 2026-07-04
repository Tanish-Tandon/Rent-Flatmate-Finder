/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Functions defined BEFORE useEffect so they can be accessed without errors
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        setUser(decoded);
    };

    useEffect(() => {
        const checkLoggedInUser = () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    // Check if token is expired
                    if (decoded.exp * 1000 < Date.now()) {
                        logout();
                    } else {
                        setUser(decoded);
                    }
                } catch (error) {
                    console.error("Invalid token architecture:", error);
                    logout();
                }
            }
            setLoading(false);
        };
        
        checkLoggedInUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};