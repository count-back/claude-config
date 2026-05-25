"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ConfigTemplate {
  id: number;
  name: string;
  type: "agents" | "claude" | "skill";
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<ConfigTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/config/templates");
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(filter.toLowerCase()) ||
      t.type.toLowerCase().includes(filter.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(filter.toLowerCase()))
  );

  const handleDelete = async (id: number) => {
    if (!confirm("确定要删除这个模板吗？")) return;

    try {
      await fetch(`/api/config/templates/${id}`, { method: "DELETE" });
      setTemplates(templates.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Failed to delete template:", error);
    }
  };

  if (loading) {
    return <div className="p-8">加载中...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">配置模板</h1>
        <Link
          href="/templates/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          新建模板
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="搜索模板..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="grid gap-4">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="border rounded p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{template.name}</h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {template.type}
                </span>
                {template.tags.length > 0 && (
                  <div className="mt-2 flex gap-1">
                    {template.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/templates/${template.id}`}
                  className="text-blue-500 hover:underline"
                >
                  编辑
                </Link>
                <button
                  onClick={() => handleDelete(template.id)}
                  className="text-red-500 hover:underline"
                >
                  删除
                </button>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600 line-clamp-3">
              {template.content.substring(0, 200)}...
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
