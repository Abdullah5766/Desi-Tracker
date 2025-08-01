const { PrismaClient } = require('@prisma/client')
const jwt = require('jsonwebtoken')

// Global Prisma instance for serverless
let prisma

if (!global.prisma) {
  global.prisma = new PrismaClient({
    log: ['error'],
  })
}
prisma = global.prisma

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({ message: 'Token is required' })
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decoded.userId

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        age: true,
        weight: true,
        height: true,
        gender: true,
        activityLevel: true,
        goal: true,
        calorieGoal: true,
        proteinGoal: true,
        carbGoal: true,
        fatGoal: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json({ user })

  } catch (error) {
    console.error('Token verification error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      token: token ? 'present' : 'missing',
      jwtSecret: process.env.JWT_SECRET ? 'present' : 'missing'
    })
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' })
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' })
    }

    // More specific database error handling
    if (error.code === 'P2002') {
      return res.status(500).json({ message: 'Database constraint error' })
    }
    
    if (error.code && error.code.startsWith('P')) {
      return res.status(500).json({ message: 'Database error' })
    }

    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = handler