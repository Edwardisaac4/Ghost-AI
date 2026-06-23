import { getProjectsForUser } from "@/lib/project-data";
import { EditorHomeClient } from "./editor-home-client";

export default async function EditorPage() {
  const { owned, shared } = await getProjectsForUser();

  // Serialize Date objects to ISO strings for React Server Component boundaries
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

  return (
    <EditorHomeClient
      initialOwnedProjects={serializedOwned}
      initialSharedProjects={serializedShared}
    />
  );
}
