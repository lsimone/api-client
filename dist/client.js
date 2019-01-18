'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.init = init;
exports.getClient = getClient;
exports.call = call;

require('isomorphic-fetch');

var _status = require('./middlewares/status');

var _status2 = _interopRequireDefault(_status);

var _map = require('./middlewares/map');

var _map2 = _interopRequireDefault(_map);

var _success = require('./middlewares/mock/success');

var _success2 = _interopRequireDefault(_success);

var _error = require('./middlewares/mock/error');

var _error2 = _interopRequireDefault(_error);

var _fallback = require('./middlewares/fallback');

var _fallback2 = _interopRequireDefault(_fallback);

var _extractData = require('./middlewares/extractData');

var _extractData2 = _interopRequireDefault(_extractData);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var URL_MATCHER_REGEXP = new RegExp('(\\:([^\\/]+))', 'g');
var ARRAY_SEPARATOR = ',';

var DEFAULT_OPTIONS = {
    middlewares: [],
    debug: false,
    fullResponse: false,
    mergeHeaders: true,
    mock: false,
    headers: {}
};

var globalOptions = {};

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
function init(defaultHost, getDefaultHeaders) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    hydrateBaseOpt(defaultHost, getDefaultHeaders, globalOptions, options);
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
function getClient(defaultHost, getDefaultHeaders) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var instanceOptions = hydrateBaseOpt(defaultHost, getDefaultHeaders, {}, options);

    return function (endpoint, options) {
        return _call(endpoint, _extends({}, instanceOptions, options));
    };
}

function hydrateBaseOpt(defaultHost, getDefaultHeaders, baseOpt, options) {
    return _extends(baseOpt, DEFAULT_OPTIONS, _extends({
        host: defaultHost,
        getDefaultHeaders: getDefaultHeaders
    }, options));
}

function wrapFetchWithTimeout(url, opt, timeout) {
    if (timeout !== undefined) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                return reject({ status: 408, ok: false, statusText: 'CLIENT TIMEOUT: ' + timeout + ' elapsed and no response has been received' });
            }, timeout);
            fetch(url, opt).then(resolve).catch(reject);
        });
    } else return fetch(url, opt);
}

function _call(endpoint, options) {
    var host = options.host,
        mock = options.mock,
        params = options.params,
        mergeHeaders = options.mergeHeaders,
        headers = options.headers,
        body = options.body,
        method = options.method,
        debug = options.debug,
        middlewares = options.middlewares,
        getDefaultHeaders = options.getDefaultHeaders,
        mockServerPort = options.mockServerPort;

    var basePath = mock === true ? 'http://localhost:' + mockServerPort : host;
    var url = getUrl(basePath, endpoint, params);

    var opt = _extends({
        headers: mergeHeaders ? _extends({}, getDefaultHeaders(), headers) : headers || getDefaultHeaders(),
        method: method || (body ? 'POST' : 'GET')
    }, body ? { body: typeof body === 'string' ? body : JSON.stringify(body) } : {});

    var req = { host: host, url: url, debug: debug, fetchOpt: opt, options: options };

    var middlewaresSequence = [_status2.default, _fallback2.default, _map2.default].concat(_toConsumableArray(middlewares), [_extractData2.default]);

    // TODO: to be uncommented the next line and commented the one below
    debug && console.log('API-CLIENT CALL', (0, _utils.getCaller)(1), req);

    var mockedFetch = wrapFetchWithTimeout(url, opt, options.timeout).then(_success2.default.bind(this, req)).catch(_error2.default.bind(this, req));

    // middleware binding
    return chainMiddlewares(mockedFetch, middlewaresSequence, req);
}

/**
 *
 * @param {String} endpoint
 * @param {Object} [options] options that override the defaults
 * @param {String} [options.host] target host for the request
 * @param {Object} [options.body] body payload sent through the request
 * @param {Object} [options.headers] they will override getDefaultHeaders() return object by default
 * @param {Boolean} [options.mergeHeaders=true] if true, headers provided are merged with getDefaultHeaders() return object
 * @param {Number} [options.timeout] timeout in ms: it will raise a client timeout error if response is not received
 * before <timeout>ms.
 * @param {Object} [options.mock=false] this object will be used as a temporary mock when an API endpoint is not ready yet.
 * @param {Object} [options.mockServerPort] mocking server port.
 * @param {Object} [options.fallback] this object will be used as response data when an API endpoint returns error (and no mock option is set).
 * @param {Object} [options.model] this object will be used through object-mapper in order to map the API response to our model.
 * If not defined, no mapping will be performed.
 * @param {String} [options.method] if not defined, POST will be used if body is present, otherwise GET is used as default.
 * @param {Boolean} [options.blob] if defined, data will be extracted as a blob, otherwise, it will default to a json encoding
 * @param {Object} [options.params] this object is matched against the endpoint expression. All the parameters not present in it,
 * @param {Boolean} [options.fullResponse=false] it returns the whole response object (not only the data received)
 * will be attached as query string
 *
 * @return {Promise<Object, Error>}
 */
function call(endpoint) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return _call(endpoint, _extends({}, globalOptions, options));
}

function chainMiddlewares(promise, middlewares, req) {
    var _this = this;

    return middlewares.reduce(function (acc, fn) {
        return acc.then(fn.bind(_this, req));
    }, promise);
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
function getUrl(host, endpoint) {
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var toBePlaced = sanitizeParams(params);

    // substitute the path placeholders
    var path = (endpoint.match(URL_MATCHER_REGEXP) || []).reduce(function (acc, placeholder) {
        var key = placeholder.substr(1);
        if (!toBePlaced[key]) {
            throw new Error('endpoint parameter "' + key + '" has to be defined for ' + endpoint);
        }
        var replaced = acc.replace(placeholder, toBePlaced[key]);
        delete toBePlaced[key];
        return replaced;
    }, endpoint);

    var query = Object.keys(toBePlaced).map(function (key) {
        return [key, encodeQueryString(toBePlaced[key])].join('=');
    }).join('&');

    var url = !query.length ? path : [path, query].join('?');

    return [host, url].join('/');
}

function sanitizeParams(params) {
    return Object.keys(params).reduce(function (acc, key) {
        // filter undefined values
        return params[key] !== undefined ? _extends({}, acc, _defineProperty({}, key, params[key])) : acc;
    }, {});
}

/**
 * serialize value for query string
 *
 * @ignore
 * @param {String|String[]} obj
 * @return {String} encoded string
 */
function encodeQueryString(obj) {
    if (Array.isArray(obj)) {
        return obj.map(encodeURI).join(ARRAY_SEPARATOR);
    }
    return encodeURI(obj);
}