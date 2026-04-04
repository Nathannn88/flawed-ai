# 世界观与叙事

---

## 职责范围

项目哲学、异世界背景、使命结构、事件剧本、终局叙事。
这是整个项目的根基层——其他子项目都从这里获取世界观上下文。

## 上游依赖

无。这是最底层的设计子项目。

## 下游影响

- `design/character/` — 角色的使命感和离别命运来自世界观
- `design/system/` — 事件阈值和终局选择的叙事意义来自这里
- `project/src/data/prompts/system-prompt.ts` — 系统 prompt 中的世界观描述
- `project/src/data/prompts/event-prompts.ts` — 事件对话内容
- `project/src/lib/event-system.ts` — 事件定义和触发逻辑

## 更新规则

改了世界观或事件剧本后：
1. 检查 `character/` 的角色设定是否需要同步调整
2. 检查 `system/` 的终局机制是否受影响
3. 告诉 Claude 应用变更到代码

## 设计文稿

- `世界观.md` — 项目本质 + 异世界背景 + 终局叙事
- `事件剧本.md` — 4 个阈值事件的具体内容

## output

加工产出（Claude 按要求生成），代码可直接引用。
