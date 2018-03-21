export default function mock ({options: {mock: mockedRes}}, res) {
    // if mock===true, no change is needed: the request has been sent to mock server
    if (mockedRes && mockedRes !== true) {
        console.warn('*** mocked response', mockedRes)
        return Object.assign(res, {data: mockedRes})
    } else return res
}
