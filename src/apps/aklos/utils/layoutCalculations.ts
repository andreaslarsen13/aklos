import { Block } from "../types";

export interface Position {
  x: number;
  y: number;
}

/**
 * Calculate the height of a block based on its content
 */
function calculateBlockHeight(block: Block, scale: number): number {
  const HEADER_HEIGHT = 70;
  const ARTICLE_HEIGHT = 100;
  const FOOTER_HEIGHT = 35;
  const MAX_ARTICLES_HEIGHT = 384; // max-h-96
  
  const articlesHeight = Math.min(
    block.articles.length * ARTICLE_HEIGHT,
    MAX_ARTICLES_HEIGHT
  );
  
  return (HEADER_HEIGHT + articlesHeight + FOOTER_HEIGHT) * scale;
}

export function calculateGridPositions(blocks: Block[]): Record<string, Position> {
  const positions: Record<string, Position> = {};
  
  const HORIZONTAL_SPACING = 400;
  const VERTICAL_SPACING = 450;
  const START_X = 50;
  const START_Y = 50;

  // Calculate grid dimensions
  const cols = Math.ceil(Math.sqrt(blocks.length));
  
  blocks.forEach((block, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    
    positions[block.id] = {
      x: START_X + col * HORIZONTAL_SPACING,
      y: START_Y + row * VERTICAL_SPACING,
    };
  });

  return positions;
}

export function calculateFocusedPositions(
  blocks: Block[],
  focusedId: string | null
): {
  positions: Record<string, Position>;
  scales: Record<string, number>;
  zIndices: Record<string, number>;
} {
  const positions: Record<string, Position> = {};
  const scales: Record<string, number> = {};
  const zIndices: Record<string, number> = {};

  // Determine which block should be focused
  const focusedBlock = focusedId
    ? blocks.find((b) => b.id === focusedId)
    : blocks[0];

  if (!focusedBlock) {
    // Fallback to spatial if no blocks
    blocks.forEach((block) => {
      positions[block.id] = block.position;
      scales[block.id] = 1;
      zIndices[block.id] = 1;
    });
    return { positions, scales, zIndices };
  }

  const FOCUSED_X = 250;
  const FOCUSED_Y = 150;
  const SIDEBAR_X = 750;
  const SIDEBAR_START_Y = 50;
  const GAP = 30; // Gap between blocks
  const SMALL_SCALE = 0.6;

  const backgroundBlocks = blocks.filter(b => b.id !== focusedBlock.id);

  // Position focused block
  positions[focusedBlock.id] = { x: FOCUSED_X, y: FOCUSED_Y };
  scales[focusedBlock.id] = 1;
  zIndices[focusedBlock.id] = 1000;

  // Position background blocks: calculate height, add gap, next block
  let currentY = SIDEBAR_START_Y;
  backgroundBlocks.forEach((block, index) => {
    positions[block.id] = { x: SIDEBAR_X, y: currentY };
    scales[block.id] = SMALL_SCALE;
    zIndices[block.id] = 100 + (backgroundBlocks.length - index);
    
    // Move Y down by this block's height + gap for next block
    const blockHeight = calculateBlockHeight(block, SMALL_SCALE);
    currentY += blockHeight + GAP;
  });

  return { positions, scales, zIndices };
}

