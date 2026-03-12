param(
    [string] $AvdName = 'Medium_Phone_API_36.1',
    [switch] $ColdBoot,
    [switch] $DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

. (Join-Path $PSScriptRoot '..\lib\Shared-AndroidEnv.ps1')

function Get-RunningEmulatorSerial {
    param(
        [Parameter(Mandatory = $true)]
        [string] $ExpectedAvdName
    )

    $deviceLines = & adb devices | Select-Object -Skip 1
    foreach ($line in $deviceLines) {
        if ([string]::IsNullOrWhiteSpace($line)) {
            continue
        }

        $parts = ($line -split '\s+') | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
        if ($parts.Count -lt 2) {
            continue
        }

        $serial = $parts[0]
        $state = $parts[1]
        if (-not $serial.StartsWith('emulator-') -or $state -ne 'device') {
            continue
        }

        $runningAvdName = (& adb -s $serial emu avd name 2>$null | Select-Object -First 1).Trim()
        if ($runningAvdName -eq $ExpectedAvdName) {
            return $serial
        }
    }

    return $null
}

function Test-RunningEmulatorWindow {
    param(
        [Parameter(Mandatory = $true)]
        [string] $ExpectedAvdName
    )

    $matchingProcesses = @(Get-Process |
        Where-Object {
            $_.ProcessName -like 'qemu-system*' -and
            $_.MainWindowTitle -like "*$ExpectedAvdName*"
        })

    return @($matchingProcesses).Count -gt 0
}

$tooling = Set-AndroidToolingEnvironment
$emulatorExecutable = Join-Path $tooling.AndroidSdkRoot 'emulator\emulator.exe'
$resolvedEmulatorExecutable = Resolve-FirstExistingPath -Label 'Android Emulator executable' -Candidates @($emulatorExecutable)

$availableAvds = @(& $resolvedEmulatorExecutable -list-avds | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
$availableAvdCount = @($availableAvds).Count
$avdIniPath = Join-Path $env:USERPROFILE ".android\avd\$AvdName.ini"
$avdExistsByIni = Test-Path $avdIniPath

if ($availableAvdCount -gt 0 -and $availableAvds -notcontains $AvdName -and -not $avdExistsByIni) {
    throw "AVD '$AvdName' was not found. Available AVDs: $($availableAvds -join ', ')"
}

if ($availableAvdCount -eq 0 -and -not $avdExistsByIni) {
    throw "AVD '$AvdName' was not found. 'emulator -list-avds' returned nothing and $avdIniPath does not exist."
}

$runningSerial = Get-RunningEmulatorSerial -ExpectedAvdName $AvdName
if ($runningSerial) {
    Write-Host "AVD '$AvdName' is already running on $runningSerial."
    exit 0
}

if (Test-RunningEmulatorWindow -ExpectedAvdName $AvdName) {
    throw "AVD '$AvdName' already has an emulator window, but adb is not ready. Close that emulator window and start it again."
}

$emulatorArgs = @('-avd', $AvdName)
if ($ColdBoot) {
    $emulatorArgs += '-no-snapshot-load'
}

if ($DryRun) {
    Write-Host "ANDROID_SDK_ROOT: $($tooling.AndroidSdkRoot)"
    Write-Host "Emulator: $resolvedEmulatorExecutable"
    Write-Host "Command: $resolvedEmulatorExecutable $($emulatorArgs -join ' ')"
    exit 0
}

Start-Process -FilePath $resolvedEmulatorExecutable -ArgumentList $emulatorArgs
