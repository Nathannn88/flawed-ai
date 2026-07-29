#!/usr/bin/env node
/*
 * 记录提醒注入 · SessionStart hook（matcher: startup|resume）
 * ------------------------------------------------------------------
 * 目的：每次开/恢复会话，向 Codex 上下文注入「记录铁律」精简提醒 + 当前 git 漂移摘要，
 *      让"新任务要同步记录"的意识自动出现，不依赖 $startup 或我记得读 AGENTS.md。
 * 纯注入、非阻断。fail-open —— 出错则什么都不注入，绝不影响会话启动。
 */
'use strict';
const { execSync } = require('child_process');
const fs = require('fs');

function readStdin() { try { return fs.readFileSync(0, 'utf8'); } catch { return ''; } }

try {
  const raw = readStdin();
  const data = raw ? JSON.parse(raw) : {};
  const projectDir = process.env.CODEX_PROJECT_DIR || data.cwd || process.cwd();

  let drift = '（无法读取 git 状态）';
  try {
    const out = execSync('git -c core.quotepath=false status --porcelain',
      { cwd: projectDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    const lines = out ? out.split('\n').filter(Boolean) : [];
    const recs = lines.filter((l) => l.slice(3).startsWith('记录/')).length;
    drift = lines.length === 0
      ? '工作树干净。'
      : `未提交改动 ${lines.length} 个（其中 记录/ ${recs} 个）。`;
  } catch (e) { /* fail-open: 保留默认文案 */ }

  const ctx =
`【记录铁律 · 自动提醒】凡改动 design/ · project/ · prototype/ 等实质内容，收尾前必须同步「记录/」：
· 记录/决策与活动日志.md：[活动]（干了啥 / 产出哪些文件，Obsidian 笔记只链接不复制）+ 人拍板的 [决策]（谁定 · 为什么 · 否决了什么）
· 记录/进度.md：现状 / 待办 / 开放问题
当前 git：${drift}
（提交时若改了实质内容却没动 记录/，commit 会被记录守卫拦下；琐碎提交可在 message 加 [skip-record]。）`;

  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: ctx }
  }));
  process.exit(0);
} catch (e) {
  process.exit(0); // fail-open：不注入
}
