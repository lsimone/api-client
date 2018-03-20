export default function fallback ({options: {fallback}}, res) {
    return (fallback !== undefined && res.data === undefined)
        ? {...res, data: fallback} : res
}
