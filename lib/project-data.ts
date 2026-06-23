import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export interface ProjectData {
  id: string;
  ownerId: string;
  name: string;
  description: string | null;
  status: string;
  canvasJsonPath: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function getProjectsForUser(): Promise<{
  owned: ProjectData[];
  shared: ProjectData[];
}> {
  const { userId } = await auth();
  if (!userId) {
    return { owned: [], shared: [] };
  }

  const user = await currentUser();
  const emails = user?.emailAddresses.map((e) => e.emailAddress) || [];

  const [owned, shared] = await Promise.all([
    prisma.project.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    emails.length > 0
      ? prisma.project.findMany({
          where: {
            collaborators: {
              some: {
                email: {
                  in: emails,
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        })
      : Promise.resolve([]),
  ]);

  return {
    owned: owned as unknown as ProjectData[],
    shared: shared as unknown as ProjectData[],
  };
}
