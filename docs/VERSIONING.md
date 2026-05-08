# Versioning Guide

This guide explains how this project supports upgrade, downgrade, clean-slate restore, and
future version releases.

The current project version is:

```text
package.json version: 2.0.0
stable Git tag: v2.0.0
```

Version 1 remains available as `v1.0.0` for rollback.

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
| `v2.0.0` | Current interface snapshot |
| `v1.0.0` | Original environment baseline |
| `docs/versions/vX.Y.Z.md` | Detailed document for a version |
| `package.json` version | npm project version for the current stable version |
| `package-lock.json` | Exact dependency versions for reproducible installs |

## Version Number Rules

This project uses semantic versioning.

| Change type | Example | Use when |
|---|---|---|
| Patch | `2.0.0` to `2.0.1` | Bug fixes, small docs, small internal improvements |
| Minor | `2.0.0` to `2.1.0` | Backward-compatible features |
| Major | `1.0.0` to `2.0.0` | Breaking architecture, API, workflow, or product-scope changes |

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

Switch to version 2:

```powershell
npm run version:use -- -Version v2.0.0
```

Switch to version 2 and reinstall dependencies:

```powershell
npm run version:use -- -Version v2.0.0 -Install
```

Switch to version 2, remove ignored generated files, and reinstall dependencies:

```powershell
npm run version:use -- -Version v2.0.0 -CleanIgnored -Install
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
npm run version:use -- -Version v2.0.0 -Branch work/from-v2.0.0 -Install
```

Dry-run a version switch:

```powershell
npm run version:use -- -Version v2.0.0 -WhatIf
```

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

### Clean Slate For Version 2

Use this when you want the project to match version 2 and remove generated files:

```powershell
git status
npm run version:use -- -Version v2.0.0 -CleanIgnored -Install
```

What happens:

| Step | Action |
|---|---|
| Check Git state | Script refuses to continue if work is unsaved |
| Switch version | Git checks out `v2.0.0` |
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

Use this when moving from version 1 to version 2.

```powershell
git status
git fetch origin --tags --prune
npm run version:use -- -Version v2.0.0 -Install
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

Example:

```json
"version": "2.1.0"
```

5. Sync the lockfile.

```powershell
npm install --package-lock-only
```

6. Create version documentation.

```powershell
Copy-Item docs\versions\TEMPLATE.md docs\versions\v2.1.0.md
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
git commit -m "Release v2.1.0"
```

11. Tag.

```powershell
git tag -a v2.1.0 -m "Version 2.1.0"
```

12. Push.

```powershell
git push origin main
git push origin v2.1.0
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
| Upgrade notes | What changed from the previous version |
| Downgrade notes | What to know before returning to an older version |

