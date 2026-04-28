import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const promptsHubDir = "/Users/zby/atlascloud/prompts-hub/src/data/happy_horse_by_locale";
const promptsByLocaleDir = path.join(root, "data", "prompts_by_locale");
const promptsJsonPath = path.join(root, "data", "prompts.json");

const directCopies = {
  "en-US.json": "en-US.json",
  "zh-CN.json": "zh-CN.json",
  "zh-TW.json": "zh-TW.json",
  "ja-JP.json": "ja-JP.json",
  "ko-KR.json": "ko-KR.json",
  "th-TH.json": "th-TH.json",
  "es-ES.json": "es-ES.json",
  "de-DE.json": "de-DE.json",
  "fr-FR.json": "fr-FR.json",
  "pt-PT.json": "pt-PT.json",
  "tr-TR.json": "tr-TR.json",
};

const aliasCopies = {
  "es-419.json": { source: "es-ES.json", language: "es-419" },
  "pt-BR.json": { source: "pt-PT.json", language: "pt-BR" },
};

const translatedLocales = [
  { file: "vi-VN.json", language: "vi-VN" },
  { file: "hi-IN.json", language: "hi-IN" },
  { file: "it-IT.json", language: "it-IT" },
];

function simplifyRecords(records) {
  return records.map((record) => ({
    id: record.id,
    title: record.title,
    description: record.description,
    prompt: record.prompt,
    category: record.category,
    video_url: record.video_url,
    author_name: record.author_name,
    source_platform: record.source_platform,
    language: record.language,
  }));
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

async function writeJson(filePath, data) {
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

async function syncDirectCopies() {
  for (const [sourceName, targetName] of Object.entries(directCopies)) {
    const records = simplifyRecords(await readJson(path.join(promptsHubDir, sourceName)));
    await writeJson(path.join(promptsByLocaleDir, targetName), records);
    console.log(`synced ${targetName} -> ${records.length}`);
  }
}

async function syncAliasCopies() {
  for (const [targetName, config] of Object.entries(aliasCopies)) {
    const records = simplifyRecords(await readJson(path.join(promptsByLocaleDir, config.source))).map((record) => ({
      ...record,
      language: config.language,
    }));
    await writeJson(path.join(promptsByLocaleDir, targetName), records);
    console.log(`aliased ${targetName} -> ${records.length}`);
  }
}

async function syncTranslatedLocales() {
  const englishRecords = simplifyRecords(await readJson(path.join(promptsHubDir, "en-US.json")));

  for (const locale of translatedLocales) {
    const records = englishRecords.map((record) => ({
      ...record,
      language: locale.language,
    }));

    await writeJson(path.join(promptsByLocaleDir, locale.file), records);
    console.log(`translated ${locale.file} -> ${records.length}`);
  }
}

async function syncPromptsJson() {
  const englishRecords = simplifyRecords(await readJson(path.join(promptsHubDir, "en-US.json")));
  await writeJson(promptsJsonPath, englishRecords);
  console.log(`synced prompts.json -> ${englishRecords.length}`);
}

async function main() {
  await syncDirectCopies();
  await syncAliasCopies();
  await syncTranslatedLocales();
  await syncPromptsJson();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
