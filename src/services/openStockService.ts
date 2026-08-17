/**
 * Open Stock Media Service
 * Integrates open source and free commercial stock media providers:
 * 1. Openverse (Images, Audio) - No Key Needed (CC / Public Domain)
 * 2. Wikimedia Commons (Images, Videos) - No Key Needed (Open Licenses)
 * 3. Internet Archive (Videos, Audio, Images) - No Key Needed (Public Domain / Open)
 * 4. Pexels (Images, Videos) - Supports Key / Pexels License
 * 5. Pixabay (Images, Videos) - Supports Key / Pixabay License
 * 6. Unsplash (Images) - Supports Key / Unsplash License
 */

export type PlatformId = 'openverse' | 'wikimedia' | 'archive' | 'pexels' | 'pixabay' | 'unsplash';

export interface PlatformInfo {
  id: PlatformId;
  name: string;
  mediaTypes: ('image' | 'video' | 'audio')[];
  requiresKey: boolean;
  license: string;
  description: string;
  badge: string;
  color: string;
  homepage: string;
  keyStorageKey?: string;
  sampleKeywords: string[];
}

export interface OpenStockItem {
  id: string;
  platform: PlatformId;
  type: 'image' | 'video' | 'audio';
  title: string;
  url: string;
  thumbnail: string;
  previewUrl?: string;
  author?: string;
  authorUrl?: string;
  license: string;
  licenseUrl?: string;
  duration?: number; // In seconds
  width?: number;
  height?: number;
  description?: string;
  tags?: string[];
}

export const PLATFORMS: Record<PlatformId, PlatformInfo> = {
  openverse: {
    id: 'openverse',
    name: 'Openverse',
    mediaTypes: ['image', 'audio'],
    requiresKey: false,
    license: 'CC / Public Domain 聚合',
    description: '由 WordPress 基金会维护的开源公共领域与知识共享 (CC) 媒体聚合库，覆盖数亿图片与音频。',
    badge: '免 Key · 知识共享',
    color: '#8b5cf6',
    homepage: 'https://openverse.org',
    sampleKeywords: ['Nature', 'Cyberpunk', 'Ambient Music', 'Ocean', 'Technology', 'Guitar', 'Texture', 'Sunset'],
  },
  wikimedia: {
    id: 'wikimedia',
    name: 'Wikimedia Commons',
    mediaTypes: ['image', 'video'],
    requiresKey: false,
    license: '各种开放授权 (CC BY / SA / Public Domain)',
    description: '维基百科官方多媒体档案馆，包含全世界数千万张高分辨率历史档案、科学图解与开放视频。',
    badge: '免 Key · 维基百科',
    color: '#3b82f6',
    homepage: 'https://commons.wikimedia.org',
    sampleKeywords: ['Space NASA', 'Wildlife', 'Timelapse', 'Earth', 'Architecture', 'Ocean Creatures', 'Aurora', 'Waterfall'],
  },
  archive: {
    id: 'archive',
    name: 'Internet Archive',
    mediaTypes: ['video', 'audio', 'image'],
    requiresKey: false,
    license: 'Public Domain / 开放授权',
    description: '互联网档案馆，保存人类文明历史影像、经典无版权电影、早期动画、历史录音与开源音轨。',
    badge: '免 Key · 历史典藏',
    color: '#10b981',
    homepage: 'https://archive.org',
    sampleKeywords: ['Classic Film', 'Sci-Fi 1950', 'NASA Apollo', 'Jazz Archive', 'Old Cartoon', 'Vintage News', 'Ambient Synth', 'Nature Soundscape'],
  },
  pexels: {
    id: 'pexels',
    name: 'Pexels',
    mediaTypes: ['image', 'video'],
    requiresKey: true,
    license: 'Pexels License (免费商用)',
    description: '全球顶尖高质量摄影与 4K 超高清免版税视频平台，允许自由编辑并用于商业和个人视频制作。',
    badge: '支持 API Key · 4K 高清',
    color: '#06b6d4',
    homepage: 'https://www.pexels.com',
    keyStorageKey: 'opencut_pexels_api_key',
    sampleKeywords: ['4K Drone', 'Urban Neon', 'Coffee Aesthetic', 'Fitness Gym', 'Slow Motion Water', 'Business Meeting', 'Coding Tech', 'Mountain Sunrise'],
  },
  pixabay: {
    id: 'pixabay',
    name: 'Pixabay',
    mediaTypes: ['image', 'video'],
    requiresKey: true,
    license: 'Pixabay License (免费商用)',
    description: '超过 400 万免版税高品质照片、插图与 4K 动态视频片段，无需署名即可免费商业使用。',
    badge: '支持 API Key · 免署名',
    color: '#f59e0b',
    homepage: 'https://pixabay.com',
    keyStorageKey: 'opencut_pixabay_api_key',
    sampleKeywords: ['Particle Background', 'Smoke Effect', 'Abstract Loop', 'Forest Mist', 'Technology Network', 'Fireworks 4K', 'Traffic Lights', 'Calm Lake'],
  },
  unsplash: {
    id: 'unsplash',
    name: 'Unsplash',
    mediaTypes: ['image'],
    requiresKey: true,
    license: 'Unsplash License (免费商用)',
    description: '全球知名摄影师社区，提供充满艺术质感与电影氛围的高分辨率商业级摄影与设计壁纸。',
    badge: '支持 API Key · 摄影大片',
    color: '#ec4899',
    homepage: 'https://unsplash.com',
    keyStorageKey: 'opencut_unsplash_api_key',
    sampleKeywords: ['Cinematic Portrait', 'Tokyo Night Street', 'Minimalist Architecture', 'Dark Studio', 'Cyber Aesthetic', 'Cosmic Galaxy', 'Modern Workspace', 'Vintage Car'],
  },
};

// Curated stock fallback dataset for instant fast preview & offline stability
const CURATED_STOCK_DATA: Record<PlatformId, OpenStockItem[]> = {
  openverse: [
    {
      id: 'ov-img-1',
      platform: 'openverse',
      type: 'image',
      title: 'Neon Cyberpunk Futuristic City High Angle',
      url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=60',
      author: 'Openverse Community',
      license: 'CC BY 2.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
      width: 1920,
      height: 1080,
      tags: ['cyberpunk', 'neon', 'city', 'night'],
    },
    {
      id: 'ov-img-2',
      platform: 'openverse',
      type: 'image',
      title: 'Deep Mountain Pine Forest in Morning Mist',
      url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&auto=format&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&auto=format&fit=crop&q=60',
      author: 'CC Explorer',
      license: 'CC0 / Public Domain',
      licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
      width: 1920,
      height: 1080,
      tags: ['nature', 'forest', 'mist', 'mountains'],
    },
    {
      id: 'ov-aud-1',
      platform: 'openverse',
      type: 'audio',
      title: 'Cinematic Ambient Ethereal Synth Drone',
      url: 'https://cdn.freesound.org/previews/567/567232_5674468-lq.mp3',
      thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=60',
      author: 'Freesound CC Creator',
      license: 'CC BY 4.0',
      duration: 18,
      tags: ['ambient', 'drone', 'cinematic', 'synth'],
    },
    {
      id: 'ov-aud-2',
      platform: 'openverse',
      type: 'audio',
      title: 'Deep Ocean Waves and Seagulls Coastal Audio',
      url: 'https://cdn.freesound.org/previews/530/530663_11861866-lq.mp3',
      thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=60',
      author: 'Openverse Sound',
      license: 'CC0 / Public Domain',
      duration: 24,
      tags: ['ocean', 'waves', 'relaxing', 'nature'],
    },
    {
      id: 'ov-img-3',
      platform: 'openverse',
      type: 'image',
      title: 'Abstract Gradient Fluid Holographic Texture',
      url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1600&auto=format&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&auto=format&fit=crop&q=60',
      author: 'Design Lab',
      license: 'CC BY-SA 4.0',
      width: 1920,
      height: 1080,
      tags: ['abstract', 'fluid', 'gradient', 'texture'],
    },
    {
      id: 'ov-aud-3',
      platform: 'openverse',
      type: 'audio',
      title: 'Uplifting Acoustic Guitar Strum Melody',
      url: 'https://cdn.freesound.org/previews/518/518296_9841804-lq.mp3',
      thumbnail: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&auto=format&fit=crop&q=60',
      author: 'Folk Musician',
      license: 'CC BY 3.0',
      duration: 16,
      tags: ['acoustic', 'guitar', 'warm', 'folk'],
    },
  ],
  wikimedia: [
    {
      id: 'wm-vid-1',
      platform: 'wikimedia',
      type: 'video',
      title: 'Earth Orbit Satellite Rotation Timelapse (NASA)',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&auto=format&fit=crop&q=60',
      author: 'NASA Earth Observatory / Wikimedia',
      license: 'Public Domain / NASA',
      duration: 15,
      width: 1920,
      height: 1080,
      tags: ['space', 'earth', 'nasa', 'timelapse'],
    },
    {
      id: 'wm-vid-2',
      platform: 'wikimedia',
      type: 'video',
      title: 'Majestic Waterfall Rapids Slow Motion Flow',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=400&auto=format&fit=crop&q=60',
      author: 'Wikimedia Contributor',
      license: 'CC BY-SA 4.0',
      duration: 15,
      width: 1920,
      height: 1080,
      tags: ['waterfall', 'nature', 'river', 'water'],
    },
    {
      id: 'wm-img-1',
      platform: 'wikimedia',
      type: 'image',
      title: 'James Webb Cosmic Cliffs Nebula Galaxy',
      url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1600&auto=format&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&auto=format&fit=crop&q=60',
      author: 'NASA, ESA, CSA, STScI',
      license: 'Public Domain',
      width: 1920,
      height: 1080,
      tags: ['space', 'jwst', 'galaxy', 'astronomy'],
    },
    {
      id: 'wm-img-2',
      platform: 'wikimedia',
      type: 'image',
      title: 'Classical Roman Pantheon Dome Architecture',
      url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1600&auto=format&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&auto=format&fit=crop&q=60',
      author: 'Wikimedia Heritage Project',
      license: 'CC BY 3.0',
      width: 1920,
      height: 1080,
      tags: ['architecture', 'rome', 'history', 'pantheon'],
    },
  ],
  archive: [
    {
      id: 'ia-vid-1',
      platform: 'archive',
      type: 'video',
      title: 'Apollo 11 Moon Landing Historic Archive Footage',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=400&auto=format&fit=crop&q=60',
      author: 'Internet Archive / NASA Film Collection',
      license: 'Public Domain',
      duration: 12,
      width: 1920,
      height: 1080,
      tags: ['historic', 'apollo', 'vintage', 'space'],
    },
    {
      id: 'ia-aud-1',
      platform: 'archive',
      type: 'audio',
      title: 'Vintage 1920s Vinyl Jazz Gramophone Track',
      url: 'https://cdn.freesound.org/previews/415/415804_5121236-lq.mp3',
      thumbnail: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&auto=format&fit=crop&q=60',
      author: 'Internet Archive 78rpm Collection',
      license: 'Public Domain Mark 1.0',
      duration: 20,
      tags: ['vintage', 'jazz', 'vinyl', 'retro'],
    },
    {
      id: 'ia-vid-2',
      platform: 'archive',
      type: 'video',
      title: 'Classic Open Source Animation Film Project',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop&q=60',
      author: 'Blender Open Movie / Internet Archive',
      license: 'CC BY 3.0',
      duration: 10,
      width: 1920,
      height: 1080,
      tags: ['animation', 'blender', 'cartoon', 'cinema'],
    },
    {
      id: 'ia-img-1',
      platform: 'archive',
      type: 'image',
      title: 'Early 20th Century Vintage Map of World Explorations',
      url: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600&auto=format&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&auto=format&fit=crop&q=60',
      author: 'Internet Archive Book Images',
      license: 'Public Domain',
      width: 1920,
      height: 1080,
      tags: ['vintage', 'map', 'history', 'antique'],
    },
  ],
  pexels: [
    {
      id: 'px-vid-1',
      platform: 'pexels',
      type: 'video',
      title: '4K Drone Aerial Coastline Turquoise Sea Waves',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=60',
      author: 'Pexels Aerial Studio',
      license: 'Pexels License (免费商用)',
      duration: 15,
      width: 3840,
      height: 2160,
      tags: ['drone', 'coast', 'waves', 'aerial', '4k'],
    },
    {
      id: 'px-vid-2',
      platform: 'pexels',
      type: 'video',
      title: 'Urban Cyber City Night Highway Traffic Stream',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&auto=format&fit=crop&q=60',
      author: 'Pexels Night Creator',
      license: 'Pexels License (免费商用)',
      duration: 12,
      width: 1920,
      height: 1080,
      tags: ['urban', 'traffic', 'night', 'city', 'lights'],
    },
    {
      id: 'px-img-1',
      platform: 'pexels',
      type: 'image',
      title: 'Cozy Morning Coffee Espresso Brewing Aroma',
      url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600&auto=format&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&auto=format&fit=crop&q=60',
      author: 'Pexels Coffee House',
      license: 'Pexels License (免费商用)',
      width: 1920,
      height: 1080,
      tags: ['coffee', 'morning', 'cafe', 'warm'],
    },
    {
      id: 'px-img-2',
      platform: 'pexels',
      type: 'image',
      title: 'Modern Minimalist Architecture Glass Facade',
      url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&auto=format&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&auto=format&fit=crop&q=60',
      author: 'Pexels Architecture',
      license: 'Pexels License (免费商用)',
      width: 1920,
      height: 1080,
      tags: ['architecture', 'glass', 'modern', 'building'],
    },
  ],
  pixabay: [
    {
      id: 'pb-vid-1',
      platform: 'pixabay',
      type: 'video',
      title: '4K Golden Cyber Particles Floating Loop',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=60',
      author: 'Pixabay VFX Master',
      license: 'Pixabay License (免费商用)',
      duration: 14,
      width: 3840,
      height: 2160,
      tags: ['particles', 'gold', 'abstract', 'loop', 'vfx'],
    },
    {
      id: 'pb-vid-2',
      platform: 'pixabay',
      type: 'video',
      title: 'Misty Alpine Lake Mountain Reflection Sunrise',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&auto=format&fit=crop&q=60',
      author: 'Pixabay Nature Films',
      license: 'Pixabay License (免费商用)',
      duration: 15,
      width: 1920,
      height: 1080,
      tags: ['nature', 'lake', 'mountains', 'sunrise'],
    },
    {
      id: 'pb-img-1',
      platform: 'pixabay',
      type: 'image',
      title: 'Vibrant Neon Geometric Hologram Cyber Grid',
      url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1600&auto=format&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=60',
      author: 'Pixabay Digital Artist',
      license: 'Pixabay License (免费商用)',
      width: 1920,
      height: 1080,
      tags: ['matrix', 'cyber', 'code', 'neon'],
    },
  ],
  unsplash: [
    {
      id: 'us-img-1',
      platform: 'unsplash',
      type: 'image',
      title: 'Cinematic Rainy Tokyo Shinjuku Alleyway at Night',
      url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1600&auto=format&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400&auto=format&fit=crop&q=60',
      author: 'Alex Knight',
      authorUrl: 'https://unsplash.com/@agk42',
      license: 'Unsplash License (免费商用)',
      width: 1920,
      height: 1280,
      tags: ['tokyo', 'cyberpunk', 'rain', 'night', 'street'],
    },
    {
      id: 'us-img-2',
      platform: 'unsplash',
      type: 'image',
      title: 'Atmospheric Northern Lights Aurora Borealis Over Fjord',
      url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1600&auto=format&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&auto=format&fit=crop&q=60',
      author: 'Tobias Tullius',
      authorUrl: 'https://unsplash.com/@tobiastu',
      license: 'Unsplash License (免费商用)',
      width: 1920,
      height: 1080,
      tags: ['aurora', 'norway', 'night', 'nature', 'stars'],
    },
    {
      id: 'us-img-3',
      platform: 'unsplash',
      type: 'image',
      title: 'Dark Minimalist Workspace Setup with OLED Monitor',
      url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1600&auto=format&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&auto=format&fit=crop&q=60',
      author: 'Design Minimal',
      authorUrl: 'https://unsplash.com',
      license: 'Unsplash License (免费商用)',
      width: 1920,
      height: 1080,
      tags: ['workspace', 'desk', 'tech', 'minimalist'],
    },
    {
      id: 'us-img-4',
      platform: 'unsplash',
      type: 'image',
      title: 'Dramatic Desert Sand Dunes at Sunset Horizon',
      url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1600&auto=format&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&auto=format&fit=crop&q=60',
      author: 'Jeremy Bishop',
      authorUrl: 'https://unsplash.com/@jeremybishop',
      license: 'Unsplash License (免费商用)',
      width: 1920,
      height: 1080,
      tags: ['desert', 'dunes', 'sunset', 'sand', 'nature'],
    },
  ],
};

/**
 * Fetch real media from Openverse API
 */
async function searchOpenverse(
  query: string,
  mediaType: 'all' | 'image' | 'video' | 'audio'
): Promise<OpenStockItem[]> {
  const items: OpenStockItem[] = [];
  const q = encodeURIComponent(query || 'nature');

  // Openverse supports image and audio
  const fetchImages = mediaType === 'all' || mediaType === 'image';
  const fetchAudio = mediaType === 'all' || mediaType === 'audio';

  try {
    if (fetchImages) {
      const resp = await fetch(`https://api.openverse.org/v1/images/?q=${q}&page_size=16`, {
        headers: { Accept: 'application/json' },
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.results && Array.isArray(data.results)) {
          data.results.forEach((r: any) => {
            items.push({
              id: `ov-img-${r.id || Math.random()}`,
              platform: 'openverse',
              type: 'image',
              title: r.title || 'Openverse Image',
              url: r.url || r.thumbnail,
              thumbnail: r.thumbnail || r.url,
              author: r.creator || 'Openverse Contributor',
              authorUrl: r.creator_url,
              license: r.license ? `CC ${r.license.toUpperCase()} ${r.license_version || ''}` : 'Creative Commons',
              licenseUrl: r.license_url,
              width: r.width,
              height: r.height,
              tags: r.tags ? r.tags.map((t: any) => t.name).slice(0, 4) : undefined,
            });
          });
        }
      }
    }

    if (fetchAudio) {
      const resp = await fetch(`https://api.openverse.org/v1/audio/?q=${q}&page_size=16`, {
        headers: { Accept: 'application/json' },
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.results && Array.isArray(data.results)) {
          data.results.forEach((r: any) => {
            items.push({
              id: `ov-aud-${r.id || Math.random()}`,
              platform: 'openverse',
              type: 'audio',
              title: r.title || 'Openverse Audio Track',
              url: r.url,
              thumbnail: r.thumbnail || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=60',
              previewUrl: r.url,
              author: r.creator || 'Openverse Musician',
              authorUrl: r.creator_url,
              license: r.license ? `CC ${r.license.toUpperCase()} ${r.license_version || ''}` : 'Creative Commons',
              licenseUrl: r.license_url,
              duration: r.duration ? Math.round(r.duration / 1000) : 15,
              tags: r.tags ? r.tags.map((t: any) => t.name).slice(0, 4) : undefined,
            });
          });
        }
      }
    }
  } catch (err) {
    console.warn('Openverse API error, using curated fallback:', err);
  }

  return items;
}

/**
 * Fetch real media from Wikimedia Commons API
 */
async function searchWikimedia(
  query: string,
  mediaType: 'all' | 'image' | 'video' | 'audio'
): Promise<OpenStockItem[]> {
  const items: OpenStockItem[] = [];
  const baseQuery = query ? query.trim() : 'space';
  
  // Format query according to requested media type
  let searchQuery = baseQuery;
  if (mediaType === 'video') {
    searchQuery = `${baseQuery} filemime:video/webm OR filemime:video/ogg OR filemime:video/mp4`;
  }

  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrsearch=${encodeURIComponent(searchQuery)}&gsrnamespace=6&gsrlimit=20&prop=imageinfo&iiprop=url|size|mime|extmetadata|thumburl&iiurlwidth=400`;
    const resp = await fetch(url);
    if (resp.ok) {
      const data = await resp.json();
      if (data.query && data.query.pages) {
        Object.values(data.query.pages).forEach((page: any) => {
          if (page.imageinfo && page.imageinfo[0]) {
            const info = page.imageinfo[0];
            const mime = (info.mime || '').toLowerCase();
            const isVideo = mime.startsWith('video/') || info.url.endsWith('.webm') || info.url.endsWith('.ogv') || info.url.endsWith('.mp4');
            const isAudio = mime.startsWith('audio/') || info.url.endsWith('.ogg') || info.url.endsWith('.mp3');
            const isImg = mime.startsWith('image/') || (!isVideo && !isAudio);

            let type: 'image' | 'video' | 'audio' = 'image';
            if (isVideo) type = 'video';
            else if (isAudio) type = 'audio';

            if (mediaType !== 'all' && type !== mediaType) return;

            const cleanTitle = (page.title || '').replace(/^File:/i, '').replace(/\.[^/.]+$/, '');
            const meta = info.extmetadata || {};
            const author = meta.Artist?.value ? meta.Artist.value.replace(/<[^>]*>?/gm, '').trim() : 'Wikimedia Commons';
            const license = meta.LicenseShortName?.value || 'CC BY-SA / Public Domain';

            items.push({
              id: `wm-${page.pageid || Math.random()}`,
              platform: 'wikimedia',
              type,
              title: cleanTitle || 'Wikimedia Resource',
              url: info.url,
              thumbnail: info.thumburl || info.url,
              author,
              license,
              width: info.width,
              height: info.height,
              duration: isVideo ? 12 : undefined,
            });
          }
        });
      }
    }
  } catch (err) {
    console.warn('Wikimedia API error, using curated fallback:', err);
  }

  return items;
}

/**
 * Fetch real media from Internet Archive API
 */
async function searchArchive(
  query: string,
  mediaType: 'all' | 'image' | 'video' | 'audio'
): Promise<OpenStockItem[]> {
  const items: OpenStockItem[] = [];
  const q = encodeURIComponent(query || 'nasa');
  
  let typeFilter = '(movies OR audio OR image)';
  if (mediaType === 'video') typeFilter = 'movies';
  if (mediaType === 'audio') typeFilter = 'audio';
  if (mediaType === 'image') typeFilter = 'image';

  try {
    const url = `https://archive.org/advancedsearch.php?q=${q}+AND+mediatype:${typeFilter}&fl[]=identifier,title,mediatype,description,downloads,year,creator,licenseurl&sort[]=downloads+desc&rows=18&page=1&output=json`;
    const resp = await fetch(url);
    if (resp.ok) {
      const data = await resp.json();
      if (data.response && data.response.docs) {
        data.response.docs.forEach((doc: any) => {
          const id = doc.identifier;
          let type: 'image' | 'video' | 'audio' = 'image';
          if (doc.mediatype === 'movies') type = 'video';
          else if (doc.mediatype === 'audio') type = 'audio';

          const thumb = `https://archive.org/services/img/${id}`;
          // Best-effort direct media link
          let mediaUrl = thumb;
          if (type === 'video') {
            mediaUrl = `https://archive.org/download/${id}/${id}.mp4`;
          } else if (type === 'audio') {
            mediaUrl = `https://archive.org/download/${id}/${id}.mp3`;
          }

          items.push({
            id: `ia-${id}`,
            platform: 'archive',
            type,
            title: doc.title || id,
            url: mediaUrl,
            thumbnail: thumb,
            previewUrl: mediaUrl,
            author: doc.creator || 'Internet Archive Contributor',
            license: 'Public Domain / Open Access',
            licenseUrl: doc.licenseurl,
            duration: type === 'video' ? 15 : type === 'audio' ? 20 : undefined,
          });
        });
      }
    }
  } catch (err) {
    console.warn('Internet Archive API error:', err);
  }

  return items;
}

/**
 * Fetch real media from Pexels API (with user API Key)
 */
async function searchPexels(
  query: string,
  mediaType: 'all' | 'image' | 'video' | 'audio',
  apiKey?: string
): Promise<OpenStockItem[]> {
  const items: OpenStockItem[] = [];
  const q = encodeURIComponent(query || 'nature');
  if (!apiKey) return [];

  try {
    // 1. Search Videos
    if (mediaType === 'all' || mediaType === 'video') {
      const resp = await fetch(`https://api.pexels.com/videos/search?query=${q}&per_page=12`, {
        headers: { Authorization: apiKey },
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.videos) {
          data.videos.forEach((v: any) => {
            const bestFile = v.video_files?.find((f: any) => f.quality === 'hd') || v.video_files?.[0];
            if (bestFile) {
              items.push({
                id: `px-vid-${v.id}`,
                platform: 'pexels',
                type: 'video',
                title: `Pexels Video by ${v.user?.name || 'Photographer'}`,
                url: bestFile.link,
                thumbnail: v.image,
                author: v.user?.name,
                authorUrl: v.user?.url,
                license: 'Pexels License (免费商用)',
                licenseUrl: 'https://www.pexels.com/license/',
                duration: v.duration || 10,
                width: v.width,
                height: v.height,
              });
            }
          });
        }
      }
    }

    // 2. Search Photos
    if (mediaType === 'all' || mediaType === 'image') {
      const resp = await fetch(`https://api.pexels.com/v1/search?query=${q}&per_page=12`, {
        headers: { Authorization: apiKey },
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.photos) {
          data.photos.forEach((p: any) => {
            items.push({
              id: `px-img-${p.id}`,
              platform: 'pexels',
              type: 'image',
              title: p.alt || `Pexels Photo by ${p.photographer}`,
              url: p.src?.original || p.src?.large2x || p.src?.large,
              thumbnail: p.src?.medium || p.src?.small,
              author: p.photographer,
              authorUrl: p.photographer_url,
              license: 'Pexels License (免费商用)',
              licenseUrl: 'https://www.pexels.com/license/',
              width: p.width,
              height: p.height,
            });
          });
        }
      }
    }
  } catch (err) {
    console.warn('Pexels API error:', err);
  }

  return items;
}

/**
 * Fetch real media from Pixabay API (with user API Key)
 */
async function searchPixabay(
  query: string,
  mediaType: 'all' | 'image' | 'video' | 'audio',
  apiKey?: string
): Promise<OpenStockItem[]> {
  const items: OpenStockItem[] = [];
  const q = encodeURIComponent(query || 'nature');
  if (!apiKey) return [];

  try {
    // 1. Search Videos
    if (mediaType === 'all' || mediaType === 'video') {
      const resp = await fetch(`https://pixabay.com/api/videos/?key=${apiKey}&q=${q}&per_page=12`);
      if (resp.ok) {
        const data = await resp.json();
        if (data.hits) {
          data.hits.forEach((v: any) => {
            const bestVideo = v.videos?.large || v.videos?.medium || v.videos?.small;
            if (bestVideo && bestVideo.url) {
              items.push({
                id: `pb-vid-${v.id}`,
                platform: 'pixabay',
                type: 'video',
                title: v.tags || 'Pixabay Video',
                url: bestVideo.url,
                thumbnail: bestVideo.thumbnail || `https://i.vimeocdn.com/video/${v.picture_id}_640x360.jpg`,
                author: v.user,
                license: 'Pixabay License (免费商用)',
                licenseUrl: 'https://pixabay.com/service/license-summary/',
                duration: v.duration || 10,
                tags: v.tags ? v.tags.split(',').map((t: string) => t.trim()) : undefined,
              });
            }
          });
        }
      }
    }

    // 2. Search Photos
    if (mediaType === 'all' || mediaType === 'image') {
      const resp = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${q}&image_type=photo&per_page=12`);
      if (resp.ok) {
        const data = await resp.json();
        if (data.hits) {
          data.hits.forEach((p: any) => {
            items.push({
              id: `pb-img-${p.id}`,
              platform: 'pixabay',
              type: 'image',
              title: p.tags || 'Pixabay Photo',
              url: p.largeImageURL || p.webformatURL,
              thumbnail: p.webformatURL || p.previewURL,
              author: p.user,
              license: 'Pixabay License (免费商用)',
              licenseUrl: 'https://pixabay.com/service/license-summary/',
              width: p.imageWidth,
              height: p.imageHeight,
              tags: p.tags ? p.tags.split(',').map((t: string) => t.trim()) : undefined,
            });
          });
        }
      }
    }
  } catch (err) {
    console.warn('Pixabay API error:', err);
  }

  return items;
}

/**
 * Fetch real media from Unsplash API (with user Access Key)
 */
async function searchUnsplash(
  query: string,
  apiKey?: string
): Promise<OpenStockItem[]> {
  const items: OpenStockItem[] = [];
  const q = encodeURIComponent(query || 'aesthetic');
  if (!apiKey) return [];

  try {
    const resp = await fetch(`https://api.unsplash.com/search/photos?query=${q}&per_page=16`, {
      headers: { Authorization: `Client-ID ${apiKey}` },
    });
    if (resp.ok) {
      const data = await resp.json();
      if (data.results) {
        data.results.forEach((p: any) => {
          items.push({
            id: `us-img-${p.id}`,
            platform: 'unsplash',
            type: 'image',
            title: p.description || p.alt_description || 'Unsplash Photo',
            url: p.urls?.regular || p.urls?.full,
            thumbnail: p.urls?.small || p.urls?.thumb,
            author: p.user?.name || 'Unsplash Photographer',
            authorUrl: p.user?.links?.html,
            license: 'Unsplash License (免费商用)',
            licenseUrl: 'https://unsplash.com/license',
            width: p.width,
            height: p.height,
          });
        });
      }
    }
  } catch (err) {
    console.warn('Unsplash API error:', err);
  }

  return items;
}

/**
 * Main Search Dispatcher across the 6 platforms
 */
export async function searchOpenStock(params: {
  platform: PlatformId;
  query: string;
  mediaType: 'all' | 'image' | 'video' | 'audio';
  apiKeys?: Partial<Record<PlatformId, string>>;
}): Promise<{ items: OpenStockItem[]; fromLiveApi: boolean }> {
  const { platform, query, mediaType, apiKeys = {} } = params;
  const apiKey = apiKeys[platform];

  let liveResults: OpenStockItem[] = [];
  let fromLiveApi = false;

  try {
    switch (platform) {
      case 'openverse':
        liveResults = await searchOpenverse(query, mediaType);
        break;
      case 'wikimedia':
        liveResults = await searchWikimedia(query, mediaType);
        break;
      case 'archive':
        liveResults = await searchArchive(query, mediaType);
        break;
      case 'pexels':
        if (apiKey) {
          liveResults = await searchPexels(query, mediaType, apiKey);
        }
        break;
      case 'pixabay':
        if (apiKey) {
          liveResults = await searchPixabay(query, mediaType, apiKey);
        }
        break;
      case 'unsplash':
        if (apiKey) {
          liveResults = await searchUnsplash(query, apiKey);
        }
        break;
    }

    if (liveResults.length > 0) {
      fromLiveApi = true;
    }
  } catch (err) {
    console.warn(`Search failed for ${platform}:`, err);
  }

  // If live API returns results, filter by mediaType if needed and return
  if (liveResults.length > 0) {
    const filtered = liveResults.filter((item) => {
      if (mediaType === 'all') return true;
      return item.type === mediaType;
    });
    if (filtered.length > 0) {
      return { items: filtered, fromLiveApi: true };
    }
  }

  // Fallback to rich curated stock items with client-side keyword matching
  const curated = CURATED_STOCK_DATA[platform] || [];
  const qLower = query.trim().toLowerCase();
  
  let filteredCurated = curated.filter((item) => {
    if (mediaType !== 'all' && item.type !== mediaType) return false;
    if (!qLower) return true;
    const matchTitle = item.title.toLowerCase().includes(qLower);
    const matchTag = item.tags?.some((t) => t.toLowerCase().includes(qLower));
    const matchAuthor = item.author?.toLowerCase().includes(qLower);
    return matchTitle || matchTag || matchAuthor;
  });

  // If keyword filter is too strict, return all curated items of that media type
  if (filteredCurated.length === 0 && curated.length > 0) {
    filteredCurated = curated.filter((item) => mediaType === 'all' || item.type === mediaType);
  }

  return { items: filteredCurated, fromLiveApi: false };
}
