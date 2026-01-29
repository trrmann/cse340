#
# See functional requirements: scripts/documentation/Commit_requirements.md

# Commit.ps1
# Prompts for a commit message if there are changes, commits, then pushes and opens URLs on success

Write-Host "Checking for changes to commit..."
git add -A
$status = git status --porcelain
if (-not $status) {
    Write-Host "No changes to commit. Exiting gracefully."
    exit 0
}

# Prompt for commit message
$Message = Read-Host "Enter a commit message (leave blank to cancel)"
if (-not $Message) {
    Write-Host "No commit message provided. Exiting gracefully."
    exit 0
}

Write-Host "Committing changes with message: $Message"
git commit -m "$Message"
$commitExit = $LASTEXITCODE
if ($commitExit -ne 0) {
    Write-Error "Commit failed. Exiting without pushing."
    exit $commitExit
}
Write-Host "Commit successful. Pushing to remote..."
git push
$pushExit = $LASTEXITCODE
if ($pushExit -eq 0) {
    Write-Host "Push successful."
    # Open Render deploy page, deployed site, and GitHub repo in default browser
    $renderDeployUrl = "https://dashboard.render.com/web/srv-d5du7015pdvs73diamug/deploys/dep-d5pf6gbuibrs73cv7fgg"
    $renderSiteUrl = "https://cse340tm.onrender.com/"
    $githubRepoUrl = "https://github.com/trrmann/cse340"
    Start-Process $renderDeployUrl
    Start-Process $renderSiteUrl
    Start-Process $githubRepoUrl
} else {
    Write-Error "Push failed."
}
exit $pushExit
