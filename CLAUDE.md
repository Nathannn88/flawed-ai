# 项目：有缺陷的AI (Flawed AI)

## 语言要求
本项目所有交互、输出、汇报必须使用**中文**。

## Session 启动规则
每次新打开此项目时，按顺序执行：
1. 阅读 `progress.md` — 当前进度与未完成工作
2. 阅读 `PLAN.md` — 功能路线图与待做清单
3. 在 `project/` 下运行 `npm test` 确认测试状态
4. 向用户汇报当前状况并询问下一步

> `progress.md` 是跨 session 衔接的核心文件，每次有重要进展时更新。
> 所有设计细节以 `project/设计文档/项目圣经.md` 为唯一来源。

## 安全红线
- 禁止访问 `D:\保存文件\claude库\` 目录以外的任何文件（Obsidian 笔记操作除外）
- 禁止自动 git push（push 必须用户确认）
- API 密钥通过 `.env.local` 引用，禁止硬编码

---

## 项目简介

一个拥有独特人格、鲜明审美立场与完整成长结构的 **AI 诗人应用**。

核心特征：
- 明确的审美倾向，不完全迎合用户
- 具有使命与终局，存在不可逆选择
- 满足精神与审美需求，而非效率需求

> 它是一次可终止的审美训练仪式。

详细设定见 `project/设计文档/项目圣经.md`。

---

## 项目结构

```
flawed-ai/
├── CLAUDE.md                          # 项目规则（本文件）
├── PLAN.md                            # 功能路线图 + 待做清单
├── progress.md                        # 跨 session 进度追踪
│
├── design/                            # 设计素材（用户投放区）
│   ├── 角色/                          # 角色立绘、模型、参考图
│   ├── 背景/                          # 场景背景图、环境素材
│   ├── UI/                            # UI 截图、配色参考、图标
│   └── 其他/                          # 音效、字体等其他素材
│
└── project/                           # Next.js 项目代码
    ├── 设计文档/
    │   ├── 项目圣经.md                # 唯一设计来源
    │   ├── 角色资料/                  # 角色设定文档
    │   └── 视觉参考/                  # 设计规范文档
    │
    ├── src/
    │   ├── app/                       # 页面与 API 路由
    │   ├── components/                # UI 组件
    │   ├── data/prompts/              # Prompt 模板（.ts）
    │   ├── hooks/                     # React Hooks
    │   ├── store/                     # Zustand 状态管理
    │   ├── lib/                       # 工具函数与系统逻辑
    │   └── types/                     # TypeScript 类型定义
    │
    ├── public/                        # 静态资源（构建后的图片/字体）
    ├── tests/                         # 测试
    ├── vercel-deploy/v1/              # Vercel 部署目录
    └── package.json
```

---

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 14（App Router） |
| 语言 | TypeScript（strict） |
| 样式 | Tailwind CSS + Framer Motion |
| 状态管理 | Zustand |
| AI 模型 | 智谱 GLM-5 |
| 包管理器 | pnpm |
| 测试 | Vitest + React Testing Library |
| 数据持久化 | localStorage + JSON 导入/导出（无数据库） |

### 环境变量（`project/.env.local`）
```
GLM_API_KEY=（见 .env.local）
GLM_API_URL=https://open.bigmodel.cn/api/paas/v4/chat/completions
GLM_MODEL=glm-5
```

### GLM-5 API
- 端点：`POST https://open.bigmodel.cn/api/paas/v4/chat/completions`
- 参数：`model: "glm-5"`, `temperature: 0.8`, `max_tokens: 1024`, `stream: true`
- 对话历史发送最近 20 轮
- 错误处理：友好中文提示，不暴露技术细节

---

## 开发工作流

### 阶段总览
```
设计共创（人机一起定方案）→ 产出设计文档/素材
    ↓
编码实现（按功能逐步写代码）
    ↓
gstack 检验（/review → /qa，不可跳过）
    ↓
部署（同步 vercel-deploy → push → 验证线上）
```

### 设计共创阶段
当用户提出新的大功能或视觉改动时，先进入设计阶段：
1. 与用户讨论方案（角色设定、剧情走向、UI 风格等）
2. 产出设计文档，更新到 `project/设计文档/` 对应子目录
3. 如果涉及视觉改动，建议用户提供参考图放到 `design/` 目录
4. 设计方案确定后，更新 PLAN.md 记录要实现的功能点
5. 用户确认后才进入编码阶段

### design/ 目录规则
`design/` 是设计资源的**统一管理中心**，不直接参与构建。项目运行时读取 `project/public/` 和代码中的引用。

**目录职责：**
```
design/
├── 角色/          # 角色立绘、模型、参考图
├── 背景/          # 场景背景图、环境素材
├── UI/            # 配色方案、图标、UI 截图、字体
├── prompt/        # 当前在用的 system prompt、event prompt 等文本备份
└── 其他/          # 音效、动画参考等
```

**同步规则（design/ ↔ project/）：**
- `design/` 是"档案馆"，`project/` 是"施工现场"
- 代码中实际使用的素材存放在 `project/public/`，prompt 在 `project/src/data/prompts/`
- 每次修改了 UI 素材、背景、prompt 等设计资源，**必须同步更新 `design/` 对应文件**，保持档案馆与施工现场一致
- 用户说"把背景换成 XX"时：先在 `design/背景/` 放入/替换文件 → 复制到 `project/public/` → 更新代码引用 → /review → /qa
- 用户说"改 prompt"时：修改 `project/src/data/prompts/` 中的代码 → 同步文本备份到 `design/prompt/`

**新素材入库流程：**
1. 用户将素材放入 `design/` 对应子目录
2. 主动扫描识别新增文件，告知用户
3. 复制到 `project/public/` 或 `project/src/` 对应位置
4. 在代码中引用
5. 更新 `design/` 中的备份保持同步

**Session 启动时：** 如果 `design/` 与 `project/` 中的资源不一致，主动提醒用户。

### 新功能流程
无论需求来源是用户口头描述还是文件，都严格按以下步骤：

```
1. 更新 PLAN.md — 添加功能，标注优先级和影响范围
2. 更新 progress.md — 记录功能开始开发
3. 用户确认计划后，开始编码
4. 编码完成后执行质量链（硬性规则，不可跳过）：
   - npm test → npm run lint → npm run build
   - /review（代码审查）
   - /qa（本地浏览器测试 localhost:3000）
5. 全部通过后 git commit
6. 更新 progress.md 记录完成
7. 等用户说"部署"再同步到 vercel-deploy/v1/
```

> **硬性规则：任何代码改动——无论大小、无论来源——编码完成后必须执行 /review → /qa 质量链。这是不可跳过的强制步骤，不需要用户提醒。即使用户只是口头说"改一下 XX"，改完后也必须走质量链。**

### 大功能 vs 小改动
- **大功能**（新页面、新系统、多文件改动）：建议用户写"新增功能.md"放在根目录，Claude 读取后系统性实施。完成后删除该文件。
- **小改动**（改样式、改文案、修 bug）：用户直接说即可，CLAUDE.md 规则保证走 gstack 检验。

### 修 bug 流程
```
1. /investigate（系统化定位根因）
2. 更新 PLAN.md 记录 bug 和修复方案
3. 修复代码
4. npm test → /review → /qa 验证（不可跳过）
5. git commit
6. 更新 progress.md
```

### 本地测试（替代 push-to-Vercel）
测试时**先在本地验证**，不要推到线上再看：
1. 在 `project/` 下运行 `npm run dev` 启动开发服务器
2. 用 /qa 或 /browse 对 `http://localhost:3000` 进行浏览器测试
3. 测试通过后才执行部署流程

### 部署流程
`project/vercel-deploy/v1/` 是独立的 Vercel 部署副本，与 `project/` 共享代码但独立部署。用户确认当前版本没问题后，才同步到此目录。

用户说"部署"或"推送"时，按以下顺序：
1. 确认 npm test / lint / build 全部通过
2. 将 `project/` 中以下内容同步到 `project/vercel-deploy/v1/`：
   - `src/` — 全部源代码
   - `public/` — 静态资源
   - `package.json` + `pnpm-lock.yaml` — 依赖声明
   - `tailwind.config.ts`、`next.config.mjs`、`postcss.config.mjs`、`tsconfig.json` — 配置文件
   - `tests/`、`vitest.config.ts` — 测试文件
3. 在 `vercel-deploy/v1/` 下运行 `pnpm install && npm run build` 确认部署副本可构建
4. 等用户确认后 push
5. push 后用 /canary 或 WebFetch 验证 https://flawed-agent.vercel.app

---

## gstack 配置

### 可用 skills
/review, /investigate, /qa, /qa-only, /browse, /careful, /freeze,
/guard, /unfreeze, /design-review, /benchmark, /canary,
/document-release, /ship

### 本项目的 gstack 使用规则
- 使用 /browse 进行浏览器操作，不使用 MCP 浏览器工具
- /review 和 /qa 在编码完成后可自动链式执行，无需逐个确认
- /ship 的 push 步骤必须停下来等用户确认
- 部署相关操作遵循上方"部署流程"，不使用 /land-and-deploy 的默认行为

---

## 系统规则速查

> 完整设计见项目圣经。此处仅列关键量化规则供开发参考。

### 熟悉度

| 触发方式 | 计算规则 |
|---------|---------|
| 对话 | 每 100 字 → +0.1% |
| 上限 | 最大 100% |

> 金币**不影响**熟悉度。80% 后熟悉度条转为"航程燃料条"。

### 事件阈值

| 熟悉度 | 事件 |
|--------|------|
| 20% | 事件 A |
| 50% | 事件 B |
| 80% | 事件 C |
| 100% | 终极选择（双结局） |

### 金币（仅趣味层）

- 选项：6 / 32 / 64 / 128 / 328 / 648
- 用途：加速企鹅变形、解锁特殊变形效果、解锁视觉演出
- **不可**：延长时间、增加熟悉度、影响终局

### 终局

100% 时出现选择（无说明文字，不可逆）：
1. **送他离开** → 旁观者结局（企鹅变船，系统结束）
2. **成为他** → 身份转移结局（进入航程燃料/火种/灯塔系统）

### 航程燃料（结局二专属）

| 用户行为 | 燃料变化 |
|---------|---------|
| 忽略企鹅火种 | 下降 |
| 复述火种 | 不变 |
| 创造性转化 | 增长 |

---

## Skill 使用规则

| 场景 | Skill | 要求 |
|------|-------|------|
| 前端页面/组件 | `frontend-design` | 每次编写前端代码前必须先加载 |
| 设计文档更新 | `my-update-design-doc` | 接收设计素材时使用 |
| 代码审查 | `/review`（gstack） | 编码完成后自动执行 |
| 浏览器测试 | `/qa`（gstack） | 代码审查通过后自动执行 |
| 调试 | `/investigate`（gstack） | 遇到 bug 时使用 |
| 视觉审计 | `/design-review`（gstack） | UI 改动后检查视觉一致性 |

### frontend-design 使用要求
1. 编写任何页面/组件前先加载 skill
2. 根据 Design Thinking 框架确定美学方向
3. 禁止 AI 通用审美（Inter/Roboto 字体、紫色渐变白底）

---

## 代码规范

- TypeScript strict，禁止 `any`
- 函数式组件 + Hooks，禁止 class 组件
- 文件名：PascalCase（组件）/ kebab-case（工具）
- 代码注释中文，变量名英文
- 禁止 `console.log` 留在生产代码

### Git 规范
- 格式：`<type>: <简要中文描述>`
- type：`feat` / `fix` / `style` / `refactor` / `test` / `docs` / `chore`
- 禁止自动 git push（必须用户确认）
- 大改动前先 commit 当前状态，message 前缀用 `checkpoint:`

### 测试规范
- 核心模块必须有单元测试
- 命令在 `project/` 目录下运行：`npm test` / `npm run build` / `npm run lint`

---

## 运行规则

- 每阶段完成后：`npm test` → `npm run lint` → `npm run build`
- 每个功能完成后 git commit
- 任务反复失败（>3次）→ 用 /investigate 定位根因，不要继续盲试
- `progress.md` 每次重要进展都必须更新
