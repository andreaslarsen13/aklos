import { Block, Article } from "../types";

export interface Position {
  x: number;
  y: number;
}

export function calculateGridPositions(blocks: Block[]): Record<string, Position> {
  const positions: Record<string, Position> = {};
  
  const HORIZONTAL_SPACING = 650; // 600px block + 50px margin
  const VERTICAL_SPACING = 300; // 250px block + 50px margin
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

  const BLOCK_WIDTH = 600;
  const BLOCK_HEIGHT = 250;
  const SIDEBAR_X = window.innerWidth - BLOCK_WIDTH - 50; // Position sidebar on the right with margin
  const SIDEBAR_START_Y = 50;
  const FIXED_VERTICAL_SPACING = 280; // Fixed spacing per block slot (250px height * 0.6 scale + gap)
  const SMALL_SCALE = 0.6;

  const backgroundBlocks = blocks.filter(b => b.id !== focusedBlock.id);

  // Center the focused block in the viewport
  const FOCUSED_X = (window.innerWidth - BLOCK_WIDTH) / 2;
  const FOCUSED_Y = (window.innerHeight - BLOCK_HEIGHT) / 2;
  
  positions[focusedBlock.id] = { x: FOCUSED_X, y: FOCUSED_Y };
  scales[focusedBlock.id] = 1;
  zIndices[focusedBlock.id] = 1000;

  // Position background blocks with fixed spacing
  backgroundBlocks.forEach((block, index) => {
    positions[block.id] = { 
      x: SIDEBAR_X, 
      y: SIDEBAR_START_Y + (index * FIXED_VERTICAL_SPACING) 
    };
    scales[block.id] = SMALL_SCALE;
    zIndices[block.id] = 100 + (backgroundBlocks.length - index);
  });

  return { positions, scales, zIndices };
}

/**
 * Calculate layout for focused article view
 * One article is centered and large, others are small on the right
 */
export function calculateFocusedArticlePositions(
  articles: Article[],
  focusedArticleId: string | null
): {
  positions: Record<string, Position>;
  scales: Record<string, number>;
  zIndices: Record<string, number>;
} {
  const positions: Record<string, Position> = {};
  const scales: Record<string, number> = {};
  const zIndices: Record<string, number> = {};

  // Determine which article should be focused
  const focusedArticle = focusedArticleId
    ? articles.find((a) => a.id === focusedArticleId)
    : articles[0];

  if (!focusedArticle) {
    return { positions, scales, zIndices };
  }

  const ARTICLE_CARD_WIDTH = 600;
  const SIDEBAR_X = window.innerWidth - ARTICLE_CARD_WIDTH * 0.6 - 50;
  const SIDEBAR_START_Y = 50;
  const GAP = 30;
  const SMALL_SCALE = 0.6;

  const backgroundArticles = articles.filter(a => a.id !== focusedArticle.id);

  // Center the focused article
  const FOCUSED_X = (window.innerWidth - ARTICLE_CARD_WIDTH) / 2;
  const FOCUSED_Y = (window.innerHeight - 500) / 2; // Approximate article card height
  
  positions[focusedArticle.id] = { x: FOCUSED_X, y: FOCUSED_Y };
  scales[focusedArticle.id] = 1;
  zIndices[focusedArticle.id] = 1000;

  // Position background articles in a vertical list on the right
  // Use fixed spacing to ensure no overlap
  const FIXED_ARTICLE_SPACING = 300; // Fixed spacing per article slot
  
  backgroundArticles.forEach((article, index) => {
    positions[article.id] = { 
      x: SIDEBAR_X, 
      y: SIDEBAR_START_Y + (index * FIXED_ARTICLE_SPACING) 
    };
    scales[article.id] = SMALL_SCALE;
    zIndices[article.id] = 100 + (backgroundArticles.length - index);
  });

  return { positions, scales, zIndices };
}

