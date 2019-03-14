export default function status (req, res) {
    // returns res or a promise that resolves with res
    const {options: {blob}} = req
    return res.ok
        ? (res.status === 204 ? res : extractJson(res, req.debug, blob)) 
        : Object.assign(res, {errorCode: res.status})
}

function extractJson (res, debug, blob) {
    return res[blob? 'blob' : 'json']().then(data => Object.assign(res, {data}))
        .catch(e => {
            debug && console.error('extractJson() api-client error', e)
            return res
        })
}
