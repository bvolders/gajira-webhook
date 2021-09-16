const fetch = require('node-fetch')
const moment = require('moment')

module.exports = serviceName => async (state, apiMethod = 'unknown') => {
  const startTime = moment.now()

  console.log(`trying to call ${state.req.url} starting ${startTime}`)

  const response = await fetch(state.req.url, state.req)

  state.res = {
    headers: response.headers.raw(),
    status: response.status,
  }

  console.log(`intermediate state ${state.res}`)

  const totalTime = moment.now() - startTime

  console.log(`got ${JSON.stringify(response)} \n in ${totalTime}ms`)

  state.res.body = await response.text()

  console.log(`original ${JSON.stringify(response)}`)
  console.log(`got text ${state.res.body}`)

  const isJSON = (response.headers.get('content-type') || '').includes('application/json')

  if (isJSON && state.res.body) {
    console.log(`json ${state.res.body}`)
    state.res.body = JSON.parse(state.res.body)
  } else if (state.res.body == null || state.res.body.length() === 0) {
    state.res.body = 'nothing'
  }

  if (!response.ok) {
    console.log(`error during http call ${response.statusText} ${response.body}`)

    throw new Error(response.statusText)
  }

  return state
}
