# Getting Started

Setup consists of two simple steps: **The Engine** (auto-imported) and **The Flush** (called once).

## 1. Installation

```bash
npm install -D @mszr/hail-styl
```

## 2. Set up the Design System

Create a `design-system.styl` file. This file acts as your central hub and should be configured in your build tool to be **auto-imported in every stylesheet**.

```styl
// 1. [Optional] Configuration
$dsPrefix = 'my-app'

// 2. Import the engine
@import '@mszr/hail-styl'

// 3. [Optional] Register your custom tokens/rules
dsSetToken('c:brand', #ff0000)
```

## 3. The Flush

In your application's single-use entry point (such as `app.vue` or `main.styl`), call the generation mixin exactly **once** at the top level.

```styl
// This emits all CSS variables and registered rules to your final CSS
dsUseGenerateDeclarationsAtTopLevel()
```

## Configuring Auto-imports (Vite example)

```ts
// vite.config.ts

import path from 'node:path'
import process from 'node:process'

export default {
  css: {
    preprocessorOptions: {
      stylus: {
        paths: [path.resolve(process.cwd(), 'node_modules')],
        additionalData: `@import '${path.resolve(process.cwd(), './design-system.styl')}'`,
      },
    },
  },
}
```

That's it! Your engine is now running. You're ready to start [designing](./designing.md) [[get raw]](https://raw.githubusercontent.com/mareszhar/hail-styl/main/docs/designing.md) your tokens.

## Selective Imports

If you want to build your design system from total scratch without using the bundled presets, you can import only the system engine:

```stylus
// Loads only the engine (Var, dsSetToken, etc.)
@import '@mszr/hail-styl/system'
```

For even more granular control, you can import specific utility files directly:

```stylus
// Loads only the low-level CSS primitives
@import '@mszr/hail-styl/src/system/utils/kit-primitives'
```
