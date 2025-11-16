import { Block, Article } from "../types";

const mockArticles: { [topic: string]: Article[] } = {
  "AI in Creative Work": [
    {
      id: "art-1",
      title: "Midjourney v6 Released with Photorealistic Capabilities",
      source: "TechCrunch",
      date: "2024-01-15",
      snippet:
        "The latest version of Midjourney introduces groundbreaking photorealistic rendering that challenges traditional photography...",
      url: "https://example.com/midjourney-v6",
    },
    {
      id: "art-2",
      title: "DALL-E 3 Integration with ChatGPT Transforms Workflows",
      source: "The Verge",
      date: "2024-01-10",
      snippet:
        "OpenAI's integration allows designers to generate and iterate on images directly within their chat interface...",
      url: "https://example.com/dalle3-chatgpt",
    },
    {
      id: "art-3",
      title: "Adobe Firefly Reaches 3 Billion Image Generations",
      source: "Adobe Blog",
      date: "2024-01-08",
      snippet:
        "Adobe's generative AI platform celebrates a major milestone as creative professionals embrace AI-assisted design...",
      url: "https://example.com/firefly-milestone",
    },
  ],
  "Web Development Trends": [
    {
      id: "web-1",
      title: "React Server Components Become Production Ready",
      source: "React Blog",
      date: "2024-01-20",
      snippet:
        "The React team announces full production support for Server Components, revolutionizing how we build web applications...",
      url: "https://example.com/rsc-production",
    },
    {
      id: "web-2",
      title: "Bun 1.0: The Fast All-in-One JavaScript Runtime",
      source: "Bun Blog",
      date: "2023-09-15",
      snippet:
        "Bun reaches version 1.0, offering a faster alternative to Node.js with built-in bundler, test runner, and package manager...",
      url: "https://example.com/bun-1.0",
    },
    {
      id: "web-3",
      title: "Tailwind CSS v4 Alpha Introduces New Engine",
      source: "Tailwind Labs",
      date: "2024-01-12",
      snippet:
        "The next major version of Tailwind CSS features a complete rewrite in Rust, delivering 10x faster build times...",
      url: "https://example.com/tailwind-v4",
    },
  ],
  "Machine Learning Research": [
    {
      id: "ml-1",
      title: "GPT-4 Turbo: More Capable, More Affordable",
      source: "OpenAI",
      date: "2023-11-06",
      snippet:
        "OpenAI releases GPT-4 Turbo with 128K context window, improved instruction following, and JSON mode...",
      url: "https://example.com/gpt4-turbo",
    },
    {
      id: "ml-2",
      title: "Google's Gemini Ultra Outperforms GPT-4",
      source: "Google DeepMind",
      date: "2023-12-06",
      snippet:
        "Google's new multimodal AI model demonstrates superior performance across multiple benchmarks...",
      url: "https://example.com/gemini-ultra",
    },
  ],
  "Design Systems": [
    {
      id: "ds-1",
      title: "Figma Dev Mode: Bridging Design and Development",
      source: "Figma Blog",
      date: "2023-06-21",
      snippet:
        "New features help developers extract code, inspect designs, and integrate with VS Code more seamlessly...",
      url: "https://example.com/figma-devmode",
    },
    {
      id: "ds-2",
      title: "Radix UI 2.0: Unstyled, Accessible Components",
      source: "Radix UI",
      date: "2023-10-15",
      snippet:
        "The latest version of Radix UI brings improved accessibility features and better TypeScript support...",
      url: "https://example.com/radix-2.0",
    },
    {
      id: "ds-3",
      title: "Shadcn UI: The Design System Taking Over",
      source: "Dev.to",
      date: "2023-12-01",
      snippet:
        "Why developers are choosing copy-paste components over traditional libraries for their projects...",
      url: "https://example.com/shadcn-analysis",
    },
  ],
};

export function generateMockBlocks(): Block[] {
  return [
    {
      id: "block-1",
      topic: "AI in Creative Work",
      description: "Exploring how AI is transforming creative industries",
      position: { x: 100, y: 100 },
      articles: mockArticles["AI in Creative Work"],
    },
    {
      id: "block-2",
      topic: "Web Development Trends",
      description: "Latest frameworks and tools in web development",
      position: { x: 550, y: 150 },
      articles: mockArticles["Web Development Trends"],
    },
    {
      id: "block-3",
      topic: "Machine Learning Research",
      description: "Cutting-edge developments in ML and AI",
      position: { x: 200, y: 450 },
      articles: mockArticles["Machine Learning Research"],
    },
    {
      id: "block-4",
      topic: "Design Systems",
      description: "Modern approaches to scalable design",
      position: { x: 700, y: 400 },
      articles: mockArticles["Design Systems"],
    },
  ];
}

export function generateNewBlock(topic: string): Block {
  const id = `block-${Date.now()}`;
  
  // Generate random articles for the new topic
  const numArticles = Math.floor(Math.random() * 3) + 2; // 2-4 articles
  const articles: Article[] = Array.from({ length: numArticles }, (_, i) => ({
    id: `${id}-art-${i}`,
    title: `Article about ${topic} #${i + 1}`,
    source: ["TechCrunch", "The Verge", "Wired", "MIT Tech Review"][
      Math.floor(Math.random() * 4)
    ],
    date: new Date().toISOString().split("T")[0],
    snippet: `This is a mock article snippet about ${topic}. In a real implementation, this would come from the Parallel Search API...`,
    url: "https://example.com",
  }));

  return {
    id,
    topic,
    description: `Exploring ${topic}`,
    position: {
      x: Math.random() * 400 + 200,
      y: Math.random() * 400 + 200,
    },
    articles,
  };
}

