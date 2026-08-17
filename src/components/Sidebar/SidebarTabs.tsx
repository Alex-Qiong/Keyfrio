import React from 'react';
import {
  FolderOpen,
  Globe2,
  Music2,
  Type,
  Sticker,
  Sparkles,
  Blend,
  Bot,
  Clapperboard,
} from 'lucide-react';
import { useEditor } from '../../context/EditorContext';

export interface TabItem {
  id: string;
  name: string;
  icon: React.ElementType;
  badge?: string;
  color?: string;
}

export const TABS: TabItem[] = [
  { id: 'media', name: '媒体库', icon: FolderOpen, color: 'text-blue-400' },
  { id: 'openstock', name: '开源素材', icon: Globe2, badge: 'Free', color: 'text-cyan-400' },
  { id: 'lottie', name: 'Lottie', icon: Clapperboard, badge: 'New', color: 'text-purple-400' },
  { id: 'audio', name: '音频/BGM', icon: Music2, color: 'text-emerald-400' },
  { id: 'text', name: '文字标题', icon: Type, color: 'text-amber-400' },
  { id: 'stickers', name: '贴纸表情', icon: Sticker, color: 'text-pink-400' },
  { id: 'effects', name: 'GPU 特效', icon: Sparkles, badge: 'GPU', color: 'text-indigo-400' },
  { id: 'transitions', name: '转场特效', icon: Blend, color: 'text-orange-400' },
  { id: 'ai', name: 'AI 创作', icon: Bot, badge: 'AI', color: 'text-violet-400' },
];

export const SidebarTabs: React.FC = () => {
  const { activeSidebarTab, setActiveSidebarTab } = useEditor();

  return (
    <aside className="w-14 bg-[#101116] border-r border-[#20222a] flex flex-col items-center py-2 select-none shrink-0 z-20">
      <div className="flex flex-col gap-1 w-full px-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSidebarTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSidebarTab(tab.id)}
              title={tab.name}
              className={`flex flex-col items-center justify-center py-2 px-0.5 rounded-lg w-full transition-all group relative cursor-pointer ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 font-semibold shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#181920]'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? tab.color || 'text-blue-400' : 'text-neutral-400 group-hover:text-neutral-200'
                  }`}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2.5 px-1 py-0.2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[7.5px] font-bold rounded-full scale-75 shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight leading-none truncate max-w-[48px] text-center">
                {tab.name}
              </span>

              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-blue-500 rounded-r shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
};
