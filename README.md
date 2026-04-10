# hail-styl

**A Stylus-powered design system engine.** No JS runtime, just pure Stylus magic for robust, scalable, and theme-agnostic styling.

## Features

- 🛡️ **Token Validation**: Built-in registry ensures every `Var()` maps to a registered token, preventing CSS mistakes.
- 🏗️ **Unified Flush Pipeline**: Register tokens and rules anywhere and emit them exactly once at the top level.
- 🌓 **Elevation-based Theming**: Automatic light/dark mode support via semantic elevation factors.
- 🧩 **Modular**: Leverages lazy evaluation and registries to keep design logic separate from emission.

---

## Quick Start

### 1. Install

```bash
npm install -D @mszr/hail-styl
```

### 2. Configure
In the `design-system.styl` auto-imported by your build tool:

```styl
@import '@mszr/hail-styl'

dsSetToken('c:brand', rebeccapurple)
```

### 3. Flush
In your `app.vue` or main single-use entry point:

```styl
// Emits all CSS variables and rules
dsUseGenerateDeclarationsAtTopLevel()
```

---

## Documentation

The documentation is split into focused modules to keep things concise and AI-friendly:

1. [**Principles**](https://github.com/mareszhar/hail-styl/blob/main/docs/principles.md) — The mental model: Registries, Flushing, and Elevation. [[get raw]](https://raw.githubusercontent.com/mareszhar/hail-styl/main/docs/principles.md)
2. [**Getting Started**](https://github.com/mareszhar/hail-styl/blob/main/docs/getting-started.md) — Installation, configuration, and the Flush call. [[get raw]](https://raw.githubusercontent.com/mareszhar/hail-styl/main/docs/getting-started.md)
3. [**Designing**](https://github.com/mareszhar/hail-styl/blob/main/docs/designing.md) — Defining tokens, rules, and the elevation system. [[get raw]](https://raw.githubusercontent.com/mareszhar/hail-styl/main/docs/designing.md)
4. [**Styling**](https://github.com/mareszhar/hail-styl/blob/main/docs/styling.md) — Usage in components: `Var()`, `UseToken()`, and UI utilities. [[get raw]](https://raw.githubusercontent.com/mareszhar/hail-styl/main/docs/styling.md)
5. [**Customizing**](https://github.com/mareszhar/hail-styl/blob/main/docs/customizing.md) — Global configuration, presets, and core controls. [[get raw]](https://raw.githubusercontent.com/mareszhar/hail-styl/main/docs/customizing.md)
6. [**API Reference**](https://github.com/mareszhar/hail-styl/blob/main/docs/api-reference.md) — A compact, searchable list of every tool in the engine. [[get raw]](https://raw.githubusercontent.com/mareszhar/hail-styl/main/docs/api-reference.md)
7. [**Conventions**](https://github.com/mareszhar/hail-styl/blob/main/docs/conventions.md) — Naming and architectural conventions for utils, variables, and tokens. [[get raw]](https://raw.githubusercontent.com/mareszhar/hail-styl/main/docs/conventions.md)

---

## AI Assistants

Use these templates to help an AI assistant work with your design system:

- [Styling Context](./docs/templates/styling-context.md) — Teach AI to style components with your tokens.
- [Design Context](./docs/templates/design-context.md) — Teach AI to extend your design system.

---

## 📺 Demo

Check out the [Nuxt Minimal Demo](./demo) to see `hail-styl` in action in a real project.
