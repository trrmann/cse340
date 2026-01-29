#
# See functional requirements: scripts/documentation/StartDev_requirements.md
# Start.ps1
# Wrapper script to run 'pnpm run dev' from the project root

param(
    [Parameter(ValueFromRemainingArguments = $true)]
    $Args
)

$projectRoot = $PSScriptRoot | Split-Path -Parent
Push-Location $projectRoot

Write-Host "Starting development server..."


Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot'; pnpm run dev" -WindowStyle Normal

# Open localhost URL to the correct dev port in the default browser
$port = $env:PORT
if (-not $port) { $port = 5500 }
$devUrl = "http://localhost:$port/"
Start-Process $devUrl

Write-Host "Development server started in a new window."
Write-Host "The window will stay open to show any errors."
Pop-Location
