export default function status (req, res) {
    // returns res or a promise that resolves with res
    return res.ok
        ? extractJson(res, req.debug) : Object.assign(res, {errorCode: res.status})
}

function extractJson (res, debug) {
    return res.json().then(data => Object.assign(res, {data}))
        .catch(e => {
            debug && console.error('extractJson() api-client error', e)
            return res
        })
}
