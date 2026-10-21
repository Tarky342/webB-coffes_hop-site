# Gemini project guide

Use `AGENTS.md` and `.github/copilot-instructions.md` as the shared source of truth. Inspect the existing codebase and actual `originsg.json` data before changing code. Do not invent schema or coffee facts. Preserve current conventions, implement the map-to-modal-to-score-to-themed-loading-to-cart flow, respect accessibility and reduced motion, and report only checks actually run.

Frontend constraint: use React + JavaScript JSX (`.jsx`), not TypeScript/TSX unless explicitly requested. Include a Stripe test-mode demo checkout; keep secret keys server-side, use Stripe Checkout or Elements/Payment Element, and implement verified success/failure/cancel/retry states. Never use live keys for demo testing.
