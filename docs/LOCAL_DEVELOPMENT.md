# Local Development

## Prerequisites

- Node.js 20+
- npm 10+

## Install Dependencies

```bash
npm install
```

## Generate README Files

```bash
npm run generate
```

This reads `data/prompts.json` and writes all `README*.md` files.

## Test Issue Sync Locally

1. Copy `.env.example` to `.env`.
2. Fill in `ISSUE_NUMBER` and `ISSUE_BODY`.
3. Run:

```bash
npm run sync
npm run generate
```

## Project Structure

```text
.
├── data/prompts.json
├── docs/
├── scripts/
│   ├── generate-readme.ts
│   ├── generate-readmes-from-prompts-hub.ts
│   ├── sync-approved-to-cms.ts
│   └── utils/
├── README.md
└── README_*.md
```
