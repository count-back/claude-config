import { NextRequest, NextResponse } from "next/server";
import {
  getProjectConfig,
  updateProjectConfig,
  deleteProjectConfig,
} from "@/lib/queries";

// GET /api/config/projects/[projectPath] - Get a specific project config
export async function GET(
  request: NextRequest,
  { params }: { params: { projectPath: string } }
) {
  const projectPath = decodeURIComponent(params.projectPath);
  const config = getProjectConfig(projectPath);

  if (!config) {
    return NextResponse.json(
      { error: "Project config not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(config);
}

// PUT /api/config/projects/[projectPath] - Update a project config
export async function PUT(
  request: NextRequest,
  { params }: { params: { projectPath: string } }
) {
  try {
    const projectPath = decodeURIComponent(params.projectPath);
    const body = await request.json();
    const { name, description, template_ids, overrides } = body;

    const config = updateProjectConfig(projectPath, {
      name,
      description,
      template_ids,
      overrides,
    });

    if (!config) {
      return NextResponse.json(
        { error: "Project config not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update project config" },
      { status: 500 }
    );
  }
}

// DELETE /api/config/projects/[projectPath] - Delete a project config
export async function DELETE(
  request: NextRequest,
  { params }: { params: { projectPath: string } }
) {
  const projectPath = decodeURIComponent(params.projectPath);
  const success = deleteProjectConfig(projectPath);

  if (!success) {
    return NextResponse.json(
      { error: "Project config not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
