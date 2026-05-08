# ReqSmell Frontend

Version 1 of the ReqSmell frontend environment.

This repository contains the web client setup for the ReqSmell requirements smell
detection prototype. It is a React, TypeScript, Vite, Redux Toolkit, Tailwind CSS,
Recharts, jsPDF, and Vitest project.

Version 1 is an environment and architecture baseline. It gives future developers a clean,
verified starting point with project scripts, testing tools, version switching, and GitHub
version-control workflow already in place.

## Start Here

If you are new to this project, read these documents in order:

| Document | Use it for |
|---|---|
| [docs/SETUP.md](docs/SETUP.md) | Installing tools, cloning the repo, installing dependencies, and running the app |
| [docs/COMMANDS.md](docs/COMMANDS.md) | Understanding every npm, Git, test, build, and version command |
| [docs/TESTING.md](docs/TESTING.md) | Running checks and understanding what each test command proves |
| [docs/VERSIONING.md](docs/VERSIONING.md) | Upgrading, downgrading, restoring clean slates, and creating future versions |
| [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) | Fixing common setup, npm, Git, Vite, and Windows issues |
| [docs/versions/v1.0.0.md](docs/versions/v1.0.0.md) | Full documentation for version 1 |

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

## Verify The Project

Run these commands before making a pull request or creating a new version:

```powershell
npm run type-check
npm run lint
npm run test -- --run
npm audit
npm run build
```

All five should pass for a clean version-1 environment.

## Version Commands

List available versions:

```powershell
npm run version:list
```

Show the current version or commit:

```powershell
npm run version:current
```

Restore the version-1 clean slate:

```powershell
npm run version:use -- -Version v1.0.0 -CleanIgnored -Install
```

Return to the latest `main` branch:

```powershell
npm run version:use -- -Latest -Install
```

## Important Version-1 Notes

The npm project version remains:

```text
1.0.0
```

The stable version-one Git tag remains:

```text
v1.0.0
```

The documentation on `main` may continue to improve while still describing version 1.
That does not create a new product version unless the package version and Git tag are
intentionally changed.

## Project Structure

| Path | Purpose |
|---|---|
| `src/` | Frontend source code |
| `src/api/` | Backend API client boundary |
| `src/store/` | Redux Toolkit store and slices |
| `src/types/` | Shared TypeScript domain types |
| `src/utils/` | Reusable utility functions |
| `__tests__/` | Vitest test files |
| `docs/` | Setup, testing, command, troubleshooting, and versioning guides |
| `scripts/` | Local helper scripts, including version switching |
| `dist/` | Generated production build output, ignored by Git |
| `node_modules/` | Installed dependencies, ignored by Git |

## Backend Assumption

The frontend expects the backend API to be available at:

```text
http://localhost:8000
```

During local development, Vite forwards frontend `/api/*` requests to the backend through
the proxy configured in `vite.config.ts`.

