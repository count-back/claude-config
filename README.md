# Claude Config

Claude Code 配置管理工具，通过 Web 界面管理配置模板，为不同项目生成配置文件。

## 功能

- **配置模板管理**：创建、编辑、删除配置模板（AGENTS.md、CLAUDE.md、技能配置）
- **项目配置管理**：为每个项目选择配置模板组合
- **配置文件生成**：一键生成配置文件到项目目录
- **配置历史**：记录配置变更历史

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

## 使用流程

1. **创建配置模板**
   - 访问 `/templates` 页面
   - 点击 "新建模板"
   - 选择类型（agents、claude、skill）
   - 输入配置内容和标签

2. **配置项目**
   - 访问 `/projects` 页面
   - 点击 "新建项目配置"
   - 输入项目路径和描述
   - 选择配置模板

3. **生成配置文件**
   - 在项目配置页面点击 "生成配置"
   - 配置文件将自动写入项目目录

## 数据库

项目使用 SQLite 数据库，存储在 `~/.claude/monitor.db`。

配置相关表：
- `config_templates`：配置模板
- `project_configs`：项目配置
- `config_history`：配置历史

## 技术栈

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- better-sqlite3

## 相关项目

- [claude-monitor](https://github.com/count-back/claude-monitor)：Claude Code 会话监控仪表盘
