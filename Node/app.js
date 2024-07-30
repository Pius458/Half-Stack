const configs = require('./utils/configs')
const logger = require('./utils/logger')
const express = require('express')
const app = express()
const cors = require('cors')
const noteRouter = require('./controllers/notes')
const middlewares = require('./utils/middleware')
const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

logger.info('Connecting to: ', configs.MONGODB)

mongoose.connect(configs.MONGODB)
        .then(() => {
            logger.info('Connected to mongoDb')
        })
        .catch(error => logger.error('error connecting to MOngoDb', error.message))

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middlewares.requestLogger)

app.use('/api/notes',noteRouter)

app.use(middlewares.unknownEndpoint)
app.use(middlewares.errorHandler)

module.exports = app