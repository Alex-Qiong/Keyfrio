import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface SelectionState {
  selectedClipIds: string[];
  activeTrackId: string | null;

  selectClip: (clipId: string | null) => void;
  selectClips: (clipIds: string[]) => void;
  toggleClipSelection: (clipId: string) => void;
  clearSelection: () => void;
  setActiveTrackId: (trackId: string | null) => void;

  /** Convenience derived */
  selectedClipId: string | null;
}

export const useSelectionStore = create<SelectionState>()(
  subscribeWithSelector((set, get) => ({
    selectedClipIds: [],
    activeTrackId: 'track-video-1',
    selectedClipId: null,

    selectClip: (clipId) =>
      set({
        selectedClipIds: clipId ? [clipId] : [],
        selectedClipId: clipId,
      }),

    selectClips: (clipIds) =>
      set({
        selectedClipIds: clipIds,
        selectedClipId: clipIds[0] ?? null,
      }),

    toggleClipSelection: (clipId) => {
      const current = get().selectedClipIds;
      const next = current.includes(clipId)
        ? current.filter((id) => id !== clipId)
        : [...current, clipId];
      set({
        selectedClipIds: next,
        selectedClipId: next[0] ?? null,
      });
    },

    clearSelection: () => set({ selectedClipIds: [], selectedClipId: null }),

    setActiveTrackId: (trackId) => set({ activeTrackId: trackId }),
  }))
);
