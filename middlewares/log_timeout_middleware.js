const Promise = require('bluebird')

module.exports = () => {
  let isTimedOut = undefined
  
  return {
    before: (handler, next) => {
      const timeLeft = handler.context.getRemainingTimeInMillis()
      isTimedOut = undefined

      Promise.delay(timeLeft - 10).then(() => {
        if (isTimedOut !== false) {
          console.log('function timed out')
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