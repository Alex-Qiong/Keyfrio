import React, { useState } from 'react';
import {
  Scissors,
  Undo2,
  Redo2,
  Download,
  Sparkles,
  Video,
  Keyboard,
  FileJson,
  FolderOpen,
  Check,
  ChevronDown,
  RotateCcw,
  Film,
  Ratio,
  SlidersHorizontal,
  CircleDot,
  Radio,
  Database,
  Layers,
  Plus,
  HardDrive,
  AlertTriangle,
} from 'lucide-react';
import { useEditor } from '../../context/EditorContext';
import { ASPECT_RATIOS } from '../../constants/samples';
import { AspectRatio } from '../../types/editor';
import { AppLogo } from '../common/AppLogo';
import { SequenceManagerModal } from './SequenceManagerModal';
import { StorageManagerModal } from '../Modals/StorageManagerModal';

export const Navbar: React.FC = () => {
  const {
    project,
    setProjectName,
    setAspectRatio,
    canUndo,
    canRedo,
    undo,
    redo,
    openExportModal,
    openRecordModal,
    openShortcutsModal,
    openAiCopilotDrawer,
    exportProjectJSON,
    importProjectJSON,
    loadDemoProject,
    openProjectManager,
    openLanding,
    openHome,
    createNewProject,
    dbSaveStatus,
    projectList,
    openRelinkModal,
    offlineAssetsCount,
    needsPermissionCount,
  } = useEditor();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(project.name);
  const [isAspectMenuOpen, setIsAspectMenuOpen] = useState(false);
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
  const [isSeqModalOpen, setIsSeqModalOpen] = useState(false);
  const [isStorageModalOpen, setIsStorageModalOpen] = useState(false);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (tempTitle.trim()) {
      setProjectName(tempTitle.trim());
    } else {
      setTempTitle(project.name);
    }
  };

  const handleImportJSONClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = async (e: any) => {
      const file = e.target?.files?.[0];
      if (file) {
        const text = await file.text();
        const success = importProjectJSON(text);
        if (!success) {
          alert('工程文件解析失败，请检查格式');
        }
      }
    };
    input.click();
  };

  const handleExportJSONClick = () => {
    const jsonStr = exportProjectJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, '_')}.keyfrio.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="h-12 bg-[#111218]/95 backdrop-blur-md border-b border-white/8 flex items-center justify-between px-4 text-xs text-neutral-200 select-none shrink-0 z-30">
      {/* Left: Brand + Project Manager & Name */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-2 pr-2.5 border-r border-[#22242d]">
          <button
            id="navbar-home-btn"
            onClick={openLanding}
            className="flex items-center gap-1.5 hover:opacity-85 transition-opacity cursor-pointer group"
            title="返回 Keyfrio 官网首页"
          >
            <div className="w-7 h-7 flex items-center justify-center">
              <AppLogo className="w-6.5 h-6.5 group-hover:scale-105 transition-transform" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-white flex items-center text-sm">
                Keyfrio
              </span>
              <span className="text-[8.5px] font-bold bg-gradient-to-r from-blue-500/15 to-purple-500/15 text-blue-400 border border-blue-500/25 px-1 py-0.2 rounded font-mono">
                PRO
              </span>
            </div>
          </button>
        </div>

        {/* Database Projects Library Button */}
        <button
          id="navbar-open-projects-btn"
          onClick={openHome}
          className="flex items-center gap-1.5 bg-[#181a24] hover:bg-[#202332] border border-indigo-500/30 text-indigo-300 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
          title="工程项目库 (项目管理中心)"
        >
          <Database className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-medium text-xs">工程库</span>
          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1 rounded-full font-mono">
            {projectList.length}
          </span>
        </button>

        {/* Quick New Project Button */}
        <button
          id="navbar-quick-new-proj-btn"
          onClick={() => createNewProject()}
          className="flex items-center gap-1 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 hover:text-white px-2 py-1 rounded-md transition-colors cursor-pointer"
          title="新建空白工程"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="font-medium text-xs hidden lg:inline">新建</span>
        </button>

        {/* Project Name Edit */}
        <div className="flex items-center gap-1.5">
          {isEditingTitle ? (
            <input
              type="text"
              value={tempTitle}
              autoFocus
              aria-label="工程名称"
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
              className="bg-[#1a1b22] border border-blue-500 text-white text-xs px-2 py-0.5 rounded outline-none w-44 font-medium"
            />
          ) : (
            <button
              onClick={() => {
                setTempTitle(project.name);
                setIsEditingTitle(true);
              }}
              title="点击重命名工程"
              className="text-xs font-medium text-neutral-300 hover:text-white px-2 py-1 rounded-md hover:bg-[#1c1d25] transition-colors max-w-[180px] truncate cursor-pointer flex items-center gap-1"
            >
              <Film className="w-3 h-3 text-neutral-400 shrink-0" />
              <span className="truncate">{project.name}</span>
            </button>
          )}

          {/* Real-time DB saving indicator badge */}
          <div 
            title={dbSaveStatus === 'saved' ? '数据库自动保存成功' : dbSaveStatus === 'saving' ? '正在保存到数据库...' : '保存异常'} 
            className="flex items-center"
          >
            <span className={`w-2 h-2 rounded-full ${
              dbSaveStatus === 'saved'
                ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]'
                : dbSaveStatus === 'saving'
                ? 'bg-amber-400 animate-ping'
                : 'bg-red-500'
            }`} />
          </div>

          {/* Project File Menu */}
          <div className="relative">
            <button
              onClick={() => setIsProjectMenuOpen((o) => !o)}
              aria-label="打开工程文件菜单"
              aria-haspopup="menu"
              aria-expanded={isProjectMenuOpen}
              className="text-neutral-400 hover:text-white p-1.5 rounded-md hover:bg-[#1c1d25] transition-colors cursor-pointer"
              title="工程文件导入/导出"
            >
              <ChevronDown className="w-3 h-3" />
            </button>

            {isProjectMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProjectMenuOpen(false)} />
                <div className="absolute top-full left-0 mt-1 w-56 bg-[#16171e] border border-[#262834] rounded-xl shadow-2xl py-1.5 z-50 text-xs animate-in fade-in">
                  <button
                    onClick={() => {
                      openProjectManager();
                      setIsProjectMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-indigo-300 hover:text-indigo-200 hover:bg-indigo-600/20 flex items-center gap-2.5 transition-colors cursor-pointer font-medium"
                  >
                    <Database className="w-4 h-4 text-indigo-400" />
                    <span>管理本地工程库 ({projectList.length})</span>
                  </button>
                  <div className="h-px bg-[#262834] my-1" />
                  <button
                    onClick={() => {
                      handleExportJSONClick();
                      setIsProjectMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-neutral-300 hover:text-white hover:bg-blue-600/20 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <FileJson className="w-4 h-4 text-blue-400" />
                    <span>导出工程文件 (.json)</span>
                  </button>
                  <button
                    onClick={() => {
                      handleImportJSONClick();
                      setIsProjectMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-neutral-300 hover:text-white hover:bg-blue-600/20 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <FolderOpen className="w-4 h-4 text-emerald-400" />
                    <span>导入工程文件 (.json)</span>
                  </button>
                  <div className="h-px bg-[#262834] my-1" />
                  <button
                    onClick={() => {
                      loadDemoProject();
                      setIsProjectMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>重置为官方示例工程</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Aspect Ratio Selector */}
        <div className="relative ml-1">
          <button
            onClick={() => setIsAspectMenuOpen((o) => !o)}
            className="flex items-center gap-1.5 bg-[#181921] hover:bg-[#20222c] border border-[#262833] text-[11px] text-neutral-300 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
          >
            <Ratio className="w-3 h-3 text-blue-400" />
            <span className="font-semibold text-blue-400">{project.resolution.aspectRatio}</span>
            <span className="text-[10px] text-neutral-500 hidden md:inline">({project.resolution.width}×{project.resolution.height})</span>
            <ChevronDown className="w-2.5 h-2.5 text-neutral-400" />
          </button>

          {isAspectMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsAspectMenuOpen(false)} />
              <div className="absolute top-full left-0 mt-1 w-64 bg-[#16171e] border border-[#262834] rounded-xl shadow-2xl py-1.5 z-50 text-xs animate-in fade-in">
                <div className="px-3 py-1 text-[10px] font-semibold text-neutral-400 border-b border-[#262834] flex items-center gap-1.5">
                  <Ratio className="w-3 h-3 text-blue-400" />
                  <span>画面画幅 / 比例预设</span>
                </div>
                {(Object.keys(ASPECT_RATIOS) as AspectRatio[]).map((ratio) => {
                  const item = ASPECT_RATIOS[ratio];
                  const isSelected = project.resolution.aspectRatio === ratio;
                  return (
                    <button
                      key={ratio}
                      onClick={() => {
                        setAspectRatio(ratio);
                        setIsAspectMenuOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-blue-600/20 transition-colors cursor-pointer ${
                        isSelected ? 'text-blue-400 font-medium bg-blue-500/10' : 'text-neutral-300'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs">{item.label}</span>
                        <span className="text-[9px] text-neutral-500">{item.width} × {item.height} px</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-blue-400" />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Center: Undo/Redo & AI Copilot & Record */}
      <div className="flex items-center gap-1">
        <button
          onClick={undo}
          aria-label="撤销"
          disabled={!canUndo}
          title="撤销 (Ctrl+Z)"
          className={`p-1.5 rounded-md hover:bg-[#1e202a] transition-colors cursor-pointer ${
            canUndo ? 'text-neutral-300 hover:text-white' : 'text-neutral-600 cursor-not-allowed'
          }`}
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={redo}
          aria-label="重做"
          disabled={!canRedo}
          title="重做 (Ctrl+Y)"
          className={`p-1.5 rounded-md hover:bg-[#1e202a] transition-colors cursor-pointer ${
            canRedo ? 'text-neutral-300 hover:text-white' : 'text-neutral-600 cursor-not-allowed'
          }`}
        >
          <Redo2 className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-[#232530] mx-1.5" />

        {/* AI Magic Button */}
        <button
          onClick={openAiCopilotDrawer}
          className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-[11px] px-2.5 py-1 rounded-lg font-medium shadow-sm transition-all cursor-pointer group"
          title="AI 智能剪辑助理 (Copilot 对话 / 智能粗剪 / 一键调色)"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 group-hover:rotate-12 transition-transform" />
          <span>AI 智能助理</span>
        </button>

        {/* Recording Tool */}
        <button
          onClick={() => openRecordModal('camera')}
          className="flex items-center gap-1.5 text-[11px] text-neutral-300 hover:text-white hover:bg-[#1e202a] px-2 py-1 rounded-md transition-colors cursor-pointer"
          title="录制屏幕 / 摄像头 / 配音"
        >
          <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          <span className="hidden sm:inline">录制</span>
        </button>
      </div>

      {/* Right: Relink Indicator + Storage + Sequences + Keyboard Shortcuts + Export */}
      <div className="flex items-center gap-1.5">
        {/* Multi-Sequence Manager Button */}
        <button
          onClick={() => setIsSeqModalOpen(true)}
          className="flex items-center gap-1 bg-[#171821] hover:bg-[#1f212d] border border-[#272a38] text-neutral-300 hover:text-white px-2 py-1 rounded-md text-xs transition-colors cursor-pointer"
          title="Keyfrio 多序列管理器 (Sequences)"
        >
          <Layers className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden md:inline font-medium">序列</span>
          <span className="text-[10px] bg-sky-500/20 text-sky-300 px-1 rounded-full font-mono">
            {project.sequences?.length || 1}
          </span>
        </button>

        {/* OPFS Storage Diagnostics Button */}
        <button
          onClick={() => setIsStorageModalOpen(true)}
          className="flex items-center gap-1 bg-[#171821] hover:bg-[#1f212d] border border-[#272a38] text-neutral-300 hover:text-white px-2 py-1 rounded-md text-xs transition-colors cursor-pointer"
          title="Keyfrio 本地 OPFS 存储监控"
        >
          <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden lg:inline font-medium">OPFS</span>
        </button>

        {(needsPermissionCount > 0 || offlineAssetsCount > 0) && (
          <button
            onClick={openRelinkModal}
            className="flex items-center gap-1.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 text-amber-300 px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer animate-pulse"
            title="点击重新授权或重连离线素材"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium">
              {needsPermissionCount > 0 ? `${needsPermissionCount} 需授权` : `${offlineAssetsCount} 离线`}
            </span>
          </button>
        )}

        <button
          onClick={openShortcutsModal}
          aria-label="打开快捷键指南"
          title="快捷键大全 (?)"
          className="p-1.5 text-neutral-400 hover:text-white hover:bg-[#1e202a] rounded-md transition-colors cursor-pointer"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        {/* Export Button */}
        <button
          onClick={openExportModal}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg shadow-md shadow-blue-600/30 transition-all cursor-pointer"
          title="导出视频 (WebM / MP4)"
        >
          <Download className="w-3.5 h-3.5" />
          <span>导出视频</span>
        </button>
      </div>

      {/* Keyfrio Sequence Manager Modal */}
      <SequenceManagerModal
        isOpen={isSeqModalOpen}
        onClose={() => setIsSeqModalOpen(false)}
      />

      {/* Keyfrio OPFS Storage Modal */}
      <StorageManagerModal
        isOpen={isStorageModalOpen}
        onClose={() => setIsStorageModalOpen(false)}
      />
    </header>
  );
};
