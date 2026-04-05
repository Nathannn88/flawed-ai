# 设计层

> 所有设计内容的入口。用户在 Obsidian 编辑，Claude Code 读取后实现到 project/。

---

## 权威文件

`项目主旨.md` 是整个项目的最高权威。所有子项目设计文稿必须与此文件保持一致。

---

## 子项目

| 子项目 | 路径 | 职责 |
|-------|------|------|
| 世界观与叙事 | `story/` | 项目哲学、海难背景、阶段结构、社区愿景 |
| 角色设计 | `character/` | 诗人设定、宠物设定（鱼/船心脏） |
| 视觉风格 | `style/` | 配色、排版、动画、设计 token |
| 系统机制 | `system/` | 审美能量、核心合成、面包纹路、付费、社区机制 |

---

## 文件组织

每个子项目下：
- **设计文稿**（.md）— 放在子项目根目录，用户在 Obsidian 直接编辑
- **output/**  — 加工产出，用户工作完后让 Claude 生成代码可直接引用的格式
- **MAP 文件** — Obsidian 导航入口，嵌入 base 展示所有文件

---

## 依赖关系

```
项目主旨.md（最高权威）
  ↓
story（基础层，无上游）
  ├→ character（读取世界观来定义角色）
  ├→ system（读取世界观来定义机制）
  └→ style 间接受 character 影响
```

---

## 更新规则

1. 在对应子项目中编辑设计文稿
2. 修改后告诉 Claude "读取更新" 或 "应用设计"
3. Claude 会执行 `/apply-design`：读取变更 → 识别影响的代码 → 实施

---

## 团队共享（Google Drive）

设计文稿通过 Google Drive 共享给团队协作。Obsidian 是 source of truth，Google Docs 是协作镜像。

### 共享范围

设计文档 + 项目主旨（排除代码相关内容：`design-system.md`、`tailwind-tokens.md`、所有 `CLAUDE.md`）。

### 文件位置

- `_shared-google-drive/` — 导出的 .docx 文件，直接上传到 Google Drive
- `_export-scripts/export-shared.mjs` — 导出脚本

### 工作流

```
导出：Obsidian 编辑 → node design/_export-scripts/export-shared.mjs → 上传到 Drive
回同步：从 Drive 下载 .docx 到 _shared-google-drive/ → 对 Claude 说"同步 Google Doc" → 自动对比更新
```

### 导出脚本做的事

- 剥离 YAML frontmatter、`[[wikilinks]]`、`![[embeds]]`
- 删除视觉风格中的技术文件引用
- 通过 pandoc 转为 .docx

---

## v1 归档

`v1-archive/` 保存旧版设计文件，仅供参考，不影响当前开发。
