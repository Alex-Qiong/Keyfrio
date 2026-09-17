# Keyfrio Architecture (v0.2 – Zustand Migration)

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

### Phase 1 ✅ – Foundation
- Add Zustand + Immer
- Create the six stores + domain helpers
- Document architecture
- Keep `EditorContext` fully functional

### Phase 2 ✅ (this commit) – Bridge + first components
- `StoreBridge` mirrors EditorContext → Zustand (one-way during transition)
- `SidebarTabs` reads from `useUiStore` (writes still via context)
- `Playhead` fully on Zustand (`usePlaybackStore` + `useUiStore`)
- `useHistoryActions` helper for future store-owned undo
- App mounts `<StoreBridge />` in all views

### Phase 3 – Gradual component migration
- Timeline toolbar / ruler / clips → stores
- PreviewPlayer / Inspector tabs → stores
- Prefer `useShallow` when selecting multiple fields

### Phase 4 – Retire EditorContext
- Move all mutations into store actions + services
- Delete `StoreBridge` and `EditorContext`
- History owned exclusively by `useHistoryStore`

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

## File layout

```
src/
  domain/                 # pure functions, no React
    projectFactory.ts
    clipOps.ts
  stores/                 # Zustand slices
    projectStore.ts
    playbackStore.ts
    selectionStore.ts
    uiStore.ts
    historyStore.ts
    assetsStore.ts
    index.ts
  hooks/
    useHistoryActions.ts  # undo helpers for store-era mutations
  components/
    StoreBridge.tsx       # temporary context → store sync
  context/                # legacy – to be removed in Phase 4
    EditorContext.tsx
```

## How StoreBridge works

```
EditorContext (source of truth for mutations)
       │
       ▼  useEffect mirrors
Zustand stores (fine-grained reads for migrated components)
```

Migrated components **read** from stores and still **write** through `useEditor()` until the corresponding mutation is moved into a store action.

## Next steps after merge

1. `bun install` / `npm install`
2. Verify Playhead & SidebarTabs still work
3. Migrate TimelineToolbar / TimelineRuler / ClipItem
4. Migrate PreviewPlayer playback loop to `usePlaybackStore`
