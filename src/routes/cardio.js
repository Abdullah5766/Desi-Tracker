const express = require('express')
const { PrismaClient } = require('@prisma/client')
const auth = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

// Get all cardio types
router.get('/types', auth, async (req, res) => {
  try {
    const cardioTypes = await prisma.cardioType.findMany({
      orderBy: { name: 'asc' }
    })

    res.json({
      success: true,
      data: { cardioTypes }
    })
  } catch (error) {
    console.error('Get cardio types error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cardio types'
    })
  }
})

// Get user's cardio entries
router.get('/entries', auth, async (req, res) => {
  try {
    const { date, limit = 50 } = req.query
    const userId = req.userId

    let whereClause = { userId }

    // Filter by date if provided
    if (date) {
      const targetDate = new Date(date)
      const nextDay = new Date(targetDate)
      nextDay.setDate(targetDate.getDate() + 1)

      whereClause.date = {
        gte: targetDate,
        lt: nextDay
      }
    }

    const cardioEntries = await prisma.cardioEntry.findMany({
      where: whereClause,
      include: {
        cardioType: true
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit)
    })

    res.json({
      success: true,
      data: { entries: cardioEntries }
    })
  } catch (error) {
    console.error('Get cardio entries error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cardio entries'
    })
  }
})

// Add cardio entry
router.post('/entries', auth, async (req, res) => {
  try {
    const { cardioTypeId, duration, date, notes } = req.body
    const userId = req.userId

    // Validate input
    if (!cardioTypeId || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Cardio type and duration are required'
      })
    }

    // Get cardio type to calculate calories
    const cardioType = await prisma.cardioType.findUnique({
      where: { id: cardioTypeId }
    })

    if (!cardioType) {
      return res.status(404).json({
        success: false,
        message: 'Cardio type not found'
      })
    }

    // Calculate calories burned
    const caloriesBurned = cardioType.caloriesPerMinute * duration

    // Create cardio entry
    const cardioEntry = await prisma.cardioEntry.create({
      data: {
        userId,
        cardioTypeId,
        duration: parseInt(duration),
        caloriesBurned,
        date: date ? new Date(date) : new Date(),
        notes: notes || null
      },
      include: {
        cardioType: true
      }
    })

    res.status(201).json({
      success: true,
      data: { entry: cardioEntry }
    })
  } catch (error) {
    console.error('Add cardio entry error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to add cardio entry'
    })
  }
})

// Update cardio entry
router.put('/entries/:id', auth, async (req, res) => {
  try {
    const { id } = req.params
    const { duration, notes } = req.body
    const userId = req.userId

    // Check if entry exists and belongs to user
    const existingEntry = await prisma.cardioEntry.findFirst({
      where: { id, userId },
      include: { cardioType: true }
    })

    if (!existingEntry) {
      return res.status(404).json({
        success: false,
        message: 'Cardio entry not found'
      })
    }

    // Recalculate calories if duration changed
    const updateData = { notes }
    if (duration !== undefined) {
      updateData.duration = parseInt(duration)
      updateData.caloriesBurned = existingEntry.cardioType.caloriesPerMinute * parseInt(duration)
    }

    const updatedEntry = await prisma.cardioEntry.update({
      where: { id },
      data: updateData,
      include: { cardioType: true }
    })

    res.json({
      success: true,
      data: { entry: updatedEntry }
    })
  } catch (error) {
    console.error('Update cardio entry error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update cardio entry'
    })
  }
})

// Delete cardio entry
router.delete('/entries/:id', auth, async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.userId

    // Check if entry exists and belongs to user
    const existingEntry = await prisma.cardioEntry.findFirst({
      where: { id, userId }
    })

    if (!existingEntry) {
      return res.status(404).json({
        success: false,
        message: 'Cardio entry not found'
      })
    }

    await prisma.cardioEntry.delete({
      where: { id }
    })

    res.json({
      success: true,
      message: 'Cardio entry deleted successfully'
    })
  } catch (error) {
    console.error('Delete cardio entry error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete cardio entry'
    })
  }
})

// Get cardio summary for a date range
router.get('/summary', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    const userId = req.userId

    let whereClause = { userId }

    if (startDate && endDate) {
      whereClause.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    const entries = await prisma.cardioEntry.findMany({
      where: whereClause,
      include: { cardioType: true }
    })

    const summary = {
      totalEntries: entries.length,
      totalDuration: entries.reduce((sum, entry) => sum + entry.duration, 0),
      totalCaloriesBurned: entries.reduce((sum, entry) => sum + entry.caloriesBurned, 0),
      byActivity: {}
    }

    // Group by activity type
    entries.forEach(entry => {
      const activityName = entry.cardioType.name
      if (!summary.byActivity[activityName]) {
        summary.byActivity[activityName] = {
          count: 0,
          totalDuration: 0,
          totalCalories: 0
        }
      }
      summary.byActivity[activityName].count++
      summary.byActivity[activityName].totalDuration += entry.duration
      summary.byActivity[activityName].totalCalories += entry.caloriesBurned
    })

    res.json({
      success: true,
      data: { summary }
    })
  } catch (error) {
    console.error('Get cardio summary error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cardio summary'
    })
  }
})

module.exports = router