import map from './mapper'

/**
 * maps models and collections, even if nested
 *
 * @param model
 * @return {Object} mapped obj
 */
export default function mapToModel ({options: {model}, debug}, res) {
    debug && console.log('mapping', res)
    if (model && res.data !== undefined) {
        res.data = Array.isArray(res.data)
            ? res.data.map(item => map(item, model)) : map(res.data, model)
    }
    return res
}
