#
# See functional requirements: scripts/documentation/Lint_requirements.md
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
Write-Host "Running linter..."
npx eslint .
$LintExitCode = $LASTEXITCODE

if ($LintExitCode -eq 0) {
    Write-Host "Lint passed."
    exit 0
} else {
    Write-Host "Lint failed. Attempting to fix..."
    npx eslint . --fix
    Write-Host "Re-running linter after fix..."
    npx eslint .
    $RetestExitCode = $LASTEXITCODE
    if ($RetestExitCode -eq 0) {
        Write-Host "Lint passed after fix."
        exit 0
    } else {
        Write-Host "Lint still failing after fix."
        exit $RetestExitCode
    }
}
