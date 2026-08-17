import { ColorGrading, ColorGradeWheel, ToneCurvePoint } from '../types/editor';

/**
 * Evaluate Catmull-Rom or Piecewise Linear tone curve at point x (0 to 1)
 */
export function evaluateToneCurve(points: ToneCurvePoint[] | undefined, x: number): number {
  if (!points || points.length === 0) return x;
  if (points.length === 1) return points[0].y;

  const sorted = [...points].sort((a, b) => a.x - b.x);
  const clampedX = Math.max(0, Math.min(1, x));

  if (clampedX <= sorted[0].x) return sorted[0].y;
  if (clampedX >= sorted[sorted.length - 1].x) return sorted[sorted.length - 1].y;

  for (let i = 0; i < sorted.length - 1; i++) {
    const pA = sorted[i];
    const pB = sorted[i + 1];
    if (clampedX >= pA.x && clampedX <= pB.x) {
      const span = pB.x - pA.x;
      if (span <= 0.0001) return pB.y;
      const t = (clampedX - pA.x) / span;
      // Smooth Hermite interpolation
      const smoothT = t * t * (3 - 2 * t);
      return Math.max(0, Math.min(1, pA.y + (pB.y - pA.y) * smoothT));
    }
  }

  return clampedX;
}

/**
 * Apply Lift, Gamma, Gain, Offset Color Grading formula to a normalized [0, 1] color channel
 * 
 * ASC CDL / Standard grading formula:
 * Output = Gain * ( (Input + Lift * (1 - Input)) ^ (1 / Gamma) ) + Offset
 */
export function applyLiftGammaGain(
  input: number,
  liftVal: number,
  gammaVal: number,
  gainVal: number,
  offsetVal: number
): number {
  // Normalize parameters (wheel offsets are usually -1 to +1)
  const lift = liftVal * 0.5; // range ~ -0.5 to 0.5
  const gamma = Math.max(0.1, 1.0 - gammaVal * 0.8); // 0.2 to 1.8
  const gain = Math.max(0.0, 1.0 + gainVal * 1.5); // 0 to 2.5
  const offset = offsetVal * 0.3;

  // 1. Lift affects blacks/shadows (tapers off as input approaches 1)
  let val = input + lift * (1.0 - input);
  val = Math.max(0.0, val);

  // 2. Gamma affects midtones
  val = Math.pow(val, 1.0 / gamma);

  // 3. Gain scales highlights
  val = val * gain;

  // 4. Offset adds flat luma/chroma shift
  val = val + offset;

  return Math.max(0.0, Math.min(1.0, val));
}

/**
 * Generate lookup tables (LUT 256 array) for Red, Green, Blue from ColorGrading settings
 */
export function generateColorGradeLUT(grading: ColorGrading): {
  rLUT: Uint8ClampedArray;
  gLUT: Uint8ClampedArray;
  bLUT: Uint8ClampedArray;
} {
  const rLUT = new Uint8ClampedArray(256);
  const gLUT = new Uint8ClampedArray(256);
  const bLUT = new Uint8ClampedArray(256);

  if (!grading.enabled) {
    for (let i = 0; i < 256; i++) {
      rLUT[i] = i;
      gLUT[i] = i;
      bLUT[i] = i;
    }
    return { rLUT, gLUT, bLUT };
  }

  const {
    lift,
    gamma,
    gain,
    offset,
    temperature = 0,
    tint = 0,
    exposure = 0,
    contrast = 100,
    saturation = 100,
    vibrance = 0,
    curves,
  } = grading;

  // Temperature / Tint offsets
  const tempOffsetR = (temperature / 100) * 0.15;
  const tempOffsetB = -(temperature / 100) * 0.15;
  const tintOffsetG = -(tint / 100) * 0.15;
  const tintOffsetM = (tint / 100) * 0.1;

  // Exposure multiplier
  const expMultiplier = Math.pow(2, exposure);

  for (let i = 0; i < 256; i++) {
    const norm = i / 255.0;

    // Apply exposure
    let r = norm * expMultiplier;
    let g = norm * expMultiplier;
    let b = norm * expMultiplier;

    // Apply Master & RGB Curves
    if (curves) {
      r = evaluateToneCurve(curves.master, r);
      g = evaluateToneCurve(curves.master, g);
      b = evaluateToneCurve(curves.master, b);

      r = evaluateToneCurve(curves.red, r);
      g = evaluateToneCurve(curves.green, g);
      b = evaluateToneCurve(curves.blue, b);
    }

    // Apply Lift / Gamma / Gain / Offset (Per-channel + Master Y)
    r = applyLiftGammaGain(r, lift.r + lift.y, gamma.r + gamma.y, gain.r + gain.y, offset.r + offset.y + tempOffsetR + tintOffsetM);
    g = applyLiftGammaGain(g, lift.g + lift.y, gamma.g + gamma.y, gain.g + gain.y, offset.g + offset.y + tintOffsetG);
    b = applyLiftGammaGain(b, lift.b + lift.y, gamma.b + gamma.y, gain.b + gain.y, offset.b + offset.y + tempOffsetB + tintOffsetM);

    // Apply Contrast (pivot at 0.5)
    const cFactor = contrast / 100;
    r = (r - 0.5) * cFactor + 0.5;
    g = (g - 0.5) * cFactor + 0.5;
    b = (b - 0.5) * cFactor + 0.5;

    rLUT[i] = Math.round(Math.max(0, Math.min(1, r)) * 255);
    gLUT[i] = Math.round(Math.max(0, Math.min(1, g)) * 255);
    bLUT[i] = Math.round(Math.max(0, Math.min(1, b)) * 255);
  }

  return { rLUT, gLUT, bLUT };
}

/**
 * Apply real-time Color Grading LUT directly to a canvas context ImageData
 */
export function applyColorGradingToImageData(
  imageData: ImageData,
  grading: ColorGrading | undefined
): void {
  if (!grading || !grading.enabled) return;

  const { rLUT, gLUT, bLUT } = generateColorGradeLUT(grading);
  const data = imageData.data;
  const len = data.length;
  const sat = grading.saturation / 100;
  const vib = grading.vibrance / 100;

  for (let i = 0; i < len; i += 4) {
    let r = rLUT[data[i]];
    let g = gLUT[data[i + 1]];
    let b = bLUT[data[i + 2]];

    // Apply Saturation / Vibrance in Rec.709 Luma
    if (sat !== 1 || vib !== 0) {
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const maxC = Math.max(r, g, b);
      const minC = Math.min(r, g, b);
      const currentSat = (maxC - minC) / (maxC + 0.001);
      const vibFactor = 1.0 + vib * (1.0 - currentSat);
      const totalSat = sat * vibFactor;

      r = luma + (r - luma) * totalSat;
      g = luma + (g - luma) * totalSat;
      b = luma + (b - luma) * totalSat;
    }

    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, b));
  }
}
