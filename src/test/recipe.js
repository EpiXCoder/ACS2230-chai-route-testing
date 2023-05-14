require('dotenv').config()
const app = require('../server.js')
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')

const User = require('../models/user.js')
const Recipe = require('../models/recipe.js')

chai.config.includeStack = true

const expect = chai.expect
chai.use(chaiHttp)

/**
 * root level hooks
 */
after((done) => {
  mongoose.models = {}
  mongoose.modelSchemas = {}
  mongoose.connection.close()
  done()
})

const SAMPLE_USER_ID = mongoose.Types.ObjectId().toString();
const SAMPLE_RECIPE_ID = mongoose.Types.ObjectId().toString();

describe('Recipe API endpoints', () => {
    before((done) => {
        const sampleUser = new User({
            username: 'myuser',
            password: 'mypassword',
            _id: SAMPLE_USER_ID
        })
        sampleUser.save()

        const sampleRecipe = new Recipe({
            name: "Pancakes",
            ingredients: [
                {
                    "name": "Flour",
                    "quantity": "1 cup"
                },
                {
                    "name": "Eggs",
                    "quantity": "2"
                }
            ],
            directions: "Mix all ingredients together...",
            user: sampleUser._id,
            _id: SAMPLE_RECIPE_ID
        })

        sampleRecipe.save()
        .then(() => {
            done()
        })
    })
    
    after((done) => {
        Recipe.deleteMany({ name: ['Pancakes'] })
        User.deleteMany({ username: ['myuser']  })
        .then(() => {
            done()
        })
    })

    it('should load all recipes', (done) => {
        chai.request(app)
        .get('/recipes')
        .end((err, res) => {
            if (err) { done(err) }
            expect(res).to.have.status(200)
            expect(res.body.data).to.be.an("array")
            done()
        })
    })

    it('should get one specific recipe', (done) => {
        chai.request(app)
        .get(`/recipes/${SAMPLE_RECIPE_ID}`)
        .end((err, res) => {
            if (err) { done(err) }
            expect(res).to.have.status(200)
            expect(res.body.data).to.be.an("object")
            expect(res.body.data._id).to.equal(SAMPLE_RECIPE_ID)
            expect(res.body.data.name).to.equal("Pancakes")
            expect(res.body.data.directions).to.equal("Mix all ingredients together...")
            done()
        })
    })

    it('should post a new recipe', (done) => {
        chai.request(app)
        .post('/recipes')
        .send({
            name: "New Recipe",
            ingredients: [
                {
                    "name": "Ingredient1",
                    "quantity": "1 unit"
                },
                {
                    "name": "Ingredient2",
                    "quantity": "2 units"
                }
            ],
            directions: "Mix all ingredients together...",
            user: SAMPLE_USER_ID
        })
        .end((err, res) => {
            if (err) { done(err) }
            expect(res).to.have.status(201)
            expect(res.body.data).to.be.an("object")
            expect(res.body.data.name).to.equal("New Recipe")
            expect(res.body.data.directions).to.equal("Mix all ingredients together...")
            done()
        })
    })

    it('should update a recipe', (done) => {
        chai.request(app)
        .put(`/recipes/${SAMPLE_RECIPE_ID}`)
            .send({
                name: "Updated Recipe",
                ingredients: [
                    {
                        "name": "Ingredient1",
                        "quantity": "2 units"
                    },
                    {
                        "name": "Ingredient2",
                        "quantity": "3 units"
                    }
                ],
                directions: "Updated directions..."
            })
            .end((err, res) => {
                if (err) { done(err) }
                expect(res).to.have.status(200)
                expect(res.body.data).to.be.an("object")
                expect(res.body.data.name).to.equal("Updated Recipe")
                expect(res.body.data.directions).to.equal("Updated directions...")
                done()
            })
        })
    
        it('should delete a recipe', (done) => {
            chai.request(app)
            .delete(`/recipes/${SAMPLE_RECIPE_ID}`)
            .end((err, res) => {
                if (err) { done(err) }
                expect(res).to.have.status(200)
                expect(res.body.data).to.be.an("object")
                expect(res.body.data._id).to.equal(SAMPLE_RECIPE_ID)
    
                // Verify that the recipe was actually deleted
                Recipe.findById(SAMPLE_RECIPE_ID, (err, recipe) => {
                    if (err) { done(err) }
                    expect(recipe).to.be.null
                    done()
                })
            })
        })
        
    })
    