param(
    [switch] $DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

. (Join-Path $PSScriptRoot '..\lib\Shared-AndroidEnv.ps1')

$tooling = Set-AndroidToolingEnvironment

function Get-EmulatorSerials {
    $deviceLines = & adb devices | Select-Object -Skip 1
    $serials = New-Object System.Collections.Generic.List[string]

    foreach ($line in $deviceLines) {
        if ([string]::IsNullOrWhiteSpace($line)) {
            continue
        }

        $parts = ($line -split '\s+') | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
        if ($parts.Count -lt 1) {
            continue
        }

        $serial = $parts[0]
        if ($serial.StartsWith('emulator-')) {
            $serials.Add($serial)
        }
    }

    return $serials
}

function Stop-AndroidProcesses {
    $processes = @(Get-Process | Where-Object {
        $_.ProcessName -in @('adb', 'emulator') -or $_.ProcessName -like 'qemu-system*'
    })

    foreach ($process in $processes) {
        if ($DryRun) {
            Write-Host "Would stop process: $($process.ProcessName) ($($process.Id))"
            continue
        }

        Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
    }
}

$serials = @(Get-EmulatorSerials)

if ($DryRun) {
    Write-Host "ANDROID_SDK_ROOT: $($tooling.AndroidSdkRoot)"
    if ($serials.Count -gt 0) {
        foreach ($serial in $serials) {
            Write-Host "Would request emulator shutdown: adb -s $serial emu kill"
        }
    } else {
        Write-Host 'No adb-visible emulator serials found.'
    }

    Stop-AndroidProcesses
    exit 0
}

foreach ($serial in $serials) {
    & adb -s $serial emu kill 2>$null | Out-Null
}

Start-Sleep -Seconds 2
Stop-AndroidProcesses

Write-Host 'Android emulator, qemu, and adb processes were stopped.'
