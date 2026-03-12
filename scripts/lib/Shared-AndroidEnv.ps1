Set-StrictMode -Version Latest

function Resolve-FirstExistingPath {
    param(
        [Parameter(Mandatory = $true)]
        [string[]] $Candidates,

        [Parameter(Mandatory = $true)]
        [string] $Label
    )

    foreach ($candidate in $Candidates) {
        if ([string]::IsNullOrWhiteSpace($candidate)) {
            continue
        }

        if (Test-Path $candidate) {
            return (Resolve-Path $candidate).Path
        }
    }

    throw "Unable to resolve $Label. Checked: $($Candidates -join ', ')"
}

function Add-PathEntries {
    param(
        [Parameter(Mandatory = $true)]
        [string[]] $Entries
    )

    $existingEntries = @{}
    foreach ($entry in ($env:Path -split ';')) {
        if (-not [string]::IsNullOrWhiteSpace($entry)) {
            $existingEntries[$entry.ToLowerInvariant()] = $true
        }
    }

    $entriesToPrepend = New-Object System.Collections.Generic.List[string]
    foreach ($entry in $Entries) {
        if ([string]::IsNullOrWhiteSpace($entry) -or -not (Test-Path $entry)) {
            continue
        }

        $normalizedEntry = $entry.ToLowerInvariant()
        if (-not $existingEntries.ContainsKey($normalizedEntry)) {
            $entriesToPrepend.Add($entry)
            $existingEntries[$normalizedEntry] = $true
        }
    }

    if ($entriesToPrepend.Count -gt 0) {
        $env:Path = ($entriesToPrepend + ($env:Path -split ';')) -join ';'
    }
}

function Set-AndroidToolingEnvironment {
    $javaCandidates = @(
        $env:JAVA_HOME,
        (Join-Path $env:LOCALAPPDATA 'Programs\Android Studio\jbr'),
        (Join-Path $env:ProgramFiles 'Android\Android Studio\jbr')
    ) | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }

    $androidSdkCandidates = @(
        $env:ANDROID_SDK_ROOT,
        $env:ANDROID_HOME,
        (Join-Path $env:LOCALAPPDATA 'Android\Sdk')
    ) | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }

    $javaHome = Resolve-FirstExistingPath -Label 'JAVA_HOME' -Candidates $javaCandidates
    $androidSdkRoot = Resolve-FirstExistingPath -Label 'ANDROID_SDK_ROOT' -Candidates $androidSdkCandidates

    $env:JAVA_HOME = $javaHome
    $env:ANDROID_HOME = $androidSdkRoot
    $env:ANDROID_SDK_ROOT = $androidSdkRoot

    Add-PathEntries -Entries @(
        (Join-Path $javaHome 'bin'),
        (Join-Path $androidSdkRoot 'platform-tools'),
        (Join-Path $androidSdkRoot 'emulator')
    )

    [pscustomobject]@{
        JavaHome       = $javaHome
        AndroidSdkRoot = $androidSdkRoot
    }
}
