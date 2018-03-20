import map from './mapper'

/**
 * maps models and collections, even if nested
 *
 * @param model
 * @return {Object} mapped obj
 */
export default function mapToModel ({options: {model}, debug}, res) {
    debug && console.log('mapping', res)
    if (!model) {
        return res
    }
    if (Array.isArray(res)) {
        return res.map(item => map(item, model))
    }
    return map(res, model)
}
