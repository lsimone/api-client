export function init (clientCfg, serverCfg) {
    console.error('SERVER INIT')

    const express = require('express')
    const path = require('path')
    const mockApi = require('swagger-mock-api')

    const app = express()

    app.use(mockApi({
        swaggerFile: path.join(__dirname, serverCfg.swagger),
        watch: true // enable reloading the routes and schemas when the swagger file changes
    }))

    app.listen(serverCfg.port, () => console.log(`Mock server listening on port ${serverCfg.port}!`))

}
