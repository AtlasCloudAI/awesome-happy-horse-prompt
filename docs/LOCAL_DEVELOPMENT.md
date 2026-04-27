# Local Development

## Generate README

```bash
npm run generate
```

The script reads `data/prompts.json` and rebuilds `README.md`.

## Notes

- Source dataset: `prompts-hub/src/data/happy_horse_by_locale/zh-CN.json`
- Correct page route: `https://www.atlascloud.ai/zh/happy-horse-1-prompt?locale=zh-CN`
- Each prompt record keeps the real MP4 preview URL in `video_url`
