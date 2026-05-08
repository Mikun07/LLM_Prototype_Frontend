# Testing And Verification Guide

This guide explains how to prove the version-1 frontend environment is healthy.

## Test Philosophy

Version 2 is the first interface baseline. Its test suite covers starter utilities,
CSV parsing, and deterministic report generation. The full testing toolchain is installed
and ready for component and hook coverage as the product grows.

As features are added, tests should grow in these areas:

| Area | Examples |
|---|---|
| Utilities | CSV parsing, CSV export, formatting, grouping |
| Redux slices | Wizard state, analysis run state, pipeline progress |
| Hooks | File upload, polling, filtering, sorting, pagination |
| Components | Upload step, run step, dashboard reports, tables |
| API layer | Mocked upload, start analysis, status polling |

## Run All Required Checks

Use this command set before committing, pushing, or creating a new version:

```powershell
npm run type-check
npm run lint
npm run test -- --run
npm audit
npm run build
```

## Type Checking

Command:

```powershell
npm run type-check
```

What it does:

| Check | Meaning |
|---|---|
| TypeScript strict mode | Catches invalid types and unsafe code |
| No emit | Checks code without writing build files |
| Source and config typing | Ensures `src`, Vite config, and TypeScript config are valid |

Expected result:

```text
tsc --noEmit
```

with no errors.

## Linting

Command:

```powershell
npm run lint
```

What it does:

| Check | Meaning |
|---|---|
| ESLint recommended rules | Catches common JavaScript and TypeScript mistakes |
| React Hooks rules | Catches invalid hook usage |
| React Refresh rule | Keeps Vite React refresh behavior safe |
| No explicit `any` | Enforces the project type-safety rule |

Expected result:

```text
eslint .
```

with no errors.

## Unit Tests

Command:

```powershell
npm run test -- --run
```

What it does:

| Tool | Meaning |
|---|---|
| Vitest | Runs tests |
| jsdom | Provides a browser-like test environment |
| Testing Library | Supports React component tests |
| jest-dom matchers | Adds DOM-specific assertions |

The `-- --run` part tells Vitest to run once and exit. Without it, Vitest may enter watch
mode.

Expected result:

```text
Test Files  1 passed
Tests       2 passed
```

The exact number will increase as the app grows.

## Dependency Audit

Command:

```powershell
npm audit
```

What it does:

| Result | Meaning |
|---|---|
| `found 0 vulnerabilities` | Dependency tree is clean |
| Moderate, high, or critical findings | A dependency should be upgraded or reviewed |

Version 2 currently expects:

```text
found 0 vulnerabilities
```

Do not run `npm audit fix --force` without reviewing the changes. It can install breaking
major versions.

## Production Build

Command:

```powershell
npm run build
```

What it does:

| Step | Meaning |
|---|---|
| `tsc --noEmit` | Confirms TypeScript correctness |
| `vite build` | Creates optimized production files in `dist/` |

Expected result:

```text
vite v6.4.2 building for production...
built
```

The `dist/` folder is generated and should not be committed.

## Preview Build

Command:

```powershell
npm run preview
```

Use this after `npm run build` when you want to open the production build locally.

## Adding New Tests

Put tests under `__tests__/`.

Recommended naming:

| Kind | Example |
|---|---|
| Utility test | `__tests__/utils/csvParser.test.ts` |
| Hook test | `__tests__/hooks/usePagination.test.ts` |
| Component test | `__tests__/components/shared/Button.test.tsx` |
| Redux slice test | `__tests__/store/wizardSlice.test.ts` |

Prefer tests that assert user-visible behavior or pure function output.

Avoid snapshot tests unless there is a strong reason.

Do not call the real backend in tests. Mock API calls instead.

## Troubleshooting Failed Checks

| Failure | First thing to try |
|---|---|
| TypeScript errors | Read the file and line number from the error |
| ESLint errors | Fix the reported rule violation before disabling rules |
| Tests fail after dependency switch | Run `npm ci` |
| Build fails after switching versions | Run `npm run version:use -- -Latest -CleanIgnored -Install` |
| Audit finds vulnerabilities | Check whether they are production or dev dependencies before upgrading |
