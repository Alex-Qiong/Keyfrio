import { Clip, ClipKeyframes, EasingType, Keyframe, Transform, ColorFilter } from '../types/editor';

/**
 * Mathematical easing functions for keyframe interpolation
 */
export function evaluateEasing(t: number, easing: EasingType): number {
  const clampedT = Math.max(0, Math.min(1, t));
  switch (easing) {
    case 'linear':
      return clampedT;
    case 'easeIn':
      return clampedT * clampedT * clampedT; // Cubic ease in
    case 'easeOut':
      return 1 - Math.pow(1 - clampedT, 3); // Cubic ease out
    case 'easeInOut':
      return clampedT < 0.5
        ? 4 * clampedT * clampedT * clampedT
        : 1 - Math.pow(-2 * clampedT + 2, 3) / 2; // Cubic ease in-out
    case 'spring': {
      // Damped harmonic oscillation
      const c4 = (2 * Math.PI) / 3;
      return clampedT === 0
        ? 0
        : clampedT === 1
        ? 1
        : Math.pow(2, -10 * clampedT) * Math.sin((clampedT * 10 - 0.75) * c4) + 1;
    }
    case 'hold':
      return clampedT >= 1 ? 1 : 0;
    default:
      return clampedT;
  }
}

/**
 * Interpolate a numerical property from a list of keyframes at a given clip-relative timestamp (in seconds)
 */
export function interpolateKeyframes(
  keyframes: Keyframe<number>[] | undefined,
  clipTime: number,
  defaultValue: number
): number {
  if (!keyframes || keyframes.length === 0) {
    return defaultValue;
  }

  // Sort keyframes ascending by time
  const sorted = [...keyframes].sort((a, b) => a.time - b.time);

  // Before first keyframe
  if (clipTime <= sorted[0].time) {
    return sorted[0].value;
  }

  // After last keyframe
  if (clipTime >= sorted[sorted.length - 1].time) {
    return sorted[sorted.length - 1].value;
  }

  // Find surrounding keyframes
  for (let i = 0; i < sorted.length - 1; i++) {
    const kfA = sorted[i];
    const kfB = sorted[i + 1];

    if (clipTime >= kfA.time && clipTime <= kfB.time) {
      const span = kfB.time - kfA.time;
      if (span <= 0.0001) return kfB.value;

      const normalizedT = (clipTime - kfA.time) / span;
      const easedT = evaluateEasing(normalizedT, kfA.easing || 'easeInOut');

      return kfA.value + (kfB.value - kfA.value) * easedT;
    }
  }

  return defaultValue;
}

/**
 * Compute active Transform for a clip at a given clip-relative timestamp
 */
export function getClipActiveTransformAtTime(clip: Clip, clipRelativeTime: number): Transform {
  const base = clip.transform;
  const kf = clip.keyframes;

  if (!kf) return base;

  return {
    x: interpolateKeyframes(kf.x, clipRelativeTime, base.x),
    y: interpolateKeyframes(kf.y, clipRelativeTime, base.y),
    scale: interpolateKeyframes(kf.scale, clipRelativeTime, base.scale),
    rotation: interpolateKeyframes(kf.rotation, clipRelativeTime, base.rotation),
    opacity: interpolateKeyframes(kf.opacity, clipRelativeTime, base.opacity),
    zIndex: base.zIndex,
    flipH: base.flipH,
    flipV: base.flipV,
  };
}

/**
 * Compute active ColorFilter for a clip at a given clip-relative timestamp
 */
export function getClipActiveFilterAtTime(clip: Clip, clipRelativeTime: number): ColorFilter {
  const base = clip.filter;
  const kf = clip.keyframes;

  if (!kf) return base;

  return {
    ...base,
    brightness: interpolateKeyframes(kf.brightness, clipRelativeTime, base.brightness),
    contrast: interpolateKeyframes(kf.contrast, clipRelativeTime, base.contrast),
    blur: interpolateKeyframes(kf.blur, clipRelativeTime, base.blur),
    saturate: interpolateKeyframes(kf.saturate, clipRelativeTime, base.saturate),
  };
}

/**
 * Compute active Volume for a clip at a given clip-relative timestamp
 */
export function getClipActiveVolumeAtTime(clip: Clip, clipRelativeTime: number): number {
  const base = clip.audio?.volume ?? 1;
  const kf = clip.keyframes;

  if (!kf || !kf.volume) return base;

  return Math.max(0, interpolateKeyframes(kf.volume, clipRelativeTime, base));
}

/**
 * Helper to add or update a keyframe for a clip property
 */
export function setClipKeyframe(
  clip: Clip,
  property: keyof ClipKeyframes,
  time: number,
  value: number,
  easing: EasingType = 'easeInOut'
): ClipKeyframes {
  const currentKf = clip.keyframes || {};
  const propList = currentKf[property] ? [...(currentKf[property] as Keyframe<number>[])] : [];

  // Match tolerance: 0.05s
  const existingIdx = propList.findIndex((k) => Math.abs(k.time - time) < 0.05);

  if (existingIdx >= 0) {
    propList[existingIdx] = {
      ...propList[existingIdx],
      time,
      value,
      easing,
    };
  } else {
    propList.push({
      id: `kf-${property}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      time,
      value,
      easing,
    });
  }

  propList.sort((a, b) => a.time - b.time);

  return {
    ...currentKf,
    [property]: propList,
  };
}

/**
 * Helper to remove a keyframe by property & id or approximate time
 */
export function removeClipKeyframe(
  clip: Clip,
  property: keyof ClipKeyframes,
  keyframeId?: string,
  time?: number
): ClipKeyframes {
  const currentKf = clip.keyframes || {};
  const propList = currentKf[property] ? [...(currentKf[property] as Keyframe<number>[])] : [];

  const filtered = propList.filter((k) => {
    if (keyframeId && k.id === keyframeId) return false;
    if (time !== undefined && Math.abs(k.time - time) < 0.05) return false;
    return true;
  });

  return {
    ...currentKf,
    [property]: filtered,
  };
}
