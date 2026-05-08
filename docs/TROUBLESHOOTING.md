# Troubleshooting Guide

This guide covers common problems when setting up, testing, building, or switching
versions.

## npm command fails with permissions or EPERM

Symptoms may include:

```text
EPERM: operation not permitted
```

Try:

```powershell
Close editors or terminals using the project
Stop running dev servers
npm ci
```

If the issue is caused by files inside `node_modules`, restore a clean dependency install:

```powershell
npm run version:use -- -Latest -CleanIgnored -Install
```

## Git says the repository has dubious ownership

Symptom:

```text
fatal: detected dubious ownership in repository
```

Fix for this exact repo:

```powershell
git config --global --add safe.directory "C:/Users/ayomi/OneDrive/Documents/Thesis Work/LLM_Prototype/Frontend"
```

This tells Git that this local folder is trusted.

## Port 5173 is already in use

Vite may automatically choose another port. Use the URL printed by the terminal.

To find Node processes:

```powershell
Get-Process node
```

To stop a known process ID:

```powershell
Stop-Process -Id PROCESS_ID
```

Replace `PROCESS_ID` with the actual number.

## Dev server starts but API calls fail

The frontend can run without the backend, but real API workflows need the backend.

Check that the backend is running at:

```text
http://localhost:8000
```

The frontend sends `/api/*` requests through the Vite proxy.

## `npm run test` does not exit

Use:

```powershell
npm run test -- --run
```

Without `-- --run`, Vitest may use watch mode and keep running.

## `npm audit` reports vulnerabilities

First check whether vulnerabilities are production dependencies:

```powershell
npm audit --omit=dev
```

If production dependencies are clean but dev dependencies have warnings, review the
advisory before changing package versions.

Avoid:

```powershell
npm audit fix --force
```

unless you understand the breaking changes it may install.

## Version switching script refuses to run

Symptom:

```text
Working tree has uncommitted tracked or untracked changes.
```

Check the files:

```powershell
git status
```

Then choose one:

| Option | Command |
|---|---|
| Save work | `git add .` then `git commit -m "Save work"` |
| Temporarily store work | `git stash push -u` |
| Remove unwanted generated files | `git clean -fdX` |

After the tree is clean, run the version command again.

## You are in detached HEAD after switching to a tag

This is normal when using:

```powershell
npm run version:use -- -Version v1.0.0
```

Detached mode means you are viewing the exact version snapshot.

If you want to edit from that version, create a branch:

```powershell
npm run version:use -- -Version v1.0.0 -Branch work/from-v1.0.0 -Install
```

## Generated files appear in the project root

These files are ignored by Git:

```text
vite.config.js
vite.config.d.ts
tailwind.config.js
tailwind.config.d.ts
*.tsbuildinfo
```

Remove ignored generated files:

```powershell
git clean -fdX
```

This removes ignored files only.

## Need to return to a clean latest setup

Use:

```powershell
git status
npm run version:use -- -Latest -CleanIgnored -Install
```

If you need to exactly match GitHub `main`, only after saving work:

```powershell
git fetch origin --tags --prune
git switch main
git reset --hard origin/main
git clean -fdX
npm ci
```

`git reset --hard` discards tracked local changes.

