export default function status (req, res) {
    // returns res or a promise that resolves with res
    return isError(res)
        ? res.json().then(data => Object.assign(res, {data})) : Object.assign(res, {errorCode: res.status})
}

function isError (res) {
    return (res.status >= 200 && res.status < 300)
}