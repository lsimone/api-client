'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = mock;
function mock(_ref, error) {
    var mockedRes = _ref.options.mock;

    if (mockedRes && mockedRes !== true) {
        console.warn('*** mocked response', mockedRes);
        return Object.assign(error, { data: mockedRes });
    } else return error;
}