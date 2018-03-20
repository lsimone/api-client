import express from 'express'
import path from 'path'
import mockApi from 'swagger-mock-api'
import { init as clientInit } from './client'

export { call } from './client'

export function init (defaultHost, getDefaultHeaders, options = {}) {

    if (options.swagger) {
        console.log('MOCK SERVER INIT')
        const port = options.mockServerPort || 3000

        const app = express()

        app.use(mockApi({
            swaggerFile: path.join(__dirname, options.swagger),
            watch: true // enable reloading the routes and schemas when the swagger file changes
        }))

        app.listen(port, () => console.log(`Mock server listening on port ${port}!`))
    }

    return clientInit(defaultHost, getDefaultHeaders)
}
