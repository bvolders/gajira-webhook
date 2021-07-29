# Jira webhook
Transition Jira issues


## Usage

> ##### Note: this action requires the modified [Jira Find Issues](https://github.com/intersentia/gajira-find-issue-key)


Example transition action:

```yaml
- name: Find in commit messages
  uses: intersentia/gajira-find-issue-key@master
  with:
    from: commits
}
- name: Transition issue
  id: transition
  uses: intersentia/gajira-webhook@master
  with:
    issues: ${{ steps.create.outputs.issues }}
    webhook: "https://automation.atlassian.com/pro/hooks/268c85ace7b9b03ba77a83..."
    eventData: "{{event.pull_request.requested_reviewers.map(r->r.login)}}"
}
```


### Inputs
- `issues` (required) - issue keys
- `webhook` (required) - webhook uri
- `eventData` - addition data you want to send along

### Outputs
- None

### Reads fields from config file at $HOME/jira/config.yml
- `issues`

### Writes fields to config file at $HOME/jira/config.yml
- None
