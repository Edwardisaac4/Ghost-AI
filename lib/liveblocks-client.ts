import { Liveblocks } from "@liveblocks/node";

const globalForLiveblocks = globalThis as unknown as {
  liveblocks: Liveblocks | undefined;
};

// Caches the Liveblocks client to avoid multiple instances in development
export function getLiveblocksClient(): Liveblocks {
  if (!globalForLiveblocks.liveblocks) {
    globalForLiveblocks.liveblocks = new Liveblocks({
      secret: process.env.LIVEBLOCKS_SECRET_KEY || "sk_dummy_key_for_build",
    });
  }
  return globalForLiveblocks.liveblocks;
}

// Hand-selected palette of 8 vibrant, high-contrast, and aesthetic colors 
// designed to stand out nicely on dark mode and modern workspaces.
const PALETTE = [
  "#FF5C00", // Bright Orange
  "#FF007A", // Vibrant Pink
  "#7B00FF", // Purple Accent
  "#00F0FF", // Electric Cyan
  "#00FF66", // Cyber Green
  "#FFE600", // Yellow Accent
  "#00A3FF", // Sky Blue
  "#FF3333", // Coral Red
];

/**
 * Deterministically maps a user ID (e.g. Clerk user ID) to a consistent color from the fixed palette.
 */
export function getUserColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PALETTE.length;
  return PALETTE[index];
}
