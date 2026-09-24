# Contributing

Contribution guide lives in [doc/developers/contributing.md](./doc/developers/contributing.md).

Quick version:

```bash
npm install
npm run check   # lint + type-check
npm test
npm run build
```

`npm run verify-pack` packs the tarball, installs it into a clean project, and
proves `require()`, `import()`, the stylesheet subpath, and `tsc` all resolve.
Run it before proposing anything that touches `package.json` or the build.
