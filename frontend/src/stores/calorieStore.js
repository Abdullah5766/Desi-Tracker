import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCalorieStore = create(
  persist(
    (set, get) => ({
      // Calculator state
      age: '',
      weight: '',
      height: '',
      gender: 'male',
      activityLevel: 'sedentary',
      goal: 'maintain',
      calculatedCalories: null,
      calculatedGoal: null,
      macros: {
        protein: 0,
        carbs: 0,
        fat: 0
      },

      // Update calculator inputs
      setAge: (age) => set({ age }),
      setWeight: (weight) => set({ weight }),
      setHeight: (height) => set({ height }),
      setGender: (gender) => set({ gender }),
      setActivityLevel: (activityLevel) => set({ activityLevel }),
      setGoal: (goal) => set({ goal }),

      // Calculate BMR using Mifflin-St Jeor Equation
      calculateBMR: () => {
        const { age, weight, height, gender } = get()
        
        if (!age || !weight || !height) return 0

        const ageNum = parseFloat(age)
        const weightNum = parseFloat(weight)
        const heightNum = parseFloat(height)

        let bmr
        if (gender === 'male') {
          bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5
        } else {
          bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161
        }

        return Math.round(bmr)
      },

      // Calculate TDEE (Total Daily Energy Expenditure)
      calculateTDEE: () => {
        const { activityLevel } = get()
        const bmr = get().calculateBMR()

        const activityMultipliers = {
          sedentary: 1.2,
          lightly_active: 1.375,
          moderately_active: 1.55,
          very_active: 1.725,
          extremely_active: 1.9
        }

        return Math.round(bmr * activityMultipliers[activityLevel])
      },

      // Calculate calories based on goal
      calculateCalories: () => {
        const { goal } = get()
        const tdee = get().calculateTDEE()

        let calories
        switch (goal) {
          case 'lose':
            calories = tdee - 650
            break
          case 'gain':
            calories = tdee + 500
            break
          case 'maintain':
          default:
            calories = tdee
            break
        }

        // Calculate macros (protein: 25%, carbs: 45%, fat: 30%)
        const protein = Math.round((calories * 0.25) / 4) // 4 calories per gram
        const carbs = Math.round((calories * 0.45) / 4)   // 4 calories per gram
        const fat = Math.round((calories * 0.30) / 9)     // 9 calories per gram

        set({
          calculatedCalories: Math.round(calories),
          calculatedGoal: goal,
          macros: { protein, carbs, fat }
        })

        return {
          calories: Math.round(calories),
          macros: { protein, carbs, fat }
        }
      },

      // Reset calculator
      resetCalculator: () => {
        set({
          age: '',
          weight: '',
          height: '',
          gender: 'male',
          activityLevel: 'sedentary',
          goal: 'maintain',
          calculatedCalories: null,
          calculatedGoal: null,
          macros: { protein: 0, carbs: 0, fat: 0 }
        })
      },

      // Set calculated values
      setCalculatedCalories: (calories) => set({ calculatedCalories: calories }),
      setMacros: (macros) => set({ macros }),

      // Get activity level label
      getActivityLevelLabel: (level) => {
        const labels = {
          sedentary: 'Sedentary (little/no exercise)',
          lightly_active: 'Lightly Active (light exercise 1-3 days/week)',
          moderately_active: 'Moderately Active (moderate exercise 3-5 days/week)',
          very_active: 'Very Active (hard exercise 6-7 days/week)',
          extremely_active: 'Extremely Active (very hard exercise, physical job)'
        }
        return labels[level] || level
      },

      // Get goal label
      getGoalLabel: (goalType) => {
        const labels = {
          lose: 'Weight Loss',
          maintain: 'Maintain Weight',
          gain: 'Weight Gain'
        }
        return labels[goalType] || goalType
      },

      // Load calculator data from user profile (only if not already persisted)
      loadFromUserProfile: (user) => {
        if (!user) return

        const currentState = get()
        const updates = {}
        
        // Only load basic info if not already set in persisted data
        if (user.age && !currentState.age) updates.age = user.age.toString()
        if (user.weight && !currentState.weight) updates.weight = user.weight.toString()
        if (user.height && !currentState.height) updates.height = user.height.toString()
        if (user.gender && currentState.gender === 'male') updates.gender = user.gender
        if (user.activityLevel && currentState.activityLevel === 'sedentary') updates.activityLevel = user.activityLevel
        if (user.goal && currentState.goal === 'maintain') updates.goal = user.goal

        // Only load calculated results if they exist in user profile AND not already calculated
        if (user.calorieGoal && user.calorieGoal > 0 && !currentState.calculatedCalories) {
          updates.calculatedCalories = user.calorieGoal
          updates.calculatedGoal = user.goal || 'maintain'
          updates.macros = {
            protein: user.proteinGoal || 0,
            carbs: user.carbGoal || 0,
            fat: user.fatGoal || 0
          }
        }

        if (Object.keys(updates).length > 0) {
          set(updates)
        }
      },

      // Clear all calculator data for new users
      clearCalculatorData: () => {
        set({
          age: '',
          weight: '',
          height: '',
          gender: 'male',
          activityLevel: 'sedentary',
          goal: 'maintain',
          calculatedCalories: null,
          calculatedGoal: null,
          macros: { protein: 0, carbs: 0, fat: 0 }
        })
      }
    }),
    {
      name: 'calorie-storage',
      partialize: (state) => ({
        age: state.age,
        weight: state.weight,
        height: state.height,
        gender: state.gender,
        activityLevel: state.activityLevel,
        goal: state.goal,
        calculatedCalories: state.calculatedCalories,
        calculatedGoal: state.calculatedGoal,
        macros: state.macros
      })
    }
  )
)