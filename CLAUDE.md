# Flawed AI — 有缺陷的AI

> 一款以提升用户艺术感知能力为核心目标的 **AI 宠物艺术教育游戏**。

---

## 基本规则

**语言**：所有交互使用中文。Commit message 用英文。

**安全红线**：
- 禁止访问 `D:\保存文件\claude库\` 目录以外的任何文件（Obsidian 除外）
- 禁止自动 git push — 必须用户确认
- API 密钥通过 `.env.local` 引用，禁止硬编码

**Session 启动**：每次新开对话，执行 `/startup`。

---

## 项目结构

```
flawed-ai/
├── CLAUDE.md / PLAN.md / progress.md    ← 项目管理
├── design/                               ← 设计层（Obsidian 编辑，详见 design/CLAUDE.md）
│   ├── story/                            ← 世界观、事件剧本
│   ├── character/                        ← 诗人设定、企鹅设定
│   ├── style/                            ← 视觉风格、设计 token
│   ├── system/                           ← 系统机制、产品流程
│   └── v1-archive/                       ← 旧版归档
└── project/                              ← 可部署代码（详见 project/CLAUDE.md）
    ├── src/                               ← app / components / data / hooks / store / lib / types
    ├── public/                            ← 静态资源
    ├── tests/                             ← 测试
    └── vercel-deploy/v1/                  ← 部署副本（/deploy 管理）
```

**工作流方向**：`design/（Obsidian 编辑）→ project/（Claude 实现）→ Vercel（部署）`

---

## 开发工作流

```
用户编辑设计 → /apply-design → 编码 → /check → commit → /deploy（用户要求时）
```

**应用设计变更**
→ 用户在 Obsidian 修改 design/ 设计文稿 → 告诉 Claude "读取更新" → `/apply-design`

**大功能**（≥3 文件 / 新页面 / 新系统）
→ 讨论方案 → 更新 PLAN.md → 用户确认 → `/my-feature-pipeline`

**小改动**（≤2 文件，样式 / 文案 / 简单逻辑）
→ 直接编码 → `/check` → commit

**修 Bug**
→ 同一问题改 >2 次未解决则必须 `/investigate` → 修复 → `/check` → commit

### 核心规则

1. **编码完成后必须调用 `/check`** — 不可跳过，不需要用户提醒
2. 用户说"读取更新"或"应用设计"时调用 `/apply-design`
3. 用户说"部署"时调用 `/deploy`
4. 先在 localhost:3000 验证，不推到线上

---

## Skill 调用表

| 时机 | Skill |
|------|-------|
| 新对话启动 | `/startup` |
| 应用设计变更 | `/apply-design` |
| 编码完成 | `/check` |
| 部署上线 | `/deploy` |
| 新功能开发 | `/my-feature-pipeline` |
| 新建页面 / 重大视觉改动 | `frontend-design`（先加载再编码） |
| 调试 | `/investigate` |
| 视觉审计 | `/design-review` |

> **frontend-design**：新建页面或重大视觉改动时加载。改一行 CSS 不需要。
> 禁止 AI 通用审美（Inter / Roboto · 紫色渐变白底）。

---

## gstack

**可用 skills**：

| 类别 | Skills |
|------|--------|
| 代码质量 | `/review` · `/investigate` |
| 测试 | `/qa` · `/qa-only` · `/benchmark` |
| 浏览器 | `/browse` |
| 安全模式 | `/careful` · `/freeze` · `/guard` · `/unfreeze` |
| 视觉 | `/design-review` |
| 发布 | `/canary` · `/document-release` · `/ship` |

**项目规则**：
- 浏览器操作用 `/browse`，不用 MCP
- `/review` + `/qa` 由 `/check` 编排
- `/ship` 的 push 步骤必须等用户确认

---

## Git

- 格式 `type: english description` — feat / fix / style / refactor / test / docs / chore
- 大改动前 `checkpoint: description`
