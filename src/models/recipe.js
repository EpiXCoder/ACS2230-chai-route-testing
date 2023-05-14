const mongoose = require('mongoose')
const Schema = mongoose.Schema

const IngredientSchema = new Schema({
    name: { type: String, required: true },
    quantity: { type: String, required: true },
})

const RecipeSchema = new Schema({
    name: { type: String, required: true },
    ingredients: [IngredientSchema],
    directions: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
})

const Recipe = mongoose.model('Recipe', RecipeSchema)

module.exports = Recipe
