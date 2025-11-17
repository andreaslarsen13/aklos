import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { WindowFrame } from "@/components/layout/WindowFrame";
import { SpatialCanvas } from "./components/SpatialCanvas";
import { ActionBar } from "./components/ActionBar";
import { AklosMenuBar } from "./components/AklosMenuBar";
import { EmptyState } from "./components/EmptyState";
import { LayoutMode } from "./components/LayoutControls";
import { searchWithParallel } from "./services/searchService";
import { calculateFocusedArticlePositions } from "./utils/layoutCalculations";
import { ArticleCard } from "./components/ArticleCard";
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
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [blockOrder, setBlockOrder] = useState<string[]>([]);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("home");
  const [blockScales, setBlockScales] = useState<Record<string, number>>({});
  const [layoutZIndices, setLayoutZIndices] = useState<Record<string, number>>({});
  const [focusedViewOrder, setFocusedViewOrder] = useState<string[]>([]); // Track order for focused view stack
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null); // Track selected article in focused mode
  const [articlePositions, setArticlePositions] = useState<Record<string, { x: number; y: number }>>({});
  const [articleScales, setArticleScales] = useState<Record<string, number>>({});
  const [articleZIndices, setArticleZIndices] = useState<Record<string, number>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(true); // Auto-open in fullscreen
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
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

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setSearchError(null);
    
    try {
      const newBlocks = await searchWithParallel(query);
      setBlocks((prev) => [...prev, ...newBlocks]);
    } catch (error) {
      console.error("Search error:", error);
      setSearchError(error instanceof Error ? error.message : "Failed to search. Please try again.");
    } finally {
      setIsSearching(false);
    }
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
    // When clicking a block in home mode, enter focused mode and show its articles
    if (layoutMode === "home") {
      setSelectedBlockId(blockId);
      setLayoutMode("focused");
      // Select the first article of the block
      const block = blocks.find(b => b.id === blockId);
      if (block && block.articles.length > 0) {
        setSelectedArticleId(block.articles[0].id);
        // Initialize focused view order with all article IDs except the first
        setFocusedViewOrder(block.articles.slice(1).map(a => a.id));
      }
    } else if (layoutMode === "focused") {
      // In focused mode, this is selecting a different block (switching between blocks)
      // For now we'll just update the selected block
      if (selectedBlockId && selectedBlockId !== blockId) {
        setFocusedViewOrder(prev => {
          const withoutNewSelection = prev.filter(id => id !== blockId);
          const withoutBoth = withoutNewSelection.filter(id => id !== selectedBlockId);
          return [...withoutBoth, selectedBlockId];
        });
      } else if (!selectedBlockId) {
        setFocusedViewOrder(prev => {
          const defaultFocusedBlock = prev[0];
          if (defaultFocusedBlock && defaultFocusedBlock !== blockId) {
            const withoutClicked = prev.filter(id => id !== blockId);
            const withoutBoth = withoutClicked.filter(id => id !== defaultFocusedBlock);
            return [...withoutBoth, defaultFocusedBlock];
          }
          return prev.filter(id => id !== blockId);
        });
      }
      setSelectedBlockId(blockId);
    }
  };

  const handleDeselectBlock = () => {
    setSelectedBlockId(null);
  };

  const handleSelectArticle = (articleId: string) => {
    if (layoutMode === "focused" && selectedArticleId && selectedArticleId !== articleId) {
      // Switching focus: move the old focused article to the end of the list
      setFocusedViewOrder(prev => {
        const withoutNewSelection = prev.filter(id => id !== articleId);
        const withoutBoth = withoutNewSelection.filter(id => id !== selectedArticleId);
        return [...withoutBoth, selectedArticleId];
      });
    } else if (layoutMode === "focused" && !selectedArticleId) {
      // First time selecting
      setFocusedViewOrder(prev => {
        const defaultFocusedArticle = focusedBlockArticles[0]?.id;
        if (defaultFocusedArticle && defaultFocusedArticle !== articleId) {
          const withoutClicked = prev.filter(id => id !== articleId);
          const withoutBoth = withoutClicked.filter(id => id !== defaultFocusedArticle);
          return [...withoutBoth, defaultFocusedArticle];
        }
        return prev.filter(id => id !== articleId);
      });
    }
    setSelectedArticleId(articleId);
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

  // Get articles for focused mode
  const focusedBlockArticles = selectedBlockId
    ? blocks.find(b => b.id === selectedBlockId)?.articles || []
    : [];

  // Apply layout when mode or selection changes
  useEffect(() => {
    if (layoutMode === "home") {
      // Home mode - spatial view with blocks
      setBlockScales({});
      setLayoutZIndices({});
      // Clear article positions when leaving focused mode
      setArticlePositions({});
      setArticleScales({});
      setArticleZIndices({});
    }
  }, [layoutMode]);

  // Update article positions when in focused mode and article order/selection changes
  useEffect(() => {
    if (layoutMode === "focused" && focusedBlockArticles.length > 0) {
      const orderedArticleIds = [...focusedViewOrder];
      const orderedArticles = orderedArticleIds
        .map(id => focusedBlockArticles.find(a => a.id === id))
        .filter((a): a is NonNullable<typeof a> => a !== undefined);
      const missingArticles = focusedBlockArticles.filter(a => !orderedArticleIds.includes(a.id));
      const allOrderedArticles = [...orderedArticles, ...missingArticles];
      
      const layout = calculateFocusedArticlePositions(allOrderedArticles, selectedArticleId);
      
      // Use requestAnimationFrame to ensure smooth transition
      requestAnimationFrame(() => {
        setArticlePositions(layout.positions);
        setArticleScales(layout.scales);
        setArticleZIndices(layout.zIndices);
      });
    }
  }, [layoutMode, focusedBlockArticles, focusedViewOrder, selectedArticleId]);

  const handleLayoutModeChange = useCallback((mode: LayoutMode) => {
    // Start transition
    setIsTransitioning(true);
    
    // Small delay to allow fade out
    setTimeout(() => {
      if (mode === "home") {
        // Return to home view
        setLayoutMode("home");
        setSelectedArticleId(null);
      } else if (mode === "focused") {
        // Enter focused mode - need a selected block
        if (selectedBlockId) {
          setLayoutMode("focused");
          const block = blocks.find(b => b.id === selectedBlockId);
          if (block && block.articles.length > 0 && !selectedArticleId) {
            setSelectedArticleId(block.articles[0].id);
            setFocusedViewOrder(block.articles.slice(1).map(a => a.id));
          }
        }
      }
      
      // End transition after content changes
      setTimeout(() => setIsTransitioning(false), 50);
    }, 150);
  }, [selectedBlockId, blocks, selectedArticleId]);

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

  // Get all ordered articles for rendering
  const orderedArticleIds = [...focusedViewOrder];
  const orderedArticles = orderedArticleIds
    .map(id => focusedBlockArticles.find(a => a.id === id))
    .filter((a): a is NonNullable<typeof a> => a !== undefined);
  const missingArticles = focusedBlockArticles.filter(a => !orderedArticleIds.includes(a.id));
  const allOrderedArticles = [...orderedArticles, ...missingArticles];

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
          {/* Content: either blocks or articles depending on mode */}
          <div
            style={{
              width: "100%",
              height: "100%",
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning ? "scale(0.98)" : "scale(1)",
              transition: "opacity 0.2s ease-out, transform 0.2s ease-out",
            }}
          >
            {layoutMode === "home" ? (
              <>
                {blocks.length === 0 && <EmptyState />}
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
              </>
            ) : (
            /* Focused article view */
            <div className="relative w-full h-full">
              {/* Layout Controls */}
              <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
                <div className="pointer-events-auto">
                  {/* Import LayoutControls inline */}
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
                      <button
                        onClick={() => handleLayoutModeChange("home")}
                        className="px-3 py-2 flex items-center gap-2 transition-all"
                        style={{
                          backgroundColor: "transparent",
                          color: "var(--os-color-text-primary)",
                          fontFamily: "var(--os-font-ui)",
                          fontSize: "11px",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Home
                      </button>
                      <button
                        onClick={() => handleLayoutModeChange("focused")}
                        className="px-3 py-2 flex items-center gap-2 transition-all"
                        style={{
                          backgroundColor: "var(--os-color-selection-bg)",
                          color: "#FFFFFF",
                          fontFamily: "var(--os-font-ui)",
                          fontSize: "11px",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Focused
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Render article cards */}
              {allOrderedArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  isSelected={selectedArticleId === article.id}
                  onSelect={() => handleSelectArticle(article.id)}
                  scale={articleScales[article.id] || 1}
                  position={articlePositions[article.id] || { x: 0, y: 0 }}
                  zIndex={articleZIndices[article.id] || 1}
                />
              ))}
            </div>
            )}
          </div>

          {/* Action Bar */}
          <ActionBar
            mode={mode}
            selectedBlockTopic={selectedBlock?.topic}
            onSubmit={handleSubmit}
            onCancel={mode === "chat" ? handleDeselectBlock : undefined}
            isLoading={isSearching}
            error={searchError}
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
              {/* Content: either blocks or articles depending on mode */}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  opacity: isTransitioning ? 0 : 1,
                  transform: isTransitioning ? "scale(0.98)" : "scale(1)",
                  transition: "opacity 0.2s ease-out, transform 0.2s ease-out",
                }}
              >
                {layoutMode === "home" ? (
                  <>
                    {blocks.length === 0 && <EmptyState />}
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
                  </>
                ) : (
                /* Focused article view */
                <div className="relative w-full h-full">
                  {/* Layout Controls */}
                  <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
                    <div className="pointer-events-auto">
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
                          <button
                            onClick={() => handleLayoutModeChange("home")}
                            className="px-3 py-2 flex items-center gap-2 transition-all"
                            style={{
                              backgroundColor: "transparent",
                              color: "var(--os-color-text-primary)",
                              fontFamily: "var(--os-font-ui)",
                              fontSize: "11px",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            Home
                          </button>
                          <button
                            onClick={() => handleLayoutModeChange("focused")}
                            className="px-3 py-2 flex items-center gap-2 transition-all"
                            style={{
                              backgroundColor: "var(--os-color-selection-bg)",
                              color: "#FFFFFF",
                              fontFamily: "var(--os-font-ui)",
                              fontSize: "11px",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            Focused
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Render article cards */}
                  {allOrderedArticles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      isSelected={selectedArticleId === article.id}
                      onSelect={() => handleSelectArticle(article.id)}
                      scale={articleScales[article.id] || 1}
                      position={articlePositions[article.id] || { x: 0, y: 0 }}
                      zIndex={articleZIndices[article.id] || 1}
                    />
                  ))}
                </div>
                )}
              </div>

              {/* Action Bar */}
              <ActionBar
                mode={mode}
                selectedBlockTopic={selectedBlock?.topic}
                onSubmit={handleSubmit}
                onCancel={mode === "chat" ? handleDeselectBlock : undefined}
                isLoading={isSearching}
                error={searchError}
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

