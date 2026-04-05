# hail-styl LLM Guide

> Concise reference for AI assistants and time-strained devs. For full details, see `detailed-guide.md`.

---

## What it is

A Stylus design system engine. You define **tokens** (named design values) and **rules** (CSS rule-sets), then flush them all with one call. Tokens become CSS custom properties; rules are emitted in configured order.

---

## Core Workflow

```stylus
// 1. [Optional] configure before import
$dsPrefix = 'my-app'

// 2. Import the engine
@import '@mszr/hail-styl'

// 3. Define your tokens & rules anywhere (after import, before flush)
dsSetToken('cr:surface', dsColor('color:matte', e: 0.2))
_emitter()
  body
    background: Var('cr:surface')
dsAddRule(_emitter)

// 4. Flush ONCE at top level 
// NOTE: call this in a stylus block in app.vue, or somewhere that is only consumed **once**
dsUseGenerateDeclarationsAtTopLevel()
```

`dsUseGenerateDeclarationsAtTopLevel(tokensScope, rulesScope)` emits all tokens as CSS vars and calls all registered rule emitters in layer order. Default scope: `:root`.

---

## Tokens

### Format

```txt
domain:name[:suffix]
```

Allowed domains: `space`, `sr`, `color`, `cr`, `text`, `tr`, `dr-*`

### Register

```stylus
dsSetToken('cr:primary', oklch(0.5 0.2 264))
```

Tokens are emitted as `--{prefix}-{domain}-{name}[-{suffix}]`.
Default prefix: `hail` → `--hail-cr-primary`.

### Overwrite protection (on by default)

```stylus
$dsShouldPreventTokenOverwrites = false
dsSetToken('color:accent', ...)   // override existing
$dsShouldPreventTokenOverwrites = true
```

### Assignment tokens (declarative roles)

```stylus
dsSetTokenAssignments('tr:body', {
  font-family: Uq('Inter, sans-serif'),
  line-height: 1.5,
})
```

---

## Core API

| Function | Returns | Use when |
|---|---|---|
| `Var(token, fallback?)` | `var(--hail-…)` | Whenever you'd use `var()` |
| `Val(token)` | raw Stylus value | Inside `@media` conditions, calc inputs |
| `UseVar(token, value)` | `--hail-…: value` declaration | Local token override in a selector, or to set a `--var` that works with `Var` |
| `UseToken(token, prop?)` | CSS declarations | Apply an assignment token's styles |

```stylus
.card
  background: Var('cr:bg')
  padding: Var('sr:16p')
  UseToken('tr:body')

@media (max-width: Val('sr:breakpoint:tablet'))
  .sidebar
    display: none

.dark-card
  UseVar('cr:bg', black)
```

---

## Rule Pipeline

```stylus
// Register a rule
_emitter()
  some-selector
    property: value
dsAddRule(_emitter, scoping, layer)
// scoping: 'scoped' (default, wrapped in rulesScope) | 'unscoped' (top-level)
// layer: 'reset' | 'base' (default). Controls flush order.
```

Rules registered with `dsAddRule` are all flushed by `dsUseGenerateDeclarationsAtTopLevel()`. For browser extensions or iframe isolation, pass a custom scope selector.

**Without `dsAddRule`:** You can write plain Stylus selectors in any imported file or inside the `stylus` block of a component (eg: in Vue) — no need to register them if you don't need ordering guarantees or auto-scoping. Also, if you define a rule that will be processed/consumed **after** `dsUseGenerationsAtTopLevel()` has already been called, then you **must** define/emit it directly **without** `dsAddRule`.

---

## Color Domain

### `dsColor(base, ...overrides)` → CSS color value

Derives one color from another using CSS relative OKLCH. Returned value is a CSS color string to store in a token or use directly.

```stylus
dsColor('color:accent', e: 0.5)       // normalized elevation → auto light/dark aware
dsColor('color:accent', l: 0.8)       // normalized lightness (0=min-l, 1=max-l)
dsColor('color:accent', c: 0)         // normalized chroma (0=min-c, 1=max-c)
dsColor('color:accent', h: 200)       // explicit hue
dsColor('color:accent', eRel: 0.1)    // relative elevation delta
dsColor('color:accent', lExp: 0.7)    // explicit lightness value
dsColor('color:accent', cExp: 0.05)   // explicit chroma value
```

### Elevation & Automatic Light/Dark Scheme

Define colors once using `e` (elevation, 0–1). `e: 0` = background level. `e: 1` = highest surface (most contrast-heavy).

The engine uses a scheme-aware CSS variable (`color:control:most-elevated-l`) to flip the lightness direction:
- **Light mode**: higher `e` → darker (closer to black)
- **Dark mode**: higher `e` → lighter (closer to white)

Dark mode activates automatically via `@media (prefers-color-scheme: dark)`, or can be forced by setting the `{dsAttrPrefix}-scheme` attribute. For example:

```html
<html data-hail-scheme="dark">
<html data-hail-scheme="light">
```

No separate dark-mode tokens needed. One token definition works for both schemes.

### `UseContrast(against, color, pivotL?)` — mixin

Emits `background-color` + `color` pair where one is the given color and the other is auto-selected black or white for readability.

```stylus
.badge
  UseContrast('bg', Var('cr:primary'))   // bg = primary, text = auto
  UseContrast('txt', Var('cr:primary'))  // text = primary, bg = auto
```

### `dsSetColorChannelToken(token, value)`

Register a channel sub-token. Suffix must be `l`, `c`, `h`, or `a`.

```stylus
dsSetColorChannelToken('color:accent:h', 264)
dsSetColorChannelToken('color:accent:c', 1)    // 1 = max chroma
dsSetColorChannelToken('color:accent:l', 0.5)  // 0.5 = mid lightness
```

---

## Space Domain

### `dsSize(step, base?)` → `calc(...)` value

Step is a multiplier of the base size (default: 8px).

```stylus
dsSetToken('sr:8p', dsSize(1))    // 8px
dsSetToken('sr:16p', dsSize(2))   // 16px
dsSetToken('sr:4p', dsSize(0.5))  // 4px
```

**`bem` unit** — step is rem-sensitive (scales with user's browser font-size), but matches the steps of our base size:

```stylus
dsSize(1bem)   // calc(rem-sensitive-base * 1)
```

Use plain `rem` directly when you want rem independent of the base scale:

```stylus
font-size: 1rem  // no dsSize needed
```

### `UseFlex(ff?, g?, jc?, ai?, ac?, inline?)` — mixin

```stylus
.row
  UseFlex('row', Var('sr:8p'), 'space-between', 'center')
```

---

## Opt-out Presets (set before importing index-design)

If you want to opt-out of the starter presets, you can set `$dsIgnoreStarterPreset` to `true` before importing `index-design`.

There are a number of other `$dsIgnore*` variables you can set to opt-out of specific presets. See the [Detailed Guide](./detailed-guide.md) for more information.

---

## Naming Quick Reference

- `PascalCase` → public API, mixins with `Use` prefix (eg: `Var`, `Val`, `UseToken`, `dsColor`, `dsSize`, `UseContrast`, `UseFlex`)
- camelCase → internal setup/helpers, functions with `ds` prefix, mixins with `dsUse` prefix (eg: `dsSetToken`, `dsAddRule`, `dsUseGenerateDeclarationsAtTopLevel`)
- `$ds*` → global config variables
- `$*` → local variables (use inside utils only)
- `_emitter()` → anonymous mixin to pass to `dsAddRule`
- Function params: **no** `$` prefix → enables cleaner named-argument syntax

## Primitive Wrappers (use instead of raw Stylus)

`Qn(a, b…)` quote joining with nothing, `Qs(a, b…)` quote joining with spaces, `Uq(v)` unquote, `Uqn(a…)` unquote joining with nothing, `Uqs(a…)` unquote joining with spaces, `Calc(a…)` → `calc()`, `Clamp(a…)` → `clamp()`, `Oklch(a…)` → `oklch()`, `Precise(v)` → rounded float.
