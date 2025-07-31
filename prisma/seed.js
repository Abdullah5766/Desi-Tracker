const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const meat = [
  {
    name: "Chicken Breast (Uncooked)",
    category: "meat",
    calories: 120,
    protein: 23,
    carbs: 0,
    fat: 2.6,
    servingUnit: "100 grams"
  },
  {
    name: "Chicken Thigh (Uncooked)",
    category: "meat",
    calories: 180,
    protein: 17,
    carbs: 0,
    fat: 12,
    servingUnit: "100 grams"
  },
  {
    name: "Goat Leg (Uncooked)",
    category: "meat",
    calories: 122,
    protein: 22,
    carbs: 0,
    fat: 3,
    servingUnit: "100 grams"
  },
  {
    name: "Goat Shoulder (Uncooked)",
    category: "meat",
    calories: 160,
    protein: 21,
    carbs: 0,
    fat: 7.5,
    servingUnit: "100 grams"
  },
  {
    name: "Goat Ribs (Uncooked)",
    category: "meat",
    calories: 180,
    protein: 20,
    carbs: 0,
    fat: 11,
    servingUnit: "100 grams"
  },
  {
    name: "Goat Neck (Uncooked)",
    category: "meat",
    calories: 170,
    protein: 21,
    carbs: 0,
    fat: 9,
    servingUnit: "100 grams"
  },
  {
    name: "Goat Loin (Uncooked)",
    category: "meat",
    calories: 130,
    protein: 22,
    carbs: 0,
    fat: 4,
    servingUnit: "100 grams"
  },
  {
    name: "Goat Liver (Uncooked)",
    category: "meat",
    calories: 128,
    protein: 21,
    carbs: 0,
    fat: 3.5,
    servingUnit: "100 grams"
  },
  {
    name: "Goat Kidney (Uncooked)",
    category: "meat",
    calories: 120,
    protein: 20,
    carbs: 0,
    fat: 3,
    servingUnit: "100 grams"
  },
  {
    name: "Goat Heart (Uncooked)",
    category: "meat",
    calories: 125,
    protein: 20,
    carbs: 0,
    fat: 4,
    servingUnit: "100 grams"
  },
  {
    name: "Goat Brain (Uncooked)",
    category: "meat",
    calories: 310,
    protein: 12,
    carbs: 1,
    fat: 28,
    servingUnit: "100 grams"
  },
  {
    name: "Beef Leg (Uncooked)",
    category: "meat",
    calories: 147,
    protein: 21,
    carbs: 0,
    fat: 7,
    servingUnit: "100 grams"
  },
  {
    name: "Beef Shoulder (Uncooked)",
    category: "meat",
    calories: 165,
    protein: 20,
    carbs: 0,
    fat: 9,
    servingUnit: "100 grams"
  },
  {
    name: "Beef Ribs (Uncooked)",
    category: "meat",
    calories: 210,
    protein: 18,
    carbs: 0,
    fat: 15,
    servingUnit: "100 grams"
  },
  {
    name: "Beef Neck (Uncooked)",
    category: "meat",
    calories: 190,
    protein: 19,
    carbs: 0,
    fat: 12,
    servingUnit: "100 grams"
  },
  {
    name: "Beef Liver (Uncooked)",
    category: "meat",
    calories: 135,
    protein: 21,
    carbs: 4,
    fat: 3,
    servingUnit: "100 grams"
  },
  {
    name: "Beef Kidney (Uncooked)",
    category: "meat",
    calories: 118,
    protein: 20,
    carbs: 1,
    fat: 3,
    servingUnit: "100 grams"
  },
  {
    name: "Beef Heart (Uncooked)",
    category: "meat",
    calories: 140,
    protein: 20,
    carbs: 0,
    fat: 5,
    servingUnit: "100 grams"
  },
  {
    name: "Beef Brain (Uncooked)",
    category: "meat",
    calories: 310,
    protein: 12,
    carbs: 1,
    fat: 28,
    servingUnit: "100 grams"
  },
  {
    name: "Camel Leg (Uncooked)",
    category: "meat",
    calories: 114,
    protein: 22,
    carbs: 0,
    fat: 2.5,
    servingUnit: "100 grams"
  },
  {
    name: "Camel Shoulder (Uncooked)",
    category: "meat",
    calories: 130,
    protein: 21,
    carbs: 0,
    fat: 4,
    servingUnit: "100 grams"
  },
  {
    name: "Camel Ribs (Uncooked)",
    category: "meat",
    calories: 160,
    protein: 20,
    carbs: 0,
    fat: 9,
    servingUnit: "100 grams"
  },
  {
    name: "Camel Neck (Uncooked)",
    category: "meat",
    calories: 145,
    protein: 20,
    carbs: 0,
    fat: 7,
    servingUnit: "100 grams"
  },
  {
    name: "Camel Liver (Uncooked)",
    category: "meat",
    calories: 120,
    protein: 21,
    carbs: 2,
    fat: 3,
    servingUnit: "100 grams"
  },
  {
    name: "Camel Kidney (Uncooked)",
    category: "meat",
    calories: 115,
    protein: 20,
    carbs: 0,
    fat: 2.5,
    servingUnit: "100 grams"
  },
  {
    name: "Camel Heart (Uncooked)",
    category: "meat",
    calories: 130,
    protein: 20,
    carbs: 0,
    fat: 4,
    servingUnit: "100 grams"
  },
  {
    name: "Camel Brain (Uncooked)",
    category: "meat",
    calories: 305,
    protein: 12,
    carbs: 1,
    fat: 27,
    servingUnit: "100 grams"
  },
  {
    name: "Lamb Leg (Uncooked)",
    category: "meat",
    calories: 160,
    protein: 20,
    carbs: 0,
    fat: 8.5,
    servingUnit: "100 grams"
  },
  {
    name: "Lamb Shoulder (Uncooked)",
    category: "meat",
    calories: 190,
    protein: 18,
    carbs: 0,
    fat: 12,
    servingUnit: "100 grams"
  },
  {
    name: "Lamb Ribs (Uncooked)",
    category: "meat",
    calories: 220,
    protein: 17,
    carbs: 0,
    fat: 17,
    servingUnit: "100 grams"
  },
  {
    name: "Lamb Neck (Uncooked)",
    category: "meat",
    calories: 200,
    protein: 18,
    carbs: 0,
    fat: 14,
    servingUnit: "100 grams"
  },
  {
    name: "Lamb Liver (Uncooked)",
    category: "meat",
    calories: 135,
    protein: 21,
    carbs: 2,
    fat: 4,
    servingUnit: "100 grams"
  },
  {
    name: "Lamb Kidney (Uncooked)",
    category: "meat",
    calories: 120,
    protein: 20,
    carbs: 0,
    fat: 3,
    servingUnit: "100 grams"
  },
  {
    name: "Lamb Heart (Uncooked)",
    category: "meat",
    calories: 130,
    protein: 20,
    carbs: 0,
    fat: 4,
    servingUnit: "100 grams"
  },
  {
    name: "Lamb Brain (Uncooked)",
    category: "meat",
    calories: 315,
    protein: 11,
    carbs: 1,
    fat: 29,
    servingUnit: "100 grams"
  },
  {
  name: "Rohu Fish (Uncooked)",
  category: "fish",
  calories: 97,
  protein: 17,
  carbs: 0,
  fat: 3,
  servingUnit: "100 grams"
},
{
  name: "Pomfret (Uncooked)",
  category: "fish",
  calories: 110,
  protein: 20,
  carbs: 0,
  fat: 3.5,
  servingUnit: "100 grams"
},
{
  name: "Mackerel (Uncooked)",
  category: "fish",
  calories: 190,
  protein: 19,
  carbs: 0,
  fat: 12,
  servingUnit: "100 grams"
},
{
  name: "Salmon (Uncooked)",
  category: "fish",
  calories: 208,
  protein: 20,
  carbs: 0,
  fat: 13,
  servingUnit: "100 grams"
},
{
  name: "Tuna (Uncooked)",
  category: "fish",
  calories: 130,
  protein: 24,
  carbs: 0,
  fat: 3,
  servingUnit: "100 grams"
},
{
  name: "Tilapia (Uncooked)",
  category: "fish",
  calories: 96,
  protein: 20,
  carbs: 0,
  fat: 2,
  servingUnit: "100 grams"
},
{
  name: "Catla (Uncooked)",
  category: "fish",
  calories: 100,
  protein: 18,
  carbs: 0,
  fat: 3.5,
  servingUnit: "100 grams"
}


];

const dairy=[
  {
  name: "Egg (Whole)",
  category: "egg",
  calories: 70,
  protein: 6,
  carbs: 0.4,
  fat: 5,
  servingUnit: "1 egg"
},
{
  name: "Egg (Whites)",
  category: "egg",
  calories: 17,
  protein: 3.6,
  carbs: 0.2,
  fat: 0,
  servingUnit: "1 egg"
},
  {
    name: "Milk",
    category: "dairy",
    calories: 61,
    protein: 3.2,
    carbs: 4.8,
    fat: 3.3,
    servingUnit: "100 ml"
  },
   {
    name: "Yogurt",
    category: "dairy",
    calories: 61,
    protein: 3.5,
    carbs: 4.7,
    fat: 3.3,
    servingUnit: "100 grams"
  },
  {
  name: "Greek Yogurt",
  category: "dairy",
  calories: 59,
  protein: 10,
  carbs: 3.6,
  fat: 0.4,
  servingUnit: "100 grams"
},

  {
    name: "Cheddar Cheese",
    category: "dairy",
    calories: 403,
    protein: 25,
    carbs: 1.3,
    fat: 33,
    servingUnit: "100 grams"
  },

  {
  name: "Desi Ghee",
  category: "dairy",
  calories: 124,
  protein: 0,
  carbs: 0,
  fat: 14,
  servingUnit: "1 tablespoon (14g)"
},
{
  name: "Oil",
  category: "dairy",
  calories: 124,
  protein: 0,
  carbs: 0,
  fat: 14,
  servingUnit: "1 tablespoon (14g)"
},

{
  name: "Butter",
  category: "dairy",
  calories: 102,
  protein: 0.1,
  carbs: 0,
  fat: 11.5,
  servingUnit: "1 tablespoon (14g)"
},

 {
    name: "Paneer (Fresh Cheese)",
    category: "dairy",
    calories: 265,
    protein: 18,
    carbs: 1.2,
    fat: 21,
    servingUnit: "100 grams"
  },

];

const seeds=[
  {
  name: "Chia Seeds",
  category: "seeds",
  calories: 486,
  protein: 17,
  carbs: 42,
  fat: 31,
  servingUnit: "100 grams"
},
{
  name: "Flax Seeds",
  category: "seeds",
  calories: 534,
  protein: 18,
  carbs: 29,
  fat: 42,
  servingUnit: "100 grams"
},
{
  name: "Pumpkin Seeds (Pepitas)",
  category: "seeds",
  calories: 559,
  protein: 30,
  carbs: 11,
  fat: 49,
  servingUnit: "100 grams"
},
{
  name: "Sunflower Seeds",
  category: "seeds",
  calories: 584,
  protein: 21,
  carbs: 20,
  fat: 51,
  servingUnit: "100 grams"
},
{
  name: "Sesame Seeds",
  category: "seeds",
  calories: 573,
  protein: 18,
  carbs: 23,
  fat: 50,
  servingUnit: "100 grams"
},
{
  name: "Hemp Seeds",
  category: "seeds",
  calories: 553,
  protein: 32,
  carbs: 8.7,
  fat: 48.8,
  servingUnit: "100 grams"
},
{
  name: "Basil Seeds (Tukmaria)",
  category: "seeds",
  calories: 480,
  protein: 14,
  carbs: 42,
  fat: 25,
  servingUnit: "100 grams"
}

]

const legumes=[
  {
  name: "Dal (Uncooked)",
  category: "legumes",
  calories: 352,
  protein: 25,
  carbs: 60,
  fat: 1.1,
  servingUnit: "100 grams"
},
{
  name: "Dal Masoor (Uncooked)",
  category: "legumes",
  calories: 358,
  protein: 24,
  carbs: 63,
  fat: 1.3,
  servingUnit: "100 grams"
},
{
  name: "Kabuli Chana (Uncooked)",
  category: "legumes",
  calories: 364,
  protein: 19,
  carbs: 61,
  fat: 6,
  servingUnit: "100 grams"
},
{
  name: "Kala Chana (Uncooked)",
  category: "legumes",
  calories: 360,
  protein: 21,
  carbs: 60,
  fat: 5,
  servingUnit: "100 grams"
},
{
  name: "Kidney Beans",
  category: "legumes",
  calories: 333,
  protein: 24,
  carbs: 60,
  fat: 0.8,
  servingUnit: "100 grams"
},

{
  name: "Dal Moong (Uncooked)",
  category: "legumes",
  calories: 348,
  protein: 25,
  carbs: 59,
  fat: 1.3,
  servingUnit: "100 grams"
},
{
  name: "Urad Dal (Uncooked)",
  category: "legumes",
  calories: 347,
  protein: 25,
  carbs: 58,
  fat: 1.6,
  servingUnit: "100 grams"
},
{
  name: "Toor Dal (Uncooked)",
  category: "legumes",
  calories: 343,
  protein: 22,
  carbs: 62,
  fat: 1.7,
  servingUnit: "100 grams"
}

]

const grains=[
    {
  name: "White Rice (Cooked)",
  category: "grain",
  calories: 130,
  protein: 2.4,
  carbs: 28,
  fat: 0.3,
  servingUnit: "100 grams"
},

{
  name: "Roti (Whole Wheat, Cooked)",
  category: "grain",
  calories: 264,
  protein: 9,
  carbs: 49,
  fat: 6,
  servingUnit: "100 grams"
},

{
  name: "Khameeri Roti (Cooked)",
  category: "grain",
  calories: 275,
  protein: 8,
  carbs: 52,
  fat: 4,
  servingUnit: "100 grams"
},

{
  name: "Naan (Cooked)",
  category: "grain",
  calories: 275,
  protein: 8,
  carbs: 52,
  fat: 4,
  servingUnit: "100 grams"
},

  {
    name: "Oats (Uncooked)",
    category: "grain",
    calories: 389,
    protein: 16.9,
    carbs: 66.3,
    fat: 6.9,
    servingUnit: "100 grams"
  },

  {
  name: "Chapati (Cooked)",
  category: "grain",
  calories: 264,
  protein: 9,
  carbs: 49,
  fat: 6,
  servingUnit: "100 grams"
}

]

const fruits=[
  
  {
    name: "Banana",
    category: "fruit",
    calories: 89,
    protein: 1.1,
    carbs: 23,
    fat: 0.3,
    servingUnit: "100 grams"
  },
  {
    name: "Apple",
    category: "fruit",
    calories: 52,
    protein: 0.3,
    carbs: 14,
    fat: 0.2,
    servingUnit: "100 grams"
  },
  {
    name: "Mango",
    category: "fruit",
    calories: 60,
    protein: 0.8,
    carbs: 15,
    fat: 0.4,
    servingUnit: "100 grams"
  },
  {
    name: "Orange",
    category: "fruit",
    calories: 47,
    protein: 0.9,
    carbs: 12,
    fat: 0.1,
    servingUnit: "100 grams"
  },
  {
    name: "Watermelon",
    category: "fruit",
    calories: 30,
    protein: 0.6,
    carbs: 8,
    fat: 0.2,
    servingUnit: "100 grams"
  },
  {
    name: "Papaya",
    category: "fruit",
    calories: 43,
    protein: 0.5,
    carbs: 11,
    fat: 0.3,
    servingUnit: "100 grams"
  },
  {
    name: "Dates (Khajoor)",
    category: "fruit",
    calories: 277,
    protein: 1.8,
    carbs: 75,
    fat: 0.2,
    servingUnit: "100 grams"
  },
  {
    name: "Guava",
    category: "fruit",
    calories: 68,
    protein: 2.6,
    carbs: 14,
    fat: 1,
    servingUnit: "100 grams"
  },
  {
    name: "Grapes",
    category: "fruit",
    calories: 69,
    protein: 0.7,
    carbs: 18,
    fat: 0.2,
    servingUnit: "100 grams"
  },
  {
    name: "Pomegranate",
    category: "fruit",
    calories: 83,
    protein: 1.7,
    carbs: 19,
    fat: 1.2,
    servingUnit: "100 grams"
  },

    {
    name: "Melon",
    category: "fruit",
    calories: 34,
    protein: 0.8,
    carbs: 8,
    fat: 0.2,
    servingUnit: "100 grams"
  },
  {
    name: "Strawberries",
    category: "fruit",
    calories: 32,
    protein: 0.7,
    carbs: 7.7,
    fat: 0.3,
    servingUnit: "100 grams"
  },
  {
    name: "Avocado",
    category: "fruit",
    calories: 160,
    protein: 2,
    carbs: 8.5,
    fat: 14.7,
    servingUnit: "100 grams"
  },

   {
    name: "Apricot",
    category: "fruit",
    calories: 48,
    protein: 1.4,
    carbs: 11,
    fat: 0.4,
    servingUnit: "100 grams"
  },
  {
    name: "Plum",
    category: "fruit",
    calories: 46,
    protein: 0.7,
    carbs: 11.4,
    fat: 0.3,
    servingUnit: "100 grams"
  },
  {
    name: "Berries (Blueberries, Raspberries, Blackberries)",
    category: "fruit",
    calories: 50,
    protein: 1,
    carbs: 12,
    fat: 0.3,
    servingUnit: "100 grams"
  }

]

const vegetables=
[
  {
    name: "Spinach",
    category: "vegetable",
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    servingUnit: "100 grams"
  },
  {
    name: "Carrot",
    category: "vegetable",
    calories: 41,
    protein: 0.9,
    carbs: 10,
    fat: 0.2,
    servingUnit: "100 grams"
  },
  {
    name: "Cabbage",
    category: "vegetable",
    calories: 25,
    protein: 1.3,
    carbs: 6,
    fat: 0.1,
    servingUnit: "100 grams"
  },
  {
    name: "Tomato",
    category: "vegetable",
    calories: 18,
    protein: 0.9,
    carbs: 3.9,
    fat: 0.2,
    servingUnit: "100 grams"
  },
  {
    name: "Potato (boiled)",
    category: "vegetable",
    calories: 87,
    protein: 2,
    carbs: 20,
    fat: 0.1,
    servingUnit: "100 grams"
  },
  {
    name: "Onion",
    category: "vegetable",
    calories: 40,
    protein: 1.1,
    carbs: 9.3,
    fat: 0.1,
    servingUnit: "100 grams"
  },
  {
    name: "Cucumber",
    category: "vegetable",
    calories: 16,
    protein: 0.7,
    carbs: 3.6,
    fat: 0.1,
    servingUnit: "100 grams"
  },
  {
    name: "Bell Pepper (Capsicum)",
    category: "vegetable",
    calories: 31,
    protein: 1,
    carbs: 6,
    fat: 0.3,
    servingUnit: "100 grams"
  },
  {
    name: "Cauliflower",
    category: "vegetable",
    calories: 25,
    protein: 2,
    carbs: 5,
    fat: 0.3,
    servingUnit: "100 grams"
  },
  {
    name: "Eggplant (Brinjal)",
    category: "vegetable",
    calories: 25,
    protein: 1,
    carbs: 6,
    fat: 0.2,
    servingUnit: "100 grams"
  },

  {
    name: "Round Gourd (Tinda)",
    category: "vegetable",
    calories: 21,
    protein: 1,
    carbs: 4,
    fat: 0.1,
    servingUnit: "100 grams"
  },
  {
    name: "Pumpkin (Kaddu)",
    category: "vegetable",
    calories: 26,
    protein: 1,
    carbs: 6.5,
    fat: 0.1,
    servingUnit: "100 grams"
  },
  {
    name: "Ladyfinger (Bhindi / Okra)",
    category: "vegetable",
    calories: 33,
    protein: 2,
    carbs: 7,
    fat: 0.2,
    servingUnit: "100 grams"
  }

]

const beverages=[
  {
    name: "Coke (Coca-Cola or Next)",
    category: "beverage",
    calories: 42,
    carbs: 10.6,
    fat: 0,
    protein: 0,
    servingUnit: "100 ml"
  },
  {
    name: "Pepsi",
    category: "beverage",
    calories: 43,
    carbs: 11,
    fat: 0,
    protein: 0,
    servingUnit: "100 ml"
  },
  {
    name: "Sprite",
    category: "beverage",
    calories: 39,
    carbs: 9.6,
    fat: 0,
    protein: 0,
    servingUnit: "100 ml"
  },
  {
    name: "7Up",
    category: "beverage",
    calories: 40,
    carbs: 10,
    fat: 0,
    protein: 0,
    servingUnit: "100 ml"
  },
  {
    name: "Fanta",
    category: "beverage",
    calories: 44,
    carbs: 11,
    fat: 0,
    protein: 0,
    servingUnit: "100 ml"
  },
  {
  name: "Lemon Malt",
  category: "beverage",
  calories: 46,
  carbs: 11.5,
  fat: 0,
  protein: 0,
  servingUnit: "100 ml"
}
]

const fastFood=[
{
  name: "Zinger Burger",
  category: "fast food",
  calories: 600,
  protein: 25,
  carbs: 50,
  fat: 30,
  servingUnit: "1 burger"
}, 
 {
    name: "Zinger Burger (Large)",
    category: "fast food",
    calories: 750,
    protein: 25,
    carbs: 60,
    fat: 35,
    servingUnit: "1 burger"
  },
  {
    name: "Mighty Zinger Burger",
    category: "fast food",
    calories: 1000,
    protein: 45,
    carbs: 65,
    fat: 55,
    servingUnit: "1 burger"
  },
    {
    name: "French Fries",
    category: "fast food",
    calories: 312,
    protein: 3.4,
    carbs: 41,
    fat: 15,
    servingUnit: "100g"
  },
  {
    name: "Pizza Slice",
    category: "fast food",
    calories: 285,
    protein: 12,
    carbs: 37,
    fat: 11,
    servingUnit: "1 slice"
  },
  {
  name: "Beef Burger (Double Smashed Patty)",
  category: "fast food",
  calories: 900,
  protein: 45,
  carbs: 42,
  fat: 55,
  servingUnit: "1 burger"
}

]

const condiment=[
  {
  name: "Sugar",
  category: "condiment",
  calories: 48,
  protein: 0,
  carbs: 12.5,
  fat: 0,
  servingUnit: "1 tbsp (14g)"
},

{
  name: "Mayonnaise",
  category: "condiment",
  calories: 90,
  protein: 0,
  carbs: 0,
  fat: 10,
  servingUnit: "1 tbsp (14g)"
},
{
  name: "Ketchup",
  category: "condiment",
  calories: 20,
  protein: 0,
  carbs: 5,
  fat: 0,
  servingUnit: "1 tbsp (14g)"
}

]


// Helper function to calculate serving size from serving unit
const getServingSize = (servingUnit) => {
  if (!servingUnit) return 100;
  
  // Extract numbers from serving unit
  const match = servingUnit.match(/(\d+)/);
  if (match) {
    const number = parseInt(match[1]);
    // If it's clearly grams or ml, use that number
    if (servingUnit.includes('grams') || servingUnit.includes('ml')) {
      return number;
    }
    // For items like "1 egg", "1 tablespoon", etc., use the number but keep reasonable
    return number < 200 ? number : 100;
  }
  return 100; // Default fallback
};

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing food data only (preserve users)
  await prisma.foodEntry.deleteMany();
  await prisma.food.deleteMany();

  console.log('🗑️  Cleared existing data');

  let totalItems = 0;

  // Seed meat category (including fish)
  console.log('🥩 Seeding meat foods...');
  for (const food of meat) {
    await prisma.food.create({
      data: {
        ...food,
        servingSize: getServingSize(food.servingUnit)
      }
    });
  }
  totalItems += meat.length;
  console.log(`✅ Added ${meat.length} meat items`);

  // Seed dairy category (including eggs)
  console.log('🥛 Seeding dairy foods...');
  for (const food of dairy) {
    await prisma.food.create({
      data: {
        ...food,
        servingSize: getServingSize(food.servingUnit)
      }
    });
  }
  totalItems += dairy.length;
  console.log(`✅ Added ${dairy.length} dairy items`);

  // Seed seeds category
  console.log('🌰 Seeding seeds...');
  for (const food of seeds) {
    await prisma.food.create({
      data: {
        ...food,
        servingSize: getServingSize(food.servingUnit)
      }
    });
  }
  totalItems += seeds.length;
  console.log(`✅ Added ${seeds.length} seed items`);

  // Seed legumes category
  console.log('🫘 Seeding legumes...');
  for (const food of legumes) {
    await prisma.food.create({
      data: {
        ...food,
        servingSize: getServingSize(food.servingUnit)
      }
    });
  }
  totalItems += legumes.length;
  console.log(`✅ Added ${legumes.length} legume items`);

  // Seed grains category
  console.log('🌾 Seeding grains...');
  for (const food of grains) {
    await prisma.food.create({
      data: {
        ...food,
        servingSize: getServingSize(food.servingUnit)
      }
    });
  }
  totalItems += grains.length;
  console.log(`✅ Added ${grains.length} grain items`);

  // Seed fruits category
  console.log('🍎 Seeding fruits...');
  for (const food of fruits) {
    await prisma.food.create({
      data: {
        ...food,
        servingSize: getServingSize(food.servingUnit)
      }
    });
  }
  totalItems += fruits.length;
  console.log(`✅ Added ${fruits.length} fruit items`);

  // Seed vegetables category
  console.log('🥬 Seeding vegetables...');
  for (const food of vegetables) {
    await prisma.food.create({
      data: {
        ...food,
        servingSize: getServingSize(food.servingUnit)
      }
    });
  }
  totalItems += vegetables.length;
  console.log(`✅ Added ${vegetables.length} vegetable items`);

  // Seed beverages category
  console.log('🥤 Seeding beverages...');
  for (const food of beverages) {
    await prisma.food.create({
      data: {
        ...food,
        servingSize: getServingSize(food.servingUnit)
      }
    });
  }
  totalItems += beverages.length;
  console.log(`✅ Added ${beverages.length} beverage items`);

  // Seed fast food category
  console.log('🍔 Seeding fast foods...');
  for (const food of fastFood) {
    await prisma.food.create({
      data: {
        ...food,
        servingSize: getServingSize(food.servingUnit)
      }
    });
  }
  totalItems += fastFood.length;
  console.log(`✅ Added ${fastFood.length} fast food items`);

  // Seed condiment category
  console.log('🧂 Seeding condiments...');
  for (const food of condiment) {
    await prisma.food.create({
      data: {
        ...food,
        servingSize: getServingSize(food.servingUnit)
      }
    });
  }
  totalItems += condiment.length;
  console.log(`✅ Added ${condiment.length} condiment items`);

  console.log('\n' + '='.repeat(50));
  console.log('🎉 Seed completed successfully!');
  console.log(`📊 Total food items created: ${totalItems}`);
  console.log('='.repeat(50));
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });