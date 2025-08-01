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

  // Simplified animation variants
  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Calculator className="w-8 h-8 text-purple-400 mr-3" />
          <h1 className="text-3xl font-bold text-white">
            Calorie Calculator
          </h1>
        </div>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Calculate your daily calories and 
          get personalized macros recommendations for your fitness goals.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Calculator Form */}
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Target className="w-5 h-5 mr-2 text-purple-400" />
            Your Information
          </h2>

          <div className="space-y-4">
            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Age *
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="input"
                placeholder="Enter your age"
                min="13"
                max="120"
              />
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Weight (kg) *
              </label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="input"
                placeholder="Enter your weight"
                min="20"
                max="500"
              />
            </div>

            {/* Height */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Height (cm) *
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="input"
                placeholder="Enter your height"
                min="50"
                max="250"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Gender
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`p-3 rounded-lg border transition-colors ${
                    gender === 'male'
                      ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                      : 'border-gray-600 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`p-3 rounded-lg border transition-colors ${
                    gender === 'female'
                      ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                      : 'border-gray-600 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            {/* Activity Level */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Activity Level
              </label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="input"
              >
                <option value="sedentary">Sedentary (little/no exercise)</option>
                <option value="lightly_active">Lightly Active (light exercise 1-3 days/week)</option>
                <option value="moderately_active">Moderately Active (moderate exercise 3-5 days/week)</option>
                <option value="very_active">Very Active (hard exercise 6-7 days/week)</option>
                <option value="extremely_active">Extremely Active (very hard exercise, physical job)</option>
              </select>
            </div>

            {/* Goal */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Goal
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'lose', label: 'Lose'},
                  { value: 'maintain', label: 'Maintain' },
                  { value: 'gain', label: 'Gain' }
                ].map((goalOption) => (
                  <button
                    key={goalOption.value}
                    type="button"
                    onClick={() => setGoal(goalOption.value)}
                    className={`p-3 rounded-lg border transition-colors text-center ${
                      goal === goalOption.value
                        ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                        : 'border-gray-600 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    <div className="font-medium">{goalOption.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleCalculate}
                className="btn-primary flex-1 flex items-center justify-center space-x-2"
              >
                <Calculator className="w-4 h-4" />
                <span>Calculate</span>
              </button>
              <button
                onClick={handleReset}
                className="btn-secondary px-4"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {showResults && calculatedCalories ? (
              <motion.div
                key="results"
                {...fadeIn}
                transition={{ duration: 0.3 }}
              >
                {/* Calorie Results */}
                <div className="card">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                    Your Results
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Main Calorie Goal */}
                    <div className="bg-purple-600/20 border border-purple-500 rounded-lg p-4">
                      <div className="text-center">
                        <p className="text-purple-300 font-medium mb-1">
                          Daily Calories for {getGoalLabel(calculatedGoal || 'maintain')}
                        </p>
                        <p className="text-3xl font-bold text-white">
                          {calculatedCalories}
                        </p>
                        <p className="text-purple-300">
                          calories per day
                        </p>
                      </div>
                    </div>

                    {/* Goal Summary */}
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div className="flex justify-between items-center py-2 border-b border-gray-700">
                        <span className="text-gray-400">Activity Level:</span>
                        <span className="text-white">{getActivityLevelLabel(activityLevel).split('(')[0]}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-700">
                        <span className="text-gray-400">Goal:</span>
                        <span className="text-white">{getGoalLabel(calculatedGoal || 'maintain')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Macro Breakdown */}
                <div className="card">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-blue-400" />
                    Macro Breakdown
                  </h3>
                  
                  <div className="space-y-4">
                    <MacroBar 
                      label="Protein" 
                      value={macros.protein} 
                      unit="g" 
                      color="red" 
                      percentage={25}
                    />
                    <MacroBar 
                      label="Carbs" 
                      value={macros.carbs} 
                      unit="g" 
                      color="blue" 
                      percentage={45}
                    />
                    <MacroBar 
                      label="Fat" 
                      value={macros.fat} 
                      unit="g" 
                      color="yellow" 
                      percentage={30}
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="card" key="empty">
                <div className="text-center py-12">
                  <Calculator className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">
                    Ready to Calculate
                  </h3>
                  <p className="text-gray-500">
                    Fill in your information and click "Calculate" to see your personalized calorie and macro recommendations.
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

const MacroBar = ({ label, value, unit, color, percentage }) => {
  const colorClasses = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500'
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-300 font-medium">
          {label}
        </span>
        <span className="text-white">
          {value}{unit} ({percentage}%)
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
        <motion.div 
          className={`h-2 rounded-full ${colorClasses[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}

export default CaloriesCalculator