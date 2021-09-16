const core = require('@actions/core')
const Action = require('./action')

// eslint-disable-next-line import/no-dynamic-require
const githubEvent = require(process.env.GITHUB_EVENT_PATH)

async function exec () {
  try {
    const result = await new Action({
      githubEvent,
      argv: parseArgs(),
    }).execute()

    if (result) {
      console.log('successfully called webhook.')
      console.log(JSON.stringify(result))

      return
    }

    console.log('Failed webhook.')
    process.exit(78)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

function parseArgs () {
  const webhook = core.getInput('webhook')

  if (!webhook) {
    throw new Error('Error: please specify a webhook')
  }

  return {
    webhook,
    issues: core.getInput('issues'),
    eventData: core.getInput('eventData'),
  }
}

exec()
