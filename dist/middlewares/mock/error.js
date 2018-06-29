'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = mock;
function mock(_ref, error) {
    var mockedRes = _ref.options.mock;

    if (mockedRes && mockedRes !== true) {
        console.warn('*** mocked response', mockedRes);
        return _extends(error, { data: mockedRes });
    } else return error;
}