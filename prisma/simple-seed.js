const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const desiPakistaniFoods = [
  {
    name: "Chicken Biryani",
    category: "Main Course",
    calories: 290,
    protein: 18.5,
    carbs: 35.2,
    fat: 8.9,
    fiber: 2.1,
    sugar: 3.2,
    sodium: 450,
    servingSize: 250,
    servingUnit: "1 plate",
    isDesiFood: true
  },
  {
    name: "Dal Chawal",
    category: "Main Course", 
    calories: 185,
    protein: 8.2,
    carbs: 32.5,
    fat: 2.8,
    fiber: 4.5,
    sugar: 1.8,
    sodium: 280,
    servingSize: 200,
    servingUnit: "1 bowl",
    isDesiFood: true
  },
  {
    name: "Roti (Chapati)",
    category: "Bread",
    calories: 297,
    protein: 11.2,
    carbs: 58.9,
    fat: 3.7,
    fiber: 10.8,
    sugar: 2.1,
    sodium: 5,
    servingSize: 40,
    servingUnit: "1 roti",
    isDesiFood: true
  },
  {
    name: "Karahi Chicken",
    category: "Main Course",
    calories: 195,
    protein: 22.8,
    carbs: 4.2,
    fat: 9.8,
    fiber: 1.2,
    sugar: 2.8,
    sodium: 380,
    servingSize: 150,
    servingUnit: "1 serving",
    isDesiFood: true
  },
  {
    name: "Aloo Gosht",
    category: "Main Course",
    calories: 175,
    protein: 15.6,
    carbs: 8.9,
    fat: 8.2,
    fiber: 2.3,
    sugar: 2.1,
    sodium: 320,
    servingSize: 180,
    servingUnit: "1 serving",
    isDesiFood: true
  }
];

async function main() {
  console.log('🌱 Adding Pakistani foods to existing database...');

  // Add Desi/Pakistani foods
  for (const food of desiPakistaniFoods) {
    try {
      const existingFood = await prisma.food.findFirst({
        where: { name: food.name }
      });

      if (!existingFood) {
        await prisma.food.create({
          data: food
        });
        console.log(`✅ Added: ${food.name}`);
      } else {
        console.log(`⏭️  Skipped (exists): ${food.name}`);
      }
    } catch (error) {
      console.error(`❌ Failed to add ${food.name}:`, error.message);
    }
  }

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });