import { Block as BlockType } from "../types";
import { Block } from "./Block";
import { LayoutControls, LayoutMode } from "./LayoutControls";
import { useCanvasNavigation } from "../hooks/useCanvasNavigation";

interface SpatialCanvasProps {
  blocks: BlockType[];
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string) => void;
  onDeselectBlock: () => void;
  onBlockPositionChange: (blockId: string, newPosition: { x: number; y: number }) => void;
  onBlockInteraction: (blockId: string) => void;
  blockOrder: string[];
  layoutMode: LayoutMode;
  blockScales: Record<string, number>;
  layoutZIndices: Record<string, number>;
  onLayoutModeChange: (mode: LayoutMode) => void;
  hideControls?: boolean;
}

export function SpatialCanvas({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onDeselectBlock,
  onBlockPositionChange,
  onBlockInteraction,
  blockOrder,
  layoutMode,
  blockScales,
  layoutZIndices,
  onLayoutModeChange,
  hideControls = false,
}: SpatialCanvasProps) {
  const { canvasState, isDragging, handleMouseDown, canvasRef } =
    useCanvasNavigation({
      initialPan: { x: 0, y: 0 },
      initialZoom: 1,
    });

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full overflow-hidden"
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      style={{
        cursor: isDragging ? "grabbing" : "grab",
        background: "linear-gradient(180deg, #E2E2E2 0%, #D0D0D0 68%, #A2A9B2 100%)",
      }}
    >
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Canvas layer with transform */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${canvasState.panOffset.x}px, ${canvasState.panOffset.y}px) scale(${canvasState.zoom})`,
          transformOrigin: "0 0",
          transition: isDragging ? "none" : "transform 0.1s ease-out",
        }}
        onClick={(e) => {
          // Deselect if clicking on canvas background (but not in focused mode)
          if (e.target === e.currentTarget) {
            if (layoutMode !== "focused") {
              onDeselectBlock();
            }
          }
        }}
      >
        {/* Render blocks */}
        {blocks.map((block) => {
          const orderIndex = blockOrder.indexOf(block.id);
          const zIndexBase = orderIndex >= 0 ? orderIndex + 10 : 1;
          const scale = blockScales[block.id] || 1;
          const layoutZIndex = layoutZIndices[block.id];
          
          return (
            <Block
              key={block.id}
              block={block}
              isSelected={selectedBlockId === block.id}
              onSelect={() => onSelectBlock(block.id)}
              onPositionChange={onBlockPositionChange}
              onInteraction={onBlockInteraction}
              canvasZoom={canvasState.zoom}
              zIndexBase={zIndexBase}
              scale={scale}
              layoutMode={layoutMode}
              layoutZIndex={layoutZIndex}
            />
          );
        })}
      </div>

      {/* Layout Controls - top left */}
      {!hideControls && (
        <LayoutControls
          currentMode={layoutMode}
          onModeChange={onLayoutModeChange}
        />
      )}

      {/* Canvas controls overlay - Aqua styled (hidden in fullscreen) */}
      {!hideControls && (
        <div 
          className="absolute top-4 right-4 rounded-lg px-3 py-2 shadow-md text-[11px]"
          style={{
            background: "rgba(248, 248, 248, 0.75)",
            backgroundImage: "var(--os-pinstripe-menubar)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(0, 0, 0, 0.18)",
            color: "var(--os-color-text-primary)",
            fontFamily: "var(--os-font-ui)",
          }}
        >
          <div>Zoom: {(canvasState.zoom * 100).toFixed(0)}%</div>
          <div 
            className="text-[10px] mt-1"
            style={{ 
              color: "var(--os-color-text-secondary)",
              opacity: 0.7,
            }}
          >
            Scroll to zoom • Drag to pan
          </div>
        </div>
      )}
    </div>
  );
}

