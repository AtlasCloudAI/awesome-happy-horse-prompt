import "dotenv/config";
import { Octokit } from "@octokit/rest";
import { getNextId, loadPrompts, savePrompts, type PromptRecord } from "./utils/cms-client.js";

interface IssueFields {
  prompt_title?: string;
  prompt?: string;
  description?: string;
  category?: string;
  preview_video_url?: string;
  original_author?: string;
  author_profile_link?: string;
  source_link?: string;
  source_platform?: string;
  prompt_language?: string;
}

const FIELD_NAME_MAP: Record<string, keyof IssueFields> = {
  prompt_title: "prompt_title",
  prompt: "prompt",
  description: "description",
  category: "category",
  preview_video_url: "preview_video_url",
  original_author: "original_author",
  author_profile_link: "author_profile_link",
  source_link: "source_link",
  source_platform: "source_platform",
  prompt_language: "prompt_language",
};

const LANGUAGE_MAP: Record<string, string> = {
  "Chinese (中文)": "zh-CN",
  English: "en",
  "Traditional Chinese (繁體中文)": "zh-TW",
  "Japanese (日本語)": "ja-JP",
  "Korean (한국어)": "ko-KR",
  "Thai (ไทย)": "th-TH",
  "Vietnamese (Tiếng Việt)": "vi-VN",
  "Hindi (हिन्दी)": "hi-IN",
  "Spanish (Español)": "es-ES",
  "Latin American Spanish (Español Latinoamérica)": "es-419",
  "German (Deutsch)": "de-DE",
  "French (Français)": "fr-FR",
  "Italian (Italiano)": "it-IT",
  "Brazilian Portuguese (Português do Brasil)": "pt-BR",
  "European Portuguese (Português)": "pt-PT",
  "Turkish (Türkçe)": "tr-TR",
};

function normalizeHeading(line: string): string {
  return line
    .replace(/^###\s+/, "")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "_")
    .replace(/^_+|_+$/g, "");
}

function cleanValue(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed || trimmed === "_No response_") return undefined;
  return trimmed;
}

function parseIssue(body: string): IssueFields {
  const fields: Record<string, string> = {};
  const lines = body.split("\n");
  let currentField: string | null = null;
  let buffer: string[] = [];

  for (const line of lines) {
    if (line.startsWith("### ")) {
      if (currentField) {
        fields[currentField] = buffer.join("\n").trim();
      }
      currentField = normalizeHeading(line);
      buffer = [];
      continue;
    }

    if (currentField) {
      buffer.push(line);
    }
  }

  if (currentField) {
    fields[currentField] = buffer.join("\n").trim();
  }

  const parsed: IssueFields = {};

  for (const [key, value] of Object.entries(fields)) {
    const mapped = FIELD_NAME_MAP[key];
    if (mapped) {
      parsed[mapped] = cleanValue(value);
    }
  }

  return parsed;
}

async function closeIssueIfPossible(issueNumber: number): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  const repository = process.env.GITHUB_REPOSITORY;

  if (!token || !repository) {
    return;
  }

  const [owner, repo] = repository.split("/");
  const octokit = new Octokit({ auth: token });
  const issue = await octokit.issues.get({ owner, repo, issue_number: issueNumber });

  if (issue.data.state === "open") {
    await octokit.issues.update({ owner, repo, issue_number: issueNumber, state: "closed" });
  }
}

async function main() {
  const issueNumber = process.env.ISSUE_NUMBER;
  const issueBody = process.env.ISSUE_BODY || "";

  if (!issueNumber) {
    throw new Error("ISSUE_NUMBER not provided");
  }

  const fields = parseIssue(issueBody);
  if (!fields.prompt_title || !fields.prompt || !fields.description || !fields.category || !fields.original_author) {
    throw new Error("Issue body is missing required fields");
  }

  const prompts = await loadPrompts();
  const nextId = getNextId(prompts);
  const language = LANGUAGE_MAP[fields.prompt_language || "Chinese (中文)"] || "zh-CN";

  const record: PromptRecord = {
    id: nextId,
    title: fields.prompt_title,
    description: fields.description,
    prompt: fields.prompt,
    category: fields.category,
    video_url: fields.preview_video_url,
    author_name: fields.original_author,
    author_link: fields.author_profile_link,
    source_platform: fields.source_platform || "community",
    source_link: fields.source_link,
    language,
    featured: false,
    source_meta: {
      github_issue: issueNumber,
    },
  };

  const existingIndex = prompts.findIndex((item) => item.source_meta?.github_issue === issueNumber);
  if (existingIndex >= 0) {
    prompts[existingIndex] = { ...prompts[existingIndex], ...record, id: prompts[existingIndex].id };
  } else {
    prompts.push(record);
  }

  await savePrompts(prompts);
  await closeIssueIfPossible(Number(issueNumber));
  console.log(`Synced issue #${issueNumber} into data/prompts.json`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
