# Plan: 修复空间与输入 negative 盲测缺陷

**复杂度**：中

## 概述

修复当前三房间原型中两个已由独立盲测稳定复现的问题：上层覆盖层未隔离待甄选方向键，以及门洞碰撞使用步进终点而非边界交点。先增加执行真实页面处理器的 RED 行为测试，再修改 `index.html`，完成全量回归和一次独立 negative 定点复验。

## 需求复述

- **目标**：已确认的 HIGH／MEDIUM finding 清零，当前机械测试与独立 negative 盲测不再出现功能失败。
- **假设**：保留单文件 Three.js 原型架构、零新依赖、双击可运行；覆盖层优先级高于甄选，甄选高于世界移动；门洞阈值仍为 `3.15`。
- **待澄清**：无。用户已明确要求直接修改到盲测通过。

## 要模仿的惯例

| 类别 | 来源 | 惯例 |
|---|---|---|
| 命名与状态 | `prototype/temple-mvp/index.html:1355` | 使用小型具名函数和 `state` 布尔状态集中判断输入阻塞 |
| 输入处理 | `prototype/temple-mvp/index.html:1994` | document 级 `keydown/keyup` 统一分发甄选、关闭与移动 |
| 碰撞处理 | `prototype/temple-mvp/index.html:1370` | 在灵体位置提交前原地校正候选 `next` |
| 测试 | `prototype/temple-mvp/tests/index-contract.test.cjs:1` | Node 内置 `node:test`、`assert/strict`，测试从原型目录读取当前页面 |
| 负向证据 | `tmp/blind-test/20260730-temple-spatial/negative/negative-probes.cjs:1` | 从当前 `index.html` 提取真实函数体执行，不复制产品逻辑 |

## 涉及文件

| 文件 | 动作 | 原因 |
|---|---|---|
| `prototype/temple-mvp/tests/index-behavior.test.cjs` | 新建 | 永久覆盖输入优先级与连续边界碰撞 |
| `prototype/temple-mvp/index.html` | 修改 | 修复覆盖层事件顺序与门洞交点判断 |
| `.agent/long-task/STATE.md` | 修改 | 保存修复、验证结果与恢复入口 |
| `记录/进度.md` | 修改 | 更新当前原型裁定 |
| `记录/决策与活动日志.md` | 追加 | 记录修复与复验活动 |

## 任务拆解

### 任务 1：建立 RED 行为测试

- **做什么**：增加实际执行当前键盘处理器与碰撞函数的测试矩阵。
- **预期 RED**：检视器／记忆空间／对话开启时左右方向键仍调用 finalize；门洞边缘斜向跨越仍被放行。
- **验证**：`node --test prototype/temple-mvp/tests/index-behavior.test.cjs`

### 任务 2：修复覆盖层输入优先级

- **做什么**：先处理 Escape；上层覆盖层存在时消费导航键并提前返回；仅无上层覆盖层时允许待甄选左右键；世界移动继续受统一门禁控制。
- **模仿**：现有 document 级事件分发，不新增第三方状态库。
- **验证**：行为测试中检视、记忆空间、对话、正常甄选和移动恢复全部通过。

### 任务 3：修复连续边界碰撞

- **做什么**：计算移动线段与 `z=-10/-26` 的交点横坐标，以交点是否落在门洞内决定放行或阻挡。
- **模仿**：保持现有 `applyPassageCollision(previous,next)` 原地校正接口。
- **验证**：两道门、双向、中央通过、外墙直穿、门沿斜穿矩阵全部通过。

### 任务 4：全量回归与独立定点盲测

- **做什么**：运行全部测试、脚本解析、差异检查；再由一名隔离上下文 negative reviewer 只验证修复点及最相关回归。
- **验证**：

```powershell
node --test prototype/temple-mvp/tests/*.test.cjs
node --check prototype/temple-mvp/game-rules.js
node --check prototype/temple-mvp/content-catalog.js
git diff --check
```

## 风险

| 风险 | 可能性 | 缓解 |
|---|---:|---|
| 覆盖层关闭后方向键不恢复 | 中 | 正常甄选与世界移动恢复都进入行为测试 |
| 只修第一道门或单向移动 | 中 | 两边界 × 双方向矩阵 |
| 测试复制实现后形成同错 | 中 | 测试提取并执行当前页面真实函数体 |
| 静态通过被误写成视觉通过 | 高 | 浏览器不可用时视觉与真实动态继续单列 `BLOCKED` |

## 验收清单

- [x] RED 测试稳定复现两个 finding
- [x] 输入优先级测试全部通过
- [x] 两道门连续碰撞矩阵全部通过
- [x] 全量自动测试与脚本检查通过
- [x] 独立 negative 定点盲测无 FAIL／WARNING
- [x] 项目状态与证据同步
