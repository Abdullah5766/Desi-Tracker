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
    // Get food entries for a date
    try {
      const { date } = req.query
      const queryDate = date || new Date().toISOString().split('T')[0]

      const entries = await prisma.foodEntry.findMany({
        where: {
          userId: req.userId,
          date: {
            gte: new Date(queryDate + 'T00:00:00.000Z'),
            lt: new Date(queryDate + 'T23:59:59.999Z')
          }
        },
        include: {
          food: true
        },
        orderBy: {
          createdAt: 'asc'
        }
      })

      res.status(200).json({ entries })

    } catch (error) {
      console.error('Get food entries error:', error)
      res.status(500).json({ 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
      })
    }

  } else if (req.method === 'POST') {
    // Add new food entry
    try {
      const { foodId, quantity, unit, meal, date } = req.body

      const entry = await prisma.foodEntry.create({
        data: {
          userId: req.userId,
          foodId,
          quantity: parseFloat(quantity),
          unit: unit || 'g',
          meal: meal || 'BREAKFAST',
          date: date ? new Date(date) : new Date()
        },
        include: {
          food: true
        }
      })

      res.status(201).json({ entry })

    } catch (error) {
      console.error('Add food entry error:', error)
      res.status(500).json({ message: 'Internal server error' })
    }

  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }

  // Don't disconnect in serverless - keep connection alive
}

module.exports = authenticateToken(handler)