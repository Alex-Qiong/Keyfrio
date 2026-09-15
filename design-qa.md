# Design QA

Reference: OpenCut light editor screenshot provided by the user.

Prototype target: Keyfrio editor workspace.

Changes checked:

- Shifted editor workspace to a light, minimal visual system.
- Rebalanced the editor into a compact left rail, assets panel, central preview, inspector panel, and large bottom timeline.
- Updated the timeline surface toward OpenCut-style white canvas, light grid lines, narrow ruler, and restrained blue accent.
- Removed the strongest dark-shell contrast from the main editor containers while leaving landing/home branding separate.

Verification:

- `npm run lint` passed with `tsc --noEmit`.
- Local browser verification is blocked in this runtime:
  - `vite` exits with `Bus error` before serving or building.
  - `tsx server.ts` cannot create its IPC pipe in this environment (`listen EPERM`).

final result: blocked

Follow-up needed:

- Re-run `npm run build` and browser QA in a normal Node/Vite environment.
- Compare the rendered editor against the OpenCut screenshot at the same desktop viewport.
