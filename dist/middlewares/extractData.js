"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = extractData;
var enrichResponse = function enrichResponse(req, res) {
    return Object.assign(res, {
        req: req
    });
};

function extractData(req, res) {
    var fullResponse = req.options.fullResponse;

    return res.ok ? Promise.resolve(fullResponse ? enrichResponse(req, res) : res.data) : Promise.reject({ status: res.errorCode, response: res });
}