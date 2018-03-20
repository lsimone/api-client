# API client middlewares

Middlewares can be added, deleted or modified.

They must be bound inside `client/index.js` to handle errors
(promise rejection, *error middleware*) or execute operations on responses
(promise resolve, *success middleware*).

* Each error middleware is executed **only if** the previous promise chain throws an error.
* Each success middleware is executed **only if** the previous promise chain resolves a value.

The order they are added in the promise chain **matters**.

They can:

* return a promise
* return a value/object
* throw an error (only in this case, the following error middlewares are triggered)

