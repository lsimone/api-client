'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = status;
function status(req, res) {
    // returns res or a promise that resolves with res
    return res.ok ? extractJson(res, req.debug) : Object.assign(res, { errorCode: res.status });
}

function extractJson(res, debug) {
    return res.json().then(function (data) {
        return Object.assign(res, { data: data });
    }).catch(function (e) {
        debug && console.error('extractJson() api-client error', e);
        return res;
    });
}