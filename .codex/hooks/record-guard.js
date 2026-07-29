#!/usr/bin/env node
/*
 * 记录守卫 · PreToolUse(Bash) hook
 * ------------------------------------------------------------------
 * 目的：当一次 `git commit` 含「实质改动」却没有同步「记录/」时，阻断它（exit 2），
 *      把理由喂回 Codex，逼其先补记录再提交。
 * 逃生口：commit message 含 [skip-record] → 放行（琐碎提交不绑死）。
 * 边界：同一工具调用中的 `git add ... && git commit ...` 必须拆开，避免检查尚未形成的暂存区。
 * 原则：fail-open —— 任何异常/非 commit 命令一律放行，绝不因 hook 自身问题挡住工作。
 * 触发：matcher "Bash"（每个 Bash 调用都进来，非 git commit 立即退出）。
 */
'use strict';
const { execSync } = require('child_process');
const fs = require('fs');

function readStdin() { try { return fs.readFileSync(0, 'utf8'); } catch { return ''; } }
function allow() { process.exit(0); }                    // 放行
function block(reason) { process.stderr.write(reason + '\n'); process.exit(2); } // 阻断

try {
  const raw = readStdin();
  const data = raw ? JSON.parse(raw) : {};
  const cmd = (data.tool_input && data.tool_input.command) || '';

  // 只管"命令位置真正调用 git commit"（命令起始 / && / || / ; / 换行后），
  // 而非命令文本里字面出现 "git commit"（如 printf/echo/grep 的字符串参数）。
  // 先剥离引号内字符串：真提交的 git commit 永在引号外，绝不会被误删；
  // 而 echo/printf 里引号内提到的 git commit 会被剥掉，从而不误报。
  const bare = cmd.replace(/'[^']*'/g, "''").replace(/"[^"]*"/g, '""');
  if (!/(^|&&|\|\||[;\n])\s*git\s+commit\b/.test(bare)) allow();
  // help/dry-run 不拦；逃生口放行
  if (/--help|--dry-run|(^|\s)-h(\s|$)/.test(cmd)) allow();
  if (/\[skip-record\]/.test(cmd)) allow();

  // PreToolUse 在整条 Bash 命令执行前运行。若 git add 与 git commit 写在同一条命令里，
  // 此时暂存区尚未包含前半段将添加的文件，继续检查会错误放行；要求拆开后再判断真实暂存区。
  if (/(^|&&|\|\||[;\n])\s*git\s+add\b/.test(bare)) {
    block(
`⛔ 记录守卫：请把 git add 与 git commit 分开执行。

PreToolUse 会在整条命令开始前检查；链式提交时 git add 尚未生效，无法可靠判断本次提交是否同步「记录/」。
请先单独 git add，再单独 git commit；确属琐碎提交可在 commit message 中加 [skip-record]。`);
  }

  const projectDir = process.env.CODEX_PROJECT_DIR || data.cwd || process.cwd();
  const git = (args) => execSync(`git -c core.quotepath=false ${args}`,
    { cwd: projectDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();

  // 本次提交将包含的文件 = 暂存区；若 -a/--all 再并入已跟踪的改动
  let files = git('diff --cached --name-only').split('\n').filter(Boolean);
  if (/\bcommit\b[\s\S]*(\s-[a-z]*a\b|--all)/.test(cmd)) {
    files = files.concat(git('diff --name-only').split('\n').filter(Boolean));
  }
  files = [...new Set(files)];
  if (files.length === 0) allow();                       // 没东西可提交

  const isRecord = (p) => p.startsWith('记录/');
  const recordTouched = files.some(isRecord);
  const substantive = files.filter((p) => !isRecord(p));

  if (substantive.length > 0 && !recordTouched) {
    const sample = substantive.slice(0, 8).map((p) => '  - ' + p).join('\n');
    block(
`⛔ 记录守卫：本次提交含 ${substantive.length} 处实质改动，但未同步「记录/」。
${sample}${substantive.length > 8 ? '\n  …' : ''}

按记录铁律先补再提交：
  • 记录/决策与活动日志.md：[活动]（干了什么 / 产出哪些文件，Obsidian 笔记只链接不复制）；
    若含人拍板的决策另记 [决策]（谁定的 · 为什么 · 否决了什么）。
  • 记录/进度.md：更新现状 / 待办 / 开放问题。

确属琐碎、无需记录 → 在 commit message 里加 [skip-record] 重试即可放行。`);
  }
  allow();
} catch (e) {
  allow(); // fail-open
}
