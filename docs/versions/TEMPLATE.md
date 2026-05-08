# vX.Y.Z - Release Title

| Field | Value |
|---|---|
| Release date | YYYY-MM-DD |
| Git tag | `vX.Y.Z` |
| Tagged commit | `commit-sha` |
| Branch at release | `main` |
| Project version | `X.Y.Z` |
| Tier | [see below] |
| Status | Draft / Stable / Deprecated |

## Tier Classification

Pick exactly one row and mark it.

| Tier | Pattern | This version |
|---|---|---|
| Major baseline | `vX.0.0` — system architecture change, complete rebuild, or new major component | |
| Interface design change | `vX.Y.0` — visible design or flow change, new step, layout rework | |
| Patch | `vX.Y.Z` — package update, config tweak, typo fix, barely-noticeable correction | |

State the tier and what qualifies this version for it in one or two sentences below the table.

## Plain-Language Summary

Explain what this version is, why it exists, and what a non-technical reader can do with it.
Keep this to 3–5 sentences. No jargon.

## What Changed From The Previous Version

| Area | What changed | Why |
|---|---|---|
| | | |

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
| | |

## What Is Not Included Yet

| Missing feature | Expected in which future version |
|---|---|
| | |

## Required Software

| Software | Recommended version | Check command |
|---|---|---|
| Node.js | 20 or later | `node --version` |
| npm | 10 or later | `npm --version` |
| Git | Current stable | `git --version` |
| PowerShell | 5.1 or later | `$PSVersionTable.PSVersion` |

## First-Time Setup

```powershell
git clone https://github.com/Mikun07/LLM_Prototype_Frontend.git
cd LLM_Prototype_Frontend
npm ci
npm run dev
```

Open in your browser:

```text
http://127.0.0.1:5173/
```

Test the interface with the sample file:

```text
examples/sample-requirements.csv
```

## Verify This Version

Run all five checks. All must pass before this version can be tagged.

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
| `npm run type-check` | 0 errors |
| `npm run lint` | 0 errors, 0 warnings |
| `npm run test -- --run` | All tests pass |
| `npm audit` | 0 vulnerabilities |
| `npm run build` | Build succeeds, output in `dist/` |

## Important Files

| File | Purpose |
|---|---|
| `path/to/file` | |

## npm Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Vite dev server on port 5173 |
| `npm run build` | Type-check then production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | ESLint across `.ts` and `.tsx` |
| `npm run type-check` | TypeScript compiler, type errors only |
| `npm run test -- --run` | Vitest single pass |
| `npm run version:list` | List all Git version tags |
| `npm run version:current` | Show current tag or commit |
| `npm run version:use` | Switch to a specific version |

## Restore This Version

View the exact tagged snapshot without changing your branch:

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

| Package | Version | Reason included or changed |
|---|---|---|
| | | |

## Backend Assumption

State whether this version needs the backend running, which URL it expects, and whether any
live API calls are made. Example: "This version uses simulated frontend progress — no
backend is required."

## Known Limitations

| Limitation | Impact |
|---|---|
| | |

## Upgrade Notes

What should a developer know when moving from the previous version to this one?
List any breaking changes, renamed files, or config differences.

## Downgrade Notes

What should a developer know before returning to the previous version?
List anything that would break or be missing after downgrading.

## Recommended Next Work

1. First clear next task.
2. Second clear next task.
3. Any documentation or test updates needed.
