# Architecture and design decisions

## Objective

Provide a task-first Copilot-inspired UX while retaining the existing Angular frontend, NestJS backend, Okta auth, AWS ECS deployment, and agent/plugin services.

## Proposed runtime flow

User → Angular Workspace → NestJS experience API (existing) → authorized agent/plugin → normalized versioned response → Angular renderer registry.

The current prototype replaces the API with `MockApiService` and uses a template `ngSwitch` as a minimal component renderer. For production, extract separate Angular components for status, logs, tables, and workflow, registered against an allowlisted response type.

## Plugin envelope

- `schemaVersion`: version compatibility
- `responseType`: allowlisted UI presentation (`text`, `status`, `logs`, `table`, `workflow`)
- `title`, `summary`: accessible plain text
- `data`: schema-specific validated structured data
- `sources`, `requestId`: provenance and traceability

## Security boundaries

- Agent and business-unit dropdowns are context hints, **not authorization**.
- NestJS must derive allowed agents and LOBs from verified Okta identity and roles.
- Never trust LLM-provided HTML, JavaScript, URLs, or executable UI definitions.
- Sanitize/redact sensitive logs and data server-side, enforce row-level access, and cap payload size.
- All mutation actions (cache flush, Jira ticket, etc.) require explicit authorization and confirmation.
- Keep secrets and cloud credentials server-side.

## Nonfunctional targets (proposed; validate with stakeholders)

- Responsive down to mobile widths; keyboard-accessible controls and WCAG 2.2 AA goal.
- Lazy-load heavy data viewers and paginate large results server-side.
- Correlation IDs across UI → NestJS → agent → plugin.
- Preserve user context during navigation and prevent accidental state loss.
- Add empty/error/loading/permission-denied states and observable feedback.

## MVP acceptance criteria

- User can identify key tasks from home without learning agent internals.
- Each of four sample tasks renders a readable specialized result.
- Switching agent and LOB updates demo request context.
- A user can start and reopen an in-memory conversation.
- Layout remains usable on smaller screens.
- Production integration passes auth, permissions, accessibility, and regression tests.

## Suggested roadmap

1. Audit existing Angular components, dependencies, routing, and API contracts.
2. Apply design tokens and workspace shell.
3. Extract typed renderer components and schema validation.
4. Connect one read-only plugin through existing NestJS APIs.
5. Add logging, error states, automated tests, and controlled release.
