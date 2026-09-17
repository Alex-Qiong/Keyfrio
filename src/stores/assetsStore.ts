import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { MediaAsset, ProjectSummary } from '../types/editor';

export interface AssetsState {
  userAssets: MediaAsset[];
  projectList: ProjectSummary[];
  dbSaveStatus: 'saved' | 'saving' | 'error';
  offlineAssetsCount: number;
  needsPermissionCount: number;

  setUserAssets: (assets: MediaAsset[]) => void;
  addUserAsset: (asset: MediaAsset) => void;
  deleteUserAsset: (assetId: string) => void;
  clearUserAssets: () => void;

  setProjectList: (list: ProjectSummary[]) => void;
  setDbSaveStatus: (status: 'saved' | 'saving' | 'error') => void;
  setOfflineCounts: (offline: number, needsPermission: number) => void;
}

export const useAssetsStore = create<AssetsState>()(
  subscribeWithSelector((set) => ({
    userAssets: [],
    projectList: [],
    dbSaveStatus: 'saved',
    offlineAssetsCount: 0,
    needsPermissionCount: 0,

    setUserAssets: (assets) => set({ userAssets: assets }),

    addUserAsset: (asset) =>
      set((s) => ({
        userAssets: [asset, ...s.userAssets.filter((a) => a.id !== asset.id)],
      })),

    deleteUserAsset: (assetId) =>
      set((s) => ({
        userAssets: s.userAssets.filter((a) => a.id !== assetId),
      })),

    clearUserAssets: () => set({ userAssets: [] }),

    setProjectList: (list) => set({ projectList: list }),
    setDbSaveStatus: (status) => set({ dbSaveStatus: status }),
    setOfflineCounts: (offline, needsPermission) =>
      set({ offlineAssetsCount: offline, needsPermissionCount: needsPermission }),
  }))
);
