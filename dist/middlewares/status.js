'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = status;
var PARSE_METHOD = {
    blob: 'blob',
    text: 'text',
    default: 'json'
};

function status(req, res) {
    // returns res or a promise that resolves with res
    var parse = req.options.parse;

    return res.ok ? res.status === 204 ? res : extract(res, req.debug, parse) : _extends(res, { errorCode: res.status });
}

function extract(res, debug, parse) {
    return res[PARSE_METHOD[parse || 'default']]().then(function (data) {
        return _extends(res, { data: data });
    }).catch(function (e) {
        debug && console.error('extractJson() api-client error', e);
        return res;
    });
}