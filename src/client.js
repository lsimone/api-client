import 'isomorphic-fetch'
import status from './middlewares/status'
import mapToModel from './middlewares/map'
import mockSuccess from './middlewares/mock/success'
import mockError from './middlewares/mock/error'
import fallback from './middlewares/fallback'
import extractData from './middlewares/extractData'
import { getCaller } from './utils'

const URL_MATCHER_REGEXP = new RegExp('(\\:([^\\/]+))', 'g')
const ARRAY_SEPARATOR = ','

const DEFAULT_OPTIONS = {
    middlewares: [],
    debug: false,
    fullResponse: false,
    mergeHeaders: true,
    mock: false,
    headers: {}
}

const globalOptions = {}

/**
 *
 * @param {String} defaultHost
 * @param {Function} getDefaultHeaders
 * @param {Object} [options]
 * @param {Function[]} [options.middlewares]
 * @param {Number} [options.mockServerPort]
 * @param {Boolean} [options.debug] debug mode: log enabled
 * @param {Boolean} [options.mergeHeaders=true] if true, headers provided are merged with getDefaultHeaders() return object
 */
export function init (defaultHost, getDefaultHeaders, options = {}) {
    hydrateBaseOpt(defaultHost, getDefaultHeaders, globalOptions, options)
}

/**
 *
 * @param {String} defaultHost
 * @param {Function} getDefaultHeaders
 * @param {Object} [options]
 * @param {Function[]} [options.middlewares]
 * @param {Number} [options.mockServerPort]
 * @param {Boolean} [options.debug] debug mode: log enabled
 * @param {Boolean} [options.mergeHeaders=true] if true, headers provided are merged with getDefaultHeaders() return object
 *
 * @return {Function} call function
 *
 */
export function getClient (defaultHost, getDefaultHeaders, options = {}) {
    const instanceOptions = hydrateBaseOpt(defaultHost, getDefaultHeaders, {}, options)

    return (endpoint, options) => _call(endpoint, {...instanceOptions, ...options})
}

function hydrateBaseOpt (defaultHost, getDefaultHeaders, baseOpt, options) {
    return Object.assign(baseOpt, DEFAULT_OPTIONS, {
        host: defaultHost,
        getDefaultHeaders,
        ...options
    })
}

function _call (endpoint, options) {
    const {host, mock, params, mergeHeaders, headers, body, method, debug, middlewares, getDefaultHeaders, mockServerPort} = options
    const basePath = (mock === true) ? `http://localhost:${mockServerPort}` : host
    const url = getUrl(basePath, endpoint, params)

    const opt = {
        headers: mergeHeaders ? {
            ...getDefaultHeaders(),
            ...headers
        } : (headers || getDefaultHeaders()),
        method: method || (body ? 'POST' : 'GET'),
        ...(body ? {body: JSON.stringify(body)} : {})
    }

    const req = { host, url, debug, fetchOpt: opt, options }

    const middlewaresSequence = [
        status,
        fallback,
        mapToModel,
        ...middlewares,
        extractData
    ]

    // TODO: to be uncommented the next line and commented the one below
    debug && console.log('API-CLIENT CALL', getCaller(1), req)

    const mockedFetch = fetch(url, opt)
        .then(mockSuccess.bind(this, req))
        .catch(mockError.bind(this, req))

    // middleware binding
    return chainMiddlewares(mockedFetch, middlewaresSequence, req)
}

/**
 *
 * @param {String} endpoint
 * @param {Object} [options] options that override the defaults
 * @param {String} [options.host] target host for the request
 * @param {Object} [options.body] body payload sent through the request
 * @param {Object} [options.headers] they will override getDefaultHeaders() return object by default
 * @param {Boolean} [options.mergeHeaders=true] if true, headers provided are merged with getDefaultHeaders() return object
 * @param {Object} [options.mock=false] this object will be used as a temporary mock when an API endpoint is not ready yet.
 * @param {Object} [options.mockServerPort] mocking server port.
 * @param {Object} [options.fallback] this object will be used as response data when an API endpoint returns error (and no mock option is set).
 * @param {Object} [options.model] this object will be used through object-mapper in order to map the API response to our model.
 * If not defined, no mapping will be performed.
 * @param {String} [options.method] if not defined, POST will be used if body is present, otherwise GET is used as default.
 * @param {Object} [options.params] this object is matched against the endpoint expression. All the parameters not present in it,
 * @param {Boolean} [options.fullResponse=false] it returns the whole response object (not only the data received)
 * will be attached as query string
 *
 * @return {Promise<Object, Error>}
 */
export function call (endpoint, options = {}) {
    return _call(endpoint, {...globalOptions, ...options})
}

function chainMiddlewares (promise, middlewares, req) {
    return middlewares.reduce((acc, fn) => acc.then(fn.bind(this, req)), promise)
}

// ?country_in=82&discounted=1&limit=10&sort_by=-relevance

/**
 * @ignore
 *
 * @param {String} host
 * @param {String} endpoint
 * @param {Object} params this object is matched against the endpoint expression. All the parameters not present in it,
 * will be attached as query string
 *
 * @return {string} url
 */
function getUrl (host, endpoint, params = {}) {
    const toBePlaced = sanitizeParams(params)

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

function sanitizeParams (params) {
    return Object.keys(params)
        .reduce((acc, key) => {
        // filter undefined values
            return params[key] !== undefined ?
                {...acc, [key]: params[key] } : acc
        }, {})
}

/**
 * serialize value for query string
 *
 * @ignore
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
