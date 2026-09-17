import { useEffect, useRef } from 'react';
import { useEditor } from '../context/EditorContext';
import { useProjectStore } from '../stores/projectStore';
import { usePlaybackStore } from '../stores/playbackStore';
import { useSelectionStore } from '../stores/selectionStore';
import { useUiStore } from '../stores/uiStore';
import { useAssetsStore } from '../stores/assetsStore';
import { useHistoryStore } from '../stores/historyStore';

/**
 * One-way bridge: keeps Zustand stores in sync with the legacy EditorContext.
 *
 * During the migration period, EditorContext remains the source of truth for
 * mutations. This component mirrors its state into the sliced stores so that
 * newly migrated components can already benefit from fine-grained subscriptions.
 *
 * Once all consumers read from stores and mutations are moved into store actions,
 * this bridge can be deleted together with EditorContext.
 */
export function StoreBridge() {
  const editor = useEditor();
  const lastHistoryPush = useRef(0);

  // ---- Project ----
  useEffect(() => {
    useProjectStore.getState().setProject(editor.project);
  }, [editor.project]);

  // ---- Playback ----
  useEffect(() => {
    const pb = usePlaybackStore.getState();
    if (pb.currentTime !== editor.currentTime) pb.seek(editor.currentTime);
  }, [editor.currentTime]);

  useEffect(() => {
    const pb = usePlaybackStore.getState();
    if (pb.isPlaying !== editor.isPlaying) {
      editor.isPlaying ? pb.play() : pb.pause();
    }
  }, [editor.isPlaying]);

  useEffect(() => {
    usePlaybackStore.getState().setPlaybackSpeed(editor.playbackSpeed);
  }, [editor.playbackSpeed]);

  useEffect(() => {
    usePlaybackStore.getState().setLoop(editor.loop);
  }, [editor.loop]);

  useEffect(() => {
    usePlaybackStore.getState().setInPoint(editor.inPoint);
  }, [editor.inPoint]);

  useEffect(() => {
    usePlaybackStore.getState().setOutPoint(editor.outPoint);
  }, [editor.outPoint]);

  // ---- Selection ----
  useEffect(() => {
    useSelectionStore.getState().selectClips(editor.selectedClipIds);
  }, [editor.selectedClipIds]);

  useEffect(() => {
    useSelectionStore.getState().setActiveTrackId(editor.activeTrackId);
  }, [editor.activeTrackId]);

  // ---- UI ----
  useEffect(() => {
    useUiStore.getState().setCurrentView(editor.currentView);
  }, [editor.currentView]);

  useEffect(() => {
    useUiStore.getState().setActiveSidebarTab(editor.activeSidebarTab);
  }, [editor.activeSidebarTab]);

  useEffect(() => {
    useUiStore.getState().setZoom(editor.zoom);
  }, [editor.zoom]);

  useEffect(() => {
    useUiStore.getState().setSnappingEnabled(editor.snappingEnabled ?? editor.snapping);
  }, [editor.snappingEnabled, editor.snapping]);

  useEffect(() => {
    useUiStore.getState().setMagnetMode(editor.magnetMode);
  }, [editor.magnetMode]);

  useEffect(() => {
    useUiStore.getState().setToolMode(editor.toolMode);
  }, [editor.toolMode]);

  useEffect(() => {
    useUiStore.getState().setRippleMode(editor.rippleMode);
  }, [editor.rippleMode]);

  useEffect(() => {
    useUiStore.getState().setTrackHeight(editor.trackHeight);
  }, [editor.trackHeight]);

  useEffect(() => {
    useUiStore.getState().setShowGrid(editor.showGrid);
  }, [editor.showGrid]);

  useEffect(() => {
    useUiStore.getState().setShowSafeMargin(editor.showSafeMargin);
  }, [editor.showSafeMargin]);

  // Modal flags
  useEffect(() => {
    if (editor.isExportModalOpen) useUiStore.getState().openExportModal();
    else useUiStore.getState().closeExportModal();
  }, [editor.isExportModalOpen]);

  useEffect(() => {
    if (editor.isRecordModalOpen) useUiStore.getState().openRecordModal(editor.recordMode);
    else useUiStore.getState().closeRecordModal();
  }, [editor.isRecordModalOpen, editor.recordMode]);

  useEffect(() => {
    if (editor.isShortcutsModalOpen) useUiStore.getState().openShortcutsModal();
    else useUiStore.getState().closeShortcutsModal();
  }, [editor.isShortcutsModalOpen]);

  useEffect(() => {
    if (editor.isAiModalOpen) useUiStore.getState().openAiModal();
    else useUiStore.getState().closeAiModal();
  }, [editor.isAiModalOpen]);

  useEffect(() => {
    if (editor.isAiCopilotDrawerOpen) useUiStore.getState().openAiCopilotDrawer();
    else useUiStore.getState().closeAiCopilotDrawer();
  }, [editor.isAiCopilotDrawerOpen]);

  useEffect(() => {
    if (editor.isAudioStudioModalOpen) {
      useUiStore.getState().openAudioStudio(editor.audioStudioTargetClipId ?? undefined);
    } else {
      useUiStore.getState().closeAudioStudio();
    }
  }, [editor.isAudioStudioModalOpen, editor.audioStudioTargetClipId]);

  useEffect(() => {
    if (editor.isProjectManagerOpen) useUiStore.getState().openProjectManager();
    else useUiStore.getState().closeProjectManager();
  }, [editor.isProjectManagerOpen]);

  useEffect(() => {
    if (editor.isRelinkModalOpen) useUiStore.getState().openRelinkModal();
    else useUiStore.getState().closeRelinkModal();
  }, [editor.isRelinkModalOpen]);

  // ---- Assets ----
  useEffect(() => {
    useAssetsStore.getState().setUserAssets(editor.userAssets);
  }, [editor.userAssets]);

  useEffect(() => {
    useAssetsStore.getState().setProjectList(editor.projectList);
  }, [editor.projectList]);

  useEffect(() => {
    useAssetsStore.getState().setDbSaveStatus(editor.dbSaveStatus);
  }, [editor.dbSaveStatus]);

  useEffect(() => {
    useAssetsStore
      .getState()
      .setOfflineCounts(editor.offlineAssetsCount, editor.needsPermissionCount);
  }, [editor.offlineAssetsCount, editor.needsPermissionCount]);

  // ---- History flags (context already owns the stack; just mirror canUndo/canRedo if needed later) ----
  // We do not overwrite history store from context to avoid double stacks.
  // When mutations move to stores, useHistoryActions will own the stack.

  // Suppress unused-var warning for the ref kept for future debounce
  void lastHistoryPush;

  return null;
}
