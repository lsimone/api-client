import _mapValues from 'lodash/mapValues'
import objMap from 'object-mapper'

const isModel = dest => (typeof dest === 'object' && dest.model)

export default function map (obj, model) {
    return objMap(obj, wrapModels(model))
}

function wrapModels (model) {
    return _mapValues(model, dest => isModel(dest)
        ? {
            key: dest.key,
            transform: obj => {
                return objMap(obj, dest.model)
            }
        } : dest)
}
