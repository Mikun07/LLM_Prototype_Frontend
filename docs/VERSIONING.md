# Versioning Guide

This guide explains the version numbering system, the folder structure for version
documents, and the step-by-step process for releasing a new version.

The current project version is:

```text
package.json version: 2.7.0
stable Git tag:       v2.7.0 once this release is tagged
active baseline:      v2.0.0
```

---

## Why Versioning Exists

The goals of this versioning system are:

| Goal | Meaning |
|---|---|
| Traceability | Anyone can see the exact state of the project at any point in its history |
| Restorability | Any version can be restored to a clean, working state |
| Readability | A newcomer should be able to understand the project's progress just by reading the documents |
| Auditability | Every change is recorded, classified, and explained |

---

## Three-Tier Version Model

Every version number follows the pattern `vX.Y.Z`.

| Tier | Pattern | When to use |
|---|---|---|
| **Major baseline** | `vX.0.0` | System architecture has changed significantly — a new major component is introduced, the backend is integrated, or the entire application structure is rebuilt. This creates a frozen checkpoint. |
| **Interface design change** | `vX.Y.0` | A visible design or flow change is made within a baseline — buttons are moved, a new wizard step is added, the colour scheme is redesigned, or a significant component is reworked. The architecture itself has not changed. |
| **Patch** | `vX.Y.Z` | A minimal, barely-noticeable change — a package is updated, a typo is fixed, a config value is tweaked. The design and architecture are unchanged. |

### Examples

| Version | Tier | What it represents |
|---|---|---|
| `v1.0.0` | Major baseline | Initial frontend environment and tooling setup |
| `v2.0.0` | Major baseline | First complete user-facing interface built on top of v1 |
| `v2.1.0` | Interface design change | Version-control policy documented and tooling improved |
| `v2.2.0` | Interface design change | Version variation switching support added |
| `v2.3.0` | Interface design change | Full UI redesign and responsiveness |
| `v2.3.1` | Patch | Example: a dependency update or a label typo fix |
| `v3.0.0` | Major baseline | Example: live backend integration replacing the simulated frontend run |

---

## Folder Structure

Version documents are stored by major version:

```
docs/versions/
  index.md          ← master version history table (update for every release)
  TEMPLATE.md       ← copy this when writing a new version document
  v1/
    v1.0.0.md
    v1.1.0.md       ← added when v1.1.0 is released
  v2/
    v2.0.0.md
    v2.1.0.md
    v2.2.0.md
    v2.3.0.md
    v2.4.0.md       ← added when v2.4.0 is released
  v3/               ← created when v3.0.0 is released
    v3.0.0.md
```

The rule: every released Git tag has exactly one matching document in the correct subfolder,
and an entry in `docs/versions/index.md`.

---

## Core Terms

| Term | Meaning |
|---|---|
| Repository | The project folder tracked by Git |
| Commit | A saved snapshot of tracked files |
| Branch | A movable line of development, such as `main` |
| Tag | A named fixed checkpoint, such as `v2.0.0` |
| Frozen baseline | A major-version tag that must never be moved or rewritten |
| Detached HEAD | Viewing an exact tag or commit without being on a branch |
| Clean tree | No uncommitted tracked changes and no untracked files |

---

## Baseline Freeze Policy

Major baseline tags (`vX.0.0`) are permanent. They must always be restorable.

| Rule | Detail |
|---|---|
| Never move a baseline tag | Do not amend or force-push to a baseline tag |
| Never delete a baseline tag | Even if the code has changed, the tag must remain restorable |
| Build all further work on top | Use `vX.Y.0` versions for changes, not `vX.0.0` |

Current frozen baselines:

| Tag | Meaning |
|---|---|
| `v1.0.0` | Original environment and tooling baseline |
| `v2.0.0` | First complete user-facing interface baseline |

---

## Available Version Commands

List all released version tags:

```powershell
npm run version:list
```

Show which tag or commit is currently checked out:

```powershell
npm run version:current
```

Switch to a specific version:

```powershell
npm run version:use -- -Version v2.3.0
```

Switch, remove generated files, and reinstall dependencies:

```powershell
npm run version:use -- -Version v2.3 -CleanIgnored -Install
```

Return to the latest `main` branch:

```powershell
npm run version:use -- -Latest -Install
```

Create an editable branch from an old version:

```powershell
npm run version:use -- -Version v2.3 -Branch work/from-v2.3.0 -Install
```

Preview a switch without changing any files:

```powershell
npm run version:use -- -Version v2.3 -WhatIf
```

The version helper accepts these equivalent formats when the tag exists:

| Input | Resolves to |
|---|---|
| `v2.3.0` | `v2.3.0` |
| `v2.3` | `v2.3.0` |
| `2.3` | `v2.3.0` |

---

## Version Script Options

The helper script lives at `scripts/use-version.ps1`.

| Option | Meaning |
|---|---|
| `-Version vX.Y.Z` | Switch to a specific version tag |
| `-Latest` | Switch to the latest `main` branch |
| `-Branch name` | Create a new editable branch from the selected version |
| `-Fetch` | Fetch remote branches and tags before switching |
| `-CleanIgnored` | Remove ignored generated files with `git clean -fdX` |
| `-Install` | Run `npm ci` after switching |
| `-WhatIf` | Show what would happen without making any changes |

Use either `-Version` or `-Latest`, not both. The script stops if your working tree has
uncommitted changes to protect source files from being overwritten.

---

## How To Release A New Version

Follow these steps in order. Do not skip any step.

### 1. Choose the version number

| Situation | Version to create |
|---|---|
| Architecture change or major new component | Increment `X`, set `Y` and `Z` to `0` (e.g. `v3.0.0`) |
| Visible design or flow change within a baseline | Keep `X`, increment `Y`, set `Z` to `0` (e.g. `v2.4.0`) |
| Tiny patch to an already-released minor version | Keep `X` and `Y`, increment `Z` (e.g. `v2.3.1`) |

### 2. Start from a clean main branch

```powershell
git status
git switch main
git pull origin main
```

### 3. Create a working branch

```powershell
git switch -c feature/v2.4.0
```

### 4. Make the code or documentation changes

### 5. Update `package.json`

Change the `"version"` field to match the new version number:

```json
"version": "2.4.0"
```

### 6. Sync the lockfile

```powershell
npm install --package-lock-only
```

### 7. Create the version document

Copy the template into the correct major-version subfolder:

```powershell
Copy-Item docs\versions\TEMPLATE.md docs\versions\v2\v2.4.0.md
```

Fill in every section. A complete document is required before the tag is created.

### 8. Update `docs/versions/index.md`

Add a new row at the top of the version history table.

### 9. Update `README.md`

Update any version references in `README.md` to point to the new version.

### 10. Run all checks

All five must pass with zero errors and zero warnings:

```powershell
npm run type-check
npm run lint
npm run test -- --run
npm audit
npm run build
```

### 11. Commit

```powershell
git add .
git commit -m "Release v2.4.0"
```

### 12. Merge to main

```powershell
git switch main
git merge --no-ff feature/v2.4.0
```

### 13. Tag the release

```powershell
git tag -a v2.4.0 -m "Version 2.4.0"
```

### 14. Push

```powershell
git push origin main
git push origin v2.4.0
```

---

## Restore Workflows

### Restore the current version

```powershell
npm run version:use -- -Version v2.3 -CleanIgnored -Install
```

### Restore the active baseline

```powershell
npm run version:use -- -Version v2.0 -CleanIgnored -Install
```

### Roll back to version 1

```powershell
npm run version:use -- -Version v1.0.0 -CleanIgnored -Install
```

### Exact reset to GitHub main (destructive)

Only use this after saving all local work. It discards tracked and ignored local changes.

```powershell
git fetch origin --tags --prune
git switch main
git reset --hard origin/main
git clean -fdX
npm ci
```

---

## Version Document Requirements

Every version document must include these sections:

| Section | What to write |
|---|---|
| Header table | Release date, tag, commit, branch, version, tier, status |
| Tier classification | Which tier, and one sentence explaining why |
| Plain-language summary | What the version is and what a non-technical reader can do with it |
| What changed | Table of areas, what changed, and why |
| What is included | Full list of features and components in this version |
| What is not included | Missing features and which future version will address them |
| Required software | Versions and check commands |
| First-time setup | Clone, install, and run commands |
| Verify | All five check commands and expected results |
| Important files | Key files a new developer should read |
| Restore | How to return to exactly this version |
| Dependency notes | Any changed or notable packages |
| Backend assumption | Whether the backend is needed and which URL |
| Known limitations | What is missing or could break |
| Upgrade notes | What to know when arriving from the previous version |
| Downgrade notes | What to know before returning to the previous version |
| Recommended next work | Numbered list of the next clear tasks |
