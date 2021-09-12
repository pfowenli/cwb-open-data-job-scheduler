const {
    CustomHttpClient,
} = require('./utils')
const {
    StationRepository,
    ObservationRepository,
} = require('./repository')
const {
    CWB_OPEN_DATA,
} = require('./config')

const {
    HttpClient,
    HttpMethod,
} = CustomHttpClient

const CITY_NAMES = [
    "臺北市",
    "新北市",
    "桃園市"
]
const STATION_STATUS_ENUMERATIONS = {
    VALID: "現存測站",
    INVALID: "已撤銷"
}


const _taskFunction = async () => {
    await _syncStations()
    await _syncObservations()   
}

async function _listStations() {
    const filter = {
        countyName: { $in: CITY_NAMES },
        status: STATION_STATUS_ENUMERATIONS.VALID,
    }
    const options = {}
    const stations = await StationRepository.findMany(filter, options)

    return stations
}

async function _syncStations() {
    const client = new HttpClient()
    client
        .setMethod(HttpMethod.GET)
        .setUrl(`${CWB_OPEN_DATA.BASE_URL}/${CWB_OPEN_DATA.STATION_C_B0074_002_API}`)
        .setQuery(new Map()
            .set('Authorization', CWB_OPEN_DATA.AUTH_KEY))
    const response = await client.sendRequest()

    const stations = response.data.records.data.stationStatus.station;
    console.log(`${stations.length} stations fetched`)

    for (const _station of stations) {
        if (!CITY_NAMES.includes(_station.countyName)) {
            continue
        }

        const stationData = {
            stationId: _station.stationID,
            stationName: _station.stationName,
            stationNameEN: _station.stationNameEN,
            stationAltitude: _station.stationAltitude,
            longitude: _station.longitude,
            latitude: _station.latitude,
            countyName: _station.countyName,
            stationAddress: _station.stationAddress,
            startDate: _station.startDate,
            endDate: _station.endDate,
            status: _station.status,
            note: _station.note,
            originalStationId: _station.originalStationId,
            newStationId: _station.newStationId,
        }

        const station = await StationRepository.findOneByStationId(stationData.stationId)

        if (!station) {
            await StationRepository.saveOne(stationData)
            continue
        }
    }
}


async function _syncObservations() {
    const client = new HttpClient()
    client
        .setMethod(HttpMethod.GET)
        .setUrl(`${CWB_OPEN_DATA.BASE_URL}/${CWB_OPEN_DATA.OBSERVATION_O_A0001_002_API}`)
        .setQuery(new Map()
            .set('Authorization', CWB_OPEN_DATA.AUTH_KEY))
    const response = await client.sendRequest()
    
    const observations = response.data.records.location
    console.log(`${observations.length} observations fetched`)

    const stations = await _listStations()
    const stationIds = stations.map(_stationId => _stationId.stationId)
    console.log(`${stations.length} stations stored`)

    for (const _observation of observations) {
        if (!stationIds.includes(_observation.stationId)) {
            continue
        }

        const observationData = {
            stationId: _observation.stationId,
            observationTime: new Date(_observation.time.obsTime),
        }

        const weatherElements = _observation.weatherElement
        for (const weatherElement of weatherElements) {
            observationData[weatherElement.elementName] = weatherElement.elementValue
        }

        const observation = await ObservationRepository.findOneByStationIdAndObservationTime(observationData.stationId, observationData.observationTime)

        if (!observation) {
            await ObservationRepository.saveOne(observationData)
            continue
        }
    }
}

exports.taskFunction = _taskFunction
