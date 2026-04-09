# Design Context

A quick guide to designing with the **hail-styl** design system engine.

## hail-styl

### 🏗️ Core Utilities
- `dsSetToken(name, value)`: Register a simple value (color, numeric, etc.).
- `dsSetTokenAssignment(name, { property: value, ... })`: Register a reusable group of property-value assignments.
- `dsColor(base, e: 0..1, ...)`: Semantic color adjustment with automatic light/dark support.
- `dsAddRule(_mixin)`: Add a global style rule to the unified registry.

### 💡 Best Practices
- **Use Elevation**: Always prefer `e: 0..1` for colors to ensure theme-agnostic behavior.
- **Layers**: Distribute rules across appropriate layers via the `$dsLayers` configuration.
- **Validation**: Enforce the `domain:name:[suffix]` pattern for all tokens.

### 🗺️ Maps & References
For more detailed information, refer to the following guides and source files:
- [Designing Guide](https://raw.githubusercontent.com/mareszhar/hail-styl/main/docs/designing.md) &bull; Token registration and the elevation system.
- [Customizing Guide](https://raw.githubusercontent.com/mareszhar/hail-styl/main/docs/customizing.md) &bull; Global variables and presets.
- [state.styl (Source)](https://raw.githubusercontent.com/mareszhar/hail-styl/main/src/system/state.styl) &bull; Global configuration and registry state.
- [presets.styl (Source)](https://raw.githubusercontent.com/mareszhar/hail-styl/main/src/design/presets.styl) &bull; Built-in design presets.
- [controls.styl (Source)](https://raw.githubusercontent.com/mareszhar/hail-styl/main/src/design/controls.styl) &bull; Engine-level sizing and color controls.

---

## Project-Specific Context

### Current Configuration

> **USER: INSERT THE PATH(S) TO YOUR CURRENT SYSTEM CONFIGURATION HERE.**
