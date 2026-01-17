import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ExpenseContext } from '../context/ExpenseContext';
import { COLORS, SPACING, SIZES } from '../constants/theme';

const CategoriesScreen = ({ navigation }) => {
    const { categories, addCategory, deleteCategory, updateCategory } = useContext(ExpenseContext);
    const [newCategory, setNewCategory] = useState('');

    const [editingCategory, setEditingCategory] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleAdd = () => {
        const trimmed = newCategory.trim();
        if (!trimmed) {
            Alert.alert('Error', 'Please enter a category name');
            return;
        }
        if (categories.includes(trimmed)) {
            Alert.alert('Duplicate', 'This category already exists.');
            return;
        }
        addCategory(trimmed);
        setNewCategory('');
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setEditValue(category);
        setIsModalVisible(true);
    };

    const saveEdit = () => {
        const trimmed = editValue.trim();
        if (!trimmed) {
            Alert.alert('Error', 'Category name cannot be empty');
            return;
        }
        if (categories.includes(trimmed) && trimmed !== editingCategory) {
            Alert.alert('Duplicate', 'This category name already exists.');
            return;
        }

        if (updateCategory) {
            updateCategory(editingCategory, trimmed);
        }

        setIsModalVisible(false);
        setEditingCategory(null);
    };

    const handleDelete = (category) => {
        const protectedCategories = ['Cement', 'Steel', 'Sand', 'Bricks', 'Labour'];
        if (protectedCategories.includes(category)) {
            Alert.alert('Protected', 'Standard construction categories cannot be deleted.');
            return;
        }

        Alert.alert(
            'Delete Category',
            `Are you sure you want to delete "${category}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deleteCategory(category) },
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
        return iconMap[category] || 'tag';
    };

    const renderItem = ({ item }) => (
        <View style={styles.categoryItem}>
            <View style={styles.categoryLeft}>
                <View style={styles.iconContainer}>
                    <MaterialCommunityIcons name={getCategoryIcon(item)} size={24} color={COLORS.primary} />
                </View>
                <Text style={styles.categoryName}>{item}</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionBtn}>
                    <Ionicons name="create-outline" size={20} color={COLORS.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item)} style={[styles.actionBtn, { marginLeft: SPACING.m }]}>
                    <Ionicons name="trash-outline" size={20} color={COLORS.error} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Manage Categories</Text>
                <View style={styles.placeholder} />
            </View>

            <View style={styles.addSection}>
                <View style={styles.inputContainer}>
                    <MaterialCommunityIcons name="tag-plus" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="New Category (e.g. Glass)"
                        placeholderTextColor={COLORS.textMuted}
                        value={newCategory}
                        onChangeText={setNewCategory}
                        autoCapitalize="words"
                    />
                </View>
                <TouchableOpacity style={styles.addBtn} onPress={handleAdd} activeOpacity={0.8}>
                    <Ionicons name="add-circle" size={24} color={COLORS.background} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={categories}
                keyExtractor={(item) => item}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <Text style={styles.sectionTitle}>
                        <MaterialCommunityIcons name="tag-multiple" size={16} color={COLORS.textSecondary} /> EXISTING CATEGORIES
                    </Text>
                }
                showsVerticalScrollIndicator={false}
            />

            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <MaterialCommunityIcons name="tag-edit" size={48} color={COLORS.primary} />
                        <Text style={styles.modalTitle}>Edit Category</Text>
                        <View style={styles.modalInputContainer}>
                            <TextInput
                                style={styles.modalInput}
                                value={editValue}
                                onChangeText={setEditValue}
                                autoFocus
                                autoCapitalize="words"
                                placeholderTextColor={COLORS.textMuted}
                            />
                        </View>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.cancelBtn]}
                                onPress={() => setIsModalVisible(false)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.saveBtn]}
                                onPress={saveEdit}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.saveBtnText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    addSection: {
        flexDirection: 'row',
        padding: SPACING.m,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        alignItems: 'center',
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surfaceLight,
        borderRadius: SIZES.radiusMedium,
        paddingHorizontal: SPACING.m,
        marginRight: SPACING.m,
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
        paddingVertical: SPACING.m,
    },
    addBtn: {
        backgroundColor: COLORS.primary,
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: SPACING.m,
    },
    sectionTitle: {
        fontSize: SIZES.tiny,
        fontWeight: 'bold',
        color: COLORS.textSecondary,
        marginBottom: SPACING.m,
        letterSpacing: 1,
    },
    categoryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: SPACING.m,
        borderRadius: SIZES.radiusMedium,
        marginBottom: SPACING.m,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    categoryLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.m,
    },
    categoryName: {
        fontSize: SIZES.body,
        color: COLORS.text,
        fontWeight: '600',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionBtn: {
        padding: SPACING.s,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radiusLarge,
        padding: SPACING.xl,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    modalTitle: {
        fontSize: SIZES.h3,
        fontWeight: 'bold',
        color: COLORS.text,
        marginTop: SPACING.m,
        marginBottom: SPACING.l,
    },
    modalInputContainer: {
        width: '100%',
        backgroundColor: COLORS.surfaceLight,
        borderRadius: SIZES.radiusMedium,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: SPACING.l,
    },
    modalInput: {
        color: COLORS.text,
        fontSize: SIZES.body,
        padding: SPACING.m,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: SPACING.m,
    },
    modalBtn: {
        flex: 1,
        paddingVertical: SPACING.m,
        borderRadius: SIZES.radiusMedium,
        alignItems: 'center',
    },
    cancelBtn: {
        backgroundColor: COLORS.surfaceLight,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    saveBtn: {
        backgroundColor: COLORS.primary,
    },
    cancelBtnText: {
        color: COLORS.text,
        fontWeight: 'bold',
        fontSize: SIZES.body,
    },
    saveBtnText: {
        color: COLORS.background,
        fontWeight: 'bold',
        fontSize: SIZES.body,
    },
});

export default CategoriesScreen;
