"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = fallback;
function fallback(_ref, res) {
    var fallback = _ref.options.fallback;

    return fallback !== undefined && res.data === undefined ? Object.assign(res, { data: fallback }) : res;
}