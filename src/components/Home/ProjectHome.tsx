import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Play,
  Film,
  FolderOpen,
  Sparkles,
  Search,
  Trash2,
  Copy,
  Download,
  Edit2,
  Check,
  X,
  FileVideo,
  Radio,
  Sparkle,
  Database,
  ArrowRight,
  Tv,
  Smartphone,
  Clapperboard,
  Clock,
  Layers,
  ChevronDown,
  SlidersHorizontal,
  Upload,
  ImagePlus,
  RotateCcw,
} from 'lucide-react';
import { useEditor } from '../../context/EditorContext';
import { ProjectSummary, AspectRatio, Resolution } from '../../types/editor';
import { AppLogo } from '../common/AppLogo';
import { NewProjectModal } from '../Modals/NewProjectModal';

// User uploaded scenario card covers
import lvxingImg from '../../assets/templates/lvxing.png';
import duanshipinImg from '../../assets/templates/duanshipin.png';
import bokeImg from '../../assets/templates/boke.png';
import yugaopianImg from '../../assets/templates/yugaopian.png';

interface ScenarioTemplate {
  id: string;
  title: string;
  tag: string;
  desc: string;
  aspect: AspectRatio;
  fps: number;
  width: number;
  height: number;
  bgImage: string;
  borderColor: string;
  glowColor: string;
  tagStyle: string;
}

const SCENARIO_TEMPLATES: ScenarioTemplate[] = [
  {
    id: 'travel-vlog',
    title: '4K 电影感旅拍 Vlog',
    tag: '热度',
    desc: '16:9 画幅 • 24fps 胶片调色 • 预设多轨音画分离',
    aspect: '16:9',
    fps: 24,
    width: 3840,
    height: 2160,
    bgImage: lvxingImg,
    borderColor: 'border-amber-600/60 hover:border-amber-500',
    glowColor: 'hover:shadow-[0_0_25px_rgba(217,119,6,0.25)]',
    tagStyle: 'bg-black/60 text-amber-200 border-amber-500/30',
  },
  {
    id: 'tiktok-viral',
    title: '竖屏短视频爆款模版',
    tag: '热门',
    desc: '9:16 竖屏 • 60fps 高帧率 • 适配抖音/TikTok 爆款',
    aspect: '9:16',
    fps: 60,
    width: 1080,
    height: 1920,
    bgImage: duanshipinImg,
    borderColor: 'border-pink-600/60 hover:border-pink-500',
    glowColor: 'hover:shadow-[0_0_25px_rgba(219,39,119,0.25)]',
    tagStyle: 'bg-black/60 text-pink-200 border-pink-500/30',
  },
  {
    id: 'podcast-sub',
    title: '知识博主与访谈字幕',
    tag: '口播',
    desc: '16:9 画幅 • 30fps • 智能标题与双语字幕轨',
    aspect: '16:9',
    fps: 30,
    width: 1920,
    height: 1080,
    bgImage: bokeImg,
    borderColor: 'border-blue-600/60 hover:border-blue-500',
    glowColor: 'hover:shadow-[0_0_25px_rgba(37,99,235,0.25)]',
    tagStyle: 'bg-black/60 text-blue-200 border-blue-500/30',
  },
  {
    id: 'epic-trailer',
    title: '21:9 史诗级预告片',
    tag: '预告片',
    desc: '21:9 宽荧幕 • 24fps 电影质感 • 高级调色比例',
    aspect: '21:9',
    fps: 24,
    width: 2560,
    height: 1080,
    bgImage: yugaopianImg,
    borderColor: 'border-emerald-600/60 hover:border-emerald-500',
    glowColor: 'hover:shadow-[0_0_25px_rgba(16,185,129,0.25)]',
    tagStyle: 'bg-black/60 text-emerald-200 border-emerald-500/30',
  },
];

export const ProjectHome: React.FC = () => {
  const {
    project,
    projectList,
    switchProject,
    duplicateProject,
    renameProject,
    deleteProject,
    openLanding,
    openEditor,
    loadDemoProject,
    importProjectJSON,
    exportProjectJSON,
    openRecordModal,
    openAiCopilotDrawer,
    createNewProject,
    userAssets,
  } = useEditor();

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<'modified' | 'name'>('modified');

  // Renaming state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // Delete confirm state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // User uploaded custom covers for scenario templates
  const [customCovers, setCustomCovers] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('opencut_template_covers');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const templateFileInputRef = useRef<{ id: string } | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleUploadCoverFile = (templateId: string, file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setCustomCovers((prev) => {
          const next = { ...prev, [templateId]: dataUrl };
          try {
            localStorage.setItem('opencut_template_covers', JSON.stringify(next));
          } catch (err) {
            console.error('Failed to save cover', err);
          }
          return next;
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerUploadCover = (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    templateFileInputRef.current = { id: templateId };
    coverInputRef.current?.click();
  };

  const handleCoverInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const targetId = templateFileInputRef.current?.id;
    if (file && targetId) {
      handleUploadCoverFile(targetId, file);
    }
    e.target.value = '';
  };

  const handleResetCover = (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomCovers((prev) => {
      const next = { ...prev };
      delete next[templateId];
      try {
        localStorage.setItem('opencut_template_covers', JSON.stringify(next));
      } catch (err) {
        console.error('Failed to clear cover', err);
      }
      return next;
    });
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      if (content) {
        const ok = importProjectJSON(content);
        if (!ok) {
          alert('工程文件解析失败，请检查文件格式！');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleStartRename = (proj: ProjectSummary, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(proj.id);
    setEditingName(proj.name);
  };

  const handleSaveRename = async (projId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editingName.trim()) {
      await renameProject(projId, editingName.trim());
    }
    setEditingId(null);
  };

  const handleCancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const handleDeleteConfirm = async (projId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteProject(projId);
    setDeletingId(null);
  };

  const handleUseScenarioTemplate = async (template: ScenarioTemplate) => {
    const resolution: Resolution = {
      width: template.width,
      height: template.height,
      aspectRatio: template.aspect,
      label: template.title,
    };
    await createNewProject(
      `${template.title} (${new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })})`,
      template.aspect,
      template.fps,
      resolution,
      template.desc
    );
  };

  const formatTimeAgo = (timestamp: number) => {
    if (!timestamp) return '未知时间';
    const diffMs = Date.now() - timestamp;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return '刚刚';
    if (diffMin < 60) return `${diffMin} 分钟前`;
    if (diffHour < 24) return `${diffHour} 小时前`;
    if (diffDay < 30) return `${diffDay} 天前`;
    return new Date(timestamp).toLocaleDateString('zh-CN');
  };

  // Filtered and sorted projects
  const filteredProjects = projectList
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortKey === 'name') return a.name.localeCompare(b.name);
      return b.lastModified - a.lastModified;
    });

  return (
    <div className="min-h-screen w-screen bg-[#090a0f] text-neutral-100 flex flex-col font-sans overflow-x-hidden select-none">
      {/* Hidden file input for project import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.opencut"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* 1. Header Navigation Bar */}
      <header className="h-15 bg-[#0f1017]/95 backdrop-blur-md border-b border-[#1b1e2a] flex items-center justify-between px-6 sticky top-0 z-30">
        {/* Brand Logo & Engine Badges */}
        <div className="flex items-center gap-3">
          <button
            onClick={openLanding}
            className="flex items-center gap-3 hover:opacity-85 transition-opacity cursor-pointer group"
            title="返回 Keyfrio 官网首页"
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <AppLogo className="w-8 h-8 group-hover:scale-105 transition-transform" />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2">
                <span className="font-black text-base tracking-tight text-white flex items-center">
                  Keyfrio
                </span>
                <span className="text-[9px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30 px-1.5 py-0.2 rounded-full font-mono">
                  PRO STUDIO
                </span>
              </div>
              <span className="text-[10px] text-neutral-400 font-medium -mt-0.5 hidden sm:inline">
                Edit every moment. Shape every story.
              </span>
            </div>
          </button>
        </div>

        {/* Right Navigation Items */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Back to Official Website Button */}
          <button
            onClick={openLanding}
            className="flex items-center gap-1.5 bg-[#141620] hover:bg-[#1f2232] border border-[#26293a] text-neutral-300 hover:text-white px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer"
            title="返回产品官网首页"
          >
            <ArrowRight className="w-3.5 h-3.5 rotate-180 text-sky-400" />
            <span>返回官网首页</span>
          </button>

          {/* IndexedDB Status Tag */}
          <div className="hidden lg:flex items-center gap-1.5 bg-[#141620] border border-[#232738] px-2.5 py-1.5 rounded-xl text-xs text-neutral-400">
            <Database className="w-3.5 h-3.5 text-sky-400" />
            <span>本地工程库</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-0.5" />
            <span className="text-neutral-300 font-mono text-[11px]">
              ({projectList.length})
            </span>
          </div>

          {/* Continue Active Project Button */}
          {project && (
            <button
              onClick={openEditor}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-indigo-600/30 border border-sky-400/35 text-blue-300 font-semibold px-3.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer group shadow-sm"
            >
              <span>进入工作台: <span className="text-white">{project.name}</span></span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>
      </header>

      {/* 2. Main Content Gallery Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6 flex flex-col gap-6">
        {/* Quick Tools 4-Cards Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Quick Record */}
          <button
            onClick={() => openRecordModal('screen')}
            className="p-3.5 rounded-xl bg-[#12131b] hover:bg-[#171924] border border-[#202334] hover:border-red-500/40 transition-all flex items-center gap-3.5 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-400 group-hover:scale-105 transition-transform shrink-0">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-neutral-100 group-hover:text-red-300 transition-colors">
                快速屏幕/镜头录制
              </div>
              <div className="text-[11px] text-neutral-400 mt-0.5">
                录制后直接生成新工程
              </div>
            </div>
          </button>

          {/* Import JSON */}
          <button
            onClick={handleImportClick}
            className="p-3.5 rounded-xl bg-[#12131b] hover:bg-[#171924] border border-[#202334] hover:border-emerald-500/40 transition-all flex items-center gap-3.5 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-neutral-100 group-hover:text-emerald-300 transition-colors">
                导入已有工程文件
              </div>
              <div className="text-[11px] text-neutral-400 mt-0.5">
                支持 .opencut.json
              </div>
            </div>
          </button>

          {/* Load Demo */}
          <button
            onClick={loadDemoProject}
            className="p-3.5 rounded-xl bg-[#12131b] hover:bg-[#171924] border border-[#202334] hover:border-amber-500/40 transition-all flex items-center gap-3.5 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-neutral-100 group-hover:text-amber-300 transition-colors">
                载入官方示例工程
              </div>
              <div className="text-[11px] text-neutral-400 mt-0.5">
                体验多轨剪辑与动效
              </div>
            </div>
          </button>

          {/* AI Copilot */}
          <button
            onClick={openAiCopilotDrawer}
            className="p-3.5 rounded-xl bg-[#12131b] hover:bg-[#171924] border border-[#202334] hover:border-purple-500/40 transition-all flex items-center gap-3.5 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform shrink-0">
              <Sparkle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-neutral-100 group-hover:text-purple-300 transition-colors">
                AI 智能指令创作
              </div>
              <div className="text-[11px] text-neutral-400 mt-0.5">
                智能粗剪 / 自动配乐
              </div>
            </div>
          </button>
        </div>

        {/* 创作场景预设模板 (含首位: 新建工程) */}
        <div className="flex flex-col gap-3">
          {/* Hidden input for template cover upload */}
          <input
            ref={coverInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/jpg"
            className="hidden"
            onChange={handleCoverInputChange}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-200">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>创作场景预设模板</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-neutral-400">
              <span>支持拖放原图至卡片直接替换封面</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {/* FIRST CARD: 新建工程 (Custom Modal Popup) */}
            <button
              id="home-open-new-project-card-btn"
              onClick={() => setIsNewModalOpen(true)}
              className="relative overflow-hidden rounded-2xl border border-blue-500/60 hover:border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] bg-gradient-to-br from-blue-950/70 via-[#101322] to-[#0b0c13] flex flex-col justify-between p-4 min-h-[160px] text-left transition-all duration-300 group cursor-pointer"
            >
              {/* Subtle background glow circle */}
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-blue-500/15 rounded-full blur-xl pointer-events-none group-hover:bg-blue-500/25 transition-all" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-blue-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                      <Plus className="w-4 h-4 stroke-[3]" />
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                      新建工程
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-md border bg-blue-500/20 text-blue-300 border-blue-400/40">
                    自定义
                  </span>
                </div>
                <p className="text-[11px] text-neutral-300/90 leading-relaxed line-clamp-2 mt-1">
                  自由指定画幅、1080p/4K分辨率与帧率，弹窗个性化配置
                </p>
              </div>

              <div className="relative z-10 flex items-center justify-between text-[11px] text-sky-400 font-bold pt-2.5 border-t border-blue-500/20">
                <span className="font-mono text-neutral-400 font-normal">多画幅可选</span>
                <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-blue-300">
                  <span>弹窗配置</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>

            {/* 4 Scenario Templates with Real Background Images & Glow */}
            {SCENARIO_TEMPLATES.map((tmpl) => {
              const activeCover = customCovers[tmpl.id] || tmpl.bgImage;
              const hasCustom = !!customCovers[tmpl.id];
              const isDragOver = dragOverId === tmpl.id;

              return (
                <div
                  key={tmpl.id}
                  onClick={() => handleUseScenarioTemplate(tmpl)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverId(tmpl.id);
                  }}
                  onDragLeave={() => setDragOverId(null)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOverId(null);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleUploadCoverFile(tmpl.id, file);
                  }}
                  className={`relative overflow-hidden rounded-2xl border ${tmpl.borderColor} ${tmpl.glowColor} bg-[#0b0c13] transition-all duration-300 group flex flex-col justify-between p-4 min-h-[160px] cursor-pointer ${
                    isDragOver ? 'ring-2 ring-blue-400 scale-[1.02]' : ''
                  }`}
                >
                  {/* Background Image with smooth scale hover */}
                  <img
                    src={activeCover}
                    alt={tmpl.title}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500 pointer-events-none"
                  />

                  {/* Dark Vignette / Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c13] via-[#0b0c13]/70 to-black/30 pointer-events-none" />

                  {/* Drag over overlay */}
                  {isDragOver && (
                    <div className="absolute inset-0 bg-blue-950/85 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-blue-300 gap-1.5 p-2">
                      <Upload className="w-6 h-6 animate-bounce" />
                      <span className="text-xs font-bold">释放鼠标应用图片</span>
                    </div>
                  )}

                  {/* Top Bar: Custom replace button & Tag */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => triggerUploadCover(tmpl.id, e)}
                        title="上传你的原图作为背景"
                        className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[9.5px] px-1.5 py-0.5 rounded bg-black/80 hover:bg-neutral-800 text-neutral-200 border border-white/20 shadow-md backdrop-blur-md"
                      >
                        <ImagePlus className="w-3 h-3 text-sky-400" />
                        <span>{hasCustom ? '换图' : '传原图'}</span>
                      </button>

                      {hasCustom && (
                        <button
                          type="button"
                          onClick={(e) => handleResetCover(tmpl.id, e)}
                          title="恢复默认背景"
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded bg-black/80 hover:bg-red-950/80 text-neutral-400 hover:text-red-300 border border-white/20"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-md border ${tmpl.tagStyle}`}>
                      {tmpl.tag}
                    </span>
                  </div>

                  {/* Middle Content */}
                  <div className="relative z-10 my-1">
                    <h4 className="text-sm font-bold text-white group-hover:text-white transition-colors drop-shadow-sm line-clamp-1">
                      {tmpl.title}
                    </h4>
                    <p className="text-[11px] text-neutral-300 mt-1 leading-snug line-clamp-1">
                      {tmpl.desc}
                    </p>
                  </div>

                  {/* Bottom Row */}
                  <div className="relative z-10 flex items-center justify-between text-[11px] text-neutral-300 pt-2.5 border-t border-white/10">
                    <span className="font-mono text-neutral-400">{tmpl.aspect} • {tmpl.fps} FPS</span>
                    <div className="text-sky-400 group-hover:text-blue-300 font-bold flex items-center gap-1 transition-colors">
                      <span>立即使用</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 最近工程库 Header & Filter Bar */}
        <div className="flex flex-col gap-3.5 pt-2">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <FileVideo className="w-4 h-4 text-sky-400" />
              <span>最近工程库</span>
              <span className="text-xs font-normal text-neutral-400 font-mono bg-[#141620] px-2 py-0.5 rounded-full border border-[#232738]">
                {filteredProjects.length}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Search input */}
              <div className="flex items-center bg-[#101118] border border-[#222536] focus-within:border-blue-500 rounded-xl px-3 py-1.5 text-xs text-neutral-200 transition-colors w-52 sm:w-64">
                <Search className="w-3.5 h-3.5 text-neutral-500 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="搜索已有工程..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none w-full text-xs text-white placeholder-neutral-500"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-neutral-500 hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as any)}
                  className="bg-[#101118] border border-[#222536] text-neutral-300 hover:text-white text-xs rounded-xl px-3 py-1.5 outline-none cursor-pointer pr-7 appearance-none transition-colors"
                >
                  <option value="modified">最近修改 ▾</option>
                  <option value="name">工程名称 ▾</option>
                </select>
                <ChevronDown className="w-3 h-3 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Project Gallery Grid */}
          {filteredProjects.length === 0 ? (
            <div className="bg-[#101118] border border-[#202334] rounded-2xl py-16 px-6 flex flex-col items-center justify-center text-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-[#171924] flex items-center justify-center text-neutral-500 mb-1">
                <Film className="w-7 h-7 text-sky-400" />
              </div>
              <div className="text-base font-bold text-neutral-200">
                {searchQuery ? '未找到匹配的工程' : '暂无保存的剪辑工程'}
              </div>
              <p className="text-xs text-neutral-400 max-w-md">
                {searchQuery
                  ? '请尝试清除过滤条件或更换搜索关键词'
                  : '点击上方「新建工程」或选择创作场景模板开启创作！'}
              </p>
              <button
                onClick={() => setIsNewModalOpen(true)}
                className="mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 transition-colors cursor-pointer"
              >
                新建工程
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredProjects.map((proj) => {
                const isEditing = editingId === proj.id;
                const isDeleting = deletingId === proj.id;
                const aspectText = proj.resolution?.aspectRatio || '16:9';
                const timeText = formatTimeAgo(proj.lastModified);
                const isActive = project?.id === proj.id;

                return (
                  <div
                    key={proj.id}
                    onClick={() => switchProject(proj.id)}
                    className={`group bg-[#101118] hover:bg-[#141622] border rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer flex flex-col shadow-md hover:shadow-xl ${
                      isActive
                        ? 'border-blue-500/80 ring-1 ring-blue-500/50 bg-blue-950/15 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                        : 'border-[#202334] hover:border-[#32364c]'
                    }`}
                  >
                    {/* Thumbnail / Video Box */}
                    <div className="relative w-full aspect-video bg-[#090a0e] flex items-center justify-center overflow-hidden border-b border-[#1b1e2c]">
                      {proj.thumbnail ? (
                        <img
                          src={proj.thumbnail}
                          alt={proj.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full border border-neutral-700/80 bg-[#121319] flex items-center justify-center text-neutral-400 group-hover:scale-110 group-hover:text-sky-400 group-hover:border-blue-500/50 transition-all">
                          <Play className="w-5 h-5 ml-0.5" />
                        </div>
                      )}

                      {/* Active Tag [● 当前编辑中] */}
                      {isActive && (
                        <div className="absolute top-2.5 left-2.5 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-md flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          当前编辑中
                        </div>
                      )}

                      {/* Duration Tag */}
                      <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-xs text-neutral-200 text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border border-white/10">
                        01:05
                      </div>

                      {/* Play Hover Overlay */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                          <Play className="w-4.5 h-4.5 ml-0.5 fill-white" />
                        </div>
                      </div>
                    </div>

                    {/* Info Card Content */}
                    <div className="p-4 flex flex-col gap-2.5 flex-1 justify-between">
                      <div>
                        {isEditing ? (
                          <div
                            className="flex items-center gap-1 mb-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="text"
                              value={editingName}
                              autoFocus
                              onChange={(e) => setEditingName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveRename(proj.id, e as any);
                                if (e.key === 'Escape') setEditingId(null);
                              }}
                              className="bg-[#1b1d2b] border border-blue-500 text-white text-xs px-2 py-1 rounded-lg w-full outline-none"
                            />
                            <button
                              onClick={(e) => handleSaveRename(proj.id, e)}
                              className="p-1 bg-blue-600 text-white rounded hover:bg-blue-500"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={handleCancelRename}
                              className="p-1 bg-neutral-700 text-neutral-300 rounded hover:bg-neutral-600"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-1.5 mb-1">
                            <h3 className="font-bold text-sm text-neutral-100 group-hover:text-blue-300 transition-colors line-clamp-1">
                              {proj.name}
                            </h3>
                            <button
                              onClick={(e) => handleStartRename(proj, e)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-white rounded hover:bg-[#1e2130] transition-all shrink-0"
                              title="重命名"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}

                        {/* Meta strip: ⏱ 刚刚 • 🗂 2 轨 / 1 片段 • [16:9 宽屏] */}
                        <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-sans flex-wrap">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-neutral-500" />
                            {timeText}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-mono">
                            <Layers className="w-3 h-3 text-neutral-500" />
                            2 轨 / 1 片段
                          </span>
                          <span>•</span>
                          <span className="bg-[#181a26] text-neutral-400 font-mono text-[10px] px-1.5 py-0.2 rounded border border-[#262a3d]">
                            {aspectText} 宽屏
                          </span>
                        </div>
                      </div>

                      {/* Card Bottom Action Bar */}
                      <div className="flex items-center justify-between text-xs pt-2 border-t border-[#1b1e2c]">
                        <span className="text-sky-400 group-hover:text-blue-300 font-semibold flex items-center gap-1">
                          打开工程 <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>

                        {/* Right Icon Actions */}
                        <div
                          className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => duplicateProject(proj.id)}
                            className="p-1.5 text-neutral-400 hover:text-white hover:bg-[#1e2130] rounded-lg transition-colors cursor-pointer"
                            title="复制工程"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              const jsonStr = exportProjectJSON();
                              const blob = new Blob([jsonStr], { type: 'application/json' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `${proj.name.replace(/\s+/g, '_')}.opencut.json`;
                              a.click();
                              URL.revokeObjectURL(url);
                            }}
                            className="p-1.5 text-neutral-400 hover:text-white hover:bg-[#1e2130] rounded-lg transition-colors cursor-pointer"
                            title="导出工程"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          {isDeleting ? (
                            <div className="flex items-center gap-1 bg-red-950/90 border border-red-500/50 px-1 py-0.5 rounded">
                              <span className="text-[9px] text-red-300">确定?</span>
                              <button
                                onClick={(e) => handleDeleteConfirm(proj.id, e)}
                                className="text-red-400 hover:text-white"
                              >
                                <Check className="w-2.5 h-2.5" />
                              </button>
                              <button
                                onClick={() => setDeletingId(null)}
                                className="text-neutral-400 hover:text-white"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeletingId(proj.id)}
                              className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                              title="删除工程"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* 3. Footer */}
      <footer className="mt-auto border-t border-[#181a26] bg-[#0c0d13] py-4 px-6 text-[11px] text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AppLogo className="w-4 h-4 opacity-60" />
          <span>OpenCut Studio — 专业级浏览器原生多轨视频剪辑系统</span>
        </div>
        <div className="flex items-center gap-3">
          <span>GPU 加速 PixiJS 引擎</span>
          <span>•</span>
          <span>IndexedDB 二进制本地存储</span>
          <span>•</span>
          <span>Lottie 矢量动效</span>
        </div>
      </footer>

      {/* 4. Secondary Popup Modal for Creating Projects */}
      <NewProjectModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
      />
    </div>
  );
};
