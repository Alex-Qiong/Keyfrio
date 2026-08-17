export interface LottiePreset {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  duration: number; // default duration in seconds
  url?: string;
  jsonData: object;
}

// 1. Confetti Celebration Lottie Animation JSON
const CONFETTI_JSON = {
  v: "5.5.7",
  fr: 30,
  ip: 0,
  op: 90,
  w: 500,
  h: 500,
  nm: "Confetti Celebration",
  ddd: 0,
  assets: [],
  layers: [
    // Circle 1 (Gold)
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Gold Burst",
      sr: 1,
      ks: {
        o: { k: [{ t: 0, s: [100] }, { t: 75, s: [100] }, { t: 90, s: [0] }] },
        r: { k: [{ t: 0, s: [0] }, { t: 90, s: [360] }] },
        p: { k: [{ t: 0, s: [250, 250, 0] }, { t: 60, s: [120, 100, 0] }, { t: 90, s: [100, 420, 0] }] },
        a: { k: [0, 0, 0] },
        s: { k: [{ t: 0, s: [0, 0, 100] }, { t: 20, s: [140, 140, 100] }, { t: 90, s: [70, 70, 100] }] }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "rc", p: { k: [0, 0] }, s: { k: [24, 24] }, r: { k: 6 } },
            { ty: "fl", c: { k: [1, 0.8, 0, 1] }, o: { k: 100 } },
            { ty: "tr", p: { k: [0, 0] }, a: { k: [0, 0] }, s: { k: [100, 100] }, r: { k: 0 }, o: { k: 100 } }
          ]
        }
      ]
    },
    // Circle 2 (Pink Ribbon)
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Pink Burst",
      sr: 1,
      ks: {
        o: { k: [{ t: 0, s: [100] }, { t: 70, s: [100] }, { t: 90, s: [0] }] },
        r: { k: [{ t: 0, s: [0] }, { t: 90, s: [-280] }] },
        p: { k: [{ t: 0, s: [250, 250, 0] }, { t: 55, s: [380, 110, 0] }, { t: 90, s: [400, 430, 0] }] },
        a: { k: [0, 0, 0] },
        s: { k: [{ t: 0, s: [0, 0, 100] }, { t: 25, s: [130, 130, 100] }, { t: 90, s: [80, 80, 100] }] }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "el", p: { k: [0, 0] }, s: { k: [28, 28] } },
            { ty: "fl", c: { k: [0.95, 0.2, 0.55, 1] }, o: { k: 100 } },
            { ty: "tr", p: { k: [0, 0] }, a: { k: [0, 0] }, s: { k: [100, 100] }, r: { k: 0 }, o: { k: 100 } }
          ]
        }
      ]
    },
    // Circle 3 (Cyan Sparkle)
    {
      ddd: 0,
      ind: 3,
      ty: 4,
      nm: "Cyan Star",
      sr: 1,
      ks: {
        o: { k: [{ t: 0, s: [100] }, { t: 75, s: [100] }, { t: 90, s: [0] }] },
        r: { k: [{ t: 0, s: [0] }, { t: 90, s: [540] }] },
        p: { k: [{ t: 0, s: [250, 250, 0] }, { t: 50, s: [250, 70, 0] }, { t: 90, s: [260, 440, 0] }] },
        a: { k: [0, 0, 0] },
        s: { k: [{ t: 0, s: [0, 0, 100] }, { t: 20, s: [160, 160, 100] }, { t: 90, s: [90, 90, 100] }] }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "sr", p: { k: [0, 0] }, pt: { k: 5 }, ir: { k: 12 }, or: { k: 26 }, r: { k: 0 } },
            { ty: "fl", c: { k: [0.1, 0.8, 1, 1] }, o: { k: 100 } },
            { ty: "tr", p: { k: [0, 0] }, a: { k: [0, 0] }, s: { k: [100, 100] }, r: { k: 0 }, o: { k: 100 } }
          ]
        }
      ]
    },
    // Center Pop
    {
      ddd: 0,
      ind: 4,
      ty: 4,
      nm: "Purple Ring",
      sr: 1,
      ks: {
        o: { k: [{ t: 0, s: [100] }, { t: 40, s: [80] }, { t: 70, s: [0] }] },
        r: { k: 0 },
        p: { k: [250, 250, 0] },
        a: { k: [0, 0, 0] },
        s: { k: [{ t: 0, s: [0, 0, 100] }, { t: 50, s: [300, 300, 100] }] }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "el", p: { k: [0, 0] }, s: { k: [100, 100] } },
            { ty: "st", c: { k: [0.6, 0.3, 0.95, 1] }, w: { k: 8 }, o: { k: 100 } },
            { ty: "tr", p: { k: [0, 0] }, a: { k: [0, 0] }, s: { k: [100, 100] }, r: { k: 0 }, o: { k: 100 } }
          ]
        }
      ]
    }
  ]
};

// 2. Heart Pulse Lottie Animation JSON
const HEART_PULSE_JSON = {
  v: "5.5.7",
  fr: 30,
  ip: 0,
  op: 60,
  w: 500,
  h: 500,
  nm: "Heart Pulse",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Heart Shape",
      sr: 1,
      ks: {
        o: { k: 100 },
        r: { k: 0 },
        p: { k: [250, 250, 0] },
        a: { k: [0, 0, 0] },
        s: {
          k: [
            { t: 0, s: [100, 100, 100] },
            { t: 15, s: [130, 130, 100] },
            { t: 30, s: [100, 100, 100] },
            { t: 45, s: [120, 120, 100] },
            { t: 60, s: [100, 100, 100] }
          ]
        }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "sh",
              ks: {
                k: {
                  i: [[0, 0], [-25, -25], [-35, 20], [0, 45], [35, 20], [25, -25]],
                  o: [[-25, -25], [35, 20], [0, 45], [-35, 20], [-25, -25], [0, 0]],
                  v: [[0, -35], [-70, -70], [-90, 0], [0, 100], [90, 0], [70, -70]],
                  c: true
                }
              }
            },
            { ty: "fl", c: { k: [0.95, 0.15, 0.35, 1] }, o: { k: 100 } },
            { ty: "st", c: { k: [1, 0.4, 0.6, 1] }, w: { k: 8 }, o: { k: 100 } },
            { ty: "tr", p: { k: [0, 0] }, a: { k: [0, 0] }, s: { k: [100, 100] }, r: { k: 0 }, o: { k: 100 } }
          ]
        }
      ]
    },
    // Glow aura
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Glow Aura",
      sr: 1,
      ks: {
        o: {
          k: [
            { t: 0, s: [20] },
            { t: 15, s: [80] },
            { t: 30, s: [20] },
            { t: 45, s: [60] },
            { t: 60, s: [20] }
          ]
        },
        r: { k: 0 },
        p: { k: [250, 250, 0] },
        a: { k: [0, 0, 0] },
        s: {
          k: [
            { t: 0, s: [120, 120, 100] },
            { t: 15, s: [170, 170, 100] },
            { t: 30, s: [120, 120, 100] },
            { t: 45, s: [150, 150, 100] },
            { t: 60, s: [120, 120, 100] }
          ]
        }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "el", p: { k: [0, 0] }, s: { k: [180, 180] } },
            { ty: "fl", c: { k: [1, 0.2, 0.5, 0.3] }, o: { k: 100 } },
            { ty: "tr", p: { k: [0, 0] }, a: { k: [0, 0] }, s: { k: [100, 100] }, r: { k: 0 }, o: { k: 100 } }
          ]
        }
      ]
    }
  ]
};

// 3. Rocket Boost Lottie Animation JSON
const ROCKET_JSON = {
  v: "5.5.7",
  fr: 30,
  ip: 0,
  op: 60,
  w: 500,
  h: 500,
  nm: "Rocket Launch",
  ddd: 0,
  assets: [],
  layers: [
    // Rocket Body
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Rocket",
      sr: 1,
      ks: {
        o: { k: 100 },
        r: { k: [{ t: 0, s: [-3] }, { t: 30, s: [3] }, { t: 60, s: [-3] }] },
        p: { k: [{ t: 0, s: [250, 240, 0] }, { t: 30, s: [250, 210, 0] }, { t: 60, s: [250, 240, 0] }] },
        a: { k: [0, 0, 0] },
        s: { k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [
        // Fuselage
        {
          ty: "gr",
          it: [
            {
              ty: "sh",
              ks: {
                k: {
                  i: [[0, 0], [-20, 30], [0, 50], [20, 30]],
                  o: [[-20, -30], [0, -50], [20, -30], [0, 0]],
                  v: [[0, -90], [-45, 40], [0, 60], [45, 40]],
                  c: true
                }
              }
            },
            { ty: "fl", c: { k: [0.95, 0.95, 0.98, 1] }, o: { k: 100 } },
            { ty: "st", c: { k: [0.2, 0.25, 0.35, 1] }, w: { k: 6 }, o: { k: 100 } },
            { ty: "tr", p: { k: [0, 0] }, a: { k: [0, 0] }, s: { k: [100, 100] }, r: { k: 0 }, o: { k: 100 } }
          ]
        },
        // Window
        {
          ty: "gr",
          it: [
            { ty: "el", p: { k: [0, -20] }, s: { k: [36, 36] } },
            { ty: "fl", c: { k: [0.2, 0.65, 0.95, 1] }, o: { k: 100 } },
            { ty: "st", c: { k: [0.95, 0.95, 0.98, 1] }, w: { k: 5 }, o: { k: 100 } },
            { ty: "tr", p: { k: [0, 0] }, a: { k: [0, 0] }, s: { k: [100, 100] }, r: { k: 0 }, o: { k: 100 } }
          ]
        },
        // Fin Left
        {
          ty: "gr",
          it: [
            {
              ty: "sh",
              ks: {
                k: {
                  i: [[0, 0], [0, 0], [0, 0]],
                  o: [[0, 0], [0, 0], [0, 0]],
                  v: [[-45, 20], [-80, 65], [-40, 55]],
                  c: true
                }
              }
            },
            { ty: "fl", c: { k: [0.95, 0.25, 0.25, 1] }, o: { k: 100 } },
            { ty: "st", c: { k: [0.2, 0.25, 0.35, 1] }, w: { k: 5 }, o: { k: 100 } },
            { ty: "tr", p: { k: [0, 0] }, a: { k: [0, 0] }, s: { k: [100, 100] }, r: { k: 0 }, o: { k: 100 } }
          ]
        },
        // Fin Right
        {
          ty: "gr",
          it: [
            {
              ty: "sh",
              ks: {
                k: {
                  i: [[0, 0], [0, 0], [0, 0]],
                  o: [[0, 0], [0, 0], [0, 0]],
                  v: [[45, 20], [80, 65], [40, 55]],
                  c: true
                }
              }
            },
            { ty: "fl", c: { k: [0.95, 0.25, 0.25, 1] }, o: { k: 100 } },
            { ty: "st", c: { k: [0.2, 0.25, 0.35, 1] }, w: { k: 5 }, o: { k: 100 } },
            { ty: "tr", p: { k: [0, 0] }, a: { k: [0, 0] }, s: { k: [100, 100] }, r: { k: 0 }, o: { k: 100 } }
          ]
        }
      ]
    },
    // Flame
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Thruster Flame",
      sr: 1,
      ks: {
        o: { k: 100 },
        r: { k: 0 },
        p: { k: [250, 310, 0] },
        a: { k: [0, 0, 0] },
        s: {
          k: [
            { t: 0, s: [90, 80, 100] },
            { t: 15, s: [110, 140, 100] },
            { t: 30, s: [85, 90, 100] },
            { t: 45, s: [115, 135, 100] },
            { t: 60, s: [90, 80, 100] }
          ]
        }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "sh",
              ks: {
                k: {
                  i: [[0, 0], [-15, 20], [0, 0], [15, 20]],
                  o: [[-15, -20], [0, 0], [15, -20], [0, 0]],
                  v: [[-22, 0], [0, 80], [22, 0], [0, -10]],
                  c: true
                }
              }
            },
            { ty: "fl", c: { k: [1, 0.6, 0.1, 1] }, o: { k: 100 } },
            { ty: "tr", p: { k: [0, 0] }, a: { k: [0, 0] }, s: { k: [100, 100] }, r: { k: 0 }, o: { k: 100 } }
          ]
        },
        // Inner Flame
        {
          ty: "gr",
          it: [
            {
              ty: "sh",
              ks: {
                k: {
                  i: [[0, 0], [-10, 15], [0, 0], [10, 15]],
                  o: [[-10, -15], [0, 0], [10, -15], [0, 0]],
                  v: [[-12, 0], [0, 50], [12, 0], [0, -5]],
                  c: true
                }
              }
            },
            { ty: "fl", c: { k: [1, 0.95, 0.2, 1] }, o: { k: 100 } },
            { ty: "tr", p: { k: [0, 0] }, a: { k: [0, 0] }, s: { k: [100, 100] }, r: { k: 0 }, o: { k: 100 } }
          ]
        }
      ]
    }
  ]
};

// 4. Success Checkmark Lottie Animation JSON
const CHECKMARK_JSON = {
  v: "5.5.7",
  fr: 30,
  ip: 0,
  op: 60,
  w: 500,
  h: 500,
  nm: "Success Checkmark",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Green Circle",
      sr: 1,
      ks: {
        o: { k: 100 },
        r: { k: 0 },
        p: { k: [250, 250, 0] },
        a: { k: [0, 0, 0] },
        s: {
          k: [
            { t: 0, s: [0, 0, 100] },
            { t: 20, s: [115, 115, 100] },
            { t: 30, s: [100, 100, 100] },
            { t: 60, s: [100, 100, 100] }
          ]
        }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "el", p: { k: [0, 0] }, s: { k: [220, 220] } },
            { ty: "fl", c: { k: [0.1, 0.8, 0.45, 1] }, o: { k: 100 } },
            { ty: "tr", p: { k: [0, 0] }, a: { k: [0, 0] }, s: { k: [100, 100] }, r: { k: 0 }, o: { k: 100 } }
          ]
        }
      ]
    },
    // White Checkmark
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Check",
      sr: 1,
      ks: {
        o: { k: [{ t: 0, s: [0] }, { t: 15, s: [100] }] },
        r: { k: 0 },
        p: { k: [250, 250, 0] },
        a: { k: [0, 0, 0] },
        s: {
          k: [
            { t: 15, s: [0, 0, 100] },
            { t: 35, s: [120, 120, 100] },
            { t: 45, s: [100, 100, 100] }
          ]
        }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "sh",
              ks: {
                k: {
                  i: [[0, 0], [0, 0], [0, 0]],
                  o: [[0, 0], [0, 0], [0, 0]],
                  v: [[-50, 0], [-15, 35], [55, -35]],
                  c: false
                }
              }
            },
            { ty: "st", c: { k: [1, 1, 1, 1] }, w: { k: 22 }, lc: 2, lj: 2, o: { k: 100 } },
            { ty: "tr", p: { k: [0, 0] }, a: { k: [0, 0] }, s: { k: [100, 100] }, r: { k: 0 }, o: { k: 100 } }
          ]
        }
      ]
    }
  ]
};

// 5. Loading Ring Lottie Animation JSON
const LOADING_RING_JSON = {
  v: "5.5.7",
  fr: 30,
  ip: 0,
  op: 60,
  w: 500,
  h: 500,
  nm: "Neon Spinner",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Spinner Arc",
      sr: 1,
      ks: {
        o: { k: 100 },
        r: { k: [{ t: 0, s: [0] }, { t: 60, s: [360] }] },
        p: { k: [250, 250, 0] },
        a: { k: [0, 0, 0] },
        s: { k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "el", p: { k: [0, 0] }, s: { k: [180, 180] } },
            { ty: "st", c: { k: [0.25, 0.6, 1, 1] }, w: { k: 18 }, lc: 2, o: { k: 100 } },
            {
              ty: "tm",
              s: { k: [{ t: 0, s: [0] }, { t: 30, s: [30] }, { t: 60, s: [0] }] },
              e: { k: [{ t: 0, s: [25] }, { t: 30, s: [85] }, { t: 60, s: [100] }] },
              o: { k: [{ t: 0, s: [0] }, { t: 60, s: [360] }] },
              m: 1
            },
            { ty: "tr", p: { k: [0, 0] }, a: { k: [0, 0] }, s: { k: [100, 100] }, r: { k: 0 }, o: { k: 100 } }
          ]
        }
      ]
    }
  ]
};

// 6. Like Button Thumbs Up Animation JSON
const LIKE_THUMBS_JSON = {
  v: "5.5.7",
  fr: 30,
  ip: 0,
  op: 60,
  w: 500,
  h: 500,
  nm: "Like Thumbs Up",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Hand",
      sr: 1,
      ks: {
        o: { k: 100 },
        r: {
          k: [
            { t: 0, s: [-20] },
            { t: 20, s: [15] },
            { t: 35, s: [-5] },
            { t: 50, s: [5] },
            { t: 60, s: [0] }
          ]
        },
        p: { k: [250, 250, 0] },
        a: { k: [0, 0, 0] },
        s: {
          k: [
            { t: 0, s: [0, 0, 100] },
            { t: 20, s: [130, 130, 100] },
            { t: 35, s: [95, 95, 100] },
            { t: 50, s: [105, 105, 100] },
            { t: 60, s: [100, 100, 100] }
          ]
        }
      },
      ao: 0,
      shapes: [
        // Blue Circle Base
        {
          ty: "gr",
          it: [
            { ty: "el", p: { k: [0, 0] }, s: { k: [220, 220] } },
            { ty: "fl", c: { k: [0.15, 0.5, 0.95, 1] }, o: { k: 100 } },
            { ty: "tr", p: { k: [0, 0] }, a: { k: [0, 0] }, s: { k: [100, 100] }, r: { k: 0 }, o: { k: 100 } }
          ]
        },
        // Thumbs Up Icon
        {
          ty: "gr",
          it: [
            {
              ty: "sh",
              ks: {
                k: {
                  i: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
                  o: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
                  v: [[-35, 40], [-35, -10], [10, -10], [10, -50], [30, -50], [50, 40]],
                  c: true
                }
              }
            },
            { ty: "fl", c: { k: [1, 1, 1, 1] }, o: { k: 100 } },
            { ty: "tr", p: { k: [0, 0] }, a: { k: [0, 0] }, s: { k: [100, 100] }, r: { k: 0 }, o: { k: 100 } }
          ]
        }
      ]
    }
  ]
};

export const LOTTIE_PRESETS: LottiePreset[] = [
  {
    id: 'lottie-confetti',
    name: '五彩礼花庆典 (Confetti)',
    category: 'Celebration',
    description: '绚丽烟花彩带与金色五角星爆破动效',
    icon: '🎉',
    duration: 3.0,
    jsonData: CONFETTI_JSON,
  },
  {
    id: 'lottie-heart',
    name: '爱心脉冲心跳 (Heart Pulse)',
    category: 'Social',
    description: '跳动的红心与发光光环互动点赞动效',
    icon: '❤️',
    duration: 2.0,
    jsonData: HEART_PULSE_JSON,
  },
  {
    id: 'lottie-rocket',
    name: '火箭发射起飞 (Rocket Boost)',
    category: 'VFX',
    description: '炫酷火箭喷射烈焰与剧烈升空动效',
    icon: '🚀',
    duration: 2.0,
    jsonData: ROCKET_JSON,
  },
  {
    id: 'lottie-success',
    name: '绿色成功对勾 (Success)',
    category: 'UI',
    description: '完成任务与状态验证成功的弹性弹跳动效',
    icon: '✅',
    duration: 2.0,
    jsonData: CHECKMARK_JSON,
  },
  {
    id: 'lottie-spinner',
    name: '赛博发光加载环 (Neon Spinner)',
    category: 'Tech',
    description: '科技感环形渐变旋转光弧动效',
    icon: '💫',
    duration: 2.0,
    jsonData: LOADING_RING_JSON,
  },
  {
    id: 'lottie-like',
    name: '点赞大拇指 (Like Thumbs)',
    category: 'Social',
    description: '社媒爆款点赞强力弹跳手势动效',
    icon: '👍',
    duration: 2.0,
    jsonData: LIKE_THUMBS_JSON,
  },
];
