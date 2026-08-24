# 长任务连续性账本（滚动热检查点）

- **Task ID：** `2026-07-30-mvp-resonance-collectibles-showcase`
- **Last updated：** `2026-08-04T19:06:07+08:00`
- **Overall status：** `paused`
- **Current milestone：** `PAUSED-AWAITING-M10-VISUAL-ACCEPTANCE`
- **Last verified checkpoint：** 覆盖层／甄选／世界移动输入优先级、可编辑目标隔离和两道门洞连续碰撞均已修复；永久行为测试、完整33/33回归、旧探针、reviewer额外40组空间矩阵与round 2定点续验全部通过，独立negative lane裁定APPROVE；真实浏览器动态与视觉仍BLOCKED
- **Checkpoint reason：** `user-paused-negative-approved-runtime-visual-blocked`
- **Contract alignment：** `confirmed`

## Goal

在当前持续演进的可玩产品原型上实现三房间连通寺庙：白天可在神像与各房间管理员的具身视角间切换，夜晚独立灵体可自由穿行祈愿厅、处理室与陈列室并靠近实体交互；同时保留两材料＋记忆能量、80/20 记忆藏品、左右甄选、夜间背包、展示柜和 360°检视的完整闭环。

## Done

- 已读取最新设计权威、原型实现、README 和 Git 状态。
- 已完成 Pattern Grounding 和详细实现计划。
- 用户已确认资源名、数值、收藏范围和非目标。
- 已建立确认后的长任务契约与里程碑。
- 已新增 `game-rules.js` 与 5 个 Node 规则测试；能量奖励、失败不扣资源和成功原子合成均通过。
- `index.html` 已实现独立能量 HUD、共同合成、收藏品检视和三槽展示柜；README 与两份项目记录已同步。
- 页面契约扩展为 9/9；柜位坐标为 `(0.707,-0.287)`、`(0.573,-0.324)`、`(0.432,-0.363)`，均在 16:9 固定相机视锥内。
- 用户已明确：该实现不再只是 MVP，而是继续演进的可玩产品原型；后续 UI／3D 验收需主动截图、按需录屏并分析画风。
- 已建立 `视觉与交互验收规范.md`，同步项目阶段文档与双宿主 `startup` skill，使下次会话可从真实浏览器验收直接恢复。
- 已全量对齐根、design、project 3 对活动规则；设计子目录由 `design/` 根规则递归覆盖，不恢复已退役副本。
- 已修正素材运行时目标为当前活动原型，并同步 `my-design-sync` 双宿主 4 文件包；validator、哈希与 skill-stocktake 均通过。
- 已对 v1 集中归档修改计划完成一次独立质检：初审发现 3 个实质问题，修订回滚、父目录和引用门禁后定点复检通过。
- 已删除 `project/v1-archive/` 中 2 份 v1 专属规则；100 个旧代码文件、21 个旧设计文件和 18 张旧界面截图共 139 个历史工件已迁入 `记录/v1归档/`，迁移前后哈希一致。
- 已完成三对项目规则零语义瘦身：撤回无净收益的候选 1，按用户批准同步候选 2–5；六个镜像共减少 10 行，镜像与关键语义锚点验证通过。
- 已将本轮复盘确认的“行数代理陷阱”沉淀到全局 `my-slim`：新增 `gotchas.md`、在操作流程前强制读取，更新实时来源清单并同步三镜像；四份 validator、4 个针对性断言、目录哈希与 stocktake 均通过。
- 用户已确认统一记忆藏品新契约；CHARTER、长任务 PLAN 与 STATE 已重校准。
- 最高设计权威及六份下游设计文稿已同步两材料＋一点能量、80/20、左右甄选、夜间多格背包、展示柜策展与四岛配方；根 PLAN、进度和追加式日志已同步，机械验收通过。
- 已新增 UMD 内容目录和新版纯规则；M2 定向测试 13/13、当前全套 17/17。
- 页面契约先得到预期 RED，再完成新版状态机：材料实例、待决结果、记忆藏品和展示柜引用分离；旧 `hasRecord`、对象搬运柜位与单供品唱片链已移除。
- 已实现无倒计时艺术显现、左／右拖拽与键盘／按钮等价入口、归还返两材料不返能量、珍藏写入记忆空间。
- 已实现仅夜间开放的动态多格记忆空间、筛选、排序、详情重开和陈列状态。
- 已实现无名记忆匣、万花筒果实、面包唱片、翻页种子书和榫卯月灯的共享3D模型工厂与360°检视。
- 展示柜保持三槽，以稳定 `memoryItemId` 策展；摆入不会从背包移除，满柜反馈已补齐。
- README、素材对接、视觉验收规范、根PLAN、进度和追加式日志已同步真实实现。
- 最终机械验证为20/20；内联脚本解析通过；活动实现无旧单供品唱片运行时代码残留。
- 浏览器控制面返回 `No browser is available`，发现列表为空；阻塞证据已写入 `tmp/visual-acceptance/20260730-1806/`。
- 用户提供真实结果卡截图并复现底部按钮无响应；截图已纳入报告。父卡片 `setPointerCapture` 根因已修复，新增防回归契约后全套21/21。
- 已按用户指定的寺庙结构图，把固定单厅改为祈愿厅、处理室与陈列室，并用门洞、浅台阶、地坪和地标环建立连续纵深。
- 已新增祈愿厅／处理室／陈列室三名管理员，白天可在神像和三管理员的具身视角间切换，HUD 同步身份与房间。
- 已新增独立灵体，夜晚自动从神像旁显现；支持 WASD／方向键、点击地面、跟随镜头、房间识别、门洞墙柱碰撞和覆盖层输入暂停。
- 供品必须在祈愿厅靠近回收，宠物必须在处理室靠近操作，展示柜及已陈列模型必须在陈列室靠近操作；宠物不再隔空代取。
- 新空间页面契约先4项预期RED，再与既有收藏回归一并达到26/26；新增镜头房间归属与中轴约束测试，内联脚本解析、Three.js能力检查和diff检查通过。
- README、素材对接说明与视觉验收规范已同步三房间、管理员、灵体移动和 AC-V12～AC-V15。
- 已完成一轮 L2／standard 独立 negative 盲测：11项中3 PASS、2 FAIL、6 BLOCKED；主流程重跑精确源码探针后再次复现检视器方向键误提交（HIGH）与门洞边缘斜向穿越（MEDIUM），机读 verdict 校验为 `FAIL`。
- 已将门洞碰撞改为按移动线段与房间边界的交点横坐标裁定，并覆盖两道边界、双向、正负门沿、阈值 ε 与合法单帧斜向移动。
- 已将键盘输入改为“检视／记忆空间／对话 → 待甄选 → 世界移动”的优先级，并保护 `INPUT`、`TEXTAREA` 与 `contenteditable` 的方向键默认行为；Escape 仍逐层关闭覆盖层。
- 新增 `tests/index-behavior.test.cjs`，完整套件33/33；同一独立 reviewer round 2定点续验5/5、0 finding，negative lane由FAIL转为APPROVE。

## Now

- 用户已决定本阶段先告一段落。M7～M9 的结构、规则、输入竞争和连续碰撞已完成机械与独立negative验收；M9功能层为 `APPROVE`。长任务暂停在可恢复检查点；真实页面确认仍因浏览器为空而不能进入 M10 最终视觉裁定，不得把阶段性暂停或功能通过写成整体视觉验收完成。

## Next

1. 浏览器可用后按 `tmp/visual-acceptance/20260730-1847/report.md` 的11步路径续验真实动态、控制台和画风，不重跑已关闭的negative矩阵。
2. 首先截图四个白天具身视角，再录取祈愿厅 → 处理室 → 陈列室的连续移动、门洞碰撞、镜头和距离门禁。
3. 回归收藏闭环、结果按钮、五模型、满柜与跨昼夜；只对真实页面发现的新问题做定点修复与复验。

## Key Decisions

| 时间 | 决定 | 原因/证据 | 影响 |
|---|---|---|---|
| 2026-08-04T19:06:07+08:00 | 本阶段先告一段落，长任务暂停在 M9 功能验收通过／M10 视觉待验检查点 | 用户明确决定暂停；功能证据已稳定，浏览器阻塞尚未解除 | 下次直接从真实视觉／动态验收恢复，不重做已经通过的功能negative盲测 |
| 2026-07-30T01:47:20+08:00 | UI 使用“记忆能量（共鸣代币）” | 用户确认计划，且符合最新设计权威 | 不形成并行货币 |
| 2026-07-30T01:47:20+08:00 | 非空回应 +1，合成消耗 1 供品 + 1 能量 | 用户确认 MVP 默认数值 | 可建立确定性规则测试 |
| 2026-07-30T01:47:20+08:00 | 三槽、跨昼夜、刷新重置 | 用户确认计划 | 不引入永久存档 |
| 2026-07-30T11:52:40+08:00 | 当前实现是持续演进的可玩产品原型，不再按一次性 MVP 管理 | 用户明确校正 | 后续功能和视觉质量从当前实现继续累计 |
| 2026-07-30T11:52:40+08:00 | UI／3D 验收主动截图，动态路径按需录屏，并检查画风 | 用户明确要求 | 真实视觉证据进入完成标准 |
| 2026-07-30T12:44:49+08:00 | v1 专属规则删除，旧代码／设计／截图只在 `记录/v1归档/` 保留历史证据 | 用户明确推翻原 v1 规则保留方案 | 活动规则只剩根、design、project 3 对；归档不得参与规则发现或运行时依赖 |
| 2026-07-30T17:26:00+08:00 | 原“艺术品与独特藏品分库”假设被推翻；每次共鸣结果统一为承载艺术品的记忆藏品 | 用户明确要求记忆空间收纳所有喜欢的共鸣结果，并强调收藏是最核心玩法 | 80/20 只区分载体外形；记忆空间改为多格背包；展示柜改为从背包策展 |
| 2026-07-30T18:28:16+08:00 | 原“固定 diorama 单厅机位”假设被推翻；寺庙改为三房间连通空间 | 用户指出当前视角是死的，并指定 design 中的寺庙结构图 | 白天采用神像／三管理员具身视角；夜晚独立灵体自由行走并按空间交互 |

## Constraints / Assumptions

- 当前实现继续在 `prototype/temple-mvp/` 演进；本任务不擅自迁移／重命名目录或重构 `project/` 旧骨架。
- 零网络依赖、双击可运行。
- “房间管理员”暂为原型工作称和视角锚点；正式命名、人格与剧情权重不在本轮擅自定案。
- 寺庙结构概念图是空间关系依据，不是最终建筑美术定稿。
- 不自动 commit、tag、push 或部署。

## Blockers

- **真实视觉验收阻塞：** 浏览器控制仍返回 `No browser is available`，可用列表为 `[]`。AC-13／AC-14／AC-20 及 AC-V1～AC-V15 保持 `BLOCKED`，不能用33/33、负向探针或脚本解析冒充。
- 设计同步、功能盲测和静态基线不受阻。

## Open Questions

- 管理员正式名称、人格、剧情权重与是否长期可操控仍待后续定案；本轮仅实现房间引导和白天具身视角锚点，不构成阻塞。
- 房间比例、镜头距离、移动速度和碰撞边界先按概念图与当前低模场景推导，再由真实视觉验收校准。

## Verification Evidence

| AC / Milestone | 证据 | 结果 | 时间 |
|---|---|---|---|
| Contract | 用户回复“可以的按照计划开始” | PASS | 2026-07-30T01:47:20+08:00 |
| M1 / AC-1～AC-4 rules | `node --test prototype/temple-mvp/tests/game-rules.test.cjs`，5/5 | PASS | 2026-07-30T01:53:00+08:00 |
| M2～M4 source contracts | `node --test prototype/temple-mvp/tests/*.test.cjs`，9/9 | PASS | 2026-07-30T02:03:30+08:00 |
| Showcase frustum | Three.js 投影计算：三个槽位 NDC 均在 [-1,1] | PASS | 2026-07-30T02:03:30+08:00 |
| AC-1～AC-8 runtime | 浏览器实例不可用 | BLOCKED | 2026-07-30T02:03:30+08:00 |
| Project skill mirrors | 两份 `startup/SKILL.md` SHA-256 完全一致；`quick_validate.py` 分别 PASS | PASS | 2026-07-30T11:52:40+08:00 |
| Project rules / skill audit | `skill-stocktake --workspace`：blocking 0、deterministic errors 0；根规则仅宿主调用语法差异 | PASS | 2026-07-30T11:52:40+08:00 |
| Revalidation | Node 规则与页面契约 9/9；`git diff --check` 无 whitespace error | PASS | 2026-07-30T11:52:40+08:00 |
| Rule suite alignment | 根、design、project 3 对规则归一后全部 MATCH；活动规则总数固定为 6，归档和 design 子目录无嵌套规则 | PASS | 2026-07-30T12:48:15+08:00 |
| my-design-sync package | 双宿主各 4 文件 SHA-256 完全一致；quick validator 双 PASS；stocktake blocking 0 | PASS | 2026-07-30T12:09:29+08:00 |
| v1 archive plan review | L2 独立审查初审 FAIL（3 项）；修订后定点复检 APPROVE | PASS | 2026-07-30T12:44:49+08:00 |
| v1 archive migration | 100 代码 + 21 设计 + 18 截图；三批数量、字节数与迁移前后聚合哈希一致 | PASS | 2026-07-30T12:44:49+08:00 |
| v1 archive final audit | 与事务备份逐文件 SHA-256 对照 0 差异；Skill 双验证、stocktake blocking 0、原型 9/9、diff check 通过；备份随后定点删除 | PASS | 2026-07-30T12:48:15+08:00 |
| Rule slimming | 候选 1 撤回；候选 2–5 落盘；六文件 492→482 行；三对镜像 MATCH；12 个关键语义锚点与 stocktake 通过 | PASS | 2026-07-30T14:28:51+08:00 |
| my-slim Gotcha | 权威源与三镜像各 2 文件；四份 quick validator PASS；4 个针对性断言 PASS；来源清单哈希全匹配；stocktake blocking 0 | PASS | 2026-07-30T14:41:32+08:00 |
| AC-10～AC-11 visual evidence | 浏览器实例不可用；视觉规范已建立，禁止用静态证据替代 | BLOCKED | 2026-07-30T11:52:40+08:00 |
| M1 design sync | 七份活动设计文稿、PLAN、进度与日志含新机制；旧活动口径扫描仅命中明确旧基线；`prototype/temple-mvp` 无 `design/` 依赖；config JSON 与 `git diff --check` 通过 | PASS | 2026-07-30T17:52:00+08:00 |
| M2 RED | `node --test content-catalog.test.cjs game-rules.test.cjs`；2 个文件均因预期缺少 `../content-catalog.js` 失败 | PASS（预期 RED） | 2026-07-30T17:59:00+08:00 |
| M2 GREEN | 定向内容／规则 13/13；`node --test prototype/temple-mvp/tests/*.test.cjs` 全套 17/17 | PASS | 2026-07-30T18:07:00+08:00 |
| M3 contract RED | 新页面契约7项中1项通过、6项按预期失败，锁定新状态、甄选、背包、ID策展与五模型入口 | PASS（预期 RED） | 2026-07-30T17:54:00+08:00 |
| M3/M4 implementation GREEN | `node --test prototype/temple-mvp/tests/*.test.cjs` 20/20；内联脚本解析PASS；旧运行时状态扫描0命中；diff check无错误 | PASS（机械） | 2026-07-30T18:07:39+08:00 |
| AC-13～AC-14 runtime/visual | 默认浏览器选择失败；按排查流程发现可用浏览器列表 `[]`；详见 `tmp/visual-acceptance/20260730-1806/report.md` | BLOCKED | 2026-07-30T18:07:39+08:00 |
| Resonance action click regression | 用户截图真实复现；新增测试先1 FAIL，再为 `#resonanceActions`／`#resonanceCarrier` 增加指针捕获豁免；全套21/21、脚本解析PASS | PASS（代码）／待真实复验 | 2026-07-30T18:14:52+08:00 |
| M9 negative blind test | `tmp/blind-test/20260730-temple-spatial/negative/report.md`；11项：3 PASS／2 FAIL／6 BLOCKED；主流程重跑 `negative-probes.cjs` 再现两项失败 | FAIL（1 HIGH＋1 MEDIUM） | 2026-07-30T19:57:47+08:00 |
| M9 negative repair/retest | 完整33/33；reviewer round 1空间额外40组全PASS并发现可编辑目标HIGH；修复后同一reviewer `round-2-report.md` 5/5、0 finding、JSON校验通过 | APPROVE（negative lane） | 2026-07-30T22:26:48+08:00 |

## Working Set

- **Files：** `.codex/plans/{island-collectibles-memory-spaces,fix-spatial-negative-blind-test}.plan.md`; `.agent/long-task/*`; `prototype/temple-mvp/{content-catalog.js,game-rules.js,index.html,README.md,视觉与交互验收规范.md,素材对接说明.md}`; `prototype/temple-mvp/tests/*.test.cjs`; `tmp/visual-acceptance/20260730-1847/*`; `tmp/blind-test/20260730-temple-spatial{,-retest}/negative/*`
- **Commands：** `node --test prototype/temple-mvp/tests/*.test.cjs`
- **Active / long operation：** 无
- **IDs / URLs：** 无

## Recovery Pointer

- `.agent/long-task/RECOVERY.md`
