# VoidSlate Icons

A complete flat neon file icon theme for Visual Studio Code, designed to match an ultra-dark VoidSlate UI: black surfaces, violet/magenta/green/cyan/yellow accents, and simple readable glyphs.

Author: MrakBook - Boris Karaoglanov  
https://mrakbook.com  
boris@mrakbook.com

Theme URL: https://mrakbook.com/voidslate

## What is included

- 149 file icons for languages, configs, tools, media, documents, archives, tests, databases, and package managers.
- 134 folder icons, including closed/open variants for common project folders.
- `themes/voidslate-icons.json` with mappings for common file names, extensions, folder names, and language IDs.
- Extension-ready `package.json`.
- `preview.html`, `preview.svg`, and `preview.png` for quick visual review.

## Install locally

1. Copy this folder to your VS Code extensions directory:
   - macOS/Linux: `~/.vscode/extensions/voidslate-icons-0.0.1`
   - Windows: `%USERPROFILE%\.vscode\extensions\voidslate-icons-0.0.1`
2. Reload VS Code.
3. Run **Preferences: File Icon Theme** and choose **VoidSlate Icons**.

## Use in a theme extension

Copy the `icons/` folder and `themes/voidslate-icons.json` into your existing theme extension, then add this to your `package.json`:

```json
"contributes": {
  "iconThemes": [
    {
      "id": "voidslate-icons",
      "label": "VoidSlate Icons",
      "path": "./themes/voidslate-icons.json"
    }
  ]
}
```

## Style notes

The set is intentionally very flat: no gradients, no shadows, no brand logos, and no detailed skeuomorphic shapes. Each icon uses a dark document/folder base plus a bright rail/glyph so it stays readable at 16px in the Explorer.
