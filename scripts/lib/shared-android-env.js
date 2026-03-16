const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');
const { execFileSync } = require('child_process');

function compact(values) {
  return values.filter(value => typeof value === 'string' && value.trim() !== '');
}

function getExistingRealPath(candidate) {
  if (!candidate || !fs.existsSync(candidate)) {
    return null;
  }

  return fs.realpathSync.native ? fs.realpathSync.native(candidate) : fs.realpathSync(candidate);
}

function resolveFirstExistingPath({ candidates, label }) {
  for (const candidate of compact(candidates)) {
    const resolved = getExistingRealPath(candidate);
    if (resolved) {
      return resolved;
    }
  }

  throw new Error(`Unable to resolve ${label}. Checked: ${compact(candidates).join(', ')}`);
}

function prependPathEntries(entries) {
  const currentEntries = compact((process.env.PATH || '').split(path.delimiter));
  const existingEntries = new Set(
    currentEntries.map(entry => (process.platform === 'win32' ? entry.toLowerCase() : entry)),
  );
  const entriesToPrepend = [];

  for (const entry of compact(entries)) {
    const resolved = getExistingRealPath(entry);
    if (!resolved) {
      continue;
    }

    const normalized = process.platform === 'win32' ? resolved.toLowerCase() : resolved;
    if (existingEntries.has(normalized)) {
      continue;
    }

    entriesToPrepend.push(resolved);
    existingEntries.add(normalized);
  }

  if (entriesToPrepend.length > 0) {
    process.env.PATH = [...entriesToPrepend, ...currentEntries].join(path.delimiter);
  }
}

function getJavaCandidates() {
  const homeDirectory = os.homedir();

  if (process.platform === 'win32') {
    return compact([
      process.env.JAVA_HOME,
      process.env.LOCALAPPDATA &&
        path.join(process.env.LOCALAPPDATA, 'Programs', 'Android Studio', 'jbr'),
      process.env.ProgramFiles && path.join(process.env.ProgramFiles, 'Android', 'Android Studio', 'jbr'),
    ]);
  }

  if (process.platform === 'darwin') {
    let systemJavaHome = null;
    try {
      systemJavaHome = execFileSync('/usr/libexec/java_home', { encoding: 'utf8' }).trim();
    } catch (error) {
      systemJavaHome = null;
    }

    return compact([
      process.env.JAVA_HOME,
      systemJavaHome,
      '/Applications/Android Studio.app/Contents/jbr/Contents/Home',
      '/Applications/Android Studio.app/Contents/jbr',
      '/Applications/Android Studio.app/Contents/jre/Contents/Home',
    ]);
  }

  return compact([
    process.env.JAVA_HOME,
    path.join(homeDirectory, 'android-studio', 'jbr'),
    '/opt/android-studio/jbr',
  ]);
}

function getAndroidSdkCandidates() {
  const homeDirectory = os.homedir();

  if (process.platform === 'win32') {
    return compact([
      process.env.ANDROID_SDK_ROOT,
      process.env.ANDROID_HOME,
      process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Android', 'Sdk'),
    ]);
  }

  if (process.platform === 'darwin') {
    return compact([
      process.env.ANDROID_SDK_ROOT,
      process.env.ANDROID_HOME,
      path.join(homeDirectory, 'Library', 'Android', 'sdk'),
    ]);
  }

  return compact([
    process.env.ANDROID_SDK_ROOT,
    process.env.ANDROID_HOME,
    path.join(homeDirectory, 'Android', 'Sdk'),
  ]);
}

function setAndroidToolingEnvironment() {
  const javaCandidates = getJavaCandidates();
  const androidSdkCandidates = getAndroidSdkCandidates();
  let javaHome;
  let androidSdkRoot;

  try {
    javaHome = resolveFirstExistingPath({
      label: 'JAVA_HOME',
      candidates: javaCandidates,
    });
  } catch (error) {
    throw new Error(`${error.message}. Set JAVA_HOME explicitly if Android Studio is installed in a custom location.`);
  }

  try {
    androidSdkRoot = resolveFirstExistingPath({
      label: 'ANDROID_SDK_ROOT',
      candidates: androidSdkCandidates,
    });
  } catch (error) {
    throw new Error(
      `${error.message}. Set ANDROID_SDK_ROOT explicitly if the Android SDK is installed outside the default location.`,
    );
  }

  process.env.JAVA_HOME = javaHome;
  process.env.ANDROID_HOME = androidSdkRoot;
  process.env.ANDROID_SDK_ROOT = androidSdkRoot;

  prependPathEntries([
    path.join(javaHome, 'bin'),
    path.join(androidSdkRoot, 'platform-tools'),
    path.join(androidSdkRoot, 'emulator'),
  ]);

  return {
    javaHome,
    androidSdkRoot,
  };
}

function getProjectRoot() {
  return path.resolve(__dirname, '..', '..');
}

function getCommand(binaryName) {
  return process.platform === 'win32' ? `${binaryName}.cmd` : binaryName;
}

function runCommand({ command, args, cwd, env }) {
  const child = spawn(command, args, {
    cwd,
    env,
    stdio: 'inherit',
  });

  child.on('error', error => {
    console.error(error.message);
    process.exit(1);
  });

  child.on('exit', code => {
    process.exit(code === null ? 1 : code);
  });
}

function normalizeOptionName(value) {
  return value.replace(/^[/-]+/, '').toLowerCase();
}

function extractFlag(argv, names) {
  const expectedNames = new Set(names.map(name => normalizeOptionName(name)));
  const remainingArgs = [];
  let found = false;

  for (const arg of argv) {
    if (!found && expectedNames.has(normalizeOptionName(arg))) {
      found = true;
      continue;
    }

    remainingArgs.push(arg);
  }

  return {
    found,
    remainingArgs,
  };
}

function extractOption(argv, names) {
  const expectedNames = new Set(names.map(name => normalizeOptionName(name)));
  const remainingArgs = [];
  let value = null;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (value === null && expectedNames.has(normalizeOptionName(arg))) {
      value = argv[index + 1] ?? '';
      index += 1;
      continue;
    }

    remainingArgs.push(arg);
  }

  return {
    remainingArgs,
    value,
  };
}

module.exports = {
  extractFlag,
  extractOption,
  getCommand,
  getProjectRoot,
  runCommand,
  setAndroidToolingEnvironment,
};
