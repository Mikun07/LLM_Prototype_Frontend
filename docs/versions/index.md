# Version Index

Every released version has a document in the matching major-version folder.

```
docs/versions/
  v1/          ← all version-1 releases
  v2/          ← all version-2 releases
  v3/          ← created when v3.0.0 is released
  index.md     ← this file
  TEMPLATE.md  ← copy this when creating a new version document
```

## Version History

| Version | Date | Tier | Summary |
|---|---|---|---|
| [v2.6.0](v2/v2.6.0.md) | 2026-05-09 | Interface design change | Frontend connected to backend upload, analysis polling, and HTTP status handling |
| [v2.5.0](v2/v2.5.0.md) | 2026-05-08 | Interface design change | CSV upload preview pagination and frontend policy guard |
| [v2.4.0](v2/v2.4.0.md) | 2026-05-08 | Interface design change | Configure step redesign, version doc restructure, pre-commit version monitoring |
| [v2.3.0](v2/v2.3.0.md) | 2026-05-08 | Interface design change | Full UI redesign, responsiveness, custom logo, all warnings fixed |
| [v2.2.0](v2/v2.2.0.md) | 2026-05-08 | Interface design change | Version-variation switching support and documentation |
| [v2.1.0](v2/v2.1.0.md) | 2026-05-08 | Interface design change | Version-control policy update |
| [v2.0.0](v2/v2.0.0.md) | 2026-05-08 | Major baseline | First complete user-facing interface |
| [v1.0.0](v1/v1.0.0.md) | 2026-05-08 | Major baseline | Frontend environment and tooling setup |

## Three-Tier Version Model

| Tier | Pattern | Meaning | Example |
|---|---|---|---|
| Major baseline | `vX.0.0` | System architecture change — major new component, backend integration, complete rebuild | `v1.0.0`, `v2.0.0`, `v3.0.0` |
| Interface design change | `vX.Y.0` | Visible design or flow change within a baseline — layout, colours, component rework, new wizard step | `v2.1.0`, `v2.3.0` |
| Patch | `vX.Y.Z` | Minimal, barely-noticeable change — package update, typo fix, config tweak | `v2.3.1` |

## Rules

- Every released Git tag must have a matching document in the correct major subfolder before the tag is created.
- Major baseline tags (`vX.0.0`) are frozen — never move or rewrite them.
- Patches (`vX.Y.Z`) are only used for corrections to an already-released minor version, not for new work.
- New major subfolders (`v3/`, `v4/`) are created only when a new `vX.0.0` baseline is released.

## Current State

Current version: `v2.6.0`
Active major baseline: `v2.0.0`
Next expected release: `v2.7.0` (interface design change) or `v2.6.1` (patch, if needed)
