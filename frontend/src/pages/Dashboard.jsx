import { useState, useEffect } from 'react'
import { 
  Menu, 
  X, 
  Calculator,
  Utensils,
  TrendingUp,
  User,
  LogOut,
  ChefHat,
  Target,
  Activity,
  ChevronLeft,
  ChevronRight,
  Heart
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useFoodStore } from '../stores/foodStore'
import { useCalorieStore } from '../stores/calorieStore'
import CaloriesCalculator from '../components/CaloriesCalculator'
import FoodTracker from '../components/FoodTracker'
import CardioTracker from '../components/CardioTracker'

const Dashboard = () => {
  const { user, logout, isReady } = useAuthStore()
  const { fetchTodayEntries, checkAndUpdateDate } = useFoodStore()
  const [sidebarOpen, setSidebarOpen] = useState(true) // Default to open on desktop
  const [activeSection, setActiveSection] = useState('overview')

  useEffect(() => {
    // Set initial sidebar state based on screen size
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }

    // Set initial state
    handleResize()

    // Add event listener for window resize
    window.addEventListener('resize', handleResize)
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    // Only fetch data if user is fully authenticated and ready
    if (isReady()) {
      checkAndUpdateDate()
      fetchTodayEntries()
    }
  }, [fetchTodayEntries, checkAndUpdateDate, isReady])

  // Check for date changes every minute
  useEffect(() => {
    const interval = setInterval(() => {
      checkAndUpdateDate()
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [checkAndUpdateDate])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleSectionChange = (section) => {
    setActiveSection(section)
    // Only close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }

  const handleLogout = () => {
    logout()
  }

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'calculator', label: 'Calorie Calculator', icon: Calculator },
    { id: 'food-tracker', label: 'Food Tracker', icon: Utensils },
    { id: 'cardio-tracker', label: 'Log Cardio', icon: Heart }
  ]

  return (
    <div className="h-screen bg-gray-900 flex overflow-hidden">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 bg-gray-800 border-r border-gray-700 transform transition-all duration-300 ease-in-out
        ${sidebarOpen 
          ? 'w-64 translate-x-0' 
          : 'w-64 -translate-x-full lg:w-16 lg:translate-x-0'
        }
      `}>
        <div className={`flex flex-col h-full ${sidebarOpen ? '' : 'lg:items-center'}`}>
          {/* Logo */}
          <div className={`flex items-center justify-between p-6 ${sidebarOpen ? 'border-b border-gray-700' : 'lg:border-b-0'}`}>
            <div className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-purple-400 flex-shrink-0" />
              {sidebarOpen && (
                <span className="text-xl font-bold text-gradient whitespace-nowrap">DesiTracker</span>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>


          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleSectionChange(item.id)}
                      className={`w-full flex items-center rounded-lg transition-colors relative group ${
                        sidebarOpen ? 'space-x-3 px-4 py-3' : 'justify-center p-3'
                      } ${
                        activeSection === item.id
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                      title={!sidebarOpen ? item.label : ''}
                    >
                      <Icon size={20} className="flex-shrink-0" />
                      {sidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
                      
                      {/* Tooltip for collapsed state */}
                      {!sidebarOpen && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
                          {item.label}
                        </div>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-gray-700 space-y-4">
            {/* User Info */}
            {sidebarOpen ? (
              <div className="flex items-center space-x-3 px-4 py-2">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-white font-medium truncate">{user?.username}</p>
                  <p className="text-gray-400 text-sm truncate">{user?.email}</p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              </div>
            )}
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className={`w-full flex items-center rounded-lg transition-colors text-gray-300 hover:bg-gray-700 hover:text-white relative group ${
                sidebarOpen ? 'space-x-3 px-4 py-3' : 'justify-center p-3'
              }`}
              title={!sidebarOpen ? 'Logout' : ''}
            >
              <LogOut size={20} className="flex-shrink-0" />
              {sidebarOpen && <span>Logout</span>}
              
              {/* Tooltip for collapsed state */}
              {!sidebarOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
                  Logout
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Toggle Button - Arrow on sidebar edge at logo height */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex absolute -right-3 top-6 transform translate-y-3 w-6 h-8 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-r-md items-center justify-center transition-colors z-10 border border-gray-600 border-l-0"
        >
          {sidebarOpen ? (
            <ChevronLeft size={14} />
          ) : (
            <ChevronRight size={14} />
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Menu size={20} />
              </button>
              <h1 className="text-2xl font-bold text-white">
                {getSectionTitle(activeSection)}
              </h1>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto min-h-0">
          <div className="max-w-7xl mx-auto">
            {renderActiveSection(activeSection)}
          </div>
        </main>
      </div>
    </div>
  )
}

const getSectionTitle = (section) => {
  const titles = {
    overview: 'Dashboard Overview',
    calculator: 'Calorie Calculator',
    'food-tracker': 'Food Tracker',
    'cardio-tracker': 'Log Cardio'
  }
  return titles[section] || 'Dashboard'
}

const renderActiveSection = (section) => {
  switch (section) {
    case 'overview':
      return <DashboardOverview />
    case 'calculator':
      return <CaloriesCalculator />
    case 'food-tracker':
      return <FoodTracker />
    case 'cardio-tracker':
      return <CardioTracker />
    default:
      return <DashboardOverview />
  }
}

const DashboardOverview = () => {
  const { user } = useAuthStore()
  const { dailyTotals, getCurrentTrackingDateLabel, currentTrackingDate, setTrackingDate } = useFoodStore()
  const { calculatedCalories } = useCalorieStore()

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-purple rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Welcome back, {user?.username}! 👋
        </h2>
        <p className="text-purple-100">
          Track your nutrition and reach your fitness goals with DesiTracker
        </p>
      </div>

      {/* Date Tracking Section */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Current Day</h3>
              <p className="text-gray-400 text-sm">Your calories for</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-purple-400">{getCurrentTrackingDateLabel()}</p>
            <p className="text-gray-500 text-sm">{new Date(currentTrackingDate).toLocaleDateString()}</p>
          </div>
        </div>
        
        {/* Week Navigation */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="grid grid-cols-7 gap-1">
            {(() => {
              const today = new Date()
              const currentWeekStart = new Date(today)
              currentWeekStart.setDate(today.getDate() - today.getDay() + 1) // Start from Monday
              
              const weekDays = []
              for (let i = 0; i < 7; i++) {
                const date = new Date(currentWeekStart)
                date.setDate(currentWeekStart.getDate() + i)
                const dateString = date.toISOString().split('T')[0]
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
                const dayNumber = date.getDate()
                const isToday = dateString === today.toISOString().split('T')[0]
                const isSelected = dateString === currentTrackingDate
                
                weekDays.push(
                  <button
                    key={dateString}
                    onClick={() => setTrackingDate(dateString)}
                    className={`p-2 rounded-lg text-center transition-colors ${
                      isSelected
                        ? 'bg-purple-600 text-white'
                        : isToday
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-medium">{dayName}</div>
                    <div className="text-sm">{dayNumber}</div>
                  </button>
                )
              }
              return weekDays
            })()}
          </div>
        </div>
      </div>

      {/* Daily Calorie Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <DailyCalorieTracker
            consumed={dailyTotals.calories}
            goal={calculatedCalories || 2000}
          />
        </div>
        <div>
          <MacroStatsCard
            protein={dailyTotals.protein}
            carbs={dailyTotals.carbs}
            fat={dailyTotals.fat}
          />
        </div>
      </div>

      {/* Weekly Calorie Chart */}
      <WeeklyCalorieChart />
    </div>
  )
}


const DailyCalorieTracker = ({ consumed, goal }) => {
  const percentage = goal ? Math.round((consumed / goal) * 100) : 0
  const remaining = Math.max(goal - consumed, 0)
  const isExceeded = consumed > goal
  
  // Calculate the stroke-dasharray for the progress circle
  const radius = 90
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (Math.min(percentage, 100) / 100) * circumference

  return (
    <div className="card text-center">
      <h2 className="text-xl font-semibold text-white mb-6">
        Daily Calories(KCal)
      </h2>
      
      {/* Circular Progress */}
      <div className="relative w-48 h-48 mx-auto mb-6 ">
        <svg className="w-48 h-48 -rotate-90" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-700"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke={isExceeded ? "url(#redGradient)" : "url(#gradient)"}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-in-out"
          />
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#A855F7', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#EF4444', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#DC2626', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          
          <div className="text-white text-2xl font-bold">
            {consumed}/{goal}
          </div>
        </div>
      </div>
      
      {/* Progress text */}
      <p className="text-gray-400 text-sm">
        {isExceeded ? 'You have exceeded your intake' : `You have consumed ${percentage}% of your daily calories`}
      </p>
      
      {/* Remaining calories */}
      {remaining > 0 && (
        <p className="text-purple-400 text-sm mt-2">
          {remaining} calories remaining
        </p>
      )}
    </div>
  )
}

const MacroStatsCard = ({ protein, carbs, fat }) => {
  return (
    <div className="card">
      <h3 className="text-gray-300 font-medium mb-6">Daily Macros</h3>
      
      <div className="space-y-6">
        {/* Protein */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-red-400/10 text-red-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-gray-300 font-medium">Protein</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-white">{protein}</span>
            <span className="text-gray-400 ml-1">g</span>
          </div>
        </div>

        {/* Carbs */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-400/10 text-blue-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <span className="text-gray-300 font-medium">Carbs</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-white">{carbs}</span>
            <span className="text-gray-400 ml-1">g</span>
          </div>
        </div>

        {/* Fat */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-yellow-400/10 text-yellow-400">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <span className="text-gray-300 font-medium">Fat</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-white">{fat}</span>
            <span className="text-gray-400 ml-1">g</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const WeeklyCalorieChart = () => {
  const { fetchWeeklyTotals, weeklyTotals, isLoadingWeekly } = useFoodStore()
  const { calculatedCalories } = useCalorieStore()

  useEffect(() => {
    fetchWeeklyTotals()
  }, [fetchWeeklyTotals])

  // Generate current week dates (Monday to Sunday)
  const getWeekDates = () => {
    const today = new Date()
    const currentWeekStart = new Date(today)
    currentWeekStart.setDate(today.getDate() - today.getDay() + 1) // Start from Monday
    
    const weekDates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart)
      date.setDate(currentWeekStart.getDate() + i)
      weekDates.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: date.getDate()
      })
    }
    return weekDates
  }

  const weekDates = getWeekDates()
  const maxCalories = Math.max(...weeklyTotals.map(day => day.calories), calculatedCalories || 2000)
  
  // Calculate weekly totals
  const weeklyTotalCalories = weeklyTotals.reduce((sum, day) => sum + day.calories, 0)
  const weeklyGoal = calculatedCalories ? calculatedCalories * 7 : 14000
  const weeklyProgress = weeklyGoal > 0 ? Math.min((weeklyTotalCalories / weeklyGoal) * 100, 100) : 0

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Weekly Caloric Intake
        </h3>
        
        {/* Weekly Progress Bar */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm font-medium text-white">
              {weeklyTotalCalories.toLocaleString()} / {weeklyGoal.toLocaleString()} cal
            </p>
            <p className="text-xs text-gray-400">
              {Math.round(weeklyProgress)}% of weekly goal
            </p>
          </div>
          <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-500"
              style={{ width: `${weeklyProgress}%` }}
            />
          </div>
        </div>
      </div>

      {isLoadingWeekly ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-end justify-between h-48 px-2">
            {weekDates.map((day) => {
              const dayData = weeklyTotals.find(d => d.date === day.date)
              const calories = dayData?.calories || 0
              const height = maxCalories > 0 ? (calories / maxCalories) * 100 : 0
              const isToday = day.date === new Date().toISOString().split('T')[0]

              return (
                <div key={day.date} className="flex flex-col items-center flex-1 mx-1">
                  {/* Bar */}
                  <div className="w-full flex flex-col justify-end h-40 mb-2">
                    <div
                      className={`w-full rounded-t-md transition-all duration-500 ${
                        isToday
                          ? 'bg-gradient-to-t from-purple-600 to-purple-400'
                          : calories > 0
                          ? 'bg-gradient-to-t from-gray-600 to-gray-400'
                          : 'bg-gray-800'
                      }`}
                      style={{ height: `${Math.max(height, 2)}%` }}
                    />
                  </div>
                  
                  {/* Calories */}
                  <div className="text-center mb-2">
                    <p className={`text-sm font-semibold ${isToday ? 'text-purple-400' : 'text-white'}`}>
                      {calories}
                    </p>
                    <p className="text-xs text-gray-500">cal</p>
                  </div>
                  
                  {/* Day */}
                  <div className="text-center">
                    <p className={`text-xs font-medium ${isToday ? 'text-purple-400' : 'text-gray-300'}`}>
                      {day.dayName}
                    </p>
                    <p className={`text-xs ${isToday ? 'text-purple-300' : 'text-gray-500'}`}>
                      {day.dayNumber}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex justify-center items-center space-x-6 pt-4 border-t border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded bg-gradient-to-t from-purple-600 to-purple-400"></div>
              <span className="text-xs text-gray-400">Today</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded bg-gradient-to-t from-gray-600 to-gray-400"></div>
              <span className="text-xs text-gray-400">Other Days</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard