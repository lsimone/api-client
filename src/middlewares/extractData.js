export default function extractData ({options: {fullResponse}}, res) {
    return fullResponse
        ? res : res.ok
            ? Promise.resolve(res.data) : Promise.reject({status: res.errorCode, response: res})
}
