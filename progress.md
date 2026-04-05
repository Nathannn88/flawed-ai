# 项目进度追踪

> **⚠️ 以下内容基于旧版"AI 诗人应用"，项目已转向"AI 宠物艺术教育游戏"。**
> **权威设计来源：`design/项目主旨.md`**

> 每次有重要进展时更新。新 session 启动时首先阅读本文件。

---

## 当前状态

**版本**：v2 重构
**阶段**：角色重写 + Landing UI 重设计完成，进入代码重构阶段
**最后更新**：2026-03-22

---

## v2 已完成

- [x] 项目目录重构：代码移入 `project/`，文档留在根目录
- [x] 设计文档体系重建：`项目圣经.md` + `角色资料/` + `视觉参考/`
- [x] 项目圣经 v1 完成（8 个章节全部填充）
- [x] 创建 `my-update-design-doc` skill（项目级，`.claude/skills/`）
- [x] 角色 Prompt 全面重写：栖迟/谱渊 → 诗人/异质世界（system-prompt / intro-prompt / event-prompts）
- [x] 事件系统文本重写：四个事件的对话内容匹配新角色设定
- [x] Landing Page UI 重写为 Haven 暖色风格（金色渐变 + 磨砂玻璃导航 + 圆角按钮）
- [x] Tailwind 暖色系 tokens 添加（warm/dawn/earth 色系）
- [x] 全局清除旧术语引用（栖迟/谱渊/谱织师/谱弦）
- [x] 跳过 Intro 功能：Landing 跳过按钮 + IntroFlow 跳过 + URL 参数 `?skip=true`
- [x] 删除 4 个废弃 Landing 组件（EntrySection/GrowthTimeline/MissionSection/PenguinShowcase）
- [x] 245 tests 全部通过，0 lint errors，build 成功

## v2 进行中

- [ ] 3D 模型增强：诗人低多边形人物 + 宠物变形动画 + 粒子效果
- [ ] CLAUDE.md / PLAN.md 对齐项目圣经
- [ ] Chat 页面 UI 改进（暖色→暗色过渡更平滑）

## v2 待做

- [ ] 系统设计细化：航程燃料公式、火种生成规则、失速阈值
- [ ] 终局细化：双结局的完整演出流程
- [ ] 代码重构（基于新设计，伴生体系统等）
- [ ] 设计文档更新（design-system.md / tailwind-tokens.md 匹配新世界观）

---

## v1 存档

> v1 基于旧角色"栖迟"，已全部完成。代码保留在 `project/` 下，设计文档存档在 `设计文档/角色资料/v1-旧版角色设计/` 和 `设计文档/视觉参考/v1-旧版UI设计/`。

- Phase 0：项目初始化 — `ecf34fd`
- Phase 1：角色设计（栖迟）— `aa20ea4`
- Phase 1.5：UI 视觉设计 — `aa20ea4`
- Phase 2：核心系统（100 tests）— `aa20ea4`
- Phase 3：前端实现 — `178e09e`
- Phase 4：系统集成（152 tests）— `3a02ae5`
- Phase 5：打磨优化 — `c8a9446`

---

## 部署信息

- **GitHub**：https://github.com/Nathannn88/flawed-ai
- **Vercel**：https://flawed-agent.vercel.app
- **注意**：v1 部署版本，v2 完成后需重新部署
