# Claude Code project guide

Start with `AGENTS.md` and `.github/copilot-instructions.md`. Follow their product requirements and repository-first workflow. Inspect the actual `originsg.json` before assuming its schema. Preserve the existing stack. Implement the flow: map click → bean detail modal and score increment → threshold-triggered theme-specific loading → bean bag into cart. Validate with available project scripts and report actual results.

Frontend constraint: use React + JavaScript JSX (`.jsx`), not TypeScript/TSX unless explicitly requested. Include a Stripe test-mode demo checkout; keep secret keys server-side, use Stripe Checkout or Elements/Payment Element, and implement verified success/failure/cancel/retry states. Never use live keys for demo testing.
