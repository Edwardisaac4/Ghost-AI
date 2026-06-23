import { useEffect } from "react";

interface KeyboardShortcutsHandlers {
  undo: () => void;
  redo: () => void;
}

/**
 * useKeyboardShortcuts listens to window keydown events and triggers
 * zoom in, zoom out, undo, and redo canvas actions while avoiding
 * interception during text entry.
 */
export function useKeyboardShortcuts(
  reactFlowInstance: { zoomIn: (opts?: { duration?: number }) => void; zoomOut: (opts?: { duration?: number }) => void } | null,
  { undo, redo }: KeyboardShortcutsHandlers
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      // Ignore shortcuts if the user is typing in inputs, textareas, or contenteditable fields
      const isEditable =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable ||
        target.getAttribute("contenteditable") === "true";

      if (isEditable) return;

      const isCmdOrCtrl = event.metaKey || event.ctrlKey;
      const isShift = event.shiftKey;
      const key = event.key.toLowerCase();

      // Undo: Cmd/Ctrl + Z
      if (isCmdOrCtrl && !isShift && key === "z") {
        event.preventDefault();
        undo();
        return;
      }

      // Redo: Cmd/Ctrl + Shift + Z
      if (isCmdOrCtrl && isShift && key === "z") {
        event.preventDefault();
        redo();
        return;
      }

      // Redo: Cmd/Ctrl + Y
      if (isCmdOrCtrl && !isShift && key === "y") {
        event.preventDefault();
        redo();
        return;
      }

      // Zoom In: + or =
      if ((event.key === "+" || event.key === "=") && !isCmdOrCtrl) {
        event.preventDefault();
        reactFlowInstance?.zoomIn({ duration: 300 });
        return;
      }

      // Zoom Out: -
      if (event.key === "-" && !isCmdOrCtrl) {
        event.preventDefault();
        reactFlowInstance?.zoomOut({ duration: 300 });
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [reactFlowInstance, undo, redo]);
}
