# 世界观与叙事

---

## 职责范围

项目哲学、海难背景、阶段结构（荒岛→出海）、事件剧本、社区愿景。
这是整个项目的根基层——其他子项目都从这里获取世界观上下文。

## 上游依赖

- `design/项目主旨.md` — 最高权威

## 下游影响

- `design/character/` — 角色的叙事背景与阶段设定来自世界观
- `design/system/` — 阶段结构与社区机制的叙事意义来自这里
- `project/src/data/prompts/system-prompt.ts` — 系统 prompt 中的世界观描述
- `project/src/data/prompts/event-prompts.ts` — 事件对话内容
- `project/src/lib/event-system.ts` — 事件定义和触发逻辑

## 更新规则

改了世界观或事件剧本后：
1. 检查 `character/` 的角色设定是否需要同步调整
2. 检查 `system/` 的系统机制是否受影响
3. 告诉 Claude 应用变更到代码

## 设计文稿

- `世界观.md` — 项目本质 + 海难背景 + 阶段结构 + 社区愿景
- `事件剧本.md` — 引导关卡、荒岛主线、阶段转变、出海事件

## output

加工产出（Claude 按要求生成），代码可直接引用。
