# vX.Y.Z - Release Title

| Field | Value |
|---|---|
| Release date | YYYY-MM-DD |
| Git tag | `vX.Y.Z` |
| Tagged commit | `commit-sha` |
| Branch at release | `main` |
| Project version | `X.Y.Z` |
| Baseline relationship | Baseline / v2-line adjustment / new major baseline |
| Status | Draft / Stable / Deprecated |

## Plain-Language Summary

Explain what this version is, why it exists, and what someone can do with it.

## Version Classification

State whether this version is:

| Classification | Use when |
|---|---|
| Baseline | The version creates a frozen checkpoint such as `v2.0.0` or `v3.0.0` |
| v2-line adjustment | The version is normal work after `v2.0.0`, such as `v2.1.0` or `v2.2.0` |
| New major baseline | The version intentionally starts a new major line such as `v3.0.0` or `v4.0.0` |

For ordinary changes after `v2.2.0`, use `v2.3.0`, then `v2.4.0`, then `v2.5.0`.
Do not move the `v1.0.0` or `v2.0.0` baseline tags.

Every variation must be switchable by tag and documented in this folder. The version
helper accepts exact tags and shorthand such as `v2.3`, `2.3`, and `v2.3.0` when the tag
exists.

## Who This Version Is For

| Person | What they can do with this version |
|---|---|
| New developer | |
| Researcher | |
| Maintainer | |
| Reviewer | |

## What Is Included

| Area | Details |
|---|---|
| Project setup | |
| UI | |
| State management | |
| API | |
| Testing | |
| Build tooling | |
| Documentation | |
| Dependencies | |

## What Is Not Included Yet

| Missing feature | Expected future work |
|---|---|
| | |

## Required Software

| Software | Recommended version | Check command |
|---|---|---|
| Node.js | | `node --version` |
| npm | | `npm --version` |
| Git | | `git --version` |
| PowerShell | | `$PSVersionTable.PSVersion` |

## First-Time Setup

```powershell
git clone https://github.com/Mikun07/LLM_Prototype_Frontend.git
cd LLM_Prototype_Frontend
npm ci
npm run dev
```

Open:

```text
http://127.0.0.1:5173/
```

## Verify This Version

```powershell
npm run type-check
npm run lint
npm run test -- --run
npm audit
npm run build
```

Expected results:

| Command | Expected result |
|---|---|
| `npm run type-check` | |
| `npm run lint` | |
| `npm run test -- --run` | |
| `npm audit` | |
| `npm run build` | |

## Important Files

| File | Purpose |
|---|---|
| `path/to/file` | |

## npm Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | |
| `npm run build` | |
| `npm run preview` | |
| `npm run lint` | |
| `npm run type-check` | |
| `npm run test -- --run` | |
| `npm run version:list` | |
| `npm run version:current` | |
| `npm run version:use` | |

## Restore This Version

View the exact tagged snapshot:

```powershell
git fetch --tags
git switch --detach vX.Y.Z
npm ci
```

Restore this version and remove generated files:

```powershell
npm run version:use -- -Version vX.Y.Z -CleanIgnored -Install
```

Create an editable branch from this version:

```powershell
npm run version:use -- -Version vX.Y.Z -Branch work/from-vX.Y.Z -Install
```

Return to latest `main`:

```powershell
npm run version:use -- -Latest -Install
```

## Dependency Notes

| Package | Version line | Reason |
|---|---|---|
| `package-name` | `version` | |

## Backend Assumption

Describe whether this version needs the backend, which URL it expects, and which API
routes it calls.

## Known Limitations

| Limitation | Impact |
|---|---|
| | |

## Upgrade Notes

Explain what a developer should know when moving from the previous version to this one.

## Downgrade Notes

Explain what a developer should know before returning from this version to the previous
one.

## Recommended Next Work

1. Add the next clear task.
2. Add the expected tests.
3. Add any documentation updates.
