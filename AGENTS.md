# Shared AI agent instructions

Read `.github/copilot-instructions.md` for the full product and engineering requirements.

## Repository-first policy
- Inspect files and project scripts before proposing or applying changes.
- Treat source code and data files as authoritative; do not assume framework, JSON schema, file locations, or installed packages.
- The map data is expected to be in `originsg.json`; verify the exact spelling/path in the repository.
- Prefer small, reversible changes and existing conventions.

## Product flow
Map location click → matching coffee-bean detail modal → increment bean value → configured threshold → theme-specific loading screen → bean bag enters cart.

The loading variant is selected by the active `light` or `dark` theme. The score threshold must be configured and the transition must not fire repeatedly from rerenders.

## Quality
- Preserve data integrity; never invent coffee facts.
- Ensure keyboard access, dialog focus behavior, and reduced-motion fallback.
- Run available tests/lint/type-check/build and report only observed results.
- Flag assumptions and missing information explicitly.

## Mandatory frontend and payment constraints
- Frontend must use React + JavaScript JSX (`.jsx`); do not generate `.tsx`/TypeScript unless the user changes this requirement.
- Add a demo checkout flow using Stripe test mode only.
- Use Stripe Checkout or Stripe Elements/Payment Element rather than handling raw card details directly.
- Secret keys stay on the server in environment variables; never expose them in browser code, logs, or committed files.
- The UI must represent processing, success, failure, cancellation, and retry states.
- Verify payment status with the trusted Stripe flow; never infer a paid order solely from a client-side message or redirect.
- Test with Stripe's official test card numbers, including `4242 4242 4242 4242` for a successful card payment.
