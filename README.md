# ReqSmell Frontend

Version one of the ReqSmell frontend environment.

## Version Control

This repository uses Git tags as stable version checkpoints. Version one is tagged as
`v1.0.0`.

Useful commands:

```bash
npm run version:list
npm run version:current
npm run version:use -- -Version v1.0.0 -Install
npm run version:use -- -Latest -Install
```

Detailed versioning instructions are in [docs/VERSIONING.md](docs/VERSIONING.md).
Per-version release documents are in [docs/versions](docs/versions).

## Scripts

```bash
npm install
npm run dev
npm run lint
npm run type-check
npm run test -- --run
npm run build
```

The development server runs at `http://127.0.0.1:5173/` by default.
