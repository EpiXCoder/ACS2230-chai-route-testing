const express = require('express')
const recipeRoutes = require('./recipe.js')
const userRoutes = require('./user.js')

const router = express.Router()

router.use('/recipes', recipeRoutes)
router.use('/users', userRoutes)

module.exports = router