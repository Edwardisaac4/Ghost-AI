import { NextRequest, NextResponse } from "next/server";
import { getClerkIdentity, hasProjectAccess } from "@/lib/project-access";
import { currentUser } from "@clerk/nextjs/server";
import { getLiveblocksClient, getUserColor } from "@/lib/liveblocks-client";

/**
 * POST /api/liveblocks-auth
 * Authenticates users for a specific Liveblocks room (associated with a project).
 * Enforces Clerk authentication and project-level workspace authorization.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Require Clerk authentication
    const { userId, primaryEmail } = await getClerkIdentity();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse room ID from request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { room } = body;
    if (typeof room !== "string" || !room) {
      return NextResponse.json({ error: "Room ID is required" }, { status: 400 });
    }

    // 3. Verify project access using the existing access helper
    const { hasAccess, project } = await hasProjectAccess(room, userId, primaryEmail);
    if (!hasAccess || !project) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const liveblocksClient = getLiveblocksClient();

    // 4. Ensure the Liveblocks room exists (create only if needed)
    try {
      await liveblocksClient.getOrCreateRoom(room, {
        defaultAccesses: [], // Make the room private by default
      });
    } catch (roomError) {
      console.error(`Failed to get or create Liveblocks room ${room}:`, roomError);
      return NextResponse.json(
        { error: "Failed to initialize collaboration room" },
        { status: 500 }
      );
    }

    // 5. Retrieve Clerk user details to attach user metadata to the session
    const user = await currentUser();
    const name = user
      ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || "Anonymous"
      : "Anonymous";
    const avatar = user?.imageUrl || "";
    const color = getUserColor(userId);

    // 6. Create Liveblocks session and authorize the user for the room
    const session = liveblocksClient.prepareSession(userId, {
      userInfo: {
        name,
        avatar,
        color,
      },
    });

    // Authorize read/write (FULL_ACCESS) to this specific room/project ID
    session.allow(room, session.FULL_ACCESS);

    const { status, body: authResponseBody } = await session.authorize();
    return new Response(authResponseBody, { status });
  } catch (error) {
    console.error("Error in POST /api/liveblocks-auth:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
