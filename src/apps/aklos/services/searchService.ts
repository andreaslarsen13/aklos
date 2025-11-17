import { ParallelSearchResponse } from "../types/parallel";
import { Block } from "../types";

export async function searchWithParallel(query: string): Promise<Block[]> {
  console.log("Calling search API for query:", query);
  
  try {
    // Call our backend API endpoint instead of Parallel directly
    // This avoids CORS issues and keeps the API key secure
    const response = await fetch("/api/parallel-search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    const data: ParallelSearchResponse = await response.json();
    console.log("Search response received:", data);

    // Convert to Block format
    return data.topics.map((topic, index) => ({
      id: `block-${Date.now()}-${index}`,
      topic: topic.topic,
      description: topic.description,
      articles: topic.articles.map((article, articleIndex) => ({
        id: `article-${Date.now()}-${index}-${articleIndex}`,
        title: article.title,
        source: article.source,
        url: article.url,
        snippet: article.snippet,
        date: article.published_date || new Date().toLocaleDateString(),
      })),
      position: { x: 100 + index * 650, y: 100 }, // Initial positioning
    }));
  } catch (error) {
    console.error("Search API Error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
    throw error;
  }
}

