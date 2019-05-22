const middy = require('middy')
const logTimeout = require('./middlewares/log_timeout_middleware')
const Promise = require('bluebird')

const handler = async (event) => {
  const waitTime = Math.random() * 2000

  await Promise.delay(waitTime)

  return {
    statusCode: 200,
    body: JSON.stringify({
      waitTime
    }, null, 2),
  }
}

module.exports.hello = middy(handler).use(logTimeout())