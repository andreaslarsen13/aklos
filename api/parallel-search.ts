import OpenAI from "openai";
import { getEffectiveOrigin, isAllowedOrigin, preflightIfNeeded } from "./utils/cors.js";

export const runtime = "edge";
export const edge = true;

const SEARCH_SCHEMA = {
  type: "json_schema",
  json_schema: {
    name: "search_results_schema",
    strict: true,
    schema: {
      type: "object",
      properties: {
        topics: {
          type: "array",
          items: {
            type: "object",
            properties: {
              topic: {
                type: "string",
                description: "A concise topic name"
              },
              description: {
                type: "string",
                description: "A brief description of the topic"
              },
              articles: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    source: { type: "string" },
                    date: { type: "string" },
                    snippet: { type: "string" },
                    url: { type: "string" }
                  },
                  required: ["title", "source", "date", "snippet", "url"],
                  additionalProperties: false
                }
              }
            },
            required: ["topic", "description", "articles"],
            additionalProperties: false
          }
        }
      },
      required: ["topics"],
      additionalProperties: false
    }
  }
};

export default async function handler(req: Request) {
  const effectiveOrigin = getEffectiveOrigin(req);
  
  // Handle preflight
  const preflightResponse = preflightIfNeeded(req, ["POST", "OPTIONS"], effectiveOrigin);
  if (preflightResponse) return preflightResponse;
  
  // Validate origin
  if (!isAllowedOrigin(effectiveOrigin)) {
    return new Response("Unauthorized", { status: 403 });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string") {
      return new Response(
        JSON.stringify({ error: "Query is required and must be a string" }),
        { 
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": effectiveOrigin,
          }
        }
      );
    }

    // Check if API key is configured
    const apiKey = process.env.PARALLEL_API_KEY;
    console.log("[Parallel Search] API Key configured:", !!apiKey);
    console.log("[Parallel Search] Available env vars:", Object.keys(process.env).filter(k => k.includes('PARALLEL')));
    
    if (!apiKey) {
      console.error("[Parallel Search] PARALLEL_API_KEY is not configured in environment");
      return new Response(
        JSON.stringify({ 
          error: "Server configuration error",
          message: "PARALLEL_API_KEY not found. Make sure it's in .env.local and restart the dev server."
        }),
        { 
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": effectiveOrigin,
          }
        }
      );
    }

    console.log(`[Parallel Search] Query: ${query}`);

    // Initialize Parallel client
    const parallelClient = new OpenAI({
      apiKey,
      baseURL: "https://api.parallel.ai",
    });

    // Call Parallel API
    const response = await parallelClient.chat.completions.create({
      model: "speed",
      messages: [
        {
          role: "system",
          content: `You are a research assistant. For the given search query, research the topic and organize your findings into 3-5 distinct topics/subtopics. For each topic, provide 3-5 relevant articles with titles, sources, URLs, and brief snippets.`
        },
        {
          role: "user",
          content: `Research this topic and provide organized results: "${query}"`
        }
      ],
      response_format: SEARCH_SCHEMA,
    });

    console.log("[Parallel Search] Response received");

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response from Parallel API");
    }

    const data = JSON.parse(content);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": effectiveOrigin,
      },
    });

  } catch (error) {
    console.error("[Parallel Search] Error:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Search failed", 
        message: error instanceof Error ? error.message : "Unknown error" 
      }),
      { 
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": effectiveOrigin,
        }
      }
    );
  }
}

