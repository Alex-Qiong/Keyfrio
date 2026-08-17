import { SnappingGuide } from '../types/editor';

// Format seconds to SMPTE timecode (HH:MM:SS:FF)
export function formatSMPTE(seconds: number, fps = 30): string {
  const safeSec = Math.max(0, seconds || 0);
  const totalFrames = Math.floor(safeSec * fps);
  const frames = totalFrames % fps;
  const totalSeconds = Math.floor(safeSec);
  const secs = totalSeconds % 60;
  const mins = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);

  const pad = (n: number, z = 2) => String(n).padStart(z, '0');
  return `${pad(hours)}:${pad(mins)}:${pad(secs)}:${pad(frames)}`;
}

// Format seconds to mm:ss.ms
export function formatTime(seconds: number): string {
  const safeSec = Math.max(0, seconds || 0);
  const mins = Math.floor(safeSec / 60);
  const secs = Math.floor(safeSec % 60);
  const ms = Math.floor((safeSec % 1) * 10);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(mins)}:${pad(secs)}.${ms}`;
}

// Parse string time (e.g. "00:01:23:15" or "1:23" or "83.5") to seconds
export function parseTimeToSeconds(input: string, fps = 30): number {
  const trimmed = input.trim();
  if (!trimmed) return 0;

  const parts = trimmed.split(':').map((p) => parseFloat(p) || 0);
  if (parts.length === 4) {
    // HH:MM:SS:FF
    return parts[0] * 3600 + parts[1] * 60 + parts[2] + parts[3] / fps;
  } else if (parts.length === 3) {
    // HH:MM:SS
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    // MM:SS
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 1) {
    return parseFloat(trimmed) || 0;
  }
  return 0;
}

// Snap a given time to nearest snap points in array
export function snapTime(
  targetTime: number,
  snapPoints: number[],
  thresholdSeconds = 0.15
): number {
  let closest = targetTime;
  let minDiff = thresholdSeconds;

  for (const p of snapPoints) {
    const diff = Math.abs(p - targetTime);
    if (diff < minDiff) {
      minDiff = diff;
      closest = p;
    }
  }

  return closest;
}

// Snapping algorithm: snaps a test time to nearest guide within snapThreshold seconds
export function findSnapTime(
  targetTime: number,
  guides: SnappingGuide[],
  thresholdSeconds = 0.15
): { snappedTime: number; guide: SnappingGuide | null } {
  let closestGuide: SnappingGuide | null = null;
  let minDiff = thresholdSeconds;

  for (const guide of guides) {
    const diff = Math.abs(guide.time - targetTime);
    if (diff < minDiff) {
      minDiff = diff;
      closestGuide = guide;
    }
  }

  return {
    snappedTime: closestGuide ? closestGuide.time : targetTime,
    guide: closestGuide,
  };
}

// Check if two time intervals overlap: [s1, s1+d1] and [s2, s2+d2]
export function isOverlapping(
  start1: number,
  duration1: number,
  start2: number,
  duration2: number
): boolean {
  const end1 = start1 + duration1;
  const end2 = start2 + duration2;
  return Math.max(start1, start2) < Math.min(end1, end2);
}
