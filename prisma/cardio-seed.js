const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const cardioTypes = [
  {
    name: 'Running',
    caloriesPerMinute: 10.0, // ~300 calories per 30 minutes
    description: 'General running/jogging at moderate pace'
  },
  {
    name: 'Walking',
    caloriesPerMinute: 3.5, // ~105 calories per 30 minutes
    description: 'Casual walking at normal pace'
  },
  {
    name: 'Brisk Walking',
    caloriesPerMinute: 5.0, // ~150 calories per 30 minutes
    description: 'Fast-paced walking for exercise'
  },
  {
    name: 'Swimming',
    caloriesPerMinute: 8.0, // ~240 calories per 30 minutes
    description: 'General swimming at moderate intensity'
  },
  {
    name: 'Cycling',
    caloriesPerMinute: 7.0, // ~210 calories per 30 minutes
    description: 'Recreational cycling at moderate pace'
  },
  {
    name: 'Jump Rope',
    caloriesPerMinute: 12.0, // ~360 calories per 30 minutes
    description: 'Jumping rope at moderate pace'
  },
  {
    name: 'Elliptical',
    caloriesPerMinute: 9.0, // ~270 calories per 30 minutes
    description: 'Elliptical machine workout'
  },
  {
    name: 'Rowing',
    caloriesPerMinute: 8.5, // ~255 calories per 30 minutes
    description: 'Rowing machine or water rowing'
  },
  {
    name: 'Hiking',
    caloriesPerMinute: 6.0, // ~180 calories per 30 minutes
    description: 'Hiking on trails with moderate terrain'
  },
  {
    name: 'Dancing',
    caloriesPerMinute: 4.5, // ~135 calories per 30 minutes
    description: 'General dancing or dance fitness'
  },
  {
    name: 'Stair Climbing',
    caloriesPerMinute: 11.0, // ~330 calories per 30 minutes
    description: 'Climbing stairs or stair stepper machine'
  },
  {
    name: 'Aerobics',
    caloriesPerMinute: 6.5, // ~195 calories per 30 minutes
    description: 'General aerobic exercise class'
  }
]

async function seedCardioTypes() {
  console.log('🏃‍♂️ Starting cardio types seeding...')

  try {
    // Clear existing cardio types
    await prisma.cardioType.deleteMany({})
    console.log('🗑️  Cleared existing cardio types')

    // Insert new cardio types
    for (const cardioType of cardioTypes) {
      const created = await prisma.cardioType.create({
        data: cardioType
      })
      console.log(`✅ Created cardio type: ${created.name} (${created.caloriesPerMinute} cal/min)`)
    }

    console.log(`🎉 Successfully seeded ${cardioTypes.length} cardio types!`)
  } catch (error) {
    console.error('❌ Error seeding cardio types:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seed function
if (require.main === module) {
  seedCardioTypes()
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

module.exports = { seedCardioTypes }