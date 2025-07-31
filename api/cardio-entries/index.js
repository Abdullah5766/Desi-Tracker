const { PrismaClient } = require('@prisma/client')
const { authenticateToken } = require('../_middleware/auth')

// Global Prisma instance for serverless
let prisma

if (!global.prisma) {
  global.prisma = new PrismaClient({
    log: ['error'],
  })
}
prisma = global.prisma

const handler = async (req, res) => {
  if (req.method === 'GET') {
    // Get cardio entries for a date
    try {
      const { date } = req.query
      const queryDate = date || new Date().toISOString().split('T')[0]

      const entries = await prisma.cardioEntry.findMany({
        where: {
          userId: req.userId,
          date: {
            gte: new Date(queryDate + 'T00:00:00.000Z'),
            lt: new Date(queryDate + 'T23:59:59.999Z')
          }
        },
        include: {
          cardioType: true
        },
        orderBy: {
          createdAt: 'asc'
        }
      })

      res.status(200).json({ entries: entries || [] })

    } catch (error) {
      console.error('Get cardio entries error:', error)
      res.status(500).json({ message: 'Internal server error' })
    }

  } else if (req.method === 'POST') {
    // Add new cardio entry
    try {
      const { cardioTypeId, duration, caloriesBurned, notes, date } = req.body

      const entry = await prisma.cardioEntry.create({
        data: {
          userId: req.userId,
          cardioTypeId,
          duration: parseInt(duration),
          caloriesBurned: parseFloat(caloriesBurned),
          notes: notes || null,
          date: date ? new Date(date) : new Date()
        },
        include: {
          cardioType: true
        }
      })

      res.status(201).json({ entry })

    } catch (error) {
      console.error('Add cardio entry error:', error)
      res.status(500).json({ message: 'Internal server error' })
    }

  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

module.exports = authenticateToken(handler)