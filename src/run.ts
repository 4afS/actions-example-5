import * as core from '@actions/core'
import * as github from '@actions/github'
import { PullRequestEvent } from '@octokit/webhooks-types'

export async function run(): Promise<void> {
  try {
    const pr = github.context.payload.pull_request as PullRequestEvent

    if (!pr) {
      core.setFailed('github.context.payload.pull_request no exist')
      return
    }

    const token = core.getInput('repo-token')
    const message = core.getInput('message')
    core.debug(`message: ${message}`)

    const client = github.getOctokit(token)

    const owner = github.context.repo.owner
    const repo = github.context.repo.repo

    const response = await client.issues.createComment({
      owner,
      repo,
      issue_number: pr.number,
      body: message
    })
    core.debug(`created comment URL: ${response.data.html_url}`)

    core.setOutput('comment-url', response.data.html_url)
  } catch (error) {
    core.setFailed(error.message)
  }
}
