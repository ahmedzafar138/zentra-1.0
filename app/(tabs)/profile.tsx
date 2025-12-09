import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { LogOut, User as UserIcon, ChevronRight, X } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import ScrollPicker from '@/components/ScrollPicker';
import PrimaryButton from '@/components/PrimaryButton';

type HeightUnit = 'cm' | 'ft-in';
type WeightUnit = 'kg' | 'lb';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editType, setEditType] = useState<'height' | 'weight' | 'steps' | null>(null);

  const [tempHeight, setTempHeight] = useState(170);
  const [heightUnit, setHeightUnit] = useState<HeightUnit>('cm');

  const [tempWeight, setTempWeight] = useState(70);
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');

  const [tempSteps, setTempSteps] = useState(8000);

  const router = useRouter();

  /** -------------------
   * Load Profile + Update BMI
   * ------------------- */
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        if (data) {
          setProfile(data);
          setTempHeight(data.height_cm || 170);
          setHeightUnit(data.height_unit || 'cm');
          setTempWeight(data.weight_kg || 70);
          setWeightUnit(data.weight_unit || 'kg');
          setTempSteps(data.steps_goal || 8000);

          updateBMI(data.height_cm, data.weight_kg, user.id);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const calculateBMI = (height_cm: number, weight_kg: number) => {
    if (!height_cm || !weight_kg) return null;
    const height_m = height_cm / 100;
    return +(weight_kg / (height_m * height_m)).toFixed(1);
  };

  const updateBMI = async (height_cm: number, weight_kg: number, userId: string) => {
    const bmi = calculateBMI(height_cm, weight_kg);
    if (!bmi) return;
    await supabase.from('user_profiles').update({ bmi }).eq('id', userId);
    setProfile((prev: any) => ({ ...prev, bmi }));
  };

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          router.replace('/auth');
        },
      },
    ]);
  };

  /** -------------------
   * Picker Helpers
   * ------------------- */
  // Height
  const cmToFeet = (cm: number) => {
    const inches = Math.round(cm / 2.54);
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return { feet, inches: remainingInches };
  };

  const feetToCm = (feet: number, inches: number) => {
    return Math.round((feet * 12 + inches) * 2.54);
  };

  const cmHeightValues = useMemo(() => Array.from({ length: 101 }, (_, i) => `${120 + i} cm`), []);
  const ftInHeightValues = useMemo(() => {
    const vals: { display: string; cm: number }[] = [];
    for (let feet = 4; feet <= 7; feet++) {
      for (let inches = 0; inches < 12; inches++) {
        const cm = feetToCm(feet, inches);
        if (cm >= 120 && cm <= 220) vals.push({ display: `${feet}'${inches}"`, cm });
      }
    }
    return vals;
  }, []);

  const getHeightIndex = () => {
    return heightUnit === 'cm'
      ? tempHeight - 120
      : ftInHeightValues.findIndex((v) => v.cm === tempHeight) || 0;
  };

  const handleHeightChange = (index: number) => {
    if (heightUnit === 'cm') setTempHeight(120 + index);
    else setTempHeight(ftInHeightValues[index].cm);
  };

  // Weight
  const kgToLb = (kg: number) => Math.round(kg / 0.453592);
  const lbToKg = (lb: number) => Math.round(lb * 0.453592);

  const kgWeightValues = useMemo(() => Array.from({ length: 186 }, (_, i) => `${35 + i} kg`), []);
  const lbWeightValues = useMemo(() => {
    const vals: { display: string; kg: number }[] = [];
    for (let i = 80; i <= 485; i++) vals.push({ display: `${i} lb`, kg: lbToKg(i) });
    return vals;
  }, []);

  const getWeightIndex = () => {
    return weightUnit === 'kg'
      ? tempWeight - 35
      : lbWeightValues.findIndex((v) => v.kg === tempWeight) || 0;
  };

  const handleWeightChange = (index: number) => {
    if (weightUnit === 'kg') setTempWeight(35 + index);
    else setTempWeight(lbWeightValues[index].kg);
  };

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_profiles')
        .update({
          height_cm: tempHeight,
          height_unit: heightUnit,
          weight_kg: tempWeight,
          weight_unit: weightUnit,
          steps_goal: tempSteps,
        })
        .eq('id', user.id);

      if (error) throw error;

      await updateBMI(tempHeight, tempWeight, user.id);
      setEditModalVisible(false);
      loadProfile();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  /** -------------------
   * Open Modal
   * ------------------- */
  const openEditModal = (type: 'height' | 'weight' | 'steps') => {
    setEditType(type);
    if (type === 'height') {
      setTempHeight(profile?.height_cm || 170);
      setHeightUnit(profile?.height_unit || 'cm');
    } else if (type === 'weight') {
      setTempWeight(profile?.weight_kg || 70);
      setWeightUnit(profile?.weight_unit || 'kg');
    } else if (type === 'steps') {
      setTempSteps(profile?.steps_goal || 8000);
    }
    setEditModalVisible(true);
  };

  /** -------------------
   * Steps
   * ------------------- */
  const getStepsValues = () => Array.from({ length: 191 }, (_, i) => `${1000 + i * 100}`);
  const getStepsIndex = () => Math.floor((tempSteps - 1000) / 100);
  const handleStepsChange = (index: number) => setTempSteps(1000 + index * 100);

  return (
    <LinearGradient colors={[theme.colors.background, '#0A0A0A']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <UserIcon size={48} color={theme.colors.white} />
            </View>
            {profile && (
              <>
                <Text style={styles.name}>
                  {profile.first_name} {profile.last_name}
                </Text>
                {profile.bmi && (
                  <Text style={styles.bmiText}>
                    BMI: <Text style={styles.bmiValue}>{profile.bmi}</Text>
                  </Text>
                )}
              </>
            )}
          </View>

          <View style={styles.settingsContainer}>
            <TouchableOpacity style={styles.settingItem} onPress={() => openEditModal('height')}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Height</Text>
                <Text style={styles.settingValue}>
                  {profile?.height_cm
                    ? `${profile.height_cm} ${profile.height_unit || 'cm'}`
                    : 'Not set'}
                </Text>
              </View>
              <ChevronRight size={20} color={theme.colors.secondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} onPress={() => openEditModal('weight')}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Weight</Text>
                <Text style={styles.settingValue}>
                  {profile?.weight_kg
                    ? `${profile.weight_kg} ${profile.weight_unit || 'kg'}`
                    : 'Not set'}
                </Text>
              </View>
              <ChevronRight size={20} color={theme.colors.secondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} onPress={() => openEditModal('steps')}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Daily Steps Goal</Text>
                <Text style={styles.settingValue}>
                  {profile?.steps_goal
                    ? `${profile.steps_goal.toLocaleString()} steps`
                    : '8000 steps'}
                </Text>
              </View>
              <ChevronRight size={20} color={theme.colors.secondary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <LogOut size={20} color={theme.colors.white} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Modal */}
        <Modal
          visible={editModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setEditModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  Edit {editType === 'height' ? 'Height' : editType === 'weight' ? 'Weight' : 'Steps Goal'}
                </Text>
                <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                  <X size={24} color={theme.colors.white} />
                </TouchableOpacity>
              </View>

              {/* Unit Toggle */}
              {editType !== 'steps' && (
                <View style={styles.unitToggle}>
                  {editType === 'height' ? (
                    <>
                      <TouchableOpacity
                        style={[styles.unitButton, heightUnit === 'cm' && styles.unitButtonActive]}
                        onPress={() => setHeightUnit('cm')}
                      >
                        <Text style={[styles.unitText, heightUnit === 'cm' && styles.unitTextActive]}>cm</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.unitButton, heightUnit === 'ft-in' && styles.unitButtonActive]}
                        onPress={() => setHeightUnit('ft-in')}
                      >
                        <Text style={[styles.unitText, heightUnit === 'ft-in' && styles.unitTextActive]}>ft-in</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity
                        style={[styles.unitButton, weightUnit === 'kg' && styles.unitButtonActive]}
                        onPress={() => setWeightUnit('kg')}
                      >
                        <Text style={[styles.unitText, weightUnit === 'kg' && styles.unitTextActive]}>kg</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.unitButton, weightUnit === 'lb' && styles.unitButtonActive]}
                        onPress={() => setWeightUnit('lb')}
                      >
                        <Text style={[styles.unitText, weightUnit === 'lb' && styles.unitTextActive]}>lb</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              )}

              <ScrollPicker
                values={
                  editType === 'height'
                    ? heightUnit === 'cm'
                      ? cmHeightValues
                      : ftInHeightValues.map((v) => v.display)
                    : editType === 'weight'
                    ? weightUnit === 'kg'
                      ? kgWeightValues
                      : lbWeightValues.map((v) => v.display)
                    : getStepsValues()
                }
                selectedIndex={
                  editType === 'height'
                    ? getHeightIndex()
                    : editType === 'weight'
                    ? getWeightIndex()
                    : getStepsIndex()
                }
                onValueChange={
                  editType === 'height'
                    ? handleHeightChange
                    : editType === 'weight'
                    ? handleWeightChange
                    : handleStepsChange
                }
              />

              <PrimaryButton title="Save" onPress={handleSave} style={styles.saveButton} />
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 32, paddingBottom: 24 },
  avatarContainer: { alignItems: 'center', marginBottom: 32 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.white,
    marginBottom: 4,
  },
  bmiText: { fontSize: theme.fontSize.md, color: theme.colors.secondary, marginTop: 4 },
  bmiValue: { color: theme.colors.primary, fontWeight: 'bold' },
  settingsContainer: { marginBottom: 32 },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    padding: 16,
    borderRadius: theme.borderRadius.md,
    marginBottom: 12,
  },
  settingInfo: { flex: 1 },
  settingLabel: { fontSize: theme.fontSize.md, fontWeight: '600', color: theme.colors.white, marginBottom: 4 },
  settingValue: { fontSize: theme.fontSize.sm, color: theme.colors.secondary },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
    padding: 16,
    borderRadius: theme.borderRadius.md,
    gap: 12,
  },
  signOutText: { fontSize: theme.fontSize.md, fontWeight: '600', color: theme.colors.white },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: theme.colors.card, borderTopLeftRadius: theme.borderRadius.lg, borderTopRightRadius: theme.borderRadius.lg, padding: 24, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: theme.fontSize.lg, fontWeight: '600', color: theme.colors.white },
  unitToggle: { flexDirection: 'row', backgroundColor: theme.colors.background, borderRadius: theme.borderRadius.md, padding: 4, marginBottom: 24 },
  unitButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: theme.borderRadius.sm },
  unitButtonActive: { backgroundColor: theme.colors.primary },
  unitText: { fontSize: theme.fontSize.md, color: theme.colors.secondary, fontWeight: '500' },
  unitTextActive: { color: theme.colors.white },
  saveButton: { marginTop: 24 },
});