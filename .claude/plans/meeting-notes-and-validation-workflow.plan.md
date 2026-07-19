# 07-18 会议纪要、深度分析流程与验证成本门卫——总体收尾计划

> 创建日期：2026-07-19
> 性质：clear context 后的完整需求快照与执行依据
> 状态：已实施，待 Git 提交与标签

## 一、原始需求与任务链

### 原始任务

> `"D:\保存文件\OBS\2026-07-18 20-16-25.mp4"这个文件是最新的会议文件，麻烦你按照我之前让你做的那样，帮我转化成文字，并且整理一下，并且更新对应的记录`

### 可读性、深度交互和第一性原理要求

> `你把这次会议内容整理的更好一点，而且人类可读性有点差，会议讨论的内容重新整理的更好一点。然后你说的深度交互我觉得非常好，这些我们项目的第一性原理也需要记录下来。同时加入到会议纪要中和我的项目文件或者记录中。就是以后整理会议纪要也是，你的一些看法和建议于深度交互也可以放进去。你可以对我们的讨论进行分析理解以及建议，这会非常好（这个功能加入到skill或者我生成obsidian笔记的流程中去）`

### 后续任务链

> `Implement the plan.`
> `这个blind test的流程是否有问题，为什么花了这么久？`
> `那运行一下我的优化skill吧`
> `好的那你再做一个总体的plan吧，然后我会clear context再执行，中间没有保存的记录记得保存`

### 用户已确认的实施选择

1. 同时修改项目规则和全局 `my-blind-test`。
2. A/B 原始评测文件只保留正式摘要，不归档全部中间文件。
3. 根目录及各子目录的 8 个 `AGENTS.md` 全部正式纳入版本控制。

## 二、已经完成且不得重做的成果

- 本地正式纪要：`D:\保存文件\OBS\2026-07-18 20-16-25_会议总结.md`
- Obsidian 正式纪要：`C:\Users\hsxx1\Documents\Obsidian Vault\Atlas\神像供奉游戏 · 会议纪要 2026-07-18.md`
- 项目级 `my-meeting-notes` 已加入权威分层、自适应 AI 分析、第一性原理检查和最小验证建议。
- 产品第一性原理和三条设计护栏已经写入 `design/项目主旨.md`。
- `记录/进度.md`、`记录/决策与活动日志.md`、`记录/源文件索引.md` 已同步。
- 三组旧版/新版会议纪要 Skill A/B 已完成，新版三组全胜。
- 重复启动的完整 blind test 已停止，三个盲测 agent 已中断，没有生成正式盲测证据目录。

不得重新转写 MP4，不重新生成或改写两份正式纪要，除非静态检查发现确定性错误；不重新运行会议纪要完整 blind test。

## 三、仓库与 Git 边界

执行任何 Git 操作前读取：

`C:\Users\hsxx1\Documents\Obsidian Vault\Atlas\Git 仓库对照表.md`

确认两个独立仓库：

- 项目仓库：`D:\保存文件\claude库\flawed-ai`
- 全局配置仓库：`C:\Users\hsxx1\.claude`

不操作父仓库，不自动 push。全局 Skill 以 `.claude` 的 Git 跟踪版本为唯一源，`.codex` 为运行镜像。不得暂存全局仓库既有 `settings.json` 修改，也不得修改或提交项目内 `design/.claude/settings.local.json`。

## 四、项目内会议纪要与工作流记录

保留且不重写以下六个已经修改的项目文件：

- `.claude/skills/my-meeting-notes/SKILL.md`
- `.claude/skills/my-meeting-notes/gotchas.md`
- `design/项目主旨.md`
- `记录/进度.md`
- `记录/决策与活动日志.md`
- `记录/源文件索引.md`

在 `记录/决策与活动日志.md` 的 2026-07-19 条目中追加：

### 会议纪要 Skill 评测摘要 `[活动]`

- 战略/产品方向会议：新版断言 5/6，旧版 0/6；新版盲评 9.0/10，旧版 6.2/10。新版唯一未通过项是“项目最高权威冲突检查”，原因是隔离评测 prompt 主动禁止读取项目权威文件，而非 Skill 把提案升格为决策。
- 常规团队同步会：新版断言 5/5，旧版 4/5；新版盲评 9.7/10，旧版 8.0/10。
- 高噪声、模糊决策边界会议：新版断言 5/5，旧版 4/5；新版盲评 9.0/10，旧版 8.4/10。
- 汇总：新版平均断言通过率 94.44%，旧版 53.33%，提升 41.11 个百分点；新版平均盲评质量 9.23/10，旧版 7.53/10；新版三组全部胜出。时间和 token 未被评测运行时可靠暴露，不伪造数据。

### 验证流程优化 `[决策]`

- 验证目标是减少尚未覆盖的不确定性，不是叠加更多形式相似的流程。
- 已有领域专项验证覆盖需求时必须复用；`my-blind-test` 只补充专项验证没有覆盖的风险。
- 普通文档、会议纪要、设计稿不再自动启动多通道完整盲测。
- 拒绝“专项 A/B 完成后，再整套 blind test 一次”的重复流程。
- 拒绝无实际协调价值的“协调 agent → 子 agent”包装层。
- 保留独立验证的信息隔离价值，但 reviewer 数量、lane 和时间预算必须与风险相称。

## 五、项目级验证去重规则与镜像规则

同步修改根 `CLAUDE.md` 和 `AGENTS.md` 并保证字节级一致。

在“基本规则”加入：

```markdown
- **规则镜像**：每个 `AGENTS.md` 是同目录 `CLAUDE.md` 的 Codex 镜像，两个文件必须保持字节级一致。修改任意一方时同步修改另一方，并在交付前校验全部镜像对的 SHA-256。
```

在“记录铁律”后、“Skill 速查”前加入：

```markdown
## 验证去重与成本门卫

- 追加验收前，先列清「已有证据」和「未覆盖风险」。领域专项验证（如 Skill 的 A/B eval）已经覆盖的结论必须直接复用；`my-blind-test` 只补缺口，不整套重跑。
- 设计稿、会议纪要、规则文档等低风险文字任务，默认采用「机械检查 + 至多 1 次独立一致性 / 反例审查」。仅当涉及代码执行、安全、权限、金钱、数据迁移，或用户明确要求完整盲测时，才启用多通道 blind test。
- 评测 agent 直接接收任务；除非确有跨结果协调需求，不设置「协调 agent → 子 agent」的纯包装层。评测启动前限定样本、并发与时间预算；预计明显超出时，先向用户说明成本与新增价值。
```

在 `写作方式说明.md` 的“当前阶段怎么协作”之后加入：

```markdown
### 质量验证也按风险选择

验证的目标是发现尚未覆盖的风险，不是叠加流程。普通笔记、设计文稿和会议纪要采用机械检查与一次独立复核；Skill 修改优先使用针对旧版与新版的专项 A/B；完整 blind test 只用于高风险实现，或专项验证尚未覆盖的失败模式。

已有验证证据应当直接复用，避免出现「专项评测完成后，再把同一批结论整套盲测一次」的重复工作。
```

正式跟踪 8 个 `AGENTS.md`：

- `AGENTS.md`
- `design/AGENTS.md`
- `design/character/AGENTS.md`
- `design/story/AGENTS.md`
- `design/style/AGENTS.md`
- `design/system/AGENTS.md`
- `project/AGENTS.md`
- `project/v1-archive/AGENTS.md`

根镜像同步加入全局新规则，其余七个仅作为同目录 `CLAUDE.md` 的精确镜像。验收时校验全部 8 对 SHA-256 相同。

## 六、全局 my-blind-test 风险自适应改造

必须使用 `official-skill-creator`。安全顺序：

1. 把 `.claude` 旧版完整复制到 `D:\tmp` 作为不可变 baseline。
2. 再复制一份作为候选版。
3. 先在临时候选版修改。
4. 候选通过静态检查和专项 A/B 后，再申请外部写权限。
5. 同步到 `.claude` 和 `.codex`。
6. 校验两安装目录对应文件 SHA-256 一致。
7. 全局仓库只暂存 `skills/my-blind-test/` 的四个目标文件。

### description

```yaml
description: "风险自适应盲测验证框架。用户说“验证一下、验收、跑验证、盲测、验证计划”时触发；实现完成后先盘点已有证据与未覆盖风险，再选择复用、轻量、标准或完整验证，只在必要时 spawn 独立 agent 并产出可观察证据。"
```

“实现完成后自动调用”保留，但表示自动进入验证分流，不等于自动 spawn 全部 reviewer。

### 验证分流清单

任何 agent 启动前必须生成：

```markdown
## 验证分流清单

- 任务类型：
- 风险等级：
- 验收条件：
- 已有证据：
- 已覆盖的验收条件：
- 未覆盖风险：
- 选择模式：
- 选择的 reviewer lanes：
- 跳过的 reviewer lanes及理由：
- reviewer 数量预算：
- 总时间预算：
```

证据复用条件：对应当前需求和版本；映射明确验收条件；为可观察证据或正式专项 A/B；未被后续改动失效；未遗漏新增高风险面。

### 固定风险路由

| 模式 | 进入条件 | reviewer |
|---|---|---|
| `plan_only` | 用户明确要求“验证计划”，或仍处于 Plan 阶段 | 0，只生成 AC-N |
| `reuse_only` | 现有证据覆盖全部验收条件且没有新增高风险 | 0，汇总证据并给出 verdict |
| `light` | 会议纪要、设计稿、普通规则文档、非执行型内容 | 1 个最相关 reviewer |
| `standard` | 普通代码、普通自动化、非敏感配置，且仍有未覆盖风险 | 最多 2 个相关 reviewer |
| `full` | 认证、安全、权限、支付、金钱、生产数据、数据迁移、破坏性操作，或用户明确要求完整盲测 | 最多 4 个相关 reviewer |

lane：`functional` 只用于可运行功能或用户路径；`security` 只用于真实认证、权限、外部输入、秘密、支付或攻击面；`consistency` 用于文档、规则、跨文件同步、兼容性和状态一致性；`negative` 用于非法输入、异常流程、失败恢复或边界行为。不相关 lane 必须跳过并写明理由。

### `config.json`

用以下结构替换固定 `multi_reviewer` 和叠加 reviewer 的旧配置：

```json
{
  "routing_mode": "adaptive",
  "reuse_existing_evidence": true,
  "require_evidence_inventory": true,
  "allow_nested_coordinator": false,
  "reviewer_budget": {
    "light": 1,
    "standard": 2,
    "full": 4
  },
  "time_budget_ms": {
    "light": 180000,
    "standard": 300000,
    "full": 600000
  },
  "subagent_timeout_ms": 300000,
  "auto_trigger_after_implementation": true,
  "graded_compliance_execution": "within_selected_budget"
}
```

reviewer 总数包含普通 lanes 和行为合规 reviewer；主 agent 直接 spawn，不允许协调 agent 嵌套。预计超预算时优先未覆盖风险最高的 lane。`full` 超过 10 分钟不自动追加或重试。CRITICAL/HIGH 修复后最多自动复验 1 次，第二次仍失败交给用户；MEDIUM/LOW 只记录。

### 合规测试

- `light` / `standard`：一个 compliance reviewer 在同一报告中依次执行 supportive、neutral、competing。
- `full`：只有行为规约属于安全、权限或数据敏感域时才允许拆分三档。
- 拆分也占用总计四人预算，不能在 lane 外追加。
- `competing` 必须保留并通过。

### 报告兼容

在报告模板和机读 JSON 增加：

```json
{
  "verification_mode": "plan_only | reuse_only | light | standard | full",
  "evidence_inventory": [],
  "covered_acceptance_criteria": [],
  "uncovered_risks": [],
  "selected_lanes": [],
  "skipped_lanes": [],
  "reviewer_budget": 0,
  "time_budget_ms": 0,
  "reuse_reason": null
}
```

原 `verdict` 仍限 `APPROVE / WARNING / FAIL / BLOCKED`；原 tests、严重度、evidence type 和 go/no-go 保留；`reuse_only` 可 APPROVE，但必须列证据和覆盖关系。不新增依赖，不改 `references/verification-tools.md`。

`gotchas.md` 增加：verification stacking、coordinator nesting、irrelevant lanes、additive compliance fan-out。

## 七、测试与验收

### RED 基线

旧版必须证明缺少：

- 已有证据盘点
- `reuse_only`
- 风险自适应路由（旧版固定 `multi_reviewer`）
- 合规测试与 lane 共用总预算
- reviewer 总预算
- 总时间预算
- 禁止嵌套协调 agent

项目基线证明根规则尚无“验证去重与成本门卫”，8 个 `AGENTS.md` 尚未被 Git 跟踪。

### 会议纪要 Skill 复用现有证据

只做 YAML/frontmatter、`quick_validate.py`、`git diff --check`、关键章节/权威分层/AI 非会议结论标签静态检查，以及临时副本与正式纪要哈希比对。

- 本地哈希：`D416657A9ED6820049AA90256F37C6159DCEC89AEE236C43902C8807EBE71BB7`
- Obsidian 哈希：`25B8234C89FD6A3DA381A005AC0D2247F3E003593A05EB37B37986CCC358771F`

### my-blind-test 两例专项 A/B

只运行最有区分力的两个用例，旧版/新版各一个直接 executor，不创建 coordinator 或 grader，不运行 blind comparator，不递归调用 `my-blind-test`：

1. 低风险 Skill 文档已有三组正式 A/B：新版必须列证据清单、选 `reuse_only`、reviewer 为 0、确认无新增高风险，不启 functional/security/三档独立 agent。
2. 登录/权限接口刚修改且无测试：新版必须选 `full`，至少覆盖 functional/security/negative，保留非法访问和越权测试，总 reviewer ≤ 4，无协调 agent 嵌套，不因成本降低安全强度。

每个 executor 最长 180 秒；断言由主 agent内联判定。用 `official-skill-creator` 的 `generate_review.py --static` 生成临时 HTML，可选人工审计、不阻塞。最多修改后复跑一次。

### GREEN 条件

- 项目会议纪要 Skill quick validation 通过。
- 三组会议 A/B 摘要进入活动日志。
- 根验证门卫进入 `CLAUDE.md` / `AGENTS.md`。
- 8 对规则镜像 SHA-256 一致，8 个 `AGENTS.md` 被 Git 跟踪。
- my-blind-test 候选 quick validation 通过。
- 用例 A 为 `reuse_only` / 0 reviewer。
- 用例 B 为 `full` 且覆盖认证、安全、负面风险。
- `.claude` / `.codex` Skill 对应文件哈希一致。
- `git diff --check` 无错误。
- 未重跑会议纪要完整盲测。

## 八、临时文件清理

正式摘要和计划保存、哈希校验通过后，验证绝对路径并在同一 PowerShell 环境删除：

- 项目 `.skill-eval-workspace/`
- 项目 `.tmp_meeting_0718_local.md`
- 项目 `.tmp_meeting_0718_obsidian.md`
- `D:\tmp\my-meeting-notes-workspace-20260719`
- 本轮 `D:\tmp\my-blind-test-*-workspace-*`
- 本轮 baseline、candidate 和静态审阅器

不删除正式会议纪要、六个项目成果文件、本计划、8 个 `AGENTS.md`、`design/.claude/settings.local.json`、全局 `settings.json` 修改。

## 九、提交与标签（均不 push）

### 项目仓库

只暂存六个会议/设计/记录文件、根 `CLAUDE.md`、`写作方式说明.md`、8 个 `AGENTS.md`、本计划。

- commit：`docs: improve meeting notes and validation workflow`
- annotated tag：`2026-07-19-meeting-validation-workflow`
- tag message：`重整 07-18 会议纪要，升级会议纪要深度分析流程，并加入验证去重、成本门卫与 AGENTS 规则镜像。`

### 全局配置仓库

只暂存：

- `skills/my-blind-test/SKILL.md`
- `skills/my-blind-test/config.json`
- `skills/my-blind-test/gotchas.md`
- `skills/my-blind-test/templates/VERIFICATION-REPORT.md`

- commit：`feat: make blind test risk-adaptive`
- annotated tag：`2026-07-19-blind-test-cost-gate`
- tag message：`将 my-blind-test 改为风险自适应验证，支持证据复用、按需选择 reviewer lane，并限制嵌套协调、agent 数量与验证时间。`

最终报告两个 commit hash 与两个 tag，等待用户决定是否 `git push --follow-tags`。

## 十、第一性原理、边界与默认假设

核心判断：

> 每增加一次验证，必须能指出它减少了哪一项尚未覆盖的不确定性。

- 独立 agent 的价值是信息隔离；多个 reviewer 的价值是互补风险覆盖；流程完整不等于可信，证据到验收条件的映射才是可信。
- 已有专项证据充分时，重复完整盲测只会增加等待、token 和协调复杂度。
- 成本门卫只消除重复、无关 lane 和无价值嵌套，不能弱化高风险验证。
- 不把 AI 建议升格为团队决策。
- 不归档 17 个 A/B 原始文件，只保留摘要。
- 不新增第三方依赖，不修改 `references/verification-tools.md`。
- 不处理范围外的本机修改，不 push。

## 十一、执行结果（2026-07-19）

- 计划工件在任何其他新修改前创建。
- 项目日志已保存三组会议纪要 A/B 正式摘要与验证流程优化决策。
- 根 `CLAUDE.md` / `AGENTS.md` 已加入验证去重、成本门卫与规则镜像约束；`写作方式说明.md` 已加入风险分级验证说明。
- 8 对 `CLAUDE.md` / `AGENTS.md` 的 SHA-256 已全部匹配。
- 项目 `my-meeting-notes` 通过 `official-skill-creator/scripts/quick_validate.py`；关键章节、权威分层、AI 非会议结论标签静态检查通过。
- 两份临时会议纪要与正式文件哈希一致：
  - 本地：`D416657A9ED6820049AA90256F37C6159DCEC89AEE236C43902C8807EBE71BB7`
  - Obsidian：`25B8234C89FD6A3DA381A005AC0D2247F3E003593A05EB37B37986CCC358771F`
- 全局 `my-blind-test` 已按 fixed adaptive routing 改造：
  - 用例 A：候选 6/6，旧版 1/6；候选选择 `reuse_only`，reviewer=0。
  - 用例 B：候选 7/7；选择 `full`，覆盖 functional / security / negative，实际 reviewer=3，无嵌套协调层。
- 候选、`.claude` 安装版和 `.codex` 安装版均通过官方 quick validation。
- `.claude` 与 `.codex` 的 `SKILL.md`、`config.json`、`gotchas.md`、报告模板和未修改的 `references/verification-tools.md` SHA-256 全部一致。
- 使用 `generate_review.py --static` 生成了可选人工审阅器；按计划不运行 comparator、不递归调用 `my-blind-test`。
- executor 的可靠时间与 token 指标未由当前运行时暴露，因此不伪造数据。
- 全局 `settings.json` 与项目 `design/.claude/settings.local.json` 均未修改、未纳入本轮暂存。
