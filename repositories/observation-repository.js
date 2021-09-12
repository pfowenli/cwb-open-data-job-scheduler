const DatabaseClient = require('../database-client')


async function _getCollection() {
    const collectionName = 'Observations'
    const collection = (await DatabaseClient.existsCollection(collectionName)) ?
        DatabaseClient.getCollection(collectionName) :
        await DatabaseClient.createCollection(collectionName)

    return collection
}

const _saveOne = async (model = {}) => {
    const collection = await _getCollection()

    const data = {
        stationId: model.stationId,
        observationTime: model.observationTime,
        CITY: model.CITY,
        CITY_SN: model.CITY_SN,
        TOWN: model.TOWN,
        TOWN_SN: model.TOWN_SN,
        ELEV: model.ELEV,
        WDIR: model.WDIR,
        WDSD: model.WDSD,
        TEMP: model.TEMP,
        HUMD: model.HUMD,
        PRES: model.PRES,
        H_24R: model.H_24R,
        H_FX: model.H_FX,
        H_XD: model.H_XD,
        H_FXT: model.H_FXT,
        D_TX: model.D_TX,
        D_TXT: model.D_TXT,
        D_TN: model.D_TN,
        D_TNT: model.D_TNT,
    }

    await collection.insertOne(data)

    return model
}

const _findOneByStationIdAndObservationTime = async (stationId = '', observationTime = '') => {
    const collection = await _getCollection()

    const filter = {
        stationId,
        observationTime,
    }

    const model = collection.findOne(filter)
    
    return model
}

const _findMany = async (options = {}) => {
    const collection = await _getCollection()

    const cursor = collection.find(filter)

    if (options.limit) {
        cursor.limit(options.limit)
    }
    
    const models = await cursor.toArray()

    return models
}

exports.saveOne = _saveOne
exports.findOneByStationIdAndObservationTime = _findOneByStationIdAndObservationTime
exports.findMany = _findMany
