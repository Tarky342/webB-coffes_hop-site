---
applyTo: "**/*.jsx"
---
# React JSX rules
- Write React components in JavaScript `.jsx` files. Do not use TypeScript, `.tsx`, interfaces, or type annotations.
- Prefer function components and hooks, and follow the repository's established patterns.
- Keep UI, state transitions, and data parsing understandable and testable.
- Ensure dialogs are keyboard accessible, manage focus correctly, and respect `prefers-reduced-motion`.
- Do not fabricate data fields from `originsg.json`; inspect actual records first.
- Use named configuration for bean score thresholds and product prices.
- Keep each JSX file focused on one component or one closely related visual responsibility.
- Keep page orchestration in a small `App.jsx`; place reusable UI in `src/components/` and pure data/config helpers in `src/lib/`.
- Pass data and event handlers through props; do not duplicate business state inside presentational components.
- Extract repeated markup, non-trivial calculations, data normalization, and side effects instead of growing a monolithic component.
- Prefer one component per file with a named export; use a default export only for the route/page entry component.
- Keep component files under roughly 150 lines; split them further when they contain multiple visual regions or independent state.
- Do not mix API calls, domain normalization, and large UI markup in the same component. Put server calls in a hook/service module when they become reusable.
- When adding a JSX component, first check whether an existing component can be extended before creating a duplicate pattern.
