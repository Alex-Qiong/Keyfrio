import { Clip, Project } from '../types/editor';

// Cached elements for audio, video, and images
const audioElementCache = new Map<string, HTMLAudioElement>();
const videoElementCache = new Map<string, HTMLVideoElement>();
const imageElementCache = new Map<string, HTMLImageElement>();

/**
 * Get or create cached HTMLVideoElement for rendering and playback
 */
export function getOrCreateVideoElement(clip: { id: string; sourceUrl?: string; [key: string]: any }): HTMLVideoElement | null {
  const url = clip.sourceUrl || clip.url;
  if (!url) return null;
  const key = `${clip.id}-${url}`;
  if (videoElementCache.has(key)) {
    return videoElementCache.get(key)!;
  }

  const video = document.createElement('video');
  video.src = url;
  if (!url.startsWith('blob:') && !url.startsWith('data:')) {
    video.crossOrigin = 'anonymous';
  }
  video.playsInline = true;
  video.preload = 'auto';
  video.muted = true;
  videoElementCache.set(key, video);
  return video;
}

/**
 * Get or create cached HTMLAudioElement for audio clips
 */
export function getOrCreateAudioElement(clip: { id: string; sourceUrl?: string; [key: string]: any }): HTMLAudioElement | null {
  const url = clip.sourceUrl || clip.url;
  if (!url) return null;
  const key = `${clip.id}-${url}`;
  if (audioElementCache.has(key)) {
    return audioElementCache.get(key)!;
  }

  const audio = document.createElement('audio');
  audio.src = url;
  if (!url.startsWith('blob:') && !url.startsWith('data:')) {
    audio.crossOrigin = 'anonymous';
  }
  audio.preload = 'auto';
  audioElementCache.set(key, audio);
  return audio;
}

/**
 * Get or create cached HTMLImageElement for image clips or thumbnails
 */
export function getOrCreateImageElement(clip: { id: string; sourceUrl?: string; [key: string]: any }): HTMLImageElement | null {
  const url = clip.sourceUrl || clip.url;
  if (!url) return null;
  const key = `${clip.id}-${url}`;
  if (imageElementCache.has(key)) {
    return imageElementCache.get(key)!;
  }

  const img = new Image();
  if (!url.startsWith('blob:') && !url.startsWith('data:')) {
    img.crossOrigin = 'anonymous';
  }
  img.src = url;
  imageElementCache.set(key, img);
  return img;
}

/**
 * Synchronize playback of all audio and video media at current timeline time
 */
export function syncMediaPlayback(
  project: Project,
  currentTime: number,
  isPlaying: boolean,
  playbackSpeed = 1
) {
  const activeClipIds = new Set<string>();

  // Check if any track is solo'd
  const hasSolo = project.tracks.some((t) => t.isSolo);

  for (const track of project.tracks) {
    const isTrackMuted = track.isMuted || (hasSolo && !track.isSolo);
    const trackVol = track.volume ?? 1;

    for (const clip of track.clips) {
      if (clip.sourceUrl) {
        const isWithinClip = currentTime >= clip.start && currentTime < clip.start + clip.duration;
        const sourcePlayTime = clip.trimStart + (currentTime - clip.start) * clip.speed;

        if (clip.type === 'video') {
          const video = getOrCreateVideoElement(clip);
          if (video) {
            if (isWithinClip) {
              activeClipIds.add(`${clip.id}-${clip.sourceUrl}`);
              video.playbackRate = clip.speed * playbackSpeed;

              // Video audio volume
              // If video has linked audio clip or is muted, mute HTMLVideoElement so audio clip handles sound
              const hasLinkedAudio = !!clip.linkedClipId && clip.isLinked !== false;
              const clipMuted = isTrackMuted || (clip.audio?.muted ?? false) || hasLinkedAudio;
              const effectiveVol = clipMuted ? 0 : Math.max(0, Math.min(1, (clip.audio?.volume ?? 1) * trackVol));
              video.muted = effectiveVol === 0 || hasLinkedAudio;
              video.volume = effectiveVol;

              if (isPlaying) {
                if (Math.abs(video.currentTime - sourcePlayTime) > 0.3) {
                  video.currentTime = sourcePlayTime;
                }
                if (video.paused && !video.ended) {
                  video.play().catch(() => {});
                }
              } else {
                if (!video.paused) {
                  video.pause();
                }
                if (Math.abs(video.currentTime - sourcePlayTime) > 0.08) {
                  video.currentTime = sourcePlayTime;
                }
              }
            } else {
              if (!video.paused) {
                video.pause();
              }
            }
          }
        } else if (clip.type === 'audio') {
          const audio = getOrCreateAudioElement(clip);
          if (audio) {
            if (isWithinClip) {
              activeClipIds.add(`${clip.id}-${clip.sourceUrl}`);
              audio.playbackRate = clip.speed * playbackSpeed;

              const clipMuted = isTrackMuted || (clip.audio?.muted ?? false);
              const effectiveVol = clipMuted ? 0 : Math.max(0, Math.min(1, (clip.audio?.volume ?? 1) * trackVol));
              audio.muted = effectiveVol === 0;
              audio.volume = effectiveVol;

              if (isPlaying) {
                if (Math.abs(audio.currentTime - sourcePlayTime) > 0.3) {
                  audio.currentTime = sourcePlayTime;
                }
                if (audio.paused && !audio.ended) {
                  audio.play().catch(() => {});
                }
              } else {
                if (!audio.paused) {
                  audio.pause();
                }
                if (Math.abs(audio.currentTime - sourcePlayTime) > 0.08) {
                  audio.currentTime = sourcePlayTime;
                }
              }
            } else {
              if (!audio.paused) {
                audio.pause();
              }
            }
          }
        }
      }
    }
  }

  // Pause any other non-active cached elements
  videoElementCache.forEach((video, key) => {
    if (!activeClipIds.has(key) && !video.paused) {
      video.pause();
    }
  });

  audioElementCache.forEach((audio, key) => {
    if (!activeClipIds.has(key) && !audio.paused) {
      audio.pause();
    }
  });
}

/**
 * Pause all media playback
 */
export function pauseAllMedia() {
  videoElementCache.forEach((v) => {
    if (!v.paused) v.pause();
  });
  audioElementCache.forEach((a) => {
    if (!a.paused) a.pause();
  });
}
