# Lint.ps1
# Wrapper script to run 'pnpm run lint' from the project root

param(
    [Parameter(ValueFromRemainingArguments = $true)]
    $Args
)

$projectRoot = $PSScriptRoot | Split-Path -Parent
Push-Location $projectRoot

Write-Host "Running: pnpm run lint $Args"
pnpm run lint @Args

$exitCode = $LASTEXITCODE
Pop-Location
exit $exitCode
