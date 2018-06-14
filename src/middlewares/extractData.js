const enrichResponse = (req, res) => Object.assign(res, {
    req
})

export default function extractData (req, res) {
    const {options: {fullResponse}} = req
    // throw {status: res.errorCode, response: res}
    return res.ok
        ? Promise.resolve(fullResponse? enrichResponse(req, res) : res.data)
        : Promise.reject({status: res.errorCode, response: res})
}
