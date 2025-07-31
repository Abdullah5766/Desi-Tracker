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
    // Get all cardio types
    try {
      const cardioTypes = await prisma.cardioType.findMany({
        orderBy: {
          name: 'asc'
        }
      })

      res.status(200).json({ cardioTypes })

    } catch (error) {
      console.error('Get cardio types error:', error)
      res.status(500).json({ message: 'Internal server error' })
    }

  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

module.exports = authenticateToken(handler)