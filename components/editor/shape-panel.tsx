"use client";

import { CanvasShape } from "@/types/canvas";

/**
 * ShapePanel renders a floating pill-shaped toolbar containing draggable shapes.
 * When dragged, the shape name and default dimensions are attached to the drag event payload.
 */
export function ShapePanel({
  onDragStart: propsOnDragStart,
  onDragEnd: propsOnDragEnd,
}: {
  onDragStart?: (shape: CanvasShape, width: number, height: number) => void;
  onDragEnd?: () => void;
}) {
  const shapes: { type: CanvasShape; name: string; icon: React.ReactNode }[] = [
    {
      type: "rectangle",
      name: "Rectangle",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <rect x={3} y={6} width={18} height={12} rx={1.5} />
        </svg>
      ),
    },
    {
      type: "diamond",
      name: "Diamond",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M12 2L22 12L12 22L2 12Z" />
        </svg>
      ),
    },
    {
      type: "circle",
      name: "Circle",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx={12} cy={12} r={9} />
        </svg>
      ),
    },
    {
      type: "pill",
      name: "Pill",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <rect x={4} y={9} width={16} height={6} rx={3} />
        </svg>
      ),
    },
    {
      type: "cylinder",
      name: "Cylinder",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <ellipse cx={12} cy={6} rx={6} ry={3} />
          <path d="M6 6V18C6 19.66 8.69 21 12 21C15.31 21 18 19.66 18 18V6" />
        </svg>
      ),
    },
    {
      type: "hexagon",
      name: "Hexagon",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M12 2L21 7.2V16.8L12 22L3 16.8V7.2Z" />
        </svg>
      ),
    },
  ];

  const onDragStart = (event: React.DragEvent, shapeType: CanvasShape) => {
    const defaultSizes: Record<CanvasShape, { width: number; height: number }> = {
      rectangle: { width: 140, height: 75 },
      diamond: { width: 100, height: 100 },
      circle: { width: 80, height: 80 },
      pill: { width: 120, height: 60 },
      cylinder: { width: 90, height: 95 },
      hexagon: { width: 100, height: 90 },
    };

    const payload = {
      shape: shapeType,
      ...defaultSizes[shapeType],
    };

    // Serialize shape payload into HTML5 drag data
    event.dataTransfer.setData("application/reactflow", JSON.stringify(payload));
    event.dataTransfer.effectAllowed = "move";

    // Set custom transparent ghost drag preview to suppress default browser preview
    const img = new Image();
    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    event.dataTransfer.setDragImage(img, 0, 0);

    if (propsOnDragStart) {
      propsOnDragStart(shapeType, defaultSizes[shapeType].width, defaultSizes[shapeType].height);
    }
  };

  const onDragEnd = () => {
    if (propsOnDragEnd) {
      propsOnDragEnd();
    }
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1.5 rounded-full bg-bg-surface/85 backdrop-blur-md border border-border-default shadow-2xl shadow-black/40">
      {shapes.map((shape) => (
        <button
          key={shape.type}
          draggable
          onDragStart={(e) => onDragStart(e, shape.type)}
          onDragEnd={onDragEnd}
          className="relative group p-2.5 rounded-full text-text-secondary hover:text-accent-primary hover:bg-bg-subtle active:scale-95 transition-all cursor-grab active:cursor-grabbing border border-transparent hover:border-border-default"
          title={`${shape.name} (Drag onto canvas)`}
          aria-label={`Drag ${shape.name}`}
        >
          {shape.icon}
          
          {/* Custom Tooltip */}
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] font-medium text-text-primary bg-bg-elevated border border-border-default rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
            {shape.name}
          </span>
        </button>
      ))}

      {/* Off-screen drag preview templates */}
      <div className="fixed left-[-9999px] top-[-9999px] pointer-events-none select-none" aria-hidden="true">
        {/* Rectangle preview */}
        <div
          id="drag-preview-rectangle"
          style={{ width: 140, height: 75 }}
          className="border-2 border-accent-primary bg-bg-surface rounded-xl flex items-center justify-center p-3 text-text-primary text-xs font-semibold font-sans shadow-lg opacity-75"
        >
          Rectangle
        </div>

        {/* Diamond preview */}
        <div
          id="drag-preview-diamond"
          style={{ width: 100, height: 100 }}
          className="relative flex items-center justify-center p-3 text-text-primary text-xs font-semibold font-sans opacity-75"
        >
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ overflow: "visible" }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <polygon
              points="50 0, 100 50, 50 100, 0 50"
              fill="var(--bg-surface)"
              stroke="var(--accent-primary)"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <span className="z-10 text-center truncate px-1">Diamond</span>
        </div>

        {/* Circle preview */}
        <div
          id="drag-preview-circle"
          style={{ width: 80, height: 80 }}
          className="border-2 border-accent-primary bg-bg-surface rounded-full flex items-center justify-center p-3 text-text-primary text-xs font-semibold font-sans shadow-lg opacity-75"
        >
          Circle
        </div>

        {/* Pill preview */}
        <div
          id="drag-preview-pill"
          style={{ width: 120, height: 60 }}
          className="border-2 border-accent-primary bg-bg-surface rounded-full flex items-center justify-center p-3 text-text-primary text-xs font-semibold font-sans shadow-lg opacity-75"
        >
          Pill
        </div>

        {/* Cylinder preview */}
        <div
          id="drag-preview-cylinder"
          style={{ width: 90, height: 95 }}
          className="relative flex items-center justify-center p-3 text-text-primary text-xs font-semibold font-sans opacity-75"
        >
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ overflow: "visible" }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M 0,15 V 85 A 50,15 0 0 0 100,85 V 15 Z"
              fill="var(--bg-surface)"
              stroke="var(--accent-primary)"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
            />
            <ellipse
              cx={50}
              cy={15}
              rx={50}
              ry={15}
              fill="var(--bg-surface)"
              stroke="var(--accent-primary)"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <span className="z-10 text-center truncate px-1">Cylinder</span>
        </div>

        {/* Hexagon preview */}
        <div
          id="drag-preview-hexagon"
          style={{ width: 100, height: 90 }}
          className="relative flex items-center justify-center p-3 text-text-primary text-xs font-semibold font-sans opacity-75"
        >
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ overflow: "visible" }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <polygon
              points="50 0, 100 25, 100 75, 50 100, 0 75, 0 25"
              fill="var(--bg-surface)"
              stroke="var(--accent-primary)"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <span className="z-10 text-center truncate px-1">Hexagon</span>
        </div>
      </div>
    </div>
  );
}
