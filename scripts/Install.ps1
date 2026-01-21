# Install.ps1
# Wrapper script to run 'pnpm install' from the project root

param(
    [Parameter(ValueFromRemainingArguments = $true)]
    $Args
)

$projectRoot = $PSScriptRoot | Split-Path -Parent
Push-Location $projectRoot

Write-Host "Running: pnpm install $Args"
pnpm install @Args

$exitCode = $LASTEXITCODE
Pop-Location
exit $exitCode
