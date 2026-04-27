import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadPrompts, sortPrompts } from "./utils/cms-client.js";
import { generateMarkdown, SUPPORTED_LANGUAGES } from "./utils/markdown-generator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

async function main() {
  const prompts = await loadPrompts();
  const sorted = sortPrompts(prompts);

  for (const lang of SUPPORTED_LANGUAGES) {
    const output = generateMarkdown(sorted, lang.code);
    await fs.writeFile(path.join(root, lang.readmeFileName), output, "utf8");
    console.log(`Generated ${lang.readmeFileName}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
