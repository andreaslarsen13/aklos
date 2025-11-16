import { useState, useCallback, useRef, useEffect } from "react";

interface UseBlockDragProps {
  blockId: string;
  initialPosition: { x: number; y: number };
  canvasZoom: number;
  onPositionChange: (blockId: string, newPosition: { x: number; y: number }) => void;
}

const DRAG_THRESHOLD = 0; // No threshold for immediate, fluid dragging

export function useBlockDrag({
  blockId,
  initialPosition,
  canvasZoom,
  onPositionChange,
}: UseBlockDragProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartMousePos = useRef({ x: 0, y: 0 });
  const dragStartBlockPos = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      // Prevent dragging if clicking on interactive elements
      const target = e.target as HTMLElement;
      if (
        target.closest("button") ||
        target.closest("input") ||
        target.closest("a")
      ) {
        return;
      }

      e.stopPropagation(); // Prevent canvas panning

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      dragStartMousePos.current = { x: clientX, y: clientY };
      dragStartBlockPos.current = { ...initialPosition };
      hasMoved.current = false;

      setIsDragging(true);
    },
    [initialPosition]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - dragStartMousePos.current.x;
      const deltaY = clientY - dragStartMousePos.current.y;

      // Check if moved past threshold
      if (!hasMoved.current) {
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (distance < DRAG_THRESHOLD) {
          return;
        }
        hasMoved.current = true;
      }

      // Account for canvas zoom when calculating new position
      const newPosition = {
        x: dragStartBlockPos.current.x + deltaX / canvasZoom,
        y: dragStartBlockPos.current.y + deltaY / canvasZoom,
      };

      onPositionChange(blockId, newPosition);
    },
    [isDragging, blockId, canvasZoom, onPositionChange]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    hasMoved.current = false;
  }, []);

  // Add and remove event listeners
  useEffect(() => {
    if (!isDragging) return;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleMouseMove);
    window.addEventListener("touchend", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return {
    isDragging,
    handleMouseDown,
    hasMoved: hasMoved.current,
  };
}

