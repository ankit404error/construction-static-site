import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);

    // Check for existing token on mount
    useEffect(() => {
        const checkAuth = async () => {
            const storedToken = localStorage.getItem('adminToken');

            if (storedToken) {
                try {
                    await api.verifyToken(storedToken);
                    setToken(storedToken);
                    setIsAdmin(true);
                } catch (error) {
                    console.error('Token verification failed:', error);
                    localStorage.removeItem('adminToken');
                    setIsAdmin(false);
                    setToken(null);
                }
            }

            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (username, password) => {
        try {
            const response = await api.login(username, password);
            const { token: newToken } = response;

            localStorage.setItem('adminToken', newToken);
            setToken(newToken);
            setIsAdmin(true);

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        setToken(null);
        setIsAdmin(false);
    };

    const value = {
        isAdmin,
        loading,
        token,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
