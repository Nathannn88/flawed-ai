# 代码层

> project/ 是纯可部署代码。所有设计内容在 `design/` 中。

---

## 技术栈

Next.js 14 (App Router) · TypeScript (strict) · Tailwind CSS · Framer Motion · Zustand · Vitest
pnpm · 智谱 GLM-5 · localStorage（无数据库）

**GLM-5 API**：`POST https://open.bigmodel.cn/api/paas/v4/chat/completions`
`model: "glm-5"` · `temperature: 0.8` · `max_tokens: 1024` · `stream: true` · 最近 20 轮 · 错误用中文提示

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

---

## 模块→设计依赖表

| 代码模块 | 依赖的设计 output |
|---------|------------------|
| `src/data/prompts/system-prompt.ts` | `design/character/诗人设定.md` + `design/story/世界观.md` |
| `src/data/prompts/intro-prompt.ts` | `design/character/诗人设定.md` |
| `src/data/prompts/event-prompts.ts` | `design/story/事件剧本.md` |
| `src/lib/familiarity.ts` | `design/system/系统机制.md` |
| `src/lib/event-system.ts` | `design/system/系统机制.md` + `design/story/事件剧本.md` |
| `src/lib/gold-system.ts` | `design/system/系统机制.md` |
| `src/lib/penguin-system.ts` | `design/character/企鹅设定.md` + `design/system/系统机制.md` |
| `src/lib/fuel-system.ts` | `design/system/系统机制.md` |
| `src/lib/spark-system.ts` | `design/system/系统机制.md` |
| `src/lib/ending-system.ts` | `design/system/系统机制.md` + `design/story/世界观.md` |
| `src/components/` + `tailwind.config.ts` | `design/style/` |
| `src/store/gameStore.ts` | `design/system/系统机制.md` |
