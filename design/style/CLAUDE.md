# 视觉风格

---

## 职责范围

配色系统、排版规范、动画方向、设计 token、UI 组件样式。
这里定义视觉层面的一切——代码中的 Tailwind 配置和组件样式必须与此一致。

## 上游依赖

- `design/character/output/诗人设定.md` — 视觉风格需要反映角色气质
- `design/story/output/世界观.md` — 异世界的视觉氛围

## 下游影响

- `project/tailwind.config.ts` — 必须与 `tailwind-tokens.md` 中的 token 一致
- `project/src/app/globals.css` — 全局样式
- `project/src/components/` — 所有组件的视觉实现
- `project/src/components/landing/` — Landing 页面视觉

## 更新规则

改了视觉规范后：
1. 告诉 Claude 应用变更到代码
2. 重点检查 `tailwind.config.ts` 和 `globals.css` 是否同步

## output 文件

- `视觉风格.md` — 核心视觉方向
- `design-system.md` — 完整视觉设计系统（配色、排版、组件模式）
- `tailwind-tokens.md` — Tailwind CSS token 定义
