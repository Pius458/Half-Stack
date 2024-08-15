const Note = require('../models/note')
const User = require('../models/user')
const logger = require('../utils/logger')

const initialNote = [
    {
        content : 'HTML is easy',
        important: true
    },
    {
        content: 'Browser can execute only javascript',
        important : false
    }
]

const nonExistingID = async () => {
    const note = new Note({ content : 'willremovethissooon'})
    await note.save()
    await note.deleteOne()

    return note._id.toString
}

const notesInDb = async () => {
    const notes = await Note.find({})

    return notes.map(note => note.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})

    return users.map(u => u.toJSON())
}

module.exports = {
    initialNote,
    nonExistingID,
    notesInDb,
    usersInDb
}