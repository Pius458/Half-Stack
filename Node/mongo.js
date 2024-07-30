require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB

mongoose.set('strictQuery',false)
mongoose.connect(url)
  .then(() => console.log('Connected to mongoDb'))
  .catch(err => console.log('failed to connect to MongoDb',err))


const noteSchema = new mongoose.Schema({
  content : String,
  important : Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const createNote = () => {

  Note.find({})
    .then(result => {
      result.forEach(note => {
        console.log(note)
      })
      mongoose.connection.close()
    })
}
createNote()