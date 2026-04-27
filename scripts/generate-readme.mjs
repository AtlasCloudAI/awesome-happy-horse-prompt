import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const dataPath = path.join(root, "data", "prompts.json");
const readmePath = path.join(root, "README.md");

const prompts = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const featured = prompts.slice(0, 3);
const lines = [];

function add(line = "") {
  lines.push(line);
}

function renderCard(item, index, isFeatured) {
  add("### No. " + index + ": " + item.title);
  add();
  add("- Language: " + item.language.toUpperCase());
  if (isFeatured) add("- Status: featured");
  add("- Tags: " + item.tags.map((tag) => "`" + tag + "`").join(" "));
  add("- Inspired By: " + item.inspired_by.title);
  add("- Reference: " + item.inspired_by.source_link);
  add();
  add("#### Description");
  add();
  add(item.description);
  add();
  add("#### Prompt");
  add();
  add("```text");
  add(item.prompt);
  add("```");
  add();
}

add("# Awesome Happy Horse Prompts");
add();
add("[![Awesome](https://awesome.re/badge.svg)](https://awesome.re)");
add("[![GitHub stars](https://img.shields.io/github/stars/AtlasCloudAI/awesome-happy-horse-prompt?style=social)](https://github.com/AtlasCloudAI/awesome-happy-horse-prompt)");
add("[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)");
add();
add("> A curated awesome-style collection of happy horse prompts for GPT Image 2 and similar image models.");
add();
add("> Theme-specific prompts are written in the style of the AtlasCloud prompt ecosystem and inspired by structures found in prompts-hub data.");
add();
add("---");
add();
add("## View In AtlasCloud");
add();
add("- Gallery: https://www.atlascloud.ai/prompts-hub/gpt-image-2-prompt?locale=en-US");
add("- Models: https://www.atlascloud.ai/models/media");
add();
add("## Statistics");
add();
add("| Metric | Count |");
add("|--------|-------|");
add("| Total Prompts | **" + prompts.length + "** |");
add("| Featured | **" + featured.length + "** |");
add("| Last Updated | **" + new Date().toISOString() + "** |");
add();
add("## Featured Prompts");
add();
featured.forEach((item, index) => renderCard(item, index + 1, true));
add("## All Prompts");
add();
prompts.forEach((item, index) => renderCard(item, index + 1, false));
add("## Local Usage");
add();
add("```bash");
add("npm run generate");
add("```");
add();
add("## Data Source Notes");
add();
add("- Theme: happy horse");
add("- Dataset file: `data/prompts.json`");
add("- Generator: `scripts/generate-readme.mjs`");
add("- Reference source: `prompts-hub/src/data/records.json`");
add();
add("## License");
add();
add("CC BY 4.0");
add();

fs.writeFileSync(readmePath, lines.join("\n"));
console.log("Generated " + readmePath);
