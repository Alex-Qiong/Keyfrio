import React, { lazy, Suspense } from 'react';
import { EditorProvider, useEditor } from './context/EditorContext';

const Navbar = lazy(() => import('./components/Header/Navbar').then((module) => ({ default: module.Navbar })));
const SidebarTabs = lazy(() => import('./components/Sidebar/SidebarTabs').then((module) => ({ default: module.SidebarTabs })));
const MediaPanel = lazy(() => import('./components/Sidebar/MediaPanel').then((module) => ({ default: module.MediaPanel })));
const OpenStockPanel = lazy(() => import('./components/Sidebar/OpenStockPanel').then((module) => ({ default: module.OpenStockPanel })));
const LottiePanel = lazy(() => import('./components/Sidebar/LottiePanel').then((module) => ({ default: module.LottiePanel })));
const AudioPanel = lazy(() => import('./components/Sidebar/AudioPanel').then((module) => ({ default: module.AudioPanel })));
const TextPanel = lazy(() => import('./components/Sidebar/TextPanel').then((module) => ({ default: module.TextPanel })));
const StickersPanel = lazy(() => import('./components/Sidebar/StickersPanel').then((module) => ({ default: module.StickersPanel })));
const EffectsPanel = lazy(() => import('./components/Sidebar/EffectsPanel').then((module) => ({ default: module.EffectsPanel })));
const TransitionsPanel = lazy(() => import('./components/Sidebar/TransitionsPanel').then((module) => ({ default: module.TransitionsPanel })));
const AiPanel = lazy(() => import('./components/Sidebar/AiPanel').then((module) => ({ default: module.AiPanel })));
const PreviewPlayer = lazy(() => import('./components/Player/PreviewPlayer').then((module) => ({ default: module.PreviewPlayer })));
const InspectorPanel = lazy(() => import('./components/Inspector/InspectorPanel').then((module) => ({ default: module.InspectorPanel })));
const TimelineContainer = lazy(() => import('./components/Timeline/TimelineContainer').then((module) => ({ default: module.TimelineContainer })));
const ExportModal = lazy(() => import('./components/Modals/ExportModal').then((module) => ({ default: module.ExportModal })));
const RecordModal = lazy(() => import('./components/Modals/RecordModal').then((module) => ({ default: module.RecordModal })));
const ShortcutsModal = lazy(() => import('./components/Modals/ShortcutsModal').then((module) => ({ default: module.ShortcutsModal })));
const AiModal = lazy(() => import('./components/Modals/AiModal').then((module) => ({ default: module.AiModal })));
const ProjectManagerModal = lazy(() => import('./components/Modals/ProjectManagerModal').then((module) => ({ default: module.ProjectManagerModal })));
const MediaRelinkModal = lazy(() => import('./components/Modals/MediaRelinkModal').then((module) => ({ default: module.MediaRelinkModal })));
const MediaRelinkBanner = lazy(() => import('./components/Header/MediaRelinkBanner').then((module) => ({ default: module.MediaRelinkBanner })));
const AudioStudioModal = lazy(() => import('./components/Modals/AudioStudioModal').then((module) => ({ default: module.AudioStudioModal })));
const AiCopilotDrawer = lazy(() => import('./components/AiCopilot/AiCopilotDrawer').then((module) => ({ default: module.AiCopilotDrawer })));
const ProjectHome = lazy(() => import('./components/Home/ProjectHome').then((module) => ({ default: module.ProjectHome })));
const LandingPage = lazy(() => import('./components/Landing/LandingPage').then((module) => ({ default: module.LandingPage })));

const LoadingFallback: React.FC = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-[#07080b] text-sm text-neutral-400">
    正在加载 Keyfrio…
  </div>
);

const CommonOverlays: React.FC = () => (
  <>
    <RecordModal />
    <ProjectManagerModal />
    <MediaRelinkModal />
    <ShortcutsModal />
    <AiCopilotDrawer />
  </>
);

const MainAppContent: React.FC = () => {
  const { currentView, activeSidebarTab } = useEditor();

  if (currentView === 'landing') {
    return (
      <div className="w-screen h-screen bg-[#07080b] overflow-y-auto overflow-x-hidden">
        <LandingPage />
        <CommonOverlays />
      </div>
    );
  }

  if (currentView === 'home') {
    return (
      <div className="w-screen h-screen bg-[#0a0b0e] overflow-y-auto overflow-x-hidden">
        <ProjectHome />
        <CommonOverlays />
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
      <Navbar />
      <MediaRelinkBanner />

      <div className="flex-1 flex overflow-hidden min-h-0">
        <SidebarTabs />
        <div className="w-76 bg-[#131419] border-r border-[#20222a] flex flex-col shrink-0 overflow-hidden">
          {renderActiveSidebar()}
        </div>
        <PreviewPlayer />
        <InspectorPanel />
      </div>

      <TimelineContainer />

      <ExportModal />
      <AiModal />
      <AudioStudioModal />
      <CommonOverlays />
    </div>
  );
};

export default function App() {
  return (
    <EditorProvider>
      <Suspense fallback={<LoadingFallback />}>
        <MainAppContent />
      </Suspense>
    </EditorProvider>
  );
}
