$projectRoot = $PSScriptRoot | Split-Path -Parent

# Dependency management: clean and reinstall if install fails, check for outdated
function Clean-Dependencies {
    Write-Host "Cleaning node_modules and lockfile..."
    Remove-Item -Recurse -Force "$projectRoot\node_modules" -ErrorAction SilentlyContinue
    Remove-Item "$projectRoot\pnpm-lock.yaml" -ErrorAction SilentlyContinue
}

function Check-Outdated {
    Write-Host "Checking for outdated dependencies..."
    Push-Location $projectRoot
    pnpm outdated
    Pop-Location
}

# RemoteWorkflow.ps1
# Runs all remote deployment steps: install, lint, format, database connectivity test, automated tests, build, preview, commit, and push.
# Each step can be skipped by setting the corresponding environment variable (e.g., SKIP_LINT=1).
# Fails fast if any step fails. Validates required environment variables before running.
# Validates required environment variables before running workflow steps
$requiredEnvVars = @('DATABASE_URL', 'SESSION_SECRET', 'PORT')
$missingVars = $requiredEnvVars | Where-Object {
    $item = Get-Item "Env:\$_" -ErrorAction SilentlyContinue
    -not ($item -and $item.Value -ne "")
}
if ($missingVars.Count -gt 0) {
    Write-Error "Missing required environment variables: $($missingVars -join ', ')"
    exit 1
}
# Runs Install, Lint, Format, Build, Preview, Commit, and Push scripts in order for remote deployment

$steps = @(
    @{ Name = "Install"; Script = "Install.ps1"; SkipVar = "SKIP_INSTALL" },
    @{ Name = "Lint"; Script = "Lint.ps1"; SkipVar = "SKIP_LINT" },
    @{ Name = "Format"; Script = "Format.ps1"; SkipVar = "SKIP_FORMAT" },
    @{ Name = "TestDbConnection"; Script = "TestDbConnection.ps1"; SkipVar = "SKIP_DBTEST" },
    @{ Name = "Test"; Script = "Test.ps1"; SkipVar = "SKIP_TEST" },
    @{ Name = "Build"; Script = "Build.ps1"; SkipVar = "SKIP_BUILD" },
    @{ Name = "Preview"; Script = "Preview.ps1"; SkipVar = "SKIP_PREVIEW" }
)

foreach ($step in $steps) {
    $skipItem = Get-Item "Env:\$($step.SkipVar)" -ErrorAction SilentlyContinue
    if ($skipItem -and $skipItem.Value -ne "") {
        Write-Host "Skipping $($step.Name) step due to environment variable $($step.SkipVar)."
        continue
    }
    Write-Host "Running $($step.Name) (live output)..."
    $scriptPath = Join-Path $PSScriptRoot $step.Script
    if ($step.Name -eq "Install") {
        & $scriptPath
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Install failed. Attempting clean and reinstall..."
            Clean-Dependencies
            & $scriptPath
            if ($LASTEXITCODE -ne 0) {
                Write-Error "Install failed after cleaning dependencies. Exiting workflow."
                exit $LASTEXITCODE
            }
        }
        Check-Outdated
    } elseif ($step.Name -eq "TestDbConnection") {
        Write-Host "Validating database connectivity before continuing..."
        & $scriptPath
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Database connectivity test failed. Please check your network, firewall, and database credentials. Exiting workflow."
            exit $LASTEXITCODE
        } else {
            Write-Host "Database connectivity test passed."
        }
    } elseif ($step.Name -eq "Test") {
        Write-Host "Running automated tests..."
        & $scriptPath
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Automated tests failed. Exiting workflow."
            exit $LASTEXITCODE
        } else {
            Write-Host "Automated tests passed."
        }
    } else {
        & $scriptPath
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Step '$($step.Name)' failed. Exiting workflow."
            exit $LASTEXITCODE
        }
        if ($step.Name -eq "Preview") {
            Write-Host "All checks passed. Preview completed. You may close the preview window."
        }
    }
}

# Commit step
$commitScript = Join-Path $PSScriptRoot "Commit.ps1"
$commitMsg = Read-Host "Enter commit message (leave blank to exit)"
if ([string]::IsNullOrWhiteSpace($commitMsg)) {
    Write-Host "No commit message provided. Exiting workflow."
    exit 0
}
& $commitScript -Message $commitMsg
if ($LASTEXITCODE -ne 0) {
    Write-Error "Commit step failed. Exiting workflow."
    exit $LASTEXITCODE
}

# Push step
$pushScript = Join-Path $PSScriptRoot "Push.ps1"
& $pushScript
if ($LASTEXITCODE -ne 0) {
    Write-Error "Push step failed. Exiting workflow."
    exit $LASTEXITCODE
}

Write-Host "Remote workflow completed successfully."
