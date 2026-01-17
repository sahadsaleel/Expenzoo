import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const EXPENSES_KEY = '@expenses_data';

export const storageService = {
    // Get all expenses
    getExpenses: async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(EXPENSES_KEY);
            return jsonValue != null ? JSON.parse(jsonValue) : [];
        } catch (e) {
            console.error('Failed to fetch expenses', e);
            return [];
        }
    },

    // Add a new expense
    addExpense: async (expenseData) => {
        try {
            const currentExpenses = await storageService.getExpenses();
            const newExpense = {
                _id: uuidv4(), // Generate a unique ID
                ...expenseData,
                createdAt: new Date().toISOString(),
            };
            const updatedExpenses = [newExpense, ...currentExpenses];
            await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(updatedExpenses));
            return newExpense;
        } catch (e) {
            console.error('Failed to add expense', e);
            throw e;
        }
    },

    // Update an existing expense
    updateExpense: async (id, expenseData) => {
        try {
            const currentExpenses = await storageService.getExpenses();
            const updatedExpenses = currentExpenses.map(expense =>
                expense._id === id ? { ...expense, ...expenseData } : expense
            );
            await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(updatedExpenses));
            return updatedExpenses.find(e => e._id === id);
        } catch (e) {
            console.error('Failed to update expense', e);
            throw e;
        }
    },

    // Delete an expense
    deleteExpense: async (id) => {
        try {
            const currentExpenses = await storageService.getExpenses();
            const updatedExpenses = currentExpenses.filter(expense => expense._id !== id);
            await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(updatedExpenses));
            return { success: true };
        } catch (e) {
            console.error('Failed to delete expense', e);
            throw e;
        }
    },

    // Clear all expenses (Optional, dev use)
    clearAll: async () => {
        try {
            await AsyncStorage.removeItem(EXPENSES_KEY);
        } catch (e) {
            console.error('Failed to clear expenses', e);
        }
    }
};
