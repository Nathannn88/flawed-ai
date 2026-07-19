# 代码层（v3 · 最小可玩版）

> 神像供奉游戏的代码实现。当前 = **Phase 2 最小 demo**（见 `../PLAN.md`、`../design/初始版内容指导.md`）。
> 设计权威：`../design/项目主旨.md`。v1 旧版（Next.js 网页应用）已归档在 `v1-archive/`，仅供参考、不复用。

---

## 技术栈

- **Vite + React + TypeScript**，纯客户端（游戏无需 SSR）。
- 部署：可上 Vercel（给团队看用一个链接，零安装）。
- AI 对话（"有缺陷的 AI"）目前**后置**；接 Claude API 时再加 serverless 函数（密钥走 `.env.local`，禁止硬编码）。

## 架构铁律：逻辑与渲染分离

```
src/
  game/   ← 纯逻辑（无 React/DOM）：核心循环的"真资产"，会一直复用
    types.ts       领域类型
    constants.ts   可调参数（时长/组队人数…，源自 初始版内容指导 §6）
    engine.ts      reduce(state, action) 纯状态机 + initialState
  ui/     ← 渲染层（可替换）：当前是 2D 占位(DOM/CSS)
    useGame.ts     逻辑↔React 的唯一桥（订阅/派发/心跳）
    App.tsx        场景渲染（昼/夜）
    styles.css
```

- **改玩法逻辑 → 只动 `game/`**；**换美术表现（2D 占位 → 3D / 预渲染片段 / Live2D）→ 只动 `ui/`**。这条缝是为"先简单后迁移"留的，别让渲染细节渗进 `game/`。
- `game/` 保持纯函数、可重放：id 用 `state.seq` 自增，不在 reduce 里用 `Date.now()`/随机（时间通过 action 的 `now` 传入）。

## 当前已实现的核心循环

白天：召集信众 → 点信众供奉(小麦入绿区) → 信众离开。
夜晚：拾取绿区供品入物品栏 → 点宠物变面包机 → 投小麦 →(50s)→ 成品 → 收取 → 变唱片机播放。

**后置（未做，明确方向）**：AI 对话、信仰值量化、跳过键(开放问题 #2)、各数值最终取值、稀有度、多材料/多成品。

## 运行

```bash
cd project
npm install
npm run dev        # 本地开发
npm run typecheck  # 类型检查
npm run build      # 产物
```

## 规则

- 交互中文、commit message 英文（`feat:`/`fix:`/`chore:`…）。
- **不自动 git push**（须用户确认）。
- 设计有变 → 走 `my-design-sync` 传播；不在代码里擅自改设定。
