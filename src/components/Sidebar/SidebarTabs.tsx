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
}

export const TABS: TabItem[] = [
  { id: 'media', name: '媒体', icon: FolderOpen },
  { id: 'openstock', name: '素材', icon: Globe2, badge: 'Free' },
  { id: 'lottie', name: '动画', icon: Clapperboard },
  { id: 'audio', name: '音频', icon: Music2 },
  { id: 'text', name: '文字', icon: Type },
  { id: 'stickers', name: '贴纸', icon: Sticker },
  { id: 'effects', name: '特效', icon: Sparkles },
  { id: 'transitions', name: '转场', icon: Blend },
  { id: 'ai', name: 'AI', icon: Bot, badge: 'AI' },
];

export const SidebarTabs: React.FC = () => {
  const { activeSidebarTab, setActiveSidebarTab } = useEditor();

  return (
    <aside
      aria-label="编辑工具"
      className="w-15 bg-[#0f1015] border-r border-white/8 flex flex-col items-center py-2 select-none shrink-0 z-20"
    >
      <nav className="flex flex-col gap-1 w-full px-1.5">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSidebarTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              aria-label={tab.name}
              aria-pressed={isActive}
              onClick={() => setActiveSidebarTab(tab.id)}
              className={`flex min-h-12 flex-col items-center justify-center rounded-lg w-full transition-colors group relative cursor-pointer ${
                isActive
                  ? 'bg-blue-500/14 text-white'
                  : 'text-neutral-500 hover:text-neutral-200 hover:bg-white/5'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  aria-hidden="true"
                  className={`w-[18px] h-[18px] transition-colors ${
                    isActive ? 'text-blue-400' : 'text-current'
                  }`}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
                {tab.badge && (
                  <span className="absolute -top-2 -right-3 rounded bg-[#272a38] px-1 text-[7px] font-semibold tracking-wide text-neutral-300">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="mt-1 text-[10px] leading-none tracking-tight">
                {tab.name}
              </span>
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute inset-y-2 left-0 w-0.5 rounded-r bg-blue-400"
                />
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
