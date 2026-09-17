import React, { useRef, useEffect, useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import { useProjectStore } from '../../stores/projectStore';
import { usePlaybackStore } from '../../stores/playbackStore';
import { useUiStore } from '../../stores/uiStore';
import { TimelineToolbar } from './TimelineToolbar';
import { TimelineRuler } from './TimelineRuler';
import { TrackHeader } from './TrackHeader';
import { TrackRow } from './TrackRow';
import { Playhead } from './Playhead';
import { formatSMPTE } from '../../utils/time';
import { Plus } from 'lucide-react';

/**
 * Timeline shell – reads high-frequency state from Zustand,
 * mutations (addTrack) still via EditorContext.
 */
export const TimelineContainer: React.FC = () => {
  const { addTrack } = useEditor();

  const tracks = useProjectStore((s) => s.tracks);
  const totalDuration = useProjectStore((s) => s.totalDuration);

  const currentTime = usePlaybackStore((s) => s.currentTime);
  const isPlaying = usePlaybackStore((s) => s.isPlaying);
  const inPoint = usePlaybackStore((s) => s.inPoint);
  const outPoint = usePlaybackStore((s) => s.outPoint);

  const zoom = useUiStore((s) => s.zoom);
  const toolMode = useUiStore((s) => s.toolMode);
  const activeSnapGuide = useUiStore((s) => s.activeSnapGuide);

  const rulerScrollRef = useRef<HTMLDivElement | null>(null);
  const tracksScrollRef = useRef<HTMLDivElement | null>(null);
  const headerScrollRef = useRef<HTMLDivElement | null>(null);
  const [isHandPanning, setIsHandPanning] = useState(false);

  const minSeconds = Math.max(30, totalDuration + 15);
  const totalWidth = Math.max(1200, minSeconds * zoom);

  useEffect(() => {
    if (!isPlaying || !tracksScrollRef.current) return;
    const playheadPx = currentTime * zoom;
    const scrollLeft = tracksScrollRef.current.scrollLeft;
    const clientWidth = tracksScrollRef.current.clientWidth;

    if (playheadPx > scrollLeft + clientWidth - 60) {
      tracksScrollRef.current.scrollLeft = playheadPx - 100;
    } else if (playheadPx < scrollLeft) {
      tracksScrollRef.current.scrollLeft = Math.max(0, playheadPx - 20);
    }
  }, [currentTime, isPlaying, zoom]);

  const handleTracksScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollLeft, scrollTop } = e.currentTarget;
    if (rulerScrollRef.current) {
      rulerScrollRef.current.scrollLeft = scrollLeft;
    }
    if (headerScrollRef.current) {
      headerScrollRef.current.scrollTop = scrollTop;
    }
  };

  const handleHeaderWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (tracksScrollRef.current) {
      tracksScrollRef.current.scrollTop += e.deltaY;
    }
  };

  const handleTimelineMouseDown = (e: React.MouseEvent) => {
    if (toolMode !== 'hand') return;
    setIsHandPanning(true);
    const startX = e.clientX;
    const startY = e.clientY;
    const initialScrollLeft = tracksScrollRef.current?.scrollLeft || 0;
    const initialScrollTop = tracksScrollRef.current?.scrollTop || 0;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!tracksScrollRef.current) return;
      tracksScrollRef.current.scrollLeft = initialScrollLeft - (moveEvent.clientX - startX);
      tracksScrollRef.current.scrollTop = initialScrollTop - (moveEvent.clientY - startY);
    };

    const onMouseUp = () => {
      setIsHandPanning(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const inPx = inPoint !== null ? inPoint * zoom : null;
  const outPx = outPoint !== null ? outPoint * zoom : null;

  return (
    <div className="h-[46vh] min-h-[330px] bg-white border-t border-[#dde1e7] flex flex-col select-none shrink-0 z-20 mt-1.5">
      <TimelineToolbar />

      <div className="h-7 bg-white border-b border-[#dde1e7] flex shrink-0 z-20">
        <div className="w-24 bg-white border-r border-[#dde1e7] px-2 flex items-center justify-between text-[9px] font-semibold text-slate-500 shrink-0">
          <span className="font-mono text-sky-500 font-bold tracking-wider">
            {formatSMPTE(currentTime)}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => addTrack('video')}
              title="快速新增视频轨道 (V)"
              className="px-1 py-0.2 rounded bg-blue-950/60 hover:bg-blue-900 border border-blue-700/50 text-blue-300 flex items-center gap-0.5 text-[8px] font-mono cursor-pointer transition-colors"
            >
              <Plus className="w-2 h-2" />
              <span>V</span>
            </button>
            <button
              type="button"
              onClick={() => addTrack('audio')}
              title="快速新增音频轨道 (A)"
              className="px-1 py-0.2 rounded bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-700/50 text-emerald-300 flex items-center gap-0.5 text-[8px] font-mono cursor-pointer transition-colors"
            >
              <Plus className="w-2 h-2" />
              <span>A</span>
            </button>
          </div>
        </div>

        <div ref={rulerScrollRef} className="flex-1 overflow-hidden relative">
          <TimelineRuler totalWidth={totalWidth} />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        <div
          ref={headerScrollRef}
          onWheel={handleHeaderWheel}
          className="w-24 bg-white border-r border-[#dde1e7] flex flex-col shrink-0 z-20 overflow-hidden"
        >
          {tracks.map((track, idx) => (
            <TrackHeader
              key={track.id}
              track={track}
              index={idx}
              totalTracks={tracks.length}
            />
          ))}
        </div>

        <div
          ref={tracksScrollRef}
          onScroll={handleTracksScroll}
          onMouseDown={handleTimelineMouseDown}
          className={`flex-1 flex flex-col overflow-x-auto overflow-y-auto relative bg-[#fbfcfe] ${
            toolMode === 'hand'
              ? isHandPanning
                ? 'cursor-grabbing'
                : 'cursor-grab'
              : ''
          }`}
        >
          <div style={{ width: `${totalWidth}px` }} className="relative flex flex-col min-h-full">
            {inPx !== null && outPx !== null && outPx > inPx && (
              <div
                className="absolute top-0 bottom-0 bg-blue-500/5 border-x border-blue-500/30 pointer-events-none z-10"
                style={{
                  left: `${inPx}px`,
                  width: `${outPx - inPx}px`,
                }}
              />
            )}

            {activeSnapGuide && (
              <div
                className="absolute top-0 bottom-0 w-px bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,1)] z-40 pointer-events-none"
                style={{ left: `${activeSnapGuide.time * zoom}px` }}
              >
                <div className="absolute top-2 left-1 bg-cyan-600 text-white font-mono text-[8px] px-1 py-0.5 rounded shadow whitespace-nowrap">
                  {activeSnapGuide.label}
                </div>
              </div>
            )}

            <Playhead timelineScrollRef={tracksScrollRef} />

            {tracks.map((track) => (
              <TrackRow key={track.id} track={track} totalWidth={totalWidth} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
