# Security Engineering (Frontend)

This document defines the security considerations for the frontend of the ReqSmell
prototype. Backend security, threat modelling, and asset identification are in
`Backend/docs/SECURITY.md`.

## Scope

The frontend is a browser-based React application. It holds no secrets, makes no
direct calls to LLM providers, and renders only data received from the backend API.
The security posture for the frontend focuses on three concerns:

- Ensuring API keys never reach the browser
- Keeping npm dependencies free of known vulnerabilities
- Handling API errors safely without exposing internal detail to the user

## What the Frontend Does Not Do

| Concern | Status |
|---|---|
| Hold API keys | No `VITE_ANTHROPIC_*` or `VITE_OPENAI_*` variables exist |
| Call Anthropic or OpenAI directly | All LLM calls are server-side |
| Persist user data | No localStorage, sessionStorage, or IndexedDB usage |
| Render server-provided HTML | All data is rendered through React components, not `dangerouslySetInnerHTML` |
| Accept arbitrary user input beyond file upload | Only a CSV file and configuration values are accepted |

## Attack Surface

| Surface | Risk | Control |
|---|---|---|
| File upload (`POST /api/upload`) | Oversized or malicious file sent to backend | Size and type validation happens in the backend; the frontend passes the file as-is |
| Configuration inputs (temperature, group size) | Out-of-range values sent to backend | Backend Pydantic models validate all values; frontend does not need to duplicate backend validation |
| npm dependency graph | Known vulnerability in a package | `npm audit` is a required pre-release check |
| Browser network traffic | API key visible in requests | Backend architecture guarantees no keys are present in any response |

## Secure Coding Requirements

### Input Handling

| Rule | Where enforced |
|---|---|
| File input is typed as `File` and passed directly to `FormData` | `UploadStep.tsx` |
| Configuration values are typed as `number` or `boolean` before dispatch | `configSlice.ts` |
| No user-supplied string is rendered as raw HTML | Enforced by React's default escaping |

### Error Handling

| Rule | Where enforced |
|---|---|
| API errors are caught in `src/api/client.ts` and normalised to a plain message | `client.ts` error handler |
| Normalised error messages are dispatched to the toast slice | `toastSlice.ts` |
| No raw error object or stack trace is shown to the user | Toast messages use the normalised message string only |
| Network errors and non-2xx responses both produce toast notifications | `client.ts` covers both cases |

### Dependency Security

| Rule | Frequency |
|---|---|
| `npm audit` must pass before any frontend release | Pre-release check in `COMMANDS.md` |
| `package-lock.json` is committed so `npm ci` installs exact versions | Enforced by repository policy |

## Security Readiness Review

| Check | Status |
|---|---|
| No API keys in environment variables or build output | Confirmed; no `VITE_*` key variables defined |
| No `dangerouslySetInnerHTML` usage | Confirmed by review |
| API errors produce plain-language toast messages, not raw stack traces | Implemented in `client.ts` and `toastSlice.ts` |
| `npm audit` passing | Required pre-release check |
| `package-lock.json` committed | Enforced |

## Out of Scope for This Version

| Security concern | Reason excluded |
|---|---|
| Authentication UI | Single-user local prototype; backend has no auth layer |
| Content Security Policy headers | Local development only; no server hosting the frontend |
| Subresource integrity for CDN assets | No CDN assets; all dependencies are bundled by Vite |
| Cross-site scripting (stored) | No user content is persisted or served back |
