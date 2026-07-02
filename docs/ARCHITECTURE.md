# Frontend Architecture

This document describes how the ReqSmell frontend is structured, how its layers relate
to each other, and why key design decisions were made the way they were.

## System Context

The frontend is a browser application. It presents a four-step wizard, communicates
with the backend, and renders analysis reports. It does not call LLM providers directly.

```text
User (browser)
      |
      | HTTP via Vite proxy (dev) or direct (prod)
      v
  React Frontend
      |
      | /api/* requests only
      v
  FastAPI Backend
```

No LLM provider API keys are stored in or passed through the browser.

## Layers

The frontend is divided into five layers.

### 1. Entry and Shell

| File | Role |
|---|---|
| `src/main.tsx` | React root; wraps the app in Redux `Provider` and `React.StrictMode` |
| `src/App.tsx` | Top-level wizard shell; renders `Header`, `WizardStepper`, the active step, and `ToastViewport` |
| `src/index.css` | Global styles and progress bar gradient |

### 2. State (Redux)

All application state lives in three Redux Toolkit slices.

| Slice | File | Owns |
|---|---|---|
| `wizard` | `store/slices/wizardSlice.ts` | Current step, uploaded file metadata, parsed requirements, run configuration, review checkbox |
| `analysis` | `store/slices/analysisSlice.ts` | Run ID, per-pipeline progress, `ModelReport` for each model, `ComparisonReport`, error state |
| `toast` | `store/slices/toastSlice.ts` | Notification queue (max 4 visible, auto-dismissed) |

Slices contain only synchronous reducers. No async logic runs inside a slice.

### 3. Hooks

Side effects and async operations are isolated in custom hooks.

| Hook | Responsibility |
|---|---|
| `useFileUpload.ts` | Drag-drop events, file selection, `uploadCsv()` call, error dispatch |
| `useAnalysisRun.ts` | `startAnalysis()` call, 1 200 ms status polling, progress dispatch, run cancellation |
| `usePagination.ts` | Current page index and page slice calculation |
| `useDownloadCsv.ts` | Converts result rows to a CSV blob and triggers browser download |
| `useTableSearch.ts` | Case-insensitive search across configured row fields |

### 4. Components

Components are split by function.

#### Shared UI (`src/components/shared/`)

General-purpose components used across multiple steps and views.

| Component | Purpose |
|---|---|
| `Button.tsx` | Four variants: `primary`, `secondary`, `ghost`, `danger` |
| `Badge.tsx` | Maps `SmellLabel`, `ConfidenceLevel`, `PipelineStatus`, `AgreementStatus` to readable pills |
| `DataTable.tsx` | Generic sortable table; accepts column definitions and row data |
| `FileDropzone.tsx` | Drag-and-drop upload area with loading and error states |
| `ToastViewport.tsx` | Fixed top-right notification stack |
| `WizardStepper.tsx` | Four-step progress indicator |
| `ProgressBar.tsx` | Wrapper around the native `<progress>` element |
| `StatCard.tsx` | Single-stat display card used in the dashboard summary panel |
| `ReqSmellLogo.tsx` | Inline SVG logo with version label |
| `MetadataGuide.tsx` | Explains the optional `domain`, `type`, and `project` CSV columns |

#### Charts (`src/components/charts/`)

| Component | Modes |
|---|---|
| `BarChart.tsx` | `single`, `stacked`, `grouped` via Recharts |
| `DonutChart.tsx` | Donut with gradient fills via Recharts |

#### Wizard Steps (`src/components/steps/`)

One component per wizard step.

| Component | Step | Responsibility |
|---|---|---|
| `UploadStep.tsx` | 1 | File drop, upload trigger, column detection display, paginated row preview |
| `ConfigureStep.tsx` | 2 | Model toggles, smell type toggles, temperature slider, group size slider, review checkbox |
| `RunStep.tsx` | 3 | Overall and per-pipeline progress cards, cancel button, "View Results" button |
| `DashboardStep.tsx` | 4 | Tab container for Claude report, ChatGPT report, and Comparison report |

#### Dashboard (`src/components/dashboard/`)

Report rendering components used inside `DashboardStep`.

| Component | Purpose |
|---|---|
| `ModelReport.tsx` | Renders a single model report with tabbed sections |
| `ComparisonReport.tsx` | Side-by-side model comparison view |
| `ReportHeader.tsx` | Report title, subtitle, and PDF download button |
| `SummaryPanel.tsx` | Four stat cards: total, smells, clean, smell rate |
| `BreakdownTable.tsx` | Grouped breakdown by domain, requirement type, or smell type |
| `ResultsSection.tsx` | Search input, filter, sort, pagination controls, CSV export, and results table |

### 5. API Client

`src/api/client.ts` is the only file that makes HTTP calls. It exports three functions.

| Function | Calls | Returns |
|---|---|---|
| `uploadCsv(file)` | `POST /api/upload` | `UploadResponse` |
| `startAnalysis(request)` | `POST /api/analyse` | `StartRunResponse` |
| `getRunStatus(runId)` | `GET /api/status/{runId}` | `RunStatusResponse` |

Error messages are normalised here before reaching the store. Components and hooks never
construct API URLs directly.

## Wizard State Machine

The wizard moves forward through four steps. Each step transition is an explicit Redux
action.

```text
upload -> configure -> run -> dashboard
```

| Step | Entry condition | Exit condition |
|---|---|---|
| `upload` | Always available | File uploaded and parsed successfully |
| `configure` | File uploaded | Configuration reviewed checkbox ticked |
| `run` | At least one model and smell type selected | Run reaches `complete` or `error` status |
| `dashboard` | Run complete | User navigates manually; "Start New Run" resets to `upload` |

The `wizard` slice owns the current step. Hooks call `dispatch(setStep(...))` to advance.

## Polling Design

During the `run` step, `useAnalysisRun` polls `GET /api/status/{runId}` every 1 200 ms.

| Event | Action |
|---|---|
| Response received | Dispatch progress updates for all pipelines |
| Status becomes `complete` | Stop polling; dispatch final reports; advance to `dashboard` |
| Status becomes `error` | Stop polling; dispatch error; show error state on Run step |
| HTTP error | Increment error counter; stop polling after threshold |

The interval is cleared on component unmount to prevent state updates on unmounted trees.

## Type Contract

All shared types live in `src/types/index.ts`. They mirror the Pydantic models in
`Backend/app/models.py`. Changes to either file must be reflected in both.

Key types:

| Type | Kind | Used by |
|---|---|---|
| `AmbiguityResult` | Interface | Results tables, model report |
| `InconsistencyResult` | Interface | Results tables, model report |
| `ModelReport` | Interface | Dashboard step, PDF export |
| `ComparisonReport` | Interface | Comparison tab, PDF export |
| `RunStatusResponse` | Interface | Polling hook, analysis slice |
| `AmbiguityType` | Union | Ambiguity results badge, filter |
| `SmellLabel` | Union | Badge component, chart data |
| `ConfidenceLevel` | Union | Badge component, breakdown stats |

## Utilities

| File | Purpose |
|---|---|
| `utils/csvParser.ts` | Client-side CSV parsing via PapaParse; detects column aliases; generates IDs |
| `utils/formatters.ts` | `formatPercentage()`, `formatFileSize()`, `formatModelName()` |
| `utils/reportFactory.ts` | Deterministic report builder used in tests and demo mode |
| `utils/reportPdf.ts` | PDF export via jsPDF: `downloadModelReportPdf()`, `downloadComparisonReportPdf()` |
| `utils/sampleDashboardResult.ts` | Static sample data for development and UI validation |

## Constants

| File | Purpose |
|---|---|
| `constants/appVersion.ts` | App version string imported from `package.json` |
| `constants/pipelines.ts` | Pipeline key definitions and display metadata |

## Build and Proxy

During development, Vite proxies `/api/*` and `/health` to `http://localhost:8000`.
The backend must be running separately. The proxy is configured in `vite.config.ts`.

In production, the built `dist/` folder is served as static files. The hosting
environment must route `/api/*` to the backend separately.

## Design Conventions

| Convention | Reason |
|---|---|
| TypeScript strict mode, no `any` | Catches contract mismatches between frontend and backend types |
| `globalThis` over `window` | Required by ESLint config; works in non-browser environments |
| API calls only in `src/api/client.ts` | Single place to change base URL, headers, or error normalisation |
| Async logic only in hooks | Keeps slices pure and testable without mocking network calls |
| Tailwind utility classes only | No CSS modules or styled-components; consistent with the existing design system |

## Known Constraints

| Constraint | Reason | Acceptable for thesis because |
|---|---|---|
| No auth | Thesis prototype scope | Single-user local deployment assumed |
| 1 200 ms polling | Simplicity over WebSocket | Acceptable latency for thesis evaluation; no realtime requirement |
| No offline mode | Thesis prototype scope | Backend is always local |
| PDF export is client-side only | No server-side rendering | jsPDF covers the thesis reporting need |

## File Map

| Change needed | Start here |
|---|---|
| Change wizard step flow | `store/slices/wizardSlice.ts`, `src/App.tsx` |
| Change upload behaviour | `hooks/useFileUpload.ts`, `components/steps/UploadStep.tsx` |
| Change run polling | `hooks/useAnalysisRun.ts`, `store/slices/analysisSlice.ts` |
| Change a dashboard view | `components/dashboard/`, `components/steps/DashboardStep.tsx` |
| Change shared API types | `src/types/index.ts` (and `Backend/app/models.py`) |
| Change API error handling | `src/api/client.ts` |
| Change PDF export | `utils/reportPdf.ts` |
| Change chart appearance | `components/charts/` |
| Add a toast notification | `store/slices/toastSlice.ts`, call `dispatch(addToast(...))` from a hook |
