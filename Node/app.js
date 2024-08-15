const configs = require('./utils/configs')
const logger = require('./utils/logger')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const noteRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const middlewares = require('./utils/middleware')
const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

mongoose.connect(configs.MONGODB, {
   serverSelectionTimeoutMS: 30000
})
        .then(() => {
            logger.info('Connected to mongoDb')
        })
        .catch(error => logger.error('error connecting to MongoDb', error.message))

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middlewares.requestLogger)

app.use('/api/notes',noteRouter)
app.use('/api/users', usersRouter)

app.use(middlewares.unknownEndpoint)
app.use(middlewares.errorHandler)

module.exports = app