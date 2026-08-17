/**
 * OpenCut File System Access & Local Media Permission Management
 * Supports FileSystemFileHandle, FileSystemDirectoryHandle, IndexedDB persistence,
 * and smart batch re-linking for disconnected local video/audio/image assets.
 */

export interface ScannedLocalFile {
  name: string;
  path: string;
  size: number;
  type: string;
  lastModified: number;
  file?: File;
  fileHandle?: any;
  getFile: () => Promise<File>;
}

export function isFileSystemAccessSupported(): boolean {
  return typeof window !== 'undefined' && 'showOpenFilePicker' in window;
}

export function isDirectoryPickerSupported(): boolean {
  return typeof window !== 'undefined' && 'showDirectoryPicker' in window;
}

/**
 * Check if the browser currently has permission to read a FileSystemHandle
 */
export async function queryHandlePermission(handle: any): Promise<'granted' | 'prompt' | 'denied'> {
  if (!handle || typeof handle.queryPermission !== 'function') {
    return 'denied';
  }
  try {
    const state = await handle.queryPermission({ mode: 'read' });
    return state;
  } catch (err) {
    console.warn('Error querying file handle permission:', err);
    return 'denied';
  }
}

/**
 * Request user permission gesture for a FileSystemHandle
 */
export async function requestHandlePermission(handle: any): Promise<boolean> {
  if (!handle || typeof handle.requestPermission !== 'function') {
    return false;
  }
  try {
    const state = await handle.requestPermission({ mode: 'read' });
    return state === 'granted';
  } catch (err) {
    console.warn('Error requesting file handle permission:', err);
    return false;
  }
}

/**
 * Prompt user to select a folder and recursively scan all media files inside
 */
export async function pickAndScanDirectory(): Promise<{
  directoryName: string;
  directoryHandle?: any;
  files: ScannedLocalFile[];
}> {
  if (!isDirectoryPickerSupported()) {
    throw new Error('当前浏览器不支持文件夹直接授权访问，请使用文件选择器批量选取文件。');
  }

  const dirHandle = await (window as any).showDirectoryPicker({ mode: 'read' });
  const scannedFiles: ScannedLocalFile[] = [];

  async function traverse(currentDir: any, currentPath: string) {
    for await (const entry of currentDir.values()) {
      if (entry.kind === 'file') {
        const filePath = `${currentPath}/${entry.name}`;
        scannedFiles.push({
          name: entry.name,
          path: filePath,
          size: 0,
          type: '',
          lastModified: 0,
          fileHandle: entry,
          getFile: async () => await entry.getFile(),
        });
      } else if (entry.kind === 'directory') {
        // Skip hidden folders like .git, node_modules
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
          await traverse(entry, `${currentPath}/${entry.name}`);
        }
      }
    }
  }

  await traverse(dirHandle, dirHandle.name);

  return {
    directoryName: dirHandle.name,
    directoryHandle: dirHandle,
    files: scannedFiles,
  };
}

/**
 * Prompt user to pick one or more local media files with native File System Access
 */
export async function pickLocalMediaFiles(multiple: boolean = true): Promise<ScannedLocalFile[]> {
  if (isFileSystemAccessSupported()) {
    try {
      const handles = await (window as any).showOpenFilePicker({
        multiple,
        types: [
          {
            description: '媒体素材 (视频, 音频, 图片, 动效)',
            accept: {
              'video/*': ['.mp4', '.mov', '.webm', '.mkv', '.avi', '.m4v'],
              'audio/*': ['.mp3', '.wav', '.aac', '.m4a', '.ogg', '.flac'],
              'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'],
              'application/json': ['.json'],
            },
          },
        ],
      });

      const result: ScannedLocalFile[] = [];
      for (const handle of handles) {
        const file = await handle.getFile();
        result.push({
          name: file.name,
          path: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          file,
          fileHandle: handle,
          getFile: async () => await handle.getFile(),
        });
      }
      return result;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return [];
      }
      console.warn('showOpenFilePicker error, falling back:', err);
    }
  }

  // Fallback via standard file picker
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = multiple;
    input.accept = 'video/*,audio/*,image/*,.json';
    input.onchange = () => {
      if (!input.files || input.files.length === 0) {
        resolve([]);
        return;
      }
      const files = Array.from(input.files).map((f) => ({
        name: f.name,
        path: f.name,
        size: f.size,
        type: f.type,
        lastModified: f.lastModified,
        file: f,
        getFile: async () => f,
      }));
      resolve(files);
    };
    input.click();
  });
}
