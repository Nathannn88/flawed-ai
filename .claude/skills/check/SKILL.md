---
name: check
description: "质量链。编码完成后调用，自动执行 test/lint/build 并根据改动范围决定是否追加 /review + /qa。触发词：'检查'、'质量检查'、'跑一遍检查'，或编码完成后自动调用。"
---

# /check — 质量链

> 每次代码改动后，根据改动范围决定检查深度，逐步执行直到全部通过。

---

## 触发

- **编码完成后必须调用** — 不可跳过，不需要用户提醒
- 用户说"检查"、"跑一遍"、"check"
- `/my-feature-pipeline` 阶段三调用

---

## 一、判断模式

执行 `git diff --stat`，按改动范围选择模式：

**完整模式** — 满足任一：
- ≥3 个文件
- 涉及逻辑（store / hooks / lib / API）
- 新建了组件或页面
- 改动了共享组件或全局样式

**轻量模式** — 同时满足所有：
- ≤2 个文件
- 纯样式 / 文案 / 配置
- 未涉及逻辑 / 状态 / API

---

## 二、基础检查（两种模式都跑）

在 `project/` 下依次执行：

```bash
npm test && npm run lint && npm run build
```

全部通过 → 继续。任何失败 → 修复 → 重跑。

---

## 三、深度检查（仅完整模式）

1. **`/review`** — 代码审查。发现问题 → 修复 → 重新 review
2. **`/qa`** — 浏览器测试 `http://localhost:3000`（确保 dev server 在运行）
3. **`/browse`** — 快速检查 landing + chat 无明显回归

---

## 四、输出

```
## 质量检查通过

模式：完整 / 轻量 · 改动：N 个文件

  npm test       PASS (X tests)
  npm run lint   PASS
  npm run build  PASS
  /review        PASS / 跳过
  /qa            PASS / 跳过

可以 commit。
```

---

## 失败处理

1. 记录失败原因
2. 修复
3. 从「二、基础检查」重新开始（不是只重跑失败项）
4. 同一问题 >2 次未解决 → 建议 `/investigate`

## 附：progress.md 绑定

检查通过 = 即将 commit。此时判断：
- 本次改动完成了一个功能点 → 提醒更新 progress.md
- 小修复 → 跳过
