"use client";

import { PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

interface EditorNavbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function EditorNavbar({
  isSidebarOpen,
  onToggleSidebar,
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
          <span className="text-xs text-text-secondary bg-bg-elevated px-2 py-0.5 rounded-full border border-border-default font-mono">
            Workspace
          </span>
        </div>
      </div>

      {/* Center Section */}
      <div className="flex items-center">
        {/* Center content placeholder */}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <UserButton />
      </div>
    </header>
  );
}
