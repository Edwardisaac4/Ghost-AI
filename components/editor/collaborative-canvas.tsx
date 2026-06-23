"use client";

import { useRef } from "react";
import {
  ReactFlow,
  MiniMap,
  Background,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
  ConnectionMode,
} from "@xyflow/react";
import { useLiveblocksFlow, Cursors } from "@liveblocks/react-flow";
import { CanvasNode, CanvasShape } from "@/types/canvas";
import { CustomCanvasNodeRenderer } from "./custom-node";
import { ShapePanel } from "./shape-panel";

// Import required CSS stylesheets
import "@xyflow/react/dist/style.css";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-flow/styles.css";

// React Flow custom nodeTypes map
const nodeTypes = {
  canvasNode: CustomCanvasNodeRenderer,
};

function CanvasInner() {
  const { screenToFlowPosition } = useReactFlow();

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

  const nodeCounterRef = useRef(0);

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();

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
          color: "#00c8d4", // default accent-primary color
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
        onConnect={onConnect}
        onDelete={onDelete}
        nodeTypes={nodeTypes}
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
          className="!bg-bg-surface !border-border-default !rounded-xl !shadow-lg"
          maskColor="rgba(8, 8, 9, 0.6)"
          nodeColor={() => "var(--border-default)"}
        />
        <Cursors />
      </ReactFlow>

      {/* Floating Shape Provision Panel */}
      <ShapePanel />
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
