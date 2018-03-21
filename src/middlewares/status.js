export default function status (req, res) {
    // returns res or a promise that resolves with res
    return (res.status >= 200 && res.status < 300)
        ? res.json.then(data => ({...res, data})) : {...res, errorCode: res.status}
}
