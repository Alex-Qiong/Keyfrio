import React, { useEffect, useRef, useState } from 'react';
import { Activity, BarChart2, Compass, Layers, Minimize2, RefreshCw } from 'lucide-react';
import { globalScopesAnalyzer, ScopeMode } from '../../utils/scopesAnalyzer';

interface ScopesPanelProps {
  sourceCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  onClose?: () => void;
}

export const ScopesPanel: React.FC<ScopesPanelProps> = ({ sourceCanvasRef, onClose }) => {
  const [scopeMode, setScopeMode] = useState<ScopeMode>('waveform');
  const scopeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const renderScope = () => {
      if (scopeCanvasRef.current && sourceCanvasRef.current) {
        const targetCtx = scopeCanvasRef.current.getContext('2d');
        const sourceCanvas = sourceCanvasRef.current;
        const width = scopeCanvasRef.current.width;
        const height = scopeCanvasRef.current.height;

        if (targetCtx && sourceCanvas.width > 0 && sourceCanvas.height > 0) {
          switch (scopeMode) {
            case 'waveform':
              globalScopesAnalyzer.renderWaveform(targetCtx, sourceCanvas, width, height);
              break;
            case 'parade':
              globalScopesAnalyzer.renderRGBParade(targetCtx, sourceCanvas, width, height);
              break;
            case 'vectorscope':
              globalScopesAnalyzer.renderVectorscope(targetCtx, sourceCanvas, width, height);
              break;
            case 'histogram':
              globalScopesAnalyzer.renderHistogram(targetCtx, sourceCanvas, width, height);
              break;
          }
        }
      }
      animFrameRef.current = requestAnimationFrame(renderScope);
    };

    animFrameRef.current = requestAnimationFrame(renderScope);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [scopeMode, sourceCanvasRef]);

  return (
    <div
      id="freecut-scopes-panel"
      className="bg-neutral-950/95 backdrop-blur-md border border-neutral-800 rounded-xl p-3 shadow-2xl flex flex-col gap-2 w-full max-w-lg"
    >
      {/* Top Header & Mode Switcher */}
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2 px-1">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold tracking-wider text-neutral-200 uppercase font-mono">
            FreeCut 实时示波器 (Scopes)
          </span>
        </div>

        <div className="flex items-center gap-1">
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
              title="关闭示波器"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-neutral-900/80 p-1 rounded-lg border border-neutral-800">
        <button
          onClick={() => setScopeMode('waveform')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded text-[11px] font-medium transition-all ${
            scopeMode === 'waveform'
              ? 'bg-neutral-800 text-sky-400 shadow-sm border border-neutral-700'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Activity className="w-3 h-3" />
          波形 (Waveform)
        </button>
        <button
          onClick={() => setScopeMode('parade')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded text-[11px] font-medium transition-all ${
            scopeMode === 'parade'
              ? 'bg-neutral-800 text-rose-400 shadow-sm border border-neutral-700'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Layers className="w-3 h-3" />
          RGB 分量 (Parade)
        </button>
        <button
          onClick={() => setScopeMode('vectorscope')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded text-[11px] font-medium transition-all ${
            scopeMode === 'vectorscope'
              ? 'bg-neutral-800 text-purple-400 shadow-sm border border-neutral-700'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Compass className="w-3 h-3" />
          矢量图 (Vector)
        </button>
        <button
          onClick={() => setScopeMode('histogram')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded text-[11px] font-medium transition-all ${
            scopeMode === 'histogram'
              ? 'bg-neutral-800 text-emerald-400 shadow-sm border border-neutral-700'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <BarChart2 className="w-3 h-3" />
          直方图 (Hist)
        </button>
      </div>

      {/* Scope Canvas Display */}
      <div className="relative w-full aspect-[16/9] bg-black/90 rounded-lg border border-neutral-800 overflow-hidden flex items-center justify-center">
        <canvas
          ref={scopeCanvasRef}
          width={400}
          height={225}
          className="w-full h-full object-contain"
        />
        <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-mono text-neutral-500 bg-neutral-950/60 px-1.5 py-0.5 rounded border border-neutral-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          REALTIME GPU
        </div>
      </div>
    </div>
  );
};
