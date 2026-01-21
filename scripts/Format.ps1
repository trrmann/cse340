# Format.ps1
# Wrapper script to run 'pnpm run format' from the project root

param(
    [Parameter(ValueFromRemainingArguments = $true)]
    $Args
)

$projectRoot = $PSScriptRoot | Split-Path -Parent
Push-Location $projectRoot

Write-Host "Running: pnpm run format $Args"
pnpm run format @Args

$exitCode = $LASTEXITCODE
Pop-Location
exit $exitCode
