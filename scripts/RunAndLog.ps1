#
# See functional requirements: scripts/documentation/RunAndLog_requirements.md
param(
    [Parameter(Mandatory=$true)]
    [string]$ScriptName,
    [Parameter(ValueFromRemainingArguments = $true)]
    $Args,
    [int]$TimeoutSeconds = 300
)

# Resolve paths
$scriptsDir = $PSScriptRoot
$repoRoot = Split-Path -Path $scriptsDir -Parent
$runWrapper = Join-Path -Path $repoRoot -ChildPath 'Run.ps1'
$logFile = Join-Path -Path $repoRoot -ChildPath 'devworkflow_failures.log'

if (-not (Test-Path $runWrapper)) {
    Write-Error "Run.ps1 not found at $runWrapper"
    exit 1
}

Write-Host "Running $ScriptName via Run.ps1 (logging failures to $logFile)..."

# Prepare output files
$timestamp = Get-Date -Format 'yyyyMMddHHmmss'
$outFile = Join-Path $repoRoot ("run_stdout_$timestamp.log")
$errFile = Join-Path $repoRoot ("run_stderr_$timestamp.log")

# Build argument list for powershell -File <Run.ps1> <ScriptName> <Args...>
 $argList = @('-NoProfile','-ExecutionPolicy','Bypass','-File',$runWrapper,$ScriptName)
if ($Args) { $argList += $Args }

# Remove any null/empty elements
 $argList = $argList | Where-Object { $_ -ne $null -and $_ -ne '' } | ForEach-Object { [string]$_ }

# Quote any arguments containing spaces so powershell -File receives a single path argument
$safeArgList = $argList | ForEach-Object {
    if ($_ -is [string] -and $_ -match '\s') { '"{0}"' -f $_ } else { $_ }
}

## If the current host is interactive, run inline so prompts (Read-Host/MessageBox) work.
$isInteractive = $false
try { if ($Host -and $Host.UI -and $Host.UI.RawUI) { $isInteractive = $true } } catch { $isInteractive = $false }

if ($isInteractive) {
    # Run in this console and tee output to file so user prompts are interactive
    Write-Host "Interactive console detected — running in-process so prompts work." -ForegroundColor Cyan
    $scriptArgs = @('-NoProfile','-ExecutionPolicy','Bypass','-File',$runWrapper,$ScriptName) + $Args
    $scriptArgs = $scriptArgs | Where-Object { $_ -ne $null -and $_ -ne '' }
    try {
        & powershell @scriptArgs 2>&1 | Tee-Object -FilePath $outFile
        $exitCode = $LASTEXITCODE
        if (Test-Path $errFile) { Remove-Item $errFile -ErrorAction SilentlyContinue }
    } catch {
        $exitCode = 1
        $time = Get-Date -Format o
        $entry = "`n===== Execution failed at $time =====`nScript: $ScriptName`nError: $_`n" + ("=" * 60) + "`n"
        Add-Content -Path $logFile -Value $entry -Encoding UTF8
        Write-Host "Execution failed. Details appended to $logFile" -ForegroundColor Red
        exit $exitCode
    }
    # After run, if exit non-zero, read output and log
    $outText = '' ; if (Test-Path $outFile) { $outText = Get-Content $outFile -Raw -ErrorAction SilentlyContinue }
    if ($exitCode -ne 0) {
        $time = Get-Date -Format o
        $separator = "`n===== Failure captured at $time =====`n"
        $header = "Script: $ScriptName`nExitCode: $exitCode`n"
        $body = $outText
        $entry = $separator + $header + "Output:`n" + $body + "`n" + ("=" * 60) + "`n"
        Add-Content -Path $logFile -Value $entry -Encoding UTF8
        Write-Host "Run failed (exit code $exitCode). Details appended to $logFile" -ForegroundColor Yellow
    } else {
        Write-Host "Run completed successfully (exit code 0)." -ForegroundColor Green
    }
    exit $exitCode
} else {
    # Non-interactive host — run in separate process with redirects and timeout
    try {
        $proc = Start-Process -FilePath 'powershell' -ArgumentList $safeArgList -RedirectStandardOutput $outFile -RedirectStandardError $errFile -PassThru
    } catch {
        $time = Get-Date -Format o
        $entry = "`n===== Start failed at $time =====`nScript: $ScriptName`nError: $_`n" + ("=" * 60) + "`n"
        Add-Content -Path $logFile -Value $entry -Encoding UTF8
        Write-Host "Failed to start process for $ScriptName. Details appended to $logFile" -ForegroundColor Red
        exit 1
    }

    # Wait for completion with timeout (milliseconds)
    try {
        $waitMs = [int]($TimeoutSeconds * 1000)
        $finished = $proc.WaitForExit($waitMs)
    } catch {
        $proc | Stop-Process -ErrorAction SilentlyContinue
        $time = Get-Date -Format o
        $entry = "`n===== Wait failed at $time =====`nScript: $ScriptName`nError: $_`n" + ("=" * 60) + "`n"
        Add-Content -Path $logFile -Value $entry -Encoding UTF8
        Write-Host "Failed while waiting for process. Details appended to $logFile" -ForegroundColor Red
        exit 1
    }

    if (-not $finished) {
        # Process exceeded timeout - kill it and record timeout
        try {
            Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
        } catch { }

        $exitCode = 124 # custom code for timeout
        $outText = ''
        $errText = ''
        if (Test-Path $outFile) { $outText = Get-Content $outFile -Raw -ErrorAction SilentlyContinue }
        if (Test-Path $errFile) { $errText = Get-Content $errFile -Raw -ErrorAction SilentlyContinue }

        $time = Get-Date -Format o
        $separator = "`n===== Timeout captured at $time (>$TimeoutSeconds s) =====`n"
        $header = "Script: $ScriptName`nExitCode: $exitCode`n"
        $body = "Stdout:`n$outText`n`nStderr:`n$errText"
        $entry = $separator + $header + $body + "`n" + ("=" * 60) + "`n"
        Add-Content -Path $logFile -Value $entry -Encoding UTF8

        Write-Host "Run timed out after $TimeoutSeconds seconds. Details appended to $logFile" -ForegroundColor Yellow
        exit $exitCode
    } else {
        # Process finished - collect exit code and output
        $proc.Refresh()
        $exitCode = $proc.ExitCode
        $outText = ''
        $errText = ''
        if (Test-Path $outFile) { $outText = Get-Content $outFile -Raw -ErrorAction SilentlyContinue }
        if (Test-Path $errFile) { $errText = Get-Content $errFile -Raw -ErrorAction SilentlyContinue }

        if ($exitCode -ne 0) {
            $time = Get-Date -Format o
            $separator = "`n===== Failure captured at $time =====`n"
            $header = "Script: $ScriptName`nExitCode: $exitCode`n"
            $body = "Stdout:`n$outText`n`nStderr:`n$errText"
            $entry = $separator + $header + $body + "`n" + ("=" * 60) + "`n"
            Add-Content -Path $logFile -Value $entry -Encoding UTF8

            Write-Host "Run failed (exit code $exitCode). Details appended to $logFile" -ForegroundColor Yellow
        } else {
            Write-Host "Run completed successfully (exit code 0)." -ForegroundColor Green
        }

        exit $exitCode
    }
}
