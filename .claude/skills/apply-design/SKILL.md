---
name: apply-design
description: "设计→代码桥梁。用户在 Obsidian 更新了 design/ 设计文稿后触发。读取设计变更，识别影响的代码模块，生成计划并实施。触发词：'读取更新'、'应用设计'、'设计变更'、'apply design'。"
---

# /apply-design — 设计→代码桥梁

> 用户在 Obsidian 编辑设计文档后，读取变更并应用到 project/ 代码中。

---

## 触发

- 用户说"读取更新"、"应用设计"、"设计变更"、"apply design"
- `/startup` 检测到 design/ 有未应用的变更时建议调用

---

## 流程

### 一、检测变更

```bash
git diff design/
git diff --cached design/
git status design/
```

如果没有变更，检查最近的 design/ commit 是否已应用到代码。

### 二、识别影响范围

读取变更文件所属子项目的 `CLAUDE.md`，特别是 **下游影响** 字段。

映射规则：

| 变更的设计文件 | 影响的代码模块 |
|--------------|--------------|
| `story/世界观.md` | `src/data/prompts/system-prompt.ts`、`src/lib/ending-system.ts` |
| `story/事件剧本.md` | `src/data/prompts/event-prompts.ts`、`src/lib/event-system.ts` |
| `character/诗人设定.md` | `src/data/prompts/system-prompt.ts`、`src/data/prompts/intro-prompt.ts` |
| `character/企鹅设定.md` | `src/lib/penguin-system.ts`、`src/components/companion/` |
| `style/*.md` | `tailwind.config.ts`、`src/app/globals.css`、`src/components/` |
| `system/系统机制.md` | `src/lib/*.ts`（所有系统模块）、`src/types/`、`src/store/` |

### 三、生成计划

列出需要修改的文件和具体变更内容，等用户确认。

### 四、实施

按计划修改代码。完成后调用 `/check`。

---

## 注意事项

- 不修改 design/ 中的文件（那是用户的领地）
- 只修改 project/ 中的代码
- 如果设计变更涉及新系统或新页面，建议改用 `/my-feature-pipeline`
