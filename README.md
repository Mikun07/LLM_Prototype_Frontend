# ReqSmell Frontend

Version 2.1 of the ReqSmell frontend.

This repository contains the web client for the ReqSmell requirements smell detection
prototype. It is built with React, TypeScript, Vite, Redux Toolkit, Tailwind CSS,
Recharts, jsPDF, and Vitest.

Version `v2.0.0` is the first usable interface baseline. Version `v2.1.0` keeps that
baseline intact and adds the clarified version-control policy for future adjustments.

## Start Here

If you are new to this project, read these documents in order:

| Document | Use it for |
|---|---|
| [docs/SETUP.md](docs/SETUP.md) | Installing tools, cloning the repo, installing dependencies, and running the app |
| [docs/COMMANDS.md](docs/COMMANDS.md) | Understanding every npm, Git, test, build, and version command |
| [docs/TESTING.md](docs/TESTING.md) | Running checks and understanding what each test command proves |
| [docs/VERSIONING.md](docs/VERSIONING.md) | Upgrading, downgrading, restoring clean slates, and creating future versions |
| [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) | Fixing common setup, npm, Git, Vite, and Windows issues |
| [docs/versions/v2.1.0.md](docs/versions/v2.1.0.md) | Full documentation for version 2.1 |
| [docs/versions/v2.0.0.md](docs/versions/v2.0.0.md) | Baseline documentation for version 2 |
| [docs/versions/v1.0.0.md](docs/versions/v1.0.0.md) | Rollback documentation for version 1 |

## Quick Setup

Use this when Node.js, npm, and Git are already installed.

```powershell
git clone https://github.com/Mikun07/LLM_Prototype_Frontend.git
cd LLM_Prototype_Frontend
npm ci
npm run dev
```

Open the app at:

```text
http://127.0.0.1:5173/
```

Stop the dev server with `Ctrl+C` in the terminal where it is running.

You can test the interface with:

```text
examples/sample-requirements.csv
```

## Verify The Project

Run these commands before making a pull request or creating a new version:

```powershell
npm run type-check
npm run lint
npm run test -- --run
npm audit
npm run build
```

All five should pass for a clean version-2 interface.

## Version Commands

List available versions:

```powershell
npm run version:list
```

Show the current version or commit:

```powershell
npm run version:current
```

Restore the current version-2.1 clean slate after the `v2.1.0` tag exists:

```powershell
npm run version:use -- -Version v2.1.0 -CleanIgnored -Install
```

Rollback to version 1:

```powershell
npm run version:use -- -Version v1.0.0 -CleanIgnored -Install
```

Return to the latest `main` branch:

```powershell
npm run version:use -- -Latest -Install
```

## Important Version-2 Notes

The npm project version is:

```text
2.1.0
```

The stable version-two baseline tag is:

```text
v2.0.0
```

The current post-baseline adjustment tag is:

```text
v2.1.0
```

Version 2 contains deterministic frontend preview reports so the dashboard interface can
be reviewed before live backend result integration is completed. It does not call any LLM
API from the browser and does not store uploaded requirement data in browser storage.

## Version Baseline Policy

The project now treats `v1.0.0` and `v2.0.0` as baseline releases.

| Release lane | Meaning |
|---|---|
| `v1.0.0` | Frozen version-1 environment baseline |
| `v2.0.0` | Frozen version-2 interface baseline |
| `v2.1.0`, `v2.2.0`, `v2.3.0` | Normal changes, adjustments, and feature work built from the version-2 baseline |
| `v3.0.0` | Next major baseline when the project scope changes significantly |
| `v4.0.0` | Later major baseline when another major scope change is intentionally created |

Going forward, do not move the `v2.0.0` tag for ordinary changes. Create a new version
such as `v2.1.0` or `v2.2.0` instead.

## Project Structure

| Path | Purpose |
|---|---|
| `src/` | Frontend source code |
| `src/api/` | Backend API client boundary |
| `src/components/` | Custom reusable UI, chart, wizard, and dashboard components |
| `src/constants/` | Shared application constants |
| `src/hooks/` | Custom reusable hooks |
| `src/store/` | Redux Toolkit store and slices |
| `src/types/` | Shared TypeScript domain types |
| `src/utils/` | CSV parsing, formatting, and report-preview utilities |
| `__tests__/` | Vitest test files |
| `docs/` | Setup, testing, command, troubleshooting, and versioning guides |
| `scripts/` | Local helper scripts, including version switching |
| `dist/` | Generated production build output, ignored by Git |
| `node_modules/` | Installed dependencies, ignored by Git |

## Backend Assumption

The frontend API boundary expects the backend API to be available at:

```text
http://localhost:8000
```

During local development, Vite forwards frontend `/api/*` requests to the backend through
the proxy configured in `vite.config.ts`.
