import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronLeft, ChevronDown } from "lucide-react-native";
import { theme } from "@/constants/theme";
import PrimaryButton from "@/components/PrimaryButton";

/* ================================
   SIMPLE DROPDOWN COMPONENT
================================ */
function Dropdown({ label, value, setValue, options }) {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.controlLabel}>{label}</Text>

      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setOpen(!open)}
        activeOpacity={0.8}
      >
        <Text style={styles.dropdownText}>{value}</Text>
        <ChevronDown size={20} color={theme.colors.secondary} />
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdownList}>
          {options.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dropdownItem}
              onPress={() => {
                setValue(item);
                setOpen(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

/* ================================
         MAIN SCREEN
================================ */
export default function MealGeneratorScreen() {
  const router = useRouter();

  const [culinaryPreference, setCulinaryPreference] = useState("Any");
  const [dietaryPreference, setDietaryPreference] = useState("None");
  const [goal, setGoal] = useState("");

  const handleGenerate = () => {
    router.push("/meal-plan/weekly");
  };

  const handleGetRecipe = () => {
    router.push("/meal-plan/recipe");
  };

  const mealTypes = [
    { label: "Breakfast", calories: 450, protein: 25, carbs: 45, fat: 15 },
    { label: "Lunch", calories: 600, protein: 40, carbs: 55, fat: 20 },
    { label: "Dinner", calories: 550, protein: 35, carbs: 50, fat: 18 },
    { label: "Snacks", calories: 200, protein: 10, carbs: 25, fat: 8 },
  ];

  const totalCalories = mealTypes.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = mealTypes.reduce((sum, m) => sum + m.protein, 0);
  const totalCarbs = mealTypes.reduce((sum, m) => sum + m.carbs, 0);
  const totalFat = mealTypes.reduce((sum, m) => sum + m.fat, 0);

  return (
    <LinearGradient
      colors={[theme.colors.background, "#0A0A0A"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={24} color={theme.colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meal Generator</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.subtitle}>Meal plan catered to your calorie intake.</Text>

          {/* ---- Dropdowns ---- */}
          <View style={styles.controlsRow}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Dropdown
                label="Culinary Preference"
                value={culinaryPreference}
                setValue={setCulinaryPreference}
                options={["1", "2", "3", "4", "5"]}
              />
            </View>

            <View style={{ flex: 1, marginLeft: 8 }}>
              <Dropdown
                label="Dietary Preference"
                value={dietaryPreference}
                setValue={setDietaryPreference}
                options={["1", "2", "3", "4", "5"]}
              />
            </View>
          </View>

          {/* ---- Goal Input ---- */}
          <View style={styles.goalContainer}>
            <Text style={styles.controlLabel}>Your Goal</Text>
            <TextInput
              style={styles.goalInput}
              value={goal}
              onChangeText={setGoal}
              placeholder="I want to lose weight and build muscle"
              placeholderTextColor={theme.colors.inactive}
              multiline
            />
          </View>

          {/* ---- Preview ---- */}
          <View style={styles.previewSection}>
            <Text style={styles.sectionTitle}>Preview</Text>
            <View style={styles.previewGrid}>
              {mealTypes.map((meal, i) => (
                <View key={i} style={styles.previewCard}>
                  <Text style={styles.previewLabel}>{meal.label}</Text>
                  <Text style={styles.previewCalories}>{meal.calories} cal</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ---- Totals ---- */}
          <View style={styles.totalsCard}>
            <Text style={styles.totalsTitle}>Daily Totals</Text>
            <View style={styles.totalsRow}>
              <View style={styles.totalItem}>
                <Text style={styles.totalValue}>{totalCalories}</Text>
                <Text style={styles.totalLabel}>Calories</Text>
              </View>
              <View style={styles.totalItem}>
                <Text style={styles.totalValue}>{totalProtein}g</Text>
                <Text style={styles.totalLabel}>Protein</Text>
              </View>
              <View style={styles.totalItem}>
                <Text style={styles.totalValue}>{totalCarbs}g</Text>
                <Text style={styles.totalLabel}>Carbs</Text>
              </View>
              <View style={styles.totalItem}>
                <Text style={styles.totalValue}>{totalFat}g</Text>
                <Text style={styles.totalLabel}>Fat</Text>
              </View>
            </View>
          </View>

          <PrimaryButton
            title="Generate Weekly Plan"
            onPress={handleGenerate}
            style={styles.generateButton}
          />

          <TouchableOpacity style={styles.secondaryButton} onPress={handleGetRecipe}>
            <Text style={styles.secondaryButtonText}>Get Recipe</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: "600",
    color: theme.colors.white,
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },

  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.secondary,
    marginBottom: 24,
  },

  // ---------- Dropdown ----------
  controlLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.white,
    marginBottom: 8,
    fontWeight: "500",
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: 12,
  },
  dropdownText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.white,
  },
  dropdownList: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    marginTop: 6,
    overflow: "hidden",
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  dropdownItemText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.md,
  },

  controlsRow: { flexDirection: "row", marginBottom: -10 },

  goalContainer: { marginBottom: 24 },
  goalInput: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: 16,
    color: theme.colors.white,
    fontSize: theme.fontSize.md,
    minHeight: 80,
    textAlignVertical: "top",
  },

  previewSection: { marginBottom: 24 },
  sectionTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: "600",
    color: theme.colors.white,
    marginBottom: 12,
  },
  previewGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  previewCard: {
    width: "48%",
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: 16,
  },
  previewLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.white,
    fontWeight: "500",
    marginBottom: 4,
  },
  previewCalories: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    fontWeight: "600",
  },

  totalsCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: 20,
    marginBottom: 24,
  },
  totalsTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: "600",
    color: theme.colors.white,
    marginBottom: 16,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalItem: { alignItems: "center" },
  totalValue: {
    fontSize: theme.fontSize.lg,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.secondary,
  },

  generateButton: { marginBottom: 12 },
  secondaryButton: { padding: 16, alignItems: "center" },
  secondaryButtonText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.secondary,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
