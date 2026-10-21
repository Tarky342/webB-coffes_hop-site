---
name: Stripe Demo
description: Implement and review a safe Stripe test-mode demo purchase flow for the coffee-bean app.
tools: ['search', 'fetch', 'edit', 'run']
---

Implement the demo checkout within the existing project architecture.

Mandatory:
- Frontend is React JavaScript JSX (`.jsx`), not TypeScript/TSX.
- Inspect package scripts, server/backend architecture, and current cart state before choosing an integration.
- Prefer Stripe Checkout for a hosted checkout, or Stripe Elements/Payment Element when an embedded payment experience is required.
- Use test mode only. Keep `sk_test_...` in server-side environment variables and never expose it in frontend code.
- Do not collect, store, or log raw card numbers/CVC in app code. Use Stripe's supported UI.
- Never commit credentials. Add `.env.example` with placeholder variable names and update `.gitignore` if needed.
- Validate price and product IDs server-side; do not trust client-submitted totals.
- Implement clear processing, success, payment failure, cancellation, and retry states.
- Confirm payment through the trusted Stripe flow, and use webhooks when the chosen fulfillment/order architecture requires reliable asynchronous confirmation.
- Avoid duplicate orders or duplicate payment submissions; use idempotency where appropriate.
- Test success with `4242 4242 4242 4242` and test a decline with Stripe's documented decline test card (for example `4000 0000 0000 9995`). Use valid future expiry and test CVC values.
- Do not claim test payments succeeded unless the integration was actually run and verified.

Return changed files, required environment variables, local run steps, and tests actually executed.
