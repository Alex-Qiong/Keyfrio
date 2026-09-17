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
import { useUiStore } from '../../stores/uiStore';
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

/**
 * Reads active tab from Zustand (fine-grained).
 * Writes still go through EditorContext so the rest of the app stays in sync
 * until full mutation migration is complete.
 */
export const SidebarTabs: React.FC = () => {
  const activeSidebarTab = useUiStore((s) => s.activeSidebarTab);
  const { setActiveSidebarTab } = useEditor();

  return (
    <aside
      aria-label="编辑工具"
      className="w-10 bg-white border border-[#dde1e7] rounded-lg flex flex-col items-center py-1.5 select-none shrink-0 z-20"
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
              className={`flex min-h-9 flex-col items-center justify-center rounded-md w-full transition-colors group relative cursor-pointer ${
                isActive
                  ? 'bg-sky-50 text-sky-600'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  aria-hidden="true"
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-sky-500' : 'text-current'
                  }`}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
                {tab.badge && (
                  <span className="absolute -top-2 -right-3 rounded bg-slate-100 px-1 text-[7px] font-semibold tracking-wide text-slate-500 border border-slate-200">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="sr-only">{tab.name}</span>
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute inset-y-2 left-0 w-0.5 rounded-r bg-sky-400"
                />
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
