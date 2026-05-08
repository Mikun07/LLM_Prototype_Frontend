# Versioning Guide

This frontend uses Git as the source of truth for upgrade, downgrade, and clean-slate
workflows. Each stable version is represented by an annotated tag, and each tag must have
a matching document in `docs/versions/`.

## Version Model

| Item | Meaning |
|---|---|
| `main` | Latest accepted project state |
| `v1.0.0`, `v1.1.0`, `v2.0.0` | Stable snapshots that can be restored at any time |
| `docs/versions/vX.Y.Z.md` | Human-readable document for a tagged version |
| `package.json` version | npm project version matching the latest stable release being prepared |

Version numbers follow semantic versioning:

| Change | Example | Use when |
|---|---|---|
| Patch | `1.0.0` to `1.0.1` | Bug fixes, docs, small internal improvements |
| Minor | `1.0.0` to `1.1.0` | Backward-compatible features |
| Major | `1.0.0` to `2.0.0` | Breaking architecture, API, or workflow changes |

## Quick Commands

List available versions:

```bash
git fetch --tags
npm run version:list
```

Show the version you are currently on:

```bash
npm run version:current
```

Use a specific version in a detached, read-only style checkout:

```bash
npm run version:use -- -Version v1.0.0 -Install
```

Return to the latest `main` version:

```bash
npm run version:use -- -Latest -Install
```

Create a branch from an older version so you can safely edit it:

```bash
npm run version:use -- -Version v1.0.0 -Branch fix/from-v1.0.0 -Install
```

## Clean Slate Workflow

Use this when you want the working directory to match a version without leftover generated
files.

First, protect work you care about:

```bash
git status
git switch -c backup/my-work
git add .
git commit -m "Backup work before version switch"
```

Then switch to a version and remove ignored generated files:

```bash
npm run version:use -- -Version v1.0.0 -CleanIgnored -Install
```

`-CleanIgnored` removes ignored files only, such as `node_modules`, `dist`,
`dev-server.log`, TypeScript build info, and generated config output. It does not remove
tracked source files.

For a full reset to GitHub `main`, use this only after saving your work:

```bash
git fetch origin --tags --prune
git switch main
git reset --hard origin/main
git clean -fdX
npm ci
```

`git reset --hard` discards tracked local changes. `git clean -fdX` removes ignored
generated files. Run `git status` first every time.

## Creating A New Version

1. Make code changes on a branch from `main`.
2. Update the `version` field in `package.json`.
3. Run `npm install --package-lock-only` so `package-lock.json` matches.
4. Copy `docs/versions/TEMPLATE.md` to `docs/versions/vX.Y.Z.md`.
5. Fill in the release date, summary, changed files, tests, known limitations, and
   rollback instructions.
6. Update `docs/versions/index.md`.
7. Run the quality gates:

```bash
npm run type-check
npm run lint
npm run test -- --run
npm audit
npm run build
```

8. Commit the version:

```bash
git add .
git commit -m "Release vX.Y.Z"
```

9. Create an annotated tag:

```bash
git tag -a vX.Y.Z -m "Version X.Y.Z"
```

10. Push both the branch and tag:

```bash
git push origin main
git push origin vX.Y.Z
```

## Rules For Version Documents

Every file in `docs/versions/` should answer these questions:

| Question | Required answer |
|---|---|
| What is this version? | Release summary and scope |
| What changed? | Feature, config, dependency, and documentation changes |
| How was it verified? | Exact commands and results |
| How do I restore it? | Git checkout and install commands |
| What should I watch for? | Known limitations, risks, or compatibility notes |

Keep version documents practical. A future reader should be able to understand why the
version exists, what state it represents, and how to reproduce it without guessing.

