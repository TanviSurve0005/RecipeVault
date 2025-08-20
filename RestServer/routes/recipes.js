const express = require('express');
const asyncHandler = require('express-async-handler');
const Recipe = require('../models/Recipe');

const router = express.Router();

// @desc    Get all recipes
// @route   GET /api/recipes
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const search = req.query.search ? {
    $or: [
      { title: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
      { tags: { $in: [new RegExp(req.query.search, 'i')] } }
    ]
  } : {};

  const recipes = await Recipe.find(search)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Recipe.countDocuments(search);

  res.json({
    success: true,
    count: recipes.length,
    total,
    pagination: {
      page,
      pages: Math.ceil(total / limit)
    },
    data: recipes
  });
}));

// @desc    Get single recipe
// @route   GET /api/recipes/:id
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    res.status(404);
    throw new Error('Recipe not found');
  }

  res.json({
    success: true,
    data: recipe
  });
}));

// @desc    Create new recipe
// @route   POST /api/recipes
// @access  Public
router.post('/', asyncHandler(async (req, res) => {
  const recipe = await Recipe.create(req.body);

  res.status(201).json({
    success: true,
    data: recipe
  });
}));

// @desc    Update recipe
// @route   PUT /api/recipes/:id
// @access  Public
router.put('/:id', asyncHandler(async (req, res) => {
  let recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    res.status(404);
    throw new Error('Recipe not found');
  }

  recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.json({
    success: true,
    data: recipe
  });
}));

// @desc    Delete recipe
// @route   DELETE /api/recipes/:id
// @access  Public
router.delete('/:id', asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    res.status(404);
    throw new Error('Recipe not found');
  }

  await Recipe.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    data: {}
  });
}));

// @desc    Get recipes by tag
// @route   GET /api/recipes/tag/:tag
// @access  Public
router.get('/tag/:tag', asyncHandler(async (req, res) => {
  const recipes = await Recipe.find({ 
    tags: { $in: [new RegExp(req.params.tag, 'i')] }
  }).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: recipes.length,
    data: recipes
  });
}));

module.exports = router;