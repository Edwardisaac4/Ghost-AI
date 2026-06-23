import { NextRequest, NextResponse } from "next/server";
import { getClerkIdentity, hasProjectAccess } from "@/lib/project-access";
import { prisma } from "@/lib/prisma";
import { createClerkClient } from "@clerk/nextjs/server";
import { Prisma } from "@/app/generated/prisma/client";

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

/**
 * GET /api/projects/[projectId]/collaborators
 * Lists all collaborators for the project, enriched with Clerk user data if available.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;

    // 1. Authenticate user
    const { userId, primaryEmail } = await getClerkIdentity();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Validate access (collaborators or owners can see the collaborator list)
    const { hasAccess, project } = await hasProjectAccess(projectId, userId, primaryEmail);
    if (!hasAccess || !project) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 3. Fetch collaborators from database
    const collaborators = await prisma.projectCollaborator.findMany({
      where: { projectId },
      orderBy: { createdAt: "asc" },
    });

    const emails = collaborators.map((c) => c.email);

interface ClerkEmailAddress {
  emailAddress: string;
}

interface ClerkUser {
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  imageUrl: string;
  emailAddresses: ClerkEmailAddress[];
}

    // 4. Enrich collaborators with Clerk profile data
    const clerkUsers: ClerkUser[] = [];
    if (emails.length > 0) {
      try {
        const batchSize = 100;
        for (let i = 0; i < emails.length; i += batchSize) {
          const batch = emails.slice(i, i + batchSize);
          const userListResponse = await clerk.users.getUserList({
            emailAddress: batch,
            limit: batch.length,
          });
          clerkUsers.push(...(userListResponse.data as unknown as ClerkUser[]));
        }
      } catch (clerkError) {
        console.error("Clerk API error when fetching users:", clerkError);
      }
    }

    const enrichedCollaborators = collaborators.map((c) => {
      const user = clerkUsers.find((u) =>
        u.emailAddresses.some(
          (e) => e.emailAddress.toLowerCase() === c.email.toLowerCase()
        )
      );

      return {
        id: c.id,
        email: c.email,
        name: user
          ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || null
          : null,
        avatar: user?.imageUrl || null,
        isOwner: false,
      };
    });

    // 5. Fetch owner details from Clerk
    let ownerDetails = {
      id: "owner",
      email: "unknown@example.com",
      name: "Owner",
      avatar: null as string | null,
      isOwner: true,
    };

    try {
      const ownerUser = await clerk.users.getUser(project.ownerId);
      ownerDetails = {
        id: "owner",
        email: ownerUser.emailAddresses[0]?.emailAddress || "owner@example.com",
        name: `${ownerUser.firstName || ""} ${ownerUser.lastName || ""}`.trim() || ownerUser.username || "Owner",
        avatar: ownerUser.imageUrl || null,
        isOwner: true,
      };
    } catch (ownerError) {
      console.error("Clerk API error when fetching project owner:", ownerError);
    }

    return NextResponse.json({
      owner: ownerDetails,
      collaborators: enrichedCollaborators,
    });
  } catch (error) {
    console.error("Error in GET /api/projects/[projectId]/collaborators:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects/[projectId]/collaborators
 * Invites a collaborator by email (owner only).
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;

    // 1. Authenticate user
    const { userId, primaryEmail } = await getClerkIdentity();
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
      return NextResponse.json({ error: "Forbidden. Only the owner can invite collaborators." }, { status: 403 });
    }

    // 3. Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { email } = body;
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 4. Prevent owner from inviting themselves
    if (primaryEmail && cleanEmail === primaryEmail.toLowerCase()) {
      return NextResponse.json({ error: "You cannot invite yourself." }, { status: 400 });
    }

    // 5. Create collaborator record
    try {
      const collaborator = await prisma.projectCollaborator.create({
        data: {
          projectId,
          email: cleanEmail,
        },
      });

      return NextResponse.json(collaborator, { status: 201 });
    } catch (dbError) {
      if (dbError instanceof Prisma.PrismaClientKnownRequestError && dbError.code === "P2002") {
        return NextResponse.json({ error: "This user has already been invited." }, { status: 409 });
      }
      throw dbError;
    }
  } catch (error) {
    console.error("Error in POST /api/projects/[projectId]/collaborators:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
