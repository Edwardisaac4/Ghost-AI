"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  UserPlus,
  Trash2,
  Copy,
  Check,
  Loader2,
  Mail,
  Shield,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Collaborator {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  isOwner?: boolean;
}

interface ShareDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  ownerId: string;
}

export function ShareDialog({
  isOpen,
  onOpenChange,
  projectId,
  ownerId,
}: ShareDialogProps) {
  const { userId } = useAuth();
  const isOwner = userId === ownerId;

  // Collaborators List
  const [owner, setOwner] = useState<Collaborator | null>(null);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Invite states
  const [emailInput, setEmailInput] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [inviteError, setInviteError] = useState("");

  // Remove states
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Clipboard copy state
  const [shareUrl, setShareUrl] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  // Retrieve current window location for share URL exactly once on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        setShareUrl(window.location.href);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Fetch collaborators helper (memoized)
  const fetchCollaborators = useCallback(async () => {
    setIsLoading(true);
    setInviteError("");
    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`);
      if (!response.ok) {
        throw new Error("Failed to load collaborators");
      }
      const data = await response.json();
      setOwner(data.owner);
      setCollaborators(data.collaborators || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  // Load collaborators when dialog opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        fetchCollaborators();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, fetchCollaborators]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || isInviting) return;

    setIsInviting(true);
    setInviteError("");

    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to invite collaborator");
      }

      // Success: Reload collaborators list and clear input
      setEmailInput("");
      fetchCollaborators();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setInviteError(message);
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveCollaborator = async (collaboratorId: string) => {
    if (removingId) return;

    setRemovingId(collaboratorId);
    try {
      const response = await fetch(
        `/api/projects/${projectId}/collaborators/${collaboratorId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove collaborator");
      }

      // Filter local state list
      setCollaborators((prev) => prev.filter((c) => c.id !== collaboratorId));
    } catch (err) {
      console.error(err);
      alert("Failed to remove collaborator. Please try again.");
    } finally {
      setRemovingId(null);
    }
  };

  const handleCopy = async () => {
    if (!shareUrl || isCopied) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy url: ", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-bg-surface border-border-default text-text-primary rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-accent-primary" />
            <span>Share Project</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-text-muted">
            Invite collaborators by email to view and work on this architecture workspace.
          </DialogDescription>
        </DialogHeader>

        {/* Invite Form (Owner Only) */}
        {isOwner ? (
          <form onSubmit={handleInvite} className="space-y-2 pt-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    setInviteError("");
                  }}
                  placeholder="name@company.com"
                  required
                  className="w-full bg-bg-base border border-border-default focus:border-accent-primary/60 text-text-primary rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-colors"
                  disabled={isInviting}
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-faint" />
              </div>
              <Button
                type="submit"
                disabled={isInviting || !emailInput.trim()}
                className="bg-accent-primary hover:bg-accent-primary/95 text-bg-base font-semibold px-4 rounded-xl transition-all cursor-pointer shadow-lg shadow-accent-primary/10 flex items-center gap-1.5"
              >
                {isInviting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span>Invite</span>
                )}
              </Button>
            </div>
            {inviteError && (
              <p className="text-xs text-state-error font-medium px-1">
                {inviteError}
              </p>
            )}
          </form>
        ) : (
          <div className="p-3 rounded-xl bg-bg-base border border-border-default/50 text-xs text-text-muted flex items-center gap-2 mt-2">
            <Shield className="h-4 w-4 text-accent-primary/70" />
            <span>You are viewing this workspace as a collaborator (Read-Only access).</span>
          </div>
        )}

        {/* Collaborators List */}
        <div className="space-y-3 pt-3">
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Collaborators with Access
          </h4>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-2">
              <Loader2 className="h-6 w-6 text-accent-primary animate-spin" />
              <p className="text-xs text-text-faint font-mono">Loading access logs...</p>
            </div>
          ) : (
            <ScrollArea className="max-h-[220px] pr-2">
              <div className="space-y-2">
                {/* Project Owner Row */}
                {owner && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-bg-base/30 border border-border-default/30">
                    <div className="flex items-center gap-3 min-w-0">
                      {owner.avatar ? (
                        <Image
                          src={owner.avatar}
                          alt={owner.name || "Owner"}
                          width={32}
                          height={32}
                          unoptimized
                          className="h-8 w-8 rounded-full border border-border-default object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary text-xs font-bold font-mono">
                          {owner.name?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-text-primary truncate">
                          {owner.name || "Project Owner"}
                        </p>
                        <p className="text-[10px] text-text-muted truncate">
                          {owner.email}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-accent-primary bg-accent-primary-dim border border-accent-primary/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono scale-90">
                      Owner
                    </span>
                  </div>
                )}

                {/* Invited Collaborators List */}
                {collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-bg-base/20 border border-border-default/20 hover:border-border-default/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {collaborator.avatar ? (
                        <Image
                          src={collaborator.avatar}
                          alt={collaborator.name || collaborator.email}
                          width={32}
                          height={32}
                          unoptimized
                          className="h-8 w-8 rounded-full border border-border-default object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-accent-ai/10 border border-accent-ai/20 flex items-center justify-center text-accent-ai-text text-xs font-bold font-mono">
                          {(collaborator.name || collaborator.email)
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        {collaborator.name && (
                          <p className="text-xs font-semibold text-text-primary truncate">
                            {collaborator.name}
                          </p>
                        )}
                        <p className="text-[10px] text-text-muted truncate">
                          {collaborator.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-text-muted bg-bg-elevated border border-border-default px-2 py-0.5 rounded-full uppercase tracking-wider font-mono scale-90">
                        Member
                      </span>

                      {/* Remove Button (Owner Only) */}
                      {isOwner && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleRemoveCollaborator(collaborator.id)
                          }
                          disabled={removingId === collaborator.id}
                          className="h-7 w-7 text-text-muted hover:text-destructive hover:bg-destructive/10 transition-colors rounded-lg cursor-pointer"
                          title="Remove collaborator"
                        >
                          {removingId === collaborator.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                {collaborators.length === 0 && (
                  <div className="py-6 text-center text-xs text-text-faint font-mono">
                    No active collaborators yet.
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Copy Link Footer */}
        <div className="pt-4 border-t border-border-default/60 space-y-2">
          <label className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
            Copy Link
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-bg-base border border-border-default text-text-muted select-all rounded-xl px-3.5 py-2 text-xs outline-none font-mono truncate"
            />
            <Button
              onClick={handleCopy}
              className={cn(
                "px-3.5 rounded-xl font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 border min-w-[90px]",
                isCopied
                  ? "bg-state-success/10 border-state-success/35 text-state-success hover:bg-state-success/15"
                  : "bg-bg-elevated hover:bg-bg-subtle text-text-primary border-border-default hover:border-border-subtle"
              )}
            >
              {isCopied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
