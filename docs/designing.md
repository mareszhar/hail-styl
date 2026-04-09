# Designing your System

Designing involves registering the tokens and rules that form your system's core. This logic typically lives in your `design-system.styl` or files imported by it.

## 1. Registering Tokens

Tokens are the atomic values of your system, such as colors, sizing, and shadows.

```styl
// Register a simple token
dsSetToken('c:accent', #007bff)

// Register a token with automatic light/dark support
dsSetToken('c:bg', dsColor('c:accent', e: 0.05))
dsSetToken('c:fg', dsColor('c:accent', e: 0.95))
```

## 2. Token Assignments

Assignments map a single token name to a group of CSS properties. These are perfect for typography, intricate component states, or reusable style patterns.

```styl
dsSetTokenAssignment('t:body', {
  font-size: 1rem,
  line-height: 1.5,
  color: Var('c:fg')
})
```

## 3. Registering Rules

Rules are Stylus mixins that are emitted globally during the [Flush](https://github.com/mareszhar/hail-styl/blob/main/docs/getting-started.md#3-the-flush) [[get raw]](https://raw.githubusercontent.com/mareszhar/hail-styl/main/docs/getting-started.md). Use them for shared component styles or global resets.

```styl
_emitter
  .card
    padding: Var('s:16p')
    border-radius: Var('r:md')
    UseContrast('bg', 'c:bg')

dsAddRule(_emitter)
```

### Scoping & Layers

- 🎯 **Scoping**: Defaults to `scoped` (emitted under the default selector). Use `unscoped` for global top-level styles.
- 🥞 **Layers**: Controls the order of emission. Default layers include just `reset` and `base`. Customizable via the global `$dsLayers` variable.

```styl
dsAddRule(_reset, scoping: 'unscoped', layer: 'reset')
```

## 4. The Elevation Color System

The `dsColor` utility is the heart of theme-agnostic design in hail-styl.

```styl
dsColor(base, e: 0.5) // Semantic elevation (0 = background, 1 = foreground)
dsColor(base, lRel: 0.1) // Relative Lightness adjustment (+10%)
dsColor(base, cRel: -0.2) // Relative Chroma adjustment (-20%)
```

By using `e` (elevation), you define the semantic "height" of a color. The engine then handles the complexity of adjusting lightness for light and dark modes automatically.
