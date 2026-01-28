# TestDbConnection.ps1
# Checks if the PostgreSQL database is reachable before starting the server

param(
    [string]$DatabaseHost = "localhost",
    [int]$DatabasePort = 5432
)

Write-Host "Testing connectivity to $DatabaseHost on port $DatabasePort..."
$result = Test-NetConnection -ComputerName $DatabaseHost -Port $DatabasePort

if ($result.TcpTestSucceeded) {
    Write-Host "Database connection test succeeded."
    exit 0
} else {
    Write-Error "Database connection test failed. The firewall may be blocking outbound traffic to $DatabaseHost:$DatabasePort."
    exit 1
}
