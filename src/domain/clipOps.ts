import { Clip, Track, TrackType, MediaType } from '../types/editor';
import { createClip, uid } from './projectFactory';

/** Resolve which track type a media type should land on */
export function resolveTrackTypeForMedia(type: MediaType): TrackType {
  if (type === 'audio') return 'audio';
  return 'video';
}

/** Check whether two time ranges overlap */
export function rangesOverlap(
  aStart: number,
  aDuration: number,
  bStart: number,
  bDuration: number
): boolean {
  const aEnd = aStart + aDuration;
  const bEnd = bStart + bDuration;
  return aStart < bEnd && bStart < aEnd;
}

/** Find if a clip would overlap any existing clip on the same track */
export function isTrackOverlapping(
  track: Track,
  start: number,
  duration: number,
  excludeClipId?: string
): boolean {
  return track.clips.some(
    (c) => c.id !== excludeClipId && rangesOverlap(c.start, c.duration, start, duration)
  );
}

/** Find first track of given type that has no overlap at the target range */
export function findTrackWithoutOverlap(
  tracks: Track[],
  type: TrackType,
  start: number,
  duration: number,
  excludeClipId?: string
): Track | undefined {
  return tracks.find(
    (t) => t.type === type && !isTrackOverlapping(t, start, duration, excludeClipId)
  );
}

/** Allocate a non-overlapping track; creates a new one if needed (caller must add it) */
export function allocateNonOverlappingTrack(
  tracks: Track[],
  type: TrackType,
  start: number,
  duration: number,
  excludeClipId?: string
): { track: Track; needsCreate: boolean } {
  const existing = findTrackWithoutOverlap(tracks, type, start, duration, excludeClipId);
  if (existing) return { track: existing, needsCreate: false };

  const sameType = tracks.filter((t) => t.type === type);
  const nextOrder = tracks.length;
  const nextIndex = sameType.length + 1;
  const name = type === 'video' ? `V${nextIndex}` : `A${nextIndex}`;

  const newTrack: Track = {
    id: uid(`track-${type}`),
    name,
    type,
    isMuted: false,
    isLocked: false,
    isHidden: false,
    isSolo: false,
    volume: 1,
    order: nextOrder,
    clips: [],
  };
  return { track: newTrack, needsCreate: true };
}

/** Split a clip at a relative time inside it. Returns [left, right] or null if invalid. */
export function splitClipAt(
  clip: Clip,
  absoluteTime: number
): [Clip, Clip] | null {
  const relative = absoluteTime - clip.start;
  if (relative <= 0.05 || relative >= clip.duration - 0.05) return null;

  const leftDuration = relative;
  const rightDuration = clip.duration - relative;

  const left: Clip = {
    ...clip,
    id: uid('clip'),
    duration: leftDuration,
    trimEnd: clip.trimStart + leftDuration,
  };

  const right: Clip = {
    ...clip,
    id: uid('clip'),
    start: absoluteTime,
    duration: rightDuration,
    trimStart: clip.trimStart + leftDuration,
  };

  return [left, right];
}

/** Apply a partial update immutably to a clip inside tracks */
export function updateClipInTracks(
  tracks: Track[],
  clipId: string,
  updates: Partial<Clip>
): Track[] {
  return tracks.map((track) => {
    const idx = track.clips.findIndex((c) => c.id === clipId);
    if (idx === -1) return track;
    const nextClips = [...track.clips];
    nextClips[idx] = { ...nextClips[idx], ...updates };
    return { ...track, clips: nextClips };
  });
}

/** Remove a clip and optionally ripple subsequent clips on the same track */
export function removeClipFromTracks(
  tracks: Track[],
  clipId: string,
  ripple = false
): Track[] {
  return tracks.map((track) => {
    const idx = track.clips.findIndex((c) => c.id === clipId);
    if (idx === -1) return track;

    const removed = track.clips[idx];
    let nextClips = track.clips.filter((c) => c.id !== clipId);

    if (ripple) {
      nextClips = nextClips.map((c) => {
        if (c.start >= removed.start + removed.duration) {
          return { ...c, start: c.start - removed.duration };
        }
        return c;
      });
    }

    return { ...track, clips: nextClips };
  });
}

/** Move a clip to a new track/time, resolving collisions by pushing if needed */
export function moveClipInTracks(
  tracks: Track[],
  clipId: string,
  targetTrackId: string,
  targetStart: number
): Track[] {
  let movingClip: Clip | null = null;

  // Extract the clip
  let next = tracks.map((track) => {
    const found = track.clips.find((c) => c.id === clipId);
    if (found) {
      movingClip = found;
      return { ...track, clips: track.clips.filter((c) => c.id !== clipId) };
    }
    return track;
  });

  if (!movingClip) return tracks;

  const moved: Clip = { ...movingClip, trackId: targetTrackId, start: Math.max(0, targetStart) };

  next = next.map((track) => {
    if (track.id !== targetTrackId) return track;
    return { ...track, clips: [...track.clips, moved].sort((a, b) => a.start - b.start) };
  });

  return next;
}
