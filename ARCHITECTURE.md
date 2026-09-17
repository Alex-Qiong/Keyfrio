# Keyfrio Architecture (v0.3 – Zustand Migration)

## Why this change?

The original `EditorContext.tsx` (~115 KB) was a monolithic Context that mixed domain, playback, UI, history, assets and side-effects. Any state update re-rendered the entire tree.

## Design principles

1. **Domain-sliced Zustand stores** – fine-grained subscriptions
2. **Pure domain functions** in `src/domain/`
3. **Side-effects** in services / hooks, not stores
4. **Immer** for nested immutable updates
5. **Backward-compatible** migration via `StoreBridge`

## Store map

| Store | Responsibility |
|-------|----------------|
| `useProjectStore` | Project, tracks, clips, resolution, fps |
| `usePlaybackStore` | currentTime, isPlaying, speed, loop, in/out |
| `useSelectionStore` | selectedClipIds, activeTrackId |
| `useUiStore` | view, sidebar, zoom, tools, modals |
| `useHistoryStore` | undo / redo (max 50) |
| `useAssetsStore` | media library, project list, offline counts |

## Migration progress

### Phase 1 ✅ Foundation
- Zustand + Immer, six stores, domain helpers, ARCHITECTURE.md

### Phase 2 ✅ Bridge + first components
- `StoreBridge` (context → stores)
- `SidebarTabs`, `Playhead`
- `useHistoryActions`

### Phase 3 ✅ Timeline core (this commit)
| Component | Reads from stores | Writes |
|-----------|-------------------|--------|
| `Playhead` | playback + ui | — |
| `SidebarTabs` | ui | context |
| `TimelineRuler` | project + playback + ui | context (seek) |
| `TimelineContainer` | project + playback + ui | context (addTrack) |
| `TrackHeader` | ui + selection | context |
| `TimelineToolbar` | project + playback + selection + ui | context |

### Phase 4 – Next
- `PreviewPlayer` playback loop
- Inspector tabs
- ClipItem / TrackRow
- Move mutations into store actions → delete Context + Bridge

## Performance tips

```ts
const tracks = useProjectStore((s) => s.tracks);
const zoom = useUiStore((s) => s.zoom);

import { useShallow } from 'zustand/react/shallow';
const { zoom, toolMode } = useUiStore(useShallow((s) => ({
  zoom: s.zoom,
  toolMode: s.toolMode,
})));
```

## File layout

```
src/
  domain/
  stores/
  hooks/useHistoryActions.ts
  components/StoreBridge.tsx
  context/EditorContext.tsx   # legacy
```

## Install after merge

```bash
bun install   # or npm install
bun run dev
```
