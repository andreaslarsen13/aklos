import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { WindowFrame } from "@/components/layout/WindowFrame";
import { SpatialCanvas } from "./components/SpatialCanvas";
import { ActionBar } from "./components/ActionBar";
import { AklosMenuBar } from "./components/AklosMenuBar";
import { LayoutMode } from "./components/LayoutControls";
import { generateMockBlocks, generateNewBlock } from "./utils/mockBlocks";
import { calculateGridPositions, calculateFocusedPositions } from "./utils/layoutCalculations";
import { Block, ActionBarMode } from "./types";
import { AppProps, BaseApp } from "../base/types";
import { useThemeStore } from "@/stores/useThemeStore";
import { useAppStoreShallow } from "@/stores/helpers";
import { useAppStore } from "@/stores/useAppStore";
import { Maximize2, Minimize2 } from "lucide-react";

function AklosAppComponent({
  isWindowOpen,
  isForeground,
  onClose,
  skipInitialSound,
  instanceId,
}: AppProps) {
  const [blocks, setBlocks] = useState<Block[]>(generateMockBlocks());
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [blockOrder, setBlockOrder] = useState<string[]>([]);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("spatial");
  const [blockScales, setBlockScales] = useState<Record<string, number>>({});
  const [layoutZIndices, setLayoutZIndices] = useState<Record<string, number>>({});
  const [focusedViewOrder, setFocusedViewOrder] = useState<string[]>([]); // Track order for focused view stack
  const [isFullscreen, setIsFullscreen] = useState(true); // Auto-open in fullscreen
  const previousSizeRef = useRef<{ width: number; height: number } | null>(null);
  const previousPositionRef = useRef<{ x: number; y: number } | null>(null);
  const currentTheme = useThemeStore((state) => state.current);
  const isXpTheme = currentTheme === "xp" || currentTheme === "win98";

  // Initialize block order when blocks change
  useEffect(() => {
    setBlockOrder((prevOrder) => {
      const newBlockIds = blocks.map((b) => b.id);
      const existingIds = prevOrder.filter((id) => newBlockIds.includes(id));
      const newIds = newBlockIds.filter((id) => !prevOrder.includes(id));
      return [...existingIds, ...newIds];
    });
    
    // Initialize focused view order
    setFocusedViewOrder((prevOrder) => {
      const newBlockIds = blocks.map((b) => b.id);
      const existingIds = prevOrder.filter((id) => newBlockIds.includes(id));
      const newIds = newBlockIds.filter((id) => !prevOrder.includes(id));
      return [...existingIds, ...newIds];
    });
  }, [blocks]);

  const { updateWindowState, updateInstanceWindowState } =
    useAppStoreShallow((state) => ({
      updateWindowState: state.updateWindowState,
      updateInstanceWindowState: state.updateInstanceWindowState,
    }));

  // Capture current window state when component mounts
  useEffect(() => {
    const state = useAppStore.getState();
    const windowState = instanceId
      ? state.instances[instanceId]
      : state.apps["aklos"];

    if (windowState && !previousSizeRef.current) {
      previousSizeRef.current = windowState.size;
      previousPositionRef.current = windowState.position;
    }
  }, [instanceId]);

  const mode: ActionBarMode = selectedBlockId ? "chat" : "search";
  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    const newBlock = generateNewBlock(query);
    setBlocks((prev) => [...prev, newBlock]);
  };

  const handleChat = (message: string) => {
    console.log("Chat message:", message);
    console.log("Selected block:", selectedBlock);
    // Mock: In real implementation, this would call OpenAI API
    // with the selected block's articles as context
  };

  const handleSubmit = (value: string) => {
    if (mode === "search") {
      handleSearch(value);
    } else {
      handleChat(value);
    }
  };

  const handleSelectBlock = (blockId: string) => {
    if (layoutMode === "focused" && selectedBlockId && selectedBlockId !== blockId) {
      // In focused mode, when switching focus, move the old focused block to the end of the list
      setFocusedViewOrder(prev => {
        // Remove the newly selected block (it's becoming focused)
        // Keep all other blocks in their order, and add the old focused block to the end
        const withoutNewSelection = prev.filter(id => id !== blockId);
        const withoutBoth = withoutNewSelection.filter(id => id !== selectedBlockId);
        return [...withoutBoth, selectedBlockId];
      });
    }
    setSelectedBlockId(blockId);
  };

  const handleDeselectBlock = () => {
    setSelectedBlockId(null);
  };

  const handleBlockPositionChange = useCallback(
    (blockId: string, newPosition: { x: number; y: number }) => {
      setBlocks((prev) =>
        prev.map((block) =>
          block.id === blockId ? { ...block, position: newPosition } : block
        )
      );
    },
    []
  );

  const handleBlockInteraction = useCallback((blockId: string) => {
    setBlockOrder((prev) => {
      const filtered = prev.filter((id) => id !== blockId);
      return [...filtered, blockId];
    });
  }, []);

  // Apply layout when mode or selection changes
  useEffect(() => {
    if (layoutMode === "grid") {
      const newPositions = calculateGridPositions(blocks);
      setBlocks((prev) =>
        prev.map((block) => ({
          ...block,
          position: newPositions[block.id] || block.position,
        }))
      );
      setBlockScales({});
      setLayoutZIndices({});
    } else if (layoutMode === "focused") {
      // Reorder blocks based on focusedViewOrder for the vertical stack
      const orderedBlockIds = [...focusedViewOrder];
      const orderedBlocks = orderedBlockIds
        .map(id => blocks.find(b => b.id === id))
        .filter((b): b is Block => b !== undefined);
      
      // Make sure all blocks are included
      const missingBlocks = blocks.filter(b => !orderedBlockIds.includes(b.id));
      const allOrderedBlocks = [...orderedBlocks, ...missingBlocks];
      
      const { positions, scales, zIndices } = calculateFocusedPositions(allOrderedBlocks, selectedBlockId);
      setBlocks((prev) =>
        prev.map((block) => ({
          ...block,
          position: positions[block.id] || block.position,
        }))
      );
      setBlockScales(scales);
      setLayoutZIndices(zIndices);
    } else {
      // Spatial mode - reset scales and layout z-indices
      setBlockScales({});
      setLayoutZIndices({});
    }
  }, [layoutMode, selectedBlockId, blocks.length, focusedViewOrder]);

  const handleLayoutModeChange = useCallback((mode: LayoutMode) => {
    setLayoutMode(mode);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      // Save current state before maximizing
      const state = useAppStore.getState();
      const windowState = instanceId
        ? state.instances[instanceId]
        : state.apps["aklos"];

      if (windowState) {
        previousSizeRef.current = windowState.size;
        previousPositionRef.current = windowState.position;
      }

      // Maximize to full viewport (true fullscreen - cover everything)
      const newSize = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      const newPosition = {
        x: 0,
        y: 0,
      };

      if (instanceId) {
        updateInstanceWindowState(instanceId, newPosition, newSize);
      } else {
        updateWindowState("aklos", newPosition, newSize);
      }

      setIsFullscreen(true);
    } else {
      // Restore previous size and position
      if (previousSizeRef.current && previousPositionRef.current) {
        if (instanceId) {
          updateInstanceWindowState(
            instanceId,
            previousPositionRef.current,
            previousSizeRef.current
          );
        } else {
          updateWindowState(
            "aklos",
            previousPositionRef.current,
            previousSizeRef.current
          );
        }
      }

      setIsFullscreen(false);
    }
  }, [isFullscreen, instanceId, updateWindowState, updateInstanceWindowState]);

  const menuBar = (
    <AklosMenuBar
      onClose={onClose}
      isFullscreen={isFullscreen}
      onToggleFullscreen={toggleFullscreen}
    />
  );

  if (!isWindowOpen) return null;

  // Fullscreen portal - render directly to body to bypass all ryOS constraints
  const fullscreenPortal = isFullscreen
    ? createPortal(
        <div
          className="fixed inset-0 flex flex-col"
          style={{
            zIndex: 9999,
            background: "linear-gradient(180deg, #E2E2E2 0%, #D0D0D0 68%, #A2A9B2 100%)",
          }}
        >
          {/* Spatial Canvas */}
          <SpatialCanvas
            blocks={blocks}
            selectedBlockId={selectedBlockId}
            onSelectBlock={handleSelectBlock}
            onDeselectBlock={handleDeselectBlock}
            onBlockPositionChange={handleBlockPositionChange}
            onBlockInteraction={handleBlockInteraction}
            blockOrder={blockOrder}
            layoutMode={layoutMode}
            blockScales={blockScales}
            layoutZIndices={layoutZIndices}
            onLayoutModeChange={handleLayoutModeChange}
            hideControls={false}
          />

          {/* Action Bar */}
          <ActionBar
            mode={mode}
            selectedBlockTopic={selectedBlock?.topic}
            onSubmit={handleSubmit}
            onCancel={mode === "chat" ? handleDeselectBlock : undefined}
          />

          {/* Exit fullscreen button - shows in fullscreen mode */}
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 p-2 rounded-lg opacity-50 hover:opacity-100 transition-all z-10"
            style={{
              background: "rgba(248, 248, 248, 0.75)",
              backgroundImage: "var(--os-pinstripe-menubar)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(0, 0, 0, 0.18)",
              color: "var(--os-color-text-primary)",
            }}
            title="Exit fullscreen"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      {fullscreenPortal}
      {!isFullscreen && (
        <>
          {!isXpTheme && isForeground && menuBar}
          <WindowFrame
            title="aklOS"
            onClose={onClose}
            isForeground={isForeground}
            appId="aklos"
            skipInitialSound={skipInitialSound}
            instanceId={instanceId}
            windowConstraints={{
              minWidth: 800,
              minHeight: 600,
            }}
            menuBar={isXpTheme ? menuBar : undefined}
          >
            <div className="relative w-full h-full flex flex-col">
              {/* Spatial Canvas */}
              <SpatialCanvas
                blocks={blocks}
                selectedBlockId={selectedBlockId}
                onSelectBlock={handleSelectBlock}
                onDeselectBlock={handleDeselectBlock}
                onBlockPositionChange={handleBlockPositionChange}
                onBlockInteraction={handleBlockInteraction}
                blockOrder={blockOrder}
                layoutMode={layoutMode}
                blockScales={blockScales}
                layoutZIndices={layoutZIndices}
                onLayoutModeChange={handleLayoutModeChange}
                hideControls={false}
              />

              {/* Action Bar */}
              <ActionBar
                mode={mode}
                selectedBlockTopic={selectedBlock?.topic}
                onSubmit={handleSubmit}
                onCancel={mode === "chat" ? handleDeselectBlock : undefined}
              />

              {/* Fullscreen toggle button (bottom right corner) */}
              <button
                onClick={toggleFullscreen}
                className="absolute bottom-20 right-4 p-2 rounded-lg opacity-50 hover:opacity-100 transition-all"
                style={{
                  background: "rgba(248, 248, 248, 0.75)",
                  backgroundImage: "var(--os-pinstripe-menubar)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  border: "1px solid rgba(0, 0, 0, 0.18)",
                  color: "var(--os-color-text-primary)",
                }}
                title="Enter fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </WindowFrame>
        </>
      )}
    </>
  );
}

export const AklosApp: BaseApp = {
  id: "aklos",
  name: "aklOS",
  icon: {
    type: "image",
    src: "/icons/default/internet.png",
  },
  description: "A spatial search interface with AI-powered article discovery",
  component: AklosAppComponent,
  helpItems: [
    {
      icon: "🔍",
      title: "Search for Topics",
      description: "Enter any topic in the search bar to discover related articles grouped into blocks.",
    },
    {
      icon: "💬",
      title: "Chat About Blocks",
      description: "Click on any block to select it, then use the chat bar to ask questions about the articles.",
    },
    {
      icon: "🗺️",
      title: "Navigate the Canvas",
      description: "Drag to pan around the canvas and use mouse wheel to zoom in and out.",
    },
    {
      icon: "📦",
      title: "Blocks",
      description: "Each block represents a topic and contains multiple related articles from various sources.",
    },
  ],
  metadata: {
    name: "aklOS",
    version: "0.1.0",
    creator: {
      name: "akl",
      url: "https://akl.io",
    },
    icon: "/icons/default/internet.png",
  },
};

