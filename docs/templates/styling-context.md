# Styling Context

A quick guide to styling with the **hail-styl** design system engine.

## hail-styl

### 🛠️ Core Utilities

- `Var('token')`: Access a token's CSS variable. Prefer this for all property values.

```styl
.selector
  color: Var('c:primary')
```

- `Val('token')`: Access a token's raw value.

```styl
@media (max-width: Val('bp:mobile'))
  .selector
    color: Var('c:primary')
```

- `UseVar('token', value, mode)`: Emit a CSS variable declaration with a scoped override for a known token, or pass mode `'set'` to also locally register the token.

```styl
.selector
  UseVar('c:primary', acquamarine)
  UseVar('c:holiday-brand', 'red', 'set')
  .nested-selector
    color: Var('c:holiday-brand')
```

- `UseToken('token')`: Emit property-value declarations assigned to a token.

```styl
.selector
  UseToken('t:label')
```

- `UseFlex(ff, g, jc, ai, ac)`: Build flexible layouts with type safety.

```styl
.selector
  UseFlex(column, Var('s:8p'), center, center, center)
```

- `UseContrast('bg'|'fg', 'c:token')`: Emit a contrasting `background-color` and `color` pair.

```styl
.selector
  UseContrast('bg', 'c:bg')
```

- `Qn` (quote joining with nothing), `Qs` (quote joining with spaces), `Uqn` (unquote joining with nothing), `Uqs` (unquote joining with spaces), `Uq` (unquote): Concatenation/Interpolation helpers. Accept any number of arguments and support automatic interpolation.

```styl
.selector
  content: Qs('"c:primary" is:' Val('c:primary'))
```

- `Calc`, `Clamp`, `Min`, `Max`, `Oklch`: Wrappers of CSS built-ins, but with automatic interpolation support. Quote operators to avoid issues with Stylus' greedy pre-computations.

```styl
.selector
  width: Calc(50% '-' Var('s:8p'))
```

### 📐 Design Principles

- **Tokens over Values**: Always prefer styling with tokens over hard-coded values (see [Available Tokens](#available-tokens)).

### 🗺️ Useful References

For more detailed information, refer to the following guides (only fetch if you need additional context to accomplish your task):

- [API Reference](https://raw.githubusercontent.com/mareszhar/hail-styl/main/docs/api-reference.md) &bull; Full list of most important utils to know (lightweight reference with signatures and purposes only, no implementation details).
- [Stylus Help](https://raw.githubusercontent.com/mareszhar/hail-styl/main/docs/stylus-help.md) &bull; Quick reference on avoiding Stlyus quirks (currently only contains notes and examples on how to write `@media` and `@container` queries)
- [Styling Guide](https://raw.githubusercontent.com/mareszhar/hail-styl/main/docs/styling.md) &bull; Further comments and examples of using utils to style components.
- [Principles](https://raw.githubusercontent.com/mareszhar/hail-styl/main/docs/principles.md) &bull; Mental model behind the design system's engine (registries, unified flushing pipepline, elevation system, etc).

If you need to define new tokens, check out the [Design Context](./design-context.md).

---

## Project-Specific Context

### Available Tokens

> **USER: INSERT THE PATH(S) TO YOUR SEMANTIC TOKEN DEFINITIONS HERE.**

### Custom Utilities

> **USER: INSERT THE PATH(S) TO YOUR CUSTOM UTILITIES HERE.**
