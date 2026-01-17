import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { ExpenseContext } from '../context/ExpenseContext';
import { COLORS, SPACING, SIZES } from '../constants/theme';

const SettingItem = ({ title, subtitle, iconName, iconType = 'MaterialCommunityIcons', onPress, isDestructive }) => {
    const IconComponent = iconType === 'Ionicons' ? Ionicons : MaterialCommunityIcons;

    return (
        <TouchableOpacity
            style={styles.settingItem}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.settingIconContainer}>
                <IconComponent name={iconName} size={24} color={isDestructive ? COLORS.error : COLORS.primary} />
            </View>
            <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, isDestructive && { color: COLORS.error }]}>{title}</Text>
                {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
    );
};

const SettingsScreen = ({ navigation }) => {
    const { resetData, expenses, budget, categories, restoreAllData } = useContext(ExpenseContext);

    const handleExport = async () => {
        if (expenses.length === 0) {
            Alert.alert('No Data', 'You have no expenses to export.');
            return;
        }

        try {
            // 1. Convert data to CSV string
            const header = 'Date,Category,Title,Amount,Description\n';
            const rows = expenses.map(item => {
                const date = new Date(item.date).toLocaleDateString();
                const category = `"${item.category}"`; // Wrap in quotes to handle commas
                const title = `"${item.title}"`;
                const amount = item.amount;
                const description = `"${item.description || ''}"`;
                return `${date},${category},${title},${amount},${description}`;
            }).join('\n');

            const csvData = header + rows;

            // 2. Define file path
            const filename = `expenzoo_data_${new Date().getTime()}.csv`;
            const fileUri = FileSystem.documentDirectory + filename;

            // 3. Write data to file
            await FileSystem.writeAsStringAsync(fileUri, csvData, {
                encoding: 'utf8',
            });

            // 4. Share file
            const isAvailable = await Sharing.isAvailableAsync();
            if (isAvailable) {
                await Sharing.shareAsync(fileUri, {
                    mimeType: 'text/csv',
                    dialogTitle: 'Export Expenzoo Data',
                    UTI: 'public.comma-separated-values-text'
                });
            } else {
                Alert.alert('Error', 'Sharing is not available on this device');
            }

        } catch (error) {
            console.error('Export Error:', error);
            Alert.alert('Export Failed', 'An error occurred while exporting data.');
        }
    };

    const handleBackup = async () => {
        try {
            // 1. Create Backup Object
            const backupData = {
                version: '1.0.0',
                timestamp: new Date().toISOString(),
                budget,
                categories,
                expenses,
            };

            const jsonData = JSON.stringify(backupData, null, 2);

            // 2. Create File
            const filename = `expenzoo_backup_${new Date().getTime()}.json`;
            const fileUri = FileSystem.documentDirectory + filename;

            await FileSystem.writeAsStringAsync(fileUri, jsonData, {
                encoding: 'utf8',
            });

            // 3. Share File
            const isAvailable = await Sharing.isAvailableAsync();
            if (isAvailable) {
                await Sharing.shareAsync(fileUri, {
                    mimeType: 'application/json',
                    dialogTitle: 'Backup Expenzoo Data',
                    UTI: 'public.json'
                });
            } else {
                Alert.alert('Error', 'Sharing not available');
            }
        } catch (error) {
            console.error('Backup Error:', error);
            Alert.alert('Backup Failed', 'Could not create backup file.');
        }
    };

    const handleRestore = async () => {
        try {
            // 1. Pick File
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/json',
                copyToCacheDirectory: true,
            });

            if (result.canceled) return;

            const fileUri = result.assets[0].uri;

            // 2. Read File
            const fileContent = await FileSystem.readAsStringAsync(fileUri, {
                encoding: 'utf8',
            });

            // 3. Parse Data
            const backupData = JSON.parse(fileContent);

            // 4. Confirm Restore
            Alert.alert(
                'Restore Data',
                `Found backup from ${new Date(backupData.timestamp || Date.now()).toLocaleDateString()}.\n\nWARNING: This will replace ALL your current data.`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Restore Now',
                        style: 'destructive',
                        onPress: async () => {
                            try {
                                const restoreResult = await restoreAllData(backupData);
                                if (restoreResult.success) {
                                    Alert.alert('Success', 'Data restored successfully!');
                                } else {
                                    Alert.alert('Error', restoreResult.error || 'Restore failed');
                                }
                            } catch (err) {
                                Alert.alert('Error', 'An unexpected error occurred during restore.');
                                console.error(err);
                            }
                        }
                    }
                ]
            );

        } catch (error) {
            console.error('Restore Error:', error);
            Alert.alert('Restore Failed', 'Invalid backup file or permission error.');
        }
    };

    const handleResetData = () => {
        Alert.alert(
            'Reset All Data',
            'Are you sure you want to delete ALL construction expenses and settings? This cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset Everything',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await resetData();
                            Alert.alert('Success', 'All construction data has been cleared.');
                        } catch (error) {
                            Alert.alert('Error', 'Could not clear data. Please try again.');
                        }
                    }
                },
            ]
        );
    };

    const comingSoon = (feature) => {
        Alert.alert('Coming Soon', `${feature} will be available in the next update!`);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>
                    <MaterialCommunityIcons name="cog" size={16} color={COLORS.textSecondary} /> PREFERENCES
                </Text>
                <View style={styles.group}>
                    <SettingItem
                        title="Currency"
                        subtitle="Indian Rupee (₹)"
                        iconName="currency-inr"
                        onPress={() => Alert.alert('Currency', 'Only Indian Rupee (₹) is supported for Expenzoo.')}
                    />
                    <SettingItem
                        title="Language"
                        subtitle="English"
                        iconName="translate"
                        onPress={() => comingSoon('Language selection')}
                    />
                    <SettingItem
                        title="Theme"
                        subtitle="Black & Green"
                        iconName="palette"
                        onPress={() => Alert.alert('Theme', 'You are using the Black & Green theme.')}
                    />
                </View>

                <Text style={styles.sectionTitle}>
                    <MaterialCommunityIcons name="database" size={16} color={COLORS.textSecondary} /> DATA MANAGEMENT
                </Text>
                <View style={styles.group}>
                    <SettingItem
                        title="Export Data"
                        subtitle="Download as CSV"
                        iconName="download"
                        iconType="Ionicons"
                        onPress={handleExport}
                    />
                    <SettingItem
                        title="Backup Data"
                        subtitle="Save a backup file"
                        iconName="cloud-upload"
                        iconType="Ionicons"
                        onPress={handleBackup}
                    />
                    <SettingItem
                        title="Restore Data"
                        subtitle="Import from backup file"
                        iconName="cloud-download"
                        iconType="Ionicons"
                        onPress={handleRestore}
                    />
                    <SettingItem
                        title="Reset All Data"
                        subtitle="Careful: This clears everything"
                        iconName="trash"
                        iconType="Ionicons"
                        onPress={handleResetData}
                        isDestructive
                    />
                </View>

                <Text style={styles.sectionTitle}>
                    <MaterialCommunityIcons name="help-circle" size={16} color={COLORS.textSecondary} /> SUPPORT
                </Text>
                <View style={styles.group}>
                    <SettingItem
                        title="Help Center"
                        subtitle="Construction tracking tips"
                        iconName="help-circle-outline"
                        iconType="Ionicons"
                        onPress={() => comingSoon('Help Center')}
                    />
                    <SettingItem
                        title="Report a Bug"
                        subtitle="Let us know about issues"
                        iconName="bug"
                        iconType="Ionicons"
                        onPress={() => Alert.alert('Bug Report', 'Please contact support@expenzoo.com')}
                    />
                    <SettingItem
                        title="Rate App"
                        subtitle="Share your feedback"
                        iconName="star"
                        iconType="Ionicons"
                        onPress={() => comingSoon('App Rating')}
                    />
                </View>

                <Text style={styles.sectionTitle}>
                    <MaterialCommunityIcons name="information" size={16} color={COLORS.textSecondary} /> ABOUT
                </Text>
                <View style={styles.group}>
                    <SettingItem
                        title="App Version"
                        subtitle="1.0.0 (Offline Mode)"
                        iconName="information-circle"
                        iconType="Ionicons"
                        onPress={() => Alert.alert('Expenzoo v1.0', 'Built with ❤️ for Civil Engineers and Home Owners.')}
                    />
                    <SettingItem
                        title="Privacy Policy"
                        iconName="shield-checkmark"
                        iconType="Ionicons"
                        onPress={() => comingSoon('Privacy Policy')}
                    />
                    <SettingItem
                        title="Terms of Service"
                        iconName="document-text"
                        iconType="Ionicons"
                        onPress={() => comingSoon('Terms of Service')}
                    />
                </View>

                <View style={styles.footer}>
                    <MaterialCommunityIcons name="hammer-wrench" size={32} color={COLORS.primary} />
                    <Text style={styles.footerText}>Expenzoo</Text>
                    <Text style={styles.footerSub}>Built for Builders</Text>
                    <Text style={styles.footerVersion}>v1.0.0</Text>
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
        paddingBottom: SPACING.xxl,
    },
    sectionTitle: {
        fontSize: SIZES.tiny,
        fontWeight: 'bold',
        color: COLORS.textSecondary,
        marginBottom: SPACING.m,
        marginTop: SPACING.l,
        letterSpacing: 1,
    },
    group: {
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radiusLarge,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.m,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    settingIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.m,
    },
    settingInfo: {
        flex: 1,
    },
    settingTitle: {
        fontSize: SIZES.body,
        fontWeight: '600',
        color: COLORS.text,
    },
    settingSubtitle: {
        fontSize: SIZES.small,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    footer: {
        alignItems: 'center',
        marginTop: SPACING.xxl,
        marginBottom: SPACING.l,
    },
    footerText: {
        fontSize: SIZES.h3,
        color: COLORS.primary,
        fontWeight: 'bold',
        marginTop: SPACING.m,
    },
    footerSub: {
        fontSize: SIZES.small,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    footerVersion: {
        fontSize: SIZES.tiny,
        color: COLORS.textMuted,
        marginTop: SPACING.s,
    },
});

export default SettingsScreen;
