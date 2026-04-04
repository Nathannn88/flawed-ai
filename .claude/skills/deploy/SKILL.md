---
name: deploy
description: "部署流程。将 project/ 同步到 vercel-deploy/v1/ 并验证构建。用户说'部署'、'推送'、'上线'、'同步到vercel'时触发。"
---

# /deploy — 部署流程

> 将代码从开发目录同步到部署目录，验证构建，等用户确认后 push。

---

## 触发

用户说"部署"、"推送"、"上线"、"同步到 vercel"

---

## 前置

如果本次 session 还没跑过 `/check` → 先跑。未通过则停止部署。

---

## 一、同步文件

`project/` → `project/vercel-deploy/v1/`

同步内容：

```
src/               全部源代码
public/            静态资源
package.json       依赖声明
pnpm-lock.yaml     锁文件
tailwind.config.ts
next.config.mjs
postcss.config.mjs
tsconfig.json
tests/             测试文件
vitest.config.ts   测试配置
```

确保目标与源完全一致（删除目标中多余的文件）。

---

## 二、验证构建

在 `project/vercel-deploy/v1/` 下：

```bash
pnpm install && npm run build
```

失败 → 排查 → 修复 → 重新同步 → 重试。

---

## 三、等待确认

向用户展示同步结果和改动摘要。

**必须等用户明确确认后才 push。**

---

## 四、Push 并验证

1. `git add` vercel-deploy/v1/ 改动
2. `git commit -m "deploy: sync to vercel"`
3. `git push`（再次确认）
4. 等 Vercel 部署完成
5. WebFetch 或 `/canary` 验证线上

---

## 参考

| 项目 | 地址 |
|------|------|
| GitHub | https://github.com/Nathannn88/flawed-ai |
| Vercel | https://flawed-agent.vercel.app |
| 部署目录 | `project/vercel-deploy/v1/` |
