import { useCallback } from 'react';
import { useProjectStore } from '../stores/projectStore';
import { useHistoryStore, HistorySnapshot } from '../stores/historyStore';

/**
 * Helper that records a history snapshot before a project mutation,
 * then applies the mutation. Use this from services or future store-based actions.
 */
export function useHistoryActions() {
  const push = useHistoryStore((s) => s.push);
  const undoSnapshot = useHistoryStore((s) => s.undo);
  const redoSnapshot = useHistoryStore((s) => s.redo);
  const canUndo = useHistoryStore((s) => s.canUndo);
  const canRedo = useHistoryStore((s) => s.canRedo);

  const setProject = useProjectStore((s) => s.setProject);
  const project = useProjectStore((s) => s.project);

  const recordAndApply = useCallback(
    (mutator: () => void) => {
      push({
        tracks: project.tracks,
        resolution: project.resolution,
        name: project.name,
      });
      mutator();
    },
    [push, project]
  );

  const undo = useCallback(() => {
    const snap = undoSnapshot();
    if (!snap) return;
    setProject({
      ...project,
      tracks: snap.tracks,
      resolution: snap.resolution,
      name: snap.name,
    });
  }, [undoSnapshot, setProject, project]);

  const redo = useCallback(() => {
    const snap = redoSnapshot();
    if (!snap) return;
    setProject({
      ...project,
      tracks: snap.tracks,
      resolution: snap.resolution,
      name: snap.name,
    });
  }, [redoSnapshot, setProject, project]);

  return { recordAndApply, undo, redo, canUndo, canRedo };
}

/** Non-hook version for use inside store middleware or plain functions */
export function pushHistorySnapshot(snapshot: HistorySnapshot) {
  useHistoryStore.getState().push(snapshot);
}
