import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Trash2 } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import DayProgressBar from '@/components/DayProgressBar';
import { supabase } from '@/lib/supabase';

export default function MealsHistoryScreen() {
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadMealHistory();
  }, []);

  const loadMealHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_meal_history')
        .select('*')
        .eq('user_id', user.id)
        .order('week_start_date', { ascending: false });

      if (error) throw error;
      setHistoryData(data || []);
    } catch (error) {
      console.error('Error loading meal history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Delete Meal Plan',
      'Are you sure you want to delete this meal plan?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('user_meal_history')
                .delete()
                .eq('id', id);

              if (error) throw error;
              loadMealHistory();
            } catch (error) {
              console.error('Error deleting meal plan:', error);
            }
          },
        },
      ]
    );
  };

  const getDayData = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));

      const weekStart = new Date(date);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekStartStr = weekStart.toISOString().split('T')[0];

      const hasData = historyData.some((meal) => meal.week_start_date === weekStartStr);

      days.push({
        date: date.toISOString().split('T')[0],
        completionPercent: hasData ? 100 : 0,
        label: ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()],
      });
    }

    return days;
  };

  return (
    <LinearGradient
      colors={[theme.colors.background, '#0A0A0A']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={24} color={theme.colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meal History</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <DayProgressBar days={getDayData()} />

          <View style={styles.mealsContainer}>
            <Text style={styles.sectionTitle}>Saved Meal Plans</Text>

            {loading ? (
              <Text style={styles.emptyText}>Loading...</Text>
            ) : historyData.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No saved meal plans yet</Text>
                <Text style={styles.emptySubtext}>Generate and save meal plans to see them here</Text>
              </View>
            ) : (
              historyData.map((meal) => {
                const mealData = typeof meal.meal_plan_data === 'string'
                  ? JSON.parse(meal.meal_plan_data)
                  : meal.meal_plan_data;
                const weekStart = new Date(meal.week_start_date);

                return (
                  <View key={meal.id} style={styles.mealCard}>
                    <View style={styles.mealHeader}>
                      <View style={styles.mealInfo}>
                        <Text style={styles.weekLabel}>
                          Week of {weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </Text>
                        {mealData?.culinary_preference && (
                          <Text style={styles.preference}>{mealData.culinary_preference}</Text>
                        )}
                      </View>
                      <TouchableOpacity onPress={() => handleDelete(meal.id)}>
                        <Trash2 size={20} color={theme.colors.primaryDark} />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.dateText}>
                      {new Date(meal.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Text>
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
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
    paddingBottom: 24,
  },
  mealsContainer: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.white,
    marginBottom: 16,
  },
  mealCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: 16,
    marginBottom: 12,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  mealInfo: {
    flex: 1,
  },
  weekLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.white,
    marginBottom: 4,
  },
  preference: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    textTransform: 'capitalize',
  },
  dateText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.secondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.secondary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.inactive,
    textAlign: 'center',
  },
});
