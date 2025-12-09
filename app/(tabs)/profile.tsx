import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { LogOut, User as UserIcon, ChevronRight, X } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import ScrollPicker from '@/components/ScrollPicker';
import PrimaryButton from '@/components/PrimaryButton';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editType, setEditType] = useState<'height' | 'weight' | 'steps' | null>(null);
  const [tempValue, setTempValue] = useState<number>(0);
  const [tempUnit, setTempUnit] = useState<string>('');
  const router = useRouter();

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

        setProfile(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await supabase.auth.signOut();
            router.replace('/auth');
          },
        },
      ]
    );
  };

  const openEditModal = (type: 'height' | 'weight' | 'steps') => {
    setEditType(type);
    if (type === 'height') {
      setTempValue(profile?.height_cm || 170);
      setTempUnit(profile?.height_unit || 'cm');
    } else if (type === 'weight') {
      setTempValue(profile?.weight_kg || 70);
      setTempUnit(profile?.weight_unit || 'kg');
    } else if (type === 'steps') {
      setTempValue(profile?.steps_goal || 8000);
      setTempUnit('');
    }
    setEditModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let updateData: any = {};

      if (editType === 'height') {
        updateData = {
          height_cm: tempValue,
          height_unit: tempUnit,
        };
      } else if (editType === 'weight') {
        updateData = {
          weight_kg: tempValue,
          weight_unit: tempUnit,
        };
      } else if (editType === 'steps') {
        updateData = {
          steps_goal: tempValue,
        };
      }

      const { error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      setEditModalVisible(false);
      loadProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const getHeightValues = () => {
    if (tempUnit === 'cm') {
      return Array.from({ length: 101 }, (_, i) => `${120 + i} cm`);
    } else {
      const values = [];
      for (let feet = 4; feet <= 7; feet++) {
        for (let inches = 0; inches < 12; inches++) {
          values.push(`${feet}'${inches}"`);
        }
      }
      return values;
    }
  };

  const getWeightValues = () => {
    if (tempUnit === 'kg') {
      return Array.from({ length: 186 }, (_, i) => `${35 + i} kg`);
    } else {
      return Array.from({ length: 406 }, (_, i) => `${80 + i} lb`);
    }
  };

  const getStepsValues = () => {
    return Array.from({ length: 191 }, (_, i) => `${(1000 + i * 100).toLocaleString()}`);
  };

  const getValueIndex = () => {
    if (editType === 'height') {
      return tempUnit === 'cm' ? tempValue - 120 : 0;
    } else if (editType === 'weight') {
      return tempUnit === 'kg' ? tempValue - 35 : 0;
    } else if (editType === 'steps') {
      return Math.floor((tempValue - 1000) / 100);
    }
    return 0;
  };

  const handleValueChange = (index: number) => {
    if (editType === 'height') {
      setTempValue(tempUnit === 'cm' ? 120 + index : tempValue);
    } else if (editType === 'weight') {
      setTempValue(tempUnit === 'kg' ? 35 + index : tempValue);
    } else if (editType === 'steps') {
      setTempValue(1000 + index * 100);
    }
  };

  return (
    <LinearGradient
      colors={[theme.colors.background, '#0A0A0A']}
      style={styles.container}
    >
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
              </>
            )}
          </View>

          <View style={styles.settingsContainer}>
            <TouchableOpacity style={styles.settingItem} onPress={() => openEditModal('height')}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Height</Text>
                <Text style={styles.settingValue}>
                  {profile?.height_cm ? `${profile.height_cm} cm` : 'Not set'}
                </Text>
              </View>
              <ChevronRight size={20} color={theme.colors.secondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} onPress={() => openEditModal('weight')}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Weight</Text>
                <Text style={styles.settingValue}>
                  {profile?.weight_kg ? `${profile.weight_kg} kg` : 'Not set'}
                </Text>
              </View>
              <ChevronRight size={20} color={theme.colors.secondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} onPress={() => openEditModal('steps')}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Daily Steps Goal</Text>
                <Text style={styles.settingValue}>
                  {profile?.steps_goal ? `${profile.steps_goal.toLocaleString()} steps` : '8000 steps'}
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

              {editType !== 'steps' && (
                <View style={styles.unitToggle}>
                  {editType === 'height' ? (
                    <>
                      <TouchableOpacity
                        style={[styles.unitButton, tempUnit === 'cm' && styles.unitButtonActive]}
                        onPress={() => setTempUnit('cm')}
                      >
                        <Text style={[styles.unitText, tempUnit === 'cm' && styles.unitTextActive]}>cm</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.unitButton, tempUnit === 'ft-in' && styles.unitButtonActive]}
                        onPress={() => setTempUnit('ft-in')}
                      >
                        <Text style={[styles.unitText, tempUnit === 'ft-in' && styles.unitTextActive]}>ft-in</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity
                        style={[styles.unitButton, tempUnit === 'kg' && styles.unitButtonActive]}
                        onPress={() => setTempUnit('kg')}
                      >
                        <Text style={[styles.unitText, tempUnit === 'kg' && styles.unitTextActive]}>kg</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.unitButton, tempUnit === 'lb' && styles.unitButtonActive]}
                        onPress={() => setTempUnit('lb')}
                      >
                        <Text style={[styles.unitText, tempUnit === 'lb' && styles.unitTextActive]}>lb</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              )}

              <ScrollPicker
                values={
                  editType === 'height'
                    ? getHeightValues()
                    : editType === 'weight'
                    ? getWeightValues()
                    : getStepsValues()
                }
                selectedIndex={getValueIndex()}
                onValueChange={handleValueChange}
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
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
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
    marginBottom: 8,
  },
  settingsContainer: {
    marginBottom: 32,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    padding: 16,
    borderRadius: theme.borderRadius.md,
    marginBottom: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.white,
    marginBottom: 4,
  },
  settingValue: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.secondary,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
    padding: 16,
    borderRadius: theme.borderRadius.md,
    gap: 12,
  },
  signOutText: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.white,
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: 4,
    marginBottom: 24,
  },
  unitButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
  },
  unitButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  unitText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.secondary,
    fontWeight: '500',
  },
  unitTextActive: {
    color: theme.colors.white,
  },
  saveButton: {
    marginTop: 24,
  },
});
