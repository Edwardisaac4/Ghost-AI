"use client";

import { FolderClosed, Share2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject?: () => void;
}

export function ProjectSidebar({
  isOpen,
  onClose,
  onCreateProject,
}: ProjectSidebarProps) {
  return (
    <>
      {/* Mobile Backdrop Scrim */}
      {isOpen && (
        <div
          className="fixed inset-0 top-14 bg-black/60 backdrop-blur-sm z-20 md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Floating Sidebar Shell */}
      <aside
        className={cn(
          "fixed top-14 left-0 z-30 w-80 h-[calc(100vh-3.5rem)] bg-bg-surface border-r border-border-default flex flex-col transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-default">
          <h2 className="text-sm font-semibold tracking-wider text-text-primary uppercase">
            Projects
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-text-muted hover:text-text-primary hover:bg-bg-subtle transition-colors cursor-pointer"
            aria-label="Close projects sidebar"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Tabs & Content */}
        <div className="flex-1 p-4 overflow-y-auto flex flex-col">
          <Tabs defaultValue="my-projects" className="w-full flex-1 flex flex-col gap-4">
            <TabsList className="w-full grid grid-cols-2 bg-bg-base border border-border-default rounded-lg p-[3px]">
              <TabsTrigger
                value="my-projects"
                className="py-1.5 text-xs font-medium transition-all"
              >
                My Projects
              </TabsTrigger>
              <TabsTrigger
                value="shared"
                className="py-1.5 text-xs font-medium transition-all"
              >
                Shared
              </TabsTrigger>
            </TabsList>

            {/* My Projects Tab Content */}
            <TabsContent
              value="my-projects"
              className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-border-default rounded-xl bg-bg-base/40"
            >
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="p-3 rounded-full bg-bg-elevated border border-border-default text-accent-primary/80">
                  <FolderClosed className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-text-primary">
                    No projects yet
                  </p>
                  <p className="text-xs text-text-muted max-w-[200px]">
                    Create your first architecture workspace to get started.
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Shared Tab Content */}
            <TabsContent
              value="shared"
              className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-border-default rounded-xl bg-bg-base/40"
            >
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="p-3 rounded-full bg-bg-elevated border border-border-default text-accent-ai-text/80">
                  <Share2 className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-text-primary">
                    No shared projects
                  </p>
                  <p className="text-xs text-text-muted max-w-[200px]">
                    Workspaces shared with you by other collaborators will appear here.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border-default bg-bg-surface mt-auto">
          <Button
            onClick={() => onCreateProject?.()}
            className="w-full flex items-center justify-center gap-2 bg-accent-primary hover:bg-accent-primary/90 text-bg-base font-semibold py-2 rounded-xl transition-all cursor-pointer shadow-lg shadow-accent-primary/10"
          >
            <Plus className="h-5 w-5" />
            <span>New Project</span>
          </Button>
        </div>
      </aside>
    </>
  );
}
