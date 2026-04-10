# Design Context

A quick guide to designing with the **hail-styl** design system engine.

## hail-styl

### 🏗️ Core Utilities

- `dsSetToken(token, value)`: Register a simple value (color, numeric, etc.).
- `dsSetTokenAssignment(name, { property: value, ... })`: Register a reusable group of property-value assignments.
- `dsColor(base, e: 0..1, ...)`: Semantic color adjustment with automatic light/dark support.
- `dsAddRule(_mixin)`: Add a global style rule to the unified registry.

### 💡 Best Practices

- **Semantic Names**: Tokens are grouped by domain (see [Our Design System](#our-design-system)).
- **Use Elevation**: Always prefer `e: 0..1` for colors to ensure theme-agnostic behavior.
- **Layers**: Distribute rules across appropriate layers via the `$dsLayers` configuration.
- **Validation**: Enforce the `domain:name:[suffix]` pattern for all tokens.

### 🗺️ Useful References

For more detailed information, refer to the following guides and source files:

- [Designing Guide](https://raw.githubusercontent.com/mareszhar/hail-styl/main/docs/designing.md) &bull; Token registration and the elevation system.
- [Customizing Guide](https://raw.githubusercontent.com/mareszhar/hail-styl/main/docs/customizing.md) &bull; Global variables, presets, and engine configuration.
- [state.styl (Source)](https://raw.githubusercontent.com/mareszhar/hail-styl/main/src/system/state.styl) &bull; Global configuration and registry state.
- [presets.styl (Source)](https://raw.githubusercontent.com/mareszhar/hail-styl/main/src/design/presets.styl) &bull; Built-in design presets.
- [controls.styl (Source)](https://raw.githubusercontent.com/mareszhar/hail-styl/main/src/design/controls.styl) &bull; Engine-level sizing and color controls.

If you need to style things using the design system, check out the [Styling Context](./styling-context.md).

---

## Project-Specific Context

### ⚠️ Worth Noting

Auto-imported stylus code reruns for each component. This means the engine state is **reconstructed from scratch in every component**.

Token registrations outside the file(s) configured for auto-importing will only be known inside that file or the ones imported in it after the registration.

To ensure tokens are known across the entire application, define them in the file(s) configured for auto-importing.

### Our Design System

> **USER: INSERT THE PATH(S) TO YOUR CURRENT SYSTEM CONFIGURATION, ALLOWED TOKEN DOMAINS, CUSTOM UTILS, ETC. HERE.**
