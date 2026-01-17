import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        loadStorageData();
    }, []);

    const loadStorageData = async () => {
        try {
            // Ensure splash screen shows for at least 2.5 seconds
            const timer = new Promise(resolve => setTimeout(resolve, 2500));

            const [storedToken, storedUser] = await Promise.all([
                AsyncStorage.getItem('@auth_token'),
                AsyncStorage.getItem('@user_data'),
                timer
            ]);

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error('Failed to load auth data:', error);
        } finally {
            setAuthLoading(false);
        }
    };

    const requestOtp = async (email) => {
        try {
            setAuthLoading(true);
            const result = await authService.requestOtp(email);
            return result;
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Failed to send OTP' };
        } finally {
            setAuthLoading(false);
        }
    };

    const verifyOtp = async (email, otp) => {
        try {
            setAuthLoading(true);
            const result = await authService.verifyOtp(email, otp);

            if (result.success && result.token) {
                const token = result.token;
                const user = result.user;

                await AsyncStorage.setItem('@auth_token', token);
                await AsyncStorage.setItem('@user_data', JSON.stringify(user));

                setToken(token);
                setUser(user);
                return { success: true };
            } else {
                return { success: false, error: result.msg || 'Verification failed' };
            }
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Verification failed' };
        } finally {
            setAuthLoading(false);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('@auth_token');
            await AsyncStorage.removeItem('@user_data');
            setToken(null);
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token,
                authLoading,
                requestOtp,
                verifyOtp,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
