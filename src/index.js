
export function init (clientCfg, serverCfg) {
    // check if node environment
    if (typeof window === 'undefined') {
        const mockServer = require('./server')
        mockServer(serverCfg.swagger, serverCfg.port)
    }
}

