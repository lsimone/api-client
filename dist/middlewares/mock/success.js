'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = mock;
function mock(_ref, res) {
    var mockedRes = _ref.options.mock;

    // if mock===true, no change is needed: the request has been sent to mock server
    if (mockedRes && mockedRes !== true) {
        console.warn('*** mocked response', mockedRes);
        return Object.assign(res, { data: mockedRes });
    } else return res;
}