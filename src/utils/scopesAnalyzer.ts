/**
 * Real-time Video Scopes Analyzer (FreeCut style)
 * Generates Waveform (IRE 0-100), RGB Parade, Vectorscope, and Histogram
 */

export type ScopeMode = 'waveform' | 'parade' | 'vectorscope' | 'histogram';

export class ScopesAnalyzer {
  private offscreenCanvas: HTMLCanvasElement;
  private offscreenCtx: CanvasRenderingContext2D | null;

  constructor() {
    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCtx = this.offscreenCanvas.getContext('2d', { willReadFrequently: true });
  }

  /**
   * Sample pixel data from source canvas downscaled for high-FPS scope rendering
   */
  private sampleFrame(sourceCanvas: HTMLCanvasElement, sampleWidth = 240, sampleHeight = 135): ImageData | null {
    if (!this.offscreenCtx || sourceCanvas.width === 0 || sourceCanvas.height === 0) return null;

    this.offscreenCanvas.width = sampleWidth;
    this.offscreenCanvas.height = sampleHeight;

    this.offscreenCtx.drawImage(sourceCanvas, 0, 0, sampleWidth, sampleHeight);
    return this.offscreenCtx.getImageData(0, 0, sampleWidth, sampleHeight);
  }

  /**
   * Render Waveform Monitor (0 - 100 IRE)
   */
  public renderWaveform(
    targetCtx: CanvasRenderingContext2D,
    sourceCanvas: HTMLCanvasElement,
    width: number,
    height: number
  ): void {
    const imgData = this.sampleFrame(sourceCanvas, 180, 100);
    if (!imgData) return;

    targetCtx.fillStyle = '#0a0c10';
    targetCtx.fillRect(0, 0, width, height);

    // Draw Graticule Lines (IRE 0, 25, 50, 75, 100)
    targetCtx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    targetCtx.lineWidth = 1;
    targetCtx.font = '9px monospace';
    targetCtx.fillStyle = 'rgba(255, 255, 255, 0.4)';

    const ireLevels = [100, 75, 50, 25, 0];
    ireLevels.forEach((ire) => {
      const y = height - (ire / 100) * (height - 16) - 8;
      targetCtx.beginPath();
      targetCtx.moveTo(24, y);
      targetCtx.lineTo(width, y);
      targetCtx.stroke();
      targetCtx.fillText(`${ire}`, 2, y + 3);
    });

    const data = imgData.data;
    const sw = imgData.width;
    const sh = imgData.height;
    const drawW = width - 28;
    const drawH = height - 16;

    targetCtx.fillStyle = 'rgba(56, 189, 248, 0.25)'; // Light cyan phosphor glow

    for (let x = 0; x < sw; x++) {
      const targetX = 26 + (x / sw) * drawW;
      for (let y = 0; y < sh; y++) {
        const idx = (y * sw + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        // Rec.709 Luma
        const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        const targetY = height - 8 - (luma / 255) * drawH;

        targetCtx.fillRect(targetX, targetY, 1.5, 1.5);
      }
    }
  }

  /**
   * Render RGB Parade (Separate Red, Green, Blue columns)
   */
  public renderRGBParade(
    targetCtx: CanvasRenderingContext2D,
    sourceCanvas: HTMLCanvasElement,
    width: number,
    height: number
  ): void {
    const imgData = this.sampleFrame(sourceCanvas, 150, 80);
    if (!imgData) return;

    targetCtx.fillStyle = '#0a0c10';
    targetCtx.fillRect(0, 0, width, height);

    const colW = width / 3;
    const drawH = height - 16;

    // Background dividers & graticules
    targetCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    targetCtx.lineWidth = 1;
    targetCtx.beginPath();
    targetCtx.moveTo(colW, 0);
    targetCtx.lineTo(colW, height);
    targetCtx.moveTo(colW * 2, 0);
    targetCtx.lineTo(colW * 2, height);
    targetCtx.stroke();

    // Labels
    targetCtx.font = 'bold 9px monospace';
    targetCtx.fillStyle = '#f87171';
    targetCtx.fillText('RED', 6, 12);
    targetCtx.fillStyle = '#4ade80';
    targetCtx.fillText('GREEN', colW + 6, 12);
    targetCtx.fillStyle = '#60a5fa';
    targetCtx.fillText('BLUE', colW * 2 + 6, 12);

    const data = imgData.data;
    const sw = imgData.width;
    const sh = imgData.height;

    for (let x = 0; x < sw; x++) {
      const rx = (x / sw) * colW;
      const gx = colW + rx;
      const bx = colW * 2 + rx;

      for (let y = 0; y < sh; y++) {
        const idx = (y * sw + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        const ry = height - 8 - (r / 255) * drawH;
        const gy = height - 8 - (g / 255) * drawH;
        const by = height - 8 - (b / 255) * drawH;

        targetCtx.fillStyle = 'rgba(248, 113, 113, 0.22)';
        targetCtx.fillRect(rx, ry, 1.2, 1.2);

        targetCtx.fillStyle = 'rgba(74, 222, 128, 0.22)';
        targetCtx.fillRect(gx, gy, 1.2, 1.2);

        targetCtx.fillStyle = 'rgba(96, 165, 250, 0.22)';
        targetCtx.fillRect(bx, by, 1.2, 1.2);
      }
    }
  }

  /**
   * Render Vectorscope (Cb / Cr polar color wheel with skin tone guide)
   */
  public renderVectorscope(
    targetCtx: CanvasRenderingContext2D,
    sourceCanvas: HTMLCanvasElement,
    width: number,
    height: number
  ): void {
    const imgData = this.sampleFrame(sourceCanvas, 120, 80);
    if (!imgData) return;

    targetCtx.fillStyle = '#0a0c10';
    targetCtx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    // Draw polar circle
    targetCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    targetCtx.lineWidth = 1;
    targetCtx.beginPath();
    targetCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    targetCtx.stroke();

    // Crosshairs
    targetCtx.beginPath();
    targetCtx.moveTo(centerX - radius, centerY);
    targetCtx.lineTo(centerX + radius, centerY);
    targetCtx.moveTo(centerX, centerY - radius);
    targetCtx.lineTo(centerX, centerY + radius);
    targetCtx.stroke();

    // Skin Tone / I-Line (approx 123 degrees / -57 deg)
    targetCtx.strokeStyle = 'rgba(251, 191, 36, 0.4)'; // Amber skin tone indicator
    targetCtx.beginPath();
    targetCtx.moveTo(centerX, centerY);
    targetCtx.lineTo(
      centerX + Math.cos(-Math.PI * 0.32) * radius,
      centerY + Math.sin(-Math.PI * 0.32) * radius
    );
    targetCtx.stroke();

    const data = imgData.data;
    const len = data.length;

    targetCtx.fillStyle = 'rgba(168, 85, 247, 0.25)'; // Purple/cyan phosphor

    for (let i = 0; i < len; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // RGB to YCbCr conversion
      const cb = -0.168736 * r - 0.331264 * g + 0.5 * b;
      const cr = 0.5 * r - 0.418688 * g - 0.081312 * b;

      const px = centerX + (cb / 128) * (radius * 0.85);
      const py = centerY - (cr / 128) * (radius * 0.85);

      targetCtx.fillRect(px, py, 1.5, 1.5);
    }
  }

  /**
   * Render Luminance / RGB Histogram (256 bins)
   */
  public renderHistogram(
    targetCtx: CanvasRenderingContext2D,
    sourceCanvas: HTMLCanvasElement,
    width: number,
    height: number
  ): void {
    const imgData = this.sampleFrame(sourceCanvas, 160, 90);
    if (!imgData) return;

    targetCtx.fillStyle = '#0a0c10';
    targetCtx.fillRect(0, 0, width, height);

    const rBins = new Uint32Array(256);
    const gBins = new Uint32Array(256);
    const bBins = new Uint32Array(256);

    const data = imgData.data;
    const len = data.length;

    for (let i = 0; i < len; i += 4) {
      rBins[data[i]]++;
      gBins[data[i + 1]]++;
      bBins[data[i + 2]]++;
    }

    let maxBin = 1;
    for (let i = 0; i < 256; i++) {
      if (rBins[i] > maxBin) maxBin = rBins[i];
      if (gBins[i] > maxBin) maxBin = gBins[i];
      if (bBins[i] > maxBin) maxBin = bBins[i];
    }

    const binW = width / 256;

    // Draw overlapping R, G, B channels with blend
    targetCtx.globalCompositeOperation = 'screen';

    // Red
    targetCtx.fillStyle = 'rgba(239, 68, 68, 0.7)';
    for (let i = 0; i < 256; i++) {
      const h = (rBins[i] / maxBin) * (height - 12);
      targetCtx.fillRect(i * binW, height - h, binW + 0.5, h);
    }

    // Green
    targetCtx.fillStyle = 'rgba(34, 197, 94, 0.7)';
    for (let i = 0; i < 256; i++) {
      const h = (gBins[i] / maxBin) * (height - 12);
      targetCtx.fillRect(i * binW, height - h, binW + 0.5, h);
    }

    // Blue
    targetCtx.fillStyle = 'rgba(59, 130, 246, 0.7)';
    for (let i = 0; i < 256; i++) {
      const h = (bBins[i] / maxBin) * (height - 12);
      targetCtx.fillRect(i * binW, height - h, binW + 0.5, h);
    }

    targetCtx.globalCompositeOperation = 'source-over';
  }
}

export const globalScopesAnalyzer = new ScopesAnalyzer();
