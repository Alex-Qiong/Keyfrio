# Keyfrio Architecture (v0.1 – Zustand Migration)

## Why this change?

The original `EditorContext.tsx` (~115 KB) was a monolithic Context that mixed:

- Domain state (project / tracks / clips)
- Playback state
- Selection
- UI / modal state
- History (undo/redo)
- Assets & persistence
- AI action execution
- File-system / relink side-effects

Any state update re-rendered the entire tree. This is unacceptable for a professional NLE.

## New design principles

1. **Domain-sliced Zustand stores** – fine-grained subscriptions
2. **Pure domain functions** live in `src/domain/` (easy to unit-test)
3. **Side-effects** stay in services / React hooks, never inside pure store logic
4. **Immer** for ergonomic immutable updates on complex nested structures
5. **Backward-compatible** – existing `useEditor()` continues to work while components are gradually migrated

## Store map

| Store | Responsibility |
|-------|----------------|
| `useProjectStore` | Project, tracks, clips, resolution, fps |
| `usePlaybackStore` | currentTime, isPlaying, speed, loop, in/out points |
| `useSelectionStore` | selectedClipIds, activeTrackId |
| `useUiStore` | view routing, sidebar, timeline UI flags, all modals |
| `useHistoryStore` | undo / redo stack (max 50 snapshots) |
| `useAssetsStore` | user media library, project list, offline counts |

## Migration path

### Phase 1 (this PR) – Foundation
- Add Zustand + Immer
- Create the six stores + domain helpers
- Document architecture
- Keep `EditorContext` fully functional

### Phase 2 – Gradual component migration
- Start with pure presentational components (Inspector tabs, Sidebar panels)
- Replace `const { x } = useEditor()` with targeted store selectors:
  ```ts
  const zoom = useUiStore((s) => s.zoom);
  const tracks = useProjectStore((s) => s.tracks);
  ```
- Prefer `useShallow` when selecting multiple fields

### Phase 3 – Retire EditorContext
- Once all consumers are migrated, delete the giant context
- Wire history push automatically on project mutations
- Move AI execution & media import into dedicated services

## Performance tips for contributors

```ts
// ❌ Bad – whole store subscription
const state = useProjectStore();

// ✅ Good – only what you need
const tracks = useProjectStore((s) => s.tracks);
const updateClip = useProjectStore((s) => s.updateClip);

// ✅ Multiple fields with shallow compare
import { useShallow } from 'zustand/react/shallow';
const { zoom, toolMode } = useUiStore(useShallow((s) => ({
  zoom: s.zoom,
  toolMode: s.toolMode,
})));
```

## File layout (new)

```
src/
  domain/           # pure functions, no React
    projectFactory.ts
    clipOps.ts
  stores/           # Zustand slices
    projectStore.ts
    playbackStore.ts
    selectionStore.ts
    uiStore.ts
    historyStore.ts
    assetsStore.ts
    index.ts
  context/          # legacy – to be removed later
    EditorContext.tsx
```

## Next steps after merge

1. `npm install` / `bun install` (zustand + immer added)
2. Start migrating high-traffic components (Timeline, PreviewPlayer, Inspector)
3. Add automatic history snapshots on `projectStore` mutations
4. Extract media import & relink into `src/services/mediaService.ts`
