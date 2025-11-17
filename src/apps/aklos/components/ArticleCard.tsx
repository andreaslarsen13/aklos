import { Article } from "../types";

interface ArticleCardProps {
  article: Article;
  isSelected: boolean;
  onSelect: () => void;
  scale?: number;
  position: { x: number; y: number };
  zIndex: number;
}

export function ArticleCard({
  article,
  isSelected,
  onSelect,
  scale = 1,
  position,
  zIndex,
}: ArticleCardProps) {
  return (
    <div
      onClick={onSelect}
      className="absolute cursor-pointer"
      style={{
        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
        width: "600px",
        userSelect: "none",
        WebkitUserSelect: "none",
        zIndex,
        transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease-out",
        willChange: "transform",
        transformOrigin: "top left",
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
          backgroundColor: "var(--os-color-window-bg)",
          backgroundImage: "var(--os-pinstripe-window)",
        }}
      >
        {/* Article Header */}
        <div
          className="px-6 py-4 border-b"
          style={{
            backgroundColor: "#f0f0f0",
            background: "var(--os-color-titlebar-active-bg)",
            borderBottom: "1px solid var(--os-color-titlebar-border)",
          }}
        >
          <h2
            className="font-medium text-[16px] mb-2 line-clamp-3"
            style={{
              color: "var(--os-color-text-primary)",
              textShadow: "0 2px 3px rgba(0, 0, 0, 0.25)",
              fontFamily: "var(--os-font-ui)",
            }}
          >
            {article.title}
          </h2>
          <div
            className="flex items-center gap-3 text-[12px]"
            style={{
              color: "var(--os-color-text-secondary)",
              fontFamily: "var(--os-font-ui)",
            }}
          >
            <span className="font-medium">{article.source}</span>
            <span>•</span>
            <span>{article.date}</span>
          </div>
        </div>

        {/* Article Content */}
        <div
          className="p-6"
          style={{
            backgroundColor: "var(--os-color-window-bg)",
            minHeight: "300px",
          }}
        >
          <p
            className="text-[14px] leading-relaxed"
            style={{
              color: "var(--os-color-text-primary)",
              fontFamily: "var(--os-font-ui)",
            }}
          >
            {article.snippet}
          </p>
        </div>

        {/* Article Footer */}
        <div
          className="px-6 py-3 border-t flex items-center justify-between"
          style={{
            backgroundColor: "var(--os-color-window-bg)",
            borderTop: "1px solid var(--os-color-titlebar-border)",
          }}
        >
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] hover:underline"
            style={{
              color: "var(--os-color-selection-bg)",
              fontFamily: "var(--os-font-ui)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            Read full article →
          </a>
        </div>
      </div>
    </div>
  );
}

