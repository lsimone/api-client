export default function fallback ({options: {fallback}}, res) {
    return (fallback !== undefined && res.data === undefined)
        ? Object.assign(res, {data: fallback}) : res
}
