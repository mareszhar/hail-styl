# Publishing @mszr/hail-styl to npm

## Pre-release Testing

While testing a new version pre-release, you can update the import in `demo/design-system.styl` to use the local files:

```stylus
// @import '@mszr/hail-styl'       // Comment this out
@import '../src/index'             // Use this while developing
```

Remember to revert this back to the `@mszr/hail-styl` import before pushing or publishing.

## Initial Release

Log in if not already authenticated with `npm login`. Then:

### 1. Check what will be published (dry run)

```sh
npm pack --dry-run
```

You should see only files from `/src` plus `package.json`, `README.md`, and `LICENSE` (if present). The `demo/`, `docs/`, and any other directories should **not** appear — this is handled by the `"files": ["src"]` field in `package.json`.

### 2. Publish

```sh
npm publish --access public
```

The `--access public` flag is required for scoped packages (eg: `@mszr/...`) to be publicly accessible.

---

## Subsequent Releases

For each new release, bump the version in `package.json` first:

```sh
# Patch bump (bug fixes): 0.1.0 → 0.1.1
npm version patch

# Minor bump (new features, no breaking changes): 0.1.0 → 0.2.0
npm version minor

# Major bump (breaking changes): 0.1.0 → 1.0.0
npm version major
```

Then publish:

```sh
npm publish --access public
```

---

## Verifying the Published Package

After publishing, check the package page at:

```txt
https://www.npmjs.com/package/@mszr/hail-styl
```

To test it installs correctly in another project:

```sh
mkdir /tmp/hail-test && cd /tmp/hail-test
npm init -y
npm install @mszr/hail-styl
ls node_modules/@mszr/hail-styl/src
```

---

## What's Included in the Package

Only the `src/` directory and root `.styl` files are published, as configured by `"files"` in `package.json`:

```txt
@mszr/hail-styl/
├── index.styl
├── system.styl
├── design.styl
└── src/
    ├── index.styl
    ├── index-system.styl
    ├── index-design.styl
    ├── design/
    │   ├── controls.styl
    │   └── starter.styl
    └── system/
        ├── state.styl
        └── utils/
            └── *.styl
```

The `demo/`, `docs/`, and any other directories remain in the GitHub repo but are not part of the npm package.
