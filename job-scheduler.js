const cron = require('node-cron')
const DatabaseClient = require('./database-client')
const {
    CustomAsyncWrap,
} = require('./utils')
const {
    taskFunction,
} = require('./job-handler')
const {
    CRON_EXPRESSION,
    SCHEDULE_OPTIONS
} = require('./config')


DatabaseClient.connect()

const scheduledTask = cron.schedule(CRON_EXPRESSION, CustomAsyncWrap(taskFunction), SCHEDULE_OPTIONS)
scheduledTask.start()
console.log('job started')
