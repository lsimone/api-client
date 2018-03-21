export default function mock ({options: {mock: mockedRes}}, error) {
    console.error('mock error', error)
    if (mockedRes && mockedRes !== true) {
        console.warn('*** mocked response', mockedRes)
        return Object.assign(error, {data: mockedRes})
    } else return error
}
