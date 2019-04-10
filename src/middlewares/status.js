const PARSE_METHOD = {
  blob: 'blob',
  text: 'text',
  default: 'json'
}

export default function status (req, res) {
    // returns res or a promise that resolves with res
    const {options: {parse}} = req
    return res.ok
        ? (res.status === 204 ? res : extract(res, req.debug, parse))
        : Object.assign(res, {errorCode: res.status})
}

function extract (res, debug, parse) {
    return res[PARSE_METHOD[parse || 'default']]().then(data => Object.assign(res, {data}))
        .catch(e => {
            debug && console.error('extractJson() api-client error', e)
            return res
        })
}
