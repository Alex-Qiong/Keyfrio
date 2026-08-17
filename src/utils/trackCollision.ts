import { Track, TrackType, Clip, MediaType } from '../types/editor';

const EPSILON = 0.002; // Small tolerance to allow abutting/snapped clips without false collisions

/**
 * Checks if a given time interval [start, start + duration] collides with any existing clip on the track.
 */
export function isTrackOverlapping(
  track: Track,
  start: number,
  duration: number,
  ignoreClipId?: string
): boolean {
  if (!track.clips || track.clips.length === 0) return false;
  const targetEnd = start + Math.max(0.01, duration);

  return track.clips.some((clip) => {
    if (ignoreClipId && clip.id === ignoreClipId) return false;
    const clipEnd = clip.start + clip.duration;
    // Overlap condition: max(start1, start2) < min(end1, end2) - EPSILON
    return Math.max(clip.start, start) < Math.min(clipEnd, targetEnd) - EPSILON;
  });
}

/**
 * Finds an existing unlocked track of the specified type that has no clip overlap in [start, start + duration].
 */
export function findTrackWithoutOverlap(
  tracks: Track[],
  trackType: TrackType,
  start: number,
  duration: number,
  preferredTrackId?: string
): Track | null {
  // 1. Check preferred track first
  if (preferredTrackId) {
    const preferred = tracks.find((t) => t.id === preferredTrackId);
    if (
      preferred &&
      preferred.type === trackType &&
      !preferred.isLocked &&
      !isTrackOverlapping(preferred, start, duration)
    ) {
      return preferred;
    }
  }

  // 2. Search other unlocked tracks matching trackType
  const candidate = tracks.find(
    (t) => t.type === trackType && !t.isLocked && !isTrackOverlapping(t, start, duration)
  );

  return candidate || null;
}

/**
 * Allocates a track for a clip without overlapping.
 * If all existing tracks have overlapping clips at the given time, it automatically creates a new track.
 */
export function allocateNonOverlappingTrack(
  tracks: Track[],
  trackType: TrackType,
  start: number,
  duration: number,
  preferredTrackId?: string
): { targetTrack: Track; updatedTracks: Track[]; isNewTrack: boolean } {
  const existingFreeTrack = findTrackWithoutOverlap(
    tracks,
    trackType,
    start,
    duration,
    preferredTrackId
  );

  if (existingFreeTrack) {
    return {
      targetTrack: existingFreeTrack,
      updatedTracks: tracks,
      isNewTrack: false,
    };
  }

  // Create a new track automatically to prevent stacking
  const existingSameTypeTracks = tracks.filter((t) => t.type === trackType);
  const trackNum = existingSameTypeTracks.length + 1;
  const trackName =
    trackType === 'video'
      ? `V${trackNum} ${trackNum === 1 ? '主视频轨' : '画中画/覆叠轨'}`
      : `A${trackNum} ${trackNum === 1 ? '主音频轨' : '音效/配乐轨'}`;

  const newTrack: Track = {
    id: `track-${trackType}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: trackName,
    type: trackType,
    isMuted: false,
    isLocked: false,
    isHidden: false,
    isSolo: false,
    volume: 1,
    order: tracks.length,
    clips: [],
  };

  return {
    targetTrack: newTrack,
    updatedTracks: [...tracks, newTrack],
    isNewTrack: true,
  };
}

/**
 * Maps any media type into 'video' or 'audio' track type
 */
export function resolveTrackTypeForMedia(mediaType?: MediaType | string): TrackType {
  if (mediaType === 'audio') return 'audio';
  return 'video';
}
