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

Write-Host "Development server started in a new window."
Write-Host "The window will stay open to show any errors."
Pop-Location
