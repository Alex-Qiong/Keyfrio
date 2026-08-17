import React, { useRef, useState } from 'react';
import { useEditor } from '../../context/EditorContext';

interface PlayheadProps {
  timelineScrollRef: React.RefObject<HTMLDivElement | null>;
}

export const Playhead: React.FC<PlayheadProps> = ({ timelineScrollRef }) => {
  const { currentTime, zoom } = useEditor();
  const leftPosition = currentTime * zoom;

  return (
    <div
      className="absolute top-0 bottom-0 pointer-events-none z-30 flex flex-col items-center"
      style={{
        left: `${leftPosition}px`,
        transform: 'translateX(-50%)',
      }}
    >
      {/* Top Red Indicator Pip */}
      <div className="w-1.5 h-1.5 bg-red-500 rotate-45 -mt-0.5 shrink-0" />
      {/* Playhead Red Needle Line with glowing shadow */}
      <div className="w-0.5 flex-1 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.85)]" />
    </div>
  );
};
