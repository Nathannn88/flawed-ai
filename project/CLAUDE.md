# 代码层

> `project/` 是纯可部署代码。所有设计内容在 `design/`。

---

## ❄️ 当前状态：v1 代码，等待 v2 重构

> `project/` 中现存的是 **v1「AI 诗人聊天应用」的代码**。
> v2 世界观（诗人之像 + 庙宇 + 艺术漂流）**尚未开始编码**。
>
> 因此本文件下方的"模块→设计依赖表"全是 **v1 死引用**（penguin / fuel / spark /
> familiarity / GLM-5 聊天等），仅供 v2 重构时参考结构，**不代表 v2 的代码组织**。
>
> v2 编码启动时：先按 v2 设计重写本表，并解冻根 `CLAUDE.md` 的代码工作流附录。

---

## 技术栈（v1，v2 可沿用部分）

Next.js 14 (App Router) · TypeScript (strict) · Tailwind CSS · Framer Motion · Zustand · Vitest
pnpm · 智谱 GLM-5 · localStorage（无数据库）

> v2 是否仍以 LLM 聊天为核心、是否引入服务端 / 数据库（艺术漂流需要玩家间数据流转），属待定项。

---

## 代码规范（v2 沿用）

```
TypeScript strict · 禁止 any
函数式组件 + Hooks · 禁止 class 组件
文件名：PascalCase（组件）/ kebab-case（工具）
注释中文 · 变量名英文
禁止 console.log 留在生产代码
核心模块必须有单元测试
npm 命令在 project/ 下运行
```

---

## 模块→设计依赖表（⚠️ v1 死引用，仅供参考）

> 下表对应的设计文件（如 `企鹅设定.md`）多已不存在或被 v2 取代。v2 重构时整体重写。

| 代码模块（v1） | 当时依赖的设计 |
|---------|------------------|
| `src/data/prompts/system-prompt.ts` | `诗人设定.md` + `世界观.md` |
| `src/data/prompts/event-prompts.ts` | `事件剧本.md` |
| `src/lib/familiarity.ts` · `gold-system.ts` · `fuel-system.ts` · `spark-system.ts` | v1 `系统机制.md` |
| `src/lib/penguin-system.ts` | v1 企鹅设定（v2 已改为"宠物 = 诗人宠物后代"） |
| `src/lib/event-system.ts` · `ending-system.ts` | v1 `系统机制.md` + `世界观.md` |
| `src/components/` + `tailwind.config.ts` | `design/style/` |
| `src/store/gameStore.ts` | v1 `系统机制.md` |
