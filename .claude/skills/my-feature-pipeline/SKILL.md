---
name: my-feature-pipeline
description: "新功能开发全流程流水线。当用户说'新增功能'、'加个功能'、'实现XX功能'、'做个新功能'、'增加XX'、'添加功能'、'开发新功能'、'加一个XX'、'我想要XX功能'、'能不能加个XX'时触发。覆盖规划→编码→测试→收尾全阶段。"
---

# /my-feature-pipeline — 新功能流水线

> 将功能需求从构想变为可验证的上线代码。规划 → 编码 → 质量检验 → 收尾。

**核心原则**：
- 不写代码之前，先有完整 checklist 和用户确认
- 每一步在 feature-progress 文件中打勾
- 质量检验不可跳过
- 发现问题就修，直到所有检查项 pass

---

## 触发后：读取上下文

先执行（不需要用户确认）：

1. Read `progress.md`
2. Read `PLAN.md`
3. Read 相关的 `design/*/output/` 文件（根据功能涉及的领域）
4. Read 本 skill 目录下的 `gotchas.md`

然后进入阶段一。

---
---

## 阶段一：规划

### 评估规模

**大功能**（满足任一）：
- ≥3 个文件改动
- 新建页面或组件
- 涉及 store 改动
- 前后端都要改

**小功能**：1-2 个文件，样式 / 文案 / 简单逻辑。

### 规划路径

- **大功能** → 调用 `/my-agent-team-planner` 规划分工 → 明确职责、文件范围、依赖、执行顺序
- **小功能** → 直接列出改动计划，单线程完成

### 创建 Feature Progress 文件

在根目录创建 `feature-progress-{功能名}.md`。

Read `references/checklist-template.md` 获取模板，但**根据规模智能裁剪**：

**必须包含**（所有功能）：
- 功能描述（用户原话 + 你的理解）
- 实现 Checklist（具体到改哪个文件的什么）
- 验收标准

**按需包含**：

| 章节 | 需要 | 省略 |
|------|------|------|
| 架构影响 | 新页面、新系统、store/API | 改样式 / 文案 |
| 影响范围表 | ≥3 文件 | ≤2 文件 |
| 单元测试项 | 逻辑 / 数据 / 状态 | 纯样式 / 纯文案 |
| 视觉验证项 | UI 改动 | 纯逻辑 |
| 回归测试项 | 共享组件 / 全局样式 / store | 单组件内部 |
| 问题记录表 | 大功能 | 小功能 |

> checklist 详细程度与功能复杂度成正比。改 CSS 颜色 = 5 行，新建页面 = 30 行。

### 更新项目文件

- `PLAN.md`：添加功能条目，状态 `进行中`
- `progress.md`：记录功能开始

### 等待确认

向用户展示功能名、规模判定、改动范围、checklist 预览、测试计划。

**必须等用户确认后才进入阶段二。**

---
---

## 阶段二：编码

### 安全点

```bash
git add -A && git commit -m "checkpoint: before feature [功能名]"
```

### 加载 Skill

涉及前端新页面 / 重大视觉改动 → 先加载 `frontend-design`。

### 逐步实现

按 checklist 顺序：
1. 实现一个子任务
2. 在 feature-progress 中打勾 `[x]`
3. 大功能 + agent team → 按规划 spawn 并行开发
4. 继续下一个

### 本地验证

```bash
cd project && npm test && npm run lint && npm run build
```

三个全通过 → 进入阶段三。失败 → 先修复。

---
---

## 阶段三：质量检验

**调用 `/check`。** 它会自动根据改动范围选择轻量 / 完整模式。

`/check` 发现问题 →
1. 记录问题
2. 修复（多个问题可用 `/ralph-loop` 迭代）
3. 重新 `/check`

---
---

## 阶段四：收尾

### 提交

```bash
git add [具体文件] && git commit -m "feat: [功能描述]"
```

不自动 push。

### 更新项目文件

- `progress.md` — 记录完成 + 日期
- `PLAN.md` — 标记 `已完成`

### 清理

删除 `feature-progress-{name}.md`。用户要保留则归档到项目圣经。

### 汇报

向用户展示：完成情况、改动文件列表、commit 信息。
询问：需要部署吗？

### 记录踩坑经验

遇到了"试 A 不行改用 B"的情况 → 检查 `gotchas.md` 是否已有 → 没有则追加。
没遇到新问题 → 跳过。

---
---

## 批量模式

用户一次提多个功能：
1. 每个功能独立创建 feature-progress 文件
2. 按优先级 / 依赖关系排序
3. 无依赖 → agent team 并行；有依赖 → 串行
4. 每个功能独立走完四阶段
5. 最后统一汇报

---

## 与其他 Skill 的关系

- 质量检验 → `/check`（不自行编排 /review + /qa）
- 前端新页面 / 重大视觉改动 → `frontend-design`
- 设计变更应用 → `/apply-design`
- 其他规则遵守项目 CLAUDE.md
