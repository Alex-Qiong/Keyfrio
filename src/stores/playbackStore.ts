import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface PlaybackState {
  currentTime: number;
  isPlaying: boolean;
  playbackSpeed: number;
  loop: boolean;
  inPoint: number | null;
  outPoint: number | null;

  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  stepFrame: (frames: number, fps?: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  setLoop: (loop: boolean) => void;
  setInPoint: (time: number | null) => void;
  setOutPoint: (time: number | null) => void;
}

export const usePlaybackStore = create<PlaybackState>()(
  subscribeWithSelector((set, get) => ({
    currentTime: 0,
    isPlaying: false,
    playbackSpeed: 1,
    loop: false,
    inPoint: null,
    outPoint: null,

    play: () => set({ isPlaying: true }),
    pause: () => set({ isPlaying: false }),
    togglePlay: () => set({ isPlaying: !get().isPlaying }),

    seek: (time) => set({ currentTime: Math.max(0, time) }),

    stepFrame: (frames, fps = 30) => {
      const delta = frames / fps;
      set({ currentTime: Math.max(0, get().currentTime + delta) });
    },

    setPlaybackSpeed: (speed) => set({ playbackSpeed: Math.max(0.1, Math.min(4, speed)) }),
    setLoop: (loop) => set({ loop }),
    setInPoint: (time) => set({ inPoint: time }),
    setOutPoint: (time) => set({ outPoint: time }),
  }))
);
