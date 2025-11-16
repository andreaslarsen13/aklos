import { Block as BlockType } from "../types";
import { ArticleItem } from "./ArticleItem";

interface BlockProps {
  block: BlockType;
  isSelected: boolean;
  onSelect: () => void;
}

export function Block({ block, isSelected, onSelect }: BlockProps) {
  return (
    <div
      data-block
      onClick={onSelect}
      className="absolute cursor-pointer transition-all duration-200"
      style={{
        left: block.position.x,
        top: block.position.y,
        width: "360px",
      }}
    >
      <div
        className={`
          rounded-lg overflow-hidden transition-all duration-200
          ${
            isSelected
              ? "shadow-[0_0_20px_var(--os-color-selection-glow),0_8px_25px_rgba(0,0,0,0.5)]"
              : "shadow-[0_8px_25px_rgba(0,0,0,0.5)]"
          }
        `}
        style={{
          border: isSelected 
            ? "2px solid var(--os-color-selection-bg)"
            : "1px solid var(--os-color-window-border)",
          borderRadius: "var(--os-metrics-radius)",
        }}
      >
        {/* Header with Aqua titlebar style */}
        <div
          className="px-4 py-3 border-b"
          style={{
            background: "var(--os-color-titlebar-active-bg)",
            backgroundImage: "var(--os-pinstripe-titlebar)",
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
                e?.stopPropagation();
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

