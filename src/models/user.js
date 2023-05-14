const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, select: false },
    recipes : [{ type: Schema.Types.ObjectId, ref: "Recipe" }]
  })

UserSchema.pre('findOne', function (next) {
    this.populate('recipes')
    next()
})

UserSchema.pre('find', function (next) {
    this.populate('recipes')
    next()
})
  
const User = mongoose.model('User', UserSchema)

module.exports = User