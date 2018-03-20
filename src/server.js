
module.exports = (swagger, port) => {
    const express = require('express')
    const path = require('path');
    const mockApi = require('swagger-mock-api');

    const app = express()

    app.use(mockApi({
        swaggerFile: path.join(__dirname, swagger),
        watch: true // enable reloading the routes and schemas when the swagger file changes
    }))

    app.listen(port, () => console.log(`Mock server listening on port ${port}!`))
}

