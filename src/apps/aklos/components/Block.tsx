import { Block as BlockType } from "../types";
import { ArticleItem } from "./ArticleItem";
import { useBlockDrag } from "../hooks/useBlockDrag";

interface BlockProps {
  block: BlockType;
  isSelected: boolean;
  onSelect: () => void;
  onPositionChange: (blockId: string, newPosition: { x: number; y: number }) => void;
  onInteraction: (blockId: string) => void;
  canvasZoom: number;
  zIndexBase: number;
  scale?: number;
  layoutMode: "home" | "focused";
  layoutZIndex?: number;
}

export function Block({ block, isSelected, onSelect, onPositionChange, onInteraction, canvasZoom, zIndexBase, scale = 1, layoutMode, layoutZIndex }: BlockProps) {
  const isDraggingEnabled = layoutMode === "home";
  
  const { isDragging, handleMouseDown, hasMoved } = useBlockDrag({
    blockId: block.id,
    initialPosition: block.position,
    canvasZoom,
    onPositionChange,
  });

  const handleClick = (e: React.MouseEvent) => {
    // In focused mode with small blocks, any click should focus
    if (layoutMode === "focused" && scale < 1) {
      onSelect();
      onInteraction(block.id);
    } else if (!hasMoved) {
      // Only trigger selection if we didn't drag (for spatial mode)
      onSelect();
      onInteraction(block.id);
    }
  };

  const handleMouseDownWithInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    onInteraction(block.id);
    if (isDraggingEnabled) {
      handleMouseDown(e);
    }
  };

  return (
    <div
      data-block
      onMouseDown={handleMouseDownWithInteraction}
      onTouchStart={handleMouseDownWithInteraction}
      onClick={handleClick}
      className={`absolute ${
        isDraggingEnabled && isDragging ? "cursor-grabbing" : isDraggingEnabled ? "cursor-grab" : "cursor-pointer"
      }`}
      style={{
        transform: `translate(${block.position.x}px, ${block.position.y}px) scale(${scale})`,
        width: "360px",
        userSelect: "none",
        WebkitUserSelect: "none",
        willChange: isDragging ? "transform" : "auto",
        zIndex: isDragging ? 1000 : layoutZIndex !== undefined ? layoutZIndex : zIndexBase,
        transition: layoutMode !== "home" ? "transform 0.3s ease-out" : "none",
        transformOrigin: "top left",
      }}
    >
      <div
        className={`
          rounded-lg overflow-hidden transition-all duration-200
          ${
            isSelected
              ? "shadow-[0_0_20px_var(--os-color-selection-glow),0_8px_25px_rgba(0,0,0,0.5)]"
              : isDragging
              ? "shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
              : "shadow-[0_8px_25px_rgba(0,0,0,0.5)]"
          }
        `}
        style={{
          border: isSelected 
            ? "2px solid var(--os-color-selection-bg)"
            : "1px solid var(--os-color-window-border)",
          borderRadius: "var(--os-metrics-radius)",
          transform: isDragging ? "scale(1.02)" : "scale(1)",
          transition: isDragging ? "none" : "all 0.2s",
        }}
      >
        {/* Header with Aqua titlebar style */}
        <div
          className="px-4 py-3 border-b"
          style={{
            backgroundColor: "#f0f0f0",
            background: "var(--os-color-titlebar-active-bg)",
            borderBottom: "1px solid var(--os-color-titlebar-border)",
          }}
        >
          <h3 
            className="font-medium text-[13px] mb-0.5"
            style={{ 
              color: "var(--os-color-text-primary)",
              textShadow: "0 2px 3px rgba(0, 0, 0, 0.25)",
              fontFamily: "var(--os-font-ui)",
            }}
          >
            {block.topic}
          </h3>
          <p 
            className="text-[11px]"
            style={{ 
              color: "var(--os-color-text-secondary)",
              fontFamily: "var(--os-font-ui)",
            }}
          >
            {block.description}
          </p>
        </div>

              {/* Articles with pinstripe background */}
              <div
                className="max-h-96 overflow-y-auto"
                style={{
                  backgroundColor: "var(--os-color-window-bg)",
                  backgroundImage: "var(--os-pinstripe-window)",
                }}
              >
                {block.articles.map((article) => (
                  <ArticleItem
                    key={article.id}
                    article={article}
                    onClick={(e) => {
                      // In focused mode with small blocks, let clicks bubble up to focus the block
                      if (layoutMode === "focused" && scale < 1) {
                        return; // Don't stop propagation
                      }
                      // Otherwise, stop propagation for article-specific handling
                      e.stopPropagation();
                      // Future: Handle article-specific actions
                    }}
                  />
                ))}
              </div>

        {/* Footer */}
        <div 
          className="px-4 py-2 border-t text-[11px]"
          style={{
            backgroundColor: "var(--os-color-window-bg)",
            borderTop: "1px solid var(--os-color-titlebar-border)",
            color: "var(--os-color-text-secondary)",
            fontFamily: "var(--os-font-ui)",
          }}
        >
          {block.articles.length} article{block.articles.length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}

