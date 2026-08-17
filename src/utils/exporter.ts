import { Project, ExportSettings, ExportProgress } from '../types/editor';
import { renderFrame } from './canvasRenderer';
import { getAudioContext } from './audio';

export async function exportVideo(
  project: Project,
  settings: ExportSettings,
  onProgress?: (progress: ExportProgress) => void,
  abortSignal?: AbortSignal
): Promise<Blob> {
  const { resolution, fps, quality } = settings;
  const totalDuration = project.duration || 10;
  const totalFrames = Math.ceil(totalDuration * fps);

  // Bitrate estimation
  let bitrate = 8_000_000;
  if (quality === 'high') bitrate = 12_000_000;
  else if (quality === 'medium') bitrate = 6_000_000;
  else bitrate = 2_500_000;

  // 1. Prepare export canvas
  const canvas = document.createElement('canvas');
  canvas.width = resolution.width;
  canvas.height = resolution.height;
  const ctx = canvas.getContext('2d', { alpha: false })!;

  // 2. Set up Web Audio destination for audio mixing
  const audioCtx = getAudioContext();
  const audioDest = audioCtx.createMediaStreamDestination();

  // 3. Create stream from canvas + audio stream
  const canvasStream = canvas.captureStream(fps);
  const combinedStream = new MediaStream([
    ...canvasStream.getVideoTracks(),
    ...audioDest.stream.getAudioTracks(),
  ]);

  // Pick supported mimeType
  let mimeType = 'video/webm;codecs=vp9,opus';
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = 'video/webm;codecs=vp8,opus';
  }
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = 'video/webm';
  }

  const mediaRecorder = new MediaRecorder(combinedStream, {
    mimeType,
    videoBitsPerSecond: bitrate,
  });

  const recordedChunks: Blob[] = [];
  mediaRecorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      recordedChunks.push(e.data);
    }
  };

  return new Promise((resolve, reject) => {
    mediaRecorder.onstop = () => {
      const finalBlob = new Blob(recordedChunks, { type: mimeType });
      resolve(finalBlob);
    };

    mediaRecorder.onerror = (err) => {
      reject(err);
    };

    mediaRecorder.start();

    const startTime = performance.now();
    let currentFrame = 0;
    const frameDuration = 1 / fps;

    const renderNextFrame = () => {
      if (abortSignal?.aborted) {
        mediaRecorder.stop();
        reject(new DOMException('Export aborted by user', 'AbortError'));
        return;
      }

      if (currentFrame >= totalFrames) {
        mediaRecorder.stop();
        return;
      }

      const frameTime = currentFrame * frameDuration;

      // Render video frame
      renderFrame(ctx, project, frameTime, resolution, {
        isExporting: true,
      });

      currentFrame++;

      // Progress reporting
      const pct = Math.min(100, Math.round((currentFrame / totalFrames) * 100));
      const elapsed = (performance.now() - startTime) / 1000;
      const rate = currentFrame / (elapsed || 0.001);
      const remaining = Math.max(0, (totalFrames - currentFrame) / (rate || 1));

      if (onProgress) {
        onProgress({
          progress: pct,
          currentFrame,
          totalFrames,
          estimatedTimeRemaining: remaining,
        });
      }

      // Schedule next frame rendering
      setTimeout(renderNextFrame, Math.max(2, (1000 / fps) * 0.4));
    };

    renderNextFrame();
  });
}
