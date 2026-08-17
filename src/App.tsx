import React from 'react';
import { EditorProvider, useEditor } from './context/EditorContext';
import { Navbar } from './components/Header/Navbar';
import { SidebarTabs } from './components/Sidebar/SidebarTabs';
import { MediaPanel } from './components/Sidebar/MediaPanel';
import { OpenStockPanel } from './components/Sidebar/OpenStockPanel';
import { LottiePanel } from './components/Sidebar/LottiePanel';
import { AudioPanel } from './components/Sidebar/AudioPanel';
import { TextPanel } from './components/Sidebar/TextPanel';
import { StickersPanel } from './components/Sidebar/StickersPanel';
import { EffectsPanel } from './components/Sidebar/EffectsPanel';
import { TransitionsPanel } from './components/Sidebar/TransitionsPanel';
import { AiPanel } from './components/Sidebar/AiPanel';
import { PreviewPlayer } from './components/Player/PreviewPlayer';
import { InspectorPanel } from './components/Inspector/InspectorPanel';
import { TimelineContainer } from './components/Timeline/TimelineContainer';
import { ExportModal } from './components/Modals/ExportModal';
import { RecordModal } from './components/Modals/RecordModal';
import { ShortcutsModal } from './components/Modals/ShortcutsModal';
import { AiModal } from './components/Modals/AiModal';
import { ProjectManagerModal } from './components/Modals/ProjectManagerModal';
import { MediaRelinkModal } from './components/Modals/MediaRelinkModal';
import { MediaRelinkBanner } from './components/Header/MediaRelinkBanner';
import { AudioStudioModal } from './components/Modals/AudioStudioModal';
import { AiCopilotDrawer } from './components/AiCopilot/AiCopilotDrawer';
import { ProjectHome } from './components/Home/ProjectHome';
import { LandingPage } from './components/Landing/LandingPage';

const MainAppContent: React.FC = () => {
  const { currentView, activeSidebarTab } = useEditor();

  if (currentView === 'landing') {
    return (
      <div className="w-screen h-screen bg-[#07080b] overflow-y-auto overflow-x-hidden">
        <LandingPage />
        <RecordModal />
        <ProjectManagerModal />
        <MediaRelinkModal />
        <ShortcutsModal />
        <AiCopilotDrawer />
      </div>
    );
  }

  if (currentView === 'home') {
    return (
      <div className="w-screen h-screen bg-[#0a0b0e] overflow-y-auto overflow-x-hidden">
        <ProjectHome />
        <RecordModal />
        <ProjectManagerModal />
        <MediaRelinkModal />
        <ShortcutsModal />
        <AiCopilotDrawer />
      </div>
    );
  }

  const renderActiveSidebar = () => {
    switch (activeSidebarTab) {
      case 'media':
        return <MediaPanel />;
      case 'openstock':
        return <OpenStockPanel />;
      case 'lottie':
        return <LottiePanel />;
      case 'audio':
        return <AudioPanel />;
      case 'text':
        return <TextPanel />;
      case 'stickers':
        return <StickersPanel />;
      case 'effects':
        return <EffectsPanel />;
      case 'transitions':
        return <TransitionsPanel />;
      case 'ai':
        return <AiPanel />;
      default:
        return <MediaPanel />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0c0d11] text-neutral-200 overflow-hidden font-sans select-none animate-in fade-in duration-150">
      {/* 1. Header Navbar */}
      <Navbar />

      {/* 2. Media Offline / Permission Alert Banner */}
      <MediaRelinkBanner />

      {/* 3. Main Middle Workspace (Sidebar + Media Drawer + Player + Inspector) */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Leftmost Sidebar Icon Tabs */}
        <SidebarTabs />

        {/* Active Tool Subpanel (Media / Audio / Text / LUTs / AI) */}
        <div className="w-76 bg-[#131419] border-r border-[#20222a] flex flex-col shrink-0 overflow-hidden">
          {renderActiveSidebar()}
        </div>

        {/* Center Preview Player & Canvas */}
        <PreviewPlayer />

        {/* Right Inspector Properties Panel */}
        <InspectorPanel />
      </div>

      {/* 4. Bottom Multi-Track Timeline */}
      <TimelineContainer />

      {/* Global Dialog Modals & Copilot Drawer */}
      <ExportModal />
      <RecordModal />
      <ShortcutsModal />
      <AiModal />
      <ProjectManagerModal />
      <MediaRelinkModal />
      <AudioStudioModal />
      <AiCopilotDrawer />
    </div>
  );
};

export default function App() {
  return (
    <EditorProvider>
      <MainAppContent />
    </EditorProvider>
  );
}
