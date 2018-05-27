'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getCaller = getCaller;
exports.mapValues = mapValues;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * returns caller function using Error.stack API
 *
 * @param {number} [stackJump] jumps back to the <stackJump + 1>NTH function above the current function.
 * i.e: if you call getCaller(1) from function `fn()`, it will return the name of the function that is 2 positions
 * above `fn()` in the call stack. `getCaller()` without arguments will return the name of the direct caller function.
 */
function getCaller() {
    var stackJump = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;


    try {
        return new Error().stack.split(/\r?\n/)[stackJump + 3].replace(/\s*at\s*/, '');
    } catch (e) {
        console.log('getCaller() not possible');
    }
}

function mapValues(obj, mapFn) {
    return Object.keys(obj).reduce(function (acc, key) {
        return _extends({}, acc, _defineProperty({}, key, mapFn(obj[key])));
    }, {});
}