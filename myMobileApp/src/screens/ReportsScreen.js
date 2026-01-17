import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ExpenseContext } from '../context/ExpenseContext';
import { COLORS, SPACING, SIZES } from '../constants/theme';

const ReportsScreen = ({ navigation }) => {
    const { expenses, totalSpent } = useContext(ExpenseContext);

    const formattedCurrency = (amount) =>
        '₹ ' + parseFloat(amount).toLocaleString('en-IN', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });

    // Calculate category summary
    const categorySummary = expenses.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
    }, {});

    const sortedCategories = Object.entries(categorySummary).sort((a, b) => b[1] - a[1]);

    // Highest expense
    const highestExpense = expenses.length > 0
        ? expenses.reduce((prev, current) => (prev.amount > current.amount) ? prev : current)
        : null;

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

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Spending Reports</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.totalCard}>
                    <MaterialCommunityIcons name="chart-pie" size={48} color={COLORS.primary} />
                    <Text style={styles.totalLabel}>TOTAL SPENT</Text>
                    <Text style={styles.totalValue}>{formattedCurrency(totalSpent)}</Text>
                    <Text style={styles.totalSubtext}>{expenses.length} transactions</Text>
                </View>

                <Text style={styles.sectionTitle}>
                    <MaterialCommunityIcons name="chart-bar" size={20} color={COLORS.text} /> Category Breakdown
                </Text>
                <View style={styles.card}>
                    {sortedCategories.length > 0 ? (
                        sortedCategories.map(([cat, amount]) => (
                            <View key={cat} style={styles.reportRow}>
                                <View style={styles.categoryHeader}>
                                    <View style={styles.categoryInfo}>
                                        <MaterialCommunityIcons
                                            name={getCategoryIcon(cat)}
                                            size={24}
                                            color={COLORS.primary}
                                        />
                                        <View style={styles.categoryTextContainer}>
                                            <Text style={styles.catName}>{cat}</Text>
                                            <Text style={styles.percentText}>
                                                {((amount / totalSpent) * 100).toFixed(1)}% of total
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={styles.catAmount}>{formattedCurrency(amount)}</Text>
                                </View>
                                <View style={styles.barBg}>
                                    <View style={[styles.barFill, { width: `${(amount / (sortedCategories[0][1])) * 100}%` }]} />
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <MaterialCommunityIcons name="chart-box-outline" size={64} color={COLORS.textSecondary} />
                            <Text style={styles.emptyText}>No data yet</Text>
                            <Text style={styles.emptySubtext}>Add expenses to see reports</Text>
                        </View>
                    )}
                </View>

                {highestExpense && (
                    <>
                        <Text style={styles.sectionTitle}>
                            <MaterialCommunityIcons name="trophy" size={20} color={COLORS.text} /> Highlights
                        </Text>
                        <View style={styles.highlightCard}>
                            <View style={styles.highlightHeader}>
                                <MaterialCommunityIcons name="arrow-up-bold" size={32} color={COLORS.primary} />
                                <View style={styles.highlightInfo}>
                                    <Text style={styles.highlightLabel}>HIGHEST EXPENSE</Text>
                                    <Text style={styles.highlightTitle}>{highestExpense.title}</Text>
                                </View>
                            </View>
                            <Text style={styles.highlightAmount}>{formattedCurrency(highestExpense.amount)}</Text>
                            <View style={styles.highlightMeta}>
                                <View style={styles.metaItem}>
                                    <MaterialCommunityIcons name="tag" size={16} color={COLORS.textSecondary} />
                                    <Text style={styles.metaText}>{highestExpense.category}</Text>
                                </View>
                                <View style={styles.metaItem}>
                                    <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
                                    <Text style={styles.metaText}>{new Date(highestExpense.date).toLocaleDateString()}</Text>
                                </View>
                            </View>
                        </View>
                    </>
                )}
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
    totalCard: {
        backgroundColor: COLORS.surface,
        padding: SPACING.xl,
        borderRadius: SIZES.radiusLarge,
        alignItems: 'center',
        marginBottom: SPACING.l,
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    totalLabel: {
        color: COLORS.textSecondary,
        fontSize: SIZES.tiny,
        marginTop: SPACING.m,
        marginBottom: 4,
        fontWeight: '600',
        letterSpacing: 1,
    },
    totalValue: {
        color: COLORS.primary,
        fontSize: SIZES.h1,
        fontWeight: 'bold',
    },
    totalSubtext: {
        color: COLORS.textSecondary,
        fontSize: SIZES.small,
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: SIZES.h4,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.m,
        marginTop: SPACING.s,
    },
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radiusLarge,
        padding: SPACING.m,
        marginBottom: SPACING.l,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    reportRow: {
        marginBottom: SPACING.l,
    },
    categoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.s,
    },
    categoryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    categoryTextContainer: {
        marginLeft: SPACING.m,
        flex: 1,
    },
    catName: {
        fontSize: SIZES.body,
        fontWeight: '600',
        color: COLORS.text,
    },
    percentText: {
        fontSize: SIZES.tiny,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    catAmount: {
        fontSize: SIZES.body,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    barBg: {
        height: 8,
        backgroundColor: COLORS.surfaceLight,
        borderRadius: 4,
    },
    barFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: 4,
    },
    highlightCard: {
        backgroundColor: COLORS.surface,
        padding: SPACING.l,
        borderRadius: SIZES.radiusLarge,
        borderWidth: 1,
        borderColor: COLORS.primary,
        marginBottom: SPACING.xl,
    },
    highlightHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.m,
    },
    highlightInfo: {
        marginLeft: SPACING.m,
        flex: 1,
    },
    highlightLabel: {
        fontSize: SIZES.tiny,
        color: COLORS.textSecondary,
        fontWeight: 'bold',
        marginBottom: 4,
        letterSpacing: 1,
    },
    highlightTitle: {
        fontSize: SIZES.h4,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    highlightAmount: {
        fontSize: SIZES.h2,
        fontWeight: '900',
        color: COLORS.primary,
        marginBottom: SPACING.m,
    },
    highlightMeta: {
        flexDirection: 'row',
        gap: SPACING.l,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: SIZES.small,
        color: COLORS.textSecondary,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: SPACING.xxl,
    },
    emptyText: {
        fontSize: SIZES.body,
        fontWeight: '600',
        color: COLORS.text,
        marginTop: SPACING.m,
    },
    emptySubtext: {
        fontSize: SIZES.small,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
});

export default ReportsScreen;
