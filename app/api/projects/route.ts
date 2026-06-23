import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { ProjectStatus, Prisma } from "@/app/generated/prisma/client";

/**
 * GET /api/projects
 * Lists all projects owned by the currently authenticated Clerk user.
 */
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error in GET /api/projects:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects
 * Creates a new project. Missing or empty name defaults to "Untitled Project".
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const name = typeof body.name === "string" && body.name.trim() !== "" 
      ? body.name.trim() 
      : "Untitled Project";

    const id = typeof body.id === "string" && body.id.trim() !== ""
      ? body.id.trim()
      : undefined;

    if (id !== undefined) {
      const idRegex = /^[a-zA-Z0-9_-]{3,50}$/;
      if (!idRegex.test(id)) {
        return NextResponse.json(
          { error: "Invalid custom ID. It must be between 3 and 50 characters long and contain only alphanumeric characters, underscores, and hyphens." },
          { status: 400 }
        );
      }
    }

    const description = typeof body.description === "string" ? body.description : null;
    const canvasJsonPath = typeof body.canvasJsonPath === "string" ? body.canvasJsonPath : null;

    let status: ProjectStatus = ProjectStatus.DRAFT;
    if (body.status === "ARCHIVED") {
      status = ProjectStatus.ARCHIVED;
    }

    const project = await prisma.project.create({
      data: {
        id,
        ownerId: userId,
        name,
        description,
        canvasJsonPath,
        status,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/projects:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "A project with this ID already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
