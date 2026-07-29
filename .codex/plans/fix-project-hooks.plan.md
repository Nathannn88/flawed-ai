# Plan: 修复项目级 Codex Hooks

**复杂度**：中

## 概述

修复 `flawed-ai` 项目自有 Hook 在 Windows PowerShell 下反复返回 exit 1 的问题，并补上 commit 守卫对链式 `git add ... && git commit ...` 的绕过缺口。只修改当前仓库 `.codex/` 下的 Hook；截图中另一条未命名的全局/插件 Hook 只定位来源，不越权修改项目外配置。

## 需求复述

- **目标**：让 `SessionStart` 和项目 `PreToolUse` Hook 在 Codex CLI 终端中稳定运行；普通命令返回 0，真正违反记录规则的提交返回 2。
- **假设**：用户使用 Windows PowerShell 启动 Codex CLI；保留 Node.js Hook，不引入新依赖。
- **待澄清**：未命名的第二条 PreToolUse 来源尚未展开；若修完项目 Hook 后仍报错，再根据 `/hooks` 来源单独处理。

## 要模仿的惯例（Pattern Grounding）

| 类别 | 来源 | 惯例 |
|---|---|---|
| Hook 注册 | `.codex/hooks.json:4`、`.codex/hooks.json:18` | 事件 → matcher → command handler；保留 timeout 与中文 statusMessage |
| 输入与退出码 | `.codex/hooks/record-guard.js:15`、`:16`、`:17` | JSON 从 stdin 读取；0 放行、2 阻断 |
| 错误处理 | `.codex/hooks/record-guard.js:64` | fail-open，Hook 内部异常不误伤正常工具调用 |
| Session 输出 | `.codex/hooks/session-record-ctx.js:39` | 用 `hookSpecificOutput.additionalContext` 注入上下文 |
| 文档 | `.codex/hooks/README.md:20` | 同目录 README 记录验证、回滚和跨平台行为 |
| 测试 | 当前无现有自动测试 | 使用 Node 内置 `node:test` 建最小回归测试，不引入依赖 |

## 涉及文件

| 文件 | 动作 | 原因 |
|---|---|---|
| `.codex/hooks/test-hooks.js` | 新建 | 先写 RED 测试，覆盖配置启动链与守卫关键分支 |
| `.codex/hooks.json` | 修改 | 移除会被外层 PowerShell错误展开的嵌套 `commandWindows` |
| `.codex/hooks/record-guard.js` | 修改 | 链式 add+commit 不再静默绕过，要求拆成两条命令 |
| `.codex/hooks/README.md` | 修改 | 修正支持范围、验证方法和 Windows 行为说明 |
| `记录/进度.md` | 修改 | 将“尚未迁移”更新为“已迁移并完成运行验收”或如实记录剩余问题 |
| `记录/决策与活动日志.md` | 修改 | 追加本次 Hook 修复活动及验证证据 |

## 任务拆解

### 任务 1：先写失败测试

- **做什么**：用 Node 内置测试构造 Hook stdin；先断言配置不再包含嵌套 PowerShell，并覆盖普通命令、无记录提交、带记录提交、`[skip-record]`、链式 add+commit。
- **预期 RED**：
  - 当前 `hooks.json` 仍含嵌套 `commandWindows`，配置测试失败。
  - 当前链式 add+commit 返回 0，安全测试预期返回 2，因此失败。
- **验证**：`node --test .codex/hooks/test-hooks.js`

### 任务 2：修复启动链

- **做什么**：删除两条 handler 的 `commandWindows`，复用 PowerShell与 POSIX 都能执行的通用 `command`，消除双层 PowerShell、变量提前展开和 stdin 转发风险。
- **模仿**：保留现有 git-root 定位、timeout、statusMessage 和脚本路径。
- **验证**：解析 `hooks.json`；把模拟 Hook JSON 经 PowerShell管道传给两条通用命令，预期 exit 0。

### 任务 3：关闭链式提交绕过

- **做什么**：若同一 Bash command 同时包含 `git add` 与 `git commit`，且没有 `[skip-record]`，返回 exit 2 并要求分开执行；不尝试在 PreToolUse 阶段猜测尚未形成的暂存区。
- **模仿**：沿用现有 `block(reason)`、fail-open 和中文反馈格式。
- **验证**：回归测试预期链式命令 exit 2；普通读取 exit 0；合规提交 exit 0。

### 任务 4：文档、记录与终端验收

- **做什么**：更新 Hook README 和项目两份记录；重新进入 `/hooks` 完成定义变更后的信任审查。
- **验证**：
  - `node --test .codex/hooks/test-hooks.js`
  - `node --check .codex/hooks/record-guard.js`
  - `node --check .codex/hooks/session-record-ctx.js`
  - 新会话验证 SessionStart；普通 `Get-Content` 不再显示项目 Hook failed。

## 风险

| 风险 | 可能性 | 缓解 |
|---|---:|---|
| Hook 定义变化导致原 trust 失效 | 高 | 修改后明确重新 `/hooks` 审查 |
| 未命名的全局/插件 Hook 仍失败 | 中 | 通过 `/hooks` 来源区分；不把外部错误误判为项目修复失败 |
| 链式命令限制影响习惯 | 中 | `[skip-record]` 保留逃生口；错误信息明确要求拆分 |
| exit 1 与 exit 2 混淆 | 低 | 自动测试同时断言退出码与 stderr |

## 验收清单

- [x] RED 测试先失败且失败原因符合预期
- [x] 项目普通 PreToolUse 调用稳定返回 0
- [x] SessionStart 输出合法 additionalContext
- [x] 违规提交与链式 add+commit 返回 2
- [x] 合规提交与 `[skip-record]` 返回 0
- [x] README、进度和活动日志同步
- [ ] `/hooks` 中项目 Hook 重新信任并 Active
- [ ] 若仍有红色失败，能明确归因到未命名的外部 Hook

## 实施结果

- 自动回归测试：7/7 通过。
- `record-guard.js`、`session-record-ctx.js`：`node --check` 通过。
- `hooks.json`：JSON 解析通过，`commandWindows` 残留数为 0。
- PowerShell管道模拟：普通 PreToolUse exit 0；SessionStart exit 0，并返回有效 additionalContext。
- 剩余两项必须在修改后的 Hook 定义重新 trust、启动新 Codex 会话后由终端运行态确认。
