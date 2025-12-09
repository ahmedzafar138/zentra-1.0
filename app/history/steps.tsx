import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Trash2 } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import DayProgressBar from '@/components/DayProgressBar';
import { supabase } from '@/lib/supabase';

export default function StepsHistoryScreen() {
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadStepsHistory();
  }, []);

  const loadStepsHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const currentMonth = new Date().toISOString().slice(0, 7);
      const { data, error } = await supabase
        .from('user_steps_history')
        .select('*')
        .eq('user_id', user.id)
        .eq('month', currentMonth)
        .maybeSingle();

      if (error) throw error;
      setHistoryData(data?.daily_data || []);
    } catch (error) {
      console.error('Error loading steps history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete History',
      'Are you sure you want to delete this month\'s step history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { data: { user } } = await supabase.auth.getUser();
              if (!user) return;

              const currentMonth = new Date().toISOString().slice(0, 7);
              const { error } = await supabase
                .from('user_steps_history')
                .delete()
                .eq('user_id', user.id)
                .eq('month', currentMonth);

              if (error) throw error;
              loadStepsHistory();
            } catch (error) {
              console.error('Error deleting steps history:', error);
            }
          },
        },
      ]
    );
  };

  const getDayData = () => {
    const daysInMonth = new Date().getDate();
    const days = [];

    for (let i = 1; i <= Math.min(daysInMonth, 30); i++) {
      const dayData = historyData.find((d: any) => {
        const date = new Date(d.date);
        return date.getDate() === i;
      });

      const steps = dayData?.steps || 0;
      const goal = dayData?.goal || 8000;
      const completion = Math.min((steps / goal) * 100, 100);

      days.push({
        date: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
        completionPercent: completion,
        label: String(i),
      });
    }

    return days;
  };

  const getTotalStats = () => {
    const totalSteps = historyData.reduce((sum: number, day: any) => sum + (day.steps || 0), 0);
    const totalDistance = historyData.reduce((sum: number, day: any) => sum + (day.distance_km || 0), 0);
    const totalKcal = historyData.reduce((sum: number, day: any) => sum + (day.kcal || 0), 0);

    return { totalSteps, totalDistance, totalKcal };
  };

  const stats = getTotalStats();

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
          <Text style={styles.headerTitle}>Steps History</Text>
          {historyData.length > 0 && (
            <TouchableOpacity onPress={handleDelete}>
              <Trash2 size={20} color={theme.colors.primaryDark} />
            </TouchableOpacity>
          )}
          {historyData.length === 0 && <View style={{ width: 24 }} />}
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <DayProgressBar days={getDayData()} />

          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Monthly Summary</Text>

            {loading ? (
              <Text style={styles.emptyText}>Loading...</Text>
            ) : historyData.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No step history yet</Text>
                <Text style={styles.emptySubtext}>Start tracking your steps to see them here</Text>
              </View>
            ) : (
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{stats.totalSteps.toLocaleString()}</Text>
                  <Text style={styles.statLabel}>Total Steps</Text>
                </View>

                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{stats.totalDistance.toFixed(1)}</Text>
                  <Text style={styles.statLabel}>Kilometers</Text>
                </View>

                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{Math.round(stats.totalKcal)}</Text>
                  <Text style={styles.statLabel}>Calories</Text>
                </View>
              </View>
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
  statsContainer: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.white,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: 20,
    alignItems: 'center',
  },
  statValue: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.secondary,
    textAlign: 'center',
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
