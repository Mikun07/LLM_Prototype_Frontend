# Command Reference

This document explains every project command in plain language.

## Daily Development Commands

| Command | What it does | When to use it |
|---|---|---|
| `npm ci` | Installs dependencies exactly from `package-lock.json` | Fresh clone, clean setup, after switching versions |
| `npm install` | Installs dependencies and may update the lockfile | Only when changing dependencies |
| `npm run dev` | Starts the Vite dev server | While developing the frontend |
| `npm run preview` | Serves the production build locally | After `npm run build` |

## Quality Commands

| Command | What it checks | Should pass before commit? |
|---|---|---|
| `npm run type-check` | TypeScript correctness | Yes |
| `npm run lint` | Code style and static quality rules | Yes |
| `npm run test -- --run` | Runs the test suite once | Yes |
| `npm audit` | Known dependency vulnerabilities | Yes |
| `npm run build` | TypeScript check plus production build | Yes |

## Version Commands

Version `v1.0.0` and `v2.0.0` are frozen baselines. The first ordinary adjustment based
on version 2 is `v2.1.0`. Future ordinary work should be released as `v2.2.0`,
`v2.3.0`, and so on until a new major baseline such as `v3.0.0` is intentionally created.

| Command | What it does |
|---|---|
| `npm run version:list` | Lists all available Git version tags |
| `npm run version:current` | Shows the nearest Git tag, commit, and dirty state |
| `npm run version:use -- -Version v2.1.0` | Switches to the current version-2 line in detached mode |
| `npm run version:use -- -Version v2.1.0 -Install` | Switches to `v2.1.0` and runs `npm ci` |
| `npm run version:use -- -Version v2.1.0 -CleanIgnored -Install` | Restores a clean current version-2-line slate and dependencies |
| `npm run version:use -- -Version v2.0.0 -CleanIgnored -Install` | Restores the frozen version-2 baseline |
| `npm run version:use -- -Version v1.0.0 -CleanIgnored -Install` | Rolls back to the version-1 environment baseline |
| `npm run version:use -- -Latest -Install` | Switches back to `main` and installs dependencies |
| `npm run version:use -- -Version v2.1.0 -Branch work/from-v2.1.0` | Creates an editable branch from the current version-2 line |

## Git Commands

| Command | Meaning |
|---|---|
| `git status` | Shows changed, staged, and untracked files |
| `git log --oneline --decorate -5` | Shows recent commits and tags |
| `git fetch origin --tags --prune` | Updates remote branches and version tags |
| `git switch main` | Moves to the main branch |
| `git switch --detach v2.1.0` | Views the current version-2 line exactly as tagged |
| `git switch --detach v2.0.0` | Views the frozen version-2 baseline exactly as tagged |
| `git switch -c branch-name v2.1.0` | Creates a new editable branch from the current version-2 line |
| `git tag --list` | Lists version tags |
| `git push origin main` | Pushes the main branch to GitHub |
| `git push origin v2.1.0` | Pushes the version `v2.1.0` tag to GitHub |

## Script Details

The `version:use` npm command runs:

```powershell
powershell -ExecutionPolicy Bypass -File ./scripts/use-version.ps1
```

The script accepts these options:

| Option | Required? | Meaning |
|---|---|---|
| `-Version vX.Y.Z` | Required unless `-Latest` is used | Switch to a specific Git tag |
| `-Latest` | Required unless `-Version` is used | Switch to `main` |
| `-Branch branch-name` | Optional | Create a branch from the selected version |
| `-Fetch` | Optional | Fetch latest tags and remote state first |
| `-CleanIgnored` | Optional | Remove ignored generated files with `git clean -fdX` |
| `-Install` | Optional | Run `npm ci` after switching |
| `-WhatIf` | Optional | Show what the script would do without changing files |

The script refuses to switch versions if the working tree has uncommitted tracked or
untracked changes. This protects your work.

## Recommended Command Order

For first setup:

```powershell
npm ci
npm run type-check
npm run lint
npm run test -- --run
npm audit
npm run build
npm run dev
```

For normal development:

```powershell
git status
npm run dev
npm run type-check
npm run lint
npm run test -- --run
```

For a clean version-two restore:

```powershell
git status
npm run version:use -- -Version v2.1.0 -CleanIgnored -Install
```

For returning to latest work:

```powershell
npm run version:use -- -Latest -Install
```
