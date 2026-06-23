import { NextRequest, NextResponse } from "next/server";
import { getClerkIdentity } from "@/lib/project-access";
import { prisma } from "@/lib/prisma";

/**
 * DELETE /api/projects/[projectId]/collaborators/[collaboratorId]
 * Removes a collaborator from the project (owner only).
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; collaboratorId: string }> }
) {
  try {
    const { projectId, collaboratorId } = await params;

    // 1. Authenticate user
    const { userId } = await getClerkIdentity();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Load project and verify ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.ownerId !== userId) {
      return NextResponse.json({ error: "Forbidden. Only the owner can remove collaborators." }, { status: 403 });
    }

    // 3. Verify collaborator belongs to this project
    const collaborator = await prisma.projectCollaborator.findUnique({
      where: { id: collaboratorId },
    });

    if (!collaborator || collaborator.projectId !== projectId) {
      return NextResponse.json({ error: "Collaborator not found in this project." }, { status: 404 });
    }

    // 4. Delete collaborator
    await prisma.projectCollaborator.delete({
      where: { id: collaboratorId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/projects/[projectId]/collaborators/[collaboratorId]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
