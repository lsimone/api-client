import fetch from 'isomorphic-fetch'
import status from './middlewares/status'
import mapToModel from './middlewares/map'
import mockSuccess from './middlewares/mock/success'
import mockError from './middlewares/mock/error'
import fallback from './middlewares/fallback'
import extractData from './middlewares/extractData'
import { getCaller } from './utils'

let _defaultHost, _getDefaultHeaders, _customMiddlewares, _debug, _mockServerPort
const URL_MATCHER_REGEXP = new RegExp('(\\:([^\\/]+))', 'g')
const ARRAY_SEPARATOR = ','

/**
 *
 * @param {String} defaultHost
 * @param {Function} getDefaultHeaders
 * @param {Object} [options]
 * @param {Function[]} [options.middlewares]
 * @param {Number} [options.mockServerPort]
 * @param {Boolean} [options.debug] debug mode: log enabled
 */
export function init (defaultHost, getDefaultHeaders, options = {}) {
    _defaultHost = defaultHost
    _getDefaultHeaders = getDefaultHeaders
    _customMiddlewares = options.middlewares || []
    _debug = options.debug
    _mockServerPort = options.mockServerPort
}

/**
 *
 * @param {String} endpoint
 * @param {Object} [options]
 * @param {String} [options.host]
 * @param {Object} [options.body]
 * @param {Object} [options.mock] this object will be used as a temporary mock when an API endpoint is not ready yet.
 * @param {Object} [options.fallback] this object will be used as response data when an API endpoint returns error (and no mock option is set).
 * @param {Object} [options.model] this object will be used through object-mapper in order to map the API response to our model.
 * If not defined, no mapping will be performed.
 * @param {String} [options.method] if not defined, POST will be used if body is present, otherwise GET is used as default.
 * @param {Object} [options.params] this object is matched against the endpoint expression. All the parameters not present in it,
 * @param {Boolean} [options.fullResponse] it returns the whole response object (not only the data received)
 * will be attached as query string
 *
 * @return {Promise<Object, Error>}
 */
export function call (endpoint, options = {}) {
    const host = options.host || _defaultHost
    const basePath = (options.mock === true)? `http://localhost:${_mockServerPort}` : host
    const url = getUrl(basePath, endpoint, options.params)
    const opt = {
        headers: {
            ..._getDefaultHeaders(),
            ...options.headers
        },
        method: options.method || (options.body ? 'POST' : 'GET'),
        ...(options.body ? {body: JSON.stringify(options.body)} : {})
    }

    const req = {
        host,
        url,
        debug: _debug,
        fetchOpt: opt,
        options
    }

    const middlewares = [
        status,
        fallback,
        mapToModel,
        ..._customMiddlewares,
        extractData
    ]

    // TODO: to be uncommented the next line and commented the one below
    _debug && console.log('API-CLIENT CALL', getCaller(1), req)

    const mockedFetch = fetch(url, opt)
        .then(mockSuccess.bind(this, req))
        .catch(mockError.bind(this, req))

    // middleware binding
    return chainMiddlewares(mockedFetch, middlewares, req)
}

function chainMiddlewares (promise, middlewares, req) {
    return middlewares.reduce((acc, fn) => acc.then(fn.bind(this, req)), promise)
}

// ?country_in=82&discounted=1&limit=10&sort_by=-relevance

/**
 *
 * @param {String} host
 * @param {String} endpoint
 * @param {Object} params this object is matched against the endpoint expression. All the parameters not present in it,
 * will be attached as query string
 *
 * @return {string} url
 */
function getUrl (host, endpoint, params = {}) {
    const toBePlaced = {...params}

    // substitute the path placeholders
    let path = (endpoint.match(URL_MATCHER_REGEXP) || [])
        .reduce((acc, placeholder) => {
            const key = placeholder.substr(1)
            if (!toBePlaced[key]) {
                throw new Error(`endpoint parameter "${key}" has to be defined for ${endpoint}`)
            }
            const replaced = acc.replace(placeholder, toBePlaced[key])
            delete toBePlaced[key]
            return replaced
        }, endpoint)

    const query = Object.keys(toBePlaced)
        .map(key => [key, encodeQueryString(toBePlaced[key])].join('='))
        .join('&')

    const url = !query.length ? path : [path, query].join('?')

    return [host, url].join('/')
}

/**
 * serialize value for query string
 *
 * @param {String|String[]} obj
 * @return {String} encoded string
 */
function encodeQueryString (obj) {
    if (Array.isArray(obj)) {
        return obj
            .map(encodeURI)
            .join(ARRAY_SEPARATOR)
    }
    return encodeURI(obj)
}
