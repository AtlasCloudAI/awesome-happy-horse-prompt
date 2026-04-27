import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface PromptRecord {
  id: number;
  title: string;
  description: string;
  prompt: string;
  category: string;
  video_url?: string;
  author_name: string;
  author_link?: string;
  source_platform: string;
  source_link?: string;
  language: string;
  featured?: boolean;
  source_meta?: {
    github_issue?: string;
  };
}

export interface SortedPromptData {
  all: PromptRecord[];
  featured: PromptRecord[];
  regular: PromptRecord[];
  categoryCounts: Array<{ category: string; count: number }>;
  stats: {
    total: number;
    featured: number;
    videos: number;
  };
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "../..");
const dataPath = path.join(root, "data", "prompts.json");

export async function loadPrompts(): Promise<PromptRecord[]> {
  const raw = await fs.readFile(dataPath, "utf8");
  const prompts = JSON.parse(raw) as PromptRecord[];

  return prompts.sort((a, b) => a.id - b.id).map((prompt, index) => ({
    ...prompt,
    featured: prompt.featured ?? index < 6,
  }));
}

export async function savePrompts(prompts: PromptRecord[]): Promise<void> {
  const sorted = [...prompts].sort((a, b) => a.id - b.id);
  await fs.writeFile(dataPath, JSON.stringify(sorted, null, 2) + "\n", "utf8");
}

export function getNextId(prompts: PromptRecord[]): number {
  return prompts.reduce((max, prompt) => Math.max(max, prompt.id), 0) + 1;
}

export function sortPrompts(prompts: PromptRecord[]): SortedPromptData {
  const featured = prompts.filter((prompt) => prompt.featured).slice(0, 6);
  const featuredIds = new Set(featured.map((prompt) => prompt.id));
  const regular = prompts.filter((prompt) => !featuredIds.has(prompt.id));
  const categoryMap = new Map<string, number>();

  for (const prompt of prompts) {
    categoryMap.set(prompt.category, (categoryMap.get(prompt.category) || 0) + 1);
  }

  return {
    all: prompts,
    featured,
    regular,
    categoryCounts: [...categoryMap.entries()].map(([category, count]) => ({
      category,
      count,
    })),
    stats: {
      total: prompts.length,
      featured: featured.length,
      videos: prompts.filter((prompt) => Boolean(prompt.video_url)).length,
    },
  };
}
