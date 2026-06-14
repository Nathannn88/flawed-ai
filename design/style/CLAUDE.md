# 视觉风格

> 定义视觉层的一切。未来代码中的 Tailwind 配置与组件样式必须与此一致。

---

## 职责范围

配色系统、排版规范、动画方向、设计 token、UI 组件样式、庙宇 / 上贡者 / 材料的视觉表达。

> ⚠️ 本子项目当前**优先级较低**：v2 世界观与系统机制定稿后再大改视觉。
> 现有 `design-system.md` / `tailwind-tokens.md` 多为 v1 产物，待 v2 重新生成。

## 上游依赖

- `design/项目主旨.md` — 最高权威
- `design/character/诗人设定.md`、`design/character/宠物设定.md` — 视觉需反映角色气质
- `design/story/世界观.md` — Art 岛与庙宇的视觉氛围

## 下游影响

- *（未来 v2 编码阶段）* `project/tailwind.config.ts`、`src/app/globals.css`、`src/components/`
  —— 当前 v2 无代码；重点是届时 `tailwind.config.ts` 必须与 `tailwind-tokens.md` 同步

## 更新规则

改了视觉规范后：
1. 与 `项目主旨.md` 及角色 / 世界观气质核对一致
2. 视觉风格应服务于 v2 设定，避免沿用 v1 旧方向
3. 禁止 AI 通用审美（Inter / Roboto · 紫色渐变白底）

## 设计文稿

- `视觉风格.md` — 核心视觉方向
- `design-system.md` — 完整视觉设计系统（⚠️ v1 产物，待 v2 重写）
- `tailwind-tokens.md` — Tailwind token 定义（⚠️ v1 产物，待 v2 重写）
