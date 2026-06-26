# .claude/hooks —— 记录同步守卫

> 让「改了东西忘了写记录」在结构上更难发生。**指令(怎么写记录)仍在 `CLAUDE.md`/skill；
> Hook 只负责确定性地"何时逼我写"。** 二者混合，不是替代。

## 装了什么（配置在 `../settings.json`，三层 hooks 合并执行，不影响全局 hook）

| Hook | 事件 | 作用 | 阻断? |
|------|------|------|-------|
| `session-record-ctx.js` | `SessionStart`(startup\|resume) | 开/恢复会话时注入「记录铁律」精简提醒 + 当前 git 漂移摘要 | 否（纯注入） |
| `record-guard.js` | `PreToolUse`(Bash) | `git commit` 前检查：含实质改动却没动 `记录/` → 拦下 | **是**（exit 2） |

## commit 守卫规则

- **会被拦**：本次提交含 `记录/` 之外的实质改动，且没有任何 `记录/` 改动。
- **放行**：① 同时改了 `记录/`；② commit message 含 **`[skip-record]`**（琐碎提交逃生口）；
  ③ 非 `git commit` 命令；④ 任何异常（fail-open，绝不误伤）。
- 支持 `git commit`、`git add ... && git commit`、`git commit -a`。

## 验证

1. 改一个 `design/` 文件、不动 `记录/`，`git commit -m "x"` → 应被拦。
2. 同条命令改成 `git commit -m "x [skip-record]"` → 应放行。
3. 改 `记录/进度.md` 后再提交 → 应放行。
4. 新开会话 → 上下文应出现「记录铁律 · 自动提醒」+ git 漂移摘要。

## 关闭 / 回滚

- 临时单次：commit message 加 `[skip-record]`。
- 永久：删 `../settings.json` 里的 `hooks` 块（脚本留着不生效），或整删本目录。
- 首次启用时 Claude Code 会要求**审批这些 hook**（安全机制），批一次即可。

## 跨平台

脚本用 Node（exec `node "<path>"`，无需 jq/PowerShell），Win/macOS/Linux 通用；node 已是环境依赖。
