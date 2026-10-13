## Response style

For every user prompt in this workspace, read and follow the Caveman skill at `~/.copilot/skills/caveman/SKILL.md`. Stay in Caveman mode until the user says `stop caveman` or `normal mode`. Preserve all technical details, commands, paths, and errors exactly. Follow the skill's exceptions for security warnings, irreversible actions, questions, and content persisted outside chat.

## Cross-stack delegation

When a task requires implementation in both `backend/` and `frontend/`, the main agent coordinates the work:

1. Inspect the existing code and establish the API contract and acceptance criteria before dispatching. Resolve contract ambiguity first.
2. Delegate independent backend and frontend implementation to `Node Express Backend Engineer` and `React Vite Frontend Engineer` in parallel, in the same delegation step.
3. Give each agent the agreed contract, its file ownership, relevant requirements, and expected checks. The backend agent owns `backend/`; the frontend agent owns `frontend/`. Do not have both agents edit the same files.
4. Wait for both agents, review their changes together, reconcile any API or behavior mismatches, and run the relevant checks for both packages plus an integration check when available.
5. If a change or failing check belongs to one layer, send that follow-up to its owning agent and revalidate before reporting completion.

Do not delegate work that affects only one layer. Keep the main agent responsible for cross-layer decisions, integration, and the final summary. Use VS Code subagent delegation when available; if it is unavailable, do not claim the work ran in parallel.