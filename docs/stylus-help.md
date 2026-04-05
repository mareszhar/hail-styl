# Stylus Help

Stylus allows for a clean, minimalist syntax.

But, unfortunately, it hasn't been updated in a long time and its implementation is rather quirky.

Using modern CSS features with Stylus and navigating other odd behaviors can be tricky, so here are some helpful tips and tricks.

## Media and Container Queries

Note: For a full demo of these concepts, and more detailed notes, see the [codepen](https://codepen.io/mareszhar/pen/NPRXqgg).

### Overview

Stylus has dedicated support for @media queries, but predates @container queries. It's possible to use both, but Stylus treats the syntax that follows a query differently.

```styl
@media $query // if defined, $query is automatically interpolated

@container { $query } // we must interpolate $query manually by wrapping it in braces

@media screen and (width >= 500px) // fails. stylus expects a `property: value` pair inside the parentheses

@container some-container (width >= 500px) // fails. stylus doesn't demand a `property: value` pair, but gets confused by the `>=` symbol

@media (min-height: 200px) and (max-height: 500px) // works. stylus preserves `and` keyword.

@container (width > 200px) and (width < 500px) // fails. stylus converts `and` to `&&`.

.element
  @media $query // nested media queries work
  @container { $query } // stylus doesn't support nested container queries, even though modern css does
```

If you want a more in-depth explanation of Stylus' quirks in how it processes @media and @container queries, you can check out the dedicated [codepen](https://codepen.io/mareszhar/pen/NPRXqgg) I created. But, to keep things short, in this document I'll skip directly to the best practices for writing queries.

### Best Practices

**1. Define simple queries naturally**

```styl
@media screen and (prefers-color-scheme: dark)

@container some-container (min-width: 700px)
```

**2. Interpolate modern css, variables, and functions with braces and our `Uqn` or `Uqs` functions**

```styl
// Note: always wrap operators in quotes to avoid Stylus' eager evaluation

@media screen and ({ Uqs(width '>' $breakpoint) })

@container ({ Uqs($sizeA '<=' width '<=' $sizeB) })
```

**3. Logical operators can be used naturally in @media, but must be interpolated in @container queries**

```styl
@media screen and ({ Uqs(width '>' $breakpoint) }) and ({ Uqs(height '>' $breakpoint) })

@container ({ Uqs(width '>' $breakpoint) }) { 'and' } ({ Uqs(height '>' $breakpoint) })
```

**4. Remember, @media queries can be nested , but @container queries cannot in Stylus**

```styl
@media $query
  .element
    --change-something: works

.element
  @media $query
    --change-something: works // nested media queries are supported

@container { $query }
  .element
    --change-something: works // only way. nested container queries are not supported
```
