'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = status;
function status(req, res) {
    // returns res or a promise that resolves with res
    var blob = req.options.blob;

    return res.ok ? res.status === 204 ? res : extractJson(res, req.debug, blob) : _extends(res, { errorCode: res.status });
}

function extractJson(res, debug, blob) {
    return res[blob ? 'blob' : 'json']().then(function (data) {
        return _extends(res, { data: data });
    }).catch(function (e) {
        debug && console.error('extractJson() api-client error', e);
        return res;
    });
}