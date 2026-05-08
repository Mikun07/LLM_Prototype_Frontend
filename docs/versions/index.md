# Version Documents

| Version | Date | Tag | Commit | Summary |
|---|---|---|---|---|
| [v2.3.0](v2.3.0.md) | 2026-05-08 | `v2.3.0` | Same as tag | UI redesign, responsiveness, custom logo, all warnings fixed |
| [v2.2.0](v2.2.0.md) | 2026-05-08 | `v2.2.0` | Same as tag | Version-variation switching support and documentation |
| [v2.1.0](v2.1.0.md) | 2026-05-08 | `v2.1.0` | Same as tag | Version-control policy adjustment for the v2 line |
| [v2.0.0](v2.0.0.md) | 2026-05-08 | `v2.0.0` | Same as tag | First usable frontend interface |
| [v1.0.0](v1.0.0.md) | 2026-05-08 | `v1.0.0` | `11c0ad0` | Version one frontend environment setup |

## Policy

Every stable Git tag must have a matching document in this folder. Add the document before
creating the tag for new versions so the documentation is part of the released snapshot.

Baseline tags are frozen:

| Baseline | Meaning |
|---|---|
| `v1.0.0` | Environment setup baseline |
| `v2.0.0` | First usable interface baseline |

Going forward, all ordinary changes to the version-2 baseline must be released as
`v2.1.0`, `v2.2.0`, `v2.3.0`, and so on. Do not move `v2.0.0`. Create `v3.0.0` or
`v4.0.0` only when a new major baseline is intentionally created.

## Current Documentation State

The current project version is `2.3.0`. Version `v2.0.0` remains available as the
version-2 baseline, and `v1.0.0` remains available for rollback to the original
environment baseline.
