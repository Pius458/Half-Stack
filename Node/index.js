const app = require('./app')
const logger = require('./utils/logger')
const configs = require('./utils/configs')

app.listen(configs.PORT, () => {
    logger.info(`Server running on port ${configs.PORT}`)
})