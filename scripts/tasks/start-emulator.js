#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync, spawn } = require('child_process');
const {
  extractFlag,
  extractOption,
  setAndroidToolingEnvironment,
} = require('../lib/shared-android-env');

const defaultAvdName = 'Medium_Phone_API_36.1';
const originalArgs = process.argv.slice(2);
const dryRunResult = extractFlag(originalArgs, ['dry-run', 'DryRun']);
const coldBootResult = extractFlag(dryRunResult.remainingArgs, ['cold-boot', 'ColdBoot']);
const avdNameResult = extractOption(coldBootResult.remainingArgs, ['avd-name', 'AvdName']);
const avdName = avdNameResult.value || defaultAvdName;

function getEmulatorExecutable(androidSdkRoot) {
  return path.join(androidSdkRoot, 'emulator', process.platform === 'win32' ? 'emulator.exe' : 'emulator');
}

function runOutput(command, args) {
  return execFileSync(command, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function getAvailableAvds(emulatorExecutable) {
  const output = runOutput(emulatorExecutable, ['-list-avds']);
  if (output === '') {
    return [];
  }

  return output.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
}

function getRunningEmulatorSerials() {
  const output = runOutput('adb', ['devices']);
  return output
    .split(/\r?\n/)
    .slice(1)
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => line.split(/\s+/))
    .filter(parts => parts[0] && parts[1] === 'device' && parts[0].startsWith('emulator-'))
    .map(parts => parts[0]);
}

function getRunningAvdName(serial) {
  return runOutput('adb', ['-s', serial, 'emu', 'avd', 'name']).split(/\r?\n/)[0].trim();
}

function hasLaunchingEmulator(avd) {
  if (process.platform === 'win32') {
    return false;
  }

  try {
    const output = runOutput('ps', ['-ax', '-o', 'command=']);
    return output.split(/\r?\n/).some(line => line.includes('emulator') && line.includes(`-avd ${avd}`));
  } catch (error) {
    return false;
  }
}

function printDryRun(commandArgs, toolingError) {
  if (toolingError) {
    console.log(`Tooling warning: ${toolingError}`);
  }

  console.log(`AVD Name: ${avdName}`);
  console.log(`Command: ${commandArgs.join(' ')}`);
}

if (dryRunResult.found) {
  try {
    const tooling = setAndroidToolingEnvironment();
    const emulatorExecutable = getEmulatorExecutable(tooling.androidSdkRoot);
    const commandArgs = [emulatorExecutable, '-avd', avdName];
    if (coldBootResult.found) {
      commandArgs.push('-no-snapshot-load');
    }

    console.log(`ANDROID_SDK_ROOT: ${tooling.androidSdkRoot}`);
    console.log(`Emulator: ${emulatorExecutable}`);
    printDryRun(commandArgs, null);
  } catch (error) {
    printDryRun(['emulator', '-avd', avdName], error.message);
  }
  process.exit(0);
}

const tooling = setAndroidToolingEnvironment();
const emulatorExecutable = getEmulatorExecutable(tooling.androidSdkRoot);

if (!fs.existsSync(emulatorExecutable)) {
  throw new Error(`Android Emulator executable was not found: ${emulatorExecutable}`);
}

const availableAvds = getAvailableAvds(emulatorExecutable);
const avdIniPath = path.join(os.homedir(), '.android', 'avd', `${avdName}.ini`);
const avdExists = availableAvds.includes(avdName) || fs.existsSync(avdIniPath);

if (!avdExists) {
  const availableLabel = availableAvds.length > 0 ? availableAvds.join(', ') : 'none';
  throw new Error(`AVD '${avdName}' was not found. Available AVDs: ${availableLabel}`);
}

for (const serial of getRunningEmulatorSerials()) {
  if (getRunningAvdName(serial) === avdName) {
    console.log(`AVD '${avdName}' is already running on ${serial}.`);
    process.exit(0);
  }
}

if (hasLaunchingEmulator(avdName)) {
  throw new Error(`AVD '${avdName}' is already launching. Wait for it to finish booting or close it first.`);
}

const emulatorArgs = ['-avd', avdName];
if (coldBootResult.found) {
  emulatorArgs.push('-no-snapshot-load');
}

const child = spawn(emulatorExecutable, emulatorArgs, {
  detached: true,
  stdio: 'ignore',
});

child.unref();
