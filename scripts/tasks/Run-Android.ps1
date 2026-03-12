param(
    [switch] $DryRun,
    [switch] $WithPackager,
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]] $ReactNativeArgs
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

. (Join-Path $PSScriptRoot '..\lib\Shared-AndroidEnv.ps1')

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$tooling = Set-AndroidToolingEnvironment
$reactNativeArgsList = @(@($ReactNativeArgs) | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })

$commandArgs = @('run', 'android', '--')
if (-not $WithPackager) {
    $commandArgs += '--no-packager'
}
if ($reactNativeArgsList.Count -gt 0) {
    $commandArgs += $reactNativeArgsList
}

if ($DryRun) {
    Write-Host "Working directory: $projectRoot"
    Write-Host "JAVA_HOME: $($tooling.JavaHome)"
    Write-Host "ANDROID_SDK_ROOT: $($tooling.AndroidSdkRoot)"
    Write-Host "Command: npm $($commandArgs -join ' ')"
    exit 0
}

Set-Location $projectRoot
& npm @commandArgs
exit $LASTEXITCODE
