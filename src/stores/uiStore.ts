import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  AppView,
  TimelineToolMode,
  TimelineTrackHeight,
  SnapGuideInfo,
} from '../types/editor';

export interface UiState {
  // View routing
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  openLanding: () => void;
  openHome: () => void;
  openEditor: () => void;

  // Sidebar
  activeSidebarTab: string;
  setActiveSidebarTab: (tab: string) => void;

  // Timeline UI
  zoom: number;
  setZoom: (zoom: number | ((prev: number) => number)) => void;
  snappingEnabled: boolean;
  setSnappingEnabled: (v: boolean) => void;
  magnetMode: boolean;
  setMagnetMode: (v: boolean) => void;
  toolMode: TimelineToolMode;
  setToolMode: (mode: TimelineToolMode) => void;
  rippleMode: boolean;
  setRippleMode: (v: boolean) => void;
  trackHeight: TimelineTrackHeight;
  setTrackHeight: (h: TimelineTrackHeight) => void;
  activeSnapGuide: SnapGuideInfo | null;
  setActiveSnapGuide: (g: SnapGuideInfo | null) => void;
  showGrid: boolean;
  setShowGrid: (v: boolean) => void;
  showSafeMargin: boolean;
  setShowSafeMargin: (v: boolean) => void;

  // Modals
  isExportModalOpen: boolean;
  openExportModal: () => void;
  closeExportModal: () => void;

  isRecordModalOpen: boolean;
  recordMode: 'screen' | 'camera' | 'audio';
  openRecordModal: (mode?: 'screen' | 'camera' | 'audio') => void;
  closeRecordModal: () => void;

  isShortcutsModalOpen: boolean;
  openShortcutsModal: () => void;
  closeShortcutsModal: () => void;

  isAiModalOpen: boolean;
  openAiModal: () => void;
  closeAiModal: () => void;

  isAiCopilotDrawerOpen: boolean;
  openAiCopilotDrawer: () => void;
  closeAiCopilotDrawer: () => void;
  toggleAiCopilotDrawer: () => void;

  isAudioStudioModalOpen: boolean;
  audioStudioTargetClipId: string | null;
  openAudioStudio: (clipId?: string) => void;
  closeAudioStudio: () => void;

  isProjectManagerOpen: boolean;
  openProjectManager: () => void;
  closeProjectManager: () => void;

  isRelinkModalOpen: boolean;
  openRelinkModal: () => void;
  closeRelinkModal: () => void;
}

export const useUiStore = create<UiState>()(
  subscribeWithSelector((set, get) => ({
    currentView: 'landing',
    setCurrentView: (view) => set({ currentView: view }),
    openLanding: () => set({ currentView: 'landing' }),
    openHome: () => set({ currentView: 'home' }),
    openEditor: () => set({ currentView: 'editor' }),

    activeSidebarTab: 'media',
    setActiveSidebarTab: (tab) => set({ activeSidebarTab: tab }),

    zoom: 45,
    setZoom: (zoom) =>
      set((s) => ({
        zoom: typeof zoom === 'function' ? zoom(s.zoom) : zoom,
      })),

    snappingEnabled: true,
    setSnappingEnabled: (v) => set({ snappingEnabled: v }),
    magnetMode: false,
    setMagnetMode: (v) => set({ magnetMode: v }),
    toolMode: 'select',
    setToolMode: (mode) => set({ toolMode: mode }),
    rippleMode: false,
    setRippleMode: (v) => set({ rippleMode: v }),
    trackHeight: 'normal',
    setTrackHeight: (h) => set({ trackHeight: h }),
    activeSnapGuide: null,
    setActiveSnapGuide: (g) => set({ activeSnapGuide: g }),
    showGrid: false,
    setShowGrid: (v) => set({ showGrid: v }),
    showSafeMargin: false,
    setShowSafeMargin: (v) => set({ showSafeMargin: v }),

    isExportModalOpen: false,
    openExportModal: () => set({ isExportModalOpen: true }),
    closeExportModal: () => set({ isExportModalOpen: false }),

    isRecordModalOpen: false,
    recordMode: 'screen',
    openRecordModal: (mode = 'screen') => set({ isRecordModalOpen: true, recordMode: mode }),
    closeRecordModal: () => set({ isRecordModalOpen: false }),

    isShortcutsModalOpen: false,
    openShortcutsModal: () => set({ isShortcutsModalOpen: true }),
    closeShortcutsModal: () => set({ isShortcutsModalOpen: false }),

    isAiModalOpen: false,
    openAiModal: () => set({ isAiModalOpen: true }),
    closeAiModal: () => set({ isAiModalOpen: false }),

    isAiCopilotDrawerOpen: false,
    openAiCopilotDrawer: () => set({ isAiCopilotDrawerOpen: true }),
    closeAiCopilotDrawer: () => set({ isAiCopilotDrawerOpen: false }),
    toggleAiCopilotDrawer: () => set({ isAiCopilotDrawerOpen: !get().isAiCopilotDrawerOpen }),

    isAudioStudioModalOpen: false,
    audioStudioTargetClipId: null,
    openAudioStudio: (clipId) =>
      set({ isAudioStudioModalOpen: true, audioStudioTargetClipId: clipId ?? null }),
    closeAudioStudio: () => set({ isAudioStudioModalOpen: false, audioStudioTargetClipId: null }),

    isProjectManagerOpen: false,
    openProjectManager: () => set({ isProjectManagerOpen: true }),
    closeProjectManager: () => set({ isProjectManagerOpen: false }),

    isRelinkModalOpen: false,
    openRelinkModal: () => set({ isRelinkModalOpen: true }),
    closeRelinkModal: () => set({ isRelinkModalOpen: false }),
  }))
);
