<#
See functional requirements: scripts/documentation/ValidatePort_requirements.md
#>
<#
.SYNOPSIS
    Validates port availability and resolves conflicts.

.DESCRIPTION
    Checks if a specified port is available. If the port is in use:
    1. Identifies the process using the port (name, PID, path)
    2. Shows popup asking user to kill the process
    3. Terminates the process if user approves
    4. Verifies the port was successfully freed
    5. Exits gracefully if port cannot be freed
    
    Handles all edge cases:
    - Process cannot be identified
    - User declines to kill process
    - Kill operation fails
    - New process takes over port immediately

.PARAMETER Port
    The port number to check (required).
    Example: 5173 for Vite, 3000 for Express

.PARAMETER ServiceName
    Friendly name of the service for display in messages.
    Default: "Service"

.EXAMPLE
    .\ValidatePort.ps1 -Port 5173 -ServiceName "Vite Development Server"
    Checks if port 5173 is available for Vite.

.EXAMPLE
    .\ValidatePort.ps1 -Port 3000 -ServiceName "Production Proxy Server"
    Checks if port 3000 is available for Express.

.NOTES
    Exit Code 0: Port is available
    Exit Code 1: Port in use and cannot be freed
    
    Shows interactive popups for user confirmation.
    Called automatically by LocalWorkflow and RemoteWorkflow.
    
    Author: Sleep Outside Team 04
    Version: 2.0
#>

param(
    [Parameter(Mandatory = $true)]
    [int]$Port,
    
    [Parameter(Mandatory = $false)]
    [string]$ServiceName = "Service"
)

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Port Availability Check - Port $Port" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Function to check if port is in use
function Test-PortInUse {
    param([int]$Port)
    
    $connection = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    return $null -ne $connection
}

# Function to get process using the port
function Get-PortProcess {
    param([int]$Port)
    
    $connection = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    if ($connection) {
        $processId = $connection.OwningProcess
        $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
        return $process
    }
    return $null
}

# Check if port is in use
if (-not (Test-PortInUse -Port $Port)) {
    Write-Host "[PASS] Port $Port is available" -ForegroundColor Green
    Write-Host "========================================`n" -ForegroundColor Cyan
    exit 0
}

# Port is in use - get the process
$process = Get-PortProcess -Port $Port
if ($null -eq $process) {
    Write-Host "[FAIL] Port $Port is in use but cannot identify the process" -ForegroundColor Red
    Write-Host "========================================`n" -ForegroundColor Cyan
    Add-Type -AssemblyName System.Windows.Forms
    [System.Windows.Forms.MessageBox]::Show(
        "Port $Port is in use but the process cannot be identified.`n`nPlease manually stop the service using port $Port and try again.",
        "Port $Port In Use",
        [System.Windows.Forms.MessageBoxButtons]::OK,
        [System.Windows.Forms.MessageBoxIcon]::Warning
    ) | Out-Null
    exit 1
}

Write-Host "[!] Port $Port is in use" -ForegroundColor Yellow
Write-Host "    Process: $($process.ProcessName) (PID: $($process.Id))" -ForegroundColor Yellow
Write-Host "    Path: $($process.Path)" -ForegroundColor Gray

# Ask user if they want to kill the process (GUI popup Yes/No)
$canUseGui = $false
try {
    Add-Type -AssemblyName System.Windows.Forms -ErrorAction Stop
    if ([System.Environment]::UserInteractive) { $canUseGui = $true }
} catch { $canUseGui = $false }

$message = "Port $Port is currently in use by:`n`n"
$message += "Process: $($process.ProcessName) (PID: $($process.Id))`n"
$message += "Path: $($process.Path)`n`n"
$message += "Do you want to terminate this process to free the port?"

$userApprove = $false
if ($canUseGui) {
    $result = [System.Windows.Forms.MessageBox]::Show(
        $message,
        "Port $Port In Use - Kill Process?",
        [System.Windows.Forms.MessageBoxButtons]::YesNo,
        [System.Windows.Forms.MessageBoxIcon]::Question
    )
    if ($result -eq [System.Windows.Forms.DialogResult]::Yes) {
        $userApprove = $true
    } else {
        [System.Windows.Forms.MessageBox]::Show(
            "Workflow cancelled. Please manually stop the service using port $Port and try again.",
            "Workflow Cancelled",
            [System.Windows.Forms.MessageBoxButtons]::OK,
            [System.Windows.Forms.MessageBoxIcon]::Information
        ) | Out-Null
        exit 1
    }
} else {
    Write-Host $message -ForegroundColor Yellow
    while ($true) {
        $answer = Read-Host "Terminate process? (Y/N)"
        if ($answer -match '^[Yy]') { $userApprove = $true; break }
        if ($answer -match '^[Nn]') { $userApprove = $false; break }
        Write-Host "Please enter Y or N."
    }
    if (-not $userApprove) {
        Write-Host "Workflow cancelled. Please manually stop the service using port $Port and try again." -ForegroundColor Cyan
        exit 1
    }
}

# User chose to kill - attempt to terminate
Write-Host "[*] Attempting to terminate process $($process.ProcessName) (PID: $($process.Id))..." -ForegroundColor Yellow
try {
    Stop-Process -Id $process.Id -Force -ErrorAction Stop
    Start-Sleep -Seconds 2
    # Verify the port is now free
    $portFree = -not (Test-PortInUse -Port $Port)
    if ($portFree) {
        $okMsg = "Process successfully terminated. Port $Port is now available for $ServiceName."
        $okTitle = "Success"
        $okIcon = [System.Windows.Forms.MessageBoxIcon]::Information
    } else {
        $okMsg = "Process was terminated but port $Port is still in use. Please manually verify and stop any services using this port, then try again."
        $okTitle = "Port Still In Use"
        $okIcon = [System.Windows.Forms.MessageBoxIcon]::Warning
    }
    [System.Windows.Forms.MessageBox]::Show(
        $okMsg,
        $okTitle,
        [System.Windows.Forms.MessageBoxButtons]::OK,
        $okIcon
    ) | Out-Null
    if ($portFree) {
        exit 0
    } else {
        exit 1
    }
} catch {
    Write-Host "[FAIL] Failed to terminate process: $_" -ForegroundColor Red
    Write-Host "========================================`n" -ForegroundColor Cyan
    [System.Windows.Forms.MessageBox]::Show(
        "Failed to terminate the process. Error: $_ Please manually stop the service using port $Port and try again.",
        "Failed to Kill Process",
        [System.Windows.Forms.MessageBoxButtons]::OK,
        [System.Windows.Forms.MessageBoxIcon]::Error
    ) | Out-Null
    exit 1
}
