import { NextRequest, NextResponse } from "next/server";
import { writeConfigFiles, previewConfig } from "@/lib/generator";

// POST /api/config/generate - Generate and write config files
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { project_path, preview_only } = body;

    if (!project_path) {
      return NextResponse.json(
        { error: "Missing required field: project_path" },
        { status: 400 }
      );
    }

    if (preview_only) {
      const config = previewConfig(project_path);
      return NextResponse.json({ preview: config });
    }

    const result = await writeConfigFiles(project_path);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate config" },
      { status: 500 }
    );
  }
}
