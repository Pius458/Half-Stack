const path = require('path')
require('dotenv').configDotenv({ path: '../../Notes/.env',override: false })

const PORT = process.env.PORT
const MONGODB = process.env.MONGODB

module.exports = {
    MONGODB,
    PORT
}