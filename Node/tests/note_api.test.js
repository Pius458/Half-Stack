const {test,describe,after,beforeEach} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Note = require('../models/note')
const testHelper = require('./test_helper')



const api = supertest(app)


describe('notes', () => {
    beforeEach(async () => {
        await Note.deleteMany({})
        
        const noteObject = testHelper.initialNote
                .map(note => new Note(note))
        
        const promiseArray = noteObject.map(note => note.save())
        await Promise.all(promiseArray)
    })
    
    test('notes are returned as json', async () => {
        await api
            .get('/api/notes')
            .expect(200)
            .expect('Content-Type',/application\/json/)
    })
    
    test('there are two notes', async () => {
        const response = await api.get('/api/notes')
    
        assert.strictEqual(response.body.length, testHelper.initialNote.length)
    })
    
    test('first note is about HTML methods', async () => {
        const response = await api.get('/api/notes')
    
        const contents = response.body.map(e => e.content)
        assert(contents.includes('HTML is easy'))
    })

    test('a valid note can be added', async () => {
        const newNote = {
            content: 'async/await simplifies making async calls',
            important: true
        }

        await api
                .post('/api/notes')
                .send(newNote)
                .expect(201)
                .expect('Content-Type', /application\/json/)

        notesAtEnd = await testHelper.notesInDb()

        assert.strictEqual(notesAtEnd.length, testHelper.initialNote.length + 1 )

        const contents = notesAtEnd.map(e => e.content)
        assert(contents.includes('async/await simplifies making async calls'))
    })

    test('note without content is not added', async () => {
        const newNote = {
            important: true
        }

        await api
                .post('/api/notes')
                .send(newNote)
                .expect(400)

        const notesAtEnd = await testHelper.notesInDb()

        assert.strictEqual(notesAtEnd.length, testHelper.initialNote.length)
    })

    test('a speccific note can be viewed', async () => {
        const noteAtStart = await testHelper.notesInDb()

        const noteToView = noteAtStart[0]

        const resultNote = await api
                .get(`/api/notes/${noteToView.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

        assert.deepStrictEqual(resultNote.body, noteToView)
    })

   /* test('a note can be deleted', async () => {
        const noteAtStart = await testHelper.notesInDb()

        const noteToDelete = noteAtStart[0]

        await api
            .delete(`/api/notes/${noteToDelete.id}`)
            .expect(204)

        const noteAtEnd = await testHelper.notesInDb()
        
        const contents = noteAtEnd.map(n => n.content)
        assert(!contents.includes(noteToDelete.content))

        assert.strictEqual(noteAtEnd.length,testHelper.initialNote.length - 1)
    }) */
    
    after(async () => {
        await mongoose.connection.close()
    })
})