import { useState, useEffect } from 'react'
import { 
  Plus, 
  Clock, 
  Flame, 
  Calendar,
  Trash2,
  Heart,
  Play,
  RotateCcw
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCardioStore } from '../stores/cardioStore'
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

const CardioTracker = () => {
  const {
    cardioTypes,
    todayEntries,
    dailyTotals,
    isLoadingTypes,
    isLoadingEntries,
    fetchCardioTypes,
    fetchTodayEntries,
    openAddCardioModal,
    deleteCardioEntry,
    checkAndUpdateDate,
    getCurrentTrackingDateLabel,
    currentTrackingDate,
    setTrackingDate
  } = useCardioStore()

  useEffect(() => {
    fetchCardioTypes()
    checkAndUpdateDate()
  }, [fetchCardioTypes, checkAndUpdateDate])

  useEffect(() => {
    fetchTodayEntries()
  }, [fetchTodayEntries, currentTrackingDate])

  const handleDeleteEntry = async (entryId) => {
    await deleteCardioEntry(entryId)
  }

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes}m`
    }
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Stats */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
      >
        <motion.div 
          className="bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-lg p-6 border border-red-500/30"
          variants={cardVariants}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center justify-between">
            <div>
              <motion.p 
                className="text-red-400 text-sm font-medium"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                Total Duration
              </motion.p>
              <motion.p 
                className="text-2xl font-bold text-white"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {formatDuration(dailyTotals.totalDuration)}
              </motion.p>
            </div>
            <motion.div 
              className="p-3 bg-red-500/20 rounded-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Clock className="w-6 h-6 text-red-400" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-lg p-6 border border-orange-500/30"
          variants={cardVariants}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center justify-between">
            <div>
              <motion.p 
                className="text-orange-400 text-sm font-medium"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                Calories Burned
              </motion.p>
              <motion.p 
                className="text-2xl font-bold text-white"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {dailyTotals.totalCalories}
              </motion.p>
            </div>
            <motion.div 
              className="p-3 bg-orange-500/20 rounded-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Flame className="w-6 h-6 text-orange-400" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg p-6 border border-purple-500/30"
          variants={cardVariants}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center justify-between">
            <div>
              <motion.p 
                className="text-purple-400 text-sm font-medium"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                Activities
              </motion.p>
              <motion.p 
                className="text-2xl font-bold text-white"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {dailyTotals.entriesCount}
              </motion.p>
            </div>
            <motion.div 
              className="p-3 bg-purple-500/20 rounded-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Heart className="w-6 h-6 text-purple-400" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Date Header */}
      <motion.div 
        className="card"
        variants={itemVariants}
        whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div 
              className="p-2 rounded-lg bg-blue-500/20 text-blue-400"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Calendar className="w-5 h-5" />
            </motion.div>
            <div>
              <motion.h3 
                className="text-lg font-semibold text-white"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                Cardio Log
              </motion.h3>
              <motion.p 
                className="text-gray-400 text-sm"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                Activities for {getCurrentTrackingDateLabel()}
              </motion.p>
            </div>
          </div>
          <motion.div 
            className="text-right"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <p className="text-gray-500 text-sm">{new Date(currentTrackingDate).toLocaleDateString()}</p>
          </motion.div>
        </div>
        
        {/* Week Navigation */}
        <div className="mt-4 pt-4 border-t border-gray-700">
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
      </motion.div>

      {/* Add Cardio Section */}
      <motion.div 
        className="card"
        variants={itemVariants}
        whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
      >
        <div className="flex items-center justify-between mb-6">
          <motion.h3 
            className="text-xl font-semibold text-white"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Quick Add Cardio
          </motion.h3>
          <motion.button
            onClick={() => openAddCardioModal()}
            className="btn-primary flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Plus className="w-4 h-4" />
            <span>Custom Entry</span>
          </motion.button>
        </div>

        {isLoadingTypes ? (
          <motion.div 
            className="flex justify-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <LoadingSpinner />
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {cardioTypes.map((cardioType, index) => (
              <motion.button
                key={cardioType.id}
                onClick={() => openAddCardioModal(cardioType)}
                className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 hover:border-purple-500 transition-all group"
                variants={cardVariants}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                custom={index}
              >
                <div className="flex flex-col items-center space-y-2">
                  <motion.div 
                    className="p-3 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Play className="w-6 h-6 text-purple-400" />
                  </motion.div>
                  <div className="text-center">
                    <motion.p 
                      className="text-white font-medium text-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      {cardioType.name}
                    </motion.p>
                    <motion.p 
                      className="text-gray-400 text-xs"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      {cardioType.caloriesPerMinute} cal/min
                    </motion.p>
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Today's Cardio Entries */}
      <motion.div 
        className="card"
        variants={itemVariants}
        whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
      >
        <motion.h3 
          className="text-xl font-semibold text-white mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          Today's Activities
        </motion.h3>
        
        <AnimatePresence mode="wait">
          {isLoadingEntries ? (
            <motion.div 
              className="flex justify-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LoadingSpinner />
            </motion.div>
          ) : todayEntries.length === 0 ? (
            <motion.div 
              className="text-center py-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="p-4 bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Heart className="w-8 h-8 text-gray-600" />
              </motion.div>
              <motion.p 
                className="text-gray-400 text-lg mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                No cardio activities yet
              </motion.p>
              <motion.p 
                className="text-gray-500 text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                Add your first cardio activity to get started!
              </motion.p>
            </motion.div>
          ) : (
            <motion.div 
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {todayEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700"
                  variants={cardVariants}
                  whileHover={{ scale: 1.02, x: 5 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-4">
                    <motion.div 
                      className="p-2 bg-purple-500/20 rounded-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Heart className="w-5 h-5 text-purple-400" />
                    </motion.div>
                    <div>
                      <motion.h4 
                        className="text-white font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        {entry.cardioType.name}
                      </motion.h4>
                      <motion.div 
                        className="flex items-center space-x-4 text-sm text-gray-400"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDuration(entry.duration)}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Flame className="w-4 h-4" />
                          <span>{Math.round(entry.caloriesBurned)} cal</span>
                        </span>
                      </motion.div>
                      {entry.notes && (
                        <motion.p 
                          className="text-gray-500 text-sm mt-1"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.3 }}
                        >
                          {entry.notes}
                        </motion.p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <motion.button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete entry"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Weekly Cardio Chart */}
      <WeeklyCardioChart />

      {/* Add Cardio Modal */}
      <AddCardioModal />
    </motion.div>
  )
}

const AddCardioModal = () => {
  const {
    isAddCardioModalOpen,
    selectedCardioType,
    closeAddCardioModal,
    addCardioEntry
  } = useCardioStore()

  const [duration, setDuration] = useState('')
  const [notes, setNotes] = useState('')
  const [selectedType, setSelectedType] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { cardioTypes } = useCardioStore()

  useEffect(() => {
    if (selectedCardioType) {
      setSelectedType(selectedCardioType)
    } else if (cardioTypes.length > 0) {
      setSelectedType(cardioTypes[0])
    }
  }, [selectedCardioType, cardioTypes])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedType || !duration) {
      console.log('Validation failed:', { selectedType, duration })
      return
    }

    console.log('Submitting cardio entry:', { selectedType, duration, notes })
    setIsSubmitting(true)
    
    const result = await addCardioEntry(
      selectedType.id,
      parseInt(duration),
      null,
      notes.trim()
    )

    setIsSubmitting(false)

    if (result.success) {
      setDuration('')
      setNotes('')
      closeAddCardioModal()
    }
  }

  const calculateEstimatedCalories = () => {
    if (!selectedType || !duration) return 0
    return Math.round(selectedType.caloriesPerMinute * parseInt(duration))
  }

  return (
    <Modal
      isOpen={isAddCardioModalOpen}
      onClose={closeAddCardioModal}
      title={selectedCardioType ? `Log ${selectedCardioType.name}` : "Add Cardio Activity"}
      size={selectedCardioType ? "md" : "lg"}
    >
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Show selected activity info or activity selection */}
        {selectedCardioType ? (
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Heart className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-medium">{selectedCardioType.name}</h3>
                <p className="text-gray-400 text-sm">{selectedCardioType.caloriesPerMinute} calories per minute</p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Activity Type
            </label>
            <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
              {cardioTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedType?.id === type.id
                      ? 'border-purple-500 bg-purple-500/20 text-white'
                      : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <div className="font-medium">{type.name}</div>
                  <div className="text-xs text-gray-400">
                    {type.caloriesPerMinute} cal/min
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Duration Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Duration (minutes)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="input"
            placeholder="Enter duration in minutes"
            min="1"
            max="300"
            required
          />
        </div>

        {/* Estimated Calories */}
        {duration && selectedType && (
          <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Estimated calories burned:</span>
              <span className="text-purple-400 font-semibold">
                {calculateEstimatedCalories()} cal
              </span>
            </div>
          </div>
        )}

        {/* Notes Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="input resize-none"
            placeholder="Add any notes about your workout..."
            rows="3"
          />
        </div>

        {/* Submit Button */}
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={closeAddCardioModal}
            className="btn-secondary flex-1"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`btn-primary flex-1 ${(!selectedType || !duration || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!selectedType || !duration || isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Adding...</span>
              </div>
            ) : (
              'Add Activity'
            )}
          </button>
        </div>
        </form>
      </div>
    </Modal>
  )
}

const WeeklyCardioChart = () => {
  const { fetchWeeklyTotals, weeklyTotals, isLoadingWeekly } = useCardioStore()

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
  const maxCalories = Math.max(...weeklyTotals.map(day => day.totalCalories), 500) // Minimum scale of 500
  
  // Calculate weekly totals
  const weeklyTotalCalories = weeklyTotals.reduce((sum, day) => sum + day.totalCalories, 0)
  const weeklyTotalDuration = weeklyTotals.reduce((sum, day) => sum + day.totalDuration, 0)

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <Flame className="w-5 h-5 mr-2 text-red-400" />
          Weekly Cardio Summary
        </h3>
        
        {/* Weekly Progress Summary */}
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <p className="text-sm font-medium text-red-400">
              {weeklyTotalCalories} cal burned
            </p>
            <p className="text-xs text-gray-400">
              {Math.floor(weeklyTotalDuration / 60)}h {weeklyTotalDuration % 60}m total
            </p>
          </div>
        </div>
      </div>

      {isLoadingWeekly ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-400"></div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-end justify-between h-48 px-2">
            {weekDates.map((day) => {
              const dayData = weeklyTotals.find(d => d.date === day.date)
              const calories = dayData?.totalCalories || 0
              const duration = dayData?.totalDuration || 0
              const height = maxCalories > 0 ? (calories / maxCalories) * 100 : 0
              
              const today = new Date()
              const todayString = today.getFullYear() + '-' + 
                                 String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                                 String(today.getDate()).padStart(2, '0')
              const isToday = day.date === todayString

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
                          ? 'bg-gradient-to-t from-red-600 to-red-400'
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
                    <p className={`text-sm font-semibold ${isToday ? 'text-red-400' : 'text-white'}`}>
                      {calories}
                    </p>
                    <p className="text-xs text-gray-500">cal</p>
                    {duration > 0 && (
                      <p className="text-xs text-gray-500">{duration}m</p>
                    )}
                  </div>
                  
                  {/* Day */}
                  <div className="text-center">
                    <p className={`text-xs font-medium ${isToday ? 'text-red-400' : 'text-gray-300'}`}>
                      {day.dayName}
                    </p>
                    <p className={`text-xs ${isToday ? 'text-red-300' : 'text-gray-500'}`}>
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
              <div className="w-3 h-3 rounded bg-gradient-to-t from-red-600 to-red-400"></div>
              <span className="text-xs text-gray-400">Today</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded bg-gradient-to-t from-gray-600 to-gray-400"></div>
              <span className="text-xs text-gray-400">Other Days</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="w-3 h-3 text-red-400" />
              <span className="text-xs text-gray-400">Cardio Activities</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CardioTracker