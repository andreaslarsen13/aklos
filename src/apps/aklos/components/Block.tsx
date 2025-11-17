import { Block as BlockType } from "../types";
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
        width: "600px",
        height: "250px",
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
          backgroundColor: "rgba(240, 240, 240, 0.6)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          height: "100%",
        }}
      >
        {/* New card-stack layout */}
        <div className="p-6 flex flex-col h-full">
          {/* Title and count */}
          <div className="mb-4">
            <h3 
              className="text-[18px] font-medium mb-1"
              style={{ 
                color: "var(--os-color-text-primary)",
                fontFamily: "var(--os-font-ui)",
              }}
            >
              {block.topic}
            </h3>
            <p 
              className="text-[13px]"
              style={{ 
                color: "var(--os-color-text-secondary)",
                fontFamily: "var(--os-font-ui)",
              }}
            >
              {block.articles.length} article{block.articles.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          {/* Stacked article preview cards */}
          <div className="flex-1 relative flex items-center justify-center">
            {block.articles.slice(0, 3).map((article, index) => (
              <div
                key={article.id}
                className="absolute rounded-lg shadow-lg overflow-hidden"
                style={{
                  width: '280px',
                  height: '140px',
                  backgroundColor: 'white',
                  transform: `translate(${index * 12}px, ${index * 8}px) rotate(${(index - 1) * 2}deg)`,
                  zIndex: 3 - index,
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                }}
              >
                {/* Text card content */}
                <div className="p-3 bg-white h-full flex flex-col">
                  <div 
                    className="text-[10px] font-medium mb-1"
                    style={{
                      color: "var(--os-color-text-secondary)",
                      fontFamily: "var(--os-font-ui)",
                    }}
                  >
                    {article.source}
                  </div>
                  <div 
                    className="text-[12px] line-clamp-3"
                    style={{
                      color: "var(--os-color-text-primary)",
                      fontFamily: "var(--os-font-ui)",
                    }}
                  >
                    {article.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

