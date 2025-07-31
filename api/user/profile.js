const { PrismaClient } = require('@prisma/client')
const { authenticateToken } = require('../_middleware/auth')

const prisma = new PrismaClient()

const handler = async (req, res) => {
  if (req.method === 'GET') {
    // Get user profile
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          dateOfBirth: true,
          gender: true,
          height: true,
          weight: true,
          activityLevel: true,
          goal: true,
          calorieGoal: true,
          proteinGoal: true,
          carbGoal: true,
          fatGoal: true,
          createdAt: true
        }
      })

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      res.status(200).json({ user })

    } catch (error) {
      console.error('Get profile error:', error)
      res.status(500).json({ message: 'Internal server error' })
    }

  } else if (req.method === 'PUT') {
    // Update user profile
    try {
      const updateData = req.body

      // Remove sensitive fields that shouldn't be updated via this endpoint
      delete updateData.password
      delete updateData.email
      delete updateData.id

      const user = await prisma.user.update({
        where: { id: req.userId },
        data: updateData,
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          dateOfBirth: true,
          gender: true,
          height: true,
          weight: true,
          activityLevel: true,
          goal: true,
          calorieGoal: true,
          proteinGoal: true,
          carbGoal: true,
          fatGoal: true,
          createdAt: true
        }
      })

      res.status(200).json({ user })

    } catch (error) {
      console.error('Update profile error:', error)
      res.status(500).json({ message: 'Internal server error' })
    }

  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }

  await prisma.$disconnect()
}

module.exports = authenticateToken(handler)