import React, { useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import { Track } from '../../types/editor';
import { ClipItem } from './ClipItem';

interface TrackRowProps {
  track: Track;
  totalWidth: number;
}

export const TrackRow: React.FC<TrackRowProps> = ({ track, totalWidth }) => {
  const { 
    selectClip, 
    seek, 
    zoom, 
    toolMode, 
    splitClipAtTime, 
    trackHeight,
    addMediaAtPosition,
    closeGapAt,
    pasteClips,
  } = useEditor();

  const [isDragOver, setIsDragOver] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; time: number } | null>(null);

  const getHeightClass = () => {
    switch (trackHeight) {
      case 'compact':
        return 'h-9';
      case 'tall':
        return 'h-20';
      default:
        return 'h-14';
    }
  };

  const isLocked = track.isLocked || track.locked;
  const isHidden = track.isHidden || track.visible === false;

  const handleLaneClick = (e: React.MouseEvent) => {
    // If clicking on empty track lane area
    if (e.target === e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const targetTime = Math.max(0, clickX / zoom);

      if (toolMode === 'blade' && !isLocked) {
        splitClipAtTime(track.id, targetTime);
      } else {
        selectClip(null);
        seek(targetTime);
      }
    }
  };

  // Drag and Drop media asset from MediaPanel directly into track
  const handleDragOver = (e: React.DragEvent) => {
    if (isLocked) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isLocked) return;

    try {
      const jsonData = e.dataTransfer.getData('application/json') || e.dataTransfer.getData('text/plain');
      if (jsonData) {
        const mediaPayload = JSON.parse(jsonData);
        const rect = e.currentTarget.getBoundingClientRect();
        const dropX = e.clientX - rect.left;
        const targetTime = Math.max(0, dropX / zoom);
        await addMediaAtPosition(mediaPayload, track.id, targetTime);
      }
    } catch (err) {
      console.warn('Track drop error:', err);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickTime = Math.max(0, clickX / zoom);
      setContextMenu({ x: e.clientX, y: e.clientY, time: clickTime });
    }
  };

  return (
    <>
      <div
        id={`track-row-${track.id}`}
        data-track-id={track.id}
        data-track-type={track.type}
        onClick={handleLaneClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onContextMenu={handleContextMenu}
        className={`${getHeightClass()} border-b border-[#edf0f4] relative bg-[#fbfcfe] hover:bg-[#f7faff] transition-colors ${
          isHidden ? 'opacity-35 grayscale' : ''
        } ${
          isLocked
            ? 'bg-[repeating-linear-gradient(45deg,#f6f7f9,#f6f7f9_10px,#eef1f5_10px,#eef1f5_20px)] cursor-not-allowed'
            : ''
        } ${isDragOver ? 'ring-2 ring-indigo-500/80 bg-indigo-950/20' : ''} ${
          toolMode === 'blade' ? 'cursor-crosshair' : ''
        }`}
        style={{ width: `${totalWidth}px` }}
      >
        {/* Background Sub-second grid lines */}
        <div className="absolute inset-0 pointer-events-none opacity-100 bg-[linear-gradient(to_right,#e8edf3_1px,transparent_1px)] bg-[size:100px_100%]" />

        {/* Drag over guide text */}
        {isDragOver && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-indigo-500/10 text-indigo-300 text-xs font-semibold">
            释放以放置到当前轨道 [{track.name}]
          </div>
        )}

        {/* Render Track Clips */}
        {track.clips.map((clip) => (
          <ClipItem
            key={clip.id}
            clip={clip}
            trackId={track.id}
            isLocked={!!isLocked}
          />
        ))}
      </div>

      {/* Track Lane Context Menu */}
      {contextMenu && (
        <>
          <div className="fixed inset-0 z-50" onClick={() => setContextMenu(null)} />
          <div
            className="fixed z-50 bg-[#171822] border border-zinc-700 rounded-lg shadow-2xl py-1 text-xs text-zinc-200 min-w-[140px] animate-in fade-in"
            style={{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }}
          >
            <button
              onClick={() => {
                closeGapAt(track.id, contextMenu.time);
                setContextMenu(null);
              }}
              className="w-full px-3 py-1.5 text-left hover:bg-indigo-600/30 hover:text-white flex items-center gap-2"
            >
              <span>闭合此处间隙 (Ripple Gap)</span>
            </button>
            <button
              onClick={() => {
                seek(contextMenu.time);
                pasteClips();
                setContextMenu(null);
              }}
              className="w-full px-3 py-1.5 text-left hover:bg-indigo-600/30 hover:text-white flex items-center gap-2"
            >
              <span>在此处粘贴剪贴板片段</span>
            </button>
          </div>
        </>
      )}
    </>
  );
};
