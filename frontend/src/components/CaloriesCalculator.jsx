import { useEffect } from 'react'
import { Calculator, Target, Activity, TrendingUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCalorieStore } from '../stores/calorieStore'
import { useAuthStore } from '../stores/authStore'
import toast from 'react-hot-toast'

const CaloriesCalculator = () => {
  const {
    age, weight, height, gender, activityLevel, goal,
    setAge, setWeight, setHeight, setGender, setActivityLevel, setGoal,
    calculateCalories, calculatedCalories, calculatedGoal, macros, resetCalculator,
    getActivityLevelLabel, getGoalLabel, loadFromUserProfile
  } = useCalorieStore()

  const { user } = useAuthStore()

  // Show results if there are calculated calories (from persistence or calculation)
  const showResults = calculatedCalories !== null

  // Load user profile data when component mounts
  useEffect(() => {
    if (user) {
      loadFromUserProfile(user)
    }
  }, [user, loadFromUserProfile])

  const handleCalculate = () => {
    if (!age || !weight || !height) {
      toast.error('Please fill in all required fields')
      return
    }

    calculateCalories()
    toast.success('Calories calculated successfully!')
  }


  const handleReset = () => {
    resetCalculator()
    toast.success('Calculator reset')
  }

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  }

  const cardVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  }

  return (
    <motion.div 
      className="max-w-4xl mx-auto space-y-8"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {/* Header */}
      <motion.div 
        className="text-center"
        variants={itemVariants}
      >
        <motion.div 
          className="flex items-center justify-center mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Calculator className="w-8 h-8 text-purple-400 mr-3" />
          </motion.div>
          <motion.h1 
            className="text-3xl font-bold text-white"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            Calorie Calculator
          </motion.h1>
        </motion.div>
        <motion.p 
          className="text-gray-300 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          Calculate your daily calories and 
          get personalized macros recommendations for your fitness goals.
        </motion.p>
      </motion.div>

      <motion.div 
        className="grid lg:grid-cols-2 gap-8"
        variants={itemVariants}
      >
        {/* Calculator Form */}
        <motion.div 
          className="card"
          variants={cardVariants}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        >
          <motion.h2 
            className="text-xl font-semibold text-white mb-6 flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <Target className="w-5 h-5 mr-2 text-purple-400" />
            </motion.div>
            Your Information
          </motion.h2>

          <motion.div 
            className="space-y-4"
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            {/* Age */}
            <motion.div variants={itemVariants}>
              <motion.label 
                className="block text-sm font-medium text-gray-300 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                Age *
              </motion.label>
              <motion.input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="input"
                placeholder="Enter your age"
                min="13"
                max="120"
                whileFocus={{ scale: 1.02, borderColor: '#8B5CF6' }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>

            {/* Weight */}
            <motion.div variants={itemVariants}>
              <motion.label 
                className="block text-sm font-medium text-gray-300 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                Weight (kg) *
              </motion.label>
              <motion.input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="input"
                placeholder="Enter your weight"
                min="20"
                max="500"
                whileFocus={{ scale: 1.02, borderColor: '#8B5CF6' }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>

            {/* Height */}
            <motion.div variants={itemVariants}>
              <motion.label 
                className="block text-sm font-medium text-gray-300 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                Height (cm) *
              </motion.label>
              <motion.input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="input"
                placeholder="Enter your height"
                min="50"
                max="250"
                whileFocus={{ scale: 1.02, borderColor: '#8B5CF6' }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>

            {/* Gender */}
            <motion.div variants={itemVariants}>
              <motion.label 
                className="block text-sm font-medium text-gray-300 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                Gender
              </motion.label>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`p-3 rounded-lg border transition-colors ${
                    gender === 'male'
                      ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                      : 'border-gray-600 text-gray-400 hover:border-gray-500'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  Male
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`p-3 rounded-lg border transition-colors ${
                    gender === 'female'
                      ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                      : 'border-gray-600 text-gray-400 hover:border-gray-500'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  Female
                </motion.button>
              </div>
            </motion.div>

            {/* Activity Level */}
            <motion.div variants={itemVariants}>
              <motion.label 
                className="block text-sm font-medium text-gray-300 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                Activity Level
              </motion.label>
              <motion.select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="input"
                whileFocus={{ scale: 1.02, borderColor: '#8B5CF6' }}
                transition={{ duration: 0.2 }}
              >
                <option value="sedentary">Sedentary (little/no exercise)</option>
                <option value="lightly_active">Lightly Active (light exercise 1-3 days/week)</option>
                <option value="moderately_active">Moderately Active (moderate exercise 3-5 days/week)</option>
                <option value="very_active">Very Active (hard exercise 6-7 days/week)</option>
                <option value="extremely_active">Extremely Active (very hard exercise, physical job)</option>
              </motion.select>
            </motion.div>

            {/* Goal */}
            <motion.div variants={itemVariants}>
              <motion.label 
                className="block text-sm font-medium text-gray-300 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                Goal
              </motion.label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'lose', label: 'Lose'},
                  { value: 'maintain', label: 'Maintain' },
                  { value: 'gain', label: 'Gain' }
                ].map((goalOption, index) => (
                  <motion.button
                    key={goalOption.value}
                    type="button"
                    onClick={() => setGoal(goalOption.value)}
                    className={`p-3 rounded-lg border transition-colors text-center ${
                      goal === goalOption.value
                        ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                        : 'border-gray-600 text-gray-400 hover:border-gray-500'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  >
                    <div className="font-medium">{goalOption.label}</div>
                    <div className="text-xs opacity-75">{goalOption.desc}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              className="flex space-x-3 pt-4"
              variants={itemVariants}
            >
              <motion.button
                onClick={handleCalculate}
                className="btn-primary flex-1 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 }}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Calculator className="w-4 h-4" />
                </motion.div>
                <span>Calculate</span>
              </motion.button>
              <motion.button
                onClick={handleReset}
                className="btn-secondary px-4"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.9 }}
              >
                Reset
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Results */}
        <motion.div 
          className="space-y-6"
          variants={itemVariants}
        >
          <AnimatePresence mode="wait">
            {showResults && calculatedCalories ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* Calorie Results */}
                <motion.div 
                  className="card"
                  variants={cardVariants}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                >
                  <motion.h3 
                    className="text-xl font-semibold text-white mb-4 flex items-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                    </motion.div>
                    Your Results
                  </motion.h3>
                
                  <motion.div 
                    className="space-y-4"
                    variants={containerVariants}
                    initial="initial"
                    animate="animate"
                  >
                    {/* Main Calorie Goal */}
                    <motion.div 
                      className="bg-purple-600/20 border border-purple-500 rounded-lg p-4"
                      variants={cardVariants}
                      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    >
                      <div className="text-center">
                        <motion.p 
                          className="text-purple-300 font-medium mb-1"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                        >
                          Daily Calories for {getGoalLabel(calculatedGoal || 'maintain')}
                        </motion.p>
                        <motion.p 
                          className="text-3xl font-bold text-white"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 200 }}
                        >
                          {calculatedCalories}
                        </motion.p>
                        <motion.p 
                          className="text-purple-300"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.4 }}
                        >
                          calories per day
                        </motion.p>
                      </div>
                    </motion.div>

                    {/* Goal Summary */}
                    <motion.div 
                      className="grid grid-cols-1 gap-3 text-sm"
                      variants={cardVariants}
                    >
                      <motion.div 
                        className="flex justify-between items-center py-2 border-b border-gray-700"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                      >
                        <span className="text-gray-400">Activity Level:</span>
                        <span className="text-white">{getActivityLevelLabel(activityLevel).split('(')[0]}</span>
                      </motion.div>
                      <motion.div 
                        className="flex justify-between items-center py-2 border-b border-gray-700"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.6 }}
                      >
                        <span className="text-gray-400">Goal:</span>
                        <span className="text-white">{getGoalLabel(calculatedGoal || 'maintain')}</span>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Macro Breakdown */}
                <motion.div 
                  className="card"
                  variants={cardVariants}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                >
                  <motion.h3 
                    className="text-xl font-semibold text-white mb-4 flex items-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Activity className="w-5 h-5 mr-2 text-blue-400" />
                    </motion.div>
                    Macro Breakdown
                  </motion.h3>
                  
                  <motion.div 
                    className="space-y-4"
                    variants={containerVariants}
                    initial="initial"
                    animate="animate"
                  >
                    <motion.div variants={itemVariants}>
                      <MacroBar 
                        label="Protein" 
                        value={macros.protein} 
                        unit="g" 
                        color="red" 
                        percentage={25}
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <MacroBar 
                        label="Carbs" 
                        value={macros.carbs} 
                        unit="g" 
                        color="blue" 
                        percentage={45}
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <MacroBar 
                        label="Fat" 
                        value={macros.fat} 
                        unit="g" 
                        color="yellow" 
                        percentage={30}
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div 
                className="card"
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-center py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                  >
                    <Calculator className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  </motion.div>
                  <motion.h3 
                    className="text-xl font-semibold text-gray-400 mb-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    Ready to Calculate
                  </motion.h3>
                  <motion.p 
                    className="text-gray-500"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    Fill in your information and click "Calculate" to see your personalized calorie and macro recommendations.
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Info Section */}
     
    </motion.div>
  )
}

const MacroBar = ({ label, value, unit, color, percentage }) => {
  const colorClasses = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex justify-between items-center mb-2">
        <motion.span 
          className="text-gray-300 font-medium"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {label}
        </motion.span>
        <motion.span 
          className="text-white"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {value}{unit} ({percentage}%)
        </motion.span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
        <motion.div 
          className={`h-2 rounded-full ${colorClasses[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  )
}

export default CaloriesCalculator