import OpenAI from "openai";

export const parallelClient = new OpenAI({
  apiKey: import.meta.env.VITE_PARALLEL_API_KEY || "",
  baseURL: "https://api.parallel.ai",
  dangerouslyAllowBrowser: true, // For client-side usage
});

