import Link from "next/link";
import { Lock, ArrowLeft } from "lucide-react";

export function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg-base text-text-primary px-6 relative overflow-hidden select-none">
      {/* Visual background ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-state-error/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-accent-primary/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f24_1px,transparent_1px),linear-gradient(to_bottom,#1f1f24_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-md w-full p-8 md:p-10 rounded-3xl bg-bg-surface/80 border border-border-default backdrop-blur-xl text-center shadow-2xl space-y-8">
        
        {/* Glow Icon Container */}
        <div className="flex justify-center">
          <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-bg-elevated border border-border-default shadow-xl group">
            {/* Glowing ring animation */}
            <div className="absolute inset-0 rounded-2xl bg-state-error/20 blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative p-4 rounded-xl bg-bg-surface border border-border-default/50 text-state-error animate-pulse">
              <Lock className="h-8 w-8 drop-shadow-[0_0_8px_rgba(255,77,79,0.5)]" />
            </div>
          </div>
        </div>

        {/* Text Area */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold tracking-tight text-text-primary font-sans">
            Access Denied
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            You do not have permission to access this workspace. It may have been deleted, or you might not be added as a collaborator.
          </p>
          <p className="text-xs text-text-muted">
            Please make sure you are logged into the correct account or request access from the project owner.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-border-default/50">
          <Link
            href="/editor"
            className="inline-flex items-center justify-center gap-2 w-full bg-bg-elevated hover:bg-bg-subtle text-text-primary border border-border-default hover:border-border-subtle font-semibold py-3 px-4 rounded-xl transition-all cursor-pointer shadow-lg hover:shadow-xl active:scale-[0.98] group"
          >
            <ArrowLeft className="h-4 w-4 text-text-muted group-hover:text-text-primary transition-colors" />
            <span>Return to Editor Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
