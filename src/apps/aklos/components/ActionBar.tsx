import { useState, useEffect, useRef } from "react";
import { ActionBarMode } from "../types";
import { X } from "lucide-react";

interface ActionBarProps {
  mode: ActionBarMode;
  selectedBlockTopic?: string;
  onSubmit: (value: string) => void;
  onCancel?: () => void;
}

export function ActionBar({
  mode,
  selectedBlockTopic,
  onSubmit,
  onCancel,
}: ActionBarProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const placeholder =
    mode === "search"
      ? "Search for topics..."
      : `Ask about "${selectedBlockTopic}"...`;

  // Auto-focus input when mode changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value);
      setValue("");
    }
  };

  return (
    <div
      data-action-bar
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50"
    >
      <form onSubmit={handleSubmit}>
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl transition-all duration-300"
          style={{
            background: "rgba(248, 248, 248, 0.75)",
            backgroundImage: "var(--os-pinstripe-menubar)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(0, 0, 0, 0.18)",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15), 0 8px 25px rgba(0,0,0,0.3)",
            minWidth: mode === "chat" ? "600px" : "500px",
          }}
        >
          {/* Mode indicator */}
          <div
            className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors duration-300`}
            style={{
              backgroundColor: mode === "search" ? "var(--os-color-selection-bg)" : "#27C93F",
            }}
          />

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none text-[13px] font-medium"
            style={{
              minWidth: "300px",
              color: "var(--os-color-text-primary)",
              fontFamily: "var(--os-font-ui)",
            }}
          />

          {/* Cancel button (chat mode only) */}
          {mode === "chat" && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-shrink-0 p-1.5 rounded-full hover:bg-gray-200/50 transition-colors"
              aria-label="Cancel"
              style={{
                color: "var(--os-color-text-secondary)",
              }}
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Submit button - Aqua style */}
          <button
            type="submit"
            disabled={!value.trim()}
            className="aqua-button primary flex-shrink-0"
            style={{
              fontSize: "13px",
              height: "24px",
              padding: "0 14px",
              borderRadius: "12px",
              opacity: value.trim() ? 1 : 0.5,
              cursor: value.trim() ? "default" : "not-allowed",
            }}
          >
            <span>{mode === "search" ? "Search" : "Send"}</span>
          </button>
        </div>
      </form>

      {/* Mode label */}
      <div 
        className="text-center mt-2 text-[11px] font-medium"
        style={{
          color: "var(--os-color-text-secondary)",
          fontFamily: "var(--os-font-ui)",
        }}
      >
        {mode === "search" ? "Search Mode" : "Chat Mode"}
      </div>
    </div>
  );
}

