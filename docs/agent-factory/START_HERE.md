# START HERE — 将 Agent Factory 交给 Dot / ChatGPT Work / Codex

规划文档：[PLAN.md](./PLAN.md)

## 推荐开始方式

1. 在 GitHub 打开与本文件对应的 PR，阅读 PLAN.md，确认目标、范围和“不自动合并/部署”约束。
2. 首先在 Codex 中连接或创建有权限访问目标仓库的开发环境。Dot 可以调用已配置好的 Codex 云端环境来创建任务；不能假设仅有 GitHub 文档链接就能直接执行代码。
3. 如果尚未创建独立的 count-back/agent-factory 仓库，先请用户确认创建。当前 claude-config 仅用来存放规划，禁止往它的业务代码中实现调度器。
4. 用下面的提示词开始 **Phase 0**。第一轮完成后审查 PR，再推进 Phase 1–3；不要一口气把所有阶段同时改完。
5. 每次执行必须把 GitHub Issue/PR/committed docs 作为可追溯的项目状态；聊天记录不应是唯一的真相来源。

## 复制给 Dot / ChatGPT Work 的启动指令

> 我准备启动一个高并发、多 Agent 自动软件开发流水线项目 Agent Factory。
>
> 权威规划位于 GitHub 仓库 count-back/claude-config 的文档分支 docs/agent-factory-blueprint-20261013：
> docs/agent-factory/PLAN.md 和 docs/agent-factory/START_HERE.md。
> 请先读取这两份文件和相关 PR，复述你理解的目标、技术边界、主要风险及首个验收标准，不要仅凭聊天记忆推测需求。
>
> 最终项目必须放在独立仓库 count-back/agent-factory。当前 claude-config 只是临时规划存放处，不要改动其业务代码。若需要新建仓库，请让我先确认；若权限或工具不支持，请明确告诉我需要完成的操作。
>
> 开始实施 Phase 0：搭建 Node.js/TypeScript monorepo，搭建 PostgreSQL、Redis 的 Docker Compose 开发环境，配置最小 CI、README、.env.example、健康检查及基础测试，并在独立仓库创建一个 Draft PR。必须运行实际测试，在 PR 中写明测试命令、结果、变更和剩余风险。
>
> 完成 Phase 0 后再依据 PLAN.md 的 Phase 1 规划三个隔离的 Codex Worker 试验。并发优先实现任务级隔离（每任务独立 clone/容器/分支）；暂不在一个工作树内让多个 Agent 并发写入。
>
> 你可以自主拆任务、编码、测试与修复，但不能自动合并主分支、部署生产环境、暴露密钥、突破预算或做删除/付费等高风险操作。遇到无法验证或权限不足必须如实报告。
>
> 请持续把阶段进度、阻塞、验收证据和后续 Issue 写回 GitHub，并在需要人工决策时通知我。

## 复制给 Codex 的第一项编码任务

> 仔细阅读 docs/agent-factory/PLAN.md 与 docs/agent-factory/START_HERE.md。你是在独立的 agent-factory 仓库内工作；如果当前仓库是 claude-config，请先停止并报告错误位置。
>
> 仅实现 Phase 0；先列出具体文件改动及测试计划，再创建最小的 TypeScript monorepo。要求：
> - apps/api：Fastify GET /health，提供可执行测试；
> - packages/contracts：Zod schemas 和最小单元测试；
> - infra：本地 PostgreSQL/Redis 的 docker-compose；
> - README：依赖、环境变量、启动、测试说明；
> - GitHub Actions：install、lint、typecheck、test；
> - .env.example 不含任何真实凭据。
>
> 不实现任务调度、GitHub 写入、自动合并或生产部署；不修改与此项目无关的仓库。
> 实际运行安装、测试和构建；提交 Draft PR，并报告已执行的检查及失败项，绝不假称测试通过。

## 首个交付标准

- 独立仓库，不影响 claude-config 和 claude-monitor 的业务代码。
- 清洁环境按照 README 能启动服务与依赖；GET /health 能返回健康响应。
- typecheck、lint、test 及 CI 真实通过；无硬编码秘密。
- PR 为 Draft，包含变更说明、测试证据和 Phase 1 建议。
- 所有代码变更在人工验收之前不得自动合并。

## 后续阶段启动方式

- Phase 1：Codex Runner Adapter + 3 个 Sandbox Worker + 可复现实验。
- Phase 2：DAG Scheduler、PostgreSQL 持久化、BullMQ、幂等恢复。
- Phase 3：验证、Review、Integrator、GitHub Draft PR 闭环。
- Phase 4：监控、成本度量、压测和可选复用 claude-monitor、claude-config。

不要用“模型同时运行了几个 Agent”代替交付指标；关注合格 PR 吞吐、一次通过率、平均耗时和每个合格交付的成本。