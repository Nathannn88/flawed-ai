---
name: sync-design
description: "设计资源同步。检查 design/（档案馆）与 project/（施工现场）的资源一致性，列出差异，执行同步。触发词：'同步设计资源'、'检查资源'，或涉及设计资源改动后自动调用。"
---

# /sync-design — 设计资源同步

> 确保 `design/`（档案馆）和 `project/`（施工现场）之间的素材保持一致。

---

## 触发

- `/startup` 发现资源不一致时
- 用户修改了素材 / 背景 / prompt 后
- 用户说"同步设计资源"、"检查资源一致性"
- 用户将新素材放入 `design/` 目录后

---

## 概念

```
design/                    ← 档案馆（归档）
project/public/            ← 施工现场（代码引用的素材）
project/src/data/prompts/  ← 施工现场（代码使用的 prompt）
```

改了一边 → 必须同步另一边。

---

## 一、扫描差异

对比路径对：

| 档案馆 | 施工现场 |
|--------|---------|
| `design/背景/` | `project/public/` 背景文件 |
| `design/角色/` | `project/public/` 角色文件 |
| `design/UI/` | `project/public/` UI 素材 |
| `design/prompt/` | `project/src/data/prompts/` |

对比方式：文件名 + 修改时间。prompt 类文件额外对比内容摘要。

---

## 二、报告差异

列出一致 / 不一致的资源，并给出同步建议。

询问用户同步方向：
- **档案馆 → 施工现场**（新素材入库）
- **施工现场 → 档案馆**（代码侧更新了素材）
- **逐个确认**（两边都有改动）

---

## 三、执行同步

**新素材入库**（design/ → project/）：
1. 复制到 `project/public/` 或 `project/src/`
2. 提醒用户在代码中添加引用

**代码侧更新**（project/ → design/）：
1. 复制回 `design/` 对应目录
2. prompt 文件从 `src/data/prompts/` 导出到 `design/prompt/`

**两边冲突**：
1. 列出差异
2. 用户选择保留哪个

---

## 四、确认

同步完成后列出所有执行的操作，确认两边一致。
