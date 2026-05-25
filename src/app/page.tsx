import Link from "next/link";

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Claude Code 配置管理</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/templates"
          className="border rounded p-6 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">配置模板</h2>
          <p className="text-gray-600">
            管理可复用的配置模板，包括 AGENTS.md、CLAUDE.md 和技能配置
          </p>
        </Link>

        <Link
          href="/projects"
          className="border rounded p-6 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">项目配置</h2>
          <p className="text-gray-600">
            为每个项目选择配置模板，生成对应的配置文件
          </p>
        </Link>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">快速开始</h3>
        <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
          <li>创建配置模板（如 "React 前端规范"、"NestJS 后端规范"）</li>
          <li>为项目选择模板组合</li>
          <li>点击 "生成配置" 自动写入项目目录</li>
          <li>Claude Code 启动时读取配置</li>
        </ol>
      </div>
    </div>
  );
}
