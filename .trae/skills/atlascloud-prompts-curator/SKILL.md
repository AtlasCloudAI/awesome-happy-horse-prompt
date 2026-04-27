---
name: "atlascloud-prompts-curator"
description: "Generate and maintain awesome-style Happy Horse 1 prompt collections from repository data. Invoke when user asks to enrich, regenerate, or publish prompt README content."
---

# AtlasCloud Prompts Curator

Use this skill to build and maintain a rich Happy Horse 1 prompt repository in awesome list format, with AtlasCloud traffic links included.

## When To Invoke

Invoke this skill when the user asks to:

- create a new prompt collection project
- enrich existing README content with more prompts or videos
- regenerate README from `data/prompts.json`
- add AtlasCloud CTA links for traffic redirection
- prepare local docs or scripts for verification

## Data Source

- Primary source file: `data/prompts.json`
- Expected fields:
  - `id`
  - `title`
  - `description`
  - `prompt`
  - `category`
  - `video_url`
  - `author_name`
  - `author_link`
  - `source_platform`
  - `source_link`
  - `language`

## Repository Convention

Create or maintain:

- `README.md`: generated prompt list in awesome style
- `scripts/generate-readme.ts`: deterministic generation entry
- `scripts/generate-readmes-from-prompts-hub.ts`: README builder
- `docs/LOCAL_DEVELOPMENT.md`: setup and sync notes
- `.env.example`: env template without real credentials

## Content Rules

- Keep CTA links visible:
  - `https://www.atlascloud.ai/zh/happy-horse-1-prompt?locale=zh-CN`
- Preserve source attribution for each prompt item
- Keep prompts as original as possible, only trim when extremely long
- Prefer deterministic README generation from `data/prompts.json`

## API Key Rules

- Never hardcode or commit API keys
- Use environment variables for GitHub automation only when required

## Suggested Workflow

1. Verify `data/prompts.json` exists and is valid JSON.
2. Normalize prompt order and featured items.
3. Generate multilingual `README*.md` files.
4. Add usage and sync instructions.
5. Run diagnostics and report missing items.

## Example Commands

```bash
npm install
npm run generate
npm run sync
```
