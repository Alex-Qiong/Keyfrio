import React, { useState, useMemo } from 'react';
import {
  Pointer,
  Scissors,
  Trash2,
  Copy,
  Magnet,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Plus,
  Undo2,
  Redo2,
  Film,
  Music2,
  Waves,
  Hand,
  RotateCcw,
  SlidersHorizontal,
  Layers,
  Link2,
  Link2Off,
} from 'lucide-react';
import { useEditor } from '../../context/EditorContext';
import { useProjectStore } from '../../stores/projectStore';
import { usePlaybackStore } from '../../stores/playbackStore';
import { useSelectionStore } from '../../stores/selectionStore';
import { useUiStore } from '../../stores/uiStore';
import { MediaType } from '../../types/editor';

/**
 * Timeline toolbar — obsidian restyle.
 * Grouped: tools | edit | in/out | tracks | view
 */
export const TimelineToolbar: React.FC = () => {
  const {
    splitClip, deleteSelectedClips, duplicateClip, toggleLinkSelectedClips,
    setSnapping, setToolMode, setRippleMode, setTrackHeight,
    setInPoint, setOutPoint, setZoom, addTrack,
    canUndo, canRedo, undo, redo, resetProject,
  } = useEditor();

  const tracks = useProjectStore((s) => s.tracks);
  const totalDuration = useProjectStore((s) => s.totalDuration);
  const currentTime = usePlaybackStore((s) => s.currentTime);
  const inPoint = usePlaybackStore((s) => s.inPoint);
  const outPoint = usePlaybackStore((s) => s.outPoint);
  const selectedClipIds = useSelectionStore((s) => s.selectedClipIds);
  const zoom = useUiStore((s) => s.zoom);
  const toolMode = useUiStore((s) => s.toolMode);
  const snapping = useUiStore((s) => s.snappingEnabled);
  const rippleMode = useUiStore((s) => s.rippleMode);
  const trackHeight = useUiStore((s) => s.trackHeight);

  const [isTrackMenuOpen, setIsTrackMenuOpen] = useState(false);
  const [isHeightMenuOpen, setIsHeightMenuOpen] = useState(false);
  const hasSelection = selectedClipIds.length > 0;

  const isAnyClipLinked = useMemo(() => {
    return tracks.some((t) => t.clips.some((c) => selectedClipIds.includes(c.id) && c.isLinked));
  }, [tracks, selectedClipIds]);

  const handleZoomFit = () => {
    setZoom(Math.max(15, Math.min(100, 800 / (totalDuration || 16))));
  };

  const toolBtn = (mode: string, active: boolean) =>
    `kf-icon-btn px-2.5 py-1.5 !rounded-lg ${active ? 'active' : ''}`;

  return (
    <div className="h-11 bg-[var(--kf-surface-1)] border-b border-white/[0.06] px-2.5 flex items-center justify-between text-xs select-none shrink-0 z-30 gap-2">
      {/* left: tools */}
      <div className="flex items-center gap-1 min-w-0">
        <div className="flex items-center gap-0.5 p-0.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <button onClick={() => setToolMode('select')} title="选择 (V)" className={toolBtn('select', toolMode === 'select')}>
            <Pointer className="w-3.5 h-3.5" /><span className="text-[11px] font-medium hidden xl:inline">选择</span>
          </button>
          <button onClick={() => setToolMode('blade')} title="剃刀 (C)" className={toolBtn('blade', toolMode === 'blade')}>
            <Scissors className="w-3.5 h-3.5" /><span className="text-[11px] font-medium hidden xl:inline">剃刀</span>
          </button>
          <button onClick={() => setToolMode('hand')} title="抓手 (H)" className={toolBtn('hand', toolMode === 'hand')}>
            <Hand className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="kf-divider-v h-5 mx-1" />

        <button onClick={() => setRippleMode(!rippleMode)} title="波纹编辑 (B)"
          className={`kf-chip !py-1.5 ${rippleMode ? 'active' : ''}`}>
          <Waves className="w-3.5 h-3.5" /><span className="hidden xl:inline">波纹</span>
        </button>
        <button onClick={() => setSnapping(!snapping)} title="磁吸对齐 (N)"
          className={`kf-chip !py-1.5 ${snapping ? 'active' : ''}`}>
          <Magnet className="w-3.5 h-3.5" /><span className="hidden xl:inline">磁吸</span>
        </button>

        <div className="kf-divider-v h-5 mx-1" />

        <button onClick={() => splitClip()} title="在播放头分割 (S)" className="kf-icon-btn p-2">
          <Scissors className="w-3.5 h-3.5 text-cyan-300" />
        </button>
        <button onClick={() => duplicateClip()} disabled={!hasSelection} title="复制 (Ctrl+D)" className="kf-icon-btn p-2 disabled:opacity-30">
          <Copy className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => toggleLinkSelectedClips()} disabled={!hasSelection}
          title={isAnyClipLinked ? '取消绑定 (Ctrl+L)' : '绑定音画 (Ctrl+L)'}
          className={`kf-icon-btn p-2 disabled:opacity-30 ${isAnyClipLinked ? 'active' : ''}`}>
          {isAnyClipLinked ? <Link2 className="w-3.5 h-3.5" /> : <Link2Off className="w-3.5 h-3.5" />}
        </button>
        <button onClick={() => deleteSelectedClips(rippleMode)} disabled={!hasSelection} title="删除 (Del)"
          className="kf-icon-btn p-2 disabled:opacity-30 hover:!text-rose-300">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* center: in/out + add track */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="hidden md:flex items-center gap-0.5 rounded-lg bg-white/[0.03] border border-white/[0.06] px-1 py-0.5 font-mono text-[10px]">
          <button onClick={() => setInPoint(currentTime)} title="入点 (I)"
            className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${inPoint !== null ? 'text-cyan-300 bg-cyan-400/10 font-bold' : 'text-neutral-500 hover:text-white'}`}>
            [ In
          </button>
          <button onClick={() => setOutPoint(currentTime)} title="出点 (O)"
            className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${outPoint !== null ? 'text-cyan-300 bg-cyan-400/10 font-bold' : 'text-neutral-500 hover:text-white'}`}>
            Out ]
          </button>
          {(inPoint !== null || outPoint !== null) && (
            <button onClick={() => { setInPoint(null); setOutPoint(null); }} title="清除 (Alt+X)"
              className="px-1.5 text-rose-400 hover:text-rose-300 cursor-pointer">✕</button>
          )}
        </div>
        <div className="relative">
          <button onClick={() => setIsTrackMenuOpen(!isTrackMenuOpen)}
            className="kf-btn kf-btn-ghost !text-[11px] px-2.5 py-1.5">
            <Plus className="w-3.5 h-3.5 text-cyan-300" /><span className="hidden sm:inline">轨道</span>
          </button>
          {isTrackMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsTrackMenuOpen(false)} />
              <div className="kf-menu absolute top-full left-0 mt-1.5 w-52 z-50 text-xs">
                <div className="px-2.5 py-1.5 text-[10px] font-semibold tracking-wider text-neutral-500 uppercase flex items-center gap-1.5">
                  <Layers className="w-3 h-3" /> 选择轨道类型
                </div>
                {([
                  ['video', Film, '#60a5fa', '视频轨道', '视频 / 字幕 / 动效'],
                  ['audio', Music2, '#34d399', '音频轨道', '人声 / BGM / 音效'],
                ] as [MediaType, React.ElementType, string, string, string][]).map(([type, Icon, color, label, desc]) => (
                  <button key={type} onClick={() => { setIsTrackMenuOpen(false); addTrack(type); }} className="kf-menu-item justify-between">
                    <span className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" style={{ color }} /> {label}
                    </span>
                    <span className="text-[10px] text-neutral-600">{desc}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* right: view */}
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={undo} disabled={!canUndo} title="撤销 (Ctrl+Z)" className="kf-icon-btn p-2 disabled:opacity-30">
          <Undo2 className="w-3.5 h-3.5" />
        </button>
        <button onClick={redo} disabled={!canRedo} title="重做 (Ctrl+Y)" className="kf-icon-btn p-2 disabled:opacity-30">
          <Redo2 className="w-3.5 h-3.5" />
        </button>
        <div className="kf-divider-v h-5 mx-1" />
        <div className="relative">
          <button onClick={() => setIsHeightMenuOpen(!isHeightMenuOpen)} title="轨道高度" className="kf-icon-btn p-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
          {isHeightMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsHeightMenuOpen(false)} />
              <div className="kf-menu absolute top-full right-0 mt-1.5 w-40 z-50 text-xs">
                {([['compact', '紧凑 · 36px'], ['normal', '标准 · 56px'], ['tall', '扩展 · 80px']] as const).map(([v, label]) => (
                  <button key={v} onClick={() => { setTrackHeight(v); setIsHeightMenuOpen(false); }}
                    className={`kf-menu-item justify-between ${trackHeight === v ? '!text-cyan-300' : ''}`}>
                    {label}
                    {trackHeight === v && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <button onClick={() => setZoom((p) => Math.max(10, p - 10))} title="缩小 (-)" className="kf-icon-btn p-2">
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <input type="range" min="10" max="150" value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="kf-slider w-20 hidden sm:block"
          style={{ ['--fill' as any]: `${((zoom - 10) / 140) * 100}%` }}
          title={`缩放 ${Math.round((zoom / 45) * 100)}%`} />
        <button onClick={() => setZoom((p) => Math.min(150, p + 10))} title="放大 (+)" className="kf-icon-btn p-2">
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button onClick={handleZoomFit} title="适应全工程 (Shift+Z)" className="kf-icon-btn p-2">
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
        <div className="kf-divider-v h-5 mx-1" />
        <button
          onClick={() => { if (window.confirm('确定要重置当前工程回到初始状态吗？未导出的修改将丢失。')) resetProject(); }}
          title="重置工程" className="kf-icon-btn p-2 hover:!text-rose-300">
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
