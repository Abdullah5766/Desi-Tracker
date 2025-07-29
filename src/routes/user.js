const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Validation rules
const updateProfileValidation = [
  body('age').optional().isInt({ min: 13, max: 120 }).withMessage('Age must be between 13 and 120'),
  body('weight').optional().isFloat({ min: 20, max: 500 }).withMessage('Weight must be between 20 and 500 kg'),
  body('height').optional().isFloat({ min: 50, max: 250 }).withMessage('Height must be between 50 and 250 cm'),
  body('gender').optional().isIn(['male', 'female']).withMessage('Gender must be male or female'),
  body('activityLevel').optional().isIn(['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active'])
    .withMessage('Invalid activity level'),
  body('goal').optional().isIn(['lose_weight', 'maintain', 'gain_weight', 'gain_muscle']).withMessage('Invalid goal')
];

const updateGoalsValidation = [
  body('calorieGoal').optional().isInt({ min: 800, max: 5000 }).withMessage('Calorie goal must be between 800 and 5000'),
  body('proteinGoal').optional().isFloat({ min: 0, max: 500 }).withMessage('Protein goal must be between 0 and 500g'),
  body('carbGoal').optional().isFloat({ min: 0, max: 1000 }).withMessage('Carb goal must be between 0 and 1000g'),
  body('fatGoal').optional().isFloat({ min: 0, max: 300 }).withMessage('Fat goal must be between 0 and 300g')
];

// Helper function to format user response
const formatUserResponse = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  age: user.dateOfBirth ? Math.floor((new Date() - new Date(user.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000)) : null,
  weight: user.weight,
  height: user.height,
  gender: user.gender?.toLowerCase() || null,
  activityLevel: user.activityLevel?.toLowerCase().replace('_', '_') || null,
  goal: user.goal?.toLowerCase().replace('_', '_') || null,
  calorieGoal: user.calorieGoal,
  proteinGoal: user.proteinGoal,
  carbGoal: user.carbGoal,
  fatGoal: user.fatGoal,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: formatUserResponse(user)
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile'
    });
  }
});

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, updateProfileValidation, async (req, res) => {
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

    const { age, weight, height, gender, activityLevel, goal } = req.body;

    // Build update object with only provided fields
    const updateData = {};
    if (age !== undefined) {
      // Calculate date of birth from age (approximate)
      const currentYear = new Date().getFullYear();
      const birthYear = currentYear - parseInt(age);
      updateData.dateOfBirth = new Date(`${birthYear}-01-01`);
    }
    if (weight !== undefined) updateData.weight = weight;
    if (height !== undefined) updateData.height = height;
    if (gender !== undefined) updateData.gender = gender.toUpperCase();
    if (activityLevel !== undefined) updateData.activityLevel = activityLevel.toUpperCase();
    if (goal !== undefined) {
      // Map frontend goal values to database enum values
      const goalMapping = {
        'lose': 'LOSE_WEIGHT',
        'maintain': 'MAINTAIN', 
        'gain': 'GAIN_WEIGHT'
      };
      updateData.goal = goalMapping[goal] || goal.toUpperCase();
    }

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: formatUserResponse(user)
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user profile'
    });
  }
});

// @route   PUT /api/user/goals
// @desc    Update user nutrition goals
// @access  Private
router.put('/goals', auth, async (req, res) => {
  try {
    const { calorieGoal, proteinGoal, carbGoal, fatGoal } = req.body;

    // Build update object with only provided fields
    const updateData = {};
    if (calorieGoal !== undefined) updateData.calorieGoal = parseInt(calorieGoal);
    if (proteinGoal !== undefined) updateData.proteinGoal = parseFloat(proteinGoal);
    if (carbGoal !== undefined) updateData.carbGoal = parseFloat(carbGoal);
    if (fatGoal !== undefined) updateData.fatGoal = parseFloat(fatGoal);

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Nutrition goals updated successfully',
      data: {
        user: formatUserResponse(user)
      }
    });

  } catch (error) {
    console.error('Update goals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update nutrition goals'
    });
  }
});

// @route   GET /api/user/stats
// @desc    Get user statistics and progress
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const { period = '7' } = req.query; // Default to 7 days
    const daysBack = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    // Get user profile
    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get food entries for the period
    const foodEntries = await prisma.foodEntry.findMany({
      where: {
        userId: req.userId,
        date: {
          gte: startDate
        }
      },
      include: {
        food: true
      },
      orderBy: {
        date: 'desc'
      }
    });

    // Calculate daily totals
    const dailyTotals = {};
    
    foodEntries.forEach(entry => {
      const dateKey = entry.date.toISOString().split('T')[0];
      
      if (!dailyTotals[dateKey]) {
        dailyTotals[dateKey] = {
          date: dateKey,
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          entries: 0
        };
      }

      const multiplier = entry.quantity / 100; // Convert to per-gram multiplier
      dailyTotals[dateKey].calories += entry.food.calories * multiplier;
      dailyTotals[dateKey].protein += entry.food.protein * multiplier;
      dailyTotals[dateKey].carbs += entry.food.carbs * multiplier;
      dailyTotals[dateKey].fat += entry.food.fat * multiplier;
      dailyTotals[dateKey].entries += 1;
    });

    // Calculate averages
    const dailyValues = Object.values(dailyTotals);
    const totalDays = Math.max(dailyValues.length, 1);
    
    const averages = {
      calories: dailyValues.reduce((sum, day) => sum + day.calories, 0) / totalDays,
      protein: dailyValues.reduce((sum, day) => sum + day.protein, 0) / totalDays,
      carbs: dailyValues.reduce((sum, day) => sum + day.carbs, 0) / totalDays,
      fat: dailyValues.reduce((sum, day) => sum + day.fat, 0) / totalDays
    };

    // Calculate goal progress (today's progress)
    const today = new Date().toISOString().split('T')[0];
    const todayTotals = dailyTotals[today] || {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      entries: 0
    };

    const goalProgress = {
      calories: {
        consumed: Math.round(todayTotals.calories),
        goal: user.calorieGoal || 0,
        percentage: user.calorieGoal ? Math.round((todayTotals.calories / user.calorieGoal) * 100) : 0
      },
      protein: {
        consumed: Math.round(todayTotals.protein * 10) / 10,
        goal: user.proteinGoal || 0,
        percentage: user.proteinGoal ? Math.round((todayTotals.protein / user.proteinGoal) * 100) : 0
      },
      carbs: {
        consumed: Math.round(todayTotals.carbs * 10) / 10,
        goal: user.carbGoal || 0,
        percentage: user.carbGoal ? Math.round((todayTotals.carbs / user.carbGoal) * 100) : 0
      },
      fat: {
        consumed: Math.round(todayTotals.fat * 10) / 10,
        goal: user.fatGoal || 0,
        percentage: user.fatGoal ? Math.round((todayTotals.fat / user.fatGoal) * 100) : 0
      }
    };

    res.json({
      success: true,
      data: {
        period: `${daysBack} days`,
        dailyTotals: Object.values(dailyTotals).sort((a, b) => new Date(b.date) - new Date(a.date)),
        averages: {
          calories: Math.round(averages.calories),
          protein: Math.round(averages.protein * 10) / 10,
          carbs: Math.round(averages.carbs * 10) / 10,
          fat: Math.round(averages.fat * 10) / 10
        },
        goalProgress,
        totalEntries: foodEntries.length,
        activeDays: Object.keys(dailyTotals).length
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics'
    });
  }
});

module.exports = router;