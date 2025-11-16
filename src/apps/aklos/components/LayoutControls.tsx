import { Grid3x3, Focus, Move } from "lucide-react";

export type LayoutMode = "spatial" | "grid" | "focused";

interface LayoutControlsProps {
  currentMode: LayoutMode;
  onModeChange: (mode: LayoutMode) => void;
}

export function LayoutControls({ currentMode, onModeChange }: LayoutControlsProps) {
  const modes: { value: LayoutMode; icon: typeof Grid3x3; label: string }[] = [
    { value: "spatial", icon: Move, label: "Spatial" },
    { value: "grid", icon: Grid3x3, label: "Grid" },
    { value: "focused", icon: Focus, label: "Focused" },
  ];

  return (
    <div
      className="absolute top-4 left-4 z-10 rounded-lg overflow-hidden"
      style={{
        background: "rgba(248, 248, 248, 0.75)",
        backgroundImage: "var(--os-pinstripe-menubar)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid rgba(0, 0, 0, 0.18)",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
      }}
    >
      <div className="flex">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = currentMode === mode.value;

          return (
            <button
              key={mode.value}
              onClick={() => onModeChange(mode.value)}
              className="px-3 py-2 flex items-center gap-2 transition-all"
              style={{
                backgroundColor: isActive
                  ? "var(--os-color-selection-bg)"
                  : "transparent",
                color: isActive
                  ? "#FFFFFF"
                  : "var(--os-color-text-primary)",
                fontFamily: "var(--os-font-ui)",
                fontSize: "11px",
                border: "none",
                cursor: "pointer",
                outline: "none",
              }}
              title={mode.label}
            >
              <Icon className="w-4 h-4" />
              <span>{mode.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

