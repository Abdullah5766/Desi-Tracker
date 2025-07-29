import { useState, useEffect, useCallback } from 'react'
import { Search, Plus, Clock, Utensils, Trash2, Edit3 } from 'lucide-react'
import { useFoodStore } from '../stores/foodStore'
import { useAuthStore } from '../stores/authStore'
import Modal from './common/Modal'
import LoadingSpinner from './common/LoadingSpinner'

// Simple debounce function
const debounce = (func, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }
}

const FoodTracker = () => {
  const { isReady } = useAuthStore()
  const {
    searchQuery,
    searchResults,
    isSearching,
    todayEntries,
    isLoadingEntries,
    setSearchQuery,
    searchFoods,
    clearSearch,
    fetchTodayEntries,
    openAddFoodModal,
    deleteFoodEntry,
    getCurrentTrackingDateLabel,
    currentTrackingDate,
    setTrackingDate
  } = useFoodStore()

  const [searchModalOpen, setSearchModalOpen] = useState(false)

  useEffect(() => {
    if (isReady()) {
      fetchTodayEntries()
    }
  }, [fetchTodayEntries, isReady])

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.trim()) {
        searchFoods(query)
      }
    }, 500),
    [searchFoods]
  )

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    debouncedSearch(query)
  }

  const openSearchModal = () => {
    setSearchModalOpen(true)
    clearSearch()
  }

  const closeSearchModal = () => {
    setSearchModalOpen(false)
    clearSearch()
  }

  const handleFoodSelect = (food, mealType = 'breakfast') => {
    openAddFoodModal(food, mealType)
    closeSearchModal()
  }

  const groupedEntries = {
    breakfast: todayEntries.filter(entry => entry.mealType === 'breakfast'),
    lunch: todayEntries.filter(entry => entry.mealType === 'lunch'),
    dinner: todayEntries.filter(entry => entry.mealType === 'dinner'),
    snack: todayEntries.filter(entry => entry.mealType === 'snack')
  }

  const mealTypeLabels = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snack: 'Snacks'
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Utensils className="w-8 h-8 mr-3 text-purple-400" />
            Food Tracker
          </h1>
          <p className="text-gray-300 mt-2">Track your daily food intake and nutrition</p>
        </div>

      </div>

      {/* Date Tracking Section */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v12a2 2 0 002 2z" />
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

      {/* Today's Meals */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">{getCurrentTrackingDateLabel()}'s Meals</h2>
        
        {isLoadingEntries ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(groupedEntries).map(([mealType, entries]) => (
              <MealSection
                key={mealType}
                mealType={mealType}
                mealLabel={mealTypeLabels[mealType]}
                entries={entries}
                onAddFood={() => openSearchModal()}
                onDeleteEntry={deleteFoodEntry}
              />
            ))}
          </div>
        )}
      </div>

      {/* Search Modal */}
      <Modal
        isOpen={searchModalOpen}
        onClose={closeSearchModal}
        title="Search Foods"
        size="lg"
      >
        <div className="p-6">
          {/* Search Input */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="input pl-10"
              placeholder="Search for foods (e.g., biryani, karahi, dal)..."
              autoFocus
            />
          </div>

          {/* Search Results */}
          <div className="min-h-[300px]">
            {isSearching ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner />
              </div>
            ) : searchQuery.trim() ? (
              searchResults.length > 0 ? (
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-white mb-4">
                    Search Results ({searchResults.length})
                  </h3>
                  {searchResults.map((food) => (
                    <SearchResultItem
                      key={food.id}
                      food={food}
                      onSelect={handleFoodSelect}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No foods found for "{searchQuery}"</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Try searching for popular Desi foods like biryani, karahi, or dal
                  </p>
                </div>
              )
            ) : (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Start typing to search for foods</p>
                <p className="text-gray-500 text-sm mt-2">
                  Search for foods like biryani, karahi, dal, or any other food item
                </p>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Add Food Modal */}
      <AddFoodModal />
    </div>
  )
}


const SearchResultItem = ({ food, onSelect }) => (
  <button
    onClick={() => onSelect(food)}
    className="w-full text-left p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex justify-between items-center"
  >
    <div className="flex-1">
      <div className="flex items-center space-x-2 mb-1">
        <h3 className="font-medium text-white">{food.name}</h3>
        {food.isCommonDesi && (
          <span className="px-2 py-1 bg-purple-600 text-purple-200 text-xs rounded">
            Desi
          </span>
        )}
      </div>
      <p className="text-sm text-gray-400">{food.category}</p>
      <div className="flex space-x-4 text-xs text-gray-500 mt-1">
        <span>P: {food.protein}g</span>
        <span>C: {food.carbs}g</span>
        <span>F: {food.fat}g</span>
      </div>
    </div>
    <div className="text-right">
      <span className="text-lg font-medium text-purple-400">
        {food.calories}
      </span>
      <p className="text-xs text-gray-500">cal/100g</p>
    </div>
  </button>
)

const MealSection = ({ mealType, mealLabel, entries, onAddFood, onDeleteEntry }) => {
  const totalCalories = entries.reduce((sum, entry) => 
    sum + (entry.nutritionalValues?.calories || 0), 0
  )

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Clock className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">{mealLabel}</h3>
          <span className="text-sm text-gray-400">
            ({Math.round(totalCalories)} cal)
          </span>
        </div>
        <button
          onClick={onAddFood}
          className="btn-outline text-sm px-3 py-1"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {entries.length > 0 ? (
        <div className="space-y-3">
          {entries.map((entry) => (
            <FoodEntryItem
              key={entry.id}
              entry={entry}
              onDelete={onDeleteEntry}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border-2 border-dashed border-gray-600 rounded-lg">
          <Utensils className="w-8 h-8 text-gray-600 mx-auto mb-2" />
          <p className="text-gray-400">No foods logged for {mealLabel.toLowerCase()}</p>
          <button
            onClick={onAddFood}
            className="text-purple-400 hover:text-purple-300 text-sm mt-2"
          >
            Add your first food
          </button>
        </div>
      )}
    </div>
  )
}

const FoodEntryItem = ({ entry, onDelete }) => {
  const handleDelete = async () => {
    await onDelete(entry.id)
  }

  return (
    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <h4 className="font-medium text-white">{entry.food?.name}</h4>
          <span className="text-sm text-gray-400">
            {entry.quantity}{entry.food?.servingUnit?.includes('slice') ? ' slice(s)' : 
             entry.food?.servingUnit?.includes('egg') ? ' egg(s)' : 
             entry.food?.servingUnit?.includes('burger') ? ' burger(s)' : 
             entry.food?.servingUnit?.includes('tablespoon') ? ' tbsp' : 'g'}
          </span>
        </div>
        <div className="flex space-x-4 text-xs text-gray-500">
          <span>
            {Math.round(entry.nutritionalValues?.calories || 0)} cal
          </span>
          <span>P: {Math.round((entry.nutritionalValues?.protein || 0) * 10) / 10}g</span>
          <span>C: {Math.round((entry.nutritionalValues?.carbs || 0) * 10) / 10}g</span>
          <span>F: {Math.round((entry.nutritionalValues?.fat || 0) * 10) / 10}g</span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={handleDelete}
          className="p-1 text-gray-400 hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

const AddFoodModal = () => {
  const {
    isAddFoodModalOpen,
    selectedFood,
    selectedMealType,
    closeAddFoodModal,
    addFoodEntry,
    setSelectedMealType
  } = useFoodStore()

  const [quantity, setQuantity] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (selectedFood?.servingSize) {
      setQuantity(selectedFood.servingSize.toString())
    } else {
      setQuantity('100')
    }
  }, [selectedFood])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedFood || !quantity) return

    setIsSubmitting(true)
    const result = await addFoodEntry(
      selectedFood.id,
      parseFloat(quantity),
      selectedMealType
    )

    if (result.success) {
      closeAddFoodModal()
      setQuantity('')
    }
    setIsSubmitting(false)
  }

  const calculateNutrition = () => {
    if (!selectedFood || !quantity) return null

    // For items with specific serving units (like slices, eggs, burgers), use their serving size
    // For gram-based items, calculate per 100g
    let multiplier
    if (selectedFood.servingUnit?.includes('slice') || 
        selectedFood.servingUnit?.includes('egg') || 
        selectedFood.servingUnit?.includes('burger') || 
        selectedFood.servingUnit?.includes('tablespoon')) {
      // For discrete items, multiply by quantity directly since nutrition values are per serving
      multiplier = parseFloat(quantity)
    } else {
      // For gram-based items, calculate per 100g as before
      multiplier = parseFloat(quantity) / 100
    }
    
    return {
      calories: Math.round(selectedFood.calories * multiplier),
      protein: Math.round(selectedFood.protein * multiplier * 10) / 10,
      carbs: Math.round(selectedFood.carbs * multiplier * 10) / 10,
      fat: Math.round(selectedFood.fat * multiplier * 10) / 10
    }
  }

  const nutrition = calculateNutrition()

  return (
    <Modal
      isOpen={isAddFoodModalOpen}
      onClose={closeAddFoodModal}
      title="Add Food"
    >
      <div className="p-6">
        {selectedFood && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Food Info */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-2">{selectedFood.name}</h3>
              <p className="text-gray-400 text-sm mb-2">{selectedFood.category}</p>
              <div className="grid grid-cols-4 gap-4 text-xs text-gray-500">
                <div>
                  <span className="text-purple-400">{selectedFood.calories}</span>
                  <p>cal/100g</p>
                </div>
                <div>
                  <span className="text-red-400">{selectedFood.protein}g</span>
                  <p>protein</p>
                </div>
                <div>
                  <span className="text-blue-400">{selectedFood.carbs}g</span>
                  <p>carbs</p>
                </div>
                <div>
                  <span className="text-yellow-400">{selectedFood.fat}g</span>
                  <p>fat</p>
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Quantity ({selectedFood?.servingUnit?.includes('slice') ? 'slices' : 
                         selectedFood?.servingUnit?.includes('egg') ? 'eggs' : 
                         selectedFood?.servingUnit?.includes('burger') ? 'burgers' : 
                         selectedFood?.servingUnit?.includes('tablespoon') ? 'tablespoons' : 'grams'})
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="input"
                placeholder={`Enter quantity in ${selectedFood?.servingUnit?.includes('slice') ? 'slices' : 
                                                selectedFood?.servingUnit?.includes('egg') ? 'eggs' : 
                                                selectedFood?.servingUnit?.includes('burger') ? 'burgers' : 
                                                selectedFood?.servingUnit?.includes('tablespoon') ? 'tablespoons' : 'grams'}`}
                min="1"
                max="2000"
                required
              />
              {selectedFood.servingSize && (
                <p className="text-xs text-gray-500 mt-1">
                  Typical serving: {selectedFood.servingSize}{selectedFood.servingUnit?.includes('slice') ? ' slice(s)' : 
                                                            selectedFood.servingUnit?.includes('egg') ? ' egg(s)' : 
                                                            selectedFood.servingUnit?.includes('burger') ? ' burger(s)' : 
                                                            selectedFood.servingUnit?.includes('tablespoon') ? ' tbsp' : 'g'} ({selectedFood.servingUnit})
                </p>
              )}
            </div>

            {/* Meal Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Meal Type
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => (
                  <button
                    key={mealType}
                    type="button"
                    onClick={() => setSelectedMealType(mealType)}
                    className={`p-3 rounded-lg border transition-colors capitalize ${
                      selectedMealType === mealType
                        ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                        : 'border-gray-600 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    {mealType}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculated Nutrition */}
            {nutrition && (
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-white mb-3">Nutrition for {quantity}{selectedFood?.servingUnit?.includes('slice') ? ' slice(s)' : 
                                                                                    selectedFood?.servingUnit?.includes('egg') ? ' egg(s)' : 
                                                                                    selectedFood?.servingUnit?.includes('burger') ? ' burger(s)' : 
                                                                                    selectedFood?.servingUnit?.includes('tablespoon') ? ' tbsp' : 'g'}</h4>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <span className="text-2xl font-bold text-purple-400">
                      {nutrition.calories}
                    </span>
                    <p className="text-gray-400">calories</p>
                  </div>
                  <div className="text-center">
                    <span className="text-xl font-semibold text-red-400">
                      {nutrition.protein}g
                    </span>
                    <p className="text-gray-400">protein</p>
                  </div>
                  <div className="text-center">
                    <span className="text-xl font-semibold text-blue-400">
                      {nutrition.carbs}g
                    </span>
                    <p className="text-gray-400">carbs</p>
                  </div>
                  <div className="text-center">
                    <span className="text-xl font-semibold text-yellow-400">
                      {nutrition.fat}g
                    </span>
                    <p className="text-gray-400">fat</p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={closeAddFoodModal}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !quantity}
                className="btn-primary flex-1 flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add Food</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  )
}

export default FoodTracker