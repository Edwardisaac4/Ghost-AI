"use client";

import { useRef, useState, useCallback } from "react";
import {
  ReactFlow,
  MiniMap,
  Background,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
  ConnectionMode,
  Connection,
} from "@xyflow/react";
import { useLiveblocksFlow, Cursors } from "@liveblocks/react-flow";
import { useUndo, useRedo, useCanUndo, useCanRedo } from "@liveblocks/react";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { ZoomIn, ZoomOut, Maximize, Undo2, Redo2 } from "lucide-react";
import { CanvasNode, CanvasShape, NODE_COLORS } from "@/types/canvas";
import { CustomCanvasNodeRenderer, ShapeBackground } from "./custom-node";
import { CustomEdge } from "./custom-edge";
import { ShapePanel } from "./shape-panel";
import { cn } from "@/lib/utils";

// Import required CSS stylesheets
import "@xyflow/react/dist/style.css";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-flow/styles.css";

// React Flow custom nodeTypes map
const nodeTypes = {
  canvasNode: CustomCanvasNodeRenderer,
};

// React Flow custom edgeTypes map
const edgeTypes = {
  default: CustomEdge,
  canvasEdge: CustomEdge,
};

const defaultEdgeOptions = {
  type: "canvasEdge",
};

function DragPreviewContent({ shape }: { shape: CanvasShape }) {
  const isSvgShape = ["diamond", "hexagon", "cylinder"].includes(shape);
  const defaultPair = NODE_COLORS[0]; // Neutral dark default

  return (
    <div
      className={cn(
        "w-full h-full flex items-center justify-center p-3 relative font-sans text-[10px] font-semibold",
        isSvgShape
          ? "bg-transparent border-0"
          : cn(
              "border-2",
              shape === "rectangle" ? "rounded-xl" : "rounded-full"
            )
      )}
      style={{
        backgroundColor: isSvgShape ? undefined : defaultPair.fill,
        color: defaultPair.text,
        borderColor: defaultPair.text,
        boxShadow: "0 10px 15px rgba(0, 0, 0, 0.2)",
      }}
    >
      {isSvgShape && (
        <ShapeBackground
          shape={shape}
          color={defaultPair.text}
          selected={true}
          fillColor={defaultPair.fill}
        />
      )}
      <span className="capitalize z-10 select-none truncate px-1">{shape}</span>
    </div>
  );
}

function CanvasInner() {
  const reactFlowInstance = useReactFlow();
  const { screenToFlowPosition } = reactFlowInstance;

  const undo = useUndo();
  const redo = useRedo();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  useKeyboardShortcuts(reactFlowInstance, { undo, redo });

  // Connects React Flow state directly to Liveblocks room storage
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNode>({
      suspense: true,
      nodes: {
        initial: [],
      },
      edges: {
        initial: [],
      },
    });

  const onConnectCustom = useCallback(
    (connection: Connection) => {
      onConnect({
        ...connection,
        type: "canvasEdge",
        data: {
          routing: "smoothstep",
          label: "",
        },
      } as any);
    },
    [onConnect]
  );

  const nodeCounterRef = useRef(0);
  const [draggedShape, setDraggedShape] = useState<{
    shape: CanvasShape;
    width: number;
    height: number;
  } | null>(null);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDragPosition({ x: event.clientX, y: event.clientY });
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDraggedShape(null);
    setDragPosition(null);

    const dataStr = event.dataTransfer.getData("application/reactflow");
    if (!dataStr) return;

    try {
      const payload = JSON.parse(dataStr) as { shape: CanvasShape; width: number; height: number };

      // Project drop screen coordinate to canvas coordinate
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      nodeCounterRef.current += 1;
      const timestamp = Date.now();
      const nodeId = `${payload.shape}-${timestamp}-${nodeCounterRef.current}`;

      // Create new CanvasNode instance
      const newNode: CanvasNode = {
        id: nodeId,
        type: "canvasNode",
        position,
        data: {
          label: "",
          color: "#1F1F1F", // default Neutral dark fill
          shape: payload.shape,
        },
        style: {
          width: payload.width,
          height: payload.height,
        },
      };

      // Dispatch 'add' node change to synchronized storage
      onNodesChange([{ type: "add", item: newNode }]);
    } catch (e) {
      console.error("Error handling shape drop:", e);
    }
  };

  return (
    <div
      className="w-full h-full relative"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnectCustom}
        onDelete={onDelete}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionMode={ConnectionMode.Loose}
        fitView
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={16}
          size={1.5}
          color="rgba(128, 128, 144, 0.15)"
        />
        <MiniMap
          className="bg-bg-surface! border-border-default! rounded-xl! shadow-lg!"
          maskColor="rgba(8, 8, 9, 0.6)"
          nodeColor={() => "var(--border-default)"}
        />
        <Cursors />
      </ReactFlow>

      {/* Ghost Drag Preview Overlay */}
      {draggedShape && dragPosition && (
        <div
          className="fixed pointer-events-none z-50 opacity-60 transition-none"
          style={{
            left: dragPosition.x,
            top: dragPosition.y,
            width: draggedShape.width,
            height: draggedShape.height,
            transform: "translate(-50%, -50%)",
          }}
        >
          <DragPreviewContent shape={draggedShape.shape} />
        </div>
      )}

      {/* Floating Shape Provision Panel */}
      <ShapePanel
        onDragStart={(shape, width, height) => {
          setDraggedShape({ shape, width, height });
        }}
        onDragEnd={() => {
          setDraggedShape(null);
          setDragPosition(null);
        }}
      />

      {/* Floating Control Bar (Zoom & History) */}
      <div className="absolute bottom-6 left-6 z-30 flex items-center gap-1.5 p-1.5 rounded-full bg-bg-surface/85 backdrop-blur-md border border-border-default shadow-2xl shadow-black/40">
        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => reactFlowInstance.zoomOut({ duration: 300 })}
            className="relative group p-2 rounded-full text-text-secondary hover:text-accent-primary hover:bg-bg-subtle active:scale-95 transition-all cursor-pointer border border-transparent hover:border-border-default"
            title="Zoom Out (-)"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] font-medium text-text-primary bg-bg-elevated border border-border-default rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
              Zoom Out (-)
            </span>
          </button>
          <button
            onClick={() => reactFlowInstance.fitView({ duration: 300 })}
            className="relative group p-2 rounded-full text-text-secondary hover:text-accent-primary hover:bg-bg-subtle active:scale-95 transition-all cursor-pointer border border-transparent hover:border-border-default"
            title="Fit View"
            aria-label="Fit View"
          >
            <Maximize className="w-4 h-4" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] font-medium text-text-primary bg-bg-elevated border border-border-default rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
              Fit View
            </span>
          </button>
          <button
            onClick={() => reactFlowInstance.zoomIn({ duration: 300 })}
            className="relative group p-2 rounded-full text-text-secondary hover:text-accent-primary hover:bg-bg-subtle active:scale-95 transition-all cursor-pointer border border-transparent hover:border-border-default"
            title="Zoom In (+)"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] font-medium text-text-primary bg-bg-elevated border border-border-default rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
              Zoom In (+)
            </span>
          </button>
        </div>

        {/* Thin Divider */}
        <div className="w-px h-4 bg-border-default self-center" />

        {/* History Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="relative group p-2 rounded-full text-text-secondary hover:text-accent-primary hover:bg-bg-subtle active:scale-95 disabled:active:scale-100 disabled:opacity-30 disabled:hover:text-text-secondary disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all cursor-pointer border border-transparent hover:border-border-default"
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
          >
            <Undo2 className="w-4 h-4" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] font-medium text-text-primary bg-bg-elevated border border-border-default rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
              Undo (Ctrl+Z)
            </span>
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="relative group p-2 rounded-full text-text-secondary hover:text-accent-primary hover:bg-bg-subtle active:scale-95 disabled:active:scale-100 disabled:opacity-30 disabled:hover:text-text-secondary disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all cursor-pointer border border-transparent hover:border-border-default"
            title="Redo (Ctrl+Shift+Z / Ctrl+Y)"
            aria-label="Redo"
          >
            <Redo2 className="w-4 h-4" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] font-medium text-text-primary bg-bg-elevated border border-border-default rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
              Redo (Ctrl+Shift+Z / Ctrl+Y)
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * CollaborativeCanvas sets up the ReactFlowProvider context
 * and renders the collaborative multiplayer canvas.
 */
export function CollaborativeCanvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}
