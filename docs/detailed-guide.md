# hail-styl — Detailed Guide

> A Stylus-powered design system engine with a unified token registry, declarative rule pipeline, and automatic light/dark scheme support.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Entry Points](#entry-points)
4. [The Token System](#the-token-system)
5. [The Rule Pipeline](#the-rule-pipeline)
6. [Core API Reference](#core-api-reference)
7. [Domain: Layout](#domain-layout)
8. [Domain: Size](#domain-size)
9. [Domain: Color](#domain-color)
10. [Validation & Error Tracing](#validation--error-tracing)
11. [Naming Conventions](#naming-conventions)
12. [Configuration & Opt-outs](#configuration--opt-outs)
13. [Adding to Your Project](#adding-to-your-project)
14. [Extending the Engine](#extending-the-engine)

---

## Overview

hail-styl is a Stylus preprocessor library that provides a structured engine for building design systems. Its core ideas:

- **Tokens** are named design values stored in a central registry and emitted as CSS custom properties.
- **Rules** are CSS rule-sets registered into a pipeline and flushed in a determined order by a single top-level call.
- **Domains** (layout, size, color) extend the core with domain-specific helpers that build on top of the token system.
- The engine is intentionally kept as a Stylus-layer concern — no JS runtime, no build plugins required beyond Stylus itself.

---

## Architecture

```txt
src/
├── index.styl                     ← Full bundle (system + design)
├── index-system.styl              ← Engine only (no default design tokens/rules)
├── index-design.styl              ← Design layer (default controls + starter presets)
├── system
│   ├── state.styl                 ← Global mutable config + registries
│   └── utils
│       ├── api-primitives.styl    ← Low-level CSS/Stylus wrappers
│       ├── api-core.styl          ← Val, Var, UseVar, UseToken
│       ├── api-layout.styl        ← UseFlex
│       ├── api-color.styl         ← UseContrast
│       ├── helpers-core.styl      ← Guards, validators, registry resolvers
│       ├── helpers-size.styl      ← Size step/base/suffix resolvers
│       ├── helpers-color.styl     ← Color channel resolution helpers
│       ├── setup-core.styl        ← dsSetToken, dsAddRule, etc.
│       ├── setup-size.styl        ← dsSize
│       ├── setup-color.styl       ← dsColor, dsChannel, dsSetColorChannelToken
│       └── setup-generation.styl  ← dsUseGenerateDeclarationsAtTopLevel
└── design
    ├── controls.styl              ← Required default tokens
    └── starter.styl               ← Opinionated presets (resets, steps, palette, roles, basic styles)
```

### Load Order (index-system.styl)

The system loads in strict dependency order:

1. `api-primitives` — foundational wrappers used everywhere
2. `state` — global registries and config variables
3. `helpers-core` → `setup-core` → `api-core` — token/rule infrastructure
4. `helpers-*` → `setup-*` → `api-*` for each domain (not all domains have utils of every kind)
5. `setup-generation` — the flush machinery

`index-design.styl` loads after the system, so design-layer tokens and rules are registered into an already-initialized engine.

### Util Categories

| Category | Naming | Role |
|---|---|---|
| `api-*` | **PascalCase**, no prefix | Public-facing; use anywhere in your `.styl` files |
| `setup-*` | `ds` prefix, camelCase | Register tokens/rules or wire up the engine |
| `helpers-*` | `ds` prefix, camelCase | Composable internals used by other utils |

Mixins that emit CSS declarations include `Use` or `use` in their name (e.g., `UseVar`, `dsUseFlushRules`). The one exception is the `_emitter` convention for anonymous mixins defined solely to be passed to `dsAddRule`.

---

## Entry Points

### `index.styl` (recommended)

Imports everything: the engine and all default design tokens/rules. Best for most projects.

```stylus
@import '@mszr/hail-styl'
```

### `index-system.styl` + `index-design.styl` (split)

Use this if you want to run some code between the system initialization and the design layer.

```stylus
@import '@mszr/hail-styl/system'
// you could run code with access to the system here.
@import '@mszr/hail-styl/design'
```

### `index-system.styl` alone

```stylus
@import '@mszr/hail-styl/system'
```

Use this when you want the engine without any of the default design tokens or presets.

### Deep nested imports

If you only need a single specific file/utility and want to bypass the rest of the engine, the full `src` directory is included in the package so you can target files directly:

```stylus
@import '@mszr/hail-styl/src/system/utils/api-primitives'
```

---

## The Token System

Tokens are the fundamental unit of the design system. They're named, typed values stored in an in-memory registry during Stylus compilation, then emitted as CSS custom properties.

### Token Format

```txt
domain:name[:suffix]
```

- `domain` — the token's domain (see allowed domains below)
- `name` — the token's semantic or raw name
- `suffix` — optional; used for sub-tokens or states (e.g., channel tokens like `color:accent:c`)

**Allowed domains:**

Defined as a list in the `$dsAllowedDomains` variable in `state.styl`. The engine automatically resolves these into a regex. The regex resolver will replace any `*` symbol at the end of an allowed domain string in `$dsAllowedDomains` with `$dsTokenSegmentRegex`.

As always, all regexes and regex demos in `state.styl` are customizable. Setting the regex to `null` will skip domain validation for tokens.

### Registering a Token

```stylus
dsSetToken('color:accent', oklch(0.6 0.2 264))
dsSetToken('s:8p', dsSize(1))   // using dsSize helper
```

### Assignment Tokens

An assignment token maps a `domain:name` to a set of CSS declarations. This is how text roles (or any declarative role) work:

```stylus
dsSetTokenAssignments('t:body', {
  font-family: Uq('Inter, sans-serif'),
  line-height: 1.5,
})
```

Assignment tokens are stored in a separate registry (`$dsTokenAssignments`) and accessed via `UseToken`.

The properties of assignment tokens can also be used as standalone tokens (eg: `Var('t:body:line-height')`).

### CSS Variable Naming

Token names are converted to CSS custom property names by:
1. Prepending `--` + the configured prefix (default: `hail`)
2. Replacing `:` separators with `-`

So `color:accent` → `--hail-color-accent`, `s:8p` → `--hail-sr-8p`.

The prefix is configurable via `$dsPrefix`, exposed by `state.styl`.

### Token Overwrite Protection

By default, `$dsShouldPreventTokenOverwrites = true` causes an error if you attempt to register a token that already exists. To override an existing token:

```stylus
$dsShouldPreventTokenOverwrites = false
dsSetToken('color:accent', oklch(0.7 0.15 200))  // override
$dsShouldPreventTokenOverwrites = true
```

---

## The Rule Pipeline

The rule pipeline allows you to define CSS rules anywhere in your files and have them all flushed in a single, controlled call — in a specific order, without manual import orchestration.

### Registering a Rule

```stylus
// 1. Define the mixin (must be done separately due to Stylus limitations)
_emitter()
  body
    font-size: 1rem

// 2. Register it
dsAddRule(_emitter)
```

`dsAddRule(emitter, scoping, layer)`:
- `emitter` — the mixin to call when flushing
- `scoping` — `'scoped'` (default) wraps output in the `rulesScope` selector; `'unscoped'` emits at top level
- `layer` — flush order layer; must be one of the values in `$dsLayers` (default: `'reset'` then `'base'`)

### Flushing Everything

Call this at the top level (not inside any selector) of a `.styl` file or `stylus` block that's only consumed **once** (not auto-imported, called, or otherwise included multiple times):

```stylus
dsUseGenerateDeclarationsAtTopLevel()
// or with custom scopes:
dsUseGenerateDeclarationsAtTopLevel(tokensScope: ':root', rulesScope: ':root')
```

This single call:
1. Emits all token values as CSS custom properties under `tokensScope`
2. Flushes all registered rules in layer order (`reset` → `base`), scoped rules wrapped in `rulesScope`

### Scoping for Isolation (e.g., Browser Extensions)

If you're building a browser extension or need to namespace all styles to avoid conflicts with the host page:

```stylus
dsUseGenerateDeclarationsAtTopLevel(tokensScope: ':root', rulesScope: '#my-extension-root')
```

Scoped rules will be wrapped inside the given selector. Unscoped rules emit outside it (useful for `@media` or `@keyframes` that can't be nested).

### Rules Without `dsAddRule`

The pipeline only matters for defining presets with ordering guarantees and automatic scoping from a unified flow, but should not be used inside components or any stylus file that is consumed **after** the pipeline has already been flushed. In those cases, simply write regular rules (in-place declarations or mixin calls), no need to use `dsAddRule`.

### Layers

`$dsLayers` defines the flush order. Default: `('reset' 'base')`. You can extend it, but must do so before any rules are registered:

```stylus
$dsLayers = ('reset' 'base' 'components' 'utilities')
```

---

## Core API Reference

These are the public-facing functions you'll use most often in your stylesheets.

### `Var(token, fallback?)`

Resolves a token to a CSS `var()` reference. Use this wherever you would use a CSS custom property.

```stylus
.card
  background: Var('s:bg')
  padding: Var('s:16p')
  color: Var('s:text-primary', black)  // with fallback
```

### `Val(token, registryName?)`

Returns the raw Stylus value of a token from the registry. Necessary when a CSS variable reference won't work — e.g., inside a `@media` query condition.

```stylus
@media (max-width: Val('s:breakpoint:tablet'))
  .sidebar
    display: none
```

### `UseVar(token, value, mode?)`

Emits a `--token-name: value` declaration. Used to locally override a token's CSS variable within a specific scope.

```stylus
.dark-card
  UseVar('s:bg', black)
  UseVar('s:text-primary', white)
```

The `mode` argument defaults to `'overwrite'`. Use `'set'` to also register the token in the registry if not yet present.

### `UseToken(token, cssProperty?)`

Emits the CSS declarations stored in an assignment token. Optionally emit only one specific property.

```stylus
p
  UseToken('t:body')           // emits all properties
  UseToken('t:body', 'font-family')  // emits only font-family
```

---

## Domain: Layout

The layout domain provides utilities for creating layouts. Its api exposes these utils:

### `UseFlex(ff?, g?, jc?, ai?, ac?, inline?)`

A convenience mixin for flexbox layouts with built-in validation.

```stylus
.row
  UseFlex('row', Var('s:8p'), 'space-between', 'center')
```

All arguments are optional. Gap (`g`) accepts a CSS unit or a token string.

---

## Domain: Size

The size domain provides size utilities based on a configurable base-size scale, with built-in support for rem-sensitivity.

### `dsSize(step, base?)`

Generates a `calc()` expression for a size value as a multiple of a base size.

```stylus
dsSize(1)    // → calc(base-size * 1)   = 8px (by default)
dsSize(2)    // → calc(base-size * 2)   = 16px
dsSize(0.5)  // → calc(base-size * 0.5) = 4px
```

### The `bem` Unit (rem-sensitive base)

If you suffix your step with `bem`, the size is computed against the `bem` base instead of the raw pixel base. The `bem` base is derived from `base-size / rem-target * 1rem`, making it sensitive to the user's browser font-size preferences.

```stylus
dsSize(1bem)    // → calc(rem-sensitive-base * 1) — scales with user's font size preference
dsSize(2bem)    // → calc(rem-sensitive-base * 2)
```

You can also use `rem` directly (without `dsSize`) if you want pure rem values independent of your base size scale:

```stylus
font-size: 1rem     // directly, no dsSize needed
```

> **Note:** Passing a `rem`-suffixed value to `dsSize` is a validation error — the engine will throw a descriptive error pointing you to the correct alternative (`bem` or bare `rem`).

### Size Control Tokens

| Token | Default | Purpose |
|---|---|---|
| `size-control:base` | `8` | Base unit in pixels |
| `size-control:rem:target-px` | `base-size * 2 = 16` | Target px for 1rem equivalence |
| `size-control:rem` | `rem-target / 16 * 100%` | Set as `font-size` on `:root`, or overwrite formula to not rely on a percentage if you want to emit it inside a custom scope (eg: on a third-party website) |
| `size-control:bem` | derived from base & rem-target | The rem-sensitive base unit |

---

## Domain: Color

The color domain provides a rich API for defining and manipulating colors in [OKLCH](https://oklch.com/) color space, plus a unique elevation system that powers automatic light/dark scheme support.

### OKLCH Channels

Every color has four channels: `l` (lightness, 0–1), `c` (chroma, 0–0.4), `h` (hue, 0–360), and optional `a` (alpha, 0–1). The engine uses CSS relative color syntax (`oklch(from base l c h)`) to define one color in terms of another.

### Defining Colors with `dsColor`

`dsColor(base, ...)` constructs a color derived from a base color token or CSS variable, with optional channel overrides. It returns a CSS color value.

**Channel override modes:**

| Parameter | Type | Channel | Mode |
|---|---|---|---|
| `e` | Factor (0–1) | elevation | normalized |
| `l` | Factor (0–1) | lightness | normalized |
| `c` | Factor (0–1) | chroma | normalized |
| `h` | 0–360 or TokenOrVar | hue | explicit |
| `a` | Factor or TokenOrVar | alpha | explicit |
| `eRel` | -1 to 1 | elevation | relative delta |
| `lRel` | -1 to 1 | lightness | relative delta |
| `cRel` | -1 to 1 | chroma | relative delta |
| `hRel` | -360 to 360 | hue | relative delta |
| `aRel` | -1 to 1 | alpha | relative delta |
| `lExp` | Factor or TokenOrVar | lightness | explicit |
| `cExp` | Factor or TokenOrVar | chroma | explicit |

```stylus
// Normalized: factor maps across the configured min/max range
dsSetToken('s:bg', dsColor('color:matte', e: 0))       // e=0 → most background-like elevation
dsSetToken('s:primary', dsColor('color:accent', e: 0.5)) // midpoint elevation

// Relative: shift by a delta on top of the base color's current value
dsSetToken('s:hover', dsColor('s:primary', eRel: 0.1))

// Explicit: set the channel directly
dsSetToken('s:subtle', dsColor('color:accent', cExp: 0.05))
```

### The Elevation System and Automatic Dark/Light Schemes

This is hail-styl's most distinctive feature. **Elevation** is an abstract concept representing how "raised" a surface is in the visual hierarchy. Rather than defining separate color palettes for light and dark schemes, you define colors using an `e` factor (0 = floor/background, 1 = highest surface), and the engine automatically adapts them to the active scheme.

The underlying principle relies on a single scheme-aware CSS variable: `color-control:most-elevated-l`.

- In **light scheme**: `most-elevated-l = 0` (high elevation → darker, closer to black)
- In **dark scheme**: `most-elevated-l = 1` (high elevation → lighter, closer to white)

The elevation formula for lightness is roughly:

```txt
L = minL + lRange × ((1 - factor) + mostElevatedL × (2×factor − 1))
```

When `mostElevatedL = 0` (light scheme), this simplifies to `L = minL + lRange × (1 - factor)` — higher elevation yields darker colors. When `mostElevatedL = 1` (dark scheme), it simplifies to `L = minL + lRange × factor` — higher elevation yields lighter colors.

Dark mode is activated by a single CSS variable override (done automatically via a `@media (prefers-color-scheme: dark)` rule in `controls.styl`). No separate dark-mode color tokens are ever needed; the same `e` factor works correctly in both schemes because the direction flips at the CSS level.

The scheme can also be forced via a data attribute (`{$dsAttrPrefix}-scheme`):

```html
<html data-hail-scheme="dark">   <!-- force dark -->
<html data-hail-scheme="light">  <!-- force light -->
```

### `dsColor` Example: Single Definition, Both Schemes

```stylus
// These tokens work correctly in both light and dark mode:
dsSetToken('s:bg',           dsColor('color:matte', e: 0))      // lowest surface
dsSetToken('s:surface',      dsColor('color:matte', e: 0.2))
dsSetToken('s:text-primary', dsColor('color:matte', e: 1))      // highest contrast
```

No duplication. No `@media (prefers-color-scheme: dark) { ... }` for your semantic tokens.

### `dsSetColorChannelToken(token, value)`

A convenience helper to register individual color channel tokens (e.g., `color:accent:l`, `color:accent:c`, `color:accent:h`). Automatically validates that the token's suffix is a valid channel name.

```stylus
dsSetColorChannelToken('color:accent:h', 264)
dsSetColorChannelToken('color:accent:c', 1)    // normalized: maps 1 → max-c
dsSetColorChannelToken('color:accent:l', 0.5)  // normalized: maps to midpoint of min-l/max-l
```

### `UseContrast(against, againstColor, contrastPivotL?)`

Emits a `background-color` + `color` declaration pair where one is the given color and the other is automatically chosen to be either black or white for maximum readability.

```stylus
.badge
  UseContrast('bg', Var('s:primary'))   // bg = s:primary, text = auto black/white
  // or
  UseContrast('txt', Var('s:primary'))  // text = s:primary, bg = auto black/white
```

The pivot lightness (`contrastPivotL`, default configured in `color-control:contrast-pivot-l`) determines the threshold: base colors darker than the pivot get white text; lighter ones get black text.

### Color Control Tokens

These live in `controls.styl` and can be overridden before importing `index-design.styl`:

| Token | Default | Purpose |
|---|---|---|
| `color-control:min-l` | `0.08` | Minimum lightness |
| `color-control:max-l` | `0.96` | Maximum lightness |
| `color-control:min-c` | `0` | Minimum chroma |
| `color-control:max-c` | `0.3` | Maximum chroma |
| `color-control:contrast-pivot-l` | `0.65` | White text threshold |
| `color-control:saturation-factor:dark-scheme` | `0.9` | Chroma reduction in dark mode |

---

## Validation & Error Tracing

hail-styl has a systematic approach to validation that produces structured, human-readable error messages in Stylus. This is one of the engine's core design patterns.

### `dsExpect(condition, message, logs?)`

The foundational assertion. If `condition` is falsy, Stylus throws an error with `message` (and the call trace appended if `logs` is provided).

### Call Tracing with `dsTrace`

Every util in the engine calls `dsTrace` to build up an accumulating call stack string (`logs`), which gets appended to error messages. This gives you a full breadcrumb trail showing exactly which chain of utils led to the failure:

```txt
Error: Value "2" must be between Range Min "0" and Range Max "1" (inclusive).
Trace:
[dsColor] @received -> "Base": color:accent "Normalized E": 2
[dsResolveNormalizedChannel] @received -> "Channel": e "Factor": 2
[dsExpectFactor] @received -> "Factor": 2
[dsExpectNumberInRange] @received -> "Number:" 2 Range Min:" 0 Range Max:" 1
```

Invalid input (wrong type, out-of-range value, unknown token, bad token format) is caught early with clear messages, including which argument was wrong and where in the call stack it occurred.

### Built-in Validators

| Validator | What it checks |
|---|---|
| `dsExpectUnit(value, suffix?)` | Value must be a CSS unit; optionally with a specific suffix |
| `dsExpectFactor(factor)` | Unitless number in [0, 1] |
| `dsExpectRelativeFactor(rf)` | Unitless number in [-1, 1] |
| `dsExpectPatternMatch(value, regex)` | String matches a regex pattern |
| `dsExpectAcceptedOption(opt, list)` | Value is one of the accepted options |
| `dsExpectTokenFormat(token, registry)` | Token matches the domain:name[:suffix] format |
| `dsExpectTokenStatus(token, status)` | Token is 'new' (not in registry) or 'known' (already registered) |

---

## Naming Conventions

### Utils

| Pattern | Example | Meaning |
|---|---|---|
| PascalCase (with `Use` prefix for mixins) | `Var`, `UseToken` | Public API — use in your stylesheets |
| camelCase with `ds` prefix | `dsSetToken`, `dsAddRule` | Setup/helper function |
| camelCase with `dsUse` prefix | `dsUseFlushRules` | Setup/helper mixin (emits CSS) |
| `_emitter` | `_emitter()` | Anonymous emitter registered via `dsAddRule` |

### Variables & Arguments

- **Stylus function arguments**: no `$` prefix (makes for a more ergonomic named-argument syntax: `dsColor('color:accent', e: 0.5)`)
- **Local variables inside utils**: `$` prefix (e.g., `$logs`, `$resolved`)
- **Global config variables**: `$ds` prefix (e.g., `$dsPrefix`, `$dsLayers`)

### Primitive Wrappers

Always use the engine's wrappers instead of Stylus/CSS built-ins to avoid quoting bugs and ensure consistent CSS output:

| Wrapper | Replaces | Example |
|---|---|---|
| `Qn(args...)` | String concatenation | `Qn('--' $prefix '-' $name)` |
| `Qs(args...)` | Space-joined concat | `Qs('must be between' min 'and' max)` |
| `Uq(value)` | `unquote()` | `Uq('flex-start')` |
| `Uqn(args...)` | `unquote(join('', args))` | `Uqn('var(' $varName ')')` |
| `Uqs(args...)` | `unquote(join(' ', args))` | `Uqs('/' $alpha)` |
| `Calc(args...)` | `calc()` | `Calc($base '*' $step)` |
| `Clamp(args...)` | `clamp()` | `Clamp(1rem, 2vw, $max)` |
| `Min/Max(args...)` | `min()/max()` | `Min(40px, $size)` |
| `Oklch(args...)` | `oklch()` | `Oklch('from' $base $l $c $h)` |
| `Precise(val)` | `round(val * 10000) / 10000` | `Precise(1 - 0.3)` → `0.7` |

---

## Configuration & Opt-outs

### Global Config (override before `@import`)

| Variable | Default | Effect |
|---|---|---|
| `$dsPrefix` | `'hail'` | CSS variable prefix (`--hail-…`) |
| `$dsShouldPreventTokenOverwrites` | `true` | Throw if a token is registered twice |
| `$dsLayers` | `('reset' 'base')` | Rule flush order |

### Starter Presets (`$dsPresets`)

Control which starter presets are included using `$dsPresets` before importing `index-design.styl`. The `mode` can be `'opt-out'` (include all EXCEPT listed, default) or `'opt-in'` (include ONLY listed).

```stylus
// Example: opt-out of resets and basic styles
$dsPresets = {
  mode: 'opt-out',
  listed: ('resets' 'basic-styles')
}

// Example: opt-in to ONLY color monochromatic palette and size steps (ignore everything else)
$dsPresets = {
  mode: 'opt-in',
  listed: ('color-monochromatic-palette' 'size-step-roles')
}

// Example: ignore EVERYTHING
$dsPresets = {
  mode: 'opt-in',
  listed: ()
}
```

**Available preset strings:**

| Name | Controls |
|---|---|
| `'resets'` | Default CSS browser reset rules |
| `'size-step-roles'` | `s:*p` tokens |
| `'breakpoint-roles'` | `bp:*` tokens |
| `'color-monochromatic-palette'`| `color:accent`, `color:tinted`, `color:matte` |
| `'color-basic-roles'` | Basic `s:*` color roles |
| `'text-basic-roles'` | Basic `t:*` text roles |
| `'icon-overrides'` | `d-icon:*` known overridable tokens for `hail-nuxt`'s `BaseIcon.vue` |
| `'basic-styles'` | Basic styles for `body` or similar entry node (depends on `color-basic-roles` and `text-basic-roles` being included. Or you could define your own before `index-design.styl` runs.) |
| `'dark-scheme-overrides'` | Basic overrides for dark scheme flip support |
| `'nuxt-transitions'` | Default fade transitions for Nuxt pages/layouts |

---

## Adding to Your Project

### Install

```sh
npm install @mszr/hail-styl
```

### Basic Setup (Nuxt/Vite example)

Create a single design system entry file (e.g., `design-system.styl`):

```stylus
// 1. [Optional] Configure (BEFORE importing hail)
$dsPrefix = 'my-app'
$dsPresets = {
  mode: 'opt-out',
  listed: ('resets') // eg: if you have your own reset
}

// 2. Import hail
@import '@mszr/hail-styl'

// 3. [Optional] Override tokens (AFTER importing hail)
$dsShouldPreventTokenOverwrites = false
dsSetColorChannelToken('color:accent:h', 200)  // change hue
$dsShouldPreventTokenOverwrites = true

// 4. [Optional] Add your own rules
_emitter()
  body
    UseToken('t:body')
dsAddRule(_emitter, 'unscoped')
```

Import this file in your build tool's global stylus configuration (e.g., `nuxt.config.ts`):

```ts
export default defineNuxtConfig({
  vite: {
    css: {
      preprocessorOptions: {
        stylus: {
          paths: [path.resolve(process.cwd(), 'node_modules')], // <- needed so stylus can resolve `@import '@mszr/hail-styl'`
          imports: [path.resolve(__dirname, 'design-system.styl')], // <- imports your design system entry file (which imports hail and sets up your design system)
        }
      }
    }
  }
})
```

Flush everything (call ONCE, at top level)

```vue
<!-- app.vue -->
<template lang="pug">
h1 hello from app.vue
</template>

<script setup lang="ts">
</script>

<style lang="stylus">
dsUseGenerateDeclarationsAtTopLevel()
</style>
```

With this setup, all token variables and flushed rules are available globally, and you can use `Var`, `Val`, `UseToken`, etc. in any component stylesheet without imports.

---

## Extending the Engine

### Adding New Tokens

Register tokens anywhere in a file that's imported before `dsUseGenerateDeclarationsAtTopLevel()` is called:

```stylus
dsSetToken('s:success', dsColor('color:accent', h: 145, e: 0.5))
dsSetToken('s:xl', dsSize(6))
```

### Adding New Layers

If you need more than `reset` and `base`:

```stylus
$dsLayers = ('reset' 'base' 'components' 'utilities')
```

Do this before any `dsAddRule` call.

### Custom Domains

The allowed domain regex in `state.styl` can be overridden to allow new domain prefixes:

```stylus
$dsAllowedDomainRegex = Qn('^(size|s|color|c|text|t|d-' $dsTokenSegmentRegex '|myapp-' $dsTokenSegmentRegex '):')
```

### Overriding Color Controls

Customize the entire color system range after `index-design.styl` runs:

```stylus
@import '@mszr/hail-styl/system'
@import '@mszr/hail-styl/design'

$dsShouldPreventTokenOverwrites = false
dsSetToken('color-control:min-l', 0.05)       // deeper darks
dsSetToken('color-control:max-l', 0.98)       // brighter lights
dsSetToken('color-control:max-c', 0.25)       // less saturated palette
$dsShouldPreventTokenOverwrites = true
```
