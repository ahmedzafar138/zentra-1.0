import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Pause, Square, RefreshCw, Play } from 'lucide-react-native';
import { theme } from '@/constants/theme';

export default function LiveFormViewScreen() {
  const params = useLocalSearchParams();
  const exercise = params.exercise as string;
  const [correctReps, setCorrectReps] = useState(0);
  const [incorrectReps, setIncorrectReps] = useState(0);
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPaused]);

  const handlePausePlay = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    router.back();
  };

  const handleChange = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    router.back();
    router.back();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
          <Text style={styles.headerTitle}>{exercise}</Text>
          <View style={{ width: 24 }} />
        </View>

          <View style={styles.cameraModule}>
            <View style={styles.cameraPlaceholder}>
              <Text style={styles.cameraText}>Camera View</Text>
              <Text style={styles.cameraSubtext}>AI Form Detection Active</Text>
            </View>
          </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
          <View style={styles.coachPanel}>
            <View style = {{paddingLeft: 10}}>
            <Text style={styles.coachTitle}>Suggestions for max hypertrophy</Text>
            <View style={styles.suggestionItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.suggestionText}>Control tempo: 2 seconds down, 1 second up</Text>
            </View>
            <View style={styles.suggestionItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.suggestionText}>Maintain full range of motion</Text>
            </View>
            <View style={styles.suggestionItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.suggestionText}>Keep core engaged throughout</Text>
            </View>
              </View>
          </View>

          <View style={styles.kpiRow}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Correct Reps</Text>
              <Text style={styles.kpiValue}>{correctReps}</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Incorrect Reps</Text>
              <Text style={[styles.kpiValue, styles.incorrectValue]}>{incorrectReps}</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Time</Text>
              <Text style={styles.kpiValue}>{formatTime(time)}</Text>
            </View>
          </View>

          <View style={styles.controlsRow}>
            <TouchableOpacity style={styles.controlButton} onPress={handlePausePlay}>
              {isPaused ? (
                <Play size={24} color={theme.colors.white} />
              ) : (
                <Pause size={24} color={theme.colors.white} />
              )}
              <Text style={styles.controlButtonText}>{isPaused ? 'Resume' : 'Pause'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.controlButton, styles.primaryControl]} onPress={handleStop}>
              <Square size={24} color={theme.colors.white} />
              <Text style={styles.controlButtonText}>Finish</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton} onPress={handleChange}>
              <RefreshCw size={24} color={theme.colors.white} />
              <Text style={styles.controlButtonText}>Change</Text>
            </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  cameraModule: {
    marginBottom: 15,
  },
  cameraPlaceholder: {
    aspectRatio: 16 / 19,
    backgroundColor: theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraText: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.white,
    marginBottom: 8,
  },
  cameraSubtext: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.secondary,
  },coachPanel: {
  backgroundColor: theme.colors.card,
  borderRadius: theme.borderRadius.lg,
  padding: 8,      
  marginBottom: 12, 
},
coachTitle: {
  fontSize: theme.fontSize.sm,
  fontWeight: '600',
  color: theme.colors.primary,
  marginBottom: 6,
  marginTop: 3
},suggestionItem: {
  flexDirection: 'row',
  alignItems: 'flex-start', 
  marginBottom: 4,         
},
bullet: {
  fontSize: theme.fontSize.sm,
  color: theme.colors.primary,
  marginRight: 6,
  lineHeight: theme.fontSize.sm + 4, 
},
suggestionText: {
  flex: 1,
  fontSize: theme.fontSize.xs,
  color: theme.colors.secondary,
  lineHeight: theme.fontSize.sm + 4,
},

  kpiRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },kpiCard: {
  flex: 1,
  backgroundColor: theme.colors.card,
  borderRadius: theme.borderRadius.md,
  paddingVertical: 16, 
  alignItems: 'center',
  justifyContent: 'center', 
},
kpiLabel: {
  fontSize: theme.fontSize.xs,
  color: theme.colors.secondary,
  marginBottom: 6,     
  textAlign: 'center',
},
kpiValue: {
  fontSize: theme.fontSize.xl, 
  fontWeight: 'bold',
  color: theme.colors.primary,
  lineHeight: theme.fontSize.xl + 4, 
  textAlign: 'center',
},
incorrectValue: {
  color: '#FF4444', 
}, 
  controlsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  controlButton: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  primaryControl: {
    backgroundColor: theme.colors.primary,
  },
  controlButtonText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.white,
    fontWeight: '500',
  },
});
