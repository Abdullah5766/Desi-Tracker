import { create } from 'zustand'
import api from '../services/api'
import toast from 'react-hot-toast'

export const useCardioStore = create((set, get) => ({
  // Cardio types state
  cardioTypes: [],
  isLoadingTypes: false,

  // Cardio entries state
  currentTrackingDate: (() => {
    const today = new Date()
    return today.getFullYear() + '-' + 
           String(today.getMonth() + 1).padStart(2, '0') + '-' + 
           String(today.getDate()).padStart(2, '0')
  })(),
  todayEntries: [],
  isLoadingEntries: false,

  // Weekly totals state
  weeklyTotals: [],
  isLoadingWeekly: false,

  // Modal state
  isAddCardioModalOpen: false,
  selectedCardioType: null,

  // Summary state
  dailyTotals: {
    totalDuration: 0,
    totalCalories: 0,
    entriesCount: 0
  },

  // Fetch cardio types
  fetchCardioTypes: async () => {
    console.log('🏃‍♂️ fetchCardioTypes called')
    set({ isLoadingTypes: true })
    try {
      const response = await api.get('/cardio-types')
      const { cardioTypes } = response.data

      set({
        cardioTypes,
        isLoadingTypes: false
      })

    } catch (error) {
      console.error('Failed to fetch cardio types:', error)
      set({ isLoadingTypes: false })
      
      // Don't show error toast for authentication issues
      if (error.response?.status === 401) {
        console.log('❌ Authentication required for cardio types')
        return
      }
      
      toast.error('Failed to load cardio types: ' + (error.response?.data?.message || error.message))
    }
  },

  // Fetch today's cardio entries
  fetchTodayEntries: async () => {
    console.log('🏃‍♂️ fetchTodayEntries called')
    set({ isLoadingEntries: true })
    try {
      const { currentTrackingDate } = get()
      console.log('🔍 Fetching cardio entries for date:', currentTrackingDate)
      const response = await api.get(`/cardio-entries?date=${currentTrackingDate}&limit=100`)
      console.log('🔍 Cardio API response:', response.data)
      const { entries } = response.data
      console.log('🔍 Cardio entries received:', entries)

      set({
        todayEntries: entries,
        isLoadingEntries: false
      })

      // Calculate daily totals
      get().calculateDailyTotals()

    } catch (error) {
      console.error('❌ Failed to fetch today\'s cardio entries:', error)
      set({ isLoadingEntries: false })
      
      // Don't show error toast for authentication issues
      if (error.response?.status === 401) {
        console.log('❌ Authentication required for cardio entries')
        return
      }
      
      toast.error('Failed to load cardio entries: ' + (error.response?.data?.message || error.message))
    }
  },

  // Add cardio entry
  addCardioEntry: async (cardioTypeId, duration, date = null, notes = '') => {
    try {
      const { currentTrackingDate, cardioTypes } = get()
      const entryDate = date || currentTrackingDate
      
      // Find the cardio type to calculate calories burned
      const cardioType = cardioTypes.find(type => type.id === cardioTypeId)
      const caloriesBurned = cardioType ? cardioType.caloriesPerMinute * parseInt(duration) : 0
      
      console.log('🏃‍♂️ Adding cardio entry:', { cardioTypeId, duration, date: entryDate, notes, caloriesBurned })
      
      const response = await api.post('/cardio-entries', {
        cardioTypeId,
        duration: parseInt(duration),
        caloriesBurned: caloriesBurned,
        date: entryDate,
        notes: notes || null
      })

      console.log('✅ Cardio entry API response:', response.data)
      const { entry } = response.data

      // Add to current tracking date entries if it matches
      const currentState = get()
      const entryDateString = entry.date.split('T')[0]
      
      console.log('📅 Current tracking date:', currentState.currentTrackingDate, 'Entry date:', entryDateString)
      
      if (entryDateString === currentState.currentTrackingDate) {
        console.log('✅ Adding to current tracking date entries')
        set((state) => ({
          todayEntries: [entry, ...state.todayEntries]
        }))
        
        // Recalculate daily totals
        get().calculateDailyTotals()
      }

      // Refresh weekly totals to update the chart
      get().fetchWeeklyTotals()

      toast.success('Cardio entry added successfully!')
      return { success: true, data: entry }

    } catch (error) {
      console.error('❌ Failed to add cardio entry:', error)
      console.error('❌ Error response:', error.response?.data)
      console.error('❌ Error status:', error.response?.status)
      const message = error.response?.data?.message || 'Failed to add cardio entry'
      toast.error(message)
      return { success: false, message }
    }
  },

  // Update cardio entry
  updateCardioEntry: async (entryId, updateData) => {
    try {
      const response = await api.put(`/cardio-entries/${entryId}`, updateData)
      const { entry } = response.data

      // Update in today's entries
      set((state) => ({
        todayEntries: state.todayEntries.map(e => 
          e.id === entryId ? entry : e
        )
      }))

      // Recalculate daily totals
      get().calculateDailyTotals()

      // Refresh weekly totals to update the chart
      get().fetchWeeklyTotals()

      toast.success('Cardio entry updated!')
      return { success: true, data: entry }

    } catch (error) {
      console.error('Failed to update cardio entry:', error)
      const message = error.response?.data?.message || 'Failed to update cardio entry'
      toast.error(message)
      return { success: false, message }
    }
  },

  // Delete cardio entry
  deleteCardioEntry: async (entryId) => {
    try {
      await api.delete(`/cardio-entries/${entryId}`)

      // Remove from today's entries
      set((state) => ({
        todayEntries: state.todayEntries.filter(e => e.id !== entryId)
      }))

      // Recalculate daily totals
      get().calculateDailyTotals()

      // Refresh weekly totals to update the chart
      get().fetchWeeklyTotals()

      toast.success('Cardio entry deleted!')
      return { success: true }

    } catch (error) {
      console.error('Failed to delete cardio entry:', error)
      const message = error.response?.data?.message || 'Failed to delete cardio entry'
      toast.error(message)
      return { success: false, message }
    }
  },

  // Calculate daily totals
  calculateDailyTotals: () => {
    const { todayEntries } = get()
    
    const totals = todayEntries.reduce((acc, entry) => {
      acc.totalDuration += entry.duration || 0
      acc.totalCalories += entry.caloriesBurned || 0
      acc.entriesCount += 1
      return acc
    }, {
      totalDuration: 0,
      totalCalories: 0,
      entriesCount: 0
    })

    // Round values
    totals.totalCalories = Math.round(totals.totalCalories)

    set({ dailyTotals: totals })
  },

  // Modal functions
  openAddCardioModal: (cardioType = null) => {
    set({
      isAddCardioModalOpen: true,
      selectedCardioType: cardioType
    })
  },

  closeAddCardioModal: () => {
    set({
      isAddCardioModalOpen: false,
      selectedCardioType: null
    })
  },

  // Date management functions
  setTrackingDate: (date) => {
    set({ currentTrackingDate: date })
    // Fetch entries for the new date
    get().fetchTodayEntries()
  },

  checkAndUpdateDate: () => {
    const today = new Date()
    const currentDate = today.getFullYear() + '-' + 
                       String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                       String(today.getDate()).padStart(2, '0')
    const { currentTrackingDate } = get()
    
    if (currentDate !== currentTrackingDate) {
      console.log('🗓️ Cardio date changed from', currentTrackingDate, 'to', currentDate)
      set({ 
        currentTrackingDate: currentDate,
        todayEntries: [],
        dailyTotals: {
          totalDuration: 0,
          totalCalories: 0,
          entriesCount: 0
        }
      })
      // Fetch entries for the new date
      get().fetchTodayEntries()
    }
  },

  // Fetch weekly cardio totals
  fetchWeeklyTotals: async () => {
    console.log('🚀 fetchWeeklyCardioTotals called')
    set({ isLoadingWeekly: true })
    
    try {
      // Get current week (Monday to Sunday) - use local timezone
      const today = new Date()
      const currentWeekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      currentWeekStart.setDate(today.getDate() - today.getDay() + 1) // Start from Monday
      
      const weeklyData = []
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(currentWeekStart.getFullYear(), currentWeekStart.getMonth(), currentWeekStart.getDate() + i)
        const dateString = date.getFullYear() + '-' + 
                          String(date.getMonth() + 1).padStart(2, '0') + '-' + 
                          String(date.getDate()).padStart(2, '0')
        
        try {
          console.log(`🏃‍♂️ Fetching cardio entries for ${dateString}...`)
          const response = await api.get(`/cardio-entries?date=${dateString}&limit=100`)
          const { entries } = response.data
          
          // Calculate totals
          const dayTotals = entries.reduce((acc, entry) => {
            acc.totalDuration += entry.duration || 0
            acc.totalCalories += entry.caloriesBurned || 0
            acc.entriesCount += 1
            return acc
          }, { totalDuration: 0, totalCalories: 0, entriesCount: 0 })

          const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
          
          weeklyData.push({
            date: dateString,
            dayName,
            totalDuration: dayTotals.totalDuration,
            totalCalories: Math.round(dayTotals.totalCalories),
            entriesCount: dayTotals.entriesCount
          })
          
        } catch (error) {
          console.error(`🏃‍♂️ Failed to fetch cardio data for ${dateString}:`, error)
          // Add empty day data
          const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
          weeklyData.push({
            date: dateString,
            dayName,
            totalDuration: 0,
            totalCalories: 0,
            entriesCount: 0
          })
        }
      }
      
      console.log('🏃‍♂️ Final weekly cardio data:', weeklyData)
      
      set({
        weeklyTotals: weeklyData,
        isLoadingWeekly: false
      })

    } catch (error) {
      console.error('🏃‍♂️ Failed to fetch weekly cardio totals:', error)
      set({ isLoadingWeekly: false })
    }
  },

  getCurrentTrackingDateLabel: () => {
    const { currentTrackingDate } = get()
    
    const today = new Date()
    const todayString = today.getFullYear() + '-' + 
                       String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                       String(today.getDate()).padStart(2, '0')
    
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    const yesterdayString = yesterday.getFullYear() + '-' + 
                           String(yesterday.getMonth() + 1).padStart(2, '0') + '-' + 
                           String(yesterday.getDate()).padStart(2, '0')
    
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    const tomorrowString = tomorrow.getFullYear() + '-' + 
                          String(tomorrow.getMonth() + 1).padStart(2, '0') + '-' + 
                          String(tomorrow.getDate()).padStart(2, '0')
    
    if (currentTrackingDate === todayString) {
      return 'Today'
    } else if (currentTrackingDate === yesterdayString) {
      return 'Yesterday'
    } else if (currentTrackingDate === tomorrowString) {
      return 'Tomorrow'
    } else {
      return new Date(currentTrackingDate).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
    }
  },

  // Reset store
  resetStore: () => {
    const today = new Date()
    const currentDate = today.getFullYear() + '-' + 
                       String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                       String(today.getDate()).padStart(2, '0')
    set({
      cardioTypes: [],
      isLoadingTypes: false,
      todayEntries: [],
      isLoadingEntries: false,
      weeklyTotals: [],
      isLoadingWeekly: false,
      dailyTotals: {
        totalDuration: 0,
        totalCalories: 0,
        entriesCount: 0
      },
      isAddCardioModalOpen: false,
      selectedCardioType: null,
      currentTrackingDate: currentDate
    })
  }
}))