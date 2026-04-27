import { type PromptRecord, type SortedPromptData } from "./cms-client.js";
import { SUPPORTED_LANGUAGES, t } from "./i18n.js";

export { SUPPORTED_LANGUAGES };

function buildCategoryAnchor(index: number): string {
  return `category-${index + 1}`;
}

function resolveAtlasLocale(locale: string): { prefix: string; localeParam: string } {
  switch (locale) {
    case "zh":
      return { prefix: "/zh", localeParam: "zh-CN" };
    case "zh-TW":
      return { prefix: "/zh-TW", localeParam: "zh-TW" };
    case "ja-JP":
      return { prefix: "/ja", localeParam: "ja" };
    case "ko-KR":
      return { prefix: "/ko", localeParam: "ko" };
    case "es-ES":
    case "es-419":
      return { prefix: "/es", localeParam: "es" };
    case "pt-BR":
    case "pt-PT":
      return { prefix: "/pt", localeParam: "pt" };
    case "de-DE":
      return { prefix: "/de", localeParam: "de" };
    case "fr-FR":
      return { prefix: "/fr", localeParam: "fr" };
    case "tr-TR":
      return { prefix: "/tr", localeParam: "tr" };
    default:
      return { prefix: "", localeParam: "en" };
  }
}

function buildPromptLibraryUrl(locale: string): string {
  const { prefix, localeParam } = resolveAtlasLocale(locale);
  return `https://www.atlascloud.ai${prefix}/happy-horse-1-prompt?locale=${localeParam}`;
}

function buildModelUrl(locale: string): string {
  const { prefix } = resolveAtlasLocale(locale);
  return `https://www.atlascloud.ai${prefix}/models/alibaba/happyhorse-1.0/text-to-video?ref=JPM683`;
}

function renderLanguageNavigation(currentLocale: string): string {
  return `${SUPPORTED_LANGUAGES.map((lang) => {
    const isCurrent = lang.code === currentLocale;
    const color = isCurrent ? "brightgreen" : "lightgrey";
    const text = isCurrent ? t("current", currentLocale) : t("view", currentLocale);
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
  const promptsByCategory = new Map<string, PromptRecord[]>();

  for (const prompt of data.all) {
    const categoryPrompts = promptsByCategory.get(prompt.category) || [];
    categoryPrompts.push(prompt);
    promptsByCategory.set(prompt.category, categoryPrompts);
  }

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
  lines.push(`| ${t("metric", locale)} | ${t("count", locale)} |`);
  lines.push("|--------|-------|");
  lines.push(`| ${t("totalPrompts", locale)} | **${data.stats.total}** |`);
  lines.push(`| ${t("categories", locale)} | **${data.categoryCounts.length}** |`);
  lines.push(`| ${t("previewVideos", locale)} | **${data.stats.videos}** |`);
  lines.push(`| ${t("lastUpdated", locale)} | **${now}** |`);
  lines.push("");
  lines.push(`## ${t("browseByCategory", locale)}`);
  lines.push("");

  data.categoryCounts.forEach((item, index) => {
    const anchor = buildCategoryAnchor(index);
    lines.push(`- [\`${item.category}\`](#${anchor}): **${item.count}**`);
  });

  lines.push("");
  lines.push(`## ${t("featuredPrompts", locale)}`);
  lines.push("");
  data.featured.forEach((prompt, index) => lines.push(renderPrompt(prompt, index, locale)));
  lines.push(`## ${t("allPrompts", locale)}`);
  lines.push("");

  data.categoryCounts.forEach((item, index) => {
    const anchor = buildCategoryAnchor(index);
    const prompts = promptsByCategory.get(item.category) || [];

    lines.push(`<a id="${anchor}"></a>`);
    lines.push("");
    lines.push(`### ${item.category} (${prompts.length})`);
    lines.push("");

    prompts.forEach((prompt, promptIndex) => {
      lines.push(renderPrompt(prompt, promptIndex, locale));
    });
  });

  lines.push(`## ${t("contribute", locale)}`);
  lines.push("");
  lines.push(t("contributeDesc", locale));
  lines.push("");
  lines.push(`- ${t("issueTemplate", locale)}: https://github.com/AtlasCloudAI/awesome-happy-horse-prompt/issues/new?template=submit-prompt.yml`);
  lines.push(`- ${t("guide", locale)}: docs/CONTRIBUTING.md`);
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
