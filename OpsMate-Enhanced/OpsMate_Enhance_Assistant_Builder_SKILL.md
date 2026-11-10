---
name: enhance-assistant-builder
description: Improve the existing OpsMate Assistant Builder in Claude Code and VS Code into a guided, accessible, business-friendly skill execution experience with truthful progress, permission handling, approval tracking, and safe resume behavior. Use when asked to enhance the OpsMate guide UI or simplify existing agent/plugin onboarding workflows.
---

# OpsMate Assistant Builder — UX and Workflow Enhancement

## Mission

Improve the **existing** OpsMate Assistant Builder (including the `opsmate-guide` plugin if present). Business users should be able to request an agent or plugin, answer plain-language questions, understand permissions, see real execution progress, and resume work. Implement changes **in this repository using Claude Code**. Do not create a new standalone portal, Angular/React/FastAPI app, or new cloud infrastructure.

## Non-negotiable rules

1. **Inspect before editing.** Discover the actual plugin, skills, UI/webview code, event/message handlers, storage, and test setup. The screenshots are examples, not a guarantee of file structure.
2. **Preserve working behavior.** Reuse existing `SKILL.md` instructions and integrations. Avoid duplicating provisioning or deployment logic. Do not rename existing skills or change their contracts without a compatibility plan.
3. **Never fake execution.** Do not mark a step completed without a verified result. Do not use timers, static percentages, fabricated PR links, mock approvals, or simulated AWS resources as real status.
4. **Respect Claude Code's permission boundary.** Never use `bypassPermissions`, `--dangerously-skip-permissions`, unrestricted allowlists, or fabricated approval events. A VS Code webview button cannot automatically authorize a native Claude Code permission request. Only wire approval buttons if the existing host/plugin APIs support a documented, verifiable approval response. Otherwise show clear instructions for completing the native prompt.
5. **Distinguish permissions from business approvals.** Native Claude tool permissions, IAM/cloud authorization, repository permissions, and manager/security approvals are different. Do not claim one grants another.
6. **No unauthorized side effects.** Work in dry-run/planning mode when testing. Never deploy to production, modify IAM, access sensitive data, or execute resource-changing operations without the appropriate authorization and required approvals.
7. **Protect sensitive data.** Do not display secrets, tokens, credentials, private document content, or full raw command output by default. Sanitize logs and validate user input. Do not persist credentials in UI state.
8. **Be honest about limitations.** If the current Claude Code/VS Code integration cannot support a requested interaction, implement the best supported fallback and document the gap.

## Phase 1 — Repository discovery and implementation plan

- Locate the current OpsMate Assistant Builder implementation, including any VS Code webview, `opsmate-guide` plugin, command registration, message passing, session storage, and current UI.
- Discover related skills such as `create-agent`, `onboard-agent`, `provision-agent-kb`, `register-agent`, `setup-kb-ingestion`, `upload-kb-content`, `release-agent-prod`, and plugin-specific skills. Confirm names and paths before referencing them.
- Identify the exact entry points and how a user action currently reaches Claude Code or a skill.
- Check supported permission APIs and lifecycle events in the installed versions of Claude Code and the VS Code extension. Do not assume a permission API exists.
- Produce a short plan listing files to edit, behavior to preserve, UI states, tests, and unsupported capabilities. Then implement the plan.

## Phase 2 — Guided, non-technical onboarding

Replace dense technical instructions with a wizard that asks one relevant question at a time:

1. **Choose task:** Create agent, onboard existing agent, add knowledge, add a skill/plugin, resume existing work.
2. **Describe outcome:** Agent/plugin name, business purpose, department, example questions, and expected results.
3. **Choose sources:** Approved documents, S3, logs, Jira, database, or other sources that are actually supported by installed skills.
4. **Choose access:** Business roles or groups; translate to technical identifiers only through validated configuration.
5. **Review:** Show a human-readable summary, environment, planned changes, missing prerequisites, and required approvals.
6. **Execute:** Run the existing skill through supported invocation mechanisms.
7. **Verify:** Show real validation results, artifacts, and next steps.

Requirements:
- Offer suggested answers and examples, with an accessible free-text option.
- Provide Back, Continue, Skip (optional only), Save Progress, Resume, Cancel, and Start Over.
- Validate required inputs and show inline errors without erasing prior answers.
- Use conditional questions; do not ask users for ARNs, repository paths, CLI flags, or infrastructure IDs unless they explicitly select an advanced view and are authorized.
- Map user answers to the existing skill's validated arguments, without silently guessing critical configuration.
- When the user changes an earlier answer, invalidate dependent steps and require revalidation before rerunning side effects.

## Phase 3 — Business-friendly permissions and approvals

Implement a reusable **Action Required** UI state for a pending operation, showing:

- Clear title: e.g. “Permission needed to update agent configuration”.
- What will happen, why it is needed, affected resource and environment, and whether the action is read-only or changes data.
- Risk and impact, including whether it touches production.
- “View Technical Details” for the exact sanitized tool, command, resource, and scope.
- An accurate next action.

**Native Claude Code permission:**
- If a supported native integration exposes a permission request and response, show `Allow Once` / `Deny` and route the decision to that exact request ID after authorization checks. Decisions must be scoped to that operation; prevent replay and stale approvals.
- Otherwise, display “Approve or deny this operation in the Claude Code permission prompt” and show a link/focus action only if supported. Do **not** add inert Allow/Deny buttons.

**External approvals:**
- For IAM, GitHub, security, manager, and production approvals, show `Request Approval` only when an actual supported request mechanism is available.
- If not integrated, show a clear manual handoff and mark the workflow `Waiting for external approval`; never infer approval from a chat message alone.
- Record approver, request identifier, scope, status, and timestamp only when verified by the actual system.

Approval state model: `not_required`, `required`, `requested`, `waiting`, `approved`, `denied`, `expired`, `cancelled`.

## Phase 4 — Real progress and execution states

Create a status tracker driven by real skill/command events and verification results, not elapsed time:

- Checking prerequisites
- Collecting requirements
- Reviewing configuration
- Preparing resources
- Generating or updating files
- Running tests and validation
- Preparing PR or release request
- Deployment / registration (only if explicitly authorized)

Not every skill has every step: derive the actual stages from the selected skill.

Use statuses: `not_started`, `in_progress`, `waiting_for_user`, `waiting_for_approval`, `blocked`, `failed`, `completed`, `cancelled`.

Show current step, completed steps, pending action, and an optional expandable sanitized technical log. Calculate completion only from verifiable completed stages. If a command exits unsuccessfully, mark the stage failed, not completed.

## Phase 5 — Persistence, resume, and recovery

- Use the existing repository/plugin persistence mechanism if suitable; otherwise implement the smallest supported local session store.
- Persist a stable workflow ID, skill identifier/version, sanitized answers, step statuses, pending approvals, verified artifacts, and timestamps. Do not store secrets.
- Support resume after panel reload and Claude session interruption. Detect stale execution state; do not assume a process is still running.
- Reconcile repository files and actual external resource status before retrying.
- Make mutating operations idempotent where possible. Never blindly repeat provisioning, IAM changes, deployments, or PR creation.
- Provide understandable recovery actions: Retry Safe Step, Edit Answer, View Details, Request Help, and Cancel.
- Distinguish a paused workflow from a process that is no longer alive. If true execution resume is unsupported, explain that and restart only from a safe checkpoint after reconciliation.

## Phase 6 — UI polish inside the existing VS Code integration

Use the existing UI technology. Do not add an unrelated framework. Improve the current panel with:

- OpsMate header and Vanguard-inspired accent `#9A0718`, while respecting VS Code theme tokens and accessible contrast.
- Clear welcome and task selection, one-question wizard, contextual help, review screen, progress timeline, and action-required panel.
- A compact overview of the current workflow with “Where am I?” and “What happens next?” actions.
- Context-aware actions: Build New Assistant, Continue, Add Documents, Add Skill, Show Example, Pause/Cancel (only if supported), Start Over.
- Proper disabled states, loading states, keyboard navigation, screen-reader labels, and narrow-panel responsiveness.
- Plain-language primary text; advanced technical details behind expandable controls.
- Prefer one primary user interaction surface. Avoid forcing business users to alternate between the Claude chat and a separate panel except where native Claude Code permissions require it.

## Phase 7 — Skill adapter and action mapping

Create or improve a small mapping layer that describes each discovered skill:

- Skill ID, display name, description, input schema, supported tasks, prerequisites, stages, and safety classification.
- Validation and conversion from business answers to existing skill arguments.
- Invocation through the **currently supported** Claude Code/plugin mechanism, with observable success/failure.
- Mapping of real events/results to UI state.

Start with the existing `create-agent` flow. Do not modify every plugin at once. Keep mappings versioned and extensible to `onboard-agent`, KB, S3, CloudWatch, Jira, and other skills after discovery.

## Phase 8 — Tests and acceptance criteria

Implement or update automated tests for:

1. Wizard input validation, Back/Continue, optional Skip, and review.
2. Mapping business inputs to the actual `create-agent` skill arguments.
3. Permission request displayed correctly; native prompt fallback when no supported callback exists.
4. Denied/expired approval blocks the operation and does not mark it completed.
5. Real execution success/failure correctly updates progress.
6. Reload/resume restores safe state; stale sessions are not represented as active.
7. Edited answers invalidate dependent steps.
8. Retry does not duplicate side effects.
9. UI buttons have real handlers or explicit disabled explanations.
10. Accessibility, theme compatibility, and narrow VS Code panel layout.

Use mocks for external AWS/GitHub effects and keep tests in dry-run mode. Run the repository's available lint, typecheck, unit tests, and build. Report actual commands and results; do not claim tests passed if not run.

## Definition of done

- Existing OpsMate Assistant Builder is noticeably easier for a business user.
- At least one real end-to-end **safe** flow (`create-agent` planning/dry-run) works through the current integration.
- Permission handling is honest and never bypasses Claude Code security.
- Every visible action is functional or explicitly unavailable.
- Progress, approval status, and completion reflect verified events.
- Existing skills and workflows remain compatible.

## Final response required from Claude Code

Provide:

1. Existing architecture discovered and files inspected.
2. Changes implemented, with modified file paths.
3. End-to-end walkthrough of the `create-agent` flow.
4. Which permission interactions are truly integrated and which use native Claude Code fallback.
5. Validation commands and test results.
6. Known limitations and recommended next incremental enhancements.
7. Exact steps to open and test the improved OpsMate Assistant Builder in the current workspace.

Do not stop after writing a design proposal: implement the safe, feasible changes in the existing codebase, then report accurately.
