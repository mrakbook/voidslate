# Visual Studio Code Marketplace Checklist for VoidSlate

Use this checklist before publishing VoidSlate to the Visual Studio Code Marketplace.

## Required or strongly recommended repository files

- [`README.md`](README.md) — Marketplace description and project overview.
- [`LICENSE`](LICENSE) or [`LICENSE.md`](LICENSE.md) — license terms.
- [`CHANGELOG.md`](CHANGELOG.md) — release history.
- [`SUPPORT.md`](SUPPORT.md) — support contact and process.
- [`PRIVACY.md`](PRIVACY.md) — privacy statement.
- [`NOTICE.md`](NOTICE.md) — required non-commercial notices.

## Package metadata checklist

Check `package.json` before publishing:

- `name`: `voidslate`
- `displayName`: `VoidSlate`
- `publisher`: your Marketplace publisher ID, for example `mrakbook` if available
- `author`: `MrakBook - Boris Karaoglanov`
- `license`: `SEE LICENSE IN LICENSE.md`
- `homepage`: `https://mrakbook.com/voidslate`
- `categories`: `["Themes"]`
- `contributes.themes[0].label`: `VoidSlate`
- `contributes.themes[0].path`: path to the VoidSlate theme JSON file
- `engines.vscode`: the minimum compatible VS Code version

## Publishing commands

Install the publishing tool:

```bash
npm install -g @vscode/vsce
```

Package the extension:

```bash
vsce package
```

Publish the extension:

```bash
vsce publish
```

## Asset checklist

- Use a non-SVG icon such as PNG.
- Do not include user-provided SVG files in Marketplace assets.
- Use HTTPS URLs for images referenced from `README.md` or `CHANGELOG.md`.
- Keep Marketplace keywords/tags under the Marketplace limit.
- Make sure every public-facing document uses the name **VoidSlate**.

## Legal checklist

- Confirm that the theme code was created by MrakBook - Boris Karaoglanov or is properly documented in [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).
- Confirm that no third-party theme, palette, icon, font, or template was copied without permission.
- Confirm that commercial-use restrictions are visible in `README.md`, `LICENSE.md`, and `COMMERCIAL_USE.md`.
- Confirm that `package.json` does not use `MIT`, `Apache-2.0`, or another license that allows commercial use.
- Confirm that the Marketplace description does not call VoidSlate "open source" without explaining the non-commercial restriction.

## Suggested Marketplace description

```text
VoidSlate is a free non-commercial Visual Studio Code color theme by MrakBook - Boris Karaoglanov. Use, modify, and share it for non-commercial purposes under the PolyForm Noncommercial License 1.0.0. Commercial use requires prior written permission.
```
