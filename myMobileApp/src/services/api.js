import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Platform } from 'react-native';

// 🛑 FIXED: Using your actual computer IP for physical device connectivity!
const YOUR_COMPUTER_IP = '192.168.1.3';

const API_URL = Platform.select({
    ios: `http://${YOUR_COMPUTER_IP}:5000/api`,
    android: 'http://10.0.2.2:5000/api',
    default: `http://${YOUR_COMPUTER_IP}:5000/api`,
});

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000, // Increase timeout to 10s for slower local networks
    headers: {
        'Content-Type': 'application/json',
    },
});

// For debugging: Log request URLs to see if they are correct
// For debugging: Log request URLs to see if they are correct
api.interceptors.request.use(async (config) => {
    console.log(`🚀 API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    const token = await AsyncStorage.getItem('@auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code === 'ECONNABORTED') {
            console.error('❌ Timeout Error: Server took too long to respond.');
            return Promise.reject({ message: 'Server is taking too long. Check your connection.' });
        }
        if (error.message === 'Network Error') {
            console.error('❌ Network Error: Cannot connect to server.');
            return Promise.reject({ message: 'Cannot connect to server. Ensure you are on the same Wi-Fi.' });
        }
        return Promise.reject(error);
    }
);

// Auth Services
export const authService = {
    requestOtp: async (email) => {
        const response = await api.post('/auth/request-otp', { email });
        return response.data;
    },
    verifyOtp: async (email, otp) => {
        const response = await api.post('/auth/verify-otp', { email, otp });
        return response.data;
    },
};

// Expense Services
export const expenseService = {
    getExpenses: async () => {
        const response = await api.get('/expenses');
        return response.data;
    },
    addExpense: async (expenseData) => {
        const response = await api.post('/expenses', expenseData);
        return response.data;
    },
    updateExpense: async (id, expenseData) => {
        const response = await api.put(`/expenses/${id}`, expenseData);
        return response.data;
    },
    deleteExpense: async (id) => {
        const response = await api.delete(`/expenses/${id}`);
        return response.data;
    },
};

export default api;
