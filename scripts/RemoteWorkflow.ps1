#
# See functional requirements: scripts/documentation/RemoteWorkflow_requirements.md
<#
.SYNOPSIS
    Complete remote deployment workflow with production testing.

.DESCRIPTION
    Executes the full deployment workflow:
    1. Validates production environment configuration
    2. Installs npm dependencies
    3. Runs ESLint to check for code errors
    4. Runs Prettier to format code
    5. Builds production files to /dist
    6. Checks port 3000 availability for proxy server
    7. Starts production proxy server for testing
    8. Opens browser when server is confirmed running
    9. Prompts for testing confirmation
    10. Commits changes to git
    11. Pushes to GitHub (triggers Render deployment)

    The workflow includes automatic validation and will:
    - Verify .env.production exists with required variables
    - Detect port conflicts and offer to kill blocking processes
    - Wait for server startup before opening browser
    - Allow manual testing before commit
    - Exit if any step fails or user cancels

.EXAMPLE
    .\Run.ps1 RemoteWorkflow.ps1
    Runs the complete deployment workflow.

.NOTES
    Exit Code 0: Success - deployed to GitHub/Render
    Exit Code 1: Failure - validation, build, or deployment failed
    
    Test server runs at http://localhost:3000/
    After push, Render auto-deploys from GitHub.
    
    Author: Sleep Outside Team 04
    Version: 2.0
#>

# Pre-validation: Check production environment configuration
Write-Host "Validating production environment configuration..." -ForegroundColor Cyan
$validateScript = Join-Path $PSScriptRoot "ValidateEnvironment.ps1"
& $validateScript -Environment "production"
if ($LASTEXITCODE -ne 0) {
    Write-Error "Production environment validation failed. Please fix the issues and try again."
    exit 1
}

$steps = @(
    @{ Name = "Install"; Script = "Install.ps1" },
    @{ Name = "Lint"; Script = "Lint.ps1" },
    @{ Name = "Format"; Script = "Format.ps1" },
    @{ Name = "Build"; Script = "Build.ps1" }
)

foreach ($step in $steps) {
    Write-Host "Running $($step.Name) (live output)..."
    $scriptPath = Join-Path $PSScriptRoot $step.Script
    if ($step.Name -eq "Lint") {
        Write-Host "Running Lint: "
        & $scriptPath
        $fixExit = $LASTEXITCODE
        # If initial lint found problems, try auto-fix, then re-run to show remaining problems
        if ($fixExit -ne 0) {
            Write-Host "Running Lint: attempting auto-fix with '--fix'..."
            & npm run lint -- --fix
            $fixExit = $LASTEXITCODE
            if ($fixExit -ne 0) {
                Write-Host "Auto-fix did not resolve all issues. Running lint to show remaining problems..." -ForegroundColor Yellow
                & $scriptPath
                $lintExit = $LASTEXITCODE
                if ($lintExit -eq 0) {
                    Write-Host "[WARN] Lint reported warnings only after auto-fix; continuing." -ForegroundColor Yellow
                } else {
                    Write-Host "[FAIL] Lint errors remain after attempting --fix." -ForegroundColor Red
                    Write-Host "Please run 'npm run lint -- --fix' or fix issues manually. Exiting workflow to avoid deploying broken code." -ForegroundColor Yellow
                    exit 1
                }
            } else {
                # Check for unstaged changes resulting from --fix (if any) and commit them
                $projectRoot = $PSScriptRoot | Split-Path -Parent
                Push-Location $projectRoot
                $status = git status --porcelain
                if ($status) {
                    Write-Host "ESLint --fix modified files; committing fixes before proceeding..." -ForegroundColor Cyan
                    git add -A
                    git commit -m "chore: apply eslint --fix" --no-verify
                }
                Pop-Location
                Write-Host "[PASS] Lint passed after auto-fix." -ForegroundColor Green
            }
        }
    } else {
        & $scriptPath
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Step '$($step.Name)' failed. Exiting workflow."
            exit $LASTEXITCODE
        }
    }
}


# Enforce port check for both proxy (3000) and app (5500)
Write-Host "`nChecking port availability for production proxy server (3000) and app server (5500)..." -ForegroundColor Cyan
$validatePortScript = Join-Path $PSScriptRoot "ValidatePort.ps1"
$portsToCheck = @()
$portsToCheck += @{ Port = 3000; ServiceName = "Production Proxy Server" }
$appPort = $env:PORT
if (-not $appPort) { $appPort = 5500 }
$portsToCheck += @{ Port = $appPort; ServiceName = "App Server" }
foreach ($portCheck in $portsToCheck) {
    if (Test-Path $validatePortScript) {
        & $validatePortScript -Port $portCheck.Port -ServiceName $portCheck.ServiceName
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Port $($portCheck.Port) validation failed for $($portCheck.ServiceName). Cannot start production workflow."
            exit 1
        }
    }
}

# Test production proxy server
Write-Host "`nTesting production proxy server..."
Write-Host "Starting proxy server in a new PowerShell window..."
$projectRoot = $PSScriptRoot | Split-Path -Parent
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "cd '$projectRoot'; npm run serve" -WindowStyle Normal

# Wait for server to start and verify it's running
Write-Host "Waiting for proxy server to start..."
$maxAttempts = 30
$attempt = 0
$serverRunning = $false
$testUrl = "http://localhost:3000"

while ($attempt -lt $maxAttempts) {
    Start-Sleep -Seconds 1
    $attempt++
    
    try {
        $connection = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
        if ($connection) {
            # Port is listening, give it another second to fully initialize
            Start-Sleep -Seconds 1
            $serverRunning = $true
            break
        }
    } catch {
        # Continue waiting
    }
    
    Write-Host "  Attempt $attempt/$maxAttempts..." -NoNewline
    Write-Host "`r" -NoNewline
}

if ($serverRunning) {
    Write-Host "`n[PASS] Production proxy server is running on port 3000" -ForegroundColor Green
    Write-Host "Opening browser to $testUrl for testing..."
    Start-Process $testUrl
} else {
    Write-Host "`n[FAIL] Production proxy server failed to start within 30 seconds" -ForegroundColor Red
    Write-Host "Please check the server window for error messages."
    Write-Error "Server startup failed. Exiting workflow."
    exit 1
}

Write-Host "`nTest the application, then close the server window when done."
$continue = Read-Host "Press Enter when ready to commit and push (or type 'exit' to cancel)"
if ($continue -eq "exit") {
    Write-Host "Workflow cancelled."
    exit 0
}

# Check if there are any changes to commit
Write-Host "`nChecking for changes to commit..."
git add -A
$status = git status --porcelain
if (-not $status) {
    Write-Host "[INFO] No changes to commit. Workflow completed successfully." -ForegroundColor Yellow
    Write-Host "Exiting in 5 seconds..."
    Start-Sleep -Seconds 5
    exit 0
}

Write-Host "Remote workflow completed successfully."


# Commit and push step (handled by Commit.ps1)
$commitScript = Join-Path $PSScriptRoot "Commit.ps1"
& $commitScript
if ($LASTEXITCODE -ne 0) {
    Write-Error "Commit/push step failed. Exiting workflow."
    exit $LASTEXITCODE
}
Write-Host "All changes committed and pushed successfully. Render will auto-deploy with proxy server."
