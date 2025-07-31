module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    const debug = {
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
        JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
      },
      prisma: null
    }

    // Test Prisma connection
    try {
      const { PrismaClient } = require('@prisma/client')
      const prisma = new PrismaClient()
      
      // Simple query to test connection
      await prisma.$queryRaw`SELECT 1 as test`
      debug.prisma = 'CONNECTION OK'
      
    } catch (prismaError) {
      debug.prisma = `ERROR: ${prismaError.message}`
    }

    res.status(200).json(debug)

  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      stack: error.stack
    })
  }
}