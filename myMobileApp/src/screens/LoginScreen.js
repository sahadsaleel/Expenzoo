import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS, SPACING, SIZES } from '../constants/theme';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
    const { requestOtp, verifyOtp, authLoading } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: Email, 2: OTP
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async () => {
        if (!email) {
            setError('Please enter your email address');
            return;
        }
        setError(null);
        setLoading(true);
        const result = await requestOtp(email);
        setLoading(false);

        if (result.success) {
            setStep(2);
        } else {
            setError(result.error);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }
        setError(null);
        setLoading(true);
        const result = await verifyOtp(email, otp);
        setLoading(false);

        if (!result.success) {
            setError(result.error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <MaterialCommunityIcons name="hammer-wrench" size={60} color={COLORS.primary} />
                        </View>
                        <Text style={styles.title}>Welcome to Expenzoo</Text>
                        <Text style={styles.subtitle}>
                            {step === 1 ? 'Enter your email to continue' : 'Enter the code sent to your email'}
                        </Text>
                    </View>

                    <View style={styles.form}>
                        {error && (
                            <View style={styles.errorContainer}>
                                <Ionicons name="alert-circle" size={20} color={COLORS.error} />
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        )}

                        {step === 1 ? (
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Email Address</Text>
                                <View style={styles.inputWrapper}>
                                    <MaterialCommunityIcons name="email-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="your@email.com"
                                        placeholderTextColor={COLORS.textMuted}
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        editable={!loading}
                                    />
                                </View>
                            </View>
                        ) : (
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>One-Time Password (OTP)</Text>
                                <View style={styles.inputWrapper}>
                                    <MaterialCommunityIcons name="lock-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="123456"
                                        placeholderTextColor={COLORS.textMuted}
                                        value={otp}
                                        onChangeText={setOtp}
                                        keyboardType="number-pad"
                                        maxLength={6}
                                        editable={!loading}
                                    />
                                </View>
                                <TouchableOpacity onPress={() => setStep(1)} style={{ marginTop: 10 }}>
                                    <Text style={{ color: COLORS.primary, textAlign: 'right' }}>Change Email</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={step === 1 ? handleSendOtp : handleVerifyOtp}
                            activeOpacity={0.8}
                            disabled={loading || authLoading}
                        >
                            {loading || authLoading ? (
                                <ActivityIndicator color={COLORS.background} />
                            ) : (
                                <Text style={styles.loginButtonText}>
                                    {step === 1 ? 'Send OTP' : 'Verify & Login'}
                                </Text>
                            )}
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: SPACING.l,
        paddingBottom: SPACING.xl,
    },
    header: {
        alignItems: 'center',
        marginTop: SPACING.xxl,
        marginBottom: SPACING.xl,
    },
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.m,
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    title: {
        fontSize: SIZES.h1,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.s,
    },
    subtitle: {
        fontSize: SIZES.body,
        color: COLORS.textSecondary,
    },
    form: {
        flex: 1,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
        padding: SPACING.m,
        borderRadius: SIZES.radiusMedium,
        marginBottom: SPACING.m,
        borderWidth: 1,
        borderColor: COLORS.error,
    },
    errorText: {
        color: COLORS.error,
        marginLeft: SPACING.s,
        fontSize: SIZES.small,
        fontWeight: '600',
    },
    inputContainer: {
        marginBottom: SPACING.m,
    },
    label: {
        fontSize: SIZES.small,
        fontWeight: '600',
        color: COLORS.textSecondary,
        marginBottom: SPACING.s,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radiusMedium,
        paddingHorizontal: SPACING.m,
        height: 56,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    inputIcon: {
        marginRight: SPACING.s,
    },
    input: {
        flex: 1,
        color: COLORS.text,
        fontSize: SIZES.body,
    },
    loginButton: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: SIZES.radiusMedium,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: SPACING.l,
    },
    loginButtonText: {
        color: COLORS.background,
        fontSize: SIZES.h4,
        fontWeight: 'bold',
    },
});

export default LoginScreen;
