"use client";

import { useState } from "react";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProjectActions, Project } from "@/hooks/use-project-actions";
import { Sparkles, Send, X, Bot, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShareDialog } from "@/components/editor/share-dialog";
import { CollaborativeCanvas } from "@/components/editor/collaborative-canvas";

interface EditorWorkspaceClientProps {
  project: Project;
  ownedProjects: Project[];
  sharedProjects: Project[];
}

export function EditorWorkspaceClient({
  project,
  ownedProjects,
  sharedProjects,
}: EditorWorkspaceClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(true);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const {
    isCreateOpen,
    setIsCreateOpen,
    createName,
    setCreateName,
    createRoomId,
    isCreating,
    handleCreate,

    isRenameOpen,
    setIsRenameOpen,
    renameTarget,
    renameName,
    setRenameName,
    isRenaming,
    openRename,
    handleRename,

    isDeleteOpen,
    setIsDeleteOpen,
    deleteTarget,
    isDeleting,
    openDelete,
    handleDelete,
  } = useProjectActions();

  return (
    <div className="relative flex flex-col h-screen w-screen overflow-hidden bg-bg-base text-text-primary">
      {/* Top Navbar */}
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        projectName={project.name}
        isAiSidebarOpen={isAiSidebarOpen}
        onToggleAiSidebar={() => setIsAiSidebarOpen((prev) => !prev)}
        onShareClick={() => setIsShareOpen(true)}
      />

      {/* Main Container */}
      <div className="relative flex flex-1 h-[calc(100vh-3.5rem)] overflow-hidden">
        {/* Project Sidebar (Left, Fixed) */}
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onCreateProject={() => setIsCreateOpen(true)}
          onRenameProject={openRename}
          onDeleteProject={openDelete}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
          activeProjectId={project.id}
        />

        {/* Central Canvas Area (fills space between sidebars) */}
        <main className="flex-1 h-full bg-bg-base relative">
          <CollaborativeCanvas />
        </main>

        {/* AI Sidebar Placeholder (Right, Fixed) */}
        <aside
          className={cn(
            "fixed top-18 bottom-4 right-0 z-30 w-80 h-[calc(100vh-5.5rem)] bg-bg-surface/85 backdrop-blur-md border border-border-default flex flex-col transition-transform duration-300 ease-in-out shadow-2xl rounded-2xl",
            isAiSidebarOpen ? "-translate-x-4" : "translate-x-full"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border-default bg-transparent">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-accent-ai/10 text-accent-ai-text border border-accent-ai/20">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text-primary">AI Architect</h3>
                <p className="text-[10px] text-text-muted">Interactive co-pilot</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsAiSidebarOpen(false)}
              className="h-8 w-8 text-text-muted hover:text-text-primary hover:bg-bg-subtle transition-colors cursor-pointer"
              aria-label="Close AI sidebar"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Chat Logs scrollable area */}
          <ScrollArea className="flex-1 p-4 bg-bg-base/30">
            <div className="space-y-4">
              {/* Message from AI */}
              <div className="flex gap-2.5 max-w-[85%]">
                <div className="shrink-0 w-7 h-7 rounded-full bg-accent-ai/10 border border-accent-ai/20 flex items-center justify-center text-accent-ai-text">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <div className="p-3 rounded-2xl rounded-tl-none bg-bg-surface border border-border-default text-xs text-text-secondary leading-relaxed">
                    Hello! I am your AI Architect co-pilot. Once our chat backend is live, you can ask me to:
                    <ul className="list-disc list-inside mt-2 space-y-1 text-text-muted">
                      <li>Generate design schemas</li>
                      <li>Review database scalability</li>
                      <li>Explain custom system patterns</li>
                    </ul>
                  </div>
                  <span className="text-[9px] text-text-faint pl-1 font-mono">System</span>
                </div>
              </div>

              {/* Mock User Message */}
              <div className="flex gap-2.5 max-w-[85%] ml-auto justify-end">
                <div className="space-y-1 text-right">
                  <div className="p-3 rounded-2xl rounded-tr-none bg-accent-ai/10 border border-accent-ai/20 text-xs text-text-primary text-left leading-relaxed">
                    How will we manage complex microservice integrations in this room?
                  </div>
                  <span className="text-[9px] text-text-faint pr-1 font-mono">You (Mock)</span>
                </div>
              </div>

              {/* Mock AI Response */}
              <div className="flex gap-2.5 max-w-[85%]">
                <div className="shrink-0 w-7 h-7 rounded-full bg-accent-ai/10 border border-accent-ai/20 flex items-center justify-center text-accent-ai-text">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <div className="p-3 rounded-2xl rounded-tl-none bg-bg-surface border border-border-default text-xs text-text-secondary leading-relaxed">
                    Once the canvas integrations are active, you can place API Gateways, Message Brokers, and Service nodes directly. I can then analyze structural diagrams to trace messages and suggest optimal protocols.
                  </div>
                  <span className="text-[9px] text-text-faint pl-1 font-mono">AI Architect</span>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Bottom Chat Input Form */}
          <div className="p-4 border-t border-border-default bg-transparent">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Ask the AI Architect..."
                disabled
                className="w-full bg-bg-base border border-border-default focus:border-accent-ai/50 text-text-primary rounded-xl pl-4 pr-10 py-2.5 text-xs outline-none transition-colors disabled:opacity-60"
              />
              <Button
                variant="ghost"
                size="icon"
                disabled
                className="absolute right-1 text-text-faint hover:text-accent-ai-text hover:bg-bg-subtle disabled:opacity-40 cursor-not-allowed h-8 w-8"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-[9px] text-text-faint text-center mt-2 flex items-center justify-center gap-1">
              <HelpCircle className="h-3 w-3" />
              AI generation is currently in simulation mode.
            </p>
          </div>
        </aside>
      </div>

      {/* Create Project Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription>
              Enter a name for your new architecture workspace. Slugs will be generated automatically.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreate();
            }}
            className="space-y-4 py-4"
          >
            <div>
              <label className="block text-xs font-medium text-text-muted mb-2 uppercase tracking-wider">
                Project Name
              </label>
              <input
                type="text"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="e.g. Microservices Architecture"
                required
                autoFocus
                className="w-full bg-bg-base border border-border-default focus:border-accent-primary text-text-primary rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                disabled={isCreating}
              />
            </div>

            {createRoomId && (
              <div className="rounded-xl bg-bg-base p-3 border border-border-default/50 space-y-1">
                <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider">
                  Room ID Preview
                </p>
                <p className="text-xs font-mono text-text-secondary truncate">
                  {createRoomId}
                </p>
              </div>
            )}
          </form>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateOpen(false)}
              className="border border-border-default hover:bg-bg-subtle text-text-secondary rounded-xl transition-all cursor-pointer"
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              className="bg-accent-primary hover:bg-accent-primary/90 text-bg-base font-semibold rounded-xl transition-all cursor-pointer"
              disabled={isCreating || !createName.trim()}
            >
              {isCreating ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Project Dialog */}
      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename Project</DialogTitle>
            <DialogDescription>
              Rename your workspace. Current name: <span className="font-semibold text-text-primary">{renameTarget?.name}</span>
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRename();
            }}
            className="py-4"
          >
            <div>
              <label className="block text-xs font-medium text-text-muted mb-2 uppercase tracking-wider">
                New Name
              </label>
              <input
                type="text"
                value={renameName}
                onChange={(e) => setRenameName(e.target.value)}
                placeholder="e.g. Renamed Workspace"
                required
                autoFocus
                className="w-full bg-bg-base border border-border-default focus:border-accent-primary text-text-primary rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                disabled={isRenaming}
              />
            </div>
          </form>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRenameOpen(false)}
              className="border border-border-default hover:bg-bg-subtle text-text-secondary rounded-xl transition-all cursor-pointer"
              disabled={isRenaming}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRename}
              className="bg-accent-primary hover:bg-accent-primary/90 text-bg-base font-semibold rounded-xl transition-all cursor-pointer"
              disabled={isRenaming || !renameName.trim()}
            >
              {isRenaming ? "Renaming..." : "Rename"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Project Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <span className="font-semibold text-text-primary">{deleteTarget?.name}</span>? This action is permanent and cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              className="border border-border-default hover:bg-bg-subtle text-text-secondary rounded-xl transition-all cursor-pointer"
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold rounded-xl transition-all cursor-pointer"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <ShareDialog
        isOpen={isShareOpen}
        onOpenChange={setIsShareOpen}
        projectId={project.id}
        ownerId={project.ownerId}
      />
    </div>
  );
}
