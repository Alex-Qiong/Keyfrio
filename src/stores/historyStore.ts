import { create } from 'zustand';
import { Track, Resolution } from '../types/editor';
import { cloneTracks } from '../domain/projectFactory';

export interface HistorySnapshot {
  tracks: Track[];
  resolution: Resolution;
  name: string;
}

const MAX_HISTORY = 50;

export interface HistoryState {
  past: HistorySnapshot[];
  future: HistorySnapshot[];
  canUndo: boolean;
  canRedo: boolean;

  push: (snapshot: HistorySnapshot) => void;
  undo: () => HistorySnapshot | null;
  redo: () => HistorySnapshot | null;
  clear: () => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  past: [],
  future: [],
  canUndo: false,
  canRedo: false,

  push: (snapshot) => {
    const cloned: HistorySnapshot = {
      tracks: cloneTracks(snapshot.tracks),
      resolution: { ...snapshot.resolution },
      name: snapshot.name,
    };
    set((s) => {
      const past = [...s.past, cloned].slice(-MAX_HISTORY);
      return {
        past,
        future: [],
        canUndo: past.length > 0,
        canRedo: false,
      };
    });
  },

  undo: () => {
    const { past, future } = get();
    if (past.length === 0) return null;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, -1);
    set({
      past: newPast,
      future: [previous, ...future],
      canUndo: newPast.length > 0,
      canRedo: true,
    });
    return previous;
  },

  redo: () => {
    const { past, future } = get();
    if (future.length === 0) return null;
    const next = future[0];
    const newFuture = future.slice(1);
    set({
      past: [...past, next],
      future: newFuture,
      canUndo: true,
      canRedo: newFuture.length > 0,
    });
    return next;
  },

  clear: () => set({ past: [], future: [], canUndo: false, canRedo: false }),
}));
