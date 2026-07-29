'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..', '..');
const hooksConfigPath = path.join(repoRoot, '.codex', 'hooks.json');
const recordGuardPath = path.join(__dirname, 'record-guard.js');
const sessionContextPath = path.join(__dirname, 'session-record-ctx.js');

function runNodeHook(scriptPath, command, cwd) {
  return spawnSync(process.execPath, [scriptPath], {
    cwd,
    input: JSON.stringify({
      hook_event_name: path.basename(scriptPath, '.js'),
      tool_name: 'Bash',
      tool_input: { command },
      cwd,
    }),
    encoding: 'utf8',
  });
}

function runGit(cwd, args) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
  assert.equal(
    result.status,
    0,
    `git ${args.join(' ')} failed:\n${result.stderr || result.stdout}`,
  );
  return result;
}

function createGitFixture() {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'flawed-ai-hook-'));
  runGit(fixture, ['init', '-q']);
  return fixture;
}

function writeFixtureFile(fixture, relativePath, content = 'fixture\n') {
  const target = path.join(fixture, ...relativePath.split('/'));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, 'utf8');
}

test('hooks.json uses one portable command layer per project hook', () => {
  const config = JSON.parse(fs.readFileSync(hooksConfigPath, 'utf8'));
  const handlers = [
    config.hooks.SessionStart[0].hooks[0],
    config.hooks.PreToolUse[0].hooks[0],
  ];

  for (const handler of handlers) {
    assert.equal(
      Object.hasOwn(handler, 'commandWindows'),
      false,
      'commandWindows must not wrap a second PowerShell process',
    );
    assert.match(handler.command, /^node /);
  }
});

test('record guard allows non-commit shell commands', () => {
  const result = runNodeHook(
    recordGuardPath,
    "Get-Content -Raw -Encoding UTF8 '记录/进度.md'",
    repoRoot,
  );
  assert.equal(result.status, 0, result.stderr);
});

test('record guard blocks a staged substantive change without records', (t) => {
  const fixture = createGitFixture();
  t.after(() => fs.rmSync(fixture, { recursive: true, force: true }));

  writeFixtureFile(fixture, 'design/example.md');
  runGit(fixture, ['add', 'design/example.md']);

  const result = runNodeHook(
    recordGuardPath,
    'git commit -m "test"',
    fixture,
  );
  assert.equal(result.status, 2);
  assert.match(result.stderr, /记录守卫/);
});

test('record guard allows a commit that also stages project records', (t) => {
  const fixture = createGitFixture();
  t.after(() => fs.rmSync(fixture, { recursive: true, force: true }));

  writeFixtureFile(fixture, 'design/example.md');
  writeFixtureFile(fixture, '记录/进度.md');
  runGit(fixture, ['add', 'design/example.md', '记录/进度.md']);

  const result = runNodeHook(
    recordGuardPath,
    'git commit -m "test"',
    fixture,
  );
  assert.equal(result.status, 0, result.stderr);
});

test('record guard blocks chained git add and git commit before staging occurs', (t) => {
  const fixture = createGitFixture();
  t.after(() => fs.rmSync(fixture, { recursive: true, force: true }));

  writeFixtureFile(fixture, 'design/example.md');

  const result = runNodeHook(
    recordGuardPath,
    'git add design/example.md && git commit -m "test"',
    fixture,
  );
  assert.equal(result.status, 2);
  assert.match(result.stderr, /分开执行/);
});

test('record guard preserves the explicit skip-record escape hatch', (t) => {
  const fixture = createGitFixture();
  t.after(() => fs.rmSync(fixture, { recursive: true, force: true }));

  writeFixtureFile(fixture, 'design/example.md');
  runGit(fixture, ['add', 'design/example.md']);

  const result = runNodeHook(
    recordGuardPath,
    'git commit -m "test [skip-record]"',
    fixture,
  );
  assert.equal(result.status, 0, result.stderr);
});

test('SessionStart hook returns valid additional context', () => {
  const result = runNodeHook(sessionContextPath, '', repoRoot);
  assert.equal(result.status, 0, result.stderr);

  const output = JSON.parse(result.stdout);
  assert.equal(
    output.hookSpecificOutput.hookEventName,
    'SessionStart',
  );
  assert.match(
    output.hookSpecificOutput.additionalContext,
    /记录铁律/,
  );
});
