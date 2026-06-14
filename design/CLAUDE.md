# 设计层

> 所有设计内容的入口。用户在 Obsidian 编辑，Claude 读取后协助细化、结构化、检查一致性。
> **当前项目阶段 = 设计定稿中**，这里是主战场。

---

## 权威文件

`项目主旨.md` 是整个项目的**最高权威**。所有子项目设计文稿必须与它保持一致——
新内容与主旨冲突时，**先提出来，不擅自改主旨也不埋矛盾**。

术语以主旨第十节"术语约定"为准（智慧能量 / 审美能量 / 诗人 / 诗人之像 / 宠物 / 五个孩子）。

---

## 子项目

| 子项目 | 路径 | 职责 |
|-------|------|------|
| 世界观与叙事 | `story/` | 项目哲学、Art 岛传说 vs 真实历史、三阶段结构、艺术漂流愿景 |
| 角色设计 | `character/` | 诗人之像设定、宠物（诗人宠物后代·可变形）设定 |
| 系统机制 | `system/` | 供奉→转化→再创作循环、多媒介载体、智慧能量、付费、社区机制 |
| 视觉风格 | `style/` | 配色、排版、动画、设计 token、UI 组件样式 |

---

## 文件组织

每个子项目下：
- **设计文稿**（`.md`）— 放在子项目根目录，用户在 Obsidian 直接编辑
- **MAP 文件** — Obsidian 导航入口，嵌入 base 展示该子项目所有文件

> 注：早期规划过 `output/` 子目录（用户写完后 Claude 加工成代码可引用格式），
> 但 v2 一直未启用，磁盘上无此目录。待 v2 编码阶段确有需要时再建，当前忽略。

---

## 依赖关系

```
项目主旨.md（最高权威）
  ↓
story（基础层，无上游）
  ├→ character（读世界观来定义角色）
  ├→ system（读世界观 + 宠物设定来定义机制）
  └→ style（受 character / story 的气质影响）
```

改了上游（如 story）后，按各子项目 CLAUDE.md 的"更新规则"检查下游是否需同步。

---

## 更新规则

1. 在对应子项目编辑设计文稿
2. 对 Claude 说"读取更新"或"应用设计"
3. Claude：读变更 → 审慎追问/挑战 → 检查与主旨一致 → 协助细化 → 更新文稿 + `progress.md`

> 当前阶段到此为止（设计协作）。把设计落到代码的 `/apply-design` 属于**未来 v2 编码阶段**，见根 `CLAUDE.md` 冻结附录。

---

## 团队共享（Google Drive）

设计文稿可通过 Google Drive 共享给团队：Obsidian 是 source of truth，Google Docs 是协作镜像。

- 共享范围：设计文档 + 项目主旨（排除所有 `CLAUDE.md` 及代码相关的 `design-system.md` / `tailwind-tokens.md`）
- `_shared-google-drive/`：导出的 `.docx`；`_export-scripts/export-shared.mjs`：导出脚本（剥离 frontmatter / wikilinks / embeds，pandoc 转 docx）
- 导出：`node design/_export-scripts/export-shared.mjs` → 上传 Drive
- 回同步：下载 `.docx` 到 `_shared-google-drive/` → 对 Claude 说"同步 Google Doc" → 自动对比更新

> 单人重启阶段如暂不用团队共享，可忽略本节。

---

## v1 归档

`v1-archive/` 保存 v1 旧版设计（海难诗人 + 荒岛→出海 + 灯塔），仅供参考，不影响当前 v2 开发。
