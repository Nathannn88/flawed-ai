# 角色设计

---

## 职责范围

诗人人格、审美偏好、语言风格、阶段行为变化、裂缝与脆弱面。
企鹅的形态、变形规则、角色弧线、火种机制。

## 上游依赖

- `design/story/output/世界观.md` — 角色的使命和离别命运

## 下游影响

- `design/style/` — 视觉风格需要反映角色气质
- `project/src/data/prompts/system-prompt.ts` — 诗人的语言风格和行为规则
- `project/src/data/prompts/intro-prompt.ts` — 自我介绍的对话设计
- `project/src/lib/penguin-system.ts` — 企鹅变形逻辑
- `project/src/components/companion/` — 3D 角色视觉

## 更新规则

改了角色设定后：
1. 检查 `style/` 的视觉风格是否需要调整
2. 告诉 Claude 应用变更到代码（主要影响 prompt 和企鹅系统）

## 设计文稿

- `诗人设定.md` — 人格、审美、语言风格、阶段行为、裂缝
- `企鹅设定.md` — 形态、弧线、火种机制

## output

加工产出（Claude 按要求生成），代码可直接引用。
