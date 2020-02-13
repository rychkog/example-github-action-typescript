import * as core from '@actions/core'
import * as github from '@actions/github'


const run = async (): Promise<void> => {
  try {
    if (github.context.payload.action !== 'opened') return

    const issue = github.context.payload.issue
    if (!issue) return

    const token = process.env['GITHUB_TOKEN']
    if (!token) return

    const octokit: any = new github.GitHub(token)
    const nwo = process.env['GITHUB_REPOSITORY'] || '/'
    const [owner, repo] = nwo.split('/')

    const issueCommentResponse = await octokit.issues.createComment({
      owner,
      repo,
      issue_number: issue.number,
      body: core.getInput('thanks-message')
    })

    console.log(`Replied with thanks message: ${issueCommentResponse.data.url}`)

    // Add a reaction
    // https://octokit.github.io/rest.js/#octokit-routes-reactions-create-for-issue
    const issueReactionResponse = await octokit.reactions.createForIssue({
      owner,
      repo,
      issue_number: issue.number,
      content: 'heart',
    })
    console.log(`Reacted: ${issueReactionResponse.data.content}`)
  } catch (error) {
    core.setFailed(`Thanks-action failure: ${error}`)
  }
}

run()

export default run