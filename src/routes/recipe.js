const express = require('express');
const router = express.Router();

const authenticate = require('../middleware/auth');

const Recipe = require('../models/recipe');
const User = require('../models/user');

router.get('/', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.auth.userId);
    const recipes = await Recipe.find({ _id: { $in: user.recipes } });
    res.json({ message: 'Recipes retrieved successfully', data: recipes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:recipeId', authenticate, async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ _id: req.params.recipeId });
    if (recipe.user.toString() !== req.auth.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json({ message: 'Recipe retrieved successfully', data: recipe });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    let recipe = new Recipe({ ...req.body, user: req.auth.userId });
    await recipe.save();

    const user = await User.findById(req.auth.userId);
    user.recipes.unshift(recipe);
    await user.save();

    res.status(201).json({ message: 'Recipe created successfully', data: recipe });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:recipeId', authenticate, async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ _id: req.params.recipeId });
    if (recipe.user.toString() !== req.auth.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    await Recipe.findByIdAndUpdate(req.params.recipeId, req.body);
    const updatedRecipe = await Recipe.findOne({ _id: req.params.recipeId });

    res.json({ message: 'Recipe updated successfully', data: updatedRecipe });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:recipeId', authenticate, async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ _id: req.params.recipeId });
    if (recipe.user.toString() !== req.auth.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.recipeId);
    const user = await User.findById(req.auth.userId);
    user.recipes = user.recipes.filter(recipe => recipe.toString() !== req.params.recipeId);
    await user.save();

    res.json({ message: 'Recipe deleted successfully', data: { _id: req.params.recipeId } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

module.exports = router;

