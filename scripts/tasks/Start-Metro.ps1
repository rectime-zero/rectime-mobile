param(
    [switch] $DryRun,
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]] $MetroArgs
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
Set-Location $projectRoot
$metroArgsList = @(@($MetroArgs) | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })

$command = @('npm', 'start')
if ($metroArgsList.Count -gt 0) {
    $command += '--'
    $command += $metroArgsList
}

if ($DryRun) {
    Write-Host "Working directory: $projectRoot"
    Write-Host "Command: $($command -join ' ')"
    exit 0
}

if ($metroArgsList.Count -gt 0) {
    & npm 'start' '--' @metroArgsList
    exit $LASTEXITCODE
}

& npm 'start'
exit $LASTEXITCODE
