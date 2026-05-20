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
    lines.push(`<video src="${prompt.video_url}" controls muted playsinline width="720"></video>`);
  }

  if (prompt.source_link) {
    lines.push(`- **${t("sourceLink", locale)}:** [${t("view", locale)}](${prompt.source_link})`);
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

function renderModelIntro(locale: string): string {
  if (locale === "zh") {
    return [
      "## Happy Horse 1.0 模型简介",
      "",
      "Happy Horse 1.0 更适合创意表达、情绪氛围和强镜头感的视频生成。它对奇观场景、幻想设定、广告化视觉、动漫感画面以及带有明确运镜路径的短视频提示词表现更稳定。",
      "",
      "- 推荐先写清主体、场景和动作，再补充镜头运动、光线、节奏和材质细节。",
      "- 当提示词同时包含环境变化、前景遮挡、景别切换和情绪氛围时，通常更容易得到层次丰富的画面。",
      "- 适合 fantasy、anime、sci-fi、wuxia、城市夜景、产品展示和短片分镜类题材。",
      "",
      "### 推荐写法",
      "",
      "- 主体: 先明确角色、物体或场景主角。",
      "- 动作: 写清楚主体在做什么，以及环境如何响应。",
      "- 运镜: 增加推拉摇移、环绕、跟拍、航拍、特写等描述。",
      "- 风格: 补充电影光影、体积雾、雨雪、反射、材质和色彩对比。",
      "",
    ].join("\n");
  }

  if (locale === "zh-TW") {
    return [
      "## Happy Horse 1.0 模型簡介",
      "",
      "Happy Horse 1.0 更適合創意表達、情緒氛圍與強鏡頭感的影片生成。它對奇觀場景、幻想設定、廣告化視覺、動漫感畫面，以及帶有明確運鏡路徑的短影片提示詞表現更穩定。",
      "",
      "- 建議先寫清主體、場景與動作，再補充鏡頭運動、光線、節奏與材質細節。",
      "- 當提示詞同時包含環境變化、前景遮擋、景別切換與情緒氛圍時，通常更容易得到層次豐富的畫面。",
      "- 適合 fantasy、anime、sci-fi、wuxia、城市夜景、產品展示與短片分鏡類題材。",
      "",
      "### 推薦寫法",
      "",
      "- 主體: 先明確角色、物體或場景主角。",
      "- 動作: 寫清楚主體在做什麼，以及環境如何回應。",
      "- 運鏡: 增加推拉搖移、環繞、跟拍、航拍、特寫等描述。",
      "- 風格: 補充電影光影、體積霧、雨雪、反射、材質與色彩對比。",
      "",
    ].join("\n");
  }

  return [
    "## Happy Horse 1.0 Overview",
    "",
    "Happy Horse 1.0 is strongest at expressive motion, cinematic atmosphere, and visually dense short-form storytelling. It works especially well for fantasy worlds, anime-inspired visuals, ad-style shots, sci-fi concepts, and prompts with explicit camera language.",
    "",
    "- Start with a clear subject, scene, and action, then add camera movement, lighting, pacing, and texture details.",
    "- Prompts that combine environment change, foreground motion, shot transitions, and mood cues usually produce richer visual layers.",
    "- Great fit for fantasy, anime, sci-fi, wuxia, night city scenes, product storytelling, and storyboard-style video ideas.",
    "",
    "### Recommended Structure",
    "",
    "- Subject: define the main character, object, or scene focus clearly.",
    "- Action: describe what happens and how the environment reacts.",
    "- Camera: add dolly, pan, orbit, tracking, aerial, or close-up instructions.",
    "- Style: include cinematic light, volumetric fog, rain, reflections, textures, and color contrast.",
    "",
  ].join("\n");
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
  lines.push(`- ${t("promptLibrary", locale)}: [${t("view", locale)}](${buildPromptLibraryUrl(locale)})`);
  lines.push(`- ${t("modelPage", locale)}: [${t("view", locale)}](${buildModelUrl(locale)})`);
  lines.push("");
  lines.push(renderModelIntro(locale));
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
  lines.push(`- ${t("issueTemplate", locale)}: [${t("view", locale)}](https://github.com/AtlasCloudAI/awesome-happy-horse-prompt/issues/new?template=submit-prompt.yml)`);
  lines.push(`- ${t("guide", locale)}: [${t("view", locale)}](docs/CONTRIBUTING.md)`);
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
