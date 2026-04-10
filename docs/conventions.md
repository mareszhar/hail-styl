# Conventions

## Utils

We call all functions and mixins 'utils'.

```styl
// helpers and setup utils (narrow scope)
dsFunctionName()
dsUseMixinName()

// kit utils (wide scope)
FunctionName()
UseMixinName()
```

Note how we:

- Always distinguish between functions and mixins with the `Use` keyword before the mixin name.
- Always use camelCase and `ds` prefix for helper utils.
- Always use PascalCase and no `ds` prefix for kit utils.

Utils in the library live in `/src/system/utils`, and are grouped by kind and domain. There is an arbitrary number of domains (eg: color, size, layout, etc.), and 3 kinds of utils: `setup`, `helpers`, and `kit`.

The name of the file hosting a util denotes its kind and domain: `kind-domain.styl`:

- `helpers-*.styl`: composable utils. used by other utils or to define new ones. not intended for direct use.
- `setup-*.styl`: only needed to set up the design system. not intended for frequent direct use in components.
- `kit-*.styl`: intended for free direct use in components (some are available to helpers and setup utils too).

PS: To see which utils are available to other utils, refer to the import order in `index-system.styl`.

## Variables

All variables use `camelCase` and follow these conventions:

```styl
$dsGlobalVarName = 'value'

dsUtilName(arg1, arg2, ...)
  $localVar = 'value'
  return $localVar
```

Note how we:

- Always use camelCase for variables.
- Always use `$ds` prefix for global variables.
- Always use `$` prefix for local variables.
- Never use any prefix for util parameters. (makes calls like `dsColor(base, e: 0.6)` more ergonomic)

## Tokens

Tokens follow the `domain:name:[suffix]` pattern, and are registered using `dsSetToken` or `dsSetTokenAssignment`.

Each segment must conform to the pattern defined in `$dsTokenSegmentRegex` (by default, segments expect only lowercase letters, numbers, and hyphens, and must not start or end with a hyphen).

Regular tokens may or may not have a suffix (eg: `color:accent:h` and `c:primary` are both valid).

Assignment tokens must not have a suffix (eg: `t:body`). This is because `hail-styl` will derive token definitions for each of the property-value pairs in the assignment token, and use the property name as the suffix for each of the derived tokens (eg: `t:body:font-size`, `t:body:line-height`, etc.)

The `domain` segment must be one of the allowed domains defined in `$dsAllowedTokenDomains`:

```styl
// state.styl
// example:
$dsAllowedTokenDomains ?= 'color',
                          'color-control',
                          'c', // color role
                          'text',
                          't', // text role
                          'size',
                          'size-control',
                          's', // size role
                          'bp', // breakpoint role
                          'r', // radius role
                          'bd', // border role
                          'sd', // shadow role
                          'gd', // gradient role
                          'ts', // transition role
                          'z', // z-index role
                          'o', // opacity role
                          'd-*' // custom domain (eg: component role)
```

Using `*` at the end of a domain allows you to define custom domains that start with a fixed prefix but can later contain any string that conforms to the token segment pattern (eg: `d-button`, `d-card`, etc.)

While this is the default behavior of `dsResolveAllowedTokenDomainRegex()`, it's also possible to set `$dsAllowedTokenDomainRegex = null` to avoid any additional domain validation.
