import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Calendar, Target, Scale } from 'lucide-react'
import { useFoodStore } from '../stores/foodStore'
import { useCalorieStore } from '../stores/calorieStore'
import { useAuthStore } from '../stores/authStore'

// Simplified animation variants - removed unused variants

const MonthlyProgress = () => {
  const { user } = useAuthStore()
  const { calculatedCalories, calculateTDEE, weight, goal } = useCalorieStore()
  const { fetchMonthlyTotals, monthlyTotals, isLoadingMonthly } = useFoodStore()
  const [weeklyPredictions, setWeeklyPredictions] = useState([])

  useEffect(() => {
    fetchMonthlyTotals()
  }, [fetchMonthlyTotals])

  useEffect(() => {
    if (monthlyTotals.length > 0) {
      calculateWeeklyCalories()
    }
  }, [monthlyTotals])

  const calculateWeeklyCalories = () => {
    if (monthlyTotals.length === 0) {
      setWeeklyPredictions([])
      return
    }

    // Create a map of all monthly data by date for easy lookup
    const dataByDate = {}
    monthlyTotals.forEach(day => {
      dataByDate[day.date] = day
    })

    // Find the first day with actual tracking data
    const daysWithData = monthlyTotals.filter(day => day.entries > 0 || day.calories > 0)
    
    if (daysWithData.length === 0) {
      setWeeklyPredictions([])
      return
    }

    // Sort to find the earliest tracking date
    const sortedDays = daysWithData.sort((a, b) => new Date(a.date) - new Date(b.date))
    const firstTrackingDate = new Date(sortedDays[0].date)
    console.log('📊 All monthly data:', monthlyTotals.map(d => `${d.date}: ${d.calories} cal, ${d.entries} entries`))
    console.log('📊 Days with data:', daysWithData.map(d => `${d.date}: ${d.calories} cal, ${d.entries} entries`))
    console.log('📊 First tracking date:', firstTrackingDate.toISOString().split('T')[0])
    
    // Create weeks starting from the first tracking date
    const weeksData = []
    const today = new Date()
    
    for (let weekNum = 0; weekNum < 4; weekNum++) {
      // Calculate week start and end dates
      const weekStartDate = new Date(firstTrackingDate)
      weekStartDate.setDate(firstTrackingDate.getDate() + (weekNum * 7))
      
      const weekEndDate = new Date(weekStartDate)
      weekEndDate.setDate(weekStartDate.getDate() + 6)
      
      // Don't create weeks that start in the future
      if (weekStartDate > today) {
        break
      }
      
      // Collect all days in this week period
      const weekDays = []
      let totalCalories = 0
      let daysWithTracking = 0
      
      for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const currentDate = new Date(weekStartDate)
        currentDate.setDate(weekStartDate.getDate() + dayOffset)
        
        // Don't include future dates
        if (currentDate > today) {
          break
        }
        
        const dateString = currentDate.getFullYear() + '-' + 
                          String(currentDate.getMonth() + 1).padStart(2, '0') + '-' + 
                          String(currentDate.getDate()).padStart(2, '0')
        
        const dayData = dataByDate[dateString]
        if (dayData) {
          weekDays.push(dayData)
          totalCalories += dayData.calories || 0
          if (dayData.entries > 0 || dayData.calories > 0) {
            daysWithTracking++
          }
          console.log(`📊 Week ${weekNum + 1}, Day ${dateString}: ${dayData.calories} cal, ${dayData.entries} entries`)
        } else {
          console.log(`📊 Week ${weekNum + 1}, Day ${dateString}: NO DATA`)
        }
      }
      
      // Only include weeks that have some tracking data
      if (daysWithTracking > 0) {
        const avgCalories = daysWithTracking > 0 ? Math.round(totalCalories / daysWithTracking) : 0
        
        // For date range display, show the full week range even if not all days are tracked yet
        
        weeksData.push({
          week: weekNum + 1,
          totalCalories,
          avgCalories,
          dateRange: `${weekStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEndDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
          daysTracked: daysWithTracking,
          actualDays: weekDays.length,
          weekStartDate: weekStartDate.toISOString().split('T')[0],
          weekEndDate: weekEndDate.toISOString().split('T')[0]
        })
      }
    }
    
    console.log('📊 Final weeks data:', weeksData)
    setWeeklyPredictions(weeksData)
  }


  const totalMonthlyCalories = monthlyTotals.reduce((sum, day) => sum + day.calories, 0)
  const totalMonthlyGoal = calculatedCalories ? calculatedCalories * monthlyTotals.length : 0
  const monthlyDeficit = totalMonthlyGoal - totalMonthlyCalories
  
  // Get goal display information
  const getGoalDisplayInfo = () => {
    switch (goal) {
      case 'lose':
        return {
          text: 'Weight Loss',
          color: 'bg-green-500/20 text-green-400 border border-green-500/30',
          icon: TrendingDown
        }
      case 'gain':
        return {
          text: 'Weight Gain',
          color: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
          icon: TrendingUp
        }
      case 'maintain':
      default:
        return {
          text: 'Maintain Weight',
          color: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
          icon: Target
        }
    }
  }
  
  const goalInfo = getGoalDisplayInfo()

  // Calculate theoretical predicted weight change (if user sticks to calorie goal)
  const calculateTheoreticalWeightChange = () => {
    if (!calculatedCalories) return 0
    
    // Get the user's TDEE (maintenance calories)
    const tdee = calculateTDEE()
    if (!tdee) return 0
    
    // Calculate the deficit/surplus based on their goal
    // calculatedCalories is their target daily intake
    const dailyDeficit = tdee - calculatedCalories
    const fourWeekDeficit = dailyDeficit * 28 // 4 weeks = 28 days
    const theoreticalWeightChange = -fourWeekDeficit / 7700 // negative for weight loss, positive for gain
    
    return theoreticalWeightChange
  }
  
  const theoreticalWeightChange = calculateTheoreticalWeightChange()

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Scale className="w-6 h-6 text-purple-400 mr-3" />
            Monthly Progress Tracker
          </h2>
          
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${goalInfo.color}`}>
            <div className="flex items-center space-x-1">
              <goalInfo.icon className="w-4 h-4" />
              <span>{goalInfo.text}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Current Weight */}
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Current Weight</p>
            <p className="text-3xl font-bold text-white">{weight || user?.weight || '70'} kg</p>
          </div>
          
          {/* Monthly Intake Goal */}
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Your monthly intake should be (KCal)</p>
            <p className={`text-3xl font-bold ${
              calculatedCalories 
                ? 'text-blue-400'
                : 'text-gray-400'
            }`}>
              {calculatedCalories 
                ? `${(calculatedCalories * monthlyTotals.length).toLocaleString()} cal`
                : 'Not Set'
              }
            </p>
          </div>
          
          {/* Predicted Change */}
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Predicted Change</p>
            <p className={`text-3xl font-bold ${theoreticalWeightChange < 0 ? 'text-green-400' : 'text-red-400'}`}>
              {theoreticalWeightChange >= 0 ? '+' : ''}{theoreticalWeightChange.toFixed(1)} kg
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Calorie Chart */}
      <div className="card">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Calendar className="w-5 h-5 text-purple-400 mr-2" />
          {weeklyPredictions.length > 0 ? `${weeklyPredictions.length}-Week` : '4-Week'} Calorie Intake Chart
        </h3>

        {isLoadingMonthly ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400" />
          </div>
        ) : weeklyPredictions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Not enough data to display weekly chart</p>
            <p className="text-gray-500 text-sm">Start tracking your meals to see weekly calorie trends</p>
          </div>
        ) : (
          <>
            {/* Chart Bars */}
            <div className="mb-8">
              <div className="flex items-end justify-between h-48 bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                {weeklyPredictions.map((week) => {
                  const maxCalories = Math.max(...weeklyPredictions.map(w => w.totalCalories))
                  const height = (week.totalCalories / maxCalories) * 100
                  
                  return (
                    <div
                      key={week.week}
                      className="flex flex-col items-center flex-1 mx-2"
                    >
                      <motion.div
                        className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg relative group cursor-pointer"
                        style={{ height: `${height}%`, minHeight: '20px' }}
                        initial={{ height: '0%' }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      >
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="bg-gray-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap border border-gray-600">
                            <div className="font-semibold">{week.totalCalories.toLocaleString()} cal</div>
                            <div className="text-gray-400">Avg: {week.avgCalories} cal/day</div>
                            <div className="text-gray-400">{week.daysTracked} days tracked</div>
                          </div>
                        </div>
                      </motion.div>
                      
                      <div className="mt-3 text-center">
                        <p className="text-white font-semibold text-sm mb-1">Week {week.week}</p>
                        <p className="text-gray-400 text-xs">{week.dateRange}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Weekly Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {weeklyPredictions.map((week) => (
                <div
                  key={week.week}
                  className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                >
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-white mb-1">
                      Week {week.week}
                    </h4>
                    
                    <p className="text-gray-400 text-sm mb-3">
                      {week.dateRange}
                    </p>
                    
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500">Total Calories</p>
                        <p className="text-xl font-bold text-purple-400">
                          {week.totalCalories.toLocaleString()}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500">Daily Average</p>
                        <p className="text-sm font-semibold text-green-400">
                          {week.avgCalories} cal
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500">Days Tracked</p>
                        <p className="text-xs text-blue-400">
                          {week.daysTracked} days
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Information Note */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <Target className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-blue-400 font-medium text-sm mb-1">
                    Weekly Calorie Tracking:
                  </p>
                  <p className="text-blue-300 text-xs">
                    This chart shows your calorie intake over the past month. Make sure to accurately log your calories for effcient tracking of weight.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default MonthlyProgress