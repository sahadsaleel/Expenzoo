import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storageService } from '../services/storage';

export const ExpenseContext = createContext();

const STORAGE_KEYS = {
    BUDGET: '@expenzoo_budget',
    CATEGORIES: '@expenzoo_categories',
};

const DEFAULT_CATEGORIES = [
    'Cement', 'Steel', 'Sand', 'Bricks', 'Labour', 'Electrical', 'Plumbing', 'Painting'
];

export const ExpenseProvider = ({ children }) => {
    const [expenses, setExpenses] = useState([]);
    const [budget, setBudget] = useState(1000000); // Default 10 Lakhs
    const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load data on startup
    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Load budget and categories from local storage
            const [storedBudget, storedCategories] = await Promise.all([
                AsyncStorage.getItem(STORAGE_KEYS.BUDGET),
                AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES),
            ]);

            if (storedBudget) setBudget(parseFloat(storedBudget));
            if (storedCategories) setCategories(JSON.parse(storedCategories));

            // Load expenses from Local Storage
            await fetchExpenses();
        } catch (err) {
            setError('Failed to load initial data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchExpenses = async () => {
        try {
            const data = await storageService.getExpenses();
            // Map data to ensure frontend compatibility
            const mappedExpenses = data.map(exp => ({
                ...exp,
                id: exp._id,
                date: new Date(exp.createdAt).toISOString().split('T')[0] // Ensure date exists
            }));
            setExpenses(mappedExpenses);
        } catch (err) {
            console.error('Error fetching expenses:', err);
            setError('Failed to fetch expenses');
        }
    };

    // Save budget/categories locally whenever they change
    useEffect(() => {
        const saveLocalSettings = async () => {
            try {
                await Promise.all([
                    AsyncStorage.setItem(STORAGE_KEYS.BUDGET, budget.toString()),
                    AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories)),
                ]);
            } catch (error) {
                console.error('Error saving settings:', error);
            }
        };
        saveLocalSettings();
    }, [budget, categories]);

    const resetData = async () => {
        try {
            await AsyncStorage.multiRemove([STORAGE_KEYS.BUDGET, STORAGE_KEYS.CATEGORIES]);
            await storageService.clearAll();
            setExpenses([]);
            setBudget(1000000);
            setCategories(DEFAULT_CATEGORIES);
        } catch (error) {
            console.error('Error resetting data:', error);
        }
    };

    const addExpense = async (newExpense) => {
        try {
            setError(null);
            const addedExpense = await storageService.addExpense(newExpense);

            const mapped = {
                ...addedExpense,
                id: addedExpense._id,
                date: new Date(addedExpense.createdAt).toISOString().split('T')[0]
            };
            setExpenses((prev) => [mapped, ...prev]);
        } catch (err) {
            setError('Failed to add expense');
            console.error(err);
        }
    };

    const deleteExpense = async (id) => {
        try {
            setError(null);
            await storageService.deleteExpense(id);
            setExpenses((prev) => prev.filter((expense) => expense.id !== id));
        } catch (err) {
            setError('Failed to delete expense');
            console.error(err);
        }
    };

    const updateExpense = async (updatedExpense) => {
        try {
            setError(null);
            const result = await storageService.updateExpense(updatedExpense.id, updatedExpense);

            if (result) {
                const mapped = {
                    ...result,
                    id: result._id,
                    date: new Date(result.createdAt).toISOString().split('T')[0]
                };
                setExpenses((prev) =>
                    prev.map((expense) => expense.id === mapped.id ? mapped : expense)
                );
            }
        } catch (err) {
            setError('Failed to update expense');
            console.error(err);
        }
    };

    const addCategory = (category) => {
        if (!categories.includes(category)) {
            setCategories([...categories, category]);
        }
    };

    const updateCategory = (oldCategory, newCategory) => {
        setCategories((prev) => prev.map(c => c === oldCategory ? newCategory : c));
    };

    const deleteCategory = (category) => {
        setCategories((prev) => prev.filter(c => c !== category));
    };

    // Calculations
    const totalSpent = expenses.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthExpense = expenses.reduce((sum, item) => {
        const itemDate = new Date(item.date);
        if (itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear) {
            return sum + parseFloat(item.amount || 0);
        }
        return sum;
    }, 0);

    const restoreAllData = async (backupData) => {
        try {
            setLoading(true);

            // Validate backup data structure
            if (!backupData.expenses || !Array.isArray(backupData.expenses)) {
                throw new Error('Invalid backup file: Missing expenses data');
            }

            // 1. Clear current data
            await AsyncStorage.multiRemove([STORAGE_KEYS.BUDGET, STORAGE_KEYS.CATEGORIES]);
            await storageService.clearAll();

            // 2. Restore Settings
            const newBudget = backupData.budget || 1000000;
            const newCategories = backupData.categories || DEFAULT_CATEGORIES;

            await AsyncStorage.setItem(STORAGE_KEYS.BUDGET, newBudget.toString());
            await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(newCategories));

            // 3. Restore Expenses
            // We need to re-add them one by one or bulk add if storage supported it.
            // For now, we'll brute force replace the storage file content for efficiency if possible,
            // but since storageService abstracts it, we'll use a loop or add a bulk method.
            // Let's rely on storageService having a 'replaceAll' or just loop.
            // Actually, let's just use the transparent access to set the expenses key directly here for speed.
            // The storageService uses '@expenses_data'.

            // Map incoming expenses to ensure valid IDs and formatting
            const restoredExpenses = backupData.expenses.map(e => ({
                ...e,
                _id: e._id || e.id, // Ensure ID exists
            }));

            await AsyncStorage.setItem('@expenses_data', JSON.stringify(restoredExpenses));

            // 4. Update State
            setBudget(newBudget);
            setCategories(newCategories);
            await fetchExpenses(); // Refresh expenses from the newly written storage

            return { success: true };
        } catch (error) {
            console.error('Restore error:', error);
            setError('Failed to restore data');
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    return (
        <ExpenseContext.Provider
            value={{
                expenses,
                budget,
                setBudget,
                categories,
                loading,
                error,
                addExpense,
                deleteExpense,
                updateExpense,
                addCategory,
                updateCategory,
                deleteCategory,
                resetData,
                restoreAllData, // Exporting new function
                totalSpent,
                thisMonthExpense,
                refreshExpenses: fetchExpenses
            }}
        >
            {children}
        </ExpenseContext.Provider>
    );
};
