export interface ParallelArticle {
  title: string;
  source: string;
  url: string;
  snippet: string;
  published_date?: string;
}

export interface ParallelTopic {
  topic: string;
  description: string;
  articles: ParallelArticle[];
}

export interface ParallelSearchResponse {
  topics: ParallelTopic[];
}

