import { Article } from "../types";

interface ArticleItemProps {
  article: Article;
  onClick?: () => void;
}

export function ArticleItem({ article, onClick }: ArticleItemProps) {
  return (
    <div
      onClick={onClick}
      className="p-3 border-b last:border-b-0 transition-colors cursor-pointer"
      style={{
        borderColor: "rgba(0, 0, 0, 0.08)",
        fontFamily: "var(--os-font-ui)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--os-color-selection-bg)";
        e.currentTarget.style.color = "var(--os-color-selection-text)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.color = "";
      }}
    >
      <h4 
        className="font-medium text-[13px] mb-1 line-clamp-2"
        style={{ 
          color: "inherit",
        }}
      >
        {article.title}
      </h4>
      <div 
        className="flex items-center gap-2 text-[11px] mb-1"
        style={{ opacity: 0.8 }}
      >
        <span className="font-medium">{article.source}</span>
        <span>•</span>
        <span>{article.date}</span>
      </div>
      <p 
        className="text-[11px] line-clamp-2"
        style={{ opacity: 0.75 }}
      >
        {article.snippet}
      </p>
    </div>
  );
}

