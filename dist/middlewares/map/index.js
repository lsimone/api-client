'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = mapToModel;

var _mapper = require('./mapper');

var _mapper2 = _interopRequireDefault(_mapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * maps models and collections, even if nested
 *
 * @param model
 * @return {Object} mapped obj
 */
function mapToModel(_ref, res) {
    var model = _ref.options.model,
        debug = _ref.debug;

    debug && console.log('mapping', res);
    if (model && res.data !== undefined) {
        res.data = Array.isArray(res.data) ? res.data.map(function (item) {
            return (0, _mapper2.default)(item, model);
        }) : (0, _mapper2.default)(res.data, model);
    }
    return res;
}