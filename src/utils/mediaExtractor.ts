/**
 * Media Extractor Utility
 * Extracts real video metadata (duration, width, height),
 * real video frame filmstrips (multi-frame snapshots for timeline display),
 * and real audio waveforms via Web Audio API.
 */

import { extractWaveformFromBlob } from './audio';

// In-memory cache for extracted filmstrips to prevent re-decoding
const filmstripCache = new Map<string, string[]>();
const metadataCache = new Map<string, { duration: number; width: number; height: number }>();

/**
 * Fallback canvas thumbnail generator
 */
export function createFallbackThumbnail(
  labelOrWidth: string | number = 'Media Clip',
  colorOrHeight: string | number = '#1e293b',
  optionalLabel?: string
): string {
  const canvas = document.createElement('canvas');
  canvas.width = 160;
  canvas.height = 90;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const bgColor = typeof colorOrHeight === 'string' && colorOrHeight.startsWith('#') ? colorOrHeight : '#1e293b';
    const textLabel = typeof labelOrWidth === 'string' ? labelOrWidth : optionalLabel || 'Media';

    const grad = ctx.createLinearGradient(0, 0, 160, 90);
    grad.addColorStop(0, bgColor);
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 160, 90);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(textLabel.slice(0, 18), 80, 45);
  }
  return canvas.toDataURL('image/jpeg', 0.5);
}

/**
 * Extracts accurate video duration, dimensions, and filmstrip frame thumbnails
 */
export async function extractVideoMetadataAndFilmstrip(
  urlOrBlob: string | Blob,
  numThumbnails = 8
): Promise<{
  duration: number;
  width: number;
  height: number;
  thumbnails: string[];
  thumbnailUrl: string;
  thumbnail: string;
}> {
  const url = typeof urlOrBlob === 'string' ? urlOrBlob : URL.createObjectURL(urlOrBlob);
  const cacheKey = `${url}-${numThumbnails}`;

  if (metadataCache.has(cacheKey) && filmstripCache.has(cacheKey)) {
    const meta = metadataCache.get(cacheKey)!;
    const thumbnails = filmstripCache.get(cacheKey)!;
    return {
      ...meta,
      thumbnails,
      thumbnailUrl: thumbnails[0] || '',
      thumbnail: thumbnails[0] || '',
    };
  }

  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.src = url;
    if (!url.startsWith('blob:') && !url.startsWith('data:')) {
      video.crossOrigin = 'anonymous';
    }
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const cleanUp = () => {
      video.pause();
      video.removeAttribute('src');
      video.load();
    };

    const fallback = () => {
      cleanUp();
      const defaultDuration = 10;
      const defaultWidth = 1920;
      const defaultHeight = 1080;
      const placeholder = createFallbackThumbnail('Video Clip', '#1e293b');
      const thumbs = Array(numThumbnails).fill(placeholder);
      resolve({
        duration: defaultDuration,
        width: defaultWidth,
        height: defaultHeight,
        thumbnails: thumbs,
        thumbnailUrl: placeholder,
        thumbnail: placeholder,
      });
    };

    video.onerror = () => fallback();

    video.onloadedmetadata = async () => {
      const duration = isFinite(video.duration) && video.duration > 0 ? video.duration : 10;
      const width = video.videoWidth || 1920;
      const height = video.videoHeight || 1080;

      // Set canvas to thumbnail size (e.g. 160x90)
      const thumbWidth = 160;
      const thumbHeight = Math.round((thumbWidth * height) / width) || 90;
      canvas.width = thumbWidth;
      canvas.height = thumbHeight;

      const thumbnails: string[] = [];

      try {
        const step = duration / Math.max(1, numThumbnails);

        for (let i = 0; i < numThumbnails; i++) {
          const targetTime = Math.min(duration - 0.05, Math.max(0.05, (i + 0.5) * step));

          await new Promise<void>((seekDone) => {
            const onSeeked = () => {
              video.removeEventListener('seeked', onSeeked);
              if (ctx) {
                ctx.drawImage(video, 0, 0, thumbWidth, thumbHeight);
                thumbnails.push(canvas.toDataURL('image/jpeg', 0.65));
              }
              seekDone();
            };

            video.addEventListener('seeked', onSeeked);
            video.currentTime = targetTime;

            // Timeout safety for seeking
            setTimeout(() => {
              video.removeEventListener('seeked', onSeeked);
              seekDone();
            }, 600);
          });
        }
      } catch (err) {
        console.warn('Filmstrip extraction partial error:', err);
      }

      if (thumbnails.length === 0) {
        const placeholder = createFallbackThumbnail('Video Clip', '#1e293b');
        thumbnails.push(placeholder);
      }

      // Cache results
      metadataCache.set(cacheKey, { duration, width, height });
      filmstripCache.set(cacheKey, thumbnails);

      cleanUp();

      resolve({
        duration,
        width,
        height,
        thumbnails,
        thumbnailUrl: thumbnails[0] || '',
        thumbnail: thumbnails[0] || '',
      });
    };
  });
}

/**
 * Extracts accurate audio duration and waveform peaks via Web Audio
 */
export async function extractAudioMetadataAndWaveform(
  urlOrBlob: string | Blob,
  sampleCount = 80
): Promise<{
  duration: number;
  waveform: number[];
}> {
  try {
    let blob: Blob;
    if (typeof urlOrBlob === 'string') {
      const resp = await fetch(urlOrBlob);
      blob = await resp.blob();
    } else {
      blob = urlOrBlob;
    }

    // Audio duration via Audio element
    let duration = 15;
    try {
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio();
      audio.src = audioUrl;
      await new Promise<void>((res) => {
        audio.onloadedmetadata = () => {
          if (isFinite(audio.duration) && audio.duration > 0) {
            duration = audio.duration;
          }
          res();
        };
        audio.onerror = () => res();
        setTimeout(res, 800);
      });
    } catch {
      // ignore
    }

    const waveform = await extractWaveformFromBlob(blob, sampleCount);
    return {
      duration,
      waveform,
    };
  } catch (err) {
    console.warn('Audio metadata extraction failed:', err);
    return {
      duration: 15,
      waveform: Array(sampleCount).fill(0.5),
    };
  }
}
