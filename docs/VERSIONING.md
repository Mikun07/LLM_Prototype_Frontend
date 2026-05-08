# Versioning Guide

This guide explains how this project supports upgrade, downgrade, clean-slate restore, and
future version releases.

The current project version is:

```text
package.json version: 2.2.0
stable Git tag: v2.2.0
```

Version 1 remains available as `v1.0.0` for rollback. Version 2 baseline remains available
as `v2.0.0`. All normal adjustments to the version-2 baseline become `v2.1.0`,
`v2.2.0`, `v2.3.0`, and so on until a new major baseline such as `v3.0.0` or `v4.0.0`
is intentionally created.

## Why Versioning Exists

Versioning gives you three guarantees:

| Guarantee | Meaning |
|---|---|
| Restore | You can return to a known working version |
| Compare | You can see what changed between versions |
| Experiment | You can create branches from old versions without damaging them |

For this project, Git tags are the clean checkpoints.

## Core Terms

| Term | Meaning |
|---|---|
| Repository | The project folder tracked by Git |
| Commit | A saved snapshot of tracked files |
| Branch | A movable line of development, such as `main` |
| Tag | A named fixed checkpoint, such as `v2.0.0` |
| Detached HEAD | Viewing an exact tag or commit instead of editing on a branch |
| Clean tree | No uncommitted tracked or untracked files |
| Ignored files | Generated files that Git intentionally does not track |

## Version Model

| Item | Meaning |
|---|---|
| `main` | Latest accepted project state |
| `v2.2.0` | Current version-variation switching and documentation update |
| `v2.1.0` | Version-control policy adjustment on the version-2 baseline |
| `v2.0.0` | Frozen version-2 interface baseline |
| `v1.0.0` | Original environment baseline |
| `v2.1.0`, `v2.2.0`, `v2.3.0` | Future changes based on the version-2 baseline |
| `v3.0.0`, `v4.0.0` | Future major baselines |
| `docs/versions/vX.Y.Z.md` | Detailed document for a version |
| `package.json` version | npm project version for the current stable version |
| `package-lock.json` | Exact dependency versions for reproducible installs |

## Baseline Release Policy

Baseline releases are frozen checkpoints. They must remain restorable.

| Baseline | Meaning | Future work based on it |
|---|---|---|
| `v1.0.0` | Environment and tooling baseline | Use only for rollback or reference |
| `v2.0.0` | First usable interface baseline | Release normal follow-up work as `v2.1.0`, `v2.2.0`, `v2.3.0` |
| `v3.0.0` | Future major baseline | Create only when the project scope changes significantly |
| `v4.0.0` | Later major baseline | Create only when another major scope change is intentionally approved |

Do not rewrite or move baseline tags. If a change modifies the current baseline behavior,
documentation, tests, or interface, release it as the next version in the current major
line. The policy update was `v2.1.0`; this version-variation switching update is
`v2.2.0`; the next normal release should be `v2.3.0`.

## Version Number Rules

This project uses semantic versioning.

| Change type | Example | Use when |
|---|---|---|
| Minor on current baseline | `2.0.0` to `2.1.0`, then `2.2.0` | Normal adjustments, docs, tests, fixes, and backward-compatible features on the version-2 baseline |
| Patch on a released minor | `2.1.0` to `2.1.1` | Emergency correction to an already released minor version, only when a new minor would be too broad |
| Major baseline | `2.2.0` to `3.0.0` | New baseline because architecture, API, workflow, or product scope changes significantly |

Version 2 is a major version because it changes the project from an environment baseline
into a usable frontend interface.

## Available Version Commands

List version tags:

```powershell
npm run version:list
```

Show current tag or commit:

```powershell
npm run version:current
```

Switch to the current version-2 line:

```powershell
npm run version:use -- -Version v2.2.0
```

Switch to the current version-2 line and reinstall dependencies:

```powershell
npm run version:use -- -Version v2.2 -Install
```

Switch to the current version-2 line, remove ignored generated files, and reinstall dependencies:

```powershell
npm run version:use -- -Version 2.2 -CleanIgnored -Install
```

Rollback to version 1:

```powershell
npm run version:use -- -Version v1.0.0 -CleanIgnored -Install
```

Return to latest `main`:

```powershell
npm run version:use -- -Latest -Install
```

Create an editable branch from version 2:

```powershell
npm run version:use -- -Version v2.2 -Branch work/from-v2.2.0 -Install
```

Dry-run a version switch:

```powershell
npm run version:use -- -Version v2.2 -WhatIf
```

## Switching Between Version Variations

You can switch between any existing variation tag, not only between baselines.

Examples:

| From | To | Command |
|---|---|---|
| `v2.0.0` | `v2.1.0` | `npm run version:use -- -Version v2.1 -CleanIgnored -Install` |
| `v2.1.0` | `v2.2.0` | `npm run version:use -- -Version v2.2 -CleanIgnored -Install` |
| `v2.2.0` | `v2.0.0` | `npm run version:use -- -Version v2.0 -CleanIgnored -Install` |
| Future `v1.1.0` | Future `v1.2.0` | `npm run version:use -- -Version v1.2 -CleanIgnored -Install` |

The version helper accepts these equivalent formats when the matching tag exists:

| Input | Resolves to |
|---|---|
| `v2.2.0` | `v2.2.0` |
| `v2.2` | `v2.2.0` |
| `2.2` | `v2.2.0` |

Run this first if you are unsure which variations exist:

```powershell
npm run version:list
```

Every released variation must have its own file in `docs/versions/`, for example
`docs/versions/v2.2.0.md`.

## Version Script Options

The helper script lives at:

```text
scripts/use-version.ps1
```

Options:

| Option | Meaning |
|---|---|
| `-Version vX.Y.Z` | Switch to a specific version tag |
| `-Latest` | Switch to the latest `main` branch |
| `-Branch branch-name` | Create a branch from the selected version |
| `-Fetch` | Fetch remote branches and tags before switching |
| `-CleanIgnored` | Remove ignored generated files with `git clean -fdX` |
| `-Install` | Run `npm ci` after switching |
| `-WhatIf` | Show what would happen without changing files |

Use either `-Version` or `-Latest`, not both.

The script stops if your working tree has uncommitted changes. This protects source files
from being overwritten during a version switch.

## Clean Slate Workflows

### Clean Slate For The Current Version-2 Line

Use this when you want the project to match the current version-2 line and remove generated files:

```powershell
git status
npm run version:use -- -Version v2.2 -CleanIgnored -Install
```

What happens:

| Step | Action |
|---|---|
| Check Git state | Script refuses to continue if work is unsaved |
| Switch version | Git checks out `v2.2.0` |
| Clean ignored files | `node_modules`, `dist`, logs, and caches are removed |
| Install dependencies | `npm ci` installs from the lockfile |

### Clean Slate For Latest Main

Use this when you want the newest documented state:

```powershell
git status
npm run version:use -- -Latest -CleanIgnored -Install
```

### Exact Reset To GitHub Main

Use this only after saving work:

```powershell
git fetch origin --tags --prune
git switch main
git reset --hard origin/main
git clean -fdX
npm ci
```

Warning:

| Command | Risk |
|---|---|
| `git reset --hard origin/main` | Deletes tracked local changes |
| `git clean -fdX` | Deletes ignored generated files |

Run `git status` first.

## Safe Upgrade Workflow

Use this when moving from version 1, the `v2.0.0` baseline, or any older `v2.x` variation
to the current version-2 line.

```powershell
git status
git fetch origin --tags --prune
npm run version:use -- -Version v2.2 -Install
npm run type-check
npm run lint
npm run test -- --run
npm audit
npm run build
```

If all checks pass, your local setup is healthy.

## Safe Downgrade Workflow

Use this when returning to version 1.

```powershell
git status
npm run version:use -- -Version v1.0.0 -CleanIgnored -Install
npm run type-check
npm run lint
npm run test -- --run
npm run build
```

If you plan to edit from version 1, create a branch:

```powershell
npm run version:use -- -Version v1.0.0 -Branch work/from-v1.0.0 -Install
```

Do not edit directly in detached HEAD if you want to keep the changes.

## Creating A Future Version

Use this process only when intentionally releasing a new version.

First choose the release number:

| Situation | Version to create |
|---|---|
| Any normal adjustment or change after `v2.2.0` | `v2.3.0` |
| Next normal adjustment after `v2.3.0` | `v2.4.0` |
| Another normal adjustment after `v2.4.0` | `v2.5.0` |
| Major new baseline after version 2 line | `v3.0.0` |
| Later major baseline after version 3 line | `v4.0.0` |

Use `v2.N.0` for ordinary version-2 baseline work. Use `v3.0.0` or `v4.0.0` only when
you intentionally create a new baseline.

1. Start from `main`.

```powershell
git switch main
git pull origin main
```

2. Create a branch.

```powershell
git switch -c feature/version-work
```

3. Make the code or documentation changes.

4. Update `package.json`.

Example for the next normal change after `v2.2.0`:

```json
"version": "2.3.0"
```

5. Sync the lockfile.

```powershell
npm install --package-lock-only
```

6. Create version documentation.

```powershell
Copy-Item docs\versions\TEMPLATE.md docs\versions\v2.3.0.md
```

7. Fill in the version document.

8. Update `docs/versions/index.md`.

9. Run all checks.

```powershell
npm run type-check
npm run lint
npm run test -- --run
npm audit
npm run build
```

10. Commit.

```powershell
git add .
git commit -m "Release v2.3.0"
```

11. Tag.

```powershell
git tag -a v2.3.0 -m "Version 2.3.0"
```

12. Push.

```powershell
git push origin main
git push origin v2.3.0
```

## Version Document Requirements

Every stable version must have a document under `docs/versions/`.

Each version document must include:

| Section | Required content |
|---|---|
| Summary | What the version represents |
| Included work | Features, tooling, docs, dependencies, and config changes |
| Important files | Files a new developer should inspect first |
| Setup steps | How to install and run that exact version |
| Test steps | Commands used to verify it |
| Restore steps | How to return to that version |
| Known limitations | What is missing or risky |
| Baseline relationship | Whether this is a baseline, a v2-line adjustment, or a new major baseline |
| Upgrade notes | What changed from the previous version |
| Downgrade notes | What to know before returning to an older version |
