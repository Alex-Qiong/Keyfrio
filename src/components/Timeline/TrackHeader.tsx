import React, { useState } from 'react';
import {
  Film,
  Music,
  Type,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Volume2,
  VolumeX,
  Trash2,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Zap,
  Smile,
  Link2,
} from 'lucide-react';
import { useEditor } from '../../context/EditorContext';
import { Track } from '../../types/editor';

interface TrackHeaderProps {
  track: Track;
  index: number;
  totalTracks: number;
}

export const TrackHeader: React.FC<TrackHeaderProps> = ({ track, index, totalTracks }) => {
  const {
    updateTrack,
    deleteTrack,
    reorderTrack,
    toggleTrackMute,
    toggleTrackSolo,
    toggleTrackLock,
    toggleTrackHide,
    trackHeight,
    activeTrackId,
    setActiveTrackId,
  } = useEditor();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(track.name);
  const [syncLock, setSyncLock] = useState(true);

  const isVideo = track.type === 'video';
  const isAudio = track.type === 'audio';
  const isTargeted = activeTrackId === track.id;

  const handleNameSubmit = () => {
    setIsEditingName(false);
    if (nameValue.trim()) {
      updateTrack(track.id, { name: nameValue.trim() });
    }
  };

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

  const isMuted = track.isMuted || track.muted;
  const isLocked = track.isLocked || track.locked;
  const isHidden = track.isHidden || track.visible === false;
  const isSolo = !!track.isSolo;

  // PR style track badge (e.g. V1, A1)
  const getPrTrackLabel = () => {
    if (track.name && (track.name.startsWith('V') || track.name.startsWith('A'))) {
      return track.name.split(' ')[0];
    }
    return isVideo ? `V${index + 1}` : `A${index + 1}`;
  };

  return (
    <div
      onClick={() => setActiveTrackId(track.id)}
      className={`${getHeightClass()} bg-[#121319] border-b border-[#20222a] px-1.5 flex items-center justify-between select-none text-xs text-neutral-300 transition-all hover:bg-[#161722] relative group ${
        isTargeted ? 'bg-[#161824]' : ''
      }`}
    >
      {/* Active Target Indicator Stripe */}
      {isTargeted && (
        <div
          className={`absolute left-0 top-0 bottom-0 w-1 ${
            isAudio ? 'bg-emerald-500' : 'bg-blue-500'
          }`}
        />
      )}

      {/* Left: PR Source Patching / Track Target Box (V1 / A1) */}
      <div className="flex items-center gap-1.5 min-w-0 flex-1 pl-1">
        {/* PR Target Track Block */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setActiveTrackId(track.id);
          }}
          title={isTargeted ? '当前目标轨道 (Target Track)' : '设为目标轨道 (Target Track)'}
          className={`w-6 h-6 rounded flex items-center justify-center font-mono font-bold text-[10px] shrink-0 transition-all shadow-xs ${
            isAudio
              ? isTargeted
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 hover:bg-emerald-900/60'
              : isTargeted
              ? 'bg-blue-600 text-white shadow-blue-500/20'
              : 'bg-blue-950/40 text-blue-400 border border-blue-800/40 hover:bg-blue-900/60'
          }`}
        >
          {getPrTrackLabel()}
        </button>

        {/* Track Name / Inline Edit */}
        <div className="flex flex-col min-w-0 flex-1">
          {isEditingName ? (
            <input
              type="text"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
              autoFocus
              className="bg-[#0b0c10] text-[10px] text-white px-1 py-0.5 rounded border border-blue-500 outline-none w-full"
            />
          ) : (
            <div
              onDoubleClick={(e) => {
                e.stopPropagation();
                setIsEditingName(true);
              }}
              className="font-medium text-neutral-200 truncate text-[11px] cursor-text hover:text-blue-300 flex items-center gap-1"
              title={`${track.name} (双击重命名)`}
            >
              <span>{track.name}</span>
            </div>
          )}
          <span className="text-[8px] text-neutral-500 uppercase tracking-wide">
            {isAudio ? 'Audio Track' : 'Video Track'}
          </span>
        </div>
      </div>

      {/* Right Controls: PR-Style Controls */}
      <div className="flex items-center gap-1 shrink-0 ml-1">
        {/* 1. Video-Specific: Toggle Track Output (Eye 👁️) */}
        {isVideo && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleTrackHide(track.id);
            }}
            title={!isHidden ? '切换轨道输出 (Toggle Track Output)' : '已隐藏轨道画面 (Track Hidden)'}
            className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
              !isHidden
                ? 'text-neutral-400 hover:text-white hover:bg-[#20222f]'
                : 'text-amber-400 bg-amber-500/15 border border-amber-500/30'
            }`}
          >
            {!isHidden ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          </button>
        )}

        {/* 2. Audio-Specific: Mute (M) & Solo (S) */}
        {isAudio && (
          <>
            {/* Mute (M) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleTrackMute(track.id);
              }}
              title={isMuted ? '取消静音 (Mute)' : '静音轨道 (Mute)'}
              className={`w-5 h-5 rounded font-mono font-bold text-[9px] flex items-center justify-center transition-all ${
                isMuted
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-[#1c1e28] text-neutral-400 hover:text-white hover:bg-[#262838]'
              }`}
            >
              M
            </button>

            {/* Solo (S) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleTrackSolo(track.id);
              }}
              title={isSolo ? '取消独奏 (Solo)' : '独奏轨道 (Solo)'}
              className={`w-5 h-5 rounded font-mono font-bold text-[9px] flex items-center justify-center transition-all ${
                isSolo
                  ? 'bg-amber-500 text-black font-extrabold shadow-xs'
                  : 'bg-[#1c1e28] text-neutral-400 hover:text-white hover:bg-[#262838]'
              }`}
            >
              S
            </button>
          </>
        )}

        {/* 3. Sync Lock (🔗) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSyncLock(!syncLock);
          }}
          title={syncLock ? '同步锁定已开启 (Sync Lock ON)' : '同步锁定已关闭 (Sync Lock OFF)'}
          className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
            syncLock
              ? 'text-neutral-400 hover:text-neutral-200'
              : 'text-neutral-600 opacity-40 hover:opacity-80'
          }`}
        >
          <Link2 className="w-2.5 h-2.5" />
        </button>

        {/* 4. Track Lock (🔒) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleTrackLock(track.id);
          }}
          title={isLocked ? '解锁轨道 (Track Locked)' : '锁定轨道 (Lock Track)'}
          className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
            isLocked
              ? 'text-blue-400 bg-blue-500/15 border border-blue-500/30'
              : 'text-neutral-500 hover:text-white hover:bg-[#20222f]'
          }`}
        >
          {isLocked ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
        </button>

        {/* 5. Delete Track (Only when tracks > 2, or on hover) */}
        {totalTracks > 2 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              deleteTrack(track.id);
            }}
            title="删除轨道"
            className="w-5 h-5 rounded flex items-center justify-center text-neutral-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
          >
            <Trash2 className="w-2.5 h-2.5" />
          </button>
        )}
      </div>
    </div>
  );
};
