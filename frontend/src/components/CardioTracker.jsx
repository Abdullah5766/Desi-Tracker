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
import { useCardioStore } from '../stores/cardioStore'
import { useFoodStore } from '../stores/foodStore'
import Modal from './common/Modal'
import LoadingSpinner from './common/LoadingSpinner'

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

  const { currentTrackingDate: foodTrackingDate } = useFoodStore()

  useEffect(() => {
    fetchCardioTypes()
    checkAndUpdateDate()
  }, [fetchCardioTypes, checkAndUpdateDate])

  useEffect(() => {
    fetchTodayEntries()
  }, [fetchTodayEntries, currentTrackingDate])

  // Sync with food tracker date
  useEffect(() => {
    if (foodTrackingDate !== currentTrackingDate) {
      setTrackingDate(foodTrackingDate)
    }
  }, [foodTrackingDate, currentTrackingDate, setTrackingDate])

  const handleDeleteEntry = async (entryId) => {
    if (window.confirm('Are you sure you want to delete this cardio entry?')) {
      await deleteCardioEntry(entryId)
    }
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
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-lg p-6 border border-red-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-400 text-sm font-medium">Total Duration</p>
              <p className="text-2xl font-bold text-white">{formatDuration(dailyTotals.totalDuration)}</p>
            </div>
            <div className="p-3 bg-red-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-lg p-6 border border-orange-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-400 text-sm font-medium">Calories Burned</p>
              <p className="text-2xl font-bold text-white">{dailyTotals.totalCalories}</p>
            </div>
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <Flame className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg p-6 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-400 text-sm font-medium">Activities</p>
              <p className="text-2xl font-bold text-white">{dailyTotals.entriesCount}</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Heart className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Date Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Cardio Log</h3>
              <p className="text-gray-400 text-sm">Activities for {getCurrentTrackingDateLabel()}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-sm">{new Date(currentTrackingDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Add Cardio Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Quick Add Cardio</h3>
          <button
            onClick={() => openAddCardioModal()}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Custom Entry</span>
          </button>
        </div>

        {isLoadingTypes ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {cardioTypes.map((cardioType) => (
              <button
                key={cardioType.id}
                onClick={() => openAddCardioModal(cardioType)}
                className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 hover:border-purple-500 transition-all group"
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-3 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                    <Play className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-medium text-sm">{cardioType.name}</p>
                    <p className="text-gray-400 text-xs">{cardioType.caloriesPerMinute} cal/min</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Today's Cardio Entries */}
      <div className="card">
        <h3 className="text-xl font-semibold text-white mb-6">Today's Activities</h3>
        
        {isLoadingEntries ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : todayEntries.length === 0 ? (
          <div className="text-center py-8">
            <div className="p-4 bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Heart className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-400 text-lg mb-2">No cardio activities yet</p>
            <p className="text-gray-500 text-sm">Add your first cardio activity to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todayEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Heart className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{entry.cardioType.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(entry.duration)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Flame className="w-4 h-4" />
                        <span>{Math.round(entry.caloriesBurned)} cal</span>
                      </span>
                    </div>
                    {entry.notes && (
                      <p className="text-gray-500 text-sm mt-1">{entry.notes}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Cardio Modal */}
      <AddCardioModal />
    </div>
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
      title="Add Cardio Activity"
      size="lg"
    >
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cardio Type Selection */}
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

export default CardioTracker