# Core Principles

hail-styl is built on three essential concepts that simplify design system management.

## 1. Registry Pattern

In standard Stylus/CSS, defining a style usually emits it immediately. hail-styl decouples this by using **registries** to store your design intent.

When you call `dsSetToken` or `dsAddRule`, you aren't writing CSS; you are adding an entry to a central list. This allows you to:
- 💧 **Define tokens and rules in any order**, regardless of where they are used.
- 🛡️ **Validate every token** used in your styles to catch typos or missing definitions.
- 🧩 **Separate your logic from output** for a cleaner, more modular architecture.

## 2. Unified Flush Pipeline

Since everything is in a registry, the engine can generate all your CSS in one clean pass.

You call `dsUseGenerateDeclarationsAtTopLevel()` exactly **once** in your app's entry point. This "flushes" the registries and:
- 📦 **Emits all design tokens** as CSS variables in a single block.
- 🔢 **Emits rules in the correct order**, respecting your defined layers.
- 🧹 **Prevents duplicate CSS** by centralizing the emission of global rules.

## 3. Semantic Elevation

Instead of maintaining hardcoded "Light" and "Dark" palettes, hail-styl uses an **elevation-based system** via the `dsColor` utility.

Colors are defined with an `e` (elevation) factor from `0` to `1`:
- `e: 0` represents the "base" or background layer.
- `e: 1` represents the "peak" or foreground/text layer.

The engine automatically flips these values based on the current color scheme. In Light mode, `0` is light and `1` is dark. In Dark mode, `0` is dark and `1` is light. This makes theming as simple as defining your brand colors once.
