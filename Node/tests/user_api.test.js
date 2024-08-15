const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const User  = require('../models/user')
const helper = require('./test_helper')
const supertest  = require('supertest')
const {test,describe,after,beforeEach} = require('node:test')
const assert = require('node:assert')

const app = require('../app')
const api = supertest(app)

describe('when there is initially one user in database', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({username: 'pius', passwordHash})

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart  = await helper.usersInDb()

        const newUser = {
            username: 'mluukia',
            name: 'SuperName',
            password: 'content',
        }

        await api
                .post('/api/users')
                .send(newUser)
                .expect(201)
                .expect('Content-Type', /application\/json/)

        const userAtEnd = await helper.usersInDb()

        assert.strictEqual(userAtEnd.length, usersAtStart.length + 1)

        const username = userAtEnd.map(u => u.username)
        assert(username.includes(newUser.username))
    })

    test('creation fails if username already exist', async() => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'pius',
            name: 'Super test',
            password: 'new'
        }
        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(500)
            .expect('Content-Type', /text\/html/)

        console.log(result.body)
        const userAtEnd = await helper.usersInDb()
        console.log('users at end: ', userAtEnd)

        assert.strictEqual(usersAtStart.length,userAtEnd.length)
    })
    

    after( async () => {
        await mongoose.connection.close()

    })
})

