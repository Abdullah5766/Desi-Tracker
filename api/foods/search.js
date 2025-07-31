const { PrismaClient } = require('@prisma/client')
const { authenticateToken } = require('../_middleware/auth')

const prisma = new PrismaClient()

const handler = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { q, category, limit = 20 } = req.query

    let where = {}
    
    if (q) {
      where.name = {
        contains: q,
        mode: 'insensitive'
      }
    }
    
    if (category) {
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
    await prisma.$disconnect()
  }
}

module.exports = authenticateToken(handler)