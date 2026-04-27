declare module "node:fs/promises" {
  const fs: any;
  export default fs;
}

declare module "node:path" {
  const path: any;
  export default path;
}

declare module "node:url" {
  export function fileURLToPath(url: string | URL): string;
}

declare module "@octokit/rest" {
  export class Octokit {
    constructor(options?: any);
    issues: any;
  }
}

interface ImportMeta {
  url: string;
}

declare const console: any;
declare const process: any;
