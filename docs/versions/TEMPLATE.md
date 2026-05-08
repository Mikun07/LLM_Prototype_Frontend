# vX.Y.Z - Release Title

| Field | Value |
|---|---|
| Release date | YYYY-MM-DD |
| Git tag | `vX.Y.Z` |
| Tagged commit | `commit-sha` |
| Branch at release | `main` |
| Project version | `X.Y.Z` |
| Status | Draft / Stable / Deprecated |

## Summary

Describe what this version represents and why it exists.

## Included Work

| Area | Details |
|---|---|
| Feature | |
| State | |
| API | |
| UI | |
| Tests | |
| Documentation | |

## Important Files

| File | Purpose |
|---|---|
| `path/to/file` | |

## Verification Performed

```bash
npm run type-check
npm run lint
npm run test -- --run
npm audit
npm run build
```

Record any failures, skipped checks, or environment assumptions here.

## Dependency Notes

| Package | Version line | Reason |
|---|---|---|
| `package-name` | `version` | |

## Restore This Version

```bash
git fetch --tags
git switch --detach vX.Y.Z
npm ci
```

To create an editable branch:

```bash
git switch -c work/from-vX.Y.Z vX.Y.Z
npm ci
```

## Known Limitations

| Limitation | Impact |
|---|---|
| | |

## Upgrade Notes

Describe what a developer should know when moving from the previous version to this one.

## Downgrade Notes

Describe what a developer should know when returning from this version to the previous one.

