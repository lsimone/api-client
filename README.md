# WIP - isomorphic API client

This API client supports node and browser environments.
It uses [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch) under the hood,
and provides a flexible interface, yet simple.

## features

* middleware based: it comes already with basic middlewares, but it is
possible to add custom ones.
* mapping: through [object-mapper](https://github.com/wankdanker/node-object-mapper)
offers automatic mapping of API responses to given models.
* fallback values: for each call it is possible to set a fallback return
value (in case of 404 or any other error).
* mock values: for each call it is possible to set a mock value (that overrides
the server response).
* mock server: if `swagger` option is specified, the given spec file will
be read and used to run a mock server thanks to [swagger-mock-api](https://github.com/dzdrazil/swagger-mock-api),
based on [chanchejs](http://chancejs.com/).
* logging and debug mode

## Usage


```
import {init, call} from 'iso-client'

// init with global params
init('http://your.api.basepath.com', () => {'Content-Type': 'application/json'})

// then perform the simplest HTTP request (GET http://your.api.basepath.com/events )
call('events')

// or more complex ones
call('events/:idEvent', {
    params: {
        idEvents: 432,
        sortBy: '-relevance'
    },
    fallback: {name: 'fake event'},
    mock: true,
// see object-mapper options for further detail
    model: {
       'about': 'about',
       'city.name': 'cityName'
   }
})


```

## API

* `src/client.js` exposes 2 methods: `init()`, used to set global parameters,
and `call()`, used to perform HTTP calls
* `src/server.js` is a `client.js` wrapper that

## middlewares

It is possible to add custom middlewares by specifying them through the `init()`
method.

A middleware should be a function with the following signature:
```
function middleware (req: Request, res: response) : (Promise<Response>|Response)
```

It can:

* return a promise
* return a value/object
* throw an error (only in this case, all other middleware are skipped and
the API call will result in an error)

The order they are added in the promise chain **matters**.

## models

TBD

```
import { city } from './city'

export const venueRes = {
    'about': 'about',
    'city': {
        key: 'city',
        model: city
    }
}

