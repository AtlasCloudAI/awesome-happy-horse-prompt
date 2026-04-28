import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { type PromptRecord, sortPrompts } from "./utils/cms-client.js";
import { generateMarkdown, SUPPORTED_LANGUAGES } from "./utils/markdown-generator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const promptsByLocaleDir = path.join(root, "data", "prompts_by_locale");

type SupportedLanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

const localeFileByLanguage: Record<SupportedLanguageCode, string> = {
  en: "en-US.json",
  zh: "zh-CN.json",
  "zh-TW": "zh-TW.json",
  "ja-JP": "ja-JP.json",
  "ko-KR": "ko-KR.json",
  "th-TH": "th-TH.json",
  "vi-VN": "vi-VN.json",
  "hi-IN": "hi-IN.json",
  "es-ES": "es-ES.json",
  "es-419": "es-419.json",
  "de-DE": "de-DE.json",
  "fr-FR": "fr-FR.json",
  "it-IT": "it-IT.json",
  "pt-BR": "pt-BR.json",
  "pt-PT": "pt-PT.json",
  "tr-TR": "tr-TR.json",
};

function promptKey(prompt: Partial<PromptRecord>): string {
  if (prompt.author_name && prompt.author_name.trim().length > 0) {
    return prompt.author_name;
  }
  return String(prompt.id ?? "");
}

function normalizePrompt(
  localizedPrompt: Partial<PromptRecord> | undefined,
  fallbackPrompt: PromptRecord,
): PromptRecord {
  const source = localizedPrompt ?? fallbackPrompt;
  return {
    ...fallbackPrompt,
    id: Number(source.id ?? fallbackPrompt.id),
    title: String(source.title ?? fallbackPrompt.title),
    description: String(source.description ?? fallbackPrompt.description),
    prompt: String(source.prompt ?? fallbackPrompt.prompt),
    category: String(source.category ?? fallbackPrompt.category),
    video_url: source.video_url ?? fallbackPrompt.video_url,
    author_name: String(source.author_name ?? fallbackPrompt.author_name),
    author_link: source.author_link ?? fallbackPrompt.author_link,
    source_platform: String(source.source_platform ?? fallbackPrompt.source_platform),
    source_link: source.source_link ?? fallbackPrompt.source_link,
    language: String(source.language ?? fallbackPrompt.language),
    featured: source.featured ?? fallbackPrompt.featured,
    source_meta: source.source_meta ?? fallbackPrompt.source_meta,
  };
}

async function loadLocalePrompts(localeFile: string): Promise<PromptRecord[]> {
  const raw = await fs.readFile(path.join(promptsByLocaleDir, localeFile), "utf8");
  return JSON.parse(raw) as PromptRecord[];
}

function buildLocalizedPrompts(localePrompts: PromptRecord[], fallbackPrompts: PromptRecord[]): PromptRecord[] {
  const localizedMap = new Map(localePrompts.map((prompt) => [promptKey(prompt), prompt]));
  return fallbackPrompts
    .map((fallbackPrompt) => normalizePrompt(localizedMap.get(promptKey(fallbackPrompt)), fallbackPrompt))
    .sort((a, b) => a.id - b.id);
}

async function main() {
  const fallbackPrompts = await loadLocalePrompts("en-US.json");

  for (const lang of SUPPORTED_LANGUAGES) {
    const localeFile = localeFileByLanguage[lang.code];
    const localePrompts = await loadLocalePrompts(localeFile);
    const localizedPrompts = buildLocalizedPrompts(localePrompts, fallbackPrompts);
    const output = generateMarkdown(sortPrompts(localizedPrompts), lang.code);
    await fs.writeFile(path.join(root, lang.readmeFileName), output, "utf8");
    console.log(`Generated ${lang.readmeFileName}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
