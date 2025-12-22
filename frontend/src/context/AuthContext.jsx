
import { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null); // Can store username if needed

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            // Optionally decode token to get username if included in payload
        } else {
            localStorage.removeItem('token');
            setUser(null);
        }
    }, [token]);

    const login = async (username, password) => {
        try {
            const authToken = await authApi.login(username, password);
            setToken(authToken);
            setUser({ username }); // Set simple user object
            return true;
        } catch (error) {
            console.error("Login failed:", error);
            return false;
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
