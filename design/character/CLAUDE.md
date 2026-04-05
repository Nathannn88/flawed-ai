# 角色设计

---

## 职责范围

诗人人格、审美偏好、记忆系统、视角转变。
宠物的形态、成长弧线、AI 功能承载、能量机制。

## 上游依赖

- `design/story/世界观.md` — 角色的叙事背景与阶段结构
- `design/项目主旨.md` — 最高权威

## 下游影响

- `design/style/` — 视觉风格需要反映角色气质
- `project/src/data/prompts/system-prompt.ts` — 诗人的语言风格和行为规则
- `project/src/data/prompts/intro-prompt.ts` — 引导关卡的对话设计
- `project/src/components/companion/` — 宠物视觉

## 更新规则

改了角色设定后：
1. 检查 `style/` 的视觉风格是否需要调整
2. 告诉 Claude 应用变更到代码

## 设计文稿

- `诗人设定.md` — 人格、审美、记忆系统、视角转变
- `宠物设定.md` — 形态、弧线、AI 功能、能量机制

## output

加工产出（Claude 按要求生成），代码可直接引用。
