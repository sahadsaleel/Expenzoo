import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ExpenseContext } from '../context/ExpenseContext';
import { COLORS, SPACING, SIZES } from '../constants/theme';

const HomeScreen = ({ navigation }) => {
    const { totalSpent, budget, thisMonthExpense, expenses, deleteExpense } = useContext(ExpenseContext);

    const formattedCurrency = (amount) =>
        '₹ ' + parseFloat(amount).toLocaleString('en-IN', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });

    const recentExpenses = expenses.slice(0, 5);

    const handleDeleteExpense = (id) => {
        Alert.alert(
            'Delete Expense',
            'Are you sure you want to delete this expense?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deleteExpense(id) },
            ]
        );
    };

    const renderExpenseItem = (item) => (
        <TouchableOpacity
            key={item.id}
            style={styles.expenseItem}
            onPress={() => navigation.navigate('ExpenseDetails', { expense: item })}
            activeOpacity={0.7}
        >
            <View style={styles.expenseIconContainer}>
                <MaterialCommunityIcons name="hammer-wrench" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.expenseInfo}>
                <Text style={styles.expenseTitle}>{item.title}</Text>
                <Text style={styles.expenseCategory}>{item.category} • {new Date(item.date).toLocaleDateString()}</Text>
            </View>
            <View style={styles.rightSection}>
                <Text style={styles.expenseAmount}>{formattedCurrency(item.amount)}</Text>
                <TouchableOpacity onPress={() => handleDeleteExpense(item.id)} style={styles.deleteButton}>
                    <Ionicons name="trash-outline" size={20} color={COLORS.error} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    const QuickAction = ({ title, iconName, iconType = 'MaterialCommunityIcons', onPress }) => {
        const IconComponent = iconType === 'Ionicons' ? Ionicons : MaterialCommunityIcons;
        return (
            <TouchableOpacity style={styles.actionBtn} onPress={onPress} activeOpacity={0.7}>
                <View style={styles.actionIconContainer}>
                    <IconComponent name={iconName} size={28} color={COLORS.primary} />
                </View>
                <Text style={styles.actionText}>{title}</Text>
            </TouchableOpacity>
        );
    };

    const remaining = budget - totalSpent;
    const percentUsed = (totalSpent / budget) * 100;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.welcomeText}>Construction Tracker</Text>
                        <Text style={styles.appName}>Expenzoo</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.settingsBtn}>
                        <Ionicons name="settings-outline" size={24} color={COLORS.text} />
                    </TouchableOpacity>
                </View>

                {/* Dashboard Summary */}
                <View style={styles.summaryContainer}>
                    <View style={styles.mainCard}>
                        <View style={styles.mainCardHeader}>
                            <View>
                                <Text style={styles.mainCardLabel}>TOTAL BUDGET</Text>
                                <Text style={styles.mainCardValue}>{formattedCurrency(budget)}</Text>
                            </View>
                            <MaterialCommunityIcons name="wallet-outline" size={32} color="rgba(255,255,255,0.3)" />
                        </View>

                        <View style={styles.progressBarBg}>
                            <View style={[styles.progressBarFill, {
                                width: `${Math.min(percentUsed, 100)}%`,
                                backgroundColor: percentUsed > 90 ? COLORS.error : COLORS.primary
                            }]} />
                        </View>

                        <View style={styles.mainCardFooter}>
                            <View>
                                <Text style={styles.footerLabel}>TOTAL SPENT</Text>
                                <Text style={styles.footerValue}>{formattedCurrency(totalSpent)}</Text>
                            </View>
                            <View style={styles.cardDivider} />
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={styles.footerLabel}>REMAINING</Text>
                                <Text style={[styles.footerValue, { color: remaining < 0 ? COLORS.error : COLORS.primary }]}>
                                    {formattedCurrency(Math.abs(remaining))}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.smallCard}>
                            <MaterialCommunityIcons name="chart-line" size={24} color={COLORS.primary} />
                            <Text style={styles.smallCardLabel}>Status</Text>
                            <Text style={[styles.smallCardValue, { color: totalSpent > budget ? COLORS.error : COLORS.primary }]}>
                                {totalSpent > budget ? 'Over Budget' : 'On Track'}
                            </Text>
                        </View>
                        <View style={styles.smallCard}>
                            <MaterialCommunityIcons name="calendar-month" size={24} color={COLORS.primary} />
                            <Text style={styles.smallCardLabel}>This Month</Text>
                            <Text style={styles.smallCardValue}>{formattedCurrency(thisMonthExpense)}</Text>
                        </View>
                    </View>
                </View>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionsGrid}>
                    <QuickAction title="Add Expense" iconName="add-circle" iconType="Ionicons" onPress={() => navigation.navigate('AddExpense')} />
                    <QuickAction title="Reports" iconName="chart-bar" onPress={() => navigation.navigate('Reports')} />
                    <QuickAction title="Budget" iconName="cash-multiple" onPress={() => navigation.navigate('Budget')} />
                    <QuickAction title="Categories" iconName="tag-multiple" onPress={() => navigation.navigate('Categories')} />
                </View>

                {/* Recent Expenses */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Expenses</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('AllExpenses')}>
                        <Text style={styles.seeAll}>View All</Text>
                    </TouchableOpacity>
                </View>

                {recentExpenses.length > 0 ? (
                    recentExpenses.map(item => renderExpenseItem(item))
                ) : (
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="clipboard-text-outline" size={64} color={COLORS.textSecondary} />
                        <Text style={styles.emptyText}>No expenses yet</Text>
                        <Text style={styles.emptySubtext}>Start tracking your construction costs</Text>
                    </View>
                )}
            </ScrollView>

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddExpense')}
                activeOpacity={0.8}
            >
                <Ionicons name="add" size={32} color={COLORS.background} />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        padding: SPACING.m,
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.l,
    },
    welcomeText: {
        fontSize: SIZES.small,
        color: COLORS.textSecondary,
        letterSpacing: 1,
    },
    appName: {
        fontSize: SIZES.h1,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    settingsBtn: {
        padding: SPACING.s,
    },
    summaryContainer: {
        marginBottom: SPACING.l,
    },
    mainCard: {
        backgroundColor: COLORS.surface,
        padding: SPACING.l,
        borderRadius: SIZES.radiusLarge,
        marginBottom: SPACING.m,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    mainCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.m,
    },
    mainCardLabel: {
        color: COLORS.textSecondary,
        fontSize: SIZES.tiny,
        fontWeight: '600',
        marginBottom: 4,
        letterSpacing: 1,
    },
    mainCardValue: {
        color: COLORS.text,
        fontSize: SIZES.h1,
        fontWeight: 'bold',
    },
    progressBarBg: {
        height: 8,
        backgroundColor: COLORS.surfaceLight,
        borderRadius: 4,
        marginBottom: SPACING.l,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    mainCardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: SPACING.m,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    footerLabel: {
        color: COLORS.textSecondary,
        fontSize: SIZES.tiny,
        fontWeight: 'bold',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    footerValue: {
        color: COLORS.text,
        fontSize: SIZES.body,
        fontWeight: 'bold',
    },
    cardDivider: {
        width: 1,
        height: 30,
        backgroundColor: COLORS.border,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    smallCard: {
        flex: 0.48,
        backgroundColor: COLORS.surface,
        padding: SPACING.m,
        borderRadius: SIZES.radiusMedium,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    smallCardLabel: {
        fontSize: SIZES.tiny,
        color: COLORS.textSecondary,
        marginTop: 4,
        marginBottom: 2,
    },
    smallCardValue: {
        fontSize: SIZES.body,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    sectionTitle: {
        fontSize: SIZES.h4,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.m,
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: SPACING.l,
    },
    actionBtn: {
        width: '23%',
        backgroundColor: COLORS.surface,
        padding: SPACING.m,
        borderRadius: SIZES.radiusMedium,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    actionIconContainer: {
        marginBottom: 4,
    },
    actionText: {
        fontSize: SIZES.tiny,
        fontWeight: '600',
        color: COLORS.text,
        textAlign: 'center',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.m,
    },
    seeAll: {
        color: COLORS.primary,
        fontSize: SIZES.small,
        fontWeight: '600',
    },
    expenseItem: {
        backgroundColor: COLORS.surface,
        padding: SPACING.m,
        borderRadius: SIZES.radiusMedium,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.s,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    expenseIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
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
        marginBottom: 2,
    },
    expenseCategory: {
        fontSize: SIZES.tiny,
        color: COLORS.textSecondary,
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    expenseAmount: {
        fontSize: SIZES.body,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginRight: SPACING.m,
    },
    deleteButton: {
        padding: SPACING.s,
    },
    emptyContainer: {
        padding: SPACING.xxl,
        alignItems: 'center',
    },
    emptyText: {
        color: COLORS.text,
        fontSize: SIZES.body,
        fontWeight: '600',
        marginTop: SPACING.m,
    },
    emptySubtext: {
        color: COLORS.textSecondary,
        fontSize: SIZES.small,
        marginTop: 4,
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: COLORS.primary,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
    },
});

export default HomeScreen;
