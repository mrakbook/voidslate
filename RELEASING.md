# Releasing VoidSlate

Use this process for public releases of VoidSlate.

## Versioning

Use semantic versioning where practical:

- Patch: small fixes, documentation corrections, minor color adjustments.
- Minor: new theme variants, meaningful palette improvements, accessibility improvements.
- Major: breaking changes, major redesigns, licensing or distribution changes.

VoidSlate keeps a lightweight PLSR-style release helper at `./plsr`. It syncs the root extension package and the icon-theme template package without pulling in the full multi-service platform from VibeguardBot.

Common commands:

```sh
./plsr versions current
./plsr versions bump patch
./plsr versions check
./plsr doctor
./plsr ci release-gate
./plsr package
```

GitHub Actions automation:

- CI runs on pull requests, pushes to `main`/`master`, and manual dispatch. It runs `./plsr doctor`, `./plsr ci check`, packages the VSIX, verifies its contents, and uploads the VSIX artifact.
- CD runs on tags like `v0.1.0` and manual dispatch. It requires the tag/manual version to match `package.json`, runs `./plsr ci release-gate`, packages the VSIX, uploads it to a GitHub Release, and publishes to the Visual Studio Marketplace when `VSCE_PAT` is configured.

## Release checklist

Before releasing:

- Test VoidSlate in Visual Studio Code.
- Check common languages for readable syntax highlighting.
- Update [`CHANGELOG.md`](CHANGELOG.md).
- Bump with `./plsr versions bump patch`, `minor`, or `major`.
- Confirm `./plsr ci release-gate` passes.
- Commit the versioned files and push a matching tag such as `v0.1.0`.
- Confirm the Marketplace display name is **VoidSlate**.
- Confirm the author is **MrakBook - Boris Karaoglanov**.
- Confirm all public documents mention https://mrakbook.com/voidslate and boris@mrakbook.com correctly.
- Confirm no commercial-use permission is accidentally granted.
- Confirm any third-party materials are listed in [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).
- Let GitHub Actions package, attach, and publish the release from the matching tag. For a local artifact, package with `./plsr package`.

## After release

- Verify that the GitHub release contains the generated `.vsix` file.
- Verify that the Marketplace listing displays the correct README, license, changelog, and support information.
- Test installation from the Marketplace.
