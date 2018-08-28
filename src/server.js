import path from 'path'
import express from 'express'
import cors from 'cors'
import mockApi from 'swagger-mock-api'
import { init as clientInit } from './client'

export { call, getClient } from './client'

export function init (defaultHost, getDefaultHeaders, options = {}) {
    let mockServerPort

    if (options.swagger) {
        console.log('MOCK SERVER INIT')
        mockServerPort = options.mockServerPort || 3000

        const app = express()

        // /node_modules/api-client/dist  =>  3 levels down to the project root
        const swaggerFile = path.join(__dirname, '../../../', options.swagger)

        app.use(cors(), mockApi({
            swaggerFile,
            watch: true // enable reloading the routes and schemas when the swagger file changes
        }))

        app.listen(mockServerPort, () => console.log(`Mock server listening on port ${mockServerPort}!`))
    }

    return clientInit(defaultHost, getDefaultHeaders, { ...options, mockServerPort })
}
