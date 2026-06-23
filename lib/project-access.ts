import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export interface ProjectWithCollaborators {
  id: string;
  ownerId: string;
  name: string;
  description: string | null;
  status: "DRAFT" | "ARCHIVED";
  canvasJsonPath: string | null;
  createdAt: Date;
  updatedAt: Date;
  collaborators: {
    id: string;
    projectId: string;
    email: string;
    createdAt: Date;
  }[];
}

/**
 * Retrieves the current Clerk authenticated user's ID and primary email.
 */
export async function getClerkIdentity() {
  const { userId } = await auth();
  if (!userId) {
    return { userId: null, primaryEmail: null };
  }
  const user = await currentUser();
  const primaryEmail = user?.primaryEmailAddress?.emailAddress || null;
  return { userId, primaryEmail };
}

/**
 * Checks if the current user has access to a project as an owner or collaborator.
 * Returns a boolean representing access status and the project if found.
 */
export async function hasProjectAccess(
  projectId: string,
  userId: string,
  primaryEmail: string | null
): Promise<{ hasAccess: boolean; project: ProjectWithCollaborators | null }> {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        collaborators: true,
      },
    });

    if (!project) {
      return { hasAccess: false, project: null };
    }

    // Owner access
    if (project.ownerId === userId) {
      return { hasAccess: true, project: project as unknown as ProjectWithCollaborators };
    }

    // Collaborator access
    if (primaryEmail) {
      const isCollaborator = project.collaborators.some(
        (c) => c.email.toLowerCase() === primaryEmail.toLowerCase()
      );
      if (isCollaborator) {
        return { hasAccess: true, project: project as unknown as ProjectWithCollaborators };
      }
    }

    return { hasAccess: false, project: null };
  } catch (error) {
    console.error("Error checking project access:", error);
    return { hasAccess: false, project: null };
  }
}
