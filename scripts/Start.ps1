#
# See functional requirements: scripts/documentation/Start_requirements.md
# Start.ps1
# Wrapper script to run 'pnpm run start' from the project root


param(
    [Parameter(ValueFromRemainingArguments = $true)]
    $Args
)

$projectRoot = $PSScriptRoot | Split-Path -Parent
Push-Location $projectRoot

Write-Host "Starting development server..."


Start-Process "pnpm" -ArgumentList @("run", "start") -WindowStyle Normal

# Open localhost URL to the correct port in the default browser
$port = $env:PORT
if (-not $port) { $port = 5500 }
$url = "http://localhost:$port/"
Start-Process $url

Write-Host "Development server started in a new window."
Write-Host "Check dev-server.log for output and errors if the window closes unexpectedly."
Pop-Location
