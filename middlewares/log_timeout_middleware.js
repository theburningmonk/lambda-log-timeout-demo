const Promise = require('bluebird')
const Log = require('@perform/lambda-powertools-logger')

module.exports = () => {
  let isTimedOut = undefined
  let promise = undefined

  const resetPromise = () => {
    if (promise) {
      promise.cancel()
      promise = undefined
    }
  }
  
  return {
    before: (handler, next) => {
      const timeLeft = handler.context.getRemainingTimeInMillis()
      handler.context.callbackWaitsForEmptyEventLoop = false
      isTimedOut = undefined

      promise = Promise.delay(timeLeft - 10).then(() => {
        if (isTimedOut !== false) {
          const awsRequestId = handler.context.awsRequestId
          const invocationEvent = JSON.stringify(handler.event)
          Log.error('invocation timed out', { awsRequestId, invocationEvent })
        }
      })
  
      next()
    },
    after: (handler, next) => {
      isTimedOut = false
      resetPromise()
      next()
    },
    onError: (handler, next) => {
      isTimedOut = false
      resetPromise()
      next(handler.error)
    }
  }
}