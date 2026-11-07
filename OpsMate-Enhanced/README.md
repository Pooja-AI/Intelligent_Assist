# OpsMate 2.0 — Angular UI Prototype

An **independent demonstration frontend** for a Copilot-inspired enterprise assistant. Based on screenshots of the existing OpsMate AEM Assistant and its Angular/NestJS README.

## Folder layout

```
OpsMate-UI-Prototype/
├── frontend/                 # Standalone Angular 19 prototype
│   ├── src/app/
│   │   ├── app.component.ts   # Workspace and chat interactions
│   │   ├── app.component.html # UI markup
│   │   ├── app.component.css  # Responsive styles
│   │   ├── mock-api.service.ts# Simulated agent/plugin responses
│   │   └── models.ts         # Plugin response contract
│   ├── package.json
│   └── angular.json
├── backend-sample/           # Reference only; no server to run
│   ├── sample-response.json
│   └── integration-notes.md
└── README.md
```

## Prerequisites

- Node.js 20.11+ or 22.x compatible with Angular 19; use a current supported Node 22 release.
- npm
- Internet access for first `npm install` (Angular packages and optional Google font)

## Run on Windows (PowerShell)

```powershell
cd OpsMate-UI-Prototyperontend
npm install
npm start
```

Open **http://localhost:4200/**. The Angular CLI may prompt if port 4200 is in use; specify `npm start -- --port 4300` to use another port.

## Run on macOS / Linux

```bash
cd OpsMate-UI-Prototype/frontend
npm install
npm start
```

## Try these demo scenarios

1. **Check page health** → status card with AEM page metadata.
2. **Analyze logs** → CloudWatch-style log viewer and severity filter.
3. **Query S3 data** → structured table.
4. **Track workflows** → sample progress steps.
5. Switch the **Agent** and **Business Unit** selectors.
6. Start a **New conversation** and reopen it from **Recent conversations**.
7. Open **Plugins**, **Agents**, or **Reports** from the sidebar (informational placeholders).

All results are **synthetic and simulated**. The UI does not connect to AWS, Arize, Okta, Jira, AEM, or any real agent. Chat history is in-memory only and resets on refresh. Reports are placeholders.

## Production integration plan

1. Compare this prototype with your existing Angular version and design system; adapt components rather than copying package versions into your production repo.
2. Confirm real chat endpoint, authentication flow, streaming protocol, and tool response schemas.
3. Replace `MockApiService` with an HTTP integration through the existing NestJS BFF.
4. Add server-side validation, authorization, output sanitization, error states, pagination, and auditability.
5. Implement automated unit/e2e/accessibility tests before rollout.
6. Follow existing ECS CI/CD and internal dependency approvals.

See `backend-sample/integration-notes.md` and `docs/ARCHITECTURE.md`.

## Build

```bash
cd frontend
npm run build
```

Output is under `frontend/dist/opsmate/browser` for this Angular application builder.

## Limitations

This is a **working-source prototype**, not a production-ready replacement. The original OpsMate repositories were not provided; no existing backend code has been altered or reproduced. Dependencies have to be installed before running; no `node_modules` is included in the archive.

## Vanguard-inspired visual theme

The prototype uses a burgundy, warm-white and charcoal visual palette inspired by Vanguard. This is not a verified official brand kit. Review internal brand standards before production use. No existing NestJS backend code is changed.


## Enhanced UI features (Vanguard red theme)

- Primary accent is **#9A0718** (user-selected).
- Vanguard **prototype text wordmark** at `frontend/src/assets/vanguard-wordmark.svg`. This is **not an official logo asset**. Replace it with an approved brand file before production use.
- ChatGPT-inspired conversation sidebar, searchable history, prompt library, export chat as Markdown, regenerate response, copy response, dark/light theme.
- Claude Code-inspired **Developer mode** and code-review prompt (mock response only). No repository access, terminal, AI model, filesystem write, or code execution.
- File attachment picker shows **filename only**. No upload, parsing, or transmission is implemented.
- Existing `backend-sample/` is unchanged; no production backend has been modified.

### Running

From `frontend/`, run `npm install`, then `npm start`. Open `http://localhost:4200`. Node.js 20.11+ or 22+ is recommended for Angular 19.

### Production integration requirements

Implement authenticated streaming APIs, permission-checked tool actions, secure upload/virus scanning, chat persistence, actual LLM/code-tool integration, audit logging, and approved Vanguard brand assets before claiming production feature parity.
