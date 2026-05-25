import { NextRequest, NextResponse } from "next/server";
import {
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from "@/lib/queries";

// GET /api/config/templates - Get all templates
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || undefined;

  const templates = getTemplates(type);
  return NextResponse.json(templates);
}

// POST /api/config/templates - Create a new template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, content, tags } = body;

    if (!name || !type || !content) {
      return NextResponse.json(
        { error: "Missing required fields: name, type, content" },
        { status: 400 }
      );
    }

    const template = createTemplate({ name, type, content, tags: tags || [] });
    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create template" },
      { status: 500 }
    );
  }
}
