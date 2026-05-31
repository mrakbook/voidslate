# VoidSlate

VoidSlate is a free, source-available Visual Studio Code color theme created by **MrakBook - Boris Karaoglanov**.

- Website: https://mrakbook.com/voidslate
- Contact: [boris@mrakbook.com](mailto:boris@mrakbook.com)
- Created in: California, USA
- License: PolyForm Noncommercial License 1.0.0
- Commercial use: Not permitted without prior written permission

## About

VoidSlate is a Visual Studio Code theme template designed for developers who want a clean, focused editing experience.

You may use, copy, modify, and share VoidSlate for non-commercial purposes under the terms in [`LICENSE.md`](LICENSE.md). Commercial use, resale, paid redistribution, or inclusion in a commercial product or service requires prior written permission from **MrakBook - Boris Karaoglanov**.

## Important license note

Because VoidSlate restricts commercial use, it should be described as **free for non-commercial use** or **source-available**, not as OSI-approved open source.

## Installation

### From the Visual Studio Code Marketplace

After VoidSlate is published:

1. Open Visual Studio Code.
2. Go to **Extensions**.
3. Search for **VoidSlate**.
4. Install the theme.
5. Open **Preferences: Color Theme** and select **VoidSlate**.

### From a VSIX package

```bash
code --install-extension voidslate-0.0.1.vsix
```

### For local development

1. Clone the repository.
2. Open the repository in Visual Studio Code.
3. Press `F5` to launch an Extension Development Host.
4. Select **VoidSlate** as the active color theme.

## Suggested package metadata

Use this as a checklist for your `package.json` metadata. Keep `version` at `0.0.1` until a release version is intentionally assigned, and adjust `publisher` and file paths to match the final repository.

```json
{
  "name": "voidslate",
  "displayName": "VoidSlate",
  "description": "VoidSlate — a free non-commercial Visual Studio Code color theme by MrakBook - Boris Karaoglanov.",
  "version": "0.0.1",
  "publisher": "mrakbook",
  "author": "MrakBook - Boris Karaoglanov",
  "license": "SEE LICENSE IN LICENSE.md",
  "homepage": "https://mrakbook.com/voidslate",
  "repository": {
    "type": "git",
    "url": "https://github.com/mrakbook/voidslate"
  },
  "bugs": {
    "email": "boris@mrakbook.com"
  },
  "categories": ["Themes"],
  "keywords": [
    "voidslate",
    "theme",
    "vscode-theme",
    "visual-studio-code",
    "dark-theme",
    "color-theme"
  ],
  "contributes": {
    "themes": [
      {
        "label": "VoidSlate",
        "uiTheme": "vs-dark",
        "path": "./themes/voidslate-color-theme.json"
      }
    ]
  },
  "engines": {
    "vscode": "^1.80.0"
  }
}
```

## Privacy

VoidSlate is intended to be a theme-only extension and does not intentionally collect, store, sell, or transmit personal data. See [`PRIVACY.md`](PRIVACY.md).

## Support

For support, contact [boris@mrakbook.com](mailto:boris@mrakbook.com) or open a GitHub issue. See [`SUPPORT.md`](SUPPORT.md).

## Contributing

Contributions are welcome for non-commercial development of VoidSlate. By contributing, you agree that your contribution may be included under the same non-commercial license terms. See [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Legal

- [`LICENSE.md`](LICENSE.md) — full license terms
- [`NOTICE.md`](NOTICE.md) — required notices
- [`COMMERCIAL_USE.md`](COMMERCIAL_USE.md) — commercial-use restrictions and permission requests
- [`TRADEMARKS.md`](TRADEMARKS.md) — brand and name usage
- [`DISCLAIMER.md`](DISCLAIMER.md) — warranty and affiliation disclaimer

## Author

VoidSlate was created by **MrakBook - Boris Karaoglanov**.

Website: https://mrakbook.com/voidslate  
Email: [boris@mrakbook.com](mailto:boris@mrakbook.com)  
Made in California, USA.
