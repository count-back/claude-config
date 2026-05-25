"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ProjectConfig {
  project_path: string;
  name: string | null;
  description: string | null;
  template_ids: number[];
  overrides: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export default function ProjectsPage() {
  const [configs, setConfigs] = useState<ProjectConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const response = await fetch("/api/config/projects");
      const data = await response.json();
      setConfigs(data);
    } catch (error) {
      console.error("Failed to fetch project configs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectPath: string) => {
    if (!confirm("确定要删除这个项目配置吗？")) return;

    try {
      await fetch(`/api/config/projects/${encodeURIComponent(projectPath)}`, {
        method: "DELETE",
      });
      setConfigs(configs.filter((c) => c.project_path !== projectPath));
    } catch (error) {
      console.error("Failed to delete project config:", error);
    }
  };

  const handleGenerate = async (projectPath: string) => {
    try {
      const response = await fetch("/api/config/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_path: projectPath }),
      });
      const result = await response.json();

      if (result.success) {
        alert(`配置文件已生成：\n${result.files.join("\n")}`);
      } else {
        alert(`生成失败：\n${result.errors.join("\n")}`);
      }
    } catch (error) {
      console.error("Failed to generate config:", error);
    }
  };

  if (loading) {
    return <div className="p-8">加载中...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">项目配置</h1>
        <Link
          href="/projects/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          新建项目配置
        </Link>
      </div>

      <div className="grid gap-4">
        {configs.map((config) => (
          <div
            key={config.project_path}
            className="border rounded p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">
                  {config.name || config.project_path}
                </h3>
                <p className="text-sm text-gray-500">{config.project_path}</p>
                {config.description && (
                  <p className="mt-1 text-sm text-gray-600">
                    {config.description}
                  </p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  使用 {config.template_ids.length} 个模板
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleGenerate(config.project_path)}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                >
                  生成配置
                </button>
                <Link
                  href={`/projects/${encodeURIComponent(config.project_path)}`}
                  className="text-blue-500 hover:underline"
                >
                  编辑
                </Link>
                <button
                  onClick={() => handleDelete(config.project_path)}
                  className="text-red-500 hover:underline"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
