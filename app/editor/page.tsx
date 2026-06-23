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
import { Layers } from "lucide-react";

export default function EditorPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
          onCreateProject={() => setIsDialogOpen(true)}
        />

        {/* Canvas Area Placeholder */}
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
              Workspace Editor Chrome
            </h1>
            <p className="text-sm text-text-muted max-w-md mb-8">
              Toggle the sidebar using the top-left navbar button, switch tabs to inspect empty states, or open the Create Project dialog to see our custom styled modal backdrop and premium layout.
            </p>

            {/* Interaction Buttons */}
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-accent-primary hover:bg-accent-primary/95 text-bg-base font-semibold py-2 px-6 rounded-xl transition-all cursor-pointer shadow-lg shadow-accent-primary/10"
              >
                Trigger Mock Dialog
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsSidebarOpen((prev) => !prev)}
                className="border border-border-default hover:bg-bg-subtle text-text-secondary rounded-xl transition-all cursor-pointer"
              >
                {isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
              </Button>
            </div>
          </div>
        </main>
      </div>

      {/* Mock Project Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription>
              Enter a name for your new architecture workspace. Slugs will be generated automatically.
            </DialogDescription>
          </DialogHeader>

          {/* Mock input field */}
          <div className="py-4">
            <label className="block text-xs font-medium text-text-muted mb-2 uppercase tracking-wider">
              Project Name
            </label>
            <input
              type="text"
              placeholder="e.g. Microservices Architecture"
              className="w-full bg-bg-base border border-border-default focus:border-accent-primary text-text-primary rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="border border-border-default hover:bg-bg-subtle text-text-secondary rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={() => setIsDialogOpen(false)}
              className="bg-accent-primary hover:bg-accent-primary/90 text-bg-base font-semibold rounded-xl transition-all cursor-pointer"
            >
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
