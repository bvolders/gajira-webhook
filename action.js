const _ = require('lodash')

const serviceName = 'webhook'
// eslint-disable-next-line no-unused-vars
const client = require('./common/net/client')(serviceName)

module.exports = class {
  constructor ({ githubEvent, argv }) {
    this.argv = argv
    this.githubEvent = githubEvent
  }

  async execute () {
    const { argv } = this

    const uri = argv.webhook
    const method = 'POST'
    // eslint-disable-next-line no-unused-vars
    const issueIds = argv.issues
    const headers = {}
    const data = argv.eventData ? this.preprocessString(argv.eventData) : null

    headers['Content-Type'] = 'application/json'

    const body = {
      issues: issueIds,
      data,
    }

    const state = {
      req: {
        method,
        headers,
        body,
        uri,
      },
    }

    try {
      console.log(`extracted ${data}`)
      console.log(`calling ${uri} with ${state}`)
      await client(state, `webhook:${uri}`)
    } catch (error) {
      return new Error('Jira API error')
    }

    return state.res.body
  }

  preprocessString (str) {
    _.templateSettings.interpolate = /{{([\s\S]+?)}}/g
    const tmpl = _.template(str)

    return tmpl({ event: this.githubEvent })
  }
}
