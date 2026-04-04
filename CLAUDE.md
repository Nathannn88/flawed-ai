# Flawed AI — 有缺陷的AI

> 一个拥有独特人格与完整成长结构的 **AI 诗人应用**。
> 详细设定见 `project/设计文档/项目圣经.md`（唯一设计来源，不在此文件重复）。

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
├── design/                               ← 设计素材档案馆（/sync-design 管理）
└── project/                              ← Next.js 代码
    ├── 设计文档/                          ← 项目圣经 + 角色 + 视觉参考
    ├── src/                               ← app / components / data / hooks / store / lib / types
    ├── public/                            ← 静态资源
    ├── tests/                             ← 测试
    └── vercel-deploy/v1/                  ← 部署副本（/deploy 管理）
```

---

## 技术栈

Next.js 14 (App Router) · TypeScript (strict) · Tailwind CSS · Framer Motion · Zustand · Vitest
pnpm · 智谱 GLM-5 · localStorage（无数据库）

**GLM-5 API**：`POST https://open.bigmodel.cn/api/paas/v4/chat/completions`
`model: "glm-5"` · `temperature: 0.8` · `max_tokens: 1024` · `stream: true` · 最近 20 轮 · 错误用中文提示

---

## 开发工作流

```
设计共创 → 编码 → /check → commit → /deploy（用户要求时）
```

**大功能**（≥3 文件 / 新页面 / 新系统）
→ 讨论方案 → 更新设计文档 + PLAN.md → 用户确认 → `/my-feature-pipeline`

**小改动**（≤2 文件，样式 / 文案 / 简单逻辑）
→ 直接编码 → `/check` → commit

**修 Bug**
→ 同一问题改 >2 次未解决则必须 `/investigate` → 修复 → `/check` → commit

### 核心规则

1. **编码完成后必须调用 `/check`** — 不可跳过，不需要用户提醒
2. 设计资源改动后调用 `/sync-design`
3. 用户说"部署"时调用 `/deploy`
4. 先在 localhost:3000 验证，不推到线上

---

## Skill 调用表

| 时机 | Skill |
|------|-------|
| 新对话启动 | `/startup` |
| 编码完成 | `/check` |
| 设计资源变动 | `/sync-design` |
| 部署上线 | `/deploy` |
| 新功能开发 | `/my-feature-pipeline` |
| 新建页面 / 重大视觉改动 | `frontend-design`（先加载再编码） |
| 更新设计文档 | `my-update-design-doc` |
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

## 代码规范

```
TypeScript strict · 禁止 any
函数式组件 + Hooks · 禁止 class 组件
文件名：PascalCase（组件）/ kebab-case（工具）
注释中文 · 变量名英文
禁止 console.log 留在生产代码
核心模块必须有单元测试
npm 命令在 project/ 下运行
```

**Git**：
- 格式 `type: english description` — feat / fix / style / refactor / test / docs / chore
- 大改动前 `checkpoint: description`
