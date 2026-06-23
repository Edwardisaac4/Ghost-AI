import { Layers } from "lucide-react";
import React from "react";

interface AuthPageLayoutProps {
  children: React.ReactNode;
}

export function AuthPageLayout({ children }: AuthPageLayoutProps) {
  return (
    <main className="min-h-screen w-screen flex bg-bg-base text-text-primary overflow-hidden">
      {/* Left Panel: visible on lg screens */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 border-r border-border-default bg-bg-surface select-none">
        {/* Top Section */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-bg-elevated border border-border-subtle text-accent-primary">
            <Layers className="h-5 w-5" />
          </div>
          <span className="font-semibold text-lg tracking-widest text-accent-primary">
            GHOST AI
          </span>
        </div>

        {/* Center Section */}
        <div className="max-w-md my-auto">
          <h2 className="text-3xl font-semibold tracking-tight mb-3">
            Real-time collaborative system design workspace.
          </h2>
          <p className="text-sm text-text-muted mb-8 leading-relaxed">
            Collaboratively map architectures on a live multiplayer canvas, trigger AI code-generation agents, and auto-generate clean technical specifications.
          </p>

          <ul className="space-y-4 text-sm text-text-secondary">
            <li className="flex items-start gap-3">
              <span className="text-accent-primary mt-1">•</span>
              <div>
                <span className="font-medium text-text-primary">Collaborative multiplayer canvas</span>
                <p className="text-xs text-text-muted mt-0.5">Real-time sync, cursors, presence indicators, and state snapshots.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent-primary mt-1">•</span>
              <div>
                <span className="font-medium text-text-primary">AI architecture generation</span>
                <p className="text-xs text-text-muted mt-0.5">Generate whole system architectures using natural language prompts.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent-primary mt-1">•</span>
              <div>
                <span className="font-medium text-text-primary">Persistent specs</span>
                <p className="text-xs text-text-muted mt-0.5">Auto-translate canvas designs into structured Markdown specifications.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Bottom Section */}
        <div className="text-xs text-text-faint">
          © {new Date().getFullYear()} Ghost AI. All rights reserved.
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-bg-base">
        <div className="w-full max-w-[400px]">
          {/* Logo on small screens only */}
          <div className="flex items-center gap-2 mb-8 lg:hidden justify-center">
            <Layers className="h-6 w-6 text-accent-primary" />
            <span className="font-semibold text-base tracking-widest text-accent-primary">
              GHOST AI
            </span>
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}
