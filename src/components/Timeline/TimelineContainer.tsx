import React, { useRef, useEffect, useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import { TimelineToolbar } from './TimelineToolbar';
import { TimelineRuler } from './TimelineRuler';
import { TrackHeader } from './TrackHeader';
import { TrackRow } from './TrackRow';
import { Playhead } from './Playhead';
import { formatSMPTE } from '../../utils/time';
import { Plus } from 'lucide-react';

export const TimelineContainer: React.FC = () => {
  const {
    project,
    zoom,
    totalDuration,
    currentTime,
    isPlaying,
    activeSnapGuide,
    inPoint,
    outPoint,
    toolMode,
    addTrack,
  } = useEditor();

  const rulerScrollRef = useRef<HTMLDivElement | null>(null);
  const tracksScrollRef = useRef<HTMLDivElement | null>(null);
  const headerScrollRef = useRef<HTMLDivElement | null>(null);
  const [isHandPanning, setIsHandPanning] = useState(false);

  // Compute total canvas scroll width
  const minSeconds = Math.max(30, totalDuration + 15);
  const totalWidth = Math.max(1200, minSeconds * zoom);

  // Auto-scroll timeline to follow playhead when playing
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

  // Synchronize horizontal scroll to Ruler and vertical scroll to Track Headers
  const handleTracksScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollLeft, scrollTop } = e.currentTarget;
    if (rulerScrollRef.current) {
      rulerScrollRef.current.scrollLeft = scrollLeft;
    }
    if (headerScrollRef.current) {
      headerScrollRef.current.scrollTop = scrollTop;
    }
  };

  // Synchronize mouse wheel on track header to scroll track lanes
  const handleHeaderWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (tracksScrollRef.current) {
      tracksScrollRef.current.scrollTop += e.deltaY;
    }
  };

  // Hand tool panning handler
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

  // In / Out region highlights
  const inPx = inPoint !== null ? inPoint * zoom : null;
  const outPx = outPoint !== null ? outPoint * zoom : null;

  return (
    <div className="h-72 bg-[#0e0f14] border-t border-[#20222a] flex flex-col select-none shrink-0 z-20">
      {/* Top Toolbar */}
      <TimelineToolbar />

      {/* 1. Dedicated Ruler Bar (Height: 24px) */}
      <div className="h-6 bg-[#101116] border-b border-[#20222a] flex shrink-0 z-20">
        {/* Left Corner Box: Timecode + Quick Track Add (Fixed 192px) */}
        <div className="w-48 bg-[#101116] border-r border-[#20222a] px-2 flex items-center justify-between text-[9px] font-semibold text-neutral-400 shrink-0">
          <span className="font-mono text-cyan-400 font-bold tracking-wider">
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

        {/* Right: Ruler (Horizontal Scroll synced with Track Lanes) */}
        <div ref={rulerScrollRef} className="flex-1 overflow-hidden relative">
          <TimelineRuler totalWidth={totalWidth} />
        </div>
      </div>

      {/* 2. Tracks Workspace (Flex-1, Scrollable) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Track Headers (Fixed Width 192px, Vertical Scroll synced) */}
        <div
          ref={headerScrollRef}
          onWheel={handleHeaderWheel}
          className="w-48 bg-[#131419] border-r border-[#20222a] flex flex-col shrink-0 z-20 shadow-md overflow-hidden"
        >
          {project.tracks.map((track, idx) => (
            <TrackHeader
              key={track.id}
              track={track}
              index={idx}
              totalTracks={project.tracks.length}
            />
          ))}
        </div>

        {/* Right Scrollable Track Lanes (Both Horizontal & Vertical Scroll) */}
        <div
          ref={tracksScrollRef}
          onScroll={handleTracksScroll}
          onMouseDown={handleTimelineMouseDown}
          className={`flex-1 flex flex-col overflow-x-auto overflow-y-auto relative bg-[#0d0e12] ${
            toolMode === 'hand'
              ? isHandPanning
                ? 'cursor-grabbing'
                : 'cursor-grab'
              : ''
          }`}
        >
          <div style={{ width: `${totalWidth}px` }} className="relative flex flex-col min-h-full">
            {/* In / Out Work Area Overlay on tracks */}
            {inPx !== null && outPx !== null && outPx > inPx && (
              <div
                className="absolute top-0 bottom-0 bg-blue-500/5 border-x border-blue-500/30 pointer-events-none z-10"
                style={{
                  left: `${inPx}px`,
                  width: `${outPx - inPx}px`,
                }}
              />
            )}

            {/* Active Snap Guide Line */}
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

            {/* Red Playhead (traversing all track rows) */}
            <Playhead timelineScrollRef={tracksScrollRef} />

            {/* Render all track rows */}
            {project.tracks.map((track) => (
              <TrackRow key={track.id} track={track} totalWidth={totalWidth} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
