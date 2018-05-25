/**
 * Logs all actions and states after they are dispatched.
 */

//For IE<=10 support
console.group = console.group || console.log;
console.groupEnd = console.groupEnd || console.log;

const logger = store => next => action => {
    console.group(action.type || action.name)
    console.info('dispatching', action)
    let result = next(action)
    console.log('next state', store.getState())
    console.groupEnd(action.type || action.name)
    return result
}
export default logger;
