import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import PrimaryButton from '@/components/PrimaryButton';

const weekDays = ['Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday'];
const mealTypes = ['B', 'L', 'D', 'S'];

const meals = {
  B: 'Egg Omelette With Chai',
  L: 'Chicken Breast with Rice',
  D: 'Grilled Salmon with Vegetables',
  S: 'Greek Yogurt with Berries',
};

export default function WeeklyMealPlanScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={[theme.colors.background, '#0A0A0A']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={24} color={theme.colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Weekly Meal Plan</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.subtitle}>This is what you need for the entire week.</Text>

          {weekDays.map((day, index) => (
            <View key={index} style={styles.dayCard}>
              <Text style={styles.dayTitle}>{day}</Text>

              <View style={styles.mealsRow}>
                {mealTypes.map((type, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.mealChip}
                    onPress={() =>
                      router.push(`/meal-plan/recipe?meal=${type}&day=${day}`)
                    }
                  >
                    <Text style={styles.mealType}>{type}</Text>
                    <Text style={styles.mealName} numberOfLines={1}>
                      {meals[type]}
                    </Text>
                    <ChevronRight size={16} color={theme.colors.secondary} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          <PrimaryButton
            title="Generate Shopping List"
            onPress={() => router.push('/meal-plan/shopping-list')}
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
  subtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.secondary,
    marginBottom: 20,
  },
  dayCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: 16,
    marginBottom: 12,
  },
  dayTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.white,
    marginBottom: 12,
  },
  mealsRow: { gap: 8 },
  mealChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    padding: 12, gap: 8,
  },
  mealType: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.primary,
    width: 20,
  },
  mealName: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.white,
  },
  button: { marginTop: 16 },
});
