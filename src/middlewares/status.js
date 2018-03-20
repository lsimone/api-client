export default function status (req, res) {
    return {
        ...res,
        ...((res.status >= 200 && res.status < 300)
            ? {data: res.json()} : {errorCode: res.status})
    }
}
