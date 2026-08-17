import {
  AudioSettings,
  EqualizerSettings,
  CompressorSettings,
  ReverbSettings,
  DelaySettings,
  DistortionSettings,
  NoiseGateSettings,
} from '../types/editor';

/**
 * Generate distortion curve for analog warmth / overdrive
 */
function makeDistortionCurve(amount = 20): Float32Array {
  const k = Math.max(1, amount);
  const n_samples = 44100;
  const curve = new Float32Array(n_samples);
  const deg = Math.PI / 180;
  for (let i = 0; i < n_samples; ++i) {
    const x = (i * 2) / n_samples - 1;
    curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
  }
  return curve;
}

/**
 * Generate synthetic impulse response for algorithmic reverb
 */
function createReverbImpulse(ctx: AudioContext, duration = 1.5, decay = 2.0): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * duration;
  const impulse = ctx.createBuffer(2, length, sampleRate);
  const left = impulse.getChannelData(0);
  const right = impulse.getChannelData(1);

  for (let i = 0; i < length; i++) {
    const t = i / sampleRate;
    const env = Math.exp(-t * decay);
    left[i] = (Math.random() * 2 - 1) * env;
    right[i] = (Math.random() * 2 - 1) * env;
  }
  return impulse;
}

interface ClipAudioNodes {
  source: MediaElementAudioSourceNode;
  // 5-band EQ
  band60: BiquadFilterNode;
  band250: BiquadFilterNode;
  band1000: BiquadFilterNode;
  band4000: BiquadFilterNode;
  band12000: BiquadFilterNode;
  // Distortion
  distortion: WaveShaperNode;
  distortionWet: GainNode;
  distortionDry: GainNode;
  // Compressor
  compressor: DynamicsCompressorNode;
  // Delay
  delayNode: DelayNode;
  delayFeedback: GainNode;
  delayWet: GainNode;
  // Reverb
  convolver: ConvolverNode;
  reverbWet: GainNode;
  // Noise Gate / Voice Clarity
  noiseGateFilter: BiquadFilterNode;
  // Panner & Volume
  panner: StereoPannerNode;
  gain: GainNode;
}

/**
 * FreeCut AudioMass-Grade Web Audio Engine
 * Provides Real-time 5-Band EQ, Dynamics Compressor, Algorithmic Reverb,
 * Delay/Echo, Distortion, Spatial Panning, and FFT VU Metering
 */
export class WebAudioEngine {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private clipNodes: Map<string, ClipAudioNodes> = new Map();

  public init(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();

      this.masterGain = this.audioCtx.createGain();
      this.analyserNode = this.audioCtx.createAnalyser();
      this.analyserNode.fftSize = 256;
      this.analyserNode.smoothingTimeConstant = 0.8;

      this.masterGain.connect(this.analyserNode);
      this.analyserNode.connect(this.audioCtx.destination);
    }

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    return this.audioCtx;
  }

  public getAudioContext(): AudioContext | null {
    return this.audioCtx;
  }

  public resume(): void {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  /**
   * Connect an HTML5 Audio/Video element through the Web Audio Graph
   */
  public attachMediaElement(clipId: string, mediaElement: HTMLMediaElement, settings?: AudioSettings): void {
    const ctx = this.init();

    if (this.clipNodes.has(clipId)) {
      this.updateClipAudioSettings(clipId, settings);
      return;
    }

    try {
      const source = ctx.createMediaElementSource(mediaElement);

      // 1. Noise gate / Lowcut
      const noiseGateFilter = ctx.createBiquadFilter();
      noiseGateFilter.type = 'highpass';
      noiseGateFilter.frequency.value = 30;

      // 2. 5-Band Equalizer filters
      const band60 = ctx.createBiquadFilter();
      band60.type = 'lowshelf';
      band60.frequency.value = 60;
      band60.gain.value = 0;

      const band250 = ctx.createBiquadFilter();
      band250.type = 'peaking';
      band250.frequency.value = 250;
      band250.Q.value = 1.0;
      band250.gain.value = 0;

      const band1000 = ctx.createBiquadFilter();
      band1000.type = 'peaking';
      band1000.frequency.value = 1000;
      band1000.Q.value = 1.0;
      band1000.gain.value = 0;

      const band4000 = ctx.createBiquadFilter();
      band4000.type = 'peaking';
      band4000.frequency.value = 4000;
      band4000.Q.value = 1.0;
      band4000.gain.value = 0;

      const band12000 = ctx.createBiquadFilter();
      band12000.type = 'highshelf';
      band12000.frequency.value = 12000;
      band12000.gain.value = 0;

      // 3. Distortion / Saturation
      const distortion = ctx.createWaveShaper();
      distortion.curve = makeDistortionCurve(1);
      distortion.oversample = '2x';
      const distortionWet = ctx.createGain();
      distortionWet.gain.value = 0;
      const distortionDry = ctx.createGain();
      distortionDry.gain.value = 1;

      // 4. Dynamics Compressor
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = settings?.compressor?.enabled ? settings.compressor.threshold : 0;
      compressor.ratio.value = settings?.compressor?.enabled ? settings.compressor.ratio : 1;
      compressor.attack.value = settings?.compressor?.enabled ? settings.compressor.attack : 0.003;
      compressor.release.value = settings?.compressor?.enabled ? settings.compressor.release : 0.25;

      // 5. Delay & Reverb Effect bus
      const delayNode = ctx.createDelay(2.0);
      delayNode.delayTime.value = 0.3;
      const delayFeedback = ctx.createGain();
      delayFeedback.gain.value = 0.3;
      const delayWet = ctx.createGain();
      delayWet.gain.value = 0;

      delayNode.connect(delayFeedback);
      delayFeedback.connect(delayNode);
      delayNode.connect(delayWet);

      const convolver = ctx.createConvolver();
      convolver.buffer = createReverbImpulse(ctx, 1.5, 2.0);
      const reverbWet = ctx.createGain();
      reverbWet.gain.value = 0;
      convolver.connect(reverbWet);

      // 6. Stereo Panner & Master Clip Gain
      const panner = ctx.createStereoPanner();
      const gain = ctx.createGain();

      // Serial Signal Chain:
      // Source -> NoiseGate -> Band60 -> Band250 -> Band1000 -> Band4000 -> Band12000 -> Compressor -> Distortion/Dry -> Panner -> Gain -> Master
      source.connect(noiseGateFilter);
      noiseGateFilter.connect(band60);
      band60.connect(band250);
      band250.connect(band1000);
      band1000.connect(band4000);
      band4000.connect(band12000);
      band12000.connect(compressor);

      // Compressor output feeds:
      compressor.connect(distortionDry);
      distortionDry.connect(panner);

      compressor.connect(distortion);
      distortion.connect(distortionWet);
      distortionWet.connect(panner);

      compressor.connect(delayNode);
      delayWet.connect(panner);

      compressor.connect(convolver);
      reverbWet.connect(panner);

      panner.connect(gain);

      if (this.masterGain) {
        gain.connect(this.masterGain);
      }

      const nodes: ClipAudioNodes = {
        source,
        band60,
        band250,
        band1000,
        band4000,
        band12000,
        distortion,
        distortionWet,
        distortionDry,
        compressor,
        delayNode,
        delayFeedback,
        delayWet,
        convolver,
        reverbWet,
        noiseGateFilter,
        panner,
        gain,
      };

      this.clipNodes.set(clipId, nodes);
      this.updateClipAudioSettings(clipId, settings);
    } catch (e) {
      console.warn('Audio node attach note:', e);
    }
  }

  /**
   * Update real-time audio parameters for a clip
   */
  public updateClipAudioSettings(clipId: string, settings?: AudioSettings): void {
    const node = this.clipNodes.get(clipId);
    if (!node || !settings) return;
    const now = this.audioCtx?.currentTime || 0;

    // Volume & Mute
    const vol = settings.muted ? 0 : settings.volume;
    node.gain.gain.setValueAtTime(vol, now);

    // Pan
    if (node.panner.pan) {
      node.panner.pan.setValueAtTime(settings.pan || 0, now);
    }

    // 5-Band Equalizer
    if (settings.equalizer) {
      const eq = settings.equalizer;
      const isEqOn = !!eq.enabled;

      const g60 = isEqOn ? (eq.band60 !== undefined ? eq.band60 : eq.lowGain || 0) : 0;
      const g250 = isEqOn ? (eq.band250 !== undefined ? eq.band250 : (eq.lowGain || 0) * 0.5) : 0;
      const g1000 = isEqOn ? (eq.band1000 !== undefined ? eq.band1000 : eq.midGain || 0) : 0;
      const g4000 = isEqOn ? (eq.band4000 !== undefined ? eq.band4000 : (eq.highGain || 0) * 0.7) : 0;
      const g12000 = isEqOn ? (eq.band12000 !== undefined ? eq.band12000 : eq.highGain || 0) : 0;

      node.band60.gain.setValueAtTime(g60, now);
      node.band250.gain.setValueAtTime(g250, now);
      node.band1000.gain.setValueAtTime(g1000, now);
      node.band4000.gain.setValueAtTime(g4000, now);
      node.band12000.gain.setValueAtTime(g12000, now);
    }

    // Compressor
    if (settings.compressor) {
      const comp = settings.compressor;
      node.compressor.threshold.setValueAtTime(comp.enabled ? comp.threshold : 0, now);
      node.compressor.ratio.setValueAtTime(comp.enabled ? comp.ratio : 1, now);
      node.compressor.attack.setValueAtTime(comp.enabled ? comp.attack : 0.003, now);
      node.compressor.release.setValueAtTime(comp.enabled ? comp.release : 0.25, now);
    }

    // Reverb
    if (settings.reverb) {
      const rev = settings.reverb;
      const wet = rev.enabled ? Math.max(0, Math.min(1, rev.wet)) : 0;
      node.reverbWet.gain.setValueAtTime(wet, now);
    }

    // Delay
    if (settings.delay) {
      const del = settings.delay;
      const wet = del.enabled ? Math.max(0, Math.min(1, del.wet)) : 0;
      node.delayWet.gain.setValueAtTime(wet, now);
      node.delayNode.delayTime.setValueAtTime(del.time || 0.3, now);
      node.delayFeedback.gain.setValueAtTime(Math.min(0.85, del.feedback || 0.3), now);
    }

    // Distortion
    if (settings.distortion) {
      const dist = settings.distortion;
      if (dist.enabled && dist.drive > 1) {
        node.distortion.curve = makeDistortionCurve(dist.drive);
        node.distortionWet.gain.setValueAtTime(0.8, now);
        node.distortionDry.gain.setValueAtTime(0.2, now);
      } else {
        node.distortionWet.gain.setValueAtTime(0, now);
        node.distortionDry.gain.setValueAtTime(1, now);
      }
    }

    // Noise gate / High-pass
    if (settings.noiseGate && settings.noiseGate.enabled) {
      node.noiseGateFilter.frequency.setValueAtTime(80, now);
    } else {
      node.noiseGateFilter.frequency.setValueAtTime(20, now);
    }
  }

  /**
   * Get real-time RMS audio level and decibel VU reading (-60dB to 0dB)
   */
  public getMasterAudioLevel(): { rms: number; db: number; left: number; right: number } {
    if (!this.analyserNode) {
      return { rms: 0, db: -60, left: 0, right: 0 };
    }

    const data = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteTimeDomainData(data);

    let sumSquares = 0;
    for (let i = 0; i < data.length; i++) {
      const normalized = (data[i] - 128) / 128;
      sumSquares += normalized * normalized;
    }

    const rms = Math.sqrt(sumSquares / data.length);
    const db = rms > 0.0001 ? 20 * Math.log10(rms) : -60;

    return {
      rms,
      db: Math.max(-60, Math.min(0, db)),
      left: Math.min(1.0, rms * 1.5),
      right: Math.min(1.0, rms * 1.5),
    };
  }

  /**
   * Get real-time FFT Frequency spectrum data for visualizer
   */
  public getFrequencyData(): Uint8Array {
    if (!this.analyserNode) {
      return new Uint8Array(0);
    }
    const data = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteFrequencyData(data);
    return data;
  }
}

export const globalAudioEngine = new WebAudioEngine();

