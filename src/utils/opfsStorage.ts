import { OpfsStats } from '../types/editor';

/**
 * FreeCut OPFS (Origin Private File System) Storage Engine
 * High-performance chunked local file system for videos, audio waveforms, and project sequences
 */
export class OpfsStorageEngine {
  private isSupported: boolean;

  constructor() {
    this.isSupported =
      typeof navigator !== 'undefined' &&
      typeof navigator.storage !== 'undefined' &&
      typeof navigator.storage.getDirectory === 'function';
  }

  public checkSupport(): boolean {
    return this.isSupported;
  }

  /**
   * Get total storage usage and quota
   */
  public async getStorageStats(): Promise<OpfsStats> {
    if (!this.isSupported) {
      return {
        isSupported: false,
        usageBytes: 0,
        quotaBytes: 0,
        fileCount: 0,
      };
    }

    try {
      const estimate = await navigator.storage.estimate();
      const root = await navigator.storage.getDirectory();
      let fileCount = 0;

      // Scan entries count
      for await (const _entry of (root as any).values()) {
        fileCount++;
      }

      return {
        isSupported: true,
        usageBytes: estimate.usage || 0,
        quotaBytes: estimate.quota || 0,
        fileCount,
      };
    } catch {
      return {
        isSupported: true,
        usageBytes: 0,
        quotaBytes: 0,
        fileCount: 0,
      };
    }
  }

  /**
   * Save a Blob or File to OPFS
   */
  public async saveFile(fileName: string, blob: Blob): Promise<boolean> {
    if (!this.isSupported) return false;

    try {
      const root = await navigator.storage.getDirectory();
      const fileHandle = await root.getFileHandle(fileName, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(blob);
      await writable.close();
      return true;
    } catch (e) {
      console.warn('OPFS save error:', e);
      return false;
    }
  }

  /**
   * Read a Blob from OPFS by filename
   */
  public async getFile(fileName: string): Promise<Blob | null> {
    if (!this.isSupported) return null;

    try {
      const root = await navigator.storage.getDirectory();
      const fileHandle = await root.getFileHandle(fileName);
      const file = await fileHandle.getFile();
      return file;
    } catch {
      return null;
    }
  }

  /**
   * Delete a file from OPFS
   */
  public async deleteFile(fileName: string): Promise<boolean> {
    if (!this.isSupported) return false;

    try {
      const root = await navigator.storage.getDirectory();
      await root.removeEntry(fileName);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Clear all cached files from OPFS
   */
  public async clearAll(): Promise<boolean> {
    if (!this.isSupported) return false;

    try {
      const root = await navigator.storage.getDirectory();
      for await (const [name] of (root as any).entries()) {
        try {
          await root.removeEntry(name, { recursive: true });
        } catch {}
      }
      return true;
    } catch {
      return false;
    }
  }
}

export const globalOpfsStorage = new OpfsStorageEngine();
