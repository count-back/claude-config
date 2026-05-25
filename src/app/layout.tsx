import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Claude Config",
  description: "Claude Code configuration management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body>
        <div className="flex min-h-screen">
          <aside className="w-64 bg-gray-900 text-white p-4">
            <h1 className="text-xl font-bold mb-6">Claude Config</h1>
            <nav className="space-y-2">
              <Link
                href="/"
                className="block py-2 px-4 rounded hover:bg-gray-800"
              >
                首页
              </Link>
              <Link
                href="/templates"
                className="block py-2 px-4 rounded hover:bg-gray-800"
              >
                配置模板
              </Link>
              <Link
                href="/projects"
                className="block py-2 px-4 rounded hover:bg-gray-800"
              >
                项目配置
              </Link>
            </nav>
          </aside>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
