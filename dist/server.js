'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.call = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _client = require('./client');

Object.defineProperty(exports, 'call', {
    enumerable: true,
    get: function get() {
        return _client.call;
    }
});
exports.init = init;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _swaggerMockApi = require('swagger-mock-api');

var _swaggerMockApi2 = _interopRequireDefault(_swaggerMockApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function init(defaultHost, getDefaultHeaders) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var mockServerPort = void 0;

    if (options.swagger) {
        console.log('MOCK SERVER INIT');
        mockServerPort = options.mockServerPort || 3000;

        var app = (0, _express2.default)();

        // /node_modules/api-client/dist  =>  3 levels down to the project root
        var swaggerFile = _path2.default.join(__dirname, '../../../', options.swagger);

        app.use((0, _cors2.default)(), (0, _swaggerMockApi2.default)({
            swaggerFile: swaggerFile,
            watch: true // enable reloading the routes and schemas when the swagger file changes
        }));

        app.listen(mockServerPort, function () {
            return console.log('Mock server listening on port ' + mockServerPort + '!');
        });
    }

    return (0, _client.init)(defaultHost, getDefaultHeaders, _extends({}, options, { mockServerPort: mockServerPort }));
}