---
name: implement-map-bean-flow
description: Implement the map-to-bean-to-cart user flow.
---

Implement the approved map-to-bean-to-cart flow using the existing project's conventions.

Acceptance criteria:
1. Map locations come from the actual `originsg.json` data.
2. Selecting a location opens the matching coffee-bean detail modal.
3. The intended click increments the bean value exactly once.
4. Reaching the configured threshold starts the loading transition once.
5. Loading-screen style is chosen from the current `light` / `dark` theme.
6. The coffee-bean bag transitions into the cart and the final cart state is correct.
7. Empty/invalid records and reduced-motion settings are handled.
8. Add/update focused tests where the repository supports them.
Run relevant checks and report actual outcomes. First inspect existing code; do not replace unrelated files or invent schema.
