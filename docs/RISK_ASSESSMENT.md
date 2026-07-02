# Risk Assessment (Frontend)

This document identifies risks specific to the frontend of the ReqSmell prototype
and the mitigation strategy for each. Backend and system-level risks are in
`Backend/docs/RISK_ASSESSMENT.md`.

Probability and impact are rated: Very Low / Low / Medium / High / Very High.
Classification combines the two: Critical / High / Medium / Low.

## Technical Risks

### RT-006: Type Contract Mismatch Between Frontend and Backend

| Field | Detail |
|---|---|
| Description | A field is added or changed in `Backend/app/models.py` without updating `src/types/index.ts`, causing silent data loss or runtime errors in the UI |
| Probability | Medium |
| Impact | High |
| Classification | High |
| Mitigation | Both files are documented as a shared contract; the architecture document explicitly cross-references them; TypeScript strict mode catches unexpected `undefined` fields at compile time |
| Residual risk | Manual synchronisation is still required; no automated contract test exists between the two files |

## Security Risks

### RS-005: npm Dependency Vulnerability

| Field | Detail |
|---|---|
| Description | A package in the npm dependency graph contains a known security vulnerability |
| Probability | Medium |
| Impact | Medium |
| Classification | Medium |
| Mitigation | `npm audit` is a required pre-release check; dependency versions are locked in `package-lock.json` |
| Residual risk | Vulnerabilities published after the last audit would not be caught until the next check |

### RS-006: API Key Exposure via Browser

| Field | Detail |
|---|---|
| Description | Provider API keys are accidentally exposed in the browser, either through environment variables bundled into the build or through API responses |
| Probability | Very Low |
| Impact | Very High |
| Classification | Medium |
| Mitigation | The frontend has no `VITE_ANTHROPIC_*` or `VITE_OPENAI_*` environment variables; all provider calls are server-side; the frontend only receives analysis results, never keys |
| Residual risk | Negligible given current architecture; would become a risk if provider calls were ever moved client-side |

## Operational Risks

### RO-001: Development Environment Inconsistency

| Field | Detail |
|---|---|
| Description | The frontend behaves differently on different machines due to Node version differences or package installation issues |
| Probability | Medium |
| Impact | Medium |
| Classification | Medium |
| Mitigation | Minimum Node version is documented in SETUP.md; `npm ci` installs exact locked dependency versions |
| Residual risk | Platform-specific issues (OneDrive sync delays, Windows path issues) may still occur |

### RO-002: Polling Overload on Slow Analysis

| Field | Detail |
|---|---|
| Description | The frontend polls the backend every 1 200 ms; a very large CSV with live LLM calls could run for many minutes and generate many poll requests |
| Probability | Low |
| Impact | Low |
| Classification | Low |
| Mitigation | Acceptable for thesis dataset sizes; poll interval is a constant in `useRunPolling.ts` that can be increased if needed |
| Residual risk | Negligible for intended use |

## Project Risks

### RP-002: Scope Creep

| Field | Detail |
|---|---|
| Description | UI feature additions extend the prototype beyond the thesis scope, consuming time without improving research outcomes |
| Probability | Medium |
| Impact | Medium |
| Classification | Medium |
| Mitigation | Scope boundaries are defined in REQUIREMENTS.md; versioning governance requires each release to justify its tier classification |
| Residual risk | Manageable with discipline |

## Risk Matrix

| Risk | Probability | Impact | Classification |
|---|---|---|---|
| RT-006: Type contract mismatch | Medium | High | High |
| RS-006: API key exposure via browser | Very Low | Very High | Medium |
| RS-005: npm dependency vulnerability | Medium | Medium | Medium |
| RO-001: Development environment inconsistency | Medium | Medium | Medium |
| RP-002: Scope creep | Medium | Medium | Medium |
| RO-002: Polling overload | Low | Low | Low |

## Accepted Risks

| Risk | Reason accepted |
|---|---|
| RO-002: Polling overload | Thesis datasets are small and sessions are short |
| RS-006: API key exposure via browser | Architecture guarantees no keys reach the frontend; risk only materialises if the architecture changes |
