import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import {
  Play,
  Sparkles,
  ArrowRight,
  FolderOpen,
  Layers,
  Sliders,
  Volume2,
  Type,
  Zap,
  Cpu,
  Shield,
  CheckCircle2,
  Star,
  Flame,
  Palette,
  Wand2,
  Film,
  Music4,
  Scissors,
  MonitorPlay,
  Keyboard,
  ChevronRight,
  Github,
} from 'lucide-react';
import { useEditor } from '../../context/EditorContext';
import { AppLogo } from '../common/AppLogo';
import { AspectRatio } from '../../types/editor';

import lvxingImg from '../../assets/templates/lvxing.png';
import duanshipinImg from '../../assets/templates/duanshipin.png';
import bokeImg from '../../assets/templates/boke.png';
import yugaopianImg from '../../assets/templates/yugaopian.png';

/* ── data ─────────────────────────────────────────────── */
interface TemplateCard {
  id: string; title: string; tag: string; desc: string;
  aspect: AspectRatio; fps: number; width: number; height: number;
  bgImage: string; accent: string;
}
const TEMPLATES: TemplateCard[] = [
  { id: 'travel-vlog', title: '4K 电影感旅拍 Vlog', tag: '热度推荐', desc: '16:9 画幅 · 24fps 胶片调色 · 多轨音画分离', aspect: '16:9', fps: 24, width: 3840, height: 2160, bgImage: lvxingImg, accent: '#fbbf24' },
  { id: 'tiktok-viral', title: '竖屏短视频爆款模板', tag: '爆款模板', desc: '9:16 竖屏 · 60fps 高帧率 · 节奏卡点', aspect: '9:16', fps: 60, width: 1080, height: 1920, bgImage: duanshipinImg, accent: '#fb7185' },
  { id: 'podcast-sub', title: '知识博主与访谈字幕', tag: '口播干货', desc: '16:9 画幅 · 30fps · 智能双语字幕轨', aspect: '16:9', fps: 30, width: 1920, height: 1080, bgImage: bokeImg, accent: '#60a5fa' },
  { id: 'epic-trailer', title: '21:9 史诗级宽屏预告', tag: '院线质感', desc: '21:9 宽荧幕 · 24fps · 冲击滤镜', aspect: '21:9', fps: 24, width: 2560, height: 1080, bgImage: yugaopianImg, accent: '#34d399' },
];

const MARQUEE_ITEMS = [
  '多轨时间线', 'GPU 粒子着色器', 'Lottie 矢量动效', 'ASC-CDL 调色', 'AI 智能字幕',
  '4K 60FPS 实时渲染', 'WebCodecs 导出', 'OPFS 本地存储', '智能场景识别', '一键成片',
];

const FEATURES = [
  { icon: Layers, title: '多轨非编时间线', desc: '视频 / 音频 / 文字 / 特效轨道无限叠加，磁吸对齐、波纹编辑、JKL 穿梭，桌面级剪辑手感。', accent: '#22d3ee' },
  { icon: Zap, title: 'GPU 实时渲染', desc: 'PixiJS + WebGL 管线，4K 60FPS 实时预览，粒子、光效、转场零等待。', accent: '#a78bfa' },
  { icon: Palette, title: '电影级调色', desc: 'ASC-CDL 标准调色管线，示波器 / 矢量图 / 直方图专业监看。', accent: '#fb7185' },
  { icon: Wand2, title: 'AI 创意副驾驶', desc: '智能粗剪、自动字幕、文案成片、Gemini 驱动的分镜理解。', accent: '#fbbf24' },
  { icon: Music4, title: '音频工作站', desc: '波形可视化、响度归一、降噪、AI 配音，多轨混音一站完成。', accent: '#34d399' },
  { icon: Shield, title: '本地优先 · 隐私安全', desc: 'OPFS + IndexedDB 本地存储，素材不出设备，离线可用。', accent: '#60a5fa' },
];

const STATS = [
  { value: '4K', label: '最高渲染分辨率' },
  { value: '60', label: 'FPS 实时预览帧率' },
  { value: '0', label: '安装体积 · 纯 Web' },
  { value: '∞', label: '轨道数量上限' },
];

/* ── tiny reveal helper ───────────────────────────────── */
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children, delay = 0, className,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

/* ── hero editor mockup (pure CSS) ────────────────────── */
const HeroMockup: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  const [progress, setProgress] = useState(28);
  useEffect(() => {
    const t = setInterval(() => setProgress((p) => (p >= 96 ? 4 : p + 0.35)), 60);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="relative mx-auto mt-16 max-w-5xl [perspective:1600px]">
      <div className="absolute -inset-x-8 -top-8 bottom-0 bg-gradient-to-b from-cyan-500/15 via-violet-500/10 to-transparent blur-3xl rounded-full pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 60, rotateX: 12 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-2xl border border-white/10 bg-[#0b0e15]/90 shadow-[0_40px_120px_rgba(0,0,0,0.7)] overflow-hidden backdrop-blur-xl"
      >
        {/* window bar */}
        <div className="flex items-center gap-2 px-4 h-10 border-b border-white/5 bg-white/[0.02]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-[11px] text-neutral-500 font-medium">Keyfrio Pro Studio · 4K Cinema Timeline</span>
          <div className="ml-auto flex gap-1.5">
            <span className="kf-badge-accent kf-badge !text-[9px]">16:9</span>
            <span className="kf-badge !text-[9px]">4K · 60FPS</span>
          </div>
        </div>
        <div className="grid grid-cols-[1fr_300px]">
          {/* preview */}
          <div className="p-4">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/5">
              <img src={lvxingImg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
              <div className="absolute top-3 left-3 kf-badge-accent kf-badge !text-[9px]">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" /> PREVIEW · GPU 实时渲染
              </div>
              <button
                onClick={onOpen}
                className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-white/10 border border-white/25 backdrop-blur-md flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all cursor-pointer group"
                aria-label="打开编辑器"
              >
                <Play className="w-6 h-6 text-white fill-white ml-0.5 group-hover:scale-110 transition-transform" />
              </button>
              <div className="absolute bottom-3 inset-x-4">
                <div className="h-1 rounded-full bg-white/15 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 transition-[width] duration-150" style={{ width: `${progress}%` }} />
                </div>
                <div className="mt-1.5 flex justify-between text-[10px] font-mono text-white/60">
                  <span>00:00:{String(Math.floor(progress * 0.42)).padStart(2, '0')}:00</span>
                  <span>00:01:05:00</span>
                </div>
              </div>
            </div>
            {/* mini timeline */}
            <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
              <div className="flex gap-1.5 mb-2">
                {['V1', 'V2', 'A1'].map((t) => (
                  <span key={t} className="text-[9px] font-mono text-neutral-500 w-6">{t}</span>
                ))}
              </div>
              {[
                { c: 'from-cyan-500/70 to-cyan-500/70', w: '62%', l: '0%' },
                { c: 'from-violet-500/70 to-fuchsia-600/70', w: '38%', l: '64%' },
                { c: 'from-emerald-500/60 to-teal-600/60', w: '80%', l: '8%' },
              ].map((r, i) => (
                <div key={i} className="relative h-5 mb-1.5 rounded-md bg-white/[0.03]">
                  <div className={`absolute top-0 bottom-0 rounded-md bg-gradient-to-r ${r.c}`} style={{ width: r.w, left: r.l }} />
                </div>
              ))}
              <div className="relative h-0">
                <div className="absolute -top-[74px] bottom-[-6px] w-[2px] bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]" style={{ left: `${progress}%` }}>
                  <div className="absolute -top-1.5 -left-[5px] w-3 h-3 rotate-45 bg-white rounded-[2px]" />
                </div>
              </div>
            </div>
          </div>
          {/* right rail */}
          <div className="border-l border-white/5 p-4 space-y-3 bg-white/[0.015]">
            {[
              { icon: Sliders, t: '调色', d: 'ASC-CDL · 示波器', c: '#fb7185' },
              { icon: Type, t: '文字', d: '120+ 动态标题', c: '#fbbf24' },
              { icon: Volume2, t: '音频', d: 'AI 降噪 · 混音', c: '#34d399' },
              { icon: Sparkles, t: 'AI', d: '智能成片', c: '#a78bfa' },
            ].map((r) => (
              <div key={r.t} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 hover:border-white/15 transition-colors">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${r.c}1a`, color: r.c }}>
                  <r.icon className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-xs font-semibold text-white">{r.t}</div>
                  <div className="text-[10px] text-neutral-500">{r.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/* ── page ─────────────────────────────────────────────── */
export const LandingPage: React.FC = () => {
  const { openHome, openEditor, createNewProject, loadDemoProject, openShortcutsModal, projectList } = useEditor();

  const handleUseTemplate = async (t: TemplateCard) => {
    await createNewProject(t.title, t.aspect, t.fps,
      { width: t.width, height: t.height, aspectRatio: t.aspect, label: t.title }, t.desc);
    openEditor();
  };

  return (
    <div className="min-h-screen bg-[#06070b] text-neutral-100 font-sans relative overflow-x-hidden kf-noise">
      {/* ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="kf-aurora w-[700px] h-[420px] -top-40 left-1/2 -translate-x-1/2 bg-cyan-500/15" />
        <div className="kf-aurora w-[520px] h-[520px] top-[35%] -left-40 bg-violet-600/12" style={{ animationDelay: '-5s' }} />
        <div className="kf-aurora w-[520px] h-[520px] top-[55%] -right-40 bg-fuchsia-600/10" style={{ animationDelay: '-9s' }} />
        <div className="absolute inset-0 kf-grid-bg" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
      </div>

      {/* ── nav ── */}
      <header className="sticky top-0 z-50 kf-glass !border-x-0 !border-t-0">
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2.5 group cursor-pointer">
            <span className="relative">
              <AppLogo className="w-8 h-8 group-hover:scale-105 transition-transform" />
              <span className="absolute inset-0 blur-lg bg-cyan-500/30 -z-10 rounded-full" />
            </span>
            <span className="text-left">
              <span className="block text-[17px] font-extrabold tracking-tight text-white leading-none">
                Keyfrio <span className="kf-badge-brand kf-badge !text-[9px] ml-1 align-middle">2.0</span>
              </span>
              <span className="block text-[10px] text-neutral-500 mt-0.5 hidden sm:block">Edit every moment. Shape every story.</span>
            </span>
          </button>
          <nav className="hidden lg:flex items-center gap-8 text-[13px] text-neutral-400 font-medium">
            {[
              ['#features', '核心特性'], ['#ai', 'AI 套件'], ['#templates', '场景模板'], ['#tech', '技术架构'],
            ].map(([href, label]) => (
              <a key={href} href={href} className="hover:text-white transition-colors relative group">
                {label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-cyan-400 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2.5">
            <button onClick={openHome} className="kf-btn kf-btn-ghost text-xs px-3.5 py-2">
              <FolderOpen className="w-3.5 h-3.5 text-cyan-300" />
              <span className="hidden sm:inline">工程项目库</span>
              {projectList.length > 0 && (
                <span className="kf-badge-accent kf-badge !text-[10px] !px-1.5">{projectList.length}</span>
              )}
            </button>
            <button onClick={openHome} className="kf-btn kf-btn-primary text-[13px] px-4 py-2">
              <Sparkles className="w-3.5 h-3.5" />
              立即创作
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── hero ── */}
      <section className="relative z-10 px-5 pt-20 lg:pt-28 pb-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 rounded-full border border-cyan-400/25 bg-cyan-400/[0.07] pl-2 pr-4 py-1.5 text-xs text-neutral-300 mb-8 backdrop-blur-md"
        >
          <span className="kf-badge-accent kf-badge !text-[10px] !py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" /> NEW
          </span>
          <span className="font-medium">Keyfrio 2.0 创新发布 · GPU 粒子引擎 + AI 副驾驶</span>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-[42px] sm:text-6xl lg:text-[76px] font-black tracking-[-0.03em] leading-[1.04] max-w-4xl mx-auto"
        >
          重塑每一个精彩瞬间
          <br />
          <span className="kf-gradient-text">让每一个故事，在此成片</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-[15px] sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed"
        >
          下一代 <span className="text-cyan-300 font-semibold">Web 原生</span>多轨视音频剪辑系统。
          无需下载、秒级启动 —— 4K 实时渲染、GPU 粒子着色器、Lottie 矢量动效、电影级调色与 AI 创意副驾驶，全在浏览器里。
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3.5"
        >
          <button onClick={openHome} className="kf-btn kf-btn-primary text-[15px] px-7 py-3.5 !rounded-xl font-bold">
            <Sparkles className="w-4 h-4" />
            立即创作
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => { loadDemoProject(); openEditor(); }}
            className="kf-btn kf-btn-ghost text-[15px] px-6 py-3.5 !rounded-xl"
          >
            <span className="w-7 h-7 rounded-full bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center">
              <Play className="w-3.5 h-3.5 text-emerald-300 fill-emerald-300 ml-px" />
            </span>
            试玩演示工程
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-px max-w-3xl mx-auto rounded-2xl overflow-hidden border border-white/[0.07] bg-white/[0.07]"
        >
          {STATS.map((s) => (
            <div key={s.label} className="bg-[#0a0c12]/95 px-4 py-5">
              <div className="text-2xl sm:text-3xl font-black kf-gradient-text">{s.value}</div>
              <div className="mt-1 text-[11px] text-neutral-500">{s.label}</div>
            </div>
          ))}
        </motion.div>

        <HeroMockup onOpen={openHome} />
      </section>

      {/* ── marquee ── */}
      <section className="relative z-10 mt-20 border-y border-white/[0.06] bg-white/[0.015] py-4 overflow-hidden">
        <div className="flex whitespace-nowrap" style={{ animation: 'kf-marquee 28s linear infinite' }}>
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center">
              {MARQUEE_ITEMS.map((item) => (
                <span key={`${dup}-${item}`} className="mx-6 flex items-center gap-6 text-[13px] font-medium text-neutral-500">
                  {item}
                  <Star className="w-3 h-3 text-cyan-500/50" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── features bento ── */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-5 pt-28 pb-8">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="kf-eyebrow justify-center">核心特性</span>
          <h2 className="mt-4 text-3xl sm:text-[44px] font-black tracking-tight leading-tight">
            桌面级剪辑能力，<span className="kf-gradient-text">装进口袋的浏览器</span>
          </h2>
          <p className="mt-4 text-neutral-400 text-[15px]">从时间线到调色，从混音到导出 —— 专业流程，一处打通。</p>
        </Reveal>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 0.08}>
              <div className="kf-card kf-card-hoverable p-6 h-full group relative overflow-hidden">
                <div
                  className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-25 transition-opacity duration-500"
                  style={{ background: f.accent }}
                />
                <span
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 border"
                  style={{ background: `${f.accent}14`, borderColor: `${f.accent}30`, color: f.accent }}
                >
                  <f.icon className="w-5 h-5" />
                </span>
                <h3 className="text-[16px] font-bold text-white mb-2">{f.title}</h3>
                <p className="text-[13px] text-neutral-400 leading-relaxed">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── AI section ── */}
      <section id="ai" className="relative z-10 max-w-7xl mx-auto px-5 pt-24 pb-8">
        <Reveal>
          <div className="relative rounded-3xl overflow-hidden border border-violet-400/20 bg-gradient-to-br from-violet-950/40 via-[#0b0e15] to-[#0b0e15] p-8 sm:p-14">
            <div className="kf-aurora w-[420px] h-[300px] -top-20 right-0 bg-violet-600/25" />
            <div className="relative grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="kf-badge-brand kf-badge mb-5"><Wand2 className="w-3 h-3" /> AI 创意套件</span>
                <h2 className="text-3xl sm:text-[40px] font-black tracking-tight leading-tight">
                  你的 <span className="kf-gradient-text">AI 剪辑副驾驶</span>
                </h2>
                <p className="mt-4 text-neutral-400 text-[15px] leading-relaxed">
                  一句话生成分镜脚本，智能识别场景自动粗剪，语音转字幕精准到帧。
                  把重复劳动交给 AI，你只负责创意。
                </p>
                <ul className="mt-6 space-y-3">
                  {['智能场景识别 · 一键粗剪', '语音转字幕 · 双语对齐', '文案成片 · 分镜自动生成', 'Gemini 驱动的创意对话'].map((t) => (
                    <li key={t} className="flex items-center gap-2.5 text-sm text-neutral-300">
                      <CheckCircle2 className="w-4 h-4 text-violet-300 shrink-0" /> {t}
                    </li>
                  ))}
                </ul>
                <button onClick={openHome} className="kf-btn kf-btn-brand mt-8 px-6 py-3 !rounded-xl text-sm font-semibold">
                  <Sparkles className="w-4 h-4" /> 体验 AI 创作
                </button>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                  <span className="text-xs text-neutral-400">AI Copilot · 实时对话</span>
                </div>
                <div className="space-y-3 text-[13px]">
                  <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-violet-500/20 border border-violet-400/25 px-4 py-2.5 text-neutral-200">
                    帮我把这段旅拍素材剪成 30 秒卡点短片
                  </div>
                  <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-white/[0.05] border border-white/10 px-4 py-2.5 text-neutral-300">
                    已识别 12 个场景 · 按鼓点完成粗剪，生成 3 组转场与双语字幕，预览看看效果？
                  </div>
                  <div className="flex gap-2">
                    {['应用粗剪', '换种风格', '导出看看'].map((b) => (
                      <span key={b} className="kf-chip !text-[11px] !py-1.5">{b}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── templates ── */}
      <section id="templates" className="relative z-10 max-w-7xl mx-auto px-5 pt-24 pb-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="kf-eyebrow">场景模板</span>
            <h2 className="mt-4 text-3xl sm:text-[40px] font-black tracking-tight">从模板开始，<span className="kf-gradient-text">快 10 倍</span></h2>
          </div>
          <button onClick={openHome} className="kf-btn kf-btn-ghost text-xs px-4 py-2">
            浏览全部模板 <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </Reveal>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TEMPLATES.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.07}>
              <button
                onClick={() => handleUseTemplate(t)}
                className="kf-card kf-card-hoverable overflow-hidden text-left w-full group cursor-pointer"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={t.bgImage} alt={t.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <span
                    className="absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded-md border backdrop-blur-md"
                    style={{ color: t.accent, borderColor: `${t.accent}50`, background: `${t.accent}1a` }}
                  >
                    {t.tag}
                  </span>
                  <span className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-white">{t.title}</h3>
                  <p className="mt-1.5 text-[11px] text-neutral-500 leading-relaxed">{t.desc}</p>
                  <div className="mt-3 flex items-center gap-2 text-[10px] font-mono text-neutral-500">
                    <span className="kf-badge !text-[10px]">{t.aspect}</span>
                    <span>{t.fps} FPS</span>
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── tech strip ── */}
      <section id="tech" className="relative z-10 max-w-7xl mx-auto px-5 pt-24 pb-8">
        <Reveal className="text-center">
          <span className="kf-eyebrow justify-center">技术架构</span>
          <h2 className="mt-4 text-3xl sm:text-[40px] font-black tracking-tight">为浏览器 <span className="kf-gradient-text">重新发明</span> 非编</h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Cpu, t: 'WebCodecs', d: '硬件级编解码，导出飞快' },
            { icon: Layers, t: 'PixiJS WebGL', d: 'GPU 合成实时预览' },
            { icon: Film, t: 'OPFS 存储', d: '本地工程毫秒级存取' },
            { icon: MonitorPlay, t: 'Lottie 引擎', d: '矢量动效无限缩放' },
          ].map((x, i) => (
            <Reveal key={x.t} delay={i * 0.06}>
              <div className="kf-card p-5 text-center h-full">
                <x.icon className="w-6 h-6 mx-auto text-cyan-300 mb-3" />
                <div className="text-sm font-bold text-white">{x.t}</div>
                <div className="mt-1 text-[11px] text-neutral-500">{x.d}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── final CTA ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-5 py-28">
        <Reveal>
          <div className="relative text-center rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent px-6 py-20 overflow-hidden">
            <div className="kf-aurora w-[500px] h-[280px] top-0 left-1/2 -translate-x-1/2 bg-cyan-500/15" />
            <h2 className="relative text-3xl sm:text-5xl font-black tracking-tight">
              下一个爆款，从 <span className="kf-gradient-text">第一次剪辑</span> 开始
            </h2>
            <p className="relative mt-4 text-neutral-400">打开浏览器，就是你的剪辑室。</p>
            <div className="relative mt-8 flex justify-center gap-3.5">
              <button onClick={openHome} className="kf-btn kf-btn-primary text-[15px] px-8 py-3.5 !rounded-xl font-bold">
                <Scissors className="w-4 h-4" /> 免费开始创作
              </button>
              <button onClick={openShortcutsModal} className="kf-btn kf-btn-ghost text-sm px-5 py-3.5 !rounded-xl">
                <Keyboard className="w-4 h-4" /> 快捷键指南
              </button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── footer ── */}
      <footer className="relative z-10 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <AppLogo className="w-6 h-6" />
            <span className="text-sm font-bold text-white">Keyfrio</span>
            <span className="text-[11px] text-neutral-600">Edit every moment. Shape every story.</span>
          </div>
          <div className="flex items-center gap-5 text-xs text-neutral-500">
            <span className="flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-orange-400" /> 100% 本地 · 隐私安全</span>
            <a href="https://github.com/Alex-Qiong/Keyfrio" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Github className="w-3.5 h-3.5" /> GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
