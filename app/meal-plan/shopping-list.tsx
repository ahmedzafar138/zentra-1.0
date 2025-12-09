import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import PrimaryButton from '@/components/PrimaryButton';
import * as Clipboard from 'expo-clipboard';

const shoppingList = {
  'Vegetables & Herbs': [
    { name: 'Tomatoes', qty: '4 pcs' },
    { name: 'Onions', qty: '2 pcs' },
    { name: 'Bell Peppers', qty: '3 pcs' },
  ],
  'Dairy': [
    { name: 'Eggs', qty: '12 pcs' },
    { name: 'Milk', qty: '1 liter' },
    { name: 'Cheese', qty: '200g' },
  ],
  'Protein': [
    { name: 'Chicken Breast', qty: '1 kg' },
    { name: 'Salmon Fillet', qty: '500g' },
  ],
  'Grains': [
    { name: 'Brown Rice', qty: '1 kg' },
    { name: 'Whole Wheat Bread', qty: '1 loaf' },
  ],
};

export default function ShoppingListScreen() {
  const router = useRouter();
  const [checkedItems, setCheckedItems] = React.useState({});

  const toggleCheck = (category, idx) => {
    const key = `${category}-${idx}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleCopy = async () => {
    // Build the text of the entire shopping list
    let listText = '';
    Object.entries(shoppingList).forEach(([category, items]) => {
      listText += `${category}:\n`;
      items.forEach(item => {
        listText += `- ${item.name} (${item.qty})\n`;
      });
      listText += '\n';
    });

    // Copy to clipboard
    await Clipboard.setStringAsync(listText);

    // Show success alert
    Alert.alert('Success', 'Shopping list copied to clipboard');
  };

  return (
    <LinearGradient
      colors={[theme.colors.background, '#0A0A0A']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={24} color={theme.colors.white} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Shopping List</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* CONTENT */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {Object.entries(shoppingList).map(([category, items], index) => (
            <View key={index} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>{category}</Text>

              {items.map((item, idx) => {
                const key = `${category}-${idx}`;
                const isChecked = checkedItems[key];

                return (
                  <TouchableOpacity
                    key={idx}
                    style={styles.itemRow}
                    onPress={() => toggleCheck(category, idx)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        isChecked && styles.checkboxChecked
                      ]}
                    >
                      {isChecked && <Text style={styles.checkmark}>✓</Text>}
                    </View>

                    <View style={styles.itemContent}>
                      <Text
                        style={[
                          styles.itemName,
                          isChecked && {
                            textDecorationLine: 'line-through',
                            opacity: 0.6,
                          },
                        ]}
                      >
                        {item.name}
                      </Text>

                      <Text
                        style={[
                          styles.itemQty,
                          isChecked && { opacity: 0.6 },
                        ]}
                      >
                        {item.qty}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}

          <PrimaryButton
            title="Copy Entire Shopping List"
            onPress={handleCopy}
            style={styles.button}
          />
        </ScrollView>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },

  headerTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.white,
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },

  categorySection: { marginBottom: 24 },

  categoryTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 12,
  },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: 16,
    marginBottom: 8,
    gap: 12,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: theme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },

  checkmark: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: -1,
  },

  itemContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  itemName: {
    fontSize: theme.fontSize.md,
    color: theme.colors.white,
    fontWeight: '500',
  },

  itemQty: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.secondary,
  },

  button: {
    marginTop: 16,
    marginBottom: 16,
  },
});
