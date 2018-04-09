export default function extractData ({options: {fullResponse}}, res) {
    return fullResponse
        ? res : (res.data !== undefined)
            ? Promise.resolve(res.data) : Promise.reject({status: res.errorCode})
}
