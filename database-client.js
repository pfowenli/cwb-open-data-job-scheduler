const {
    CustomDatabaseClient,
} = require('./utils')
const {
    DATABASE,
} = require('./config')

const _databaseClient = new CustomDatabaseClient()
    .setHost(DATABASE.HOST)
    .setPort(DATABASE.PORT)
    .setUsername(DATABASE.USERNAME)
    .setPassword(DATABASE.PASSWORD)
    .setAuthDatabaseName(DATABASE.AUTH_DATABASE_NAME)
    .setDatabaseName(DATABASE.DATABASE_NAME)

module.exports = _databaseClient
