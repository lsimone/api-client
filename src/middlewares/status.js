export default function status (req, res) {
    // returns res or a promise that resolves with res
    return isError(res)
        ? Object.assign(res, {errorCode: res.status}) : res.json().then(data => Object.assign(res, {data}))
}

function isError (res) {
    return res instanceof Error || !(res.status >= 200 && res.status < 300)
}