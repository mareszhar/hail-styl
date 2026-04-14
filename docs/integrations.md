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

### The `UseVar(...)` Scoped Registration
If you use `UseVar(...)` inside a component to register a new token, you are updating the registry **only for that specific component execution.**

- ✅ **Works**: Referencing that token with `Var()` later in the *same* component.
- ❌ **Fails**: Referencing that token in a child component or a different file.

### Best Practices for Shared State
1. **Global Tokens**: Always define shared design intent (colors, spacing, etc.) in your primary `design-system.styl` or its imports.
2. **Local Overwrites**: Use `UseVar(..., value)` to locally register or overwrite a token's value for a component subtree.
3. **Component Domains**: For component-specific tokens that need nested access, define them in the global registry using a specific domain (e.g., `d-card:shadow`).

---

## 🤝 Sharing Variables with JS/TS

It's often useful to share configuration (like icon names or feature flags) between your TypeScript logic and Stylus stylesheets. In Vite-based environments (like Nuxt), you can pass objects via the `define` option.

### The Challenge: "Listified" Objects

Vite converts JS objects passed to Stylus into a "list of lists" (entries) to maintain compatibility. This prevents you from using standard dot-notation (e.g., `$icons.name`) directly.

### The Solution: `dsResolveFlatEntriesToHash`

Use `dsResolveFlatEntriesToHash` to convert these entries back into a native Stylus hash.

> [!NOTE]
> This utility only supports flat objects. Nested JS objects will be returned as raw keyword lists.

**1. Define in Vite (TS):**

```ts
// nuxt.config.ts or vite.config.ts
export default defineConfig({
  vite: {
    css: {
      preprocessorOptions: {
        stylus: {
          define: {
            // Passed as [[fill, "d-icon:fill"], [stroke, "d-icon:stroke"]]
            ICON_TOKENS: {
              fill: 'd-icon:fill',
              stroke: 'd-icon:stroke'
            }
          },
          // Ensures @import '@mszr/hail-styl' resolves correctly
          paths: [path.resolve(process.cwd(), 'node_modules')],
          // Automatically imports your design system in every component. stylus files that are directly or indirectly imported into a component will also have access to the design system.
          additionalData: `@import '${path.resolve(process.cwd(), './design-system.styl')}'`,
        }
      }
    }
  }
})
```

**2. Resolve in Stylus:**

```styl
// design-system.styl
$iconTokens = dsResolveFlatEntriesToHash(ICON_TOKENS)

dsSetToken($iconTokens.fill, null) // dot notation works now!
```

---

For more details on token patterns, see [Designing](./designing.md) [[get raw]](https://raw.githubusercontent.com/mareszhar/hail-styl/main/docs/designing.md).
