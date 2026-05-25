import { NextRequest, NextResponse } from "next/server";
import {
  getProjectConfigs,
  getProjectConfig,
  createProjectConfig,
  updateProjectConfig,
  deleteProjectConfig,
} from "@/lib/queries";

// GET /api/config/projects - Get all project configs
export async function GET() {
  const configs = getProjectConfigs();
  return NextResponse.json(configs);
}

// POST /api/config/projects - Create a new project config
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { project_path, name, description, template_ids, overrides } = body;

    if (!project_path) {
      return NextResponse.json(
        { error: "Missing required field: project_path" },
        { status: 400 }
      );
    }

    const config = createProjectConfig({
      project_path,
      name,
      description,
      template_ids: template_ids || [],
      overrides: overrides || {},
    });
    return NextResponse.json(config, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create project config" },
      { status: 500 }
    );
  }
}
