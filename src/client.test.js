/**
 * TODO: test errors, more on merge options and other notable use cases
 */

import {init, call, getClient} from './client'

global.fetch = require('jest-fetch-mock')

const DEFAULT_FOO = '12345'
const DEFAULT_HOST = 'http://test.com'
const TEST_URL = 'users'
const DEFAULT_HEADERS = {
    'Accept': '*/*',
    'Content-Type': 'application/json'
}
const GET_DEFAULT_HEADERS = () => DEFAULT_HEADERS

beforeEach(() => {
    fetch.resetMocks()
    init(DEFAULT_HOST, GET_DEFAULT_HEADERS)
})

test('simple GET build correctly URL and returns JSON data', () => {
    fetch.mockResponseOnce(JSON.stringify({ foo: DEFAULT_FOO }))

    call(TEST_URL, {fullResponse: true})
        .then(res => {
            expect(res.req.url).toBe(`${DEFAULT_HOST}/${TEST_URL}`)
            expect(res.data.foo).toBe(DEFAULT_FOO)
            expect(fetch.mock.calls.length).toEqual(1)
            expect(fetch.mock.calls[0][0]).toBe(`${DEFAULT_HOST}/${TEST_URL}`)
        })
})

test('headers are correctly merged', () => {
    fetch.mockResponseOnce(JSON.stringify({ foo: DEFAULT_FOO }))

    call(TEST_URL, {fullResponse: true, headers: {'X-Custom-header': '44'}})
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
    call(TEST_URL, {fullResponse: true, headers: {'X-Custom-header': '44'}, mergeHeaders: false})
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
    call(TEST_URL, {fullResponse: true, headers: {'X-Custom-header': '44'}})
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

    call1(TEST_URL, {fullResponse: true})
        .then(res => {
            const {req: {url, fetchOpt: {headers}}} = res
            expect(url).toBe(`${DEFAULT_HOST}/${TEST_URL}`)
            expect(headers['Content-Type']).toBe(DEFAULT_HEADERS['Content-Type'])
            expect(res.data.foo).toBe(DEFAULT_FOO)
            expect(fetch.mock.calls.length).toEqual(1)
            expect(fetch.mock.calls[0][0]).toBe(`${DEFAULT_HOST}/${TEST_URL}`)

            call2('customers', {fullResponse: true})
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

