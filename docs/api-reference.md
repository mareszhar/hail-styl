# API Reference

A compact reference guide for all utilities available in hail-styl.

## Kit Utilities

These utilities are designed for use within your components and stylesheets.

| Utility | Signature | Description |
| :--- | :--- | :--- |
| `Var` | `(token, fallback?)` | Returns the CSS `var()` reference for a registered token. |
| `Val` | `(token)` | Returns the raw, unquoted value of a registered token. |
| `UseToken` | `(token, property?)` | Emits CSS properties for an assignment token group. |
| `UseVar` | `(token, value)` | Registers and applies a scoped CSS variable overwrite. |
| `UseFlex` | `(ff, g, jc, ai, ac, inline?)` | A type-safe flexbox utility for building layouts. |
| `UseContrast`| `(base, baseColor, pivot?)` | Emits contrasting background and text color pairs. |
| `Contrast` | `(baseColor, pivot?)` | Returns a contrasting color (black or white) against a given base color. |
| `Unit` | `(value, suffix?)` | Validates and returns a CSS unit value. |
| `Factor` | `(number)` | Validates and returns a normalized factor (0 to 1). |
| `RelativeFactor` | `(number)` | Validates and returns a relative factor (-1 to 1). |

### Kit Primitives

Low-level engine wrappers for cross-browser safety and Stylus interpolation.

| Utility | Description |
| :--- | :--- |
| `Uq` | A safe wrapper for `unquote` |
| `Uqn` | Joins arguments with `''` (nothing). Then unquotes the result. |
| `Uqs` | Joins arguments with `' '` (space). Then unquotes the result. |
| `Qn` | Returns a string, joining arguments with `''` (nothing). |
| `Qs` | Returns a string, joining arguments with `' '` (space). |
| `Calc` | A safe wrapper for the CSS `calc()` function. |
| `Clamp`| A safe wrapper for the CSS `clamp()` function. |
| `Min` | A safe wrapper for the CSS `min()` function. |
| `Max` | A safe wrapper for the CSS `max()` function. |
| `Oklch`| A safe wrapper for the CSS `oklch()` color function. |
| `Precise` | A wrapper for `round(value * 10000) / 10000` to prevent floating point errors. |

---

## Setup Utilities

These utilities are designed for use in your `design-system.styl` or the files it imports.

| Utility | Signature | Description |
| :--- | :--- | :--- |
| `dsSetToken` | `(token, value, shouldAllowTokenOverwrites?)` | Registers a token in the system registry. |
| `dsSetTokenAssignment` | `(name, { prop: value, ... })` | Registers a group of properties as an assignment token. |
| `dsSetColorChannelToken` | `(token, value)` | Registers or updates a specific color channel (l, c, h, a) for a token with automatic normalization if needed. |
| `dsResolveFlatEntriesToHash` | `(entries)` | Converts JS-emitted entry lists (e.g., from Vite) into one-level Stylus hashes. |
| `dsAddRule` | `(emitter, scoping?, layer?)` | Registers a mixin as a global CSS rule. |
| `dsColor` | `(base, ...)` | Semantic color adjustment. [See parameters](#dscolor-parameters) |
| `dsSize` | `(step, base?)` | Calculates size values based on modular steps. |
| `dsUseGenerateDeclarationsAtTopLevel` | `(tokensScope?, rulesScope?)` | The **Flush**. Emits all registered items to CSS. |

### dsColor Parameters

`dsColor(base, e?, l?, c?, h?, a?, eRel?, lRel?, cRel?, hRel?, aRel?, lExp?, cExp?)`

| Category | Parameters | Description |
| :--- | :--- | :--- |
| **Base** | `base` | The base color token or variable to adjust. |
| **Semantic** | `e` / `eRel` | Normalized elevation (0-1) or relative delta. |
| **Lightness** | `l` / `lRel` / `lExp` | Normalized, relative delta, or explicit lightness. |
| **Chroma** | `c` / `cRel` / `cExp` | Normalized, relative delta, or explicit chroma. |
| **Hue** | `h` / `hRel` | Explicit hue or relative hue delta. |
| **Alpha** | `a` / `aRel` | Explicit alpha or relative alpha delta. |

`dsColor` returns a `var()` ref when no overrides are provided. Otherwise, it returns an `oklch(from ...)` expression.

For all the details on every util, inspect the [utils source code](../src/system/utils/) (or [get blob](https://github.com/mareszhar/hail-styl/tree/main/src/system/utils))
