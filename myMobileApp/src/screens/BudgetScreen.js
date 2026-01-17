import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ExpenseContext } from '../context/ExpenseContext';
import { COLORS, SPACING, SIZES } from '../constants/theme';

const BudgetScreen = ({ navigation }) => {
    const { budget, setBudget, totalSpent } = useContext(ExpenseContext);
    const [tempBudget, setTempBudget] = useState(budget.toString());

    const handleSaveBudget = () => {
        const value = parseFloat(tempBudget);
        if (isNaN(value) || value <= 0) {
            Alert.alert('Invalid Input', 'Please enter a valid budget amount');
            return;
        }
        setBudget(value);
        Alert.alert('Success', 'Construction budget updated successfully!');
    };

    const formattedCurrency = (amount) =>
        '₹ ' + parseFloat(amount).toLocaleString('en-IN', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });

    const remaining = budget - totalSpent;
    const percentUsed = (totalSpent / budget) * 100;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Budget Management</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.card}>
                    <MaterialCommunityIcons name="wallet-outline" size={48} color={COLORS.primary} />
                    <Text style={styles.cardLabel}>SET CONSTRUCTION BUDGET</Text>
                    <View style={styles.inputRow}>
                        <Text style={styles.currencySymbol}>₹</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={tempBudget}
                            onChangeText={setTempBudget}
                            placeholder="Enter total budget"
                            placeholderTextColor={COLORS.textMuted}
                        />
                    </View>
                    <TouchableOpacity style={styles.saveBtn} onPress={handleSaveBudget} activeOpacity={0.8}>
                        <Ionicons name="checkmark-circle" size={24} color={COLORS.background} />
                        <Text style={styles.saveBtnText}>Update Budget</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>
                    <MaterialCommunityIcons name="chart-donut" size={20} color={COLORS.text} /> Budget Overview
                </Text>
                <View style={styles.overviewCard}>
                    <View style={styles.statRow}>
                        <View style={styles.statItem}>
                            <MaterialCommunityIcons name="cash-multiple" size={32} color={COLORS.primary} />
                            <Text style={styles.statLabel}>Total Budget</Text>
                            <Text style={styles.statValue}>{formattedCurrency(budget)}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statItem}>
                            <MaterialCommunityIcons name="cash-minus" size={32} color={COLORS.error} />
                            <Text style={styles.statLabel}>Total Spent</Text>
                            <Text style={[styles.statValue, { color: COLORS.error }]}>{formattedCurrency(totalSpent)}</Text>
                        </View>
                    </View>

                    <View style={styles.progressSection}>
                        <View style={styles.progressHeader}>
                            <Text style={styles.progressLabel}>Budget Utilization</Text>
                            <Text style={styles.progressPercent}>{percentUsed.toFixed(1)}%</Text>
                        </View>
                        <View style={styles.barBg}>
                            <View
                                style={[
                                    styles.barFill,
                                    {
                                        width: `${Math.min(percentUsed, 100)}%`,
                                        backgroundColor: percentUsed > 90 ? COLORS.error : percentUsed > 70 ? COLORS.warning : COLORS.primary
                                    }
                                ]}
                            />
                        </View>
                    </View>

                    <View style={[styles.remainingCard, {
                        backgroundColor: remaining >= 0 ? COLORS.surfaceLight : COLORS.surface,
                        borderColor: remaining >= 0 ? COLORS.primary : COLORS.error
                    }]}>
                        <MaterialCommunityIcons
                            name={remaining >= 0 ? "check-circle" : "alert-circle"}
                            size={32}
                            color={remaining >= 0 ? COLORS.primary : COLORS.error}
                        />
                        <Text style={styles.remainingLabel}>{remaining >= 0 ? 'REMAINING BALANCE' : 'BUDGET OVERRUN'}</Text>
                        <Text style={[styles.remainingValue, { color: remaining >= 0 ? COLORS.primary : COLORS.error }]}>
                            {formattedCurrency(Math.abs(remaining))}
                        </Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>
                    <MaterialCommunityIcons name="heart-pulse" size={20} color={COLORS.text} /> Budget Health
                </Text>
                <View style={[styles.healthCard, { borderColor: percentUsed > 90 ? COLORS.error : percentUsed > 70 ? COLORS.warning : COLORS.primary }]}>
                    <View style={styles.healthHeader}>
                        <Text style={[styles.healthStatus, {
                            color: percentUsed > 90 ? COLORS.error : percentUsed > 70 ? COLORS.warning : COLORS.primary
                        }]}>
                            {percentUsed > 90 ? '🛑 CRITICAL' : percentUsed > 70 ? '⚠️ WARNING' : '✅ HEALTHY'}
                        </Text>
                    </View>
                    <Text style={styles.healthDetail}>
                        You have used {percentUsed.toFixed(1)}% of your total budget.
                        {remaining > 0 ? ` You can still spend ${formattedCurrency(remaining)} before hitting your limit.` : ' You are over budget! Review your construction plans.'}
                    </Text>
                </View>

                <View style={styles.tipsCard}>
                    <MaterialCommunityIcons name="lightbulb-on-outline" size={32} color={COLORS.warning} />
                    <Text style={styles.tipsTitle}>Budget Tips</Text>
                    <Text style={styles.tipsText}>• Keep a 10% contingency fund for unexpected material price hikes</Text>
                    <Text style={styles.tipsText}>• Track small expenses like nails and tools, they add up quickly</Text>
                    <Text style={styles.tipsText}>• Review your budget weekly to stay on track</Text>
                </View>
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
    placeholder: {
        width: 40,
    },
    scrollContent: {
        padding: SPACING.m,
    },
    card: {
        backgroundColor: COLORS.surface,
        padding: SPACING.xl,
        borderRadius: SIZES.radiusLarge,
        marginBottom: SPACING.l,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
    },
    cardLabel: {
        fontSize: SIZES.tiny,
        color: COLORS.textSecondary,
        marginTop: SPACING.m,
        marginBottom: SPACING.m,
        fontWeight: '600',
        letterSpacing: 1,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: COLORS.primary,
        marginBottom: SPACING.l,
        width: '100%',
    },
    currencySymbol: {
        fontSize: SIZES.h2,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginRight: SPACING.m,
    },
    input: {
        flex: 1,
        fontSize: SIZES.h2,
        fontWeight: 'bold',
        color: COLORS.text,
        paddingVertical: SPACING.m,
    },
    saveBtn: {
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.m,
        paddingHorizontal: SPACING.l,
        borderRadius: SIZES.radiusMedium,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.s,
    },
    saveBtnText: {
        color: COLORS.background,
        fontSize: SIZES.body,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: SIZES.h4,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.m,
    },
    overviewCard: {
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radiusLarge,
        padding: SPACING.l,
        marginBottom: SPACING.l,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: SPACING.l,
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: SIZES.tiny,
        color: COLORS.textSecondary,
        marginTop: SPACING.s,
        marginBottom: 4,
        textAlign: 'center',
    },
    statValue: {
        fontSize: SIZES.h4,
        fontWeight: 'bold',
        color: COLORS.primary,
        textAlign: 'center',
    },
    divider: {
        width: 1,
        height: 60,
        backgroundColor: COLORS.border,
    },
    progressSection: {
        marginBottom: SPACING.l,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.s,
    },
    progressLabel: {
        fontSize: SIZES.small,
        color: COLORS.text,
    },
    progressPercent: {
        fontSize: SIZES.small,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    barBg: {
        height: 10,
        backgroundColor: COLORS.surfaceLight,
        borderRadius: 5,
    },
    barFill: {
        height: '100%',
        borderRadius: 5,
    },
    remainingCard: {
        padding: SPACING.l,
        borderRadius: SIZES.radiusMedium,
        alignItems: 'center',
        borderWidth: 2,
    },
    remainingLabel: {
        fontSize: SIZES.tiny,
        fontWeight: 'bold',
        marginTop: SPACING.s,
        marginBottom: 4,
        letterSpacing: 1,
        color: COLORS.textSecondary,
    },
    remainingValue: {
        fontSize: SIZES.h2,
        fontWeight: '900',
    },
    healthCard: {
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radiusLarge,
        padding: SPACING.l,
        marginBottom: SPACING.l,
        borderWidth: 2,
    },
    healthHeader: {
        marginBottom: SPACING.m,
    },
    healthStatus: {
        fontSize: SIZES.h4,
        fontWeight: 'bold',
    },
    healthDetail: {
        fontSize: SIZES.small,
        color: COLORS.text,
        lineHeight: 20,
    },
    tipsCard: {
        backgroundColor: COLORS.surface,
        padding: SPACING.l,
        borderRadius: SIZES.radiusLarge,
        marginBottom: SPACING.xxl,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
    },
    tipsTitle: {
        fontSize: SIZES.h4,
        fontWeight: 'bold',
        color: COLORS.text,
        marginTop: SPACING.m,
        marginBottom: SPACING.m,
    },
    tipsText: {
        fontSize: SIZES.small,
        color: COLORS.textSecondary,
        lineHeight: 22,
        marginBottom: 4,
        alignSelf: 'flex-start',
    },
});

export default BudgetScreen;
