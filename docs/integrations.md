# Integrations & Environments

hail-styl is built to integrate with modern build tools. This guide covers how to set up the engine in different environments and documents important preprocessor behaviors.

---

## 🏗️ Vite & Nuxt

Most modern frameworks (Vue, Nuxt, Svelte, etc.) use Vite as their building block. To make hail-styl available globally, you must configure Stylus preprocessor options.

### 1. Configuration

In your `vite.config.ts` (or `nuxt.config.ts`), add the package path to `paths` and auto-import your design system via `additionalData`.

```ts
// vite.config.ts
import path from 'node:path'
import process from 'node:process'

export default {
  css: {
    preprocessorOptions: {
      stylus: {
        // Ensures @import '@mszr/hail-styl' resolves correctly
        paths: [path.resolve(process.cwd(), 'node_modules')],
        // Automatically imports your design system in every component. stylus files that are directly or indirectly imported into a component will also have access to the design system.
        additionalData: `@import '${path.resolve(process.cwd(), './design-system.styl')}'`,
      },
    },
  },
}
```

### 2. Implementation

Check out the [Nuxt Minimal Demo](https://github.com/mareszhar/hail-styl/tree/main/demo) [[get blob]](https://github.com/mareszhar/hail-styl/tree/main/demo) for a complete working example.

---

## 💡 Important: Isolated Preprocessor State

When using tools like Vite, it's critical to understand that **Stylus state is not globally persistent across your entire build.**

### The "Shared State" Illusion
Every time a component (e.g., `Button.vue`) is processed, the Stylus engine starts from a clean slate and re-runs your `additionalData` (and every file it imports).

Because every file re-runs the same `design-system.styl` in the same order, they all **reconstruct the same state**. This creates the illusion of a single global registry, but in reality, each component has its own private copy.

### The `UseVar('...', mode: 'set')` Gotcha
If you use `UseVar(..., 'set')` inside a component, you are updating the registry **only for that specific component execution.**

- ✅ **Works**: Referencing that token with `Var()` later in the *same* component.
- ❌ **Fails**: Referencing that token in a child component or a different file.

### Best Practices for Shared State
1. **Global Tokens**: Always define shared design intent (colors, spacing, etc.) in your primary `design-system.styl` or its imports.
2. **Local Overwrites**: Use `UseVar(..., value)` (without `mode: 'set'`) to locally overwrite a globally known token's value for a component subtree.
3. **Component Domains**: For component-specific tokens that need nested access, define them in the global registry using a specific domain (e.g., `d-card:shadow`).

---

For more details on token patterns, see [Designing](./designing.md) [[get raw]](https://raw.githubusercontent.com/mareszhar/hail-styl/main/docs/designing.md).
