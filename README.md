# hail-styl

A Stylus-powered design system engine. Tokens, rules, and automatic light/dark scheme support — no JS runtime required.

## Install

```sh
npm install -D @mszr/hail-styl
```

## Getting Started

The typical setup has four steps, split across two locations:

**Steps 1–3** belong in a design system entry file (e.g. `design-system.styl`) that is configured to be **auto-imported everywhere** — in every component and every stylesheet. Step 4 belongs in a file that is processed exactly **once** (e.g. `app.vue`).

### design-system.styl

```stylus
// 1. [Optional] Configure hail BEFORE importing
$dsPrefix = 'my-app'             // changes CSS variable prefix (default: 'hail')

// $dsPresets controls which starter presets to include.
// mode: 'opt-out' includes everything EXCEPT the listed presets.
// mode: 'opt-in' includes ONLY the listed presets.
$dsPresets = {
  mode: 'opt-out',
  listed: ('resets')
}

// 2. Import hail
@import '@mszr/hail-styl'

// 3. [Optional] Customize / extend AFTER importing
$dsShouldPreventTokenOverwrites = false
dsSetColorChannelToken('color:accent:h', 200)  // change accent hue
$dsShouldPreventTokenOverwrites = true
```

> **Tip:** You can also import `@mszr/hail-styl/system` and `@mszr/hail-styl/design` separately if you need to run code between engine initialization and the default design layer.

### app.vue (or equivalent — once only)

```stylus
// Flush: emits all token CSS variables and all registered rules.
// Call this exactly once, at the top level of a file that is consumed once.
dsUseGenerateDeclarationsAtTopLevel()
```

After this, `Var()`, `Val()`, `UseToken()` and all other engine utilities are available in every component without any additional imports.

### Nuxt / Vite wiring example

```ts
// nuxt.config.ts
import path from 'node:path'
import process from 'node:process'

export default defineNuxtConfig({
  vite: {
    css: {
      preprocessorOptions: {
        stylus: {
          paths: [path.resolve(process.cwd(), 'node_modules')],
          additionalData: `@import '${path.resolve(process.cwd(), './design-system.styl')}'`,
        },
      },
    },
  },
})
```

## Further Reading

- [Detailed Guide](https://github.com/mareszhar/hail-styl/blob/main/docs/detailed-guide.md) — full API reference: tokens, rules, color system, space domain, validation, and extension patterns.
- [LLM Guide](https://github.com/mareszhar/hail-styl/blob/main/docs/llm-guide.md) — concise reference optimized for AI-assisted development.
- [Nuxt Demo](https://github.com/mareszhar/hail-styl/tree/main/demo) — a working minimal Nuxt project showing the full setup in context.
