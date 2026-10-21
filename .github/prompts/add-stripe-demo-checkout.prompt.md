---
name: add-stripe-demo-checkout
description: Add a Stripe test-mode demo purchase experience for the coffee-bean app.
---

Inspect the existing project and implement a demo purchase flow that integrates with the map/bean/cart experience.

Requirements:
- Use React + JavaScript JSX (`.jsx`); no TypeScript/TSX.
- Preserve the existing stack and state management unless a change is justified.
- Show cart contents, quantity, item price, total, and a clear demo/test-mode label.
- Use Stripe Checkout or Stripe Elements/Payment Element.
- Use only Stripe test mode. Secret keys remain server-side in environment variables; never commit them.
- Validate product/price and total on the server.
- Handle processing, success, declined payment, cancellation, server/network errors, and retry.
- Prevent accidental duplicate submission/orders and verify the actual Stripe payment result before marking an order paid.
- Add `.env.example` with placeholders only and ensure real env files are ignored by git.
- Include a short README section for setup and test cards.
- Test success using `4242 4242 4242 4242` and a decline scenario using a Stripe-documented test card.
- First inspect whether this repository has a backend. If it has no trusted server, explain and implement the smallest suitable server-side Stripe endpoint or use Stripe Checkout with a trusted server-created session; do not put secret-key operations in the browser.
- Run available checks and report actual outcomes without inventing results.
