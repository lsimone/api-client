/**
 * TODO: test errors, more on merge options and other notable use cases
 */

import {init, call, getClient} from './client'

global.fetch = require('jest-fetch-mock')

const DEFAULT_FOO = '12345'
const DEFAULT_HOST = 'http://test.com'
const TEST_URL = 'users'
const MUSEMENT_HOST = 'https://www.musement.com/api/v3'
const CITIES_URL = 'cities.json'
const DEFAULT_HEADERS = {
    'Accept': '*/*',
    'Content-Type': 'application/json'
}
const GET_DEFAULT_HEADERS = () => DEFAULT_HEADERS

jest.setTimeout(30000);


const delayed = (body, TIMEOUT) => () => new Promise((resolve, reject) => {
    setTimeout(() => resolve({body: JSON.stringify(body)}), TIMEOUT)
  })

beforeEach(() => {
    fetch.resetMocks()
    init(DEFAULT_HOST, GET_DEFAULT_HEADERS)
})

test('simple GET build correctly URL and returns JSON data', () => {
    fetch.mockResponseOnce(JSON.stringify({ foo: DEFAULT_FOO }))

    return call(TEST_URL, {fullResponse: true})
        .then(res => {
            expect(res.req.url).toBe(`${DEFAULT_HOST}/${TEST_URL}`)
            expect(res.data.foo).toBe(DEFAULT_FOO)
            expect(fetch.mock.calls.length).toEqual(1)
            expect(fetch.mock.calls[0][0]).toBe(`${DEFAULT_HOST}/${TEST_URL}`)
        })
})

test('headers are correctly merged', () => {
    fetch.mockResponseOnce(JSON.stringify({ foo: DEFAULT_FOO }))

    return call(TEST_URL, {fullResponse: true, headers: {'X-Custom-header': '44'}})
        .then(res => {
            const {req: {fetchOpt: {headers}}} = res
            expect(headers['X-Custom-header']).toBe('44')
            Object.keys(DEFAULT_HEADERS).forEach(header =>
                expect(headers[header]).toBe(DEFAULT_HEADERS[header])
            )
            expect(fetch.mock.calls.length).toEqual(1)
            expect(fetch.mock.calls[0][0]).toBe(`${DEFAULT_HOST}/${TEST_URL}`)
        })
})

test('headers are correctly overridden for single call mergeHeader option', () => {
    fetch.mockResponseOnce(JSON.stringify({ foo: DEFAULT_FOO }))
    return call(TEST_URL, {fullResponse: true, headers: {'X-Custom-header': '44'}, mergeHeaders: false})
        .then(res => {
            const {req: {fetchOpt: {headers}}} = res
            expect(headers['X-Custom-header']).toBe('44')
            expect(Object.keys(headers).length).toBe(1)
            expect(fetch.mock.calls.length).toEqual(1)
            expect(fetch.mock.calls[0][0]).toBe(`${DEFAULT_HOST}/${TEST_URL}`)

        })
})

test('headers are correctly overridden for global mergeHeader option', () => {
    fetch.mockResponseOnce(JSON.stringify({ foo: DEFAULT_FOO }))
    init(DEFAULT_HOST, GET_DEFAULT_HEADERS, {mergeHeaders: false})
    return call(TEST_URL, {fullResponse: true, headers: {'X-Custom-header': '44'}})
        .then(res => {
            const {req: {fetchOpt: {headers}}} = res
            expect(headers['X-Custom-header']).toBe('44')
            expect(Object.keys(headers).length).toBe(1)
            expect(fetch.mock.calls.length).toEqual(1)
            expect(fetch.mock.calls[0][0]).toBe(`${DEFAULT_HOST}/${TEST_URL}`)
        })
})

test('get multiple client instances', () => {
    fetch.mockResponse(JSON.stringify({ foo: DEFAULT_FOO }))

    const SECOND_HOST = 'http://open.com'
    const SECOND_HEADERS = {'Language': 'it'}

    const call1 = getClient(DEFAULT_HOST, GET_DEFAULT_HEADERS)
    const call2 = getClient(SECOND_HOST, () => SECOND_HEADERS)

    return call1(TEST_URL, {fullResponse: true})
        .then(res => {
            const {req: {url, fetchOpt: {headers}}} = res
            expect(url).toBe(`${DEFAULT_HOST}/${TEST_URL}`)
            expect(headers['Content-Type']).toBe(DEFAULT_HEADERS['Content-Type'])
            expect(res.data.foo).toBe(DEFAULT_FOO)
            expect(fetch.mock.calls.length).toEqual(1)
            expect(fetch.mock.calls[0][0]).toBe(`${DEFAULT_HOST}/${TEST_URL}`)

            return call2('customers', {fullResponse: true})
                .then(res => {
                    const {req: {url, fetchOpt: {headers}}} = res
                    expect(url).toBe(`${SECOND_HOST}/customers`)
                    expect(headers['Language']).toBe(SECOND_HEADERS['Language'])
                    expect(res.data.foo).toBe(DEFAULT_FOO)
                    expect(fetch.mock.calls.length).toEqual(2)
                    expect(fetch.mock.calls[1][0]).toBe(`${SECOND_HOST}/customers`)
                })
        })

})

test('timeout occurs and timeout error is raised', async () => {
    init(MUSEMENT_HOST, GET_DEFAULT_HEADERS)
    fetch.mockResponseOnce(delayed({ foo: DEFAULT_FOO }, 5000))

    try {
        const res = await call(CITIES_URL, {timeout: 1000, fullResponse: true})
        expect(true).toBe(false);
    } catch (e) {
        expect(e.status).toBe(408)
        expect(e.response.statusText).toMatch(/^CLIENT TIMEOUT:/)

        expect(fetch.mock.calls.length).toEqual(1)
        expect(fetch.mock.calls[0][0]).toBe(`${MUSEMENT_HOST}/${CITIES_URL}`)
    }
})

// TODO: to be fixed
test('timeout does not occurs and no error is raised', async () => {
    init(MUSEMENT_HOST, GET_DEFAULT_HEADERS)
    fetch.mockResponseOnce(delayed({ foo: DEFAULT_FOO }, 1000))

    const res = await call(CITIES_URL, {timeout: 2000, fullResponse: true})
    expect(res.req.url).toBe(`${MUSEMENT_HOST}/${CITIES_URL}`)
    expect(res.data.foo).toBe(DEFAULT_FOO)
    expect(fetch.mock.calls.length).toEqual(1)
    expect(fetch.mock.calls[0][0]).toBe(`${MUSEMENT_HOST}/${CITIES_URL}`)
})


test('requests with option.blob will result in a Blob object', async () => {
    fetch.mockResponseOnce(delayed({ foo: DEFAULT_FOO }, 1000))

    init(MUSEMENT_HOST, GET_DEFAULT_HEADERS)
    const res = await call('test', {blob: true, body: { test: '12345=' }})

    expect(res.constructor.name).toBe('Blob')
})


// test('mocked responses resolve with the given value', async () => {
//     init(MUSEMENT_HOST, GET_DEFAULT_HEADERS)
//     // fetch.mockReject(new Error('fake error message'))
//     // fetch.mockResponseOnce(delayed({ foo: DEFAULT_FOO }, 1000))
//
//     const res = await call(CITIES_URL, {mock: {test: 97}})
//     console.log('eccc', res)
//     expect(res.test).toBe(97)
// })
