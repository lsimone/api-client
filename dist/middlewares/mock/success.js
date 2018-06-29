'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = mock;
function mock(_ref, res) {
    var mockedRes = _ref.options.mock;

    // if mock===true, no change is needed: the request has been sent to mock server
    if (mockedRes && mockedRes !== true) {
        console.warn('*** mocked response', mockedRes);
        return _extends(res, { data: mockedRes });
    } else return res;
}