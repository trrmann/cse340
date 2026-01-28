# Test.ps1
# Wrapper script to run 'pnpm test' from the project root

param(
    [Parameter(ValueFromRemainingArguments = $true)]
    $Args
)

$projectRoot = $PSScriptRoot | Split-Path -Parent
Push-Location $projectRoot

Write-Host "Running: pnpm test $Args"
pnpm test @Args

$exitCode = $LASTEXITCODE
Pop-Location
exit $exitCode
