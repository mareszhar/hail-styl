# Customizing hail-styl

hail-styl is designed to be highly configurable. You can customize the engine's behavior, toggle bundled features via presets, or overwrite core design tokens.

## 1. Global Configuration

You can configure the engine by setting some special variables **before** importing `@mszr/hail-styl`.

| Variable | Default | Description |
| :--- | :--- | :--- |
| `$dsPrefix` | `'hail'` | The prefix used for all generated CSS variables. |
| `$dsLayers` | `('reset' 'base')` | The order in which rule layers are emitted. |
| `$dsShouldAllowTokenOverwrites` | `false` | When true, allows overwriting existing tokens. |
| `$dsAllowedTokenDomains` | (list) | A list of allowed prefixes for token names (e.g., `color`, `size`). |

For a full list of customizable global variables, see:  
[state.styl](../src/system/state.styl) (or [get raw](https://raw.githubusercontent.com/mareszhar/hail-styl/main/src/system/state.styl))

## 2. Using Presets

hail-styl includes several "starter" presets. You can control which ones are loaded using the `$dsPresets` object.

```stylus
$dsPresets = {
  mode: 'opt-out', // 'opt-in' or 'opt-out'
  listed: ('resets') // Presets to include or exclude
}
```

### Available Presets

- **`resets`**: A minimal, opinionated CSS reset for modern browsers.
- **`size-step-roles`**: Common size tokens (spacing, etc.) based on modular steps.
- **`breakpoint-roles`**: Standard responsive breakpoints (mobile, tablet, desktop).
- **`color-monochromatic-palette`**: Sets up a base monochromatic color palette.
- **`color-basic-roles`**: Semantic color tokens like `c:primary`, `c:bg`, `c:txt`.
- **`text-basic-roles`**: Basic typography assignments.
- **`icon-overrides`**: Ready-to-use tokens for icon styling.
- **`basic-styles`**: Applies base typography and background colors to the root scope.
- **`dark-scheme-overrides`**: Automatic logic for switching elevation in dark mode.
- **`nuxt-transitions`**: Standard transition classes for Nuxt.js projects.

For more information on each preset, see:  
[presets.styl](../src/design/presets.styl) (or [get raw](https://raw.githubusercontent.com/mareszhar/hail-styl/main/src/design/presets.styl))

## 3. Overwriting Controls

Many utils rely on special "control" tokens.

These determine things like the base size of your system, or the valid lightness and chroma ranges for normalized color channels, a desaturation factor for dark scheme, etc.

You can overwrite these to adjust the "feel" of your system.

For more information on the controls available and how they relate to each other, see:  
[controls.styl](../src/design/controls.styl) (or [get raw](https://raw.githubusercontent.com/mareszhar/hail-styl/main/src/design/controls.styl))

## 4. Selective Imports

It's possible to import the "entire" engine, just the system (without any default "design" controls or presets), or even just any low-level utility.

For more information on granular imports, see the [Getting Started](./getting-started.md#selective-imports) (or [get raw](https://raw.githubusercontent.com/mareszhar/hail-styl/main/docs/getting-started.md)) guide.

---

For a full list of available variables and tokens, refer to the [API Reference](./api-reference.md) (or [get raw](https://raw.githubusercontent.com/mareszhar/hail-styl/main/docs/api-reference.md)).
