"use client";

import { PanelLeftOpen, PanelLeftClose, Share2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

interface EditorNavbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  projectName?: string;
  isAiSidebarOpen?: boolean;
  onToggleAiSidebar?: () => void;
  onShareClick?: () => void;
}

export function EditorNavbar({
  isSidebarOpen,
  onToggleSidebar,
  projectName,
  isAiSidebarOpen,
  onToggleAiSidebar,
  onShareClick,
}: EditorNavbarProps) {
  return (
    <header className="h-14 w-full flex items-center justify-between px-4 border-b border-border-default bg-bg-surface text-text-primary z-40 select-none">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="h-9 w-9 text-text-muted hover:text-text-primary hover:bg-bg-subtle transition-colors cursor-pointer"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <PanelLeftOpen className="h-5 w-5" />
          )}
        </Button>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm tracking-widest text-accent-primary">GHOST AI</span>
          <span className="text-text-faint">/</span>
          {projectName ? (
            <span className="text-sm font-medium text-text-primary truncate max-w-[200px] md:max-w-[300px]" title={projectName}>
              {projectName}
            </span>
          ) : (
            <span className="text-xs text-text-secondary bg-bg-elevated px-2 py-0.5 rounded-full border border-border-default font-mono">
              Workspace
            </span>
          )}
        </div>
      </div>

      {/* Center Section */}
      <div className="flex items-center">
        {/* Center content placeholder */}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {projectName && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={onShareClick}
              className="h-9 gap-2 text-text-secondary border-border-default hover:bg-bg-subtle hover:text-text-primary rounded-xl cursor-pointer"
            >
              <Share2 className="h-4 w-4 text-accent-primary" />
              <span className="hidden sm:inline">Share</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleAiSidebar}
              className={cn(
                "h-9 w-9 text-text-muted hover:text-text-primary hover:bg-bg-subtle transition-colors cursor-pointer",
                isAiSidebarOpen && "text-accent-ai-text bg-accent-ai/10 border border-accent-ai/30"
              )}
              aria-label={isAiSidebarOpen ? "Close AI Sidebar" : "Open AI Sidebar"}
            >
              <Sparkles className="h-5 w-5" />
            </Button>
          </>
        )}
        <UserButton />
      </div>
    </header>
  );
}

