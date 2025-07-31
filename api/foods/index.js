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
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { search, category, limit = 50 } = req.query

    let where = {}
    
    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive'
      }
    }
    
    if (category && category !== 'all') {
      where.category = category
    }

    const foods = await prisma.food.findMany({
      where,
      take: parseInt(limit),
      orderBy: {
        name: 'asc'
      }
    })

    res.status(200).json({ foods })

  } catch (error) {
    console.error('Food search error:', error)
    res.status(500).json({ message: 'Internal server error' })
  } finally {
    // Don't disconnect in serverless - keep connection alive
  }
}

module.exports = authenticateToken(handler)