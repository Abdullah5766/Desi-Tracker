import { useState, useEffect } from 'react'
import { ChefHat, Settings, RefreshCw, Clock, Target, Plus, Info, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCalorieStore } from '../stores/calorieStore'
import { useAuthStore } from '../stores/authStore'
import Modal from './common/Modal'
import LoadingSpinner from './common/LoadingSpinner'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" }
  }
}

const MealPlan = () => {
  const { calculatedCalories, macros } = useCalorieStore()
  const { user } = useAuthStore()
  
  const [preferences, setPreferences] = useState(null)
  const [showPreferencesModal, setShowPreferencesModal] = useState(false)
  const [showChangeConfirmModal, setShowChangeConfirmModal] = useState(false)
  const [mealPlan, setMealPlan] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    // Load preferences from localStorage when component mounts or user changes
    loadPreferences()
  }, [user?.id])
  
  // Clear meal plan and preferences when user logs out or changes
  useEffect(() => {
    if (!user?.id) {
      setPreferences(null)
      setMealPlan(null)
    }
  }, [user?.id])

  const loadPreferences = () => {
    if (!user?.id) return // Don't load if no user
    
    try {
      const stored = localStorage.getItem(`desi-tracker-meal-preferences-${user.id}`)
      if (stored) {
        const prefs = JSON.parse(stored)
        setPreferences(prefs)
        
        // Auto-generate meal plan if preferences exist and we have calorie data
        if (calculatedCalories && macros) {
          generateMealPlan(prefs)
        }
      }
    } catch (error) {
      console.error('Failed to load meal preferences:', error)
    }
  }


  const generateMealPlan = async (userPreferences = preferences) => {
    console.log('🚀 generateMealPlan called with:', {
      calculatedCalories,
      macros,
      userPreferences,
      hasPreferences: !!userPreferences
    })
    
    if (!calculatedCalories || !macros || !userPreferences) {
      console.log('❌ Missing requirements:', {
        calculatedCalories: !!calculatedCalories,
        macros: !!macros,
        userPreferences: !!userPreferences
      })
      return
    }

    setIsGenerating(true)
    
    try {
      // Simulate meal plan generation based on preferences
      const plan = await createMealSuggestions(calculatedCalories, macros, userPreferences)
      console.log('✅ Generated meal plan:', plan)
      setMealPlan(plan)
    } catch (error) {
      console.error('❌ Failed to generate meal plan:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const createMealSuggestions = async (calories, targetMacros, prefs) => {
    // Distribute calories across meals (25% breakfast, 35% lunch, 35% dinner, 5% snacks)
    const calorieDistribution = {
      breakfast: Math.round(calories * 0.25),
      lunch: Math.round(calories * 0.35),
      dinner: Math.round(calories * 0.35),
      snacks: Math.round(calories * 0.05)
    }

    // Distribute macros proportionally
    const macroDistribution = {
      breakfast: {
        protein: Math.round(targetMacros.protein * 0.25),
        carbs: Math.round(targetMacros.carbs * 0.25),
        fat: Math.round(targetMacros.fat * 0.25)
      },
      lunch: {
        protein: Math.round(targetMacros.protein * 0.35),
        carbs: Math.round(targetMacros.carbs * 0.35),
        fat: Math.round(targetMacros.fat * 0.35)
      },
      dinner: {
        protein: Math.round(targetMacros.protein * 0.35),
        carbs: Math.round(targetMacros.carbs * 0.35),
        fat: Math.round(targetMacros.fat * 0.35)
      },
      snacks: {
        protein: Math.round(targetMacros.protein * 0.05),
        carbs: Math.round(targetMacros.carbs * 0.05),
        fat: Math.round(targetMacros.fat * 0.05)
      }
    }

    return {
      breakfast: generateMealSuggestion('breakfast', calorieDistribution.breakfast, macroDistribution.breakfast, prefs),
      lunch: generateMealSuggestion('lunch', calorieDistribution.lunch, macroDistribution.lunch, prefs),
      dinner: generateMealSuggestion('dinner', calorieDistribution.dinner, macroDistribution.dinner, prefs),
      snacks: generateSnackSuggestion(calorieDistribution.snacks, macroDistribution.snacks, prefs),
      totalCalories: calories,
      totalMacros: targetMacros
    }
  }

  const generateMealSuggestion = (mealType, targetCalories, targetMacros, prefs) => {
    console.log(`🥘 Generating ${mealType} with proteins:`, prefs.proteins)
    
    // Pre-calculate protein distribution for all meals to avoid recursion
    const eggProteins = prefs.proteins.filter(p => p.includes('Egg'))
    const meatProteins = prefs.proteins.filter(p => p.includes('Chicken') || p.includes('Beef') || p.includes('Goat') || p.includes('Lamb'))
    const fishProteins = prefs.proteins.filter(p => p.includes('Salmon') || p.includes('Tuna') || p.includes('Fish'))
    const dairyProteins = prefs.proteins.filter(p => p.includes('Paneer') || p.includes('Yogurt'))
    const legumesProteins = prefs.proteins.filter(p => p.includes('Dal') || p.includes('Chana'))
    
    // Assign proteins to meals
    let breakfastProtein, lunchProtein, dinnerProtein
    
    // Breakfast: Prefer eggs, then dairy, then legumes
    if (eggProteins.length > 0) {
      breakfastProtein = eggProteins[0]
    } else if (dairyProteins.length > 0) {
      breakfastProtein = dairyProteins[0]
    } else if (legumesProteins.length > 0) {
      breakfastProtein = legumesProteins[0]
    } else {
      breakfastProtein = prefs.proteins[0]
    }
    
    // Lunch: Prefer meat/fish, avoid breakfast protein
    const lunchOptions = prefs.proteins.filter(p => p !== breakfastProtein)
    const availableMeatForLunch = meatProteins.filter(p => p !== breakfastProtein)
    const availableFishForLunch = fishProteins.filter(p => p !== breakfastProtein)
    
    if (availableMeatForLunch.length > 0) {
      lunchProtein = availableMeatForLunch[0]
    } else if (availableFishForLunch.length > 0) {
      lunchProtein = availableFishForLunch[0]
    } else if (lunchOptions.length > 0) {
      lunchProtein = lunchOptions[0]
    } else {
      lunchProtein = prefs.proteins[1] || prefs.proteins[0]
    }
    
    // Dinner: Use remaining proteins, prefer fish
    const dinnerOptions = prefs.proteins.filter(p => p !== breakfastProtein && p !== lunchProtein)
    const availableFishForDinner = fishProteins.filter(p => p !== breakfastProtein && p !== lunchProtein)
    const availableMeatForDinner = meatProteins.filter(p => p !== breakfastProtein && p !== lunchProtein)
    
    if (availableFishForDinner.length > 0) {
      dinnerProtein = availableFishForDinner[0]
    } else if (availableMeatForDinner.length > 0) {
      dinnerProtein = availableMeatForDinner[0]
    } else if (dinnerOptions.length > 0) {
      dinnerProtein = dinnerOptions[0]
    } else {
      dinnerProtein = prefs.proteins[prefs.proteins.length - 1]
    }
    
    // Select the protein for current meal
    let selectedProtein
    switch (mealType) {
      case 'breakfast':
        selectedProtein = breakfastProtein
        break
      case 'lunch':
        selectedProtein = lunchProtein
        break
      case 'dinner':
        selectedProtein = dinnerProtein
        break
      default:
        selectedProtein = prefs.proteins[0]
    }
    
    // Smart carb distribution
    const getCarbForMeal = (meal, carbs) => {
      const breadCarbs = carbs.filter(c => c.includes('Roti') || c.includes('Chapati') || c.includes('Naan'))
      const riceCarbs = carbs.filter(c => c.includes('Rice'))
      const lightCarbs = carbs.filter(c => c.includes('Oats') || c.includes('Potato'))
      
      switch (meal) {
        case 'breakfast':
          if (lightCarbs.length > 0) return lightCarbs[0] // Oats or potato for breakfast
          if (breadCarbs.length > 0) return breadCarbs[0]
          return carbs[0]
        
        case 'lunch':
          if (riceCarbs.length > 0) return riceCarbs[0] // Rice for lunch
          if (breadCarbs.length > 0) return breadCarbs[0]
          return carbs[0]
        
        case 'dinner':
          if (breadCarbs.length > 0) return breadCarbs[0] // Roti for dinner
          if (riceCarbs.length > 0) return riceCarbs[0]
          return carbs[0]
        
        default:
          return carbs[0]
      }
    }

    const selectedCarb = getCarbForMeal(mealType, prefs.carbs)
    const selectedFat = prefs.fats[0] // Use primary fat choice
    const selectedVeggies = prefs.vegetables.slice(0, 2) // Use first 2 vegetable choices
    
    // Generate meal name based on selected foods
    const getMealName = (protein, carb, meal) => {
      if (meal === 'breakfast') {
        if (protein.includes('Egg')) return 'Egg Breakfast'
        if (protein.includes('Oats')) return 'Protein Oats Bowl'
        if (protein.includes('Yogurt')) return 'Yogurt & Grain Bowl'
        return 'Morning Protein Bowl'
      } else if (meal === 'lunch') {
        if (carb.includes('Rice')) return 'Rice & Protein Meal'
        if (protein.includes('Dal')) return 'Dal Rice Combo'
        if (protein.includes('Chicken')) return 'Chicken Rice Bowl'
        return 'Balanced Lunch'
      } else {
        if (carb.includes('Roti') || carb.includes('Chapati')) return 'Roti with Protein'
        if (protein.includes('Fish')) return 'Fish Dinner'
        return 'Hearty Dinner'
      }
    }
    
    return {
      name: getMealName(selectedProtein, selectedCarb, mealType),
      targetCalories,
      targetMacros,
      foods: [
        { name: selectedProtein, type: 'protein', amount: calculatePortionSize('protein', targetMacros.protein, selectedProtein) },
        { name: selectedCarb, type: 'carb', amount: calculatePortionSize('carb', targetMacros.carbs, selectedCarb) },
        { name: selectedFat, type: 'fat', amount: calculatePortionSize('fat', targetMacros.fat, selectedFat) },
        ...selectedVeggies.map(veg => ({ name: veg, type: 'vegetable', amount: calculatePortionSize('vegetable', 0, veg) }))
      ],
      cookingTips: generateCookingTips({
        base: selectedProtein,
        carb: selectedCarb,
        vegetables: selectedVeggies,
        mealType
      })
    }
  }

  const generateSnackSuggestion = (targetCalories, targetMacros, prefs) => {
    const snackOptions = [
      `Mixed nuts (${prefs.fats[0]})`,
      `Greek yogurt with ${prefs.fruits[0]}`,
      `${prefs.vegetables[0]} with hummus`,
      `Protein smoothie with ${prefs.fruits[1] || prefs.fruits[0]}`
    ]

    return {
      name: "Healthy Snacks",
      targetCalories,
      targetMacros,
      options: snackOptions.slice(0, 2),
      recommendation: snackOptions[0]
    }
  }

  const calculatePortionSize = (macroType, grams, foodName = '') => {
    switch (macroType) {
      case 'protein':
        if (foodName.includes('Egg')) {
          return `${Math.max(1, Math.round(grams / 6))} egg(s)` // ~6g protein per egg
        } else if (foodName.includes('Chicken') || foodName.includes('Beef') || foodName.includes('Goat')) {
          return `${Math.round(grams * 4.5)}g` // Meat portion to get protein grams
        } else if (foodName.includes('Fish') || foodName.includes('Salmon') || foodName.includes('Tuna')) {
          return `${Math.round(grams * 5)}g` // Fish portion
        } else if (foodName.includes('Dal') || foodName.includes('Chana')) {
          return `${Math.round(grams * 4)}g` // Legumes portion (uncooked)
        } else if (foodName.includes('Paneer')) {
          return `${Math.round(grams * 5.5)}g` // Paneer portion
        } else if (foodName.includes('Yogurt')) {
          return `${Math.round(grams * 10)}g` // Yogurt portion
        }
        return `${Math.round(grams * 4)}g`
      
      case 'carb':
        if (foodName.includes('Rice')) {
          return `${Math.round(grams * 3.5)}g` // Rice portion (cooked)
        } else if (foodName.includes('Roti') || foodName.includes('Chapati')) {
          return `${Math.round(grams * 2)}g` // Roti portion in grams (cooked weight)
        } else if (foodName.includes('Naan')) {
          return `${Math.round(grams * 2)}g` // Naan portion in grams
        } else if (foodName.includes('Oats')) {
          return `${Math.round(grams * 1.5)}g` // Oats portion (uncooked)
        } else if (foodName.includes('Potato')) {
          return `${Math.round(grams * 5)}g` // Potato portion in grams
        }
        return `${Math.round(grams * 2)}g`
      
      case 'fat':
        if (foodName.includes('Ghee') || foodName.includes('Oil') || foodName.includes('Butter')) {
          return `${Math.max(1, Math.round(grams / 11))} tbsp` // ~11g fat per tbsp
        } else if (foodName.includes('Seeds') || foodName.includes('Nuts')) {
          return `${Math.round(grams * 2)}g` // Seeds/nuts portion
        } else if (foodName.includes('Avocado')) {
          return `${Math.round(grams / 15)} medium avocado` // ~15g fat per avocado
        }
        return `${Math.round(grams * 2)}g`
      
      case 'vegetable':
        return '1 cup chopped' // Standard vegetable portion
      
      default:
        return '1 serving'
    }
  }

  const generateCookingTips = (template) => {
    const tips = []
    
    // Protein-specific tips
    if (template.base.includes('Egg')) {
      tips.push('Boil, scramble, or make an omelet with vegetables')
      tips.push('Use minimal oil for cooking to keep it healthy')
    } else if (template.base.includes('Chicken')) {
      tips.push('Grill, bake, or cook with minimal oil')
      tips.push('Marinate with yogurt and spices for better flavor')
    } else if (template.base.includes('Fish')) {
      tips.push('Steam, grill, or lightly pan-fry with lemon')
      tips.push('Season with turmeric and ginger for Desi flavors')
    } else if (template.base.includes('Dal')) {
      tips.push('Cook dal with turmeric, cumin, and ginger')
      tips.push('Add a tempering (tadka) with minimal oil for flavor')
    } else if (template.base.includes('Paneer')) {
      tips.push('Lightly sauté or add directly to curry')
      tips.push('Use minimal oil and add plenty of vegetables')
    } else {
      tips.push(`Cook ${template.base.split('(')[0].trim()} with minimal oil for healthier preparation`)
    }
    
    // Carb-specific tips
    if (template.carb.includes('Rice')) {
      tips.push('Cook rice with less water to preserve nutrients')
    } else if (template.carb.includes('Roti') || template.carb.includes('Chapati')) {
      tips.push('Make fresh rotis without oil for best health benefits')
    } else if (template.carb.includes('Oats')) {
      tips.push('Cook oats with milk or water, add fruits for sweetness')
    }
    
    // Vegetable tips
    if (template.vegetables && template.vegetables.length > 0) {
      tips.push(`Add ${template.vegetables.join(' and ')} for extra nutrients and fiber`)
    }
    
    // Meal-specific tips
    if (template.mealType === 'breakfast') {
      tips.push('Start your day with this balanced meal for sustained energy')
    } else if (template.mealType === 'lunch') {
      tips.push('This hearty meal will keep you full and energized')
    } else if (template.mealType === 'dinner') {
      tips.push('Light on stomach yet satisfying for evening meal')
    }
    
    return tips.slice(0, 3) // Return maximum 3 tips
  }

  const openPreferencesModal = () => {
    setShowPreferencesModal(true)
  }

  const closePreferencesModal = () => {
    setShowPreferencesModal(false)
  }

  const handlePreferencesSave = async (newPreferences) => {
    console.log('🔄 Saving new preferences:', newPreferences)
    
    // Save preferences to localStorage and state
    if (!user?.id) {
      console.error('❌ Cannot save preferences: No user logged in')
      return
    }
    
    try {
      console.log('💾 Saving preferences to localStorage:', newPreferences)
      localStorage.setItem(`desi-tracker-meal-preferences-${user.id}`, JSON.stringify(newPreferences))
      setPreferences(newPreferences)
      console.log('✅ Preferences saved and state updated')
    } catch (error) {
      console.error('❌ Failed to save meal preferences:', error)
      return
    }
    
    closePreferencesModal()
    
    // Generate new meal plan with updated preferences immediately
    if (calculatedCalories && macros) {
      console.log('🍽️ Generating new meal plan with updated preferences')
      // Use the newPreferences directly instead of relying on state
      await generateMealPlan(newPreferences)
    }
  }

  return (
    <motion.div 
      className="max-w-6xl mx-auto space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div 
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0"
        variants={itemVariants}
      >
        <div>
          <motion.h1 
            className="text-2xl lg:text-3xl font-bold text-white flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChefHat className="w-6 h-6 lg:w-8 lg:h-8 mr-2 lg:mr-3 text-purple-400" />
            </motion.div>
            Meal Plan
          </motion.h1>
          <motion.p 
            className="text-gray-300 mt-1 lg:mt-2 text-sm lg:text-base"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Personalized meal suggestions based on your goals
          </motion.p>
        </div>
        
        <motion.div 
          className="flex items-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {preferences ? (
            <motion.button
              onClick={() => setShowChangeConfirmModal(true)}
              className="btn-secondary flex items-center space-x-2 text-sm lg:text-base px-3 py-2 lg:px-4 lg:py-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Change Preferences</span>
              <span className="sm:hidden">Change</span>
            </motion.button>
          ) : (
            <motion.button
              onClick={openPreferencesModal}
              className="btn-primary flex items-center space-x-2 text-sm lg:text-base px-3 py-2 lg:px-4 lg:py-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Set Preferences</span>
              <span className="sm:hidden">Set</span>
            </motion.button>
          )}
        </motion.div>
      </motion.div>

      {/* Calorie Budget Info */}
      <AnimatePresence>
        {calculatedCalories && (
          <motion.div 
            className="card bg-gradient-purple"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between text-white space-y-4 lg:space-y-0">
              <div className="flex-1">
                <motion.h3 
                  className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  Your Daily Budget
                </motion.h3>
                <motion.div 
                  className="grid grid-cols-2 lg:flex lg:items-center gap-4 lg:gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div 
                    className="text-center"
                    variants={cardVariants}
                  >
                    <motion.span 
                      className="text-xl lg:text-2xl font-bold block"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      {calculatedCalories}
                    </motion.span>
                    <p className="text-xs lg:text-sm text-purple-100">Calories</p>
                  </motion.div>
                  <motion.div 
                    className="text-center"
                    variants={cardVariants}
                  >
                    <motion.span 
                      className="text-lg lg:text-xl font-semibold block"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                    >
                      {macros.protein}g
                    </motion.span>
                    <p className="text-xs lg:text-sm text-purple-100">Protein</p>
                  </motion.div>
                  <motion.div 
                    className="text-center"
                    variants={cardVariants}
                  >
                    <motion.span 
                      className="text-lg lg:text-xl font-semibold block"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                    >
                      {macros.carbs}g
                    </motion.span>
                    <p className="text-xs lg:text-sm text-purple-100">Carbs</p>
                  </motion.div>
                  <motion.div 
                    className="text-center"
                    variants={cardVariants}
                  >
                    <motion.span 
                      className="text-lg lg:text-xl font-semibold block"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                    >
                      {macros.fat}g
                    </motion.span>
                    <p className="text-xs lg:text-sm text-purple-100">Fat</p>
                  </motion.div>
                </motion.div>
              </div>
              {/* Hide target icon on mobile, show on lg+ screens */}
              <motion.div
                className="hidden lg:block"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Target className="w-12 h-12 text-purple-200" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!calculatedCalories && (
        <div className="card bg-amber-500/10 border border-amber-500/30">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-amber-300 font-semibold mb-2">Calculate Your Calories First</h3>
              <p className="text-amber-200/80 text-sm">
                Please use the Calorie Calculator to determine your daily calorie and macro goals before generating meal plans.
              </p>
            </div>
          </div>
        </div>
      )}

      {!preferences && calculatedCalories && (
        <div className="card bg-blue-500/10 border border-blue-500/30">
          <div className="flex items-start space-x-3">
            <User className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-blue-300 font-semibold mb-2">Set Your Food Preferences</h3>
              <p className="text-blue-200/80 text-sm mb-4">
                Tell us your preferred proteins, carbs, and other foods to get personalized meal suggestions.
              </p>
              <button
                onClick={openPreferencesModal}
                className="btn-primary flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Set Preferences</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Meal Plan Display */}
      {mealPlan && preferences && (
        <div className="space-y-6">
          <MealSection
            title="Breakfast"
            meal={mealPlan.breakfast}
            icon={<Clock className="w-5 h-5" />}
            time="7:00 - 9:00 AM"
          />
          
          <MealSection
            title="Lunch"
            meal={mealPlan.lunch}
            icon={<ChefHat className="w-5 h-5" />}
            time="12:00 - 2:00 PM"
          />
          
          <MealSection
            title="Dinner"
            meal={mealPlan.dinner}
            icon={<ChefHat className="w-5 h-5" />}
            time="7:00 - 9:00 PM"
          />
          
          <SnackSection snacks={mealPlan.snacks} />
        </div>
      )}

      {isGenerating && (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <LoadingSpinner />
            <p className="text-gray-400 mt-4">Generating your personalized meal plan...</p>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      <PreferencesModal
        isOpen={showPreferencesModal}
        onClose={closePreferencesModal}
        onSave={handlePreferencesSave}
      />

      {/* Change Preferences Confirmation Modal */}
      <Modal
        isOpen={showChangeConfirmModal}
        onClose={() => setShowChangeConfirmModal(false)}
        title="Change Food Preferences"
      >
        <div className="p-6">
          <div className="flex items-start space-x-3 mb-6">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-amber-300 font-semibold mb-2">Reset Your Preferences</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                This will clear your current food preferences and meal plan. You'll need to select your preferred foods again to generate a new meal plan.
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowChangeConfirmModal(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Clear preferences and show preferences modal
                setPreferences(null)
                setMealPlan(null)
                if (user?.id) {
                  localStorage.removeItem(`desi-tracker-meal-preferences-${user.id}`)
                }
                setShowChangeConfirmModal(false)
                setShowPreferencesModal(true)
              }}
              className="btn-primary flex-1"
            >
              Continue
            </button>
          </div>
        </div>
      </Modal>
    </motion.div>
  )
}

const MealSection = ({ title, meal, icon, time }) => {
  return (
    <motion.div 
      className="card"
      variants={cardVariants}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <motion.div 
            className="p-2 rounded-lg bg-purple-500/20 text-purple-400"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.div>
          <div>
            <motion.h3 
              className="text-lg font-semibold text-white"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {title}
            </motion.h3>
            <motion.p 
              className="text-gray-400 text-sm"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {time}
            </motion.p>
          </div>
        </div>
        
        <motion.div 
          className="text-right"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <p className="text-purple-400 font-semibold">{meal.targetCalories} cal</p>
          <p className="text-gray-500 text-sm">
            P:{meal.targetMacros.protein}g C:{meal.targetMacros.carbs}g F:{meal.targetMacros.fat}g
          </p>
        </motion.div>
      </div>

      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <div>
          <motion.h4 
            className="text-white font-medium mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            {meal.name}
          </motion.h4>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <h5 className="text-gray-300 font-medium mb-2">Ingredients:</h5>
              <ul className="space-y-1">
                {meal.foods.map((food, index) => (
                  <motion.li 
                    key={index} 
                    className="text-gray-400 text-sm flex justify-between"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.6 + index * 0.05 }}
                  >
                    <span>{food.name}</span>
                    <span className="text-purple-400">{food.amount}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <h5 className="text-gray-300 font-medium mb-2">Cooking Tips:</h5>
              <ul className="space-y-1">
                {meal.cookingTips.map((tip, index) => (
                  <motion.li 
                    key={index} 
                    className="text-gray-400 text-sm"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.7 + index * 0.05 }}
                  >
                    • {tip}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

const SnackSection = ({ snacks }) => {
  return (
    <motion.div 
      className="card"
      variants={cardVariants}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <motion.div 
            className="p-2 rounded-lg bg-green-500/20 text-green-400"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Plus className="w-5 h-5" />
          </motion.div>
          <div>
            <motion.h3 
              className="text-lg font-semibold text-white"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              Snacks
            </motion.h3>
            <motion.p 
              className="text-gray-400 text-sm"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              Throughout the day
            </motion.p>
          </div>
        </div>
        
        <motion.div 
          className="text-right"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <p className="text-green-400 font-semibold">{snacks.targetCalories} cal</p>
          <p className="text-gray-500 text-sm">Optional</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <motion.h4 
          className="text-white font-medium mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          {snacks.name}
        </motion.h4>
        <motion.p 
          className="text-purple-400 font-medium mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          Recommended: {snacks.recommendation}
        </motion.p>
        <div>
          <motion.h5 
            className="text-gray-300 font-medium mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            Other Options:
          </motion.h5>
          <ul className="space-y-1">
            {snacks.options.map((option, index) => (
              <motion.li 
                key={index} 
                className="text-gray-400 text-sm"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: 0.8 + index * 0.1 }}
              >
                • {option}
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    </motion.div>
  )
}

const PreferencesModal = ({ isOpen, onClose, onSave }) => {
  const [modalPreferences, setModalPreferences] = useState({
    proteins: [],
    carbs: [],
    fats: [],
    vegetables: [],
    fruits: [],
    dietaryRestrictions: [],
    allergies: []
  })

  useEffect(() => {
    // Always start fresh when modal opens - don't pre-load existing preferences
    if (isOpen) {
      console.log('📋 Starting fresh preference selection')
      setModalPreferences({
        proteins: [],
        carbs: [],
        fats: [],
        vegetables: [],
        fruits: [],
        dietaryRestrictions: [],
        allergies: []
      })
    }
  }, [isOpen])

  const foodOptions = {
    proteins: [
      'Egg (Whole)', 'Chicken Breast (Uncooked)', 'Chicken Thigh (Uncooked)', 'Beef Leg (Uncooked)', 
      'Goat Leg (Uncooked)', 'Salmon (Uncooked)', 'Tuna (Uncooked)', 'Paneer (Fresh Cheese)', 
      'Dal (Uncooked)', 'Dal Masoor (Uncooked)', 'Greek Yogurt', 'Yogurt'
    ],
    carbs: [
      'White Rice (Cooked)', 'Roti (Whole Wheat, Cooked)', 'Chapati (Cooked)', 'Oats (Uncooked)',
      'Naan (Cooked)', 'Khameeri Roti (Cooked)', 'Potato (boiled)', 'Kabuli Chana (Uncooked)', 
      'Kala Chana (Uncooked)', 'Toor Dal (Uncooked)'
    ],
    fats: [
      'Desi Ghee', 'Oil', 'Butter', 'Avocado', 'Sesame Seeds', 'Flax Seeds', 
      'Chia Seeds', 'Sunflower Seeds', 'Pumpkin Seeds (Pepitas)'
    ],
    vegetables: [
      'Spinach', 'Carrot', 'Cauliflower', 'Bell Pepper (Capsicum)', 'Onion',
      'Tomato', 'Cucumber', 'Ladyfinger (Bhindi / Okra)', 'Eggplant (Brinjal)', 
      'Cabbage', 'Pumpkin (Kaddu)', 'Round Gourd (Tinda)'
    ],
    fruits: [
      'Apple', 'Banana', 'Orange', 'Mango', 'Grapes', 'Pomegranate', 
      'Papaya', 'Watermelon', 'Guava', 'Dates (Khajoor)', 'Strawberries', 'Melon'
    ]
  }

  const handleFoodToggle = (category, food) => {
    console.log(`🔄 Toggling ${category}: ${food}`)
    setModalPreferences(prev => {
      const current = prev[category] || []
      const isSelected = current.includes(food)
      
      const updated = {
        ...prev,
        [category]: isSelected 
          ? current.filter(item => item !== food)
          : [...current, food]
      }
      
      console.log(`✅ Updated ${category}:`, updated[category])
      return updated
    })
  }

  const handleSave = () => {
    // Validate that at least one option is selected for each main category
    if (modalPreferences.proteins.length === 0 || modalPreferences.carbs.length === 0) {
      alert('Please select at least one protein and one carb source.')
      return
    }

    console.log('💾 Modal saving preferences:', modalPreferences)
    onSave(modalPreferences)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Set Your Food Preferences"
      size="xl"
    >
      <div className="p-6 space-y-6">
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-blue-200/80 text-sm">
            Select your preferred foods for each category to generate a personalized meal plan. You can change these anytime by clicking "Change Preferences" to start fresh.
          </p>
        </div>

        {Object.entries(foodOptions).map(([category, options]) => (
          <div key={category}>
            <h4 className="text-white font-medium mb-3 capitalize">
              {category} {(category === 'proteins' || category === 'carbs') && '*'}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {options.map(option => (
                <button
                  key={option}
                  onClick={() => handleFoodToggle(category, option)}
                  className={`p-3 rounded-lg border text-sm transition-colors text-left ${
                    modalPreferences[category]?.includes(option)
                      ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                      : 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="flex space-x-3 pt-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn-primary flex-1"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default MealPlan