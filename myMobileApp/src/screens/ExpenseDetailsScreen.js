import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS, SPACING, SIZES } from '../constants/theme';

const ExpenseDetailsScreen = ({ route, navigation }) => {
    const { expense } = route.params || {};

    if (!expense) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>Expense not found</Text>
            </SafeAreaView>
        );
    }

    const formattedCurrency = (amount) =>
        '₹ ' + parseFloat(amount).toLocaleString('en-IN', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });

    const InfoRow = ({ icon, label, value, isAmount }) => (
        <View style={styles.infoRow}>
            <View style={styles.labelContainer}>
                <MaterialCommunityIcons name={icon} size={20} color={COLORS.textSecondary} />
                <Text style={styles.label}>{label}</Text>
            </View>
            <Text style={[styles.value, isAmount && styles.amountValue]}>{value}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Expense Details</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('AddExpense', { expense })}
                    style={styles.editButton}
                >
                    <Ionicons name="create-outline" size={24} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.titleCard}>
                    <MaterialCommunityIcons name="hammer-wrench" size={48} color={COLORS.primary} />
                    <Text style={styles.title}>{expense.title}</Text>
                    <Text style={styles.amountLarge}>{formattedCurrency(expense.amount)}</Text>
                </View>

                <View style={styles.card}>
                    <InfoRow icon="tag-multiple" label="Category" value={expense.category} />
                    <InfoRow icon="calendar" label="Date" value={new Date(expense.date).toLocaleDateString()} />
                    <InfoRow icon="credit-card-outline" label="Payment Mode" value={expense.paymentMode} />

                    {expense.notes ? (
                        <View style={styles.notesSection}>
                            <View style={styles.labelContainer}>
                                <MaterialCommunityIcons name="note-text-outline" size={20} color={COLORS.textSecondary} />
                                <Text style={styles.label}>Notes</Text>
                            </View>
                            <View style={styles.notesContainer}>
                                <Text style={styles.notesText}>{expense.notes}</Text>
                            </View>
                        </View>
                    ) : null}
                </View>

                <TouchableOpacity
                    style={styles.editButtonLarge}
                    onPress={() => navigation.navigate('AddExpense', { expense })}
                    activeOpacity={0.8}
                >
                    <Ionicons name="create-outline" size={24} color={COLORS.background} />
                    <Text style={styles.editButtonText}>Edit Expense</Text>
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
    editButton: {
        padding: SPACING.s,
    },
    headerTitle: {
        fontSize: SIZES.h4,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    scrollContent: {
        padding: SPACING.m,
    },
    titleCard: {
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radiusLarge,
        padding: SPACING.xl,
        alignItems: 'center',
        marginBottom: SPACING.l,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    title: {
        fontSize: SIZES.h3,
        fontWeight: 'bold',
        color: COLORS.text,
        textAlign: 'center',
        marginTop: SPACING.m,
        marginBottom: SPACING.s,
    },
    amountLarge: {
        fontSize: SIZES.h1,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radiusLarge,
        padding: SPACING.l,
        marginBottom: SPACING.l,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.m,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.s,
    },
    label: {
        fontSize: SIZES.small,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    value: {
        fontSize: SIZES.body,
        color: COLORS.text,
        fontWeight: '500',
    },
    amountValue: {
        fontSize: SIZES.h4,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    notesSection: {
        marginTop: SPACING.m,
        paddingTop: SPACING.m,
    },
    notesContainer: {
        backgroundColor: COLORS.surfaceLight,
        padding: SPACING.m,
        borderRadius: SIZES.radiusMedium,
        marginTop: SPACING.s,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    notesText: {
        fontSize: SIZES.small,
        color: COLORS.text,
        lineHeight: 20,
    },
    editButtonLarge: {
        backgroundColor: COLORS.primary,
        padding: SPACING.m,
        borderRadius: SIZES.radiusMedium,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: SPACING.s,
    },
    editButtonText: {
        color: COLORS.background,
        fontSize: SIZES.body,
        fontWeight: 'bold',
    },
    errorText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: SIZES.h4,
        color: COLORS.error,
    },
});

export default ExpenseDetailsScreen;
