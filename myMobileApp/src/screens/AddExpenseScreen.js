import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ExpenseContext } from '../context/ExpenseContext';
import { COLORS, SPACING, SIZES } from '../constants/theme';

const PAYMENT_MODES = [
    { id: 'Cash', icon: 'cash', label: 'Cash' },
    { id: 'UPI', icon: 'qrcode', label: 'UPI' },
    { id: 'Bank', icon: 'bank', label: 'Bank' }
];

const AddExpenseScreen = ({ navigation, route }) => {
    const { addExpense, updateExpense, categories } = useContext(ExpenseContext);
    const existingExpense = route.params?.expense;

    const [title, setTitle] = useState(existingExpense?.title || '');
    const [amount, setAmount] = useState(existingExpense?.amount?.toString() || '');
    const [category, setCategory] = useState(existingExpense?.category || categories[0]);
    const [date, setDate] = useState(existingExpense?.date || new Date().toISOString().split('T')[0]);
    const [paymentMode, setPaymentMode] = useState(existingExpense?.paymentMode || PAYMENT_MODES[0].id);
    const [notes, setNotes] = useState(existingExpense?.notes || '');

    const handleSave = () => {
        if (!title.trim() || title.length < 3) {
            Alert.alert('Invalid Title', 'Expense title must be at least 3 characters long.');
            return;
        }

        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0.');
            return;
        }

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) {
            Alert.alert('Invalid Date', 'Date must be in YYYY-MM-DD format.');
            return;
        }

        const expenseData = {
            title: title.trim(),
            amount: numericAmount,
            category,
            date,
            paymentMode,
            notes: notes.trim(),
        };

        if (existingExpense) {
            updateExpense({ ...existingExpense, ...expenseData });
            Alert.alert('Success', 'Expense updated successfully!');
        } else {
            addExpense(expenseData);
        }
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{existingExpense ? 'Edit Expense' : 'Add Expense'}</Text>
                <TouchableOpacity style={styles.saveHeaderBtn} onPress={handleSave}>
                    <Ionicons name="checkmark" size={24} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Title Input */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>
                        <MaterialCommunityIcons name="format-title" size={16} color={COLORS.textSecondary} /> Expense Title*
                    </Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. 50 bags Cement"
                            placeholderTextColor={COLORS.textMuted}
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>
                </View>

                {/* Amount and Date Row */}
                <View style={styles.row}>
                    <View style={[styles.formGroup, { flex: 0.6 }]}>
                        <Text style={styles.label}>
                            <MaterialCommunityIcons name="currency-inr" size={16} color={COLORS.textSecondary} /> Amount*
                        </Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="0"
                                placeholderTextColor={COLORS.textMuted}
                                keyboardType="numeric"
                                value={amount}
                                onChangeText={setAmount}
                            />
                        </View>
                    </View>
                    <View style={[styles.formGroup, { flex: 0.35 }]}>
                        <Text style={styles.label}>
                            <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} /> Date*
                        </Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={date}
                                onChangeText={setDate}
                                placeholder="YYYY-MM-DD"
                                placeholderTextColor={COLORS.textMuted}
                            />
                        </View>
                    </View>
                </View>

                {/* Category Selection */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>
                        <MaterialCommunityIcons name="tag-multiple" size={16} color={COLORS.textSecondary} /> Category*
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                        {categories.map((cat) => (
                            <TouchableOpacity
                                key={cat}
                                style={[
                                    styles.chip,
                                    category === cat && styles.chipSelected,
                                ]}
                                onPress={() => setCategory(cat)}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.chipText, category === cat && styles.chipTextSelected]}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Payment Mode */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>
                        <MaterialCommunityIcons name="credit-card-outline" size={16} color={COLORS.textSecondary} /> Payment Mode
                    </Text>
                    <View style={styles.paymentContainer}>
                        {PAYMENT_MODES.map((mode) => (
                            <TouchableOpacity
                                key={mode.id}
                                style={[
                                    styles.paymentChip,
                                    paymentMode === mode.id && styles.paymentChipSelected,
                                ]}
                                onPress={() => setPaymentMode(mode.id)}
                                activeOpacity={0.7}
                            >
                                <MaterialCommunityIcons
                                    name={mode.icon}
                                    size={20}
                                    color={paymentMode === mode.id ? COLORS.background : COLORS.textSecondary}
                                />
                                <Text style={[styles.paymentText, paymentMode === mode.id && styles.paymentTextSelected]}>
                                    {mode.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Notes */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>
                        <MaterialCommunityIcons name="note-text-outline" size={16} color={COLORS.textSecondary} /> Notes (Optional)
                    </Text>
                    <View style={[styles.inputContainer, styles.textAreaContainer]}>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Add some details..."
                            placeholderTextColor={COLORS.textMuted}
                            multiline
                            numberOfLines={4}
                            value={notes}
                            onChangeText={setNotes}
                            textAlignVertical="top"
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8}>
                    <MaterialCommunityIcons name="content-save" size={24} color={COLORS.background} />
                    <Text style={styles.saveButtonText}>
                        {existingExpense ? 'Update Expense' : 'Add Expense'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.m,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        backgroundColor: COLORS.surface,
    },
    backButton: {
        padding: SPACING.s,
    },
    headerTitle: {
        fontSize: SIZES.h4,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    saveHeaderBtn: {
        padding: SPACING.s,
    },
    scrollContent: {
        padding: SPACING.m,
        paddingBottom: 40,
    },
    formGroup: {
        marginBottom: SPACING.l,
    },
    label: {
        fontSize: SIZES.small,
        color: COLORS.textSecondary,
        marginBottom: SPACING.s,
        fontWeight: '600',
    },
    inputContainer: {
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radiusMedium,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    input: {
        color: COLORS.text,
        fontSize: SIZES.body,
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.m,
    },
    textAreaContainer: {
        minHeight: 100,
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: SPACING.m,
    },
    categoryScroll: {
        marginTop: SPACING.s,
    },
    chip: {
        backgroundColor: COLORS.surface,
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.s,
        borderRadius: SIZES.radiusLarge,
        marginRight: SPACING.s,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    chipSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    chipText: {
        color: COLORS.text,
        fontSize: SIZES.small,
        fontWeight: '600',
    },
    chipTextSelected: {
        color: COLORS.background,
    },
    paymentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: SPACING.s,
    },
    paymentChip: {
        flex: 1,
        backgroundColor: COLORS.surface,
        paddingVertical: SPACING.m,
        borderRadius: SIZES.radiusMedium,
        marginHorizontal: 4,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    paymentChipSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    paymentText: {
        color: COLORS.textSecondary,
        fontSize: SIZES.small,
        fontWeight: '600',
        marginTop: 4,
    },
    paymentTextSelected: {
        color: COLORS.background,
    },
    saveButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.m,
        borderRadius: SIZES.radiusMedium,
        alignItems: 'center',
        marginTop: SPACING.l,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: SPACING.s,
    },
    saveButtonText: {
        color: COLORS.background,
        fontSize: SIZES.body,
        fontWeight: 'bold',
    },
});

export default AddExpenseScreen;
