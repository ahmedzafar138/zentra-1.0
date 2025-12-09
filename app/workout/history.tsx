import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, TrendingUp, Award, CheckSquare, ChevronDown } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import PrimaryButton from '@/components/PrimaryButton';

const { width } = Dimensions.get('window');

type TabType = 'summary' | 'byExercise' | 'calendar';

type WorkoutHistoryData = {
  date: string;
  exercise: string;
  topSet: number;
  reps: number;
  volume: number;
};

const summaryMetrics = [
  {
    icon: TrendingUp,
    label: 'Total Volume',
    value: '12,560',
    unit: 'kg',
    subtext: 'Total weight lifted this month',
  },
  {
    icon: Award,
    label: 'Max Weight',
    value: '80',
    unit: 'kg',
    subtext: 'Highest recorded lift',
  },
  {
    icon: CheckSquare,
    label: 'Total Sets',
    value: '156',
    unit: '',
    subtext: 'All sessions combined',
  },
];

const chartData = [
  { day: 'Mon', volume: 2400 },
  { day: 'Tue', volume: 3200 },
  { day: 'Wed', volume: 2800 },
  { day: 'Thu', volume: 3600 },
  { day: 'Fri', volume: 3100 },
  { day: 'Sat', volume: 4200 },
  { day: 'Sun', volume: 2900 },
];

const exerciseHistory: WorkoutHistoryData[] = [
  { date: '18 Aug', exercise: 'Bench Press', topSet: 80, reps: 8, volume: 1920 },
  { date: '16 Aug', exercise: 'Bench Press', topSet: 77.5, reps: 9, volume: 1845 },
  { date: '14 Aug', exercise: 'Bench Press', topSet: 75, reps: 10, volume: 1800 },
  { date: '12 Aug', exercise: 'Bench Press', topSet: 75, reps: 9, volume: 1755 },
];

const calendarDays = Array.from({ length: 31 }, (_, i) => ({
  day: i + 1,
  intensity: Math.random(),
}));

export default function WorkoutHistoryScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [selectedExercise, setSelectedExercise] = useState('Bench Press');
  const router = useRouter();

  const maxVolume = Math.max(...chartData.map((d) => d.volume));

  const getIntensityColor = (intensity: number) => {
    if (intensity < 0.25) return 'rgba(255, 106, 0, 0.2)';
    if (intensity < 0.5) return 'rgba(255, 106, 0, 0.4)';
    if (intensity < 0.75) return 'rgba(255, 106, 0, 0.6)';
    return theme.colors.primary;
  };

  const renderSummaryTab = () => (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.metricsContainer}
      >
        {summaryMetrics.map((metric, index) => (
          <View key={index} style={styles.metricCard}>
            <View style={styles.metricIconContainer}>
              <metric.icon size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.metricContent}>
              <Text style={styles.metricValue}>
                {metric.value}
                {metric.unit && <Text style={styles.metricUnit}> {metric.unit}</Text>}
              </Text>
              <Text style={styles.metricLabel}>{metric.label}</Text>
              <Text style={styles.metricSubtext}>{metric.subtext}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>Training Volume Over Time</Text>
        <View style={styles.chart}>
          <View style={styles.chartBars}>
            {chartData.map((data, index) => (
              <View key={index} style={styles.chartBarContainer}>
                <View style={styles.chartBarWrapper}>
                  <View
                    style={[
                      styles.chartBar,
                      { height: `${(data.volume / maxVolume) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.chartLabel}>{data.day}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );

  const renderByExerciseTab = () => (
    <View>
      <View style={styles.exerciseSelector}>
        <TouchableOpacity style={styles.exerciseDropdown}>
          <Text style={styles.exerciseDropdownText}>{selectedExercise}</Text>
          <ChevronDown size={20} color={theme.colors.secondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>DATE</Text>
          <Text style={[styles.tableHeaderText, { flex: 1 }]}>TOP SET</Text>
          <Text style={[styles.tableHeaderText, { flex: 1 }]}>REPS</Text>
          <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>VOLUME</Text>
        </View>

        {exerciseHistory.map((record, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tableRow,
              index % 2 === 0 && styles.tableRowAlt,
            ]}
          >
            <Text style={[styles.tableCell, { flex: 1.5 }]}>{record.date}</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>{record.topSet} kg</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>{record.reps}</Text>
            <Text style={[styles.tableCell, { flex: 1.5, color: theme.colors.primary }]}>
              {record.volume} kg
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderCalendarTab = () => (
    <View style={styles.calendarContainer}>
      <Text style={styles.sectionTitle}>August 2025</Text>
      <View style={styles.calendarGrid}>
        {calendarDays.map((day) => (
          <TouchableOpacity
            key={day.day}
            style={[
              styles.calendarDay,
              { backgroundColor: getIntensityColor(day.intensity) },
            ]}
          >
            <Text style={styles.calendarDayText}>{day.day}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.calendarLegend}>
        <Text style={styles.legendText}>Less</Text>
        <View style={styles.legendDots}>
          <View style={[styles.legendDot, { backgroundColor: 'rgba(255, 106, 0, 0.2)' }]} />
          <View style={[styles.legendDot, { backgroundColor: 'rgba(255, 106, 0, 0.4)' }]} />
          <View style={[styles.legendDot, { backgroundColor: 'rgba(255, 106, 0, 0.6)' }]} />
          <View style={[styles.legendDot, { backgroundColor: theme.colors.primary }]} />
        </View>
        <Text style={styles.legendText}>More</Text>
      </View>
    </View>
  );

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
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Workout History</Text>
            <Text style={styles.headerSubtitle}>
              Review your performance and track progress
            </Text>
          </View>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'summary' && styles.tabActive]}
            onPress={() => setActiveTab('summary')}
          >
            <Text style={[styles.tabText, activeTab === 'summary' && styles.tabTextActive]}>
              Summary
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'byExercise' && styles.tabActive]}
            onPress={() => setActiveTab('byExercise')}
          >
            <Text style={[styles.tabText, activeTab === 'byExercise' && styles.tabTextActive]}>
              By Exercise
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'calendar' && styles.tabActive]}
            onPress={() => setActiveTab('calendar')}
          >
            <Text style={[styles.tabText, activeTab === 'calendar' && styles.tabTextActive]}>
              Calendar
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'summary' && renderSummaryTab()}
          {activeTab === 'byExercise' && renderByExerciseTab()}
          {activeTab === 'calendar' && renderCalendarTab()}
        </ScrollView>

        <View style={styles.footer}>
          <PrimaryButton
            title="Back to Log"
            onPress={() => router.back()}
          />
        </View>
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
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  headerSubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.secondary,
    marginTop: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.secondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: theme.colors.white,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  metricsContainer: {
    paddingHorizontal: 24,
    gap: 16,
    paddingBottom: 24,
  },
  metricCard: {
    width: width * 0.7,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 106, 0, 0.3)',
  },
  metricIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 106, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricContent: {
    gap: 4,
  },
  metricValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  metricUnit: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.primary,
  },
  metricLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.white,
    fontWeight: '600',
  },
  metricSubtext: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.secondary,
  },
  chartSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.white,
    marginBottom: 16,
  },
  chart: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: 20,
    height: 200,
  },
  chartBars: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  chartBarContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  chartBarWrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  chartBar: {
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
    minHeight: 20,
  },
  chartLabel: {
    fontSize: 11,
    color: theme.colors.secondary,
  },
  exerciseSelector: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  exerciseDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: 16,
  },
  exerciseDropdownText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.white,
    fontWeight: '500',
  },
  tableContainer: {
    paddingHorizontal: 24,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableHeaderText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.secondary,
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: theme.borderRadius.md,
    marginBottom: 4,
  },
  tableRowAlt: {
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  tableCell: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.white,
  },
  calendarContainer: {
    paddingHorizontal: 24,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  calendarDay: {
    width: (width - 48 - 6 * 8) / 7,
    aspectRatio: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarDayText: {
    fontSize: 12,
    color: theme.colors.white,
    fontWeight: '500',
  },
  calendarLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  legendText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.secondary,
  },
  legendDots: {
    flexDirection: 'row',
    gap: 6,
  },
  legendDot: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: theme.colors.background,
  },
});
