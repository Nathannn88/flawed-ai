---
name: startup
description: "Session 启动检查。每次新开对话时自动执行：读取进度、检查测试、扫描资源一致性、汇报状态。"
---

# /startup — Session 启动检查

> 每次新对话开始时快速扫描项目状态，给用户一份简洁的状态报告。

---

## 触发

- 每次新开对话时自动执行
- 用户说"项目状态"、"现在什么情况"

---

## 流程

### 一、并行读取

同时执行：

- **Read** `progress.md` — 当前版本、阶段、进行中 / 待做项
- **Read** `PLAN.md` — 当前开发阶段、待办项
- **Run** `npm test`（在 `project/` 下） — 测试状态

### 二、检查 Git 状态

`git status` → 关注未提交改动、当前分支、未跟踪文件。

### 三、扫描资源一致性

快速对比：

| 档案馆 (`design/`) | 施工现场 (`project/`) |
|--------------------|----------------------|
| `design/背景/` | `project/public/` 中的背景文件 |
| `design/prompt/` | `project/src/data/prompts/` |
| `design/UI/` | `project/public/` 中的 UI 素材 |

发现不一致 → 在报告中标出。

### 四、输出状态报告

> 不超过 20 行。一切正常的项不用列出 — 只报告异常和待办。

输出格式：

```
## 项目状态

**版本**：[version] · **阶段**：[phase]
**分支**：[branch] · **未提交改动**：有 / 无

### 测试
X passed / Y failed / Z skipped

### 进行中
- ...（从 progress.md 提取）

### 待做（前 3 项）
- ...（从 PLAN.md 提取）

### 注意
- [资源不一致 / 未提交改动 / 其他异常]

下一步做什么？
```
