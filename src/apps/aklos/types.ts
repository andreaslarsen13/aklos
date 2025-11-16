export interface Article {
  id: string;
  title: string;
  source: string;
  date: string;
  snippet: string;
  url: string;
}

export interface Block {
  id: string;
  topic: string;
  description: string;
  articles: Article[];
  position: {
    x: number;
    y: number;
  };
}

export interface CanvasState {
  panOffset: {
    x: number;
    y: number;
  };
  zoom: number;
}

export type ActionBarMode = "search" | "chat";

