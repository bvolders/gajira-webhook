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

    const url = argv.webhook
    const method = 'POST'
    // eslint-disable-next-line no-unused-vars
    const issueIds = JSON.parse(argv.issues)
    const headers = {}
    const data = argv.eventData ? this.preprocessString(argv.eventData) : null

    headers['Content-Type'] = 'application/json'

    const body = {
      issues: issueIds,
      // data: JSON.stringify(data),
    }

    const state = {
      req: {
        method,
        headers,
        body,
        url,
      },
    }

    try {
      console.log(`extracted ${JSON.stringify(data)}`)
      console.log(`calling ${url} with ${JSON.stringify(state)}`)
      await client(state, 'webhook')
    } catch (error) {
      return new Error('Jira API error')
    }

    return state.res.body
  }

  preprocessString (str) {
    _.templateSettings.interpolate = /{{([\s\S]+?) }}/g
    const tmpl = _.template(str)

    return tmpl({ event: this.githubEvent })
  }
}
