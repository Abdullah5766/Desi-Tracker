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
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'
import { useFoodStore } from '../stores/foodStore'
import { useCalorieStore } from '../stores/calorieStore'
import { useCardioStore } from '../stores/cardioStore'
import CaloriesCalculator from '../components/CaloriesCalculator'
import FoodTracker from '../components/FoodTracker'
import CardioTracker from '../components/CardioTracker'
import MealPlan from '../components/MealPlan'
import MonthlyProgress from '../components/MonthlyProgress'
import ConfirmationModal from '../components/ConfirmationModal'

// Animation variants

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.2 }
  }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
}

const Dashboard = () => {
  const { user, logout, isReady } = useAuthStore()
  const { fetchTodayEntries, checkAndUpdateDate } = useFoodStore()
  const [sidebarOpen, setSidebarOpen] = useState(false) // Default to closed
  const [activeSection, setActiveSection] = useState('overview')
  const [isMobile, setIsMobile] = useState(true) // Default to mobile (safer)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  useEffect(() => {
    // Set initial sidebar state based on screen size
    const handleResize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (mobile) {
        setSidebarOpen(false) // Always closed on mobile
      } else {
        setSidebarOpen(true) // Open on desktop
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
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  const handleLogout = () => {
    setShowLogoutModal(true)
  }

  const confirmLogout = () => {
    logout()
  }

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'calculator', label: 'Calorie Calculator', icon: Calculator },
    { id: 'food-tracker', label: 'Food Tracker', icon: Utensils },
    { id: 'cardio-tracker', label: 'Log Cardio', icon: Heart },
    { id: 'meal-plan', label: 'Meal Plan', icon: ChefHat },
    { id: 'monthly-progress', label: 'Monthly Progress', icon: Target }
  ]

  return (
    <div className="h-screen bg-gray-900 flex overflow-hidden">
      {/* Mobile backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(!isMobile || sidebarOpen) && (
          <motion.div 
            className={`
              ${isMobile ? 'fixed' : 'static'} inset-y-0 left-0 z-50 bg-gray-800 border-r border-gray-700
              ${(() => {
                if (isMobile) {
                  return 'w-64'
                } else {
                  return sidebarOpen ? 'w-64' : 'w-16'
                }
              })()}
            `}
            initial={{ x: isMobile ? -256 : 0, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isMobile ? -256 : 0, opacity: isMobile ? 0 : 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
        <div className={`flex flex-col h-full ${!sidebarOpen && !isMobile ? 'items-center' : ''}`}>
          {/* Logo */}
          <motion.div 
            className={`flex items-center justify-between p-6 ${sidebarOpen ? 'border-b border-gray-700' : 'lg:border-b-0'}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChefHat className="h-8 w-8 text-purple-400 flex-shrink-0" />
              </motion.div>
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span 
                    className="text-xl font-bold text-gradient whitespace-nowrap"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    DesiTracker
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            {isMobile && (
              <motion.button
                onClick={() => setSidebarOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>
            )}
          </motion.div>


          {/* Navigation */}
          <motion.nav 
            className="flex-1 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <motion.ul 
              className="space-y-2"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {sidebarItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.li 
                    key={item.id}
                    variants={cardVariants}
                    custom={index}
                  >
                    <motion.button
                      onClick={() => handleSectionChange(item.id)}
                      className={`w-full flex items-center rounded-lg transition-colors relative group ${
                        sidebarOpen ? 'space-x-3 px-4 py-3' : 'justify-center p-3'
                      } ${
                        activeSection === item.id
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                      title={!sidebarOpen ? item.label : ''}
                      whileHover={{ scale: 1.02, x: 2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Icon size={20} className="flex-shrink-0" />
                      </motion.div>
                      <AnimatePresence>
                        {sidebarOpen && (
                          <motion.span 
                            className="whitespace-nowrap"
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      
                      {/* Tooltip for collapsed state */}
                      <AnimatePresence>
                        {!sidebarOpen && (
                          <motion.div 
                            className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap z-50 pointer-events-none"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 0, x: 0 }}
                            whileHover={{ opacity: 1 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            {item.label}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </motion.li>
                )
              })}
            </motion.ul>
          </motion.nav>

          {/* User Info & Logout */}
          <motion.div 
            className="p-4 border-t border-gray-700 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {/* User Info */}
            <AnimatePresence mode="wait">
              {sidebarOpen ? (
                <motion.div 
                  className="flex items-center space-x-3 px-4 py-2"
                  key="expanded"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <User className="w-5 h-5 text-white" />
                  </motion.div>
                  <div className="min-w-0">
                    <motion.p 
                      className="text-white font-medium truncate"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {user?.username}
                    </motion.p>
                    <motion.p 
                      className="text-gray-400 text-sm truncate"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {user?.email}
                    </motion.p>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  className="flex justify-center"
                  key="collapsed"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <User className="w-5 h-5 text-white" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Logout Button */}
            <motion.button
              onClick={handleLogout}
              className={`w-full flex items-center rounded-lg transition-colors text-gray-300 hover:bg-gray-700 hover:text-white relative group ${
                sidebarOpen ? 'space-x-3 px-4 py-3' : 'justify-center p-3'
              }`}
              title={!sidebarOpen ? 'Logout' : ''}
              whileHover={{ scale: 1.02, x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <LogOut size={20} className="flex-shrink-0" />
              </motion.div>
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>
              
              {/* Tooltip for collapsed state */}
              <AnimatePresence>
                {!sidebarOpen && (
                  <motion.div 
                    className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap z-50 pointer-events-none"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 0, x: 0 }}
                    whileHover={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    Logout
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        title="Logout Confirmation"
        message="Are you sure you want to logout? You will need to sign in again to access your account."
        confirmText="Logout"
        cancelText="Cancel"
        type="warning"
      />

      {/* Desktop Toggle Button - Outside AnimatePresence to prevent hiding */}
      {!isMobile && (
        <motion.button
          onClick={toggleSidebar}
          className="fixed top-6 w-6 h-8 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-r-md flex items-center justify-center transition-colors z-50 border border-gray-600 border-l-0"
          animate={{ 
            left: sidebarOpen ? '250px' : '58px',
            opacity: 1 
          }}
          whileHover={{ scale: 1.1, x: 2 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 1, left: '250px' }}
          transition={{ 
            duration: 0.5, 
            ease: "easeInOut",
            left: { duration: 0.3, ease: "easeInOut" }
          }}
        >
          <motion.div
            animate={{ rotate: sidebarOpen ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            {sidebarOpen ? (
              <ChevronLeft size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
          </motion.div>
        </motion.button>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <motion.header 
          className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex-shrink-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {isMobile && (
                <motion.button
                  onClick={toggleSidebar}
                  className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Menu size={20} />
                </motion.button>
              )}
              <motion.h1 
                className="text-2xl font-bold text-white"
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {getSectionTitle(activeSection)}
              </motion.h1>
            </div>
          </div>
        </motion.header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto min-h-0">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {renderActiveSection(activeSection)}
              </motion.div>
            </AnimatePresence>
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
    'cardio-tracker': 'Log Cardio',
    'meal-plan': 'Meal Plan',
    'monthly-progress': 'Monthly Progress'
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
    case 'meal-plan':
      return <MealPlan />
    case 'monthly-progress':
      return <MonthlyProgress />
    default:
      return <DashboardOverview />
  }
}

const DashboardOverview = () => {
  const { user } = useAuthStore()
  const { dailyTotals, getCurrentTrackingDateLabel, currentTrackingDate, setTrackingDate } = useFoodStore()
  const { calculatedCalories } = useCalorieStore()
  const { dailyTotals: cardioDailyTotals, fetchTodayEntries: fetchCardioEntries, checkAndUpdateDate: checkCardioDate, setTrackingDate: setCardioTrackingDate } = useCardioStore()

  useEffect(() => {
    // Only fetch cardio data if user is authenticated
    if (user && user.id) {
      checkCardioDate()
      fetchCardioEntries()
    }
  }, [checkCardioDate, fetchCardioEntries, user])

  // Sync cardio tracking date with food tracking date
  useEffect(() => {
    setCardioTrackingDate(currentTrackingDate)
  }, [currentTrackingDate, setCardioTrackingDate])

  return (
    <motion.div 
      className="space-y-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* Welcome Section */}
      <motion.div 
        className="bg-gradient-purple rounded-lg p-6 text-white"
        variants={cardVariants}
        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      >
        <motion.h2 
          className="text-2xl font-bold mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Welcome back, {user?.username}! 👋
        </motion.h2>
        <motion.p 
          className="text-purple-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Track your nutrition and reach your fitness goals with DesiTracker
        </motion.p>
      </motion.div>

      {/* Date Tracking Section */}
      <motion.div 
        className="card"
        variants={cardVariants}
        whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div 
              className="p-2 rounded-lg bg-blue-500/20 text-blue-400"
              whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </motion.div>
            <div>
              <motion.h3 
                className="text-lg font-semibold text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                Current Day
              </motion.h3>
              <motion.p 
                className="text-gray-400 text-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                Your calories for
              </motion.p>
            </div>
          </div>
          <motion.div 
            className="text-right"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <p className="text-xl font-bold text-purple-400">{getCurrentTrackingDateLabel()}</p>
            <p className="text-gray-500 text-sm">{new Date(currentTrackingDate).toLocaleDateString()}</p>
          </motion.div>
        </div>
        
        {/* Week Navigation */}
        <motion.div 
          className="mt-4 pt-4 border-t border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <div className="grid grid-cols-7 gap-1">
            {(() => {
              const today = new Date()
              const currentWeekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
              currentWeekStart.setDate(today.getDate() - today.getDay() + 1) // Start from Monday
              
              const todayString = today.getFullYear() + '-' + 
                                 String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                                 String(today.getDate()).padStart(2, '0')
              
              const weekDays = []
              for (let i = 0; i < 7; i++) {
                const date = new Date(currentWeekStart.getFullYear(), currentWeekStart.getMonth(), currentWeekStart.getDate() + i)
                const dateString = date.getFullYear() + '-' + 
                                  String(date.getMonth() + 1).padStart(2, '0') + '-' + 
                                  String(date.getDate()).padStart(2, '0')
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
                const dayNumber = date.getDate()
                const isToday = dateString === todayString
                const isSelected = dateString === currentTrackingDate
                
                weekDays.push(
                  <motion.button
                    key={dateString}
                    onClick={() => setTrackingDate(dateString)}
                    className={`p-2 rounded-lg text-center transition-colors ${
                      isSelected
                        ? 'bg-purple-600 text-white'
                        : isToday
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <div className="text-xs font-medium">{dayName}</div>
                    <div className="text-sm">{dayNumber}</div>
                  </motion.button>
                )
              }
              return weekDays
            })()}
          </div>
        </motion.div>
      </motion.div>

      {/* Daily Stats */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div className="flex" variants={cardVariants}>
          <DailyCalorieTracker
            consumed={dailyTotals.calories}
            goal={calculatedCalories || 0}
          />
        </motion.div>
        <motion.div className="flex" variants={cardVariants}>
          <MacroStatsCard
            protein={dailyTotals.protein}
            carbs={dailyTotals.carbs}
            fat={dailyTotals.fat}
          />
        </motion.div>
        <motion.div className="flex" variants={cardVariants}>
          <CardioStatsCard
            totalCalories={cardioDailyTotals.totalCalories}
            totalDuration={cardioDailyTotals.totalDuration}
            entriesCount={cardioDailyTotals.entriesCount}
          />
        </motion.div>
      </motion.div>

      {/* Weekly Calorie Chart */}
      <motion.div variants={cardVariants}>
        <WeeklyCalorieChart />
      </motion.div>
    </motion.div>
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
    <motion.div 
      className="card text-center flex-1 w-full"
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      <motion.h2 
        className="text-xl font-semibold text-white mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Daily Calories(KCal)
      </motion.h2>
      
      {/* Circular Progress */}
      <motion.div 
        className="relative w-48 h-48 mx-auto mb-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
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
          <motion.div 
            className="text-white text-2xl font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {consumed}/{goal}
          </motion.div>
        </div>
      </motion.div>
      
      {/* Progress text */}
      <motion.p 
        className="text-gray-400 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        {isExceeded ? 'You have exceeded your intake' : `You have consumed ${percentage}% of your daily calories`}
      </motion.p>
      
      {/* Remaining calories */}
      {remaining > 0 && (
        <motion.p 
          className="text-purple-400 text-sm mt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          {remaining} calories remaining
        </motion.p>
      )}
    </motion.div>
  )
}

const MacroStatsCard = ({ protein, carbs, fat }) => {
  return (
    <motion.div 
      className="card flex-1 w-full"
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      <motion.h3 
        className="text-gray-300 font-medium mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Daily Macros
      </motion.h3>
      
      <motion.div 
        className="space-y-6"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Protein */}
        <motion.div 
          className="flex items-center justify-between"
          variants={cardVariants}
          whileHover={{ x: 5, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center space-x-3">
            <motion.div 
              className="p-2 rounded-lg bg-red-400/10 text-red-400"
              whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
            >
              <Activity className="w-5 h-5" />
            </motion.div>
            <div>
              <span className="text-gray-300 font-medium">Protein</span>
            </div>
          </div>
          <div className="text-right">
            <motion.span 
              className="text-2xl font-bold text-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {protein}
            </motion.span>
            <span className="text-gray-400 ml-1">g</span>
          </div>
        </motion.div>

        {/* Carbs */}
        <motion.div 
          className="flex items-center justify-between"
          variants={cardVariants}
          whileHover={{ x: 5, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center space-x-3">
            <motion.div 
              className="p-2 rounded-lg bg-blue-400/10 text-blue-400"
              whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
            >
              <Target className="w-5 h-5" />
            </motion.div>
            <div>
              <span className="text-gray-300 font-medium">Carbs</span>
            </div>
          </div>
          <div className="text-right">
            <motion.span 
              className="text-2xl font-bold text-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              {carbs}
            </motion.span>
            <span className="text-gray-400 ml-1">g</span>
          </div>
        </motion.div>

        {/* Fat */}
        <motion.div 
          className="flex items-center justify-between"
          variants={cardVariants}
          whileHover={{ x: 5, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center space-x-3">
            <motion.div 
              className="p-2 rounded-lg bg-yellow-400/10 text-yellow-400"
              whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
            >
              <Utensils className="w-5 h-5" />
            </motion.div>
            <div>
              <span className="text-gray-300 font-medium">Fat</span>
            </div>
          </div>
          <div className="text-right">
            <motion.span 
              className="text-2xl font-bold text-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              {fat}
            </motion.span>
            <span className="text-gray-400 ml-1">g</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

const CardioStatsCard = ({ totalCalories, totalDuration, entriesCount }) => {
  return (
    <motion.div 
      className="card flex-1 w-full"
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      <motion.h3 
        className="text-gray-300 font-medium mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Cardio Today
      </motion.h3>
      
      <motion.div 
        className="space-y-6"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Calories Burned */}
        <motion.div 
          className="flex items-center justify-between"
          variants={cardVariants}
          whileHover={{ x: 5, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center space-x-3">
            <motion.div 
              className="p-2 rounded-lg bg-red-500/10 text-red-500"
              whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
            >
              <Heart className="w-5 h-5" />
            </motion.div>
            <div>
              <span className="text-gray-300 font-medium">Calories Burned</span>
            </div>
          </div>
          <div className="text-right">
            <motion.span 
              className="text-2xl font-bold text-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {totalCalories}
            </motion.span>
            <span className="text-gray-400 ml-1">cal</span>
          </div>
        </motion.div>

        {/* Total Duration */}
        <motion.div 
          className="flex items-center justify-between"
          variants={cardVariants}
          whileHover={{ x: 5, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center space-x-3">
            <motion.div 
              className="p-2 rounded-lg bg-green-400/10 text-green-400"
              whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.div>
            <div>
              <span className="text-gray-300 font-medium">Duration</span>
            </div>
          </div>
          <div className="text-right">
            <motion.span 
              className="text-2xl font-bold text-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              {totalDuration}
            </motion.span>
            <span className="text-gray-400 ml-1">min</span>
          </div>
        </motion.div>

        {/* Workout Sessions */}
        <motion.div 
          className="flex items-center justify-between"
          variants={cardVariants}
          whileHover={{ x: 5, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center space-x-3">
            <motion.div 
              className="p-2 rounded-lg bg-purple-400/10 text-purple-400"
              whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
            >
              <Activity className="w-5 h-5" />
            </motion.div>
            <div>
              <span className="text-gray-300 font-medium">Workouts</span>
            </div>
          </div>
          <div className="text-right">
            <motion.span 
              className="text-2xl font-bold text-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              {entriesCount}
            </motion.span>
            <span className="text-gray-400 ml-1">sessions</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

const WeeklyCalorieChart = () => {
  const { fetchWeeklyTotals, weeklyTotals, isLoadingWeekly } = useFoodStore()
  const { calculatedCalories } = useCalorieStore()

  useEffect(() => {
    // Only fetch if we don't have data yet
    if (weeklyTotals.length === 0) {
      fetchWeeklyTotals()
    }
  }, [fetchWeeklyTotals, weeklyTotals.length])

  // Generate current week dates (Monday to Sunday) - use local timezone
  const getWeekDates = () => {
    const today = new Date()
    const currentWeekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    currentWeekStart.setDate(today.getDate() - today.getDay() + 1) // Start from Monday
    
    const weekDates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart.getFullYear(), currentWeekStart.getMonth(), currentWeekStart.getDate() + i)
      const dateString = date.getFullYear() + '-' + 
                        String(date.getMonth() + 1).padStart(2, '0') + '-' + 
                        String(date.getDate()).padStart(2, '0')
      weekDates.push({
        date: dateString,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: date.getDate()
      })
    }
    return weekDates
  }

  const weekDates = getWeekDates()
  const maxCalories = Math.max(...weeklyTotals.map(day => day.calories), calculatedCalories || 0)
  
  // Calculate weekly totals
  const weeklyTotalCalories = weeklyTotals.reduce((sum, day) => sum + day.calories, 0)
  const weeklyGoal = calculatedCalories ? calculatedCalories * 7 : 0
  const weeklyProgress = weeklyGoal > 0 ? Math.min((weeklyTotalCalories / weeklyGoal) * 100, 100) : 0

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <svg 
            className="w-5 h-5 mr-2 text-purple-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
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
            <motion.div 
              className="h-full bg-gradient-to-r from-purple-600 to-purple-400"
              initial={{ width: 0 }}
              animate={{ width: `${weeklyProgress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
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
                <div 
                  key={day.date} 
                  className="flex flex-col items-center flex-1 mx-1"
                >
                  {/* Bar */}
                  <div className="w-full flex flex-col justify-end h-40 mb-2">
                    <motion.div
                      className={`w-full rounded-t-md ${
                        isToday
                          ? 'bg-gradient-to-t from-purple-600 to-purple-400'
                          : calories > 0
                          ? 'bg-gradient-to-t from-gray-600 to-gray-400'
                          : 'bg-gray-800'
                      }`}
                      initial={{ height: '2%' }}
                      animate={{ height: `${Math.max(height, 2)}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
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