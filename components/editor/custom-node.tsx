"use client";

import { useState, useEffect, useRef } from "react";
import { Handle, Position, NodeProps, NodeResizer, useReactFlow } from "@xyflow/react";
import { CanvasNode, CanvasShape, NODE_COLORS } from "@/types/canvas";
import { cn } from "@/lib/utils";

export interface ShapeBackgroundProps {
  shape: CanvasShape;
  color: string;
  selected: boolean;
  fillColor?: string;
}

export function ShapeBackground({ shape, color, selected, fillColor }: ShapeBackgroundProps) {
  const strokeColor = selected
    ? color
    : `color-mix(in srgb, ${color} 35%, var(--border-default))`;
  const strokeWidth = selected ? 2.5 : 1.5;
  const strokeOpacity = selected ? 1.0 : 0.8;
  const fill = fillColor || "var(--bg-surface)";

  if (shape === "diamond") {
    return (
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ overflow: "visible" }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <polygon
          points="50 0, 100 50, 50 100, 0 50"
          fill={fill}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeOpacity={strokeOpacity}
          vectorEffect="non-scaling-stroke"
          className="transition-all duration-200"
        />
      </svg>
    );
  }

  if (shape === "hexagon") {
    return (
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ overflow: "visible" }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <polygon
          points="50 0, 100 25, 100 75, 50 100, 0 75, 0 25"
          fill={fill}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeOpacity={strokeOpacity}
          vectorEffect="non-scaling-stroke"
          className="transition-all duration-200"
        />
      </svg>
    );
  }

  if (shape === "cylinder") {
    return (
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ overflow: "visible" }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M 0,15 V 85 A 50,15 0 0 0 100,85 V 15 Z"
          fill={fill}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeOpacity={strokeOpacity}
          vectorEffect="non-scaling-stroke"
          className="transition-all duration-200"
        />
        <ellipse
          cx={50}
          cy={15}
          rx={50}
          ry={15}
          fill={fill}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeOpacity={strokeOpacity}
          vectorEffect="non-scaling-stroke"
          className="transition-all duration-200"
        />
      </svg>
    );
  }

  return null;
}

/**
 * CustomCanvasNodeRenderer renders custom canvasNode types on the React Flow canvas.
 * Renders rectangle, pill, and circle using CSS styling, and diamond, hexagon,
 * and cylinder using SVG shapes.
 */
export function CustomCanvasNodeRenderer({
  id,
  data,
  selected,
}: NodeProps<CanvasNode>) {
  const colorPair = NODE_COLORS.find((c) => c.fill === data.color) || NODE_COLORS[0];
  const color = colorPair.text; // Use the vivid text color as the main highlight/accent color
  const isSvgShape = ["diamond", "hexagon", "cylinder"].includes(data.shape);

  const [isEditing, setIsEditing] = useState(false);
  const [localLabel, setLocalLabel] = useState(data.label);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { updateNodeData } = useReactFlow();

  // Prevent keyboard events (like Spacebar or Backspace) from bubbling up to React Flow
  useEffect(() => {
    const handleNativeKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsEditing(false);
      }
      e.stopPropagation();
    };

    const stopNativePropagation = (e: KeyboardEvent) => {
      e.stopPropagation();
    };

    const textarea = textareaRef.current;
    if (isEditing && textarea) {
      textarea.addEventListener("keydown", handleNativeKeyDown);
      textarea.addEventListener("keyup", stopNativePropagation);
      textarea.addEventListener("keypress", stopNativePropagation);
      return () => {
        textarea.removeEventListener("keydown", handleNativeKeyDown);
        textarea.removeEventListener("keyup", stopNativePropagation);
        textarea.removeEventListener("keypress", stopNativePropagation);
      };
    }
  }, [isEditing]);

  // Handle focus and selection once when edit mode starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  // Adjust textarea height dynamically to prevent scrollbars/layout shifts as text changes
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [isEditing, localLabel]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setLocalLabel(val);
    updateNodeData(id, { label: val });
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    // Only trigger editing if we are not clicking handle elements or the color toolbar
    const target = e.target as HTMLElement;
    if (
      !isEditing &&
      !target.closest(".react-flow__handle") &&
      !target.closest(".react-flow__resize-handle") &&
      !target.closest(".node-color-toolbar")
    ) {
      setIsEditing(true);
      setLocalLabel(data.label);
    }
  };

  const containerClasses = cn(
    "h-full w-full flex items-center justify-center p-3 transition-all font-sans text-xs relative select-none group",
    isSvgShape
      ? "bg-transparent border-0"
      : cn(
          "border-2",
          data.shape === "rectangle" ? "rounded-xl" : "rounded-full"
        ),
    selected ? "scale-[1.02]" : ""
  );

  const restBorderColor = `color-mix(in srgb, ${color} 35%, var(--border-default))`;
  const containerStyle = {
    backgroundColor: isSvgShape ? undefined : colorPair.fill,
    color: colorPair.text,
    borderColor: isSvgShape
      ? undefined
      : (selected ? color : restBorderColor),
    // Drop shadow contour: dynamic shadow glow color if selected
    filter: selected
      ? `drop-shadow(0 0 6px ${color}40) drop-shadow(0 10px 15px rgba(0, 0, 0, 0.2))`
      : "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.15))",
    "--node-color": color,
  } as React.CSSProperties;

  return (
    <div
      className={containerClasses}
      style={containerStyle}
      onDoubleClick={handleDoubleClick}
    >
      {/* Node Resize Controls */}
      <NodeResizer
        isVisible={!!selected}
        minWidth={80}
        minHeight={40}
        handleClassName="w-2! h-2! bg-bg-surface! border! border-border-subtle! hover:border-[var(--node-color)]! rounded-sm! transition-all"
        lineClassName="border-border-subtle/40!"
      />

      {isSvgShape && (
        <ShapeBackground
          shape={data.shape}
          color={color}
          selected={!!selected}
          fillColor={colorPair.fill}
        />
      )}

      {/* Target handles for connections (top and left) */}
      <Handle
        id="top"
        type="target"
        position={Position.Top}
        className="w-2! h-2! bg-white! border! border-bg-base! top-[-4px]! opacity-0! group-hover:opacity-100! transition-opacity duration-200 hover:bg-accent-primary! hover:border-accent-primary! z-20"
      />
      <Handle
        id="left"
        type="target"
        position={Position.Left}
        className="w-2! h-2! bg-white! border! border-bg-base! left-[-4px]! opacity-0! group-hover:opacity-100! transition-opacity duration-200 hover:bg-accent-primary! hover:border-accent-primary! z-20"
      />

      {isEditing ? (
        <div className="absolute inset-0 flex items-center justify-center p-3 pointer-events-none z-10">
          <textarea
            ref={textareaRef}
            value={localLabel}
            onChange={handleChange}
            onBlur={handleBlur}
            rows={1}
            className="w-full bg-transparent text-center font-semibold border-none outline-none focus:ring-0 resize-none nodrag nopan pointer-events-auto text-xs px-1"
            placeholder="Type a label..."
            style={{
              height: "auto",
              maxHeight: "100%",
              color: colorPair.text,
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          />
        </div>
      ) : (
        <span
          className={cn(
            "font-semibold text-center select-none truncate px-1 z-10 cursor-text",
            !data.label && "text-text-muted/60 italic"
          )}
          style={{ color: data.label ? colorPair.text : undefined }}
        >
          {data.label || "Type a label..."}
        </span>
      )}

      {/* Source handles for connections (bottom and right) */}
      <Handle
        id="bottom"
        type="source"
        position={Position.Bottom}
        className="w-2! h-2! bg-white! border! border-bg-base! bottom-[-4px]! opacity-0! group-hover:opacity-100! transition-opacity duration-200 hover:bg-accent-primary! hover:border-accent-primary! z-20"
      />
      <Handle
        id="right"
        type="source"
        position={Position.Right}
        className="w-2! h-2! bg-white! border! border-bg-base! right-[-4px]! opacity-0! group-hover:opacity-100! transition-opacity duration-200 hover:bg-accent-primary! hover:border-accent-primary! z-20"
      />

      {/* Floating Color Toolbar */}
      {selected && !isEditing && (
        <div
          className="node-color-toolbar absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-[#18181c]/95 border border-border-default rounded-full p-1.5 flex gap-1.5 z-50 nodrag nopan pointer-events-auto shadow-xl shadow-black/40"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {NODE_COLORS.map((pair) => {
            const isActive = data.color === pair.fill;
            const isHovered = hoveredColor === pair.name;
            return (
              <button
                key={pair.name}
                type="button"
                onMouseEnter={() => setHoveredColor(pair.name)}
                onMouseLeave={() => setHoveredColor(null)}
                onClick={() => updateNodeData(id, { color: pair.fill })}
                className="w-5.5 h-5.5 rounded-full relative cursor-pointer flex items-center justify-center transition-all border border-border-subtle focus:outline-none"
                style={{
                  backgroundColor: pair.fill,
                  borderColor: isActive ? pair.text : "transparent",
                  boxShadow: isActive
                    ? `0 0 0 2px #18181c, 0 0 0 4px ${pair.text}`
                    : isHovered
                    ? `0 0 6px ${pair.text}`
                    : undefined,
                }}
                title={`${pair.name.charAt(0).toUpperCase() + pair.name.slice(1)}`}
                aria-label={`Set color to ${pair.name}`}
              >
                {isActive && (
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: pair.text }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
