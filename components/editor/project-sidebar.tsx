"use client";

import { FolderClosed, Share2, Plus, X, Pencil, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Project } from "@/hooks/use-project-actions";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject?: () => void;
  onRenameProject?: (project: Project) => void;
  onDeleteProject?: (project: Project) => void;
  ownedProjects?: Project[];
  sharedProjects?: Project[];
  activeProjectId?: string;
}

export function ProjectSidebar({
  isOpen,
  onClose,
  onCreateProject,
  onRenameProject,
  onDeleteProject,
  ownedProjects = [],
  sharedProjects = [],
  activeProjectId,
}: ProjectSidebarProps) {
  const router = useRouter();

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
        <div className="flex-1 p-4 overflow-y-auto flex flex-col min-h-0">
          <Tabs defaultValue="my-projects" className="w-full flex-1 flex flex-col gap-4 min-h-0">
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
              className="flex-1 flex flex-col min-h-0 focus-visible:outline-none"
            >
              {ownedProjects.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-border-default rounded-xl bg-bg-base/40">
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
                </div>
              ) : (
                <ScrollArea className="flex-1 -mx-2 px-2">
                  <div className="space-y-1 py-1">
                    {ownedProjects.map((project) => {
                      const isActive = activeProjectId === project.id;
                      return (
                        <div
                          key={project.id}
                          onClick={() => {
                            router.push(`/editor/${project.id}`);
                            onClose();
                          }}
                          className={cn(
                            "group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none",
                            isActive
                              ? "bg-bg-subtle border-border-default"
                              : "border-transparent hover:border-border-default hover:bg-bg-subtle/50"
                          )}
                        >
                          <div className="flex-1 min-w-0 pr-2">
                            <p className="text-sm font-medium text-text-primary truncate">
                              {project.name}
                            </p>
                            {project.description && (
                              <p className="text-xs text-text-muted truncate mt-0.5">
                                {project.description}
                              </p>
                            )}
                            <p className="text-[10px] text-text-faint flex items-center gap-1 mt-1 font-mono">
                              <Calendar className="h-3 w-3" />
                              {new Date(project.createdAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>

                          {/* Hover Actions */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRenameProject?.(project);
                              }}
                              className="text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors cursor-pointer"
                              title="Rename Project"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteProject?.(project);
                              }}
                              className="text-text-muted hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                              title="Delete Project"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>

            {/* Shared Tab Content */}
            <TabsContent
              value="shared"
              className="flex-1 flex flex-col min-h-0 focus-visible:outline-none"
            >
              {sharedProjects.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-border-default rounded-xl bg-bg-base/40">
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
                </div>
              ) : (
                <ScrollArea className="flex-1 -mx-2 px-2">
                  <div className="space-y-1 py-1">
                    {sharedProjects.map((project) => {
                      const isActive = activeProjectId === project.id;
                      return (
                        <div
                          key={project.id}
                          onClick={() => {
                            router.push(`/editor/${project.id}`);
                            onClose();
                          }}
                          className={cn(
                            "group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none",
                            isActive
                              ? "bg-bg-subtle border-border-default"
                              : "border-transparent hover:border-border-default hover:bg-bg-subtle/50"
                          )}
                        >
                          <div className="flex-1 min-w-0 pr-2">
                            <p className="text-sm font-medium text-text-primary truncate">
                              {project.name}
                            </p>
                            {project.description && (
                              <p className="text-xs text-text-muted truncate mt-0.5">
                                {project.description}
                              </p>
                            )}
                            <p className="text-[10px] text-text-faint flex items-center gap-1 mt-1 font-mono">
                              <Calendar className="h-3 w-3" />
                              {new Date(project.createdAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              )}
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
