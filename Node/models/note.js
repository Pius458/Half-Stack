require('dotenv').configDotenv({ path: '../../Notes/.env',override: false })
const mongoose = require('mongoose')

const url = process.env.MONGODB

mongoose.connect(url)
  .then(() => console.log('Connected to mongoDb'))
  .catch(err => console.log('failed to connect to MongoDb',err))


const noteSchema = new mongoose.Schema({
  content : {
    type: String,
    minLength: 5,
    required: true
  },
  important : Boolean,
})
noteSchema.set('toJSON', {
  transform: (document,returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject._v
  }
})

module.exports = mongoose.model('Note', noteSchema)