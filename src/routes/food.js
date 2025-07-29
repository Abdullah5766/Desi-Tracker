const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Validation rules
const searchValidation = [
  query('q')
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters')
    .trim()
];

const addFoodEntryValidation = [
  body('foodId').isString().notEmpty().withMessage('Food ID is required'),
  body('quantity').isFloat({ min: 1, max: 2000 }).withMessage('Quantity must be between 1 and 2000 grams'),
  body('mealType').isIn(['breakfast', 'lunch', 'dinner', 'snack']).withMessage('Invalid meal type'),
  body('date').optional().isISO8601().withMessage('Invalid date format')
];

const updateFoodEntryValidation = [
  body('quantity').optional().isFloat({ min: 1, max: 2000 }).withMessage('Quantity must be between 1 and 2000 grams'),
  body('mealType').optional().isIn(['breakfast', 'lunch', 'dinner', 'snack']).withMessage('Invalid meal type'),
  body('date').optional().isISO8601().withMessage('Invalid date format')
];

// Helper function to format food response
const formatFoodResponse = (food) => ({
  id: food.id,
  name: food.name,
  category: food.category,
  calories: food.calories,
  protein: food.protein,
  carbs: food.carbs,
  fat: food.fat,
  servingSize: food.servingSize,
  servingUnit: food.servingUnit,
  isCommonDesi: false // All foods are now non-Desi since we removed isDesiFood
});

// Helper function to format food entry response
const formatFoodEntryResponse = (entry) => ({
  id: entry.id,
  quantity: entry.quantity,
  mealType: entry.meal?.toLowerCase() || 'breakfast', // Map enum to lowercase
  date: entry.date,
  createdAt: entry.createdAt,
  updatedAt: entry.updatedAt,
  food: entry.food ? formatFoodResponse(entry.food) : null,
  // Calculate nutritional values based on quantity and serving unit
  nutritionalValues: entry.food ? (() => {
    let multiplier;
    
    // For items with specific serving units (like slices, eggs, burgers), use quantity directly
    // since nutrition values are already per serving
    if (entry.food.servingUnit?.includes('slice') || 
        entry.food.servingUnit?.includes('egg') || 
        entry.food.servingUnit?.includes('burger') || 
        entry.food.servingUnit?.includes('tablespoon')) {
      multiplier = entry.quantity;
    } else {
      // For gram-based items, calculate per 100g as before
      multiplier = entry.quantity / 100;
    }
    
    return {
      calories: Math.round((entry.food.calories * multiplier) * 10) / 10,
      protein: Math.round((entry.food.protein * multiplier) * 10) / 10,
      carbs: Math.round((entry.food.carbs * multiplier) * 10) / 10,
      fat: Math.round((entry.food.fat * multiplier) * 10) / 10
    };
  })() : null
});

// @route   GET /api/food/search
// @desc    Search for foods
// @access  Private
router.get('/search', auth, searchValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { q: query, desi_only = 'false', limit = '20' } = req.query;
    
    const searchLimit = Math.min(parseInt(limit), 50); // Max 50 results
    const desiOnly = desi_only.toLowerCase() === 'true';

    // Build search conditions
    const whereConditions = {
      name: {
        contains: query,
        mode: 'insensitive'
      }
    };

    // Note: desiOnly parameter is ignored since we removed isDesiFood column

    const foods = await prisma.food.findMany({
      where: whereConditions,
      take: searchLimit,
      orderBy: {
        name: 'asc'
      }
    });

    res.json({
      success: true,
      data: {
        foods: foods.map(formatFoodResponse),
        total: foods.length,
        query: query,
        desiOnly
      }
    });

  } catch (error) {
    console.error('Food search error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search foods'
    });
  }
});

// @route   GET /api/food/popular
// @desc    Get popular/common Desi foods
// @access  Private
router.get('/popular', auth, async (req, res) => {
  try {
    const { limit = '15' } = req.query;
    const searchLimit = Math.min(parseInt(limit), 30);

    const popularFoods = await prisma.food.findMany({
      take: searchLimit,
      orderBy: {
        name: 'asc'
      }
    });

    res.json({
      success: true,
      data: {
        foods: popularFoods.map(formatFoodResponse),
        total: popularFoods.length
      }
    });

  } catch (error) {
    console.error('Get popular foods error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch popular foods'
    });
  }
});

// @route   POST /api/food/entries
// @desc    Add a food entry (log food consumption)
// @access  Private
router.post('/entries', auth, addFoodEntryValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { foodId, quantity, mealType, date } = req.body;

    // Verify food exists
    const food = await prisma.food.findUnique({
      where: { id: foodId }
    });

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food not found'
      });
    }

    // Map meal type to enum
    const mealTypeEnum = mealType.toUpperCase()
    
    // Create food entry
    const foodEntry = await prisma.foodEntry.create({
      data: {
        userId: req.userId,
        foodId,
        quantity,
        meal: mealTypeEnum,
        date: date ? new Date(date) : new Date()
      },
      include: {
        food: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Food entry added successfully',
      data: {
        entry: formatFoodEntryResponse(foodEntry)
      }
    });

  } catch (error) {
    console.error('Add food entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add food entry'
    });
  }
});

// @route   GET /api/food/entries
// @desc    Get user's food entries
// @access  Private
router.get('/entries', auth, async (req, res) => {
  try {
    const { date, meal_type, limit = '50', offset = '0' } = req.query;
    
    const searchLimit = Math.min(parseInt(limit), 100);
    const searchOffset = parseInt(offset);

    // Build where conditions
    const whereConditions = {
      userId: req.userId
    };

    if (date) {
      const searchDate = new Date(date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);

      whereConditions.date = {
        gte: searchDate,
        lt: nextDay
      };
    }

    if (meal_type) {
      whereConditions.meal = meal_type.toUpperCase();
    }

    const entries = await prisma.foodEntry.findMany({
      where: whereConditions,
      include: {
        food: true
      },
      take: searchLimit,
      skip: searchOffset,
      orderBy: {
        date: 'desc'
      }
    });

    // Get total count for pagination
    const totalCount = await prisma.foodEntry.count({
      where: whereConditions
    });

    res.json({
      success: true,
      data: {
        entries: entries.map(formatFoodEntryResponse),
        pagination: {
          total: totalCount,
          limit: searchLimit,
          offset: searchOffset,
          hasMore: totalCount > searchOffset + searchLimit
        }
      }
    });

  } catch (error) {
    console.error('Get food entries error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch food entries'
    });
  }
});

// @route   PUT /api/food/entries/:id
// @desc    Update a food entry
// @access  Private
router.put('/entries/:id', auth, updateFoodEntryValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { quantity, mealType, date } = req.body;

    // Check if entry exists and belongs to user
    const existingEntry = await prisma.foodEntry.findFirst({
      where: {
        id,
        userId: req.userId
      }
    });

    if (!existingEntry) {
      return res.status(404).json({
        success: false,
        message: 'Food entry not found'
      });
    }

    // Build update data
    const updateData = {};
    if (quantity !== undefined) updateData.quantity = quantity;
    if (mealType !== undefined) updateData.meal = mealType.toUpperCase();
    if (date !== undefined) updateData.date = new Date(date);

    const updatedEntry = await prisma.foodEntry.update({
      where: { id },
      data: updateData,
      include: {
        food: true
      }
    });

    res.json({
      success: true,
      message: 'Food entry updated successfully',
      data: {
        entry: formatFoodEntryResponse(updatedEntry)
      }
    });

  } catch (error) {
    console.error('Update food entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update food entry'
    });
  }
});

// @route   DELETE /api/food/entries/:id
// @desc    Delete a food entry
// @access  Private
router.delete('/entries/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if entry exists and belongs to user
    const existingEntry = await prisma.foodEntry.findFirst({
      where: {
        id,
        userId: req.userId
      }
    });

    if (!existingEntry) {
      return res.status(404).json({
        success: false,
        message: 'Food entry not found'
      });
    }

    await prisma.foodEntry.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Food entry deleted successfully'
    });

  } catch (error) {
    console.error('Delete food entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete food entry'
    });
  }
});

// @route   GET /api/food/entries/daily-totals
// @desc    Get daily nutrition totals
// @access  Private
router.get('/entries/daily-totals', auth, async (req, res) => {
  try {
    const { date } = req.query;
    
    // Default to today if no date provided
    const searchDate = date ? new Date(date) : new Date();
    const nextDay = new Date(searchDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const entries = await prisma.foodEntry.findMany({
      where: {
        userId: req.userId,
        date: {
          gte: searchDate,
          lt: nextDay
        }
      },
      include: {
        food: true
      }
    });

    // Calculate totals by meal type
    const totals = {
      breakfast: { calories: 0, protein: 0, carbs: 0, fat: 0, entries: 0 },
      lunch: { calories: 0, protein: 0, carbs: 0, fat: 0, entries: 0 },
      dinner: { calories: 0, protein: 0, carbs: 0, fat: 0, entries: 0 },
      snack: { calories: 0, protein: 0, carbs: 0, fat: 0, entries: 0 },
      total: { calories: 0, protein: 0, carbs: 0, fat: 0, entries: 0 }
    };

    entries.forEach(entry => {
      // Handle different serving units for calculation
      let multiplier;
      if (entry.food.servingUnit?.includes('slice') || 
          entry.food.servingUnit?.includes('egg') || 
          entry.food.servingUnit?.includes('burger') || 
          entry.food.servingUnit?.includes('tablespoon')) {
        multiplier = entry.quantity;
      } else {
        multiplier = entry.quantity / 100;
      }
      
      const mealTotals = totals[entry.meal?.toLowerCase() || 'breakfast'];
      
      mealTotals.calories += entry.food.calories * multiplier;
      mealTotals.protein += entry.food.protein * multiplier;
      mealTotals.carbs += entry.food.carbs * multiplier;
      mealTotals.fat += entry.food.fat * multiplier;
      mealTotals.entries += 1;

      // Add to daily total
      totals.total.calories += entry.food.calories * multiplier;
      totals.total.protein += entry.food.protein * multiplier;
      totals.total.carbs += entry.food.carbs * multiplier;
      totals.total.fat += entry.food.fat * multiplier;
      totals.total.entries += 1;
    });

    // Round values
    Object.keys(totals).forEach(mealType => {
      totals[mealType].calories = Math.round(totals[mealType].calories);
      totals[mealType].protein = Math.round(totals[mealType].protein * 10) / 10;
      totals[mealType].carbs = Math.round(totals[mealType].carbs * 10) / 10;
      totals[mealType].fat = Math.round(totals[mealType].fat * 10) / 10;
    });

    res.json({
      success: true,
      data: {
        date: searchDate.toISOString().split('T')[0],
        totals,
        entryCount: entries.length
      }
    });

  } catch (error) {
    console.error('Get daily totals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch daily totals'
    });
  }
});

// @route   GET /api/food/:id
// @desc    Get single food item
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const food = await prisma.food.findUnique({
      where: { id }
    });

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food not found'
      });
    }

    res.json({
      success: true,
      data: {
        food: formatFoodResponse(food)
      }
    });

  } catch (error) {
    console.error('Get food error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch food'
    });
  }
});

module.exports = router;