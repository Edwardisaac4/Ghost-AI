"use client";

import { useState } from "react";
import {
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
  getBezierPath,
  getStraightPath,
  useReactFlow,
} from "@xyflow/react";
import { cn } from "@/lib/utils";

type EdgeRouting = "smoothstep" | "step" | "straight" | "bezier";

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
  data,
  style = {},
}: EdgeProps) {
  const routing = (data?.routing as EdgeRouting) || "smoothstep";

  // Calculate the appropriate path based on routing data
  let edgePath = "";
  let labelX = 0;
  let labelY = 0;

  if (routing === "straight") {
    [edgePath, labelX, labelY] = getStraightPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
    });
  } else if (routing === "bezier") {
    [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
  } else if (routing === "step") {
    [edgePath, labelX, labelY] = getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      borderRadius: 0, // Sharp angles
    });
  } else {
    // Default: smoothstep
    [edgePath, labelX, labelY] = getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      borderRadius: 8, // Rounded angles
    });
  }

  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [labelText, setLabelText] = useState((data?.label as string) || "");
  const { setEdges } = useReactFlow();

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setLabelText((data?.label as string) || "");
  };

  const handleSave = () => {
    setIsEditing(false);
    const trimmed = labelText.trim();
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === id) {
          return {
            ...edge,
            data: {
              ...edge.data,
              label: trimmed,
            },
          };
        }
        return edge;
      })
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setLabelText((data?.label as string) || "");
      setIsEditing(false);
    }
    e.stopPropagation();
  };

  const setRoutingType = (type: EdgeRouting) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === id) {
          return {
            ...edge,
            data: {
              ...edge.data,
              routing: type,
            },
          };
        }
        return edge;
      })
    );
  };

  // Compute active highlight color using project tokens
  const color = selected
    ? "var(--accent-primary)" // cyan brand accent
    : isHovered
    ? "#f8fafc" // bright slate/white
    : "rgba(248, 250, 252, 0.35)"; // dimmed at rest

  const markerId = `arrow-${id}`;

  return (
    <>
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path
            d="M 0 0 L 10 5 L 0 10 z"
            fill={color}
            className="transition-colors duration-200"
          />
        </marker>
      </defs>

      {/* Invisible thick path to capture hover & click events easily */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        className="cursor-pointer nodrag nopan"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDoubleClick={handleDoubleClick}
      />

      {/* Visible thin rendering path - override dynamic stroke color in style */}
      <path
        d={edgePath}
        fill="none"
        strokeWidth={2}
        markerEnd={`url(#${markerId})`}
        style={{ ...style, stroke: color }}
        className="pointer-events-none transition-all duration-200"
      />

      {/* Inline Label Editor and Line Style Toolbar */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan规则 z-30 flex flex-col items-center gap-1.5"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Edge Style Toolbar (only shown when selected) */}
          {selected && !isEditing && (
            <div
              className="bg-[#18181c]/95 border border-border-default rounded-full p-1 flex gap-1 shadow-lg shadow-black/40 select-none"
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                title="Smooth Step"
                onClick={() => setRoutingType("smoothstep")}
                className={cn(
                  "p-1.5 rounded-full hover:text-text-primary transition-colors cursor-pointer",
                  routing === "smoothstep"
                    ? "bg-accent-primary/10 text-accent-primary"
                    : "text-text-muted hover:bg-bg-subtle"
                )}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M2 14h4a2 2 0 002-2V6a2 2 0 012-2h4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <button
                type="button"
                title="Sharp Step"
                onClick={() => setRoutingType("step")}
                className={cn(
                  "p-1.5 rounded-full hover:text-text-primary transition-colors cursor-pointer",
                  routing === "step"
                    ? "bg-accent-primary/10 text-accent-primary"
                    : "text-text-muted hover:bg-bg-subtle"
                )}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M2 14h6V4h6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <button
                type="button"
                title="Straight"
                onClick={() => setRoutingType("straight")}
                className={cn(
                  "p-1.5 rounded-full hover:text-text-primary transition-colors cursor-pointer",
                  routing === "straight"
                    ? "bg-accent-primary/10 text-accent-primary"
                    : "text-text-muted hover:bg-bg-subtle"
                )}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M2 14L14 2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <button
                type="button"
                title="Curved Bezier"
                onClick={() => setRoutingType("bezier")}
                className={cn(
                  "p-1.5 rounded-full hover:text-text-primary transition-colors cursor-pointer",
                  routing === "bezier"
                    ? "bg-accent-primary/10 text-accent-primary"
                    : "text-text-muted hover:bg-bg-subtle"
                )}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M2 14C6 14 10 2 14 2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}

          {/* Label Display / Input */}
          {isEditing ? (
            <div className="relative inline-flex items-center justify-center min-w-[70px] bg-bg-elevated border border-accent-primary rounded-full px-2.5 py-1 shadow-lg shadow-black/50">
              <span className="invisible whitespace-pre text-xs font-semibold px-1 h-0">
                {labelText || "Add label..."}
              </span>
              <input
                autoFocus
                type="text"
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="absolute inset-0 w-full text-center bg-transparent border-none outline-none text-xs font-semibold text-text-primary px-2 py-1 rounded-full focus:ring-0"
                placeholder="Add label..."
              />
            </div>
          ) : (
            // Show badge if label exists, or if hovered/selected show a faint placeholder
            (data?.label || isHovered || selected) && (
              <button
                type="button"
                onDoubleClick={handleDoubleClick}
                className={cn(
                  "text-xs font-semibold rounded-full px-2.5 py-1 border transition-all shadow-md cursor-text select-none",
                  data?.label
                    ? "bg-bg-elevated text-text-primary border-border-default hover:border-accent-primary"
                    : "bg-bg-surface/80 text-text-muted/50 border-border-subtle/30 border-dashed hover:text-text-muted hover:border-border-subtle"
                )}
                style={{
                  borderColor: selected ? "var(--accent-primary)" : undefined,
                  boxShadow: selected ? "0 0 6px rgba(0, 200, 212, 0.2)" : undefined,
                }}
              >
                {(data?.label as string) || "Add label"}
              </button>
            )
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
