import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';
import { Project, Track } from '../types/editor';
import { createInitialProject, computeTotalDuration } from '../domain/projectFactory';

export interface ProjectState {
  project: Project;
  tracks: Track[];
  totalDuration: number;
  setProject: (project: Project) => void;
}

function withDerived(project: Project): Pick<ProjectState, 'project' | 'tracks' | 'totalDuration'> {
  const duration = computeTotalDuration(project.tracks);
  return {
    project: { ...project, duration, lastModified: Date.now() },
    tracks: project.tracks,
    totalDuration: duration,
  };
}

export const useProjectStore = create<ProjectState>()(
  subscribeWithSelector(
    immer((set) => ({
      ...withDerived(createInitialProject()),
      setProject: (project) => set(withDerived(project)),
    }))
  )
);
