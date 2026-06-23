"use client";

import { useState } from "react";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Layers, Plus } from "lucide-react";
import { useProjectActions, Project } from "@/hooks/use-project-actions";

interface EditorHomeClientProps {
  initialOwnedProjects: Project[];
  initialSharedProjects: Project[];
}

export function EditorHomeClient({
  initialOwnedProjects,
  initialSharedProjects,
}: EditorHomeClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
      />

      {/* Main Container */}
      <div className="relative flex flex-1 h-[calc(100vh-3.5rem)] overflow-hidden">
        {/* Project Sidebar */}
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onCreateProject={() => setIsCreateOpen(true)}
          onRenameProject={openRename}
          onDeleteProject={openDelete}
          ownedProjects={initialOwnedProjects}
          sharedProjects={initialSharedProjects}
        />

        {/* Canvas Area / Home Content */}
        <main className="flex-1 h-full bg-bg-base relative">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f24_1px,transparent_1px),linear-gradient(to_bottom,#1f1f24_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,var(--bg-base)_80%)]" />

          {/* Center Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
            <div className="p-4 rounded-3xl bg-bg-surface border border-border-default text-accent-primary mb-6 shadow-xl shadow-accent-primary/5 animate-pulse">
              <Layers className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-text-primary mb-3">
              Create a project or open an existing one
            </h1>
            <p className="text-sm text-text-muted max-w-md mb-8">
              Start a new architecture workspace, or choose a project from the sidebar.
            </p>

            {/* Interaction Buttons */}
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setIsCreateOpen(true)}
                className="bg-accent-primary hover:bg-accent-primary/95 text-bg-base font-semibold py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-lg shadow-accent-primary/10 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>New Project</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsSidebarOpen((prev) => !prev)}
                className="border border-border-default hover:bg-bg-subtle text-text-secondary rounded-xl transition-all cursor-pointer px-6 py-2.5"
              >
                {isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
              </Button>
            </div>
          </div>
        </main>
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
    </div>
  );
}
