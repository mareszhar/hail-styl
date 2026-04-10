# Styling Components

Once your design system is set up, you can start using its tokens and utilities in any component or stylesheet.

## 1. Accessing Tokens

Use `Var()` to access a token's CSS variable. If the token doesn't exist, the engine will throw a helpful error to guide you.

```styl
.button
  background-color: Var('c:primary')
  padding: Var('s:12p')
  border-radius: Var('r:md')
```

If you need the **raw value** of a token (the literal value registered in the engine) instead of its CSS variable reference, use `Val()`:

```styl
// Returns the actual value registered in dsSetToken
@media (max-width: Val('bp:mobile'))
  .button
    padding: Var('s:12p')
```

## 2. Using Token Assignments

If you've registered an assignment group (like typography), use `UseToken()` to emit all its properties at once.

```styl
.text-body
  UseToken('t:body') // will emit associated `prop: Var('token')` declarations

// Or access a specific property from the assignment directly
.text-title
  font-size: Var('t:body:font-size')
```

## 3. UI Utilities

hail-styl includes high-level utilities to speed up common UI patterns.

### 📐 Layout: UseFlex

A full-featured flexbox utility with type safety.

```styl
.container
  UseFlex(ff: 'column', g: 's:16p', jc: 'center', ai: 'stretch')
```

### 🌓 Color: UseContrast

Automatically sets a contrasting `background-color` and `color` pair based on an adjustable pivot point.

```styl
.card-a
  // Sets background-color to c:bg and color to either black or white depending on the lightness of c:bg
  UseContrast('bg', 'c:bg')

.card-b
  // Sets color to c:fg and background-color to either black or white depending on the lightness of c:fg
  UseContrast('fg', 'c:fg')
```

## 4. Local Overwrites

Use `UseVar()` to emit a CSS variable that overwrites an existing token or registers a new one for the current scope.

```styl
.custom-section
  // Locally overwrites the primary color to red for this scope only
  UseVar('c:primary', red)

  .label
    color: Var('c:primary')
```

You can also use it to register a completely new token locally:

```styl
.custom-section
  UseVar('c:new-color', gray)

  .label
    color: Var('c:new-color')
```

> [!TIP]
> Use the `v:` (Variable) domain for local or generic variables that aren't meant to overwrite a global token (e.g., `v:grid-gap`). This prevents accidental collisions with globally registered design roles.
