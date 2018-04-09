/**
 * returns caller function using Error.stack API
 *
 * @param {number} [stackJump] jumps back to the <stackJump + 1>NTH function above the current function.
 * i.e: if you call getCaller(1) from function `fn()`, it will return the name of the function that is 2 positions
 * above `fn()` in the call stack. `getCaller()` without arguments will return the name of the direct caller function.
 */
export function getCaller (stackJump = 0) {
    const caller = new Error().stack
        .split(/\r?\n/)[stackJump + 3]

    return caller && caller
        .replace(/\s*at\s*/, '')
}

export function mapValues (obj, mapFn) {
    return Object.keys(obj)
        .reduce((acc, key) => ({...acc, [key] : mapFn(obj[key])}), {})
}