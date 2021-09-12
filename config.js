const _config = {
    CRON_EXPRESSION: '* * */1 * * *',
    SCHEDULE_OPTIONS: {
        scheduled: false,
        timezone: 'Asia/Taipei'
    },
    CWB_OPEN_DATA: {
        BASE_URL: 'https://opendata.cwb.gov.tw/api',
        AUTH_KEY: 'AUTH_KEY',
        STATION_C_B0074_001_API: '/v1/rest/datastore/C-B0074-001',
        STATION_C_B0074_002_API: '/v1/rest/datastore/C-B0074-002',
        OBSERVATION_O_A0001_002_API: '/v1/rest/datastore/O-A0001-001',
        OBSERVATION_O_A0002_002_API: '/v1/rest/datastore/O-A0002-001',
    },
    DATABASE: {
        HOST: 'localhost',
        PORT: 27017,
        USERNAME: 'USERNAME',
        PASSWORD: 'PASSWORD',
        AUTH_DATABASE_NAME: 'AUTH_DATABASE_NAME',
        DATABASE_NAME: 'DATABASE_NAME',
    }
}

module.exports = _config
