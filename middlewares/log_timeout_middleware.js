const Promise = require('bluebird')
const Log = require('@perform/lambda-powertools-logger')

module.exports = () => {
  let isTimedOut = undefined
  
  return {
    before: (handler, next) => {
      const timeLeft = handler.context.getRemainingTimeInMillis()
      handler.context.callbackWaitsForEmptyEventLoop = false
      isTimedOut = undefined

      Promise.delay(timeLeft - 10).then(() => {
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
      next()
    },
    onError: (handler, next) => {
      isTimedOut = false
      next(handler.error)
    }
  }
}