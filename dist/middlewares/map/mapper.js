'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = map;

var _utils = require('../../utils');

var _objectMapper = require('object-mapper');

var _objectMapper2 = _interopRequireDefault(_objectMapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isModel = function isModel(dest) {
    return (typeof dest === 'undefined' ? 'undefined' : _typeof(dest)) === 'object' && dest.model;
};

function map(obj, model) {
    return (0, _objectMapper2.default)(obj, wrapModels(model));
}

function wrapModels(model) {
    return (0, _utils.mapValues)(model, function (dest) {
        return isModel(dest) ? {
            key: dest.key,
            transform: function transform(obj) {
                return (0, _objectMapper2.default)(obj, dest.model);
            }
        } : dest;
    });
}