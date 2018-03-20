export default function mock ({options: {mock: mockedRes}}, res) {
    if (mockedRes) {
        console.warn('*** mocked response', mockedRes)
        return {
            ...res,
            data: mockedRes
        }
    } else return res
}
