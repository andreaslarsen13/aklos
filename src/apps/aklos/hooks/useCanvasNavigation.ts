import { useState, useCallback, useRef, useEffect } from "react";
import { CanvasState } from "../types";

interface UseCanvasNavigationProps {
  initialPan?: { x: number; y: number };
  initialZoom?: number;
  minZoom?: number;
  maxZoom?: number;
}

export function useCanvasNavigation({
  initialPan = { x: 0, y: 0 },
  initialZoom = 1,
  minZoom = 0.5,
  maxZoom = 2,
}: UseCanvasNavigationProps = {}) {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    panOffset: initialPan,
    zoom: initialZoom,
  });
  
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const dragStartOffset = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    // Check if clicking on a block or canvas background
    const target = e.target as HTMLElement;
    
    // Don't start dragging if clicking on a block or interactive element
    if (
      target.closest('[data-block]') || 
      target.closest('[data-action-bar]') ||
      target.closest('button') ||
      target.closest('input')
    ) {
      return;
    }

    setIsDragging(true);
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    dragStartPos.current = { x: clientX, y: clientY };
    dragStartOffset.current = { ...canvasState.panOffset };
  }, [canvasState.panOffset]);

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const deltaX = clientX - dragStartPos.current.x;
    const deltaY = clientY - dragStartPos.current.y;

    setCanvasState((prev) => ({
      ...prev,
      panOffset: {
        x: dragStartOffset.current.x + deltaX,
        y: dragStartOffset.current.y + deltaY,
      },
    }));
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    
    const delta = -e.deltaY * 0.001;
    
    setCanvasState((prev) => {
      const newZoom = Math.min(maxZoom, Math.max(minZoom, prev.zoom + delta));
      return {
        ...prev,
        zoom: newZoom,
      };
    });
  }, [minZoom, maxZoom]);

  // Add and remove event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleMouseMove);
    window.addEventListener('touchend', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [handleMouseMove, handleMouseUp, handleWheel]);

  return {
    canvasState,
    isDragging,
    handleMouseDown,
    canvasRef,
  };
}

