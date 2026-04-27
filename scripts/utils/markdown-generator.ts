import { type PromptRecord, type SortedPromptData } from "./cms-client.js";
import { SUPPORTED_LANGUAGES, t } from "./i18n.js";

export { SUPPORTED_LANGUAGES };

function getLocalePrefix(locale: string): string {
  if (locale === "en") return "";
  if (locale === "zh") return "/zh";
  return `/${locale}`;
}

function buildPromptLibraryUrl(locale: string): string {
  const prefix = getLocalePrefix(locale);
  const localeParam = locale === "zh" ? "zh-CN" : locale;
  return `https://www.atlascloud.ai${prefix}/happy-horse-1-prompt?locale=${localeParam}`;
}

function buildModelUrl(locale: string): string {
  if (locale === "zh" || locale === "zh-TW") {
    return "https://www.atlascloud.ai/zh/models/alibaba/happyhorse-1.0/text-to-video?ref=JPM683";
  }
  return "https://www.atlascloud.ai/models/alibaba/happyhorse-1.0/text-to-video?ref=JPM683";
}

function renderLanguageNavigation(currentLocale: string): string {
  return `${SUPPORTED_LANGUAGES.map((lang) => {
    const isCurrent = lang.code === currentLocale;
    const color = isCurrent ? "brightgreen" : "lightgrey";
    const text = isCurrent ? "Current" : "View";
    return `[![${lang.name}](https://img.shields.io/badge/${encodeURIComponent(lang.name)}-${text}-${color})](${lang.readmeFileName})`;
  }).join(" ")}\n\n---\n`;
}

function renderPrompt(prompt: PromptRecord, index: number, locale: string): string {
  const lines = [
    `### No. ${index + 1}: ${prompt.title}`,
    "",
    `- **${t("category", locale)}:** \`${prompt.category}\``,
    `- **${t("source", locale)}:** \`${prompt.source_platform}\``,
    `- **${t("author", locale)}:** ${prompt.author_name}`,
    `- **${t("language", locale)}:** \`${prompt.language}\``,
  ];

  if (prompt.video_url) {
    lines.push(`- **${t("video", locale)}:** ${prompt.video_url}`);
    lines.push("");
    lines.push(`<video src="${prompt.video_url}" controls muted playsinline width="720"></video>`);
  }

  if (prompt.source_link) {
    lines.push(`- **${t("sourceLink", locale)}:** ${prompt.source_link}`);
  }

  lines.push(
    "",
    `#### ${t("description", locale)}`,
    "",
    prompt.description,
    "",
    `#### ${t("prompt", locale)}`,
    "",
    "```text",
    prompt.prompt,
    "```",
    ""
  );

  return lines.join("\n");
}

export function generateMarkdown(data: SortedPromptData, locale: string): string {
  const now = new Date().toISOString();
  const lines: string[] = [];

  lines.push(`# ${t("title", locale)}`);
  lines.push("");
  lines.push("[![Awesome](https://awesome.re/badge.svg)](https://awesome.re)");
  lines.push("[![GitHub stars](https://img.shields.io/github/stars/AtlasCloudAI/awesome-happy-horse-prompt?style=social)](https://github.com/AtlasCloudAI/awesome-happy-horse-prompt)");
  lines.push("[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)");
  lines.push("[![Update README](https://github.com/AtlasCloudAI/awesome-happy-horse-prompt/actions/workflows/update-readme.yml/badge.svg)](https://github.com/AtlasCloudAI/awesome-happy-horse-prompt/actions/workflows/update-readme.yml)");
  lines.push("");
  lines.push(`> ${t("subtitle", locale)}`);
  lines.push("");
  lines.push(`> ${t("copyright", locale)}`);
  lines.push("");
  lines.push(renderLanguageNavigation(locale));
  lines.push(`## ${t("viewInGallery", locale)}`);
  lines.push("");
  lines.push(`- ${t("promptLibrary", locale)}: ${buildPromptLibraryUrl(locale)}`);
  lines.push(`- ${t("modelPage", locale)}: ${buildModelUrl(locale)}`);
  lines.push("");
  lines.push(`## ${t("stats", locale)}`);
  lines.push("");
  lines.push("| Metric | Count |");
  lines.push("|--------|-------|");
  lines.push(`| ${t("totalPrompts", locale)} | **${data.stats.total}** |`);
  lines.push(`| ${t("categories", locale)} | **${data.categoryCounts.length}** |`);
  lines.push(`| ${t("previewVideos", locale)} | **${data.stats.videos}** |`);
  lines.push(`| ${t("lastUpdated", locale)} | **${now}** |`);
  lines.push("");
  lines.push(`## ${t("browseByCategory", locale)}`);
  lines.push("");

  for (const item of data.categoryCounts) {
    lines.push(`- \`${item.category}\`: **${item.count}**`);
  }

  lines.push("");
  lines.push(`## ${t("featuredPrompts", locale)}`);
  lines.push("");
  data.featured.forEach((prompt, index) => lines.push(renderPrompt(prompt, index, locale)));
  lines.push(`## ${t("allPrompts", locale)}`);
  lines.push("");
  data.all.forEach((prompt, index) => lines.push(renderPrompt(prompt, index, locale)));
  lines.push(`## ${t("contribute", locale)}`);
  lines.push("");
  lines.push(t("contributeDesc", locale));
  lines.push("");
  lines.push("- Issue template: https://github.com/AtlasCloudAI/awesome-happy-horse-prompt/issues/new?template=submit-prompt.yml");
  lines.push("- Guide: docs/CONTRIBUTING.md");
  lines.push("");
  lines.push(`## ${t("localUsage", locale)}`);
  lines.push("");
  lines.push("```bash");
  lines.push("npm run generate");
  lines.push("```");
  lines.push("");
  lines.push(`## ${t("license", locale)}`);
  lines.push("");
  lines.push("[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)");
  lines.push("");
  lines.push(`> ${t("autoGenerated", locale)} ${now}`);
  lines.push("");

  return lines.join("\n");
}
