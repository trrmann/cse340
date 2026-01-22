# Build.ps1
# Wrapper script to run 'pnpm run build' from the project root
# For Node.js/Express projects without a build step, this validates the project setup

param(
    [Parameter(ValueFromRemainingArguments = $true)]
    $Args
)

$projectRoot = $PSScriptRoot | Split-Path -Parent
Push-Location $projectRoot

# Check if package.json has a build script
$packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
if ($packageJson.scripts.PSObject.Properties.Name -contains "build") {
    Write-Host "Running: pnpm run build $Args"
    pnpm run build @Args
    $exitCode = $LASTEXITCODE
} else {
    Write-Host "No build script found in package.json."
    Write-Host "This is a Node.js/Express server project - no build step required."
    Write-Host "Build step: SKIPPED (not needed for this project type)"
    $exitCode = 0
}

Pop-Location
exit $exitCode
