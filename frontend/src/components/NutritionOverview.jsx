import { useEffect } from 'react'
import { Target, TrendingUp, Zap } from 'lucide-react'
import { useFoodStore } from '../stores/foodStore'
import { useAuthStore } from '../stores/authStore'

const NutritionOverview = () => {
  const { user, isReady } = useAuthStore()
  const { dailyTotals, fetchTodayEntries } = useFoodStore()

  useEffect(() => {
    if (isReady()) {
      fetchTodayEntries()
    }
  }, [fetchTodayEntries, isReady])

  const goals = {
    calories: user?.calorieGoal || 0,
    protein: user?.proteinGoal || 0,
    carbs: user?.carbGoal || 0,
    fat: user?.fatGoal || 0
  }

  const consumed = {
    calories: dailyTotals.calories || 0,
    protein: dailyTotals.protein || 0,
    carbs: dailyTotals.carbs || 0,
    fat: dailyTotals.fat || 0
  }

  const getPercentage = (consumed, goal) => {
    if (!goal) return 0
    return Math.min(Math.round((consumed / goal) * 100), 100)
  }

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'text-green-400'
    if (percentage >= 75) return 'text-yellow-400'
    return 'text-gray-400'
  }

  const getProgressBarColor = (percentage) => {
    if (percentage >= 100) return 'bg-green-500'
    if (percentage >= 75) return 'bg-yellow-500'
    return 'bg-purple-500'
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <Target className="w-5 h-5 mr-2 text-purple-400" />
          Today's Nutrition
        </h3>
        <div className="text-right">
          <p className="text-sm text-gray-400">Foods logged</p>
          <p className="text-white font-semibold">{dailyTotals.entries}</p>
        </div>
      </div>

      {goals.calories > 0 ? (
        <div className="space-y-6">
          {/* Calories */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="text-gray-300 font-medium">Calories</span>
              </div>
              <div className="text-right">
                <span className="text-white font-semibold">
                  {consumed.calories} / {goals.calories}
                </span>
                <span className={`ml-2 text-sm ${getProgressColor(getPercentage(consumed.calories, goals.calories))}`}>
                  {getPercentage(consumed.calories, goals.calories)}%
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(getPercentage(consumed.calories, goals.calories))}`}
                style={{ width: `${getPercentage(consumed.calories, goals.calories)}%` }}
              />
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>0</span>
              <span>{goals.calories} cal</span>
            </div>
          </div>

          {/* Macros */}
          <div className="grid grid-cols-3 gap-4">
            {/* Protein */}
            <MacroCard
              label="Protein"
              consumed={consumed.protein}
              goal={goals.protein}
              unit="g"
              color="red"
            />

            {/* Carbs */}
            <MacroCard
              label="Carbs"
              consumed={consumed.carbs}
              goal={goals.carbs}
              unit="g"
              color="blue"
            />

            {/* Fat */}
            <MacroCard
              label="Fat"
              consumed={consumed.fat}
              goal={goals.fat}
              unit="g"
              color="yellow"
            />
          </div>

          {/* Remaining Calories */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Remaining Calories</span>
              <span className={`font-semibold ${
                goals.calories - consumed.calories >= 0 
                  ? 'text-green-400' 
                  : 'text-red-400'
              }`}>
                {goals.calories - consumed.calories} cal
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-400 mb-2">Set Your Goals</h4>
          <p className="text-gray-500 mb-4">
            Calculate your calorie needs to start tracking your nutrition progress.
          </p>
          <button className="btn-outline text-sm">
            Calculate Calories
          </button>
        </div>
      )}
    </div>
  )
}

const MacroCard = ({ label, consumed, goal, unit, color }) => {
  const percentage = goal > 0 ? Math.min(Math.round((consumed / goal) * 100), 100) : 0
  
  const colorClasses = {
    red: 'text-red-400 bg-red-500',
    blue: 'text-blue-400 bg-blue-500',
    yellow: 'text-yellow-400 bg-yellow-500'
  }

  const [textColor, bgColor] = colorClasses[color].split(' ')

  return (
    <div className="text-center">
      <div className="relative w-16 h-16 mx-auto mb-2">
        {/* Background circle */}
        <div className="w-16 h-16 rounded-full bg-gray-700"></div>
        
        {/* Progress circle */}
        <div 
          className="absolute inset-0 rounded-full border-4 border-transparent transition-all duration-300"
          style={{
            background: `conic-gradient(rgb(${bgColor === 'bg-red-500' ? '239 68 68' : bgColor === 'bg-blue-500' ? '59 130 246' : '234 179 8'}) ${percentage * 3.6}deg, transparent 0deg)`
          }}
        >
          <div className="w-full h-full rounded-full bg-gray-800 m-1"></div>
        </div>
        
        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xs font-semibold ${textColor}`}>
            {percentage}%
          </span>
        </div>
      </div>
      
      <div>
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        <p className="text-sm font-medium text-white">
          {consumed}{unit}
        </p>
        <p className="text-xs text-gray-500">
          / {goal}{unit}
        </p>
      </div>
    </div>
  )
}

export default NutritionOverview