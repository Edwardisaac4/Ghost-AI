import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  status: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  ownerId: string;
}

export function useProjectActions() {
  const router = useRouter();
  const pathname = usePathname();

  // Create Project States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [suffix, setSuffix] = useState("");

  const handleOpenCreateChange = (open: boolean) => {
    if (open) {
      setSuffix(Math.random().toString(36).substring(2, 7));
      setCreateName("");
    }
    setIsCreateOpen(open);
  };

  // Derive createRoomId on the fly from createName and suffix
  let createRoomId = "";
  if (createName.trim()) {
    const slug = createName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w\-]+/g, "") // Remove all non-word chars except -
      .replace(/\-\-+/g, "-"); // Replace multiple - with single -
    
    createRoomId = slug ? `${slug}-${suffix}` : suffix;
  }

  // Rename Project States
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<Project | null>(null);
  const [renameName, setRenameName] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);

  const openRename = (project: Project) => {
    setRenameTarget(project);
    setRenameName(project.name);
    setIsRenameOpen(true);
  };

  // Delete Project States
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openDelete = (project: Project) => {
    setDeleteTarget(project);
    setIsDeleteOpen(true);
  };

  // Operations
  const handleCreate = async () => {
    if (!createName.trim()) return;
    setIsCreating(true);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: createRoomId,
          name: createName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const data = await response.json();
      setIsCreateOpen(false);
      router.push(`/editor/${data.id}`);
      router.refresh();
    } catch (error) {
      console.error("Create project error:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleRename = async () => {
    if (!renameTarget || !renameName.trim()) return;
    setIsRenaming(true);
    try {
      const response = await fetch(`/api/projects/${renameTarget.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: renameName }),
      });

      if (!response.ok) {
        throw new Error("Failed to rename project");
      }

      setIsRenameOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Rename project error:", error);
    } finally {
      setIsRenaming(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/projects/${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      setIsDeleteOpen(false);

      const isActiveWorkspace = pathname === `/editor/${deleteTarget.id}`;
      if (isActiveWorkspace) {
        router.push("/editor");
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error("Delete project error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isCreateOpen,
    setIsCreateOpen: handleOpenCreateChange,
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
  };
}
