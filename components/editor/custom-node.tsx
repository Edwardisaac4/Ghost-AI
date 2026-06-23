"use client";

import { Handle, Position, NodeProps } from "@xyflow/react";
import { CanvasNode, CanvasShape } from "@/types/canvas";
import { cn } from "@/lib/utils";

interface ShapeBackgroundProps {
  shape: CanvasShape;
  color: string;
  selected: boolean;
}

function ShapeBackground({ shape, color, selected }: ShapeBackgroundProps) {
  const strokeColor = color;
  const strokeWidth = selected ? 3 : 2;
  const strokeOpacity = selected ? 1.0 : 0.6;

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
          fill="var(--bg-surface)"
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
          fill="var(--bg-surface)"
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
          fill="var(--bg-surface)"
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
          fill="var(--bg-surface)"
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
  data,
  selected,
}: NodeProps<CanvasNode>) {
  const label = data.label || `Untitled ${data.shape}`;
  const color = data.color || "#00c8d4"; // default accent-primary
  const isSvgShape = ["diamond", "hexagon", "cylinder"].includes(data.shape);

  const containerClasses = cn(
    "h-full w-full flex items-center justify-center p-3 transition-all font-sans text-xs text-text-primary relative select-none",
    isSvgShape
      ? "bg-transparent border-0"
      : cn(
          "border-2 bg-bg-surface",
          data.shape === "rectangle" ? "rounded-xl" : "rounded-full"
        ),
    selected ? "scale-[1.02]" : ""
  );

  const containerStyle = {
    borderColor: isSvgShape
      ? undefined
      : (selected ? color : `color-mix(in srgb, ${color} 60%, transparent)`),
    // Drop shadow contour: dynamic shadow glow color if selected
    filter: selected
      ? `drop-shadow(0 0 6px ${color}40) drop-shadow(0 10px 15px rgba(0, 0, 0, 0.2))`
      : "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.15))",
  };

  return (
    <div className={containerClasses} style={containerStyle}>
      {isSvgShape && (
        <ShapeBackground
          shape={data.shape}
          color={color}
          selected={!!selected}
        />
      )}

      {/* Target handle on the top for connections */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-2.5 h-2.5 bg-bg-surface border-2 border-border-default !top-[-5px] transition-all hover:bg-accent-primary hover:border-accent-primary z-20"
      />

      <span className="font-semibold text-center select-none truncate px-1 z-10">
        {label}
      </span>

      {/* Source handle on the bottom for connections */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2.5 h-2.5 bg-bg-surface border-2 border-border-default !bottom-[-5px] transition-all hover:bg-accent-primary hover:border-accent-primary z-20"
      />
    </div>
  );
}
