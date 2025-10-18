#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

// big deprecation warning saying use docker compose instead in white text with a red background
const redBgWhiteText = (msg) => `\x1b[41m\x1b[97m${msg}\x1b[0m`;
console.warn(redBgWhiteText('DEPRECATION WARNING: This script will be deprecated. Please use the provided Docker Compose setup instead.\n'));
console.warn(redBgWhiteText('To start the development environment, run: docker-compose -f etc/docker-compose.dev.yml up --build -d\n'));
console.warn(redBgWhiteText('HOWEVER, the docker compose is currently not great for development. If you feel like you\'d like to improve the docker compose, please open an issue or a PR.\n'));
console.warn(redBgWhiteText('This script will continue to work for now, but may be removed in future versions.\n'));

// wait 5 seconds to allow user to read the warning, display a spinning cursor
const spinnerChars = ['|', '/', '-', '\\'];
let spinnerIndex = 0;
const spinnerInterval = setInterval(() => {
  process.stdout.write(`\r${spinnerChars[spinnerIndex]} Starting in 5 seconds... Press Ctrl+C to cancel.`);
  spinnerIndex = (spinnerIndex + 1) % spinnerChars.length;
}, 250);

setTimeout(() => {
  clearInterval(spinnerInterval);
  process.stdout.write('\rStarting now...                           \n');
  for (const p of projects) spawnProcess(p);
}, 5000);

const projects = [
  { name: 'Client', dir: path.join(__dirname, '..', 'frontend'), run: ['npm', ['run', 'dev']], color: '36' },
  { name: 'Server', dir: path.join(__dirname, '..', 'backend'), run: ['npm', ['run', 'dev']], color: '35' },
];

function timeStamp() {
  const d = new Date();
  return d.toTimeString().split(' ')[0];
}

function colorText(text, code) {
  const reset = '\x1b[0m';
  return `\x1b[${code}m${text}${reset}`;
}

function prefixLine(appName, level, line, appColor = '37') {
  const ts = timeStamp();
  const prefix = `[${appName}] [${ts}] [${level}]`;
  const coloredPrefix = colorText(prefix, appColor);
  // color the message according to level
  if (level === 'Error') return `${coloredPrefix} ${colorText(line, '31')}`; // red
  if (level === 'Warning') return `${coloredPrefix} ${colorText(line, '33')}`; // yellow
  return `${coloredPrefix} ${line}`;
}

function spawnProcess(project) {
  // Only install if node_modules doesn't exist
  const fs = require('fs');
  const nodeModulesPath = path.join(project.dir, 'node_modules');
  const needsInstall = !fs.existsSync(nodeModulesPath);
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

  function startRun() {
    const [, args] = project.run; // we use platform-aware npmCmd
    const spawnOptions = { cwd: project.dir, stdio: ['ignore', 'pipe', 'pipe'] };
    if (process.platform === 'win32') spawnOptions.shell = true;
    const child = spawn(npmCmd, args, spawnOptions);

    child.stdout.on('data', (data) => {
      const lines = data.toString().split(/\r?\n/).filter(Boolean);
      for (const l of lines) {
        const level = /warning/i.test(l) ? 'Warning' : 'Info';
        process.stdout.write(prefixLine(project.name, level, l + '\n', project.color));
      }
    });

    child.stderr.on('data', (data) => {
      const lines = data.toString().split(/\r?\n/).filter(Boolean);
      for (const l of lines) {
        if (/warning/i.test(l)) {
          // treat as warning and print to stdout
          process.stdout.write(prefixLine(project.name, 'Warning', l + '\n', project.color));
        } else {
          process.stderr.write(prefixLine(project.name, 'Error', l + '\n', project.color));
        }
      }
    });

    child.on('exit', (c, sig) => {
      console.log(prefixLine(project.name, 'Debug', `process exited with code=${c} signal=${sig}`, project.color));
    });
  }

  if (needsInstall) {
    try {
      const spawnOptions = { cwd: project.dir, stdio: ['ignore', 'pipe', 'pipe'] };
      if (process.platform === 'win32') spawnOptions.shell = true;
      const installer = spawn(npmCmd, ['install'], spawnOptions);

      installer.stdout.on('data', (data) => {
        const lines = data.toString().split(/\r?\n/).filter(Boolean);
        for (const l of lines) {
          const level = /warning/i.test(l) ? 'Warning' : 'Info';
          process.stdout.write(prefixLine(project.name, level, l + '\n', project.color));
        }
      });
      installer.stderr.on('data', (data) => {
        const lines = data.toString().split(/\r?\n/).filter(Boolean);
        for (const l of lines) {
          if (/warning/i.test(l)) {
            process.stdout.write(prefixLine(project.name, 'Warning', l + '\n', project.color));
          } else {
            process.stderr.write(prefixLine(project.name, 'Error', l + '\n', project.color));
          }
        }
      });

      installer.on('close', (code) => {
        if (code !== 0) {
          console.error(prefixLine(project.name, 'Error', `install exited with code ${code}\n`, project.color));
          return;
        }
        startRun();
      });
    } catch (err) {
  console.error(prefixLine(project.name, 'Error', `installer spawn failed: ${err && err.stack ? err.stack : String(err)}\n`, project.color));
      return;
    }
  } else {
  process.stdout.write(prefixLine(project.name, 'Info', 'node_modules found, skipping install\n', project.color));
    startRun();
  }
}
