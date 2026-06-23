"use client";

import { ReactNode } from "react";
import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react/suspense";
import { ErrorBoundary } from "./error-boundary";

interface WorkspaceCollaborativeWrapperProps {
  roomId: string;
  children: ReactNode;
}

/**
 * WorkspaceCollaborativeWrapper injects Liveblocks collaboration contexts
 * and handles connection state (suspense loading & error boundaries) at the workspace level.
 */
export function WorkspaceCollaborativeWrapper({
  roomId,
  children,
}: WorkspaceCollaborativeWrapperProps) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id={roomId}
        initialPresence={{
          cursor: null,
          isThinking: false,
        }}
      >
        <ErrorBoundary
          fallback={
            <div className="flex h-screen w-screen items-center justify-center bg-bg-base text-text-primary">
              <div className="flex flex-col items-center gap-3 p-6 text-center max-w-sm">
                <span className="text-state-error text-lg font-bold">Connection Failed</span>
                <p className="text-xs text-text-secondary">
                  We lost connection to the collaboration room. Please check your network and refresh.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 px-4 py-2 text-xs font-semibold rounded-xl bg-accent-primary text-bg-base hover:bg-accent-primary/90 transition-all cursor-pointer"
                >
                  Reload Workspace
                </button>
              </div>
            </div>
          }
        >
          <ClientSideSuspense
            fallback={
              <div className="flex h-screen w-screen items-center justify-center bg-bg-base text-text-primary">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-primary border-t-transparent" />
                  <p className="text-xs font-mono text-text-secondary">Syncing workspace...</p>
                </div>
              </div>
            }
          >
            {children}
          </ClientSideSuspense>
        </ErrorBoundary>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
