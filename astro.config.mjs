// @ts-check
import { defineConfig } from 'astro/config';
import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// Bundle the local yacht snapshot alongside the Vercel function.
// `includeFiles` expects literal file paths (no globs), so we expand the
// snapshot directory at config-load time. If the snapshot doesn't exist
// yet (fresh checkout before first `npm run sync-yachts`), this returns
// an empty list and the build still succeeds — runtime will throw on
// first read, which is the right behaviour for a missing-data deploy.
const yachtSnapshotFiles = (() => {
  const base = 'src/data/yachts';
  const out = [];
  if (!existsSync(base)) return out;
  for (const top of ['index.json', 'manifest.json']) {
    if (existsSync(join(base, top))) out.push(join(base, top));
  }
  const entitiesDir = join(base, 'entities');
  if (existsSync(entitiesDir)) {
    for (const f of readdirSync(entitiesDir)) {
      if (f.endsWith('.json')) out.push(join(entitiesDir, f));
    }
  }
  return out;
})();

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel({
    maxDuration: 30,
    includeFiles: yachtSnapshotFiles,
  }),
  image: {
    domains: ['api.ankor.io', 'api.ankor.dev'],
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        // Don't watch the yacht snapshot — 800 entity JSON files would
        // otherwise blow the OS file-handle limit and cause spurious
        // EMFILE errors on every dev-server restart.
        ignored: ['**/src/data/yachts/**'],
      },
    },
  },
});
