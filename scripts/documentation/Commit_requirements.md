# Commit.ps1 Functional Requirements

**Reminder:** If any new permanent functionality is added to Commit.ps1, update this requirements file to reflect the changes.

- Checks if there are any changes to commit before performing any other actions.
- If there are no changes to commit, exits gracefully with code 0 and does not stage, commit, or push anything.
- If there are changes, prompts the user for a commit message before staging any changes.
- If the commit message is empty or cancelled, exits gracefully with code 0 and does not stage, commit, or push anything.
- If a commit message is provided, stages all changes in the repository (git add -A).
- Commits staged changes with the provided commit message.
- If the commit fails, exits immediately with the error from the commit and does not proceed to push.
- If the commit succeeds, pushes committed changes to the current git remote and branch.
- On successful push, opens the Render deploy page, the deployed site, and the GitHub page for the repository in the default browser.
- Outputs success or error messages based on the result of both commit and push.
- Exits with the same code as the git push process.
