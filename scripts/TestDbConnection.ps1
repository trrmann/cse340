#
# Enhanced DB Test: Checks host/port, then psql connection, then classification table
#
param(
    [string]$DatabaseHost = $env:PGHOST,
    [int]$DatabasePort = $env:PGPORT
)

if (-not $DatabaseHost) { $DatabaseHost = "localhost" }
if (-not $DatabasePort) { $DatabasePort = 5432 }

Write-Host "Step 1: Testing connectivity to $DatabaseHost on port $DatabasePort..."
try {
    $tcpClient = New-Object System.Net.Sockets.TcpClient
    $tcpClient.Connect($DatabaseHost, $DatabasePort)
    $tcpClient.Close()
    Write-Host "[PASS] Network connection succeeded."
} catch {
    Write-Error "[FAIL] Network connection to $($DatabaseHost):$($DatabasePort) failed."
    exit 1
}

# Step 2: Try connecting to the database using psql
$DatabaseUrl = $env:DATABASE_URL
if (-not $DatabaseUrl) {
    Write-Error "[FAIL] DATABASE_URL environment variable not set."
    exit 1
}
Write-Host "Step 2: Testing psql connection using DATABASE_URL..."
psql "$DatabaseUrl" -c "\q" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Error "[FAIL] psql connection failed. Check credentials and database status."
    exit 1
}
Write-Host "[PASS] psql connection succeeded."

# Step 3: Check for classification table
Write-Host "Step 3: Checking for 'classification' table..."
$output = psql "$DatabaseUrl" -tAc "SELECT 1 FROM classification LIMIT 1;" 2>$null
if ($LASTEXITCODE -eq 0 -and $output -match '1') {
    Write-Host "[PASS] 'classification' table exists and is accessible."
    exit 0
} else {
    Write-Error "[FAIL] 'classification' table does not exist or is empty."
    exit 1
}
