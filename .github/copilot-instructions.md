# Project instructions — Coffee Bean Explorer

## Product goal
Build an app that helps users learn about coffee beans through an interactive map. Map locations are linked to coffee-bean information. Include a complete Stripe test-mode demo purchase flow.

## Mandatory technology constraints
- Build the frontend with React and JavaScript JSX (`.jsx` files).
- Do not create `.tsx` or TypeScript files unless the user explicitly changes this requirement.
- Prefer React function components and hooks, following the existing project conventions.
- Preserve the current build tool and routing approach unless a change is necessary and approved.
- Use Stripe test mode only for the demo. Never commit real API keys or use live keys in development.

## Required interaction
1. Read the actual map-data file named `originsg.json` (confirm the exact filename and location before implementation).
2. Clicking a map location opens an information modal/popup for the associated coffee bean.
3. The click awards/increments the configured bean value. Avoid accidental double increments from event bubbling or repeated handlers.
4. When the accumulated bean value reaches the configured threshold, trigger a loading/transition screen.
5. The transition leads to a coffee-bean bag moving into the shopping cart.
6. There are two loading-screen variants. Select the variant from the app's current theme (`light` or `dark`), not from an unrelated heuristic.
7. Provide a demo checkout with order summary, item quantity/price, payment submission, loading state, and clear success/failure/cancel states.
8. Use Stripe test mode. The browser must never receive or use the Stripe secret key. Create/confirm payments through a trusted server endpoint or the appropriate Stripe-hosted checkout flow.
9. Verify the final payment status using Stripe's documented flow; do not treat a redirect or client-side success message alone as proof of payment.

## Engineering rules
- Inspect the repository, package scripts, framework, existing map library, theme system, and `originsg.json` before changing code.
- Do not assume a schema for `originsg.json`; inspect real records and preserve unknown fields.
- Keep map data, bean scoring, theme selection, transition state, modal state, and cart state separate where practical.
- Prefer existing dependencies and established project patterns. Do not add packages without explaining why.
- Use accessible controls, keyboard-operable dialogs, visible focus states, and reduced-motion support.
- Handle missing coordinates, missing bean details, duplicate IDs, and empty data gracefully.
- Keep scoring and threshold values in a named configuration, not magic numbers.
- Avoid duplicate state where it can be derived. Ensure the threshold transition fires once per earning event/threshold crossing.
- Use MUI MCP for MUI documentation/component guidance when relevant; use amCharts MCP only when its charts or mapping capabilities are relevant and compatible with the existing stack.
- Keep Stripe secret keys server-side in environment variables. Provide `.env.example` with placeholder names only; never add real secrets.
- For card entry, prefer Stripe Checkout or Stripe Elements/Payment Element; do not build a form that collects or logs raw card details directly.
- Include test scenarios for successful payment, declined payment, authentication-required flow where supported, cancellation, network/server error, duplicate submission, and retry.
- Use Stripe's official test card documentation; the common successful test card is `4242 4242 4242 4242`, with any valid future expiry and an appropriate test CVC.
- Do not claim an MCP tool was used unless it was actually available and invoked.
- Run relevant lint, type-check, tests, and build scripts if available. Report commands and results honestly.
- Never invent successful test results, API behavior, data fields, or file paths.

## JSX componentization standards
- Keep `App.jsx` as a page-level orchestrator, not a container for all UI markup.
- Create focused components under `src/components/`, generally one named component per `.jsx` file.
- Keep pure configuration, data normalization, formatting, and other reusable non-UI logic under `src/lib/`.
- Pass state and callbacks through props; avoid duplicating domain state in child components.
- Split a component when it has multiple independent visual regions, non-trivial side effects, or exceeds roughly 150 lines.
- Extract repeated markup and calculations rather than copying them between JSX files.
- Before adding a component, search for and reuse an existing component with the same responsibility.

## Workflow
1. Inspect and summarize existing architecture.
2. Identify the smallest implementation plan.
3. Implement one coherent slice at a time.
4. Validate with existing project scripts.
5. Summarize changed files, behavior, validation, and remaining assumptions.

## Definition of done
- Frontend source is React JavaScript JSX (`.jsx`), not TypeScript/TSX.
- A map location is associated with a real record from `originsg.json`.
- Clicking it shows the matching bean details and increments the score exactly as intended.
- Threshold behavior is deterministic and does not repeatedly fire due to rerenders.
- Loading variant follows `light` / `dark`.
- Cart transition is usable with reduced motion and has a non-animated fallback.
- Loading/error/empty states are covered.
- Validation results are reported accurately.
