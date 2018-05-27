const enrichResponse = (req, res) => Object.assign(res, {
    req
})

export default function extractData (req, res) {
    const {options: {fullResponse}} = req
    return fullResponse
        ? enrichResponse(req, res) : res.ok
            ? Promise.resolve(res.data) : Promise.reject({status: res.errorCode, response: res})
}
