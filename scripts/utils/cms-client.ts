import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface PromptRecord {
  id: string | number;
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

export function getPromptSortKey(id: string | number): number {
  if (typeof id === "number") {
    return id;
  }

  const numeric = Number(id);
  if (!Number.isNaN(numeric)) {
    return numeric;
  }

  const match = String(id).match(/(\d+)(?!.*\d)/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

export async function loadPrompts(): Promise<PromptRecord[]> {
  const raw = await fs.readFile(dataPath, "utf8");
  const prompts = JSON.parse(raw) as PromptRecord[];

  return prompts.sort((a, b) => getPromptSortKey(a.id) - getPromptSortKey(b.id)).map((prompt, index) => ({
    ...prompt,
    featured: prompt.featured ?? index < 6,
  }));
}

export async function savePrompts(prompts: PromptRecord[]): Promise<void> {
  const sorted = [...prompts].sort((a, b) => getPromptSortKey(a.id) - getPromptSortKey(b.id));
  await fs.writeFile(dataPath, JSON.stringify(sorted, null, 2) + "\n", "utf8");
}

export function getNextId(prompts: PromptRecord[]): number {
  return (
    prompts.reduce((max, prompt) => {
      return typeof prompt.id === "number" ? Math.max(max, prompt.id) : max;
    }, 0) + 1
  );
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
    categoryCounts: [...categoryMap.entries()]
      .map(([category, count]) => ({
        category,
        count,
      }))
      .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category)),
    stats: {
      total: prompts.length,
      featured: featured.length,
      videos: prompts.filter((prompt) => Boolean(prompt.video_url)).length,
    },
  };
}
