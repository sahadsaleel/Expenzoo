import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ExpenseContext } from '../context/ExpenseContext';
import { COLORS, SPACING, SIZES } from '../constants/theme';

const AllExpensesScreen = ({ navigation }) => {
    const { expenses, deleteExpense, categories } = useContext(ExpenseContext);
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredExpenses = selectedCategory === 'All'
        ? expenses
        : expenses.filter(expense => expense.category === selectedCategory);

    const formattedCurrency = (amount) =>
        '₹ ' + parseFloat(amount).toLocaleString('en-IN', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });

    const handleDelete = (id) => {
        Alert.alert(
            'Delete Expense',
            'Are you sure you want to delete this expense?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deleteExpense(id) },
            ]
        );
    };

    const getCategoryIcon = (category) => {
        const iconMap = {
            'Cement': 'package-variant',
            'Steel': 'iron',
            'Sand': 'texture-box',
            'Bricks': 'wall',
            'Labour': 'account-hard-hat',
            'Electrical': 'lightning-bolt',
            'Plumbing': 'pipe',
            'Painting': 'format-paint',
        };
        return iconMap[category] || 'hammer-wrench';
    };

    const renderExpenseItem = ({ item }) => (
        <TouchableOpacity
            style={styles.expenseItem}
            onPress={() => navigation.navigate('ExpenseDetails', { expense: item })}
            activeOpacity={0.7}
        >
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                    name={getCategoryIcon(item.category)}
                    size={24}
                    color={COLORS.primary}
                />
            </View>
            <View style={styles.expenseInfo}>
                <Text style={styles.expenseTitle}>{item.title}</Text>
                <View style={styles.metaRow}>
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{item.category}</Text>
                    </View>
                    <Text style={styles.dateText}>
                        <Ionicons name="calendar-outline" size={12} color={COLORS.textSecondary} /> {new Date(item.date).toLocaleDateString()}
                    </Text>
                </View>
                <Text style={styles.paymentMode}>
                    <MaterialCommunityIcons name="credit-card-outline" size={12} color={COLORS.textSecondary} /> {item.paymentMode}
                </Text>
            </View>
            <View style={styles.rightSection}>
                <Text style={styles.expenseAmount}>{formattedCurrency(item.amount)}</Text>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                    <Ionicons name="trash-outline" size={20} color={COLORS.error} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    const EmptyList = () => (
        <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={80} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No expenses yet</Text>
            <Text style={styles.emptySubtext}>Start tracking your construction costs</Text>
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddExpense')}
                activeOpacity={0.8}
            >
                <Ionicons name="add-circle" size={24} color={COLORS.background} />
                <Text style={styles.addButtonText}>Add First Expense</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>All Expenses</Text>
                <View style={styles.placeholder} />
            </View>

            <View style={styles.filterWrapper}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterContainer}
                >
                    <TouchableOpacity
                        style={[
                            styles.filterChip,
                            selectedCategory === 'All' && styles.filterChipActive
                        ]}
                        onPress={() => setSelectedCategory('All')}
                    >
                        <Text style={[
                            styles.filterText,
                            selectedCategory === 'All' && styles.filterTextActive
                        ]}>All</Text>
                    </TouchableOpacity>
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            style={[
                                styles.filterChip,
                                selectedCategory === cat && styles.filterChipActive
                            ]}
                            onPress={() => setSelectedCategory(cat)}
                        >
                            <Text style={[
                                styles.filterText,
                                selectedCategory === cat && styles.filterTextActive
                            ]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={filteredExpenses}
                keyExtractor={(item) => item.id}
                renderItem={renderExpenseItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={EmptyList}
                showsVerticalScrollIndicator={false}
            />
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
    placeholder: {
        width: 40,
    },
    listContent: {
        padding: SPACING.m,
        flexGrow: 1,
    },
    filterWrapper: {
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    filterContainer: {
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.s,
        gap: SPACING.s,
    },
    filterChip: {
        paddingHorizontal: SPACING.m,
        paddingVertical: 6,
        borderRadius: SIZES.radiusLarge,
        backgroundColor: COLORS.surfaceLight,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    filterChipActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    filterText: {
        color: COLORS.textSecondary,
        fontSize: SIZES.small,
        fontWeight: '600',
    },
    filterTextActive: {
        color: COLORS.background,
    },
    expenseItem: {
        backgroundColor: COLORS.surface,
        padding: SPACING.m,
        borderRadius: SIZES.radiusMedium,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.m,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.m,
    },
    expenseInfo: {
        flex: 1,
    },
    expenseTitle: {
        fontSize: SIZES.body,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 4,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    categoryBadge: {
        backgroundColor: COLORS.surfaceLight,
        paddingHorizontal: SPACING.s,
        paddingVertical: 2,
        borderRadius: SIZES.radiusSmall,
        marginRight: SPACING.s,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    categoryText: {
        fontSize: SIZES.tiny,
        color: COLORS.primary,
        fontWeight: '600',
    },
    dateText: {
        fontSize: SIZES.tiny,
        color: COLORS.textSecondary,
    },
    paymentMode: {
        fontSize: SIZES.tiny,
        color: COLORS.textSecondary,
    },
    rightSection: {
        alignItems: 'flex-end',
    },
    expenseAmount: {
        fontSize: SIZES.h4,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: SPACING.s,
    },
    deleteButton: {
        padding: SPACING.s,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: SPACING.xxl * 2,
    },
    emptyText: {
        fontSize: SIZES.h4,
        fontWeight: 'bold',
        color: COLORS.text,
        marginTop: SPACING.l,
    },
    emptySubtext: {
        fontSize: SIZES.small,
        color: COLORS.textSecondary,
        marginTop: SPACING.s,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.l,
        paddingVertical: SPACING.m,
        borderRadius: SIZES.radiusMedium,
        marginTop: SPACING.l,
        gap: SPACING.s,
    },
    addButtonText: {
        color: COLORS.background,
        fontSize: SIZES.body,
        fontWeight: 'bold',
    },
});

export default AllExpensesScreen;
