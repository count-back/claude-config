import { getDb } from "./db";

// ── Interfaces ──────────────────────────────────────────────────────────────

export interface ConfigTemplate {
  id: number;
  name: string;
  type: "agents" | "claude" | "skill";
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface ProjectConfig {
  project_path: string;
  name: string | null;
  description: string | null;
  template_ids: number[];
  overrides: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface ConfigHistory {
  id: number;
  project_path: string;
  config_type: string;
  content: string;
  created_at: string;
}

// ── Template Queries ─────────────────────────────────────────────────────────

export function getTemplates(type?: string): ConfigTemplate[] {
  const db = getDb();
  let query = "SELECT * FROM config_templates";
  const params: any[] = [];

  if (type) {
    query += " WHERE type = ?";
    params.push(type);
  }

  query += " ORDER BY updated_at DESC";

  const rows = db.prepare(query).all(...params) as any[];
  return rows.map((row) => ({
    ...row,
    tags: JSON.parse(row.tags || "[]"),
  }));
}

export function getTemplate(id: number): ConfigTemplate | null {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM config_templates WHERE id = ?")
    .get(id) as any;

  if (!row) return null;

  return {
    ...row,
    tags: JSON.parse(row.tags || "[]"),
  };
}

export function createTemplate(
  template: Omit<ConfigTemplate, "id" | "created_at" | "updated_at">
): ConfigTemplate {
  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO config_templates (name, type, content, tags)
       VALUES (?, ?, ?, ?)`
    )
    .run(template.name, template.type, template.content, JSON.stringify(template.tags));

  return getTemplate(result.lastInsertRowid as number)!;
}

export function updateTemplate(
  id: number,
  updates: Partial<Omit<ConfigTemplate, "id" | "created_at" | "updated_at">>
): ConfigTemplate | null {
  const db = getDb();
  const existing = getTemplate(id);
  if (!existing) return null;

  const fields: string[] = [];
  const values: any[] = [];

  if (updates.name !== undefined) {
    fields.push("name = ?");
    values.push(updates.name);
  }
  if (updates.type !== undefined) {
    fields.push("type = ?");
    values.push(updates.type);
  }
  if (updates.content !== undefined) {
    fields.push("content = ?");
    values.push(updates.content);
  }
  if (updates.tags !== undefined) {
    fields.push("tags = ?");
    values.push(JSON.stringify(updates.tags));
  }

  fields.push("updated_at = CURRENT_TIMESTAMP");
  values.push(id);

  db.prepare(
    `UPDATE config_templates SET ${fields.join(", ")} WHERE id = ?`
  ).run(...values);

  return getTemplate(id);
}

export function deleteTemplate(id: number): boolean {
  const db = getDb();
  const result = db
    .prepare("DELETE FROM config_templates WHERE id = ?")
    .run(id);
  return result.changes > 0;
}

// ── Project Config Queries ───────────────────────────────────────────────────

export function getProjectConfigs(): ProjectConfig[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM project_configs ORDER BY updated_at DESC")
    .all() as any[];

  return rows.map((row) => ({
    ...row,
    template_ids: JSON.parse(row.template_ids || "[]"),
    overrides: JSON.parse(row.overrides || "{}"),
  }));
}

export function getProjectConfig(projectPath: string): ProjectConfig | null {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM project_configs WHERE project_path = ?")
    .get(projectPath) as any;

  if (!row) return null;

  return {
    ...row,
    template_ids: JSON.parse(row.template_ids || "[]"),
    overrides: JSON.parse(row.overrides || "{}"),
  };
}

export function createProjectConfig(
  config: Omit<ProjectConfig, "created_at" | "updated_at">
): ProjectConfig {
  const db = getDb();
  db.prepare(
    `INSERT INTO project_configs (project_path, name, description, template_ids, overrides)
     VALUES (?, ?, ?, ?, ?)`
  ).run(
    config.project_path,
    config.name,
    config.description,
    JSON.stringify(config.template_ids),
    JSON.stringify(config.overrides)
  );

  return getProjectConfig(config.project_path)!;
}

export function updateProjectConfig(
  projectPath: string,
  updates: Partial<Omit<ProjectConfig, "project_path" | "created_at" | "updated_at">>
): ProjectConfig | null {
  const db = getDb();
  const existing = getProjectConfig(projectPath);
  if (!existing) return null;

  const fields: string[] = [];
  const values: any[] = [];

  if (updates.name !== undefined) {
    fields.push("name = ?");
    values.push(updates.name);
  }
  if (updates.description !== undefined) {
    fields.push("description = ?");
    values.push(updates.description);
  }
  if (updates.template_ids !== undefined) {
    fields.push("template_ids = ?");
    values.push(JSON.stringify(updates.template_ids));
  }
  if (updates.overrides !== undefined) {
    fields.push("overrides = ?");
    values.push(JSON.stringify(updates.overrides));
  }

  fields.push("updated_at = CURRENT_TIMESTAMP");
  values.push(projectPath);

  db.prepare(
    `UPDATE project_configs SET ${fields.join(", ")} WHERE project_path = ?`
  ).run(...values);

  return getProjectConfig(projectPath);
}

export function deleteProjectConfig(projectPath: string): boolean {
  const db = getDb();
  const result = db
    .prepare("DELETE FROM project_configs WHERE project_path = ?")
    .run(projectPath);
  return result.changes > 0;
}

// ── Config Generation ────────────────────────────────────────────────────────

export function generateConfig(projectPath: string): Record<string, string> {
  const db = getDb();
  const config = getProjectConfig(projectPath);
  if (!config) return {};

  const templates = config.template_ids
    .map((id) => getTemplate(id))
    .filter(Boolean) as ConfigTemplate[];

  const result: Record<string, string> = {};

  // Group templates by type
  const agentsTemplates = templates.filter((t) => t.type === "agents");
  const claudeTemplates = templates.filter((t) => t.type === "claude");
  const skillTemplates = templates.filter((t) => t.type === "skill");

  // Generate AGENTS.md
  if (agentsTemplates.length > 0) {
    const content = agentsTemplates.map((t) => t.content).join("\n\n---\n\n");
    result["AGENTS.md"] = applyOverrides(content, config.overrides);
  }

  // Generate CLAUDE.md
  if (claudeTemplates.length > 0) {
    const content = claudeTemplates.map((t) => t.content).join("\n\n---\n\n");
    result["CLAUDE.md"] = applyOverrides(content, config.overrides);
  }

  // Generate skills
  if (skillTemplates.length > 0) {
    skillTemplates.forEach((template) => {
      const skillName = template.name.toLowerCase().replace(/\s+/g, "-");
      result[`.claude/skills/${skillName}.md`] = applyOverrides(
        template.content,
        config.overrides
      );
    });
  }

  return result;
}

function applyOverrides(content: string, overrides: Record<string, string>): string {
  let result = content;
  Object.entries(overrides).forEach(([key, value]) => {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
  });
  return result;
}

// ── History Queries ──────────────────────────────────────────────────────────

export function getConfigHistory(
  projectPath: string,
  configType?: string
): ConfigHistory[] {
  const db = getDb();
  let query = "SELECT * FROM config_history WHERE project_path = ?";
  const params: any[] = [projectPath];

  if (configType) {
    query += " AND config_type = ?";
    params.push(configType);
  }

  query += " ORDER BY created_at DESC LIMIT 50";

  return db.prepare(query).all(...params) as ConfigHistory[];
}

export function addConfigHistory(
  projectPath: string,
  configType: string,
  content: string
): ConfigHistory {
  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO config_history (project_path, config_type, content)
       VALUES (?, ?, ?)`
    )
    .run(projectPath, configType, content);

  return db
    .prepare("SELECT * FROM config_history WHERE id = ?")
    .get(result.lastInsertRowid) as ConfigHistory;
}
