# Plan: 加固记录守卫的 Git 命令识别

**复杂度**：中（2–3 个实现/文档文件，无新依赖，不跨模块）

## 概述

修复质检发现的三个确定性绕过：`git commit -am`、`git.exe commit -am`、`git -C <dir> commit -am`。保留现有 Hook 的 stdin/退出码/fail-open 约定，不扩大到完整 Shell 解析器；先把失败用例固化为 RED 测试，再以最小词法识别替换两处脆弱正则。

## 需求复述

- **目标**：常见 Windows 与 Git 全局参数形式都进入同一记录检查；任意短选项簇只要含 `a`，都按 `--all` 处理。
- **假设**：支持范围限定为命令段起始处的 `git` / `git.exe`，允许 Git 全局参数位于 `commit` 之前；引号中的文字不视为真实命令。
- **不扩张范围**：不尝试解析 `cmd /c`、`powershell -Command`、Shell 变量展开、alias/function 或任意嵌套解释器；异常继续 fail-open。
- **待终端确认**：修改后仍需用户重启 Codex CLI、重新 trust，并区分项目 Hook 与未命名外部 Hook。

## 要模仿的惯例（Pattern Grounding）

| 类别 | 来源 | 惯例 |
|---|---|---|
| 输入与退出码 | `.codex/hooks/record-guard.js:14-17` | stdin 读取 Hook JSON；0 放行、2 规则阻断 |
| 误报控制 | `.codex/hooks/record-guard.js:23-30` | 先剥离引号内容，只检查命令位置的真实 Git 调用 |
| 错误处理 | `.codex/hooks/record-guard.js:78-80` | Hook 内异常 fail-open |
| 测试 fixture | `.codex/hooks/test-hooks.js:25-47` | Node 内置测试 + 系统临时目录 + 测后清理 |
| 行为断言 | `.codex/hooks/test-hooks.js:67-136` | 同时断言退出码和关键错误文本 |
| 历史共变 | 无 | `.codex/hooks/` 尚未进入当前 Git 历史，`git log --follow` 无结果 |

## 涉及文件

| 文件 | 动作 | 原因 |
|---|---|---|
| `.codex/hooks/test-hooks.js` | 修改 | 先固化命令语法矩阵与误报回归 |
| `.codex/hooks/record-guard.js` | 修改 | 用统一调用识别替换 `git commit` 与 `-a` 的脆弱正则 |
| `.codex/hooks/README.md` | 修改 | 写清支持形式、边界与自动验证 |
| `记录/进度.md` | 修改 | 如实记录质检发现、修复状态与剩余真实终端验收 |
| `记录/决策与活动日志.md` | 修改 | 追加本轮优化、测试证据和复盘结论 |

## 任务拆解

### 任务 1：补 RED 命令矩阵

- **做什么**：创建“已提交基线 + 未暂存的已跟踪实质改动”fixture，参数化测试：
  - `git commit -a -m "x"`
  - `git commit -am "x"`
  - `git commit -ma "x"`
  - `git commit --all -m "x"`
  - `git.exe commit -am "x"`
  - `git -C . commit -am "x"`
  - `git commit -m "x"`（只有未暂存改动时应放行）
  - `Write-Output "git commit -am x"`（文本提及应放行）
- **预期 RED**：`-am`、`git.exe`、`git -C` 三项实际为 0、断言预期为 2；其余通过。
- **验证**：`node --test ".codex/hooks/test-hooks.js"`

### 任务 2：统一识别 Git 子命令

- **做什么**：
  1. 从剥离引号后的命令按 `&&`、`||`、`;`、管道和换行划分命令段；
  2. 接受段首可选 PowerShell 调用符 `&`，随后必须是 `git` 或 `git.exe`；
  3. 在该 Git 调用中定位 `commit` / `add` 子命令，使 `git -C . commit` 与普通形式走同一路径；
  4. 仅检查 `commit` 后、`--` 前的参数；`--all` 或任一含 `a` 的短选项簇（`-a`、`-am`、`-ma`）都并入已跟踪改动；
  5. 保留 `[skip-record]`、help/dry-run、链式 add+commit 阻断和 fail-open。
- **模仿**：沿用现有 `allow()`、`block(reason)`、中文 stderr 与同步 `git diff`。
- **验证**：RED 矩阵转绿；原 7 项无回归。

### 任务 3：同步文档与记录

- **做什么**：README 列出支持矩阵和明确非目标；进度从“7/7 已完成”修正为最新自动测试结果，并继续保留“真实 CLI 验收未完成”；活动日志记录质检发现与修复。
- **验证**：搜索旧的 `7/7` 完成口径，确认没有把未完成的终端验收写成完成。

### 任务 4：机械验证与用户侧验收

- **自动验证**：

```powershell
node --test ".codex/hooks/test-hooks.js"
node --check ".codex/hooks/record-guard.js"
node --check ".codex/hooks/session-record-ctx.js"
Get-Content -Raw -Encoding UTF8 ".codex/hooks.json" | ConvertFrom-Json | Out-Null
git diff --check
```

- **用户侧验收**：
  1. 重启 Codex CLI；
  2. 在 `/hooks` 重新 trust 修改后的项目 Hook；
  3. 执行普通 PowerShell 读取命令，项目 PreToolUse 不应 exit 1；
  4. 在安全 fixture 中触发 `git commit -am`，应由项目记录守卫 exit 2；
  5. 若仍有红错，按 Hook 名称定位未命名的全局/插件 Hook。

## 风险

| 风险 | 可能性 | 缓解 |
|---|---:|---|
| 把引号中的 `git commit` 当作真实命令 | 中 | 保留显式负向测试 |
| 自制解析器演化成不完整 Shell parser | 中 | 限定支持边界，只解析命令段首 Git 调用 |
| `-a` 参数簇误判 | 中 | 同测 `-a`、`-am`、`-ma`、`--all` 与普通 `-m` |
| 修改定义导致 trust 再次失效 | 高 | 交付时明确要求重启与重新 trust |
| 未命名外部 Hook 继续失败 | 中 | 不把外部 Hook 纳入项目修复的通过判据 |

## 验收清单

- [ ] 新增命令矩阵先出现预期 3 项 RED
- [ ] `git commit -am`、`git.exe commit -am`、`git -C . commit -am` 均 exit 2
- [ ] 引号文字与仅未暂存改动的普通 `git commit -m` 均 exit 0
- [ ] 原有配置、记录同步、链式命令、逃生口和 SessionStart 测试无回归
- [ ] README 与两份项目记录如实同步
- [ ] 用户完成 Codex CLI 重新 trust 和真实运行验收
