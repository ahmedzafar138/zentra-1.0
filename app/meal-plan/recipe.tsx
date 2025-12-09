import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft } from 'lucide-react-native';
import { theme } from '@/constants/theme';

const recipes = {
  B: {
    title: 'Egg Omelette With Chai',
    ingredients: [
      '2 large eggs',
      '1/4 cup milk',
      '1/2 cup cheese, shredded',
      '1 tablespoon butter',
      'Salt and pepper to taste',
      '1 cup of chai tea',
    ],
    steps: [
      'Beat eggs and milk together in a bowl',
      'Heat butter in a pan over medium heat',
      'Pour egg mixture into pan',
      'Add cheese when eggs begin to set',
      'Fold omelette and cook until done',
      'Serve hot with chai tea',
    ],
  },

  L: {
    title: 'Chicken Breast with Rice',
    ingredients: [
      '200g chicken breast',
      '1 cup cooked rice',
      'Salt & pepper',
      '1 tbsp olive oil',
      'Mixed herbs',
    ],
    steps: [
      'Season chicken with salt, pepper, herbs',
      'Cook in pan with olive oil',
      'Serve with cooked rice',
    ],
  },

  D: {
    title: 'Grilled Salmon with Vegetables',
    ingredients: [
      '1 salmon fillet',
      '1 cup mixed vegetables',
      'Olive oil',
      'Salt & pepper',
    ],
    steps: [
      'Season salmon',
      'Grill for 5–6 minutes',
      'Stir fry vegetables',
      'Serve together',
    ],
  },

  S: {
    title: 'Greek Yogurt with Berries',
    ingredients: [
      '1 cup Greek yogurt',
      '1/2 cup fresh berries',
      'Honey (optional)',
    ],
    steps: [
      'Add berries to yogurt',
      'Drizzle honey on top',
      'Serve chilled',
    ],
  },
};

const chipLabels = {
  B: 'Breakfast',
  L: 'Lunch',
  D: 'Dinner',
  S: 'Snacks',
};

export default function RecipeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const defaultMeal = (params.meal as string) || 'B';

  const [selectedMeal, setSelectedMeal] = useState(defaultMeal);

  const recipe = recipes[selectedMeal];

  return (
    <LinearGradient colors={[theme.colors.background, '#0A0A0A']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={24} color={theme.colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Recipe</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.filterChips}>
            {Object.keys(chipLabels).map((key) => (
              <TouchableOpacity
                key={key}
                style={[styles.chip, selectedMeal === key && styles.chipActive]}
                onPress={() => setSelectedMeal(key)}
              >
                <Text style={[styles.chipText, selectedMeal === key && styles.chipTextActive]}>
                  {chipLabels[key]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.recipeTitle}>{recipe.title}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {recipe.ingredients.map((item, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>{item}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Steps</Text>
            {recipe.steps.map((step, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.stepNumber}>{index + 1}.</Text>
                <Text style={styles.listText}>{step}</Text>
              </View>
            ))}
          </View>
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

  filterChips: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },

  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.card,
  },

  chipActive: { backgroundColor: theme.colors.primary },

  chipText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.secondary,
    fontWeight: '500',
  },

  chipTextActive: { color: theme.colors.white },

  recipeTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.white,
    marginBottom: 24,
  },

  section: { marginBottom: 24 },

  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.white,
    marginBottom: 16,
  },

  listItem: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingRight: 8,
  },

  bullet: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    marginRight: 12,
    width: 20,
  },

  stepNumber: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    fontWeight: '600',
    marginRight: 12,
    width: 20,
  },

  listText: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.secondary,
    lineHeight: 22,
  },
});
