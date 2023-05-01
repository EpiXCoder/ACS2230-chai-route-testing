require('dotenv').config()
const app = require('../server.js')
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = chai.assert

const User = require('../models/user.js')
const Message = require('../models/message.js')

chai.config.includeStack = true

const expect = chai.expect
const should = chai.should()
chai.use(chaiHttp)

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {}
  mongoose.modelSchemas = {}
  mongoose.connection.close()
  done()
})

const SAMPLE_USER_ID = mongoose.Types.ObjectId().toString();
const SAMPLE_MESSAGE_ID = mongoose.Types.ObjectId().toString();

describe('Message API endpoints', () => {
    before((done) => {
        const sampleUser = new User({
            username: 'myuser',
            password: 'mypassword',
            _id: SAMPLE_USER_ID
        })
        sampleUser.save()
        const sampleMessage = new Message({
            title: 'Prose',
            body: 'blah blah blah',
            author: sampleUser._id,
            _id: SAMPLE_MESSAGE_ID
        })
        sampleMessage.save()
        .then(() => {
            done()
        })
    })
    
    after((done) => {
        Message.deleteMany({ title: ['Prose'] })
        User.deleteMany({ username: ['myuser']  })
        .then(() => {
            done()
        })
    })

    it('should load all messages', (done) => {
        chai.request(app)
        .get('/messages')
        .end((err, res) => {
            if (err) { done(err) }
            expect(res).to.have.status(200)
            expect(res.body.data).to.be.an("array")
            done()
        })
    })

    it('should get one specific message', (done) => {
        chai.request(app)
        .get(`/messages/${SAMPLE_MESSAGE_ID}`)
        .end((err, res) => {
            if (err) { done(err) }
            expect(res).to.have.status(200)
            expect(res.body.data).to.be.an("object")
            expect(res.body.data._id).to.equal(SAMPLE_MESSAGE_ID)
            expect(res.body.data.title).to.equal("Prose")
            expect(res.body.data.body).to.equal("blah blah blah")
            done()
        })
    })
    

    it('should post a new message', (done) => {
        chai.request(app)
        .post('/messages')
        .send({
            title: 'New message',
            body: 'This is a new message',
            author: SAMPLE_USER_ID
        })
        .end((err, res) => {
            if (err) { done(err) }
            expect(res).to.have.status(201)
            expect(res.body.data).to.be.an("object")
            expect(res.body.data.title).to.equal("New message")
            expect(res.body.data.body).to.equal("This is a new message")
            done()
        })
    })
    

    it('should update a message', (done) => {
        chai.request(app)
        .put(`/messages/${SAMPLE_MESSAGE_ID}`)
        .send({ title: 'Updated title', body: 'Updated body' })
        .end((err, res) => {
            if (err) { done(err) }
            expect(res).to.have.status(200)
            expect(res.body.data).to.be.an("object")
            expect(res.body.data.title).to.equal("Updated title")
            expect(res.body.data.body).to.equal("Updated body")
            done()
        })
    })
    

    it('should delete a message', (done) => {
        chai.request(app)
        .delete(`/messages/${SAMPLE_MESSAGE_ID}`)
        .end((err, res) => {
            if (err) { done(err) }
            expect(res).to.have.status(200)
            expect(res.body.data).to.be.an("object")
            expect(res.body.data._id).to.equal(SAMPLE_MESSAGE_ID)
    
            // Verify that the message was actually deleted
            Message.findById(SAMPLE_MESSAGE_ID, (err, message) => {
                if (err) { done(err) }
                expect(message).to.be.null
                done()
            })
        })
    })
    
})