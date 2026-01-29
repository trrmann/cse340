<#
See functional requirements: scripts/documentation/DevWorkflow_requirements.md
#>
<#
Load environment variables from .env file if present
#>
## Resolve .env located at repository root (parent of scripts folder)
$envFile = Join-Path -Path (Split-Path -Path $PSScriptRoot -Parent) -ChildPath '.env'
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^(\w+)=(.*)$') {
            $name = $matches[1]
            $value = $matches[2]
            $value = $value.Trim('"', "'")
            Set-Item -Path "Env:\$name" -Value $value
        }
    }
}
$projectRoot = Split-Path -Path $PSScriptRoot -Parent

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

# DevWorkflow.ps1
# Runs all dev development steps in order: install, lint, format, database connectivity test, automated tests, and dev server start.
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

# Pre-validation: Check environment configuration
Write-Host "Validating environment configuration..." -ForegroundColor Cyan
$validateScript = Join-Path $PSScriptRoot "ValidateEnvironment.ps1"
if (Test-Path $validateScript) {
    & $validateScript -Environment "development"
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Environment validation failed. Please fix the issues and try again."
        exit 1
    }
}


# Enforce port check for both app (5500) and proxy (3000)
Write-Host "Checking port availability for development server (5500) and proxy server (3000)..." -ForegroundColor Cyan
$validatePortScript = Join-Path $PSScriptRoot "ValidatePort.ps1"
$portsToCheck = @()
$appPort = $env:PORT
if (-not $appPort) { $appPort = 5500 }
$portsToCheck += @{ Port = $appPort; ServiceName = "Node Development Server" }
$portsToCheck += @{ Port = 3000; ServiceName = "Proxy Server" }
foreach ($portCheck in $portsToCheck) {
    if (Test-Path $validatePortScript) {
        & $validatePortScript -Port $portCheck.Port -ServiceName $portCheck.ServiceName
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Port $($portCheck.Port) validation failed for $($portCheck.ServiceName). Cannot start development workflow."
            exit 1
        }
    }
}

# Add database connectivity test before starting the server
$steps = @(
    @{ Name = "Install"; Script = "Install.ps1"; SkipVar = "SKIP_INSTALL" },
    @{ Name = "Lint"; Script = "Lint.ps1"; SkipVar = "SKIP_LINT" },
    @{ Name = "Format"; Script = "Format.ps1"; SkipVar = "SKIP_FORMAT" },
    @{ Name = "TestDbConnection"; Script = "TestDbConnection.ps1"; SkipVar = "SKIP_DBTEST" },
    @{ Name = "Test"; Script = "Test.ps1"; SkipVar = "SKIP_TEST" },
    @{ Name = "Start"; Script = "RunAndLog.ps1"; SkipVar = "SKIP_START" }
)

foreach ($step in $steps) {
    $skipItem = Get-Item "Env:\$($step.SkipVar)" -ErrorAction SilentlyContinue
    if ($skipItem -and $skipItem.Value -ne "") {
        Write-Host "Skipping $($step.Name) step due to environment variable $($step.SkipVar)."
        continue
    }
    Write-Host "Running $($step.Name)..."
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
    } elseif ($step.Name -eq "Start") {
        Write-Host "All checks passed. Starting development server with output to screen and log..."
        $startScript = Join-Path $PSScriptRoot $step.Script
        & $startScript StartDev.ps1
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Development server failed to start. See log for details."
            exit $LASTEXITCODE
        }
        Write-Host "Development server exited. See log for details."
    } elseif ($step.Name -eq "TestDbConnection") {
        Write-Host "Validating database connectivity before starting server..."
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
        Write-Host "Running $($step.Name) (live output)..."
        & $scriptPath
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Step '$($step.Name)' failed. Exiting workflow."
            exit $LASTEXITCODE
        }
    }
}

Write-Host "Local workflow completed successfully."


