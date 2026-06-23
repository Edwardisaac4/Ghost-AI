import { redirect } from "next/navigation";
import { getProjectsForUser } from "@/lib/project-data";
import { getClerkIdentity, hasProjectAccess } from "@/lib/project-access";
import { AccessDenied } from "@/components/editor/access-denied";
import { EditorWorkspaceClient } from "./editor-workspace-client";

import { WorkspaceCollaborativeWrapper } from "@/components/editor/workspace-collaborative-wrapper";

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;

  // 1. Get Clerk Identity
  const { userId, primaryEmail } = await getClerkIdentity();
  if (!userId) {
    redirect("/sign-in");
  }

  // 2. Check Project Access
  const { hasAccess, project } = await hasProjectAccess(roomId, userId, primaryEmail);
  if (!hasAccess || !project) {
    return <AccessDenied />;
  }

  // 3. Fetch Projects for sidebar listing
  const { owned, shared } = await getProjectsForUser();

  // 4. Serialize Dates for client-side boundary transmission
  const serializedOwned = owned.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  const serializedShared = shared.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  const serializedProject = {
    ...project,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };

  return (
    <WorkspaceCollaborativeWrapper roomId={roomId}>
      <EditorWorkspaceClient
        project={serializedProject}
        ownedProjects={serializedOwned}
        sharedProjects={serializedShared}
      />
    </WorkspaceCollaborativeWrapper>
  );
}
