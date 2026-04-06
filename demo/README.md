# Minimal Demo | hail-styl in Nuxt 4

## Reproduction Steps

1. Install `hail-styl` as a dev dependency via `bun i -D @mszr/hail-styl`
2. Configure auto-imports and `paths` in vite so `@import '@mszr/hail-styl'` resolves the node_module package. (see `nuxt.config.ts` for example)
3. Import hail using `@import '@mszr/hail-styl'` in your globally auto-imported styl file. (see `design-system.styl` for example)
4. Run `dsUseGenerateDeclarationsAtTopLevel()` exactly once outside any selectors. (see `app.vue` for example)

```bash
# install dependencies
bun install
```

```bash
# run dev server
bun run dev
```

```bash
# build for production
bun run build
```

```bash
# local preview of production
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
