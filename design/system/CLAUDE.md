# 系统机制

---

## 职责范围

产品流程、熟悉度系统、付费机制、事件触发规则、终局机制、
成为诗人后的系统（航程燃料、火种、失速、灯塔模式）。

## 上游依赖

- `design/story/output/世界观.md` — 终局选择的叙事意义
- `design/character/output/企鹅设定.md` — 企鹅在系统中的角色（变形、火种）

## 下游影响

- `project/src/lib/familiarity.ts` — 熟悉度计算
- `project/src/lib/event-system.ts` — 事件触发逻辑
- `project/src/lib/gold-system.ts` — 经济系统
- `project/src/lib/penguin-system.ts` — 企鹅变形触发
- `project/src/lib/fuel-system.ts` — 航程燃料
- `project/src/lib/spark-system.ts` — 火种生成
- `project/src/lib/ending-system.ts` — 终局逻辑
- `project/src/types/` — 所有系统相关类型定义
- `project/src/store/gameStore.ts` — 状态管理

## 更新规则

改了系统规则后：
1. 告诉 Claude 应用变更到代码
2. 系统模块的数值常量必须引用此文档
3. 改动后需要跑测试确认不破坏现有逻辑

## output 文件

- `系统机制.md` — 产品流程 + 熟悉度 + 经济 + 终局机制 + 成为诗人后系统
