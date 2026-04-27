import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const dataPath = path.join(root, "data", "prompts.json");
const readmePath = path.join(root, "README.md");

const prompts = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const libraryUrl = "https://www.atlascloud.ai/zh/happy-horse-1-prompt?locale=zh-CN";
const modelUrl = "https://www.atlascloud.ai/zh/models/alibaba/happyhorse-1.0/text-to-video?ref=JPM683";
const lines = [];

function add(line = "") {
  lines.push(line);
}

const categoryCounts = new Map();
for (const item of prompts) {
  categoryCounts.set(item.category, (categoryCounts.get(item.category) || 0) + 1);
}

add("# Awesome Happy Horse Prompts");
add();
add("[![Awesome](https://awesome.re/badge.svg)](https://awesome.re)");
add("[![GitHub stars](https://img.shields.io/github/stars/AtlasCloudAI/awesome-happy-horse-prompt?style=social)](https://github.com/AtlasCloudAI/awesome-happy-horse-prompt)");
add("[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)");
add();
add("> 收录 AtlasCloud `prompts-hub` 中 Happy Horse 1 的 30 条官方中文视频提示词。");
add();
add("> 每条记录都包含完整 prompt 与真实 MP4 预览链接，页面跳转修正为 `happy-horse-1-prompt`。");
add();
add("## AtlasCloud Links");
add();
add(`- Prompt Library: ${libraryUrl}`);
add(`- Happy Horse 1 Model: ${modelUrl}`);
add();
add("## Statistics");
add();
add("| Metric | Count |");
add("|--------|-------|");
add(`| Total Prompts | **${prompts.length}** |`);
add(`| Video Previews | **${prompts.filter((item) => item.video_url).length}** |`);
add("| Source Locale | **zh-CN** |");
add(`| Categories | **${categoryCounts.size}** |`);
add();
add("## Category Breakdown");
add();
for (const [category, count] of categoryCounts.entries()) {
  add(`- \`${category}\`: **${count}**`);
}
add();
add("## Prompt List");
add();
for (const item of prompts) {
  add(`### ${item.id}. ${item.title}`);
  add();
  add(`- Category: \`${item.category}\``);
  add(`- Source: \`${item.source_platform}\` / \`${item.author_name}\``);
  add(`- Video: ${item.video_url}`);
  add("- Prompt:");
  add("```text");
  add(item.prompt);
  add("```");
  add();
}
add("## Data Source Notes");
add();
add("- Dataset file: `data/prompts.json`");
add("- Synced from: `prompts-hub/src/data/happy_horse_by_locale/zh-CN.json`");
add("- Correct route: `https://www.atlascloud.ai/zh/happy-horse-1-prompt?locale=zh-CN`");
add("- Video field: `video_url`");
add();
add("## Local Usage");
add();
add("```bash");
add("npm run generate");
add("```");
add();
add("## License");
add();
add("CC BY 4.0");
add();

fs.writeFileSync(readmePath, lines.join("\n"));
console.log(`Generated ${readmePath}`);
