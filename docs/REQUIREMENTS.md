# Requirements Engineering (Frontend)

This document covers the frontend requirements for the ReqSmell prototype. System-level
requirements and backend requirements are in `Backend/docs/REQUIREMENTS.md`.

## Problem Statement

The frontend is the researcher's primary interface for:

- Uploading a requirements CSV
- Configuring which models and smell types to run
- Monitoring pipeline progress in real time
- Reviewing per-requirement classifications and model comparisons
- Exporting results to CSV and PDF

It communicates with the FastAPI backend over `localhost:8000` via a Vite dev proxy.

## User Personas

### Persona 1: Researcher Using the Tool for Thesis Evaluation

| Field | Detail |
|---|---|
| Background | Postgraduate student in software engineering |
| Goal | Upload a dataset, start analysis, review results, export for thesis |
| Technical proficiency | Comfortable with browser-based tools |
| Success criteria | Can complete a full analysis run without reading source code |

### Persona 2: Developer Maintaining or Extending the Frontend

| Field | Detail |
|---|---|
| Background | Software developer familiar with TypeScript and React |
| Goal | Understand the component and state structure, run tests, and safely add features |
| Technical proficiency | High |
| Success criteria | Can set up, run, test, and extend the frontend using only the documentation |

## User Stories

### Core

| ID | Story |
|---|---|
| US-001 | As a researcher, I want to upload a CSV file of requirements so that the system can analyse them |
| US-002 | As a researcher, I want to select which models and smell types to run so that I can control the analysis scope |
| US-003 | As a researcher, I want to see real-time progress during analysis so that I know the system is working |
| US-004 | As a researcher, I want to see per-requirement smell classifications so that I can assess LLM detection accuracy |
| US-005 | As a researcher, I want to compare Claude and ChatGPT results side by side so that I can evaluate inter-model agreement |
| US-006 | As a researcher, I want to export results to CSV so that I can use them in further analysis |
| US-007 | As a researcher, I want to export results to PDF so that I can include them in the thesis submission |

### Configuration

| ID | Story |
|---|---|
| US-008 | As a researcher, I want to set the LLM temperature so that I can control output determinism |
| US-009 | As a researcher, I want to set the maximum group size for inconsistency analysis so that I can manage token costs |

## Functional Requirements (Frontend)

Requirements FR-001 to FR-014 and FR-017 are implemented in the backend. The frontend
drives them through the wizard UI. The two requirements below are implemented entirely
in the frontend.

| ID | Requirement | Implemented in |
|---|---|---|
| FR-015 | The system shall allow result tables to be exported as CSV files | `useDownloadCsv.ts` |
| FR-016 | The system shall allow reports to be exported as PDF files | `reportPdf.ts` |

### Frontend UI Requirements

These are not numbered in the system FR list but are necessary for the frontend to
fulfil the user stories above.

| UI requirement | Implemented in |
|---|---|
| Wizard-based upload step with column detection preview | `UploadStep.tsx`, `uploadSlice.ts` |
| Configuration step for model and smell type selection | `ConfigStep.tsx`, `configSlice.ts` |
| Real-time progress display for each pipeline independently | `RunStep.tsx`, `useRunPolling.ts` |
| Per-requirement results table with label, confidence, type, and explanation | `ResultsTable.tsx`, `ReportStep.tsx` |
| Side-by-side model comparison view | `ComparisonReport.tsx` |
| Toast notifications for API errors | `ToastContainer.tsx`, `toastSlice.ts` |

## Non-Functional Requirements (Frontend)

### Performance

| ID | Requirement |
|---|---|
| NFR-002 | The frontend shall reflect pipeline progress within 2 seconds of a state change on the backend |

### Maintainability

| ID | Requirement |
|---|---|
| NFR-008 | The frontend shall pass TypeScript strict mode, ESLint, and Vitest checks before any release |
| NFR-009 | All API contracts shall be defined in `src/types/index.ts` and kept in sync with `Backend/app/models.py` |

### Usability

| ID | Requirement |
|---|---|
| NFR-013 | A new developer shall be able to set up and run the frontend using only the project documentation |
| NFR-014 | Error messages shown to the user shall describe the problem in plain language |

## Requirements Prioritisation

| Priority | Requirements |
|---|---|
| Must have | FR-015, FR-016, NFR-002, NFR-014 |
| Should have | NFR-008, NFR-009, NFR-013 |
| Could have | PDF export polish, grouped chart variants, animated progress bars |
| Will not have (this version) | Authentication UI, user account management, saved run history UI |

## Acceptance Criteria

| Requirement | Acceptance Criteria |
|---|---|
| FR-015 | Given analysis results are available, when the researcher clicks export CSV, then a file is downloaded containing all result rows |
| FR-016 | Given analysis results are available, when the researcher clicks export PDF, then a formatted report is downloaded |
| NFR-002 | Given a pipeline status changes on the backend, when the frontend next polls, then the progress display updates within 2 seconds |
| NFR-014 | Given an API error occurs, when the error reaches the UI, then a toast message describes the problem in plain language without exposing internal error details |

## Traceability Summary

| Stakeholder need | User story | Requirement | Covered by |
|---|---|---|---|
| Review results | US-004 | FR-015, UI requirements | `ResultsTable.tsx`, `ReportStep.tsx` |
| Compare models | US-005 | UI requirements | `ComparisonReport.tsx` |
| Export results | US-006, US-007 | FR-015, FR-016 | `useDownloadCsv.ts`, `reportPdf.ts` |
| Real-time progress | US-003 | NFR-002 | `useRunPolling.ts`, `RunStep.tsx` |
| Plain-language errors | US-003 to US-007 | NFR-014 | `src/api/client.ts`, `toastSlice.ts` |
