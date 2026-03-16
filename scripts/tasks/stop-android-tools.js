#!/usr/bin/env node

const { execFileSync, spawnSync } = require('child_process');
const { extractFlag, setAndroidToolingEnvironment } = require('../lib/shared-android-env');

const dryRunResult = extractFlag(process.argv.slice(2), ['dry-run', 'DryRun']);

function runOutput(command, args) {
  return execFileSync(command, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function getEmulatorSerials() {
  const output = runOutput('adb', ['devices']);
  return output
    .split(/\r?\n/)
    .slice(1)
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => line.split(/\s+/))
    .filter(parts => parts[0] && parts[0].startsWith('emulator-'))
    .map(parts => parts[0]);
}

function runBestEffort(command, args) {
  spawnSync(command, args, {
    stdio: 'ignore',
  });
}

function stopAndroidProcesses() {
  if (process.platform === 'win32') {
    runBestEffort('taskkill', ['/F', '/T', '/IM', 'adb.exe']);
    runBestEffort('taskkill', ['/F', '/T', '/IM', 'emulator.exe']);
    runBestEffort('powershell', [
      '-NoProfile',
      '-Command',
      "Get-Process | Where-Object { $_.ProcessName -like 'qemu-system*' } | Stop-Process -Force",
    ]);
    return;
  }

  runBestEffort('pkill', ['-f', '/emulator']);
  runBestEffort('pkill', ['adb']);
}

if (dryRunResult.found) {
  try {
    const tooling = setAndroidToolingEnvironment();
    console.log(`ANDROID_SDK_ROOT: ${tooling.androidSdkRoot}`);
    const serials = getEmulatorSerials();
    if (serials.length === 0) {
      console.log('No adb-visible emulator serials found.');
    } else {
      for (const serial of serials) {
        console.log(`Would request emulator shutdown: adb -s ${serial} emu kill`);
      }
    }
    console.log('Would stop lingering adb/emulator processes.');
  } catch (error) {
    console.log(`Tooling warning: ${error.message}`);
  }
  process.exit(0);
}

setAndroidToolingEnvironment();

for (const serial of getEmulatorSerials()) {
  runBestEffort('adb', ['-s', serial, 'emu', 'kill']);
}

stopAndroidProcesses();

console.log('Android emulator and adb processes were stopped.');
