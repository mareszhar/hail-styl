# Styling Context

A quick guide to styling with the **hail-styl** design system engine.

## hail-styl

### 🛠️ Core Utilities
- `Var('token')`: Access a token's CSS variable. Prefer this for all property values. (e.g., `color: Var('c:primary')`).
- `UseToken('token')`: Emit property-value declarations assigned to a token. (e.g., `.nest-in-selector UseToken('t:label')`).
- `UseFlex(ff, g, jc, ai, ac)`: Build flexible layouts with type safety. (e.g., `UseFlex(column, 1rem, center, center, center)`)
- `UseContrast('bg'|'fg', 'c:token')`: Emit a contrasting `background-color` and `color` pair. (e.g., `UseContrast('bg', 'c:bg')`)

### 📐 Design Principles
- **Tokens over Values**: Always check for a registered token before using hardcoded values.
- **Semantic Names**: Tokens are grouped by role: `c:` (colors), `s:` (sizes), `r:` (radii), `t:` (text).

### 🗺️ Maps & References
For more detailed information, refer to the following guides:
- [Principles](https://raw.githubusercontent.com/mareszhar/hail-styl/main/docs/principles.md) &bull; Mental model and registries.
- [Styling Guide](https://raw.githubusercontent.com/mareszhar/hail-styl/main/docs/styling.md) &bull; Detailed usage of utilities in components.
- [API Reference](https://raw.githubusercontent.com/mareszhar/hail-styl/main/docs/api-reference.md) &bull; Full list of every utility and primitive.

---

## Project-Specific Context

### Tokens

> **USER: INSERT THE PATH(S) TO YOUR SEMANTIC TOKEN DEFINITIONS HERE.**

### Custom Utilities

> **USER: INSERT THE PATH(S) TO YOUR CUSTOM UTILITIES HERE.**
