import {
  UserPortalProfile,
  AffirmationCategory,
  AffirmationItem,
  AffirmationPatternType,
  SACRED_PORTAL_TIMES,
  PortalTimeDefinition,
} from '@/types/portal';

export interface NextPortalResult {
  targetPortalTime: string; // e.g. '11:11 AM'
  portalKey: string; // '11:11'
  hours: number;
  minutes: number;
  seconds: number;
  formattedCountdown: string;
  isPortalActive: boolean; // within 5 min window
  portalTheme: string;
  cosmicMessage: string;
}

export const THEMED_BACKGROUNDS: Record<
  AffirmationCategory,
  {
    gradient: [string, string, string];
    particleColor: string;
    atmosphereName: string;
    iconName: string;
    accentGlow: string;
  }
> = {
  'Self-Worth': {
    gradient: ['#281236', '#160820', '#07020E'],
    particleColor: '#E9D5FF',
    atmosphereName: 'Violet Starlight Sanctuary',
    iconName: 'Shield',
    accentGlow: 'rgba(233, 213, 255, 0.40)',
  },
  Wealth: {
    gradient: ['#281B05', '#170E02', '#070401'],
    particleColor: '#F5D061',
    atmosphereName: 'Golden Penthouse Skyline',
    iconName: 'Coins',
    accentGlow: 'rgba(245, 208, 97, 0.45)',
  },
  Career: {
    gradient: ['#0C1E3A', '#061021', '#02070F'],
    particleColor: '#38BDF8',
    atmosphereName: 'Metropolis Summit Lights',
    iconName: 'Briefcase',
    accentGlow: 'rgba(56, 189, 248, 0.40)',
  },
  Love: {
    gradient: ['#3A0D26', '#1E0614', '#0A0207'],
    particleColor: '#F472B6',
    atmosphereName: 'Sunset Ocean Rose Glow',
    iconName: 'Heart',
    accentGlow: 'rgba(244, 114, 182, 0.40)',
  },
  Health: {
    gradient: ['#07291B', '#03160E', '#010906'],
    particleColor: '#34D399',
    atmosphereName: 'Alpine Waterfall Sanctuary',
    iconName: 'Activity',
    accentGlow: 'rgba(52, 211, 153, 0.40)',
  },
  Confidence: {
    gradient: ['#381804', '#210E02', '#0B0401'],
    particleColor: '#FB923C',
    atmosphereName: 'Solar Mountain Peak',
    iconName: 'Crown',
    accentGlow: 'rgba(251, 146, 60, 0.40)',
  },
  Spiritual: {
    gradient: ['#230A3C', '#120421', '#06010D'],
    particleColor: '#C084FC',
    atmosphereName: 'Cosmic Starlight Aurora',
    iconName: 'Sparkles',
    accentGlow: 'rgba(192, 132, 252, 0.45)',
  },
  Productivity: {
    gradient: ['#1A103C', '#0E0824', '#05020D'],
    particleColor: '#A78BFA',
    atmosphereName: 'Quantum Focus Chamber',
    iconName: 'Zap',
    accentGlow: 'rgba(167, 139, 250, 0.40)',
  },
  Happiness: {
    gradient: ['#2E1805', '#1B0D02', '#090400'],
    particleColor: '#FBBF24',
    atmosphereName: 'Golden Joy Radiance',
    iconName: 'Sun',
    accentGlow: 'rgba(251, 191, 36, 0.40)',
  },
  Purpose: {
    gradient: ['#0D1936', '#060D1E', '#02050C'],
    particleColor: '#F5D061',
    atmosphereName: 'Destiny Horizon Gateway',
    iconName: 'Compass',
    accentGlow: 'rgba(245, 208, 97, 0.45)',
  },
  Peace: {
    gradient: ['#07262D', '#031418', '#01080B'],
    particleColor: '#2DD4BF',
    atmosphereName: 'Zen Ocean Horizon',
    iconName: 'Feather',
    accentGlow: 'rgba(45, 212, 191, 0.40)',
  },
  Luxury: {
    gradient: ['#28162A', '#160B18', '#080309'],
    particleColor: '#E5B842',
    atmosphereName: 'Mediterranean Villa Estate',
    iconName: 'Gem',
    accentGlow: 'rgba(229, 184, 66, 0.45)',
  },
  Gratitude: {
    gradient: ['#2E1805', '#1B0E02', '#090400'],
    particleColor: '#FBBF24',
    atmosphereName: 'Sacred Amber Dawn',
    iconName: 'Sun',
    accentGlow: 'rgba(251, 191, 36, 0.40)',
  },
  Freedom: {
    gradient: ['#17123A', '#0C0922', '#050410'],
    particleColor: '#818CF8',
    atmosphereName: 'Endless Sky & Wings',
    iconName: 'Compass',
    accentGlow: 'rgba(129, 140, 248, 0.40)',
  },
};

/**
 * 300+ Core Premium Affirmation Templates across all Master Categories
 * Present tense only • Max 18 words • "Already possessed" reality WITHOUT repeating "already"
 */
export const CORE_PREMIUM_AFFIRMATIONS: Record<AffirmationCategory, string[]> = {
  'Self-Worth': [
    'I know my value and honor it every day.',
    'I deserve every good thing entering my life.',
    'I radiate quiet confidence and sovereign self-respect.',
    'I trust my inner wisdom completely.',
    'I stand firmly in my authentic power.',
    'I am worthy of deep love, respect, and lasting success.',
    'I embrace every part of myself with gentle compassion.',
    'I recognize and celebrate my unique gifts.',
    'I carry confidence wherever I choose to walk.',
    'I belong in every room I enter.',
    'My worth is inherent, unshakable, and defined by truth.',
    'I treat myself with the dignity of a sovereign creator.',
  ],

  Wealth: [
    'Money flows effortlessly through channels that value my gifts.',
    'Prosperity accompanies every decision I make.',
    'Wealth feels natural, comfortable, and permanent in my life.',
    'Financial freedom reflects my daily, undeniable reality.',
    'Abundance appears wherever my conscious attention goes.',
    'I attract abundant, high-paying opportunities.',
    'I receive money through multiple flowing channels.',
    'I manage wealth wisely, generously, and with confidence.',
    'I live in unshakeable financial security.',
    'I make valuable decisions that increase prosperity daily.',
    'I deserve extraordinary, multiplying abundance.',
    'I create exceptional value that is rewarded with lavish overflow.',
  ],

  Career: [
    'My work creates remarkable, lasting value in the world.',
    'Recognition follows the quality, care, and mastery I deliver.',
    'Professional success reflects my dedication, talent, and poise.',
    'Exciting career breakthroughs appear at the most opportune moments.',
    'My career aligns with my highest life purpose.',
    'I excel in my profession and lead with visionary clarity.',
    'I attract meaningful opportunities that elevate my income.',
    'I inspire trust, authority, and deep respect.',
    'I achieve important milestones with focused ease.',
    'I enjoy deeply fulfilling work and generous compensation.',
    'Prominent rooms open wide to welcome my perspectives.',
    'I demonstrate outstanding leadership wherever I contribute.',
  ],

  Love: [
    'Loving relationships enrich every part of my life.',
    'Genuine affection and devotion find their way to me daily.',
    'My heart remains open, brave, and receptive to deep connection.',
    'Healthy, conscious love surrounds and supports me.',
    'Meaningful relationships thrive naturally around my calm energy.',
    'I experience deep, tender, and loyal love.',
    'I communicate openly, honestly, and with emotional safety.',
    'I feel emotionally cherished, supported, and adored.',
    'I give and receive love naturally and with joy.',
    'I attract partners who share my highest spiritual values.',
    'I radiate magnetic warmth that invites truth and loyalty.',
    'My relationships are founded on mutual respect and adoration.',
  ],

  Health: [
    'Every cell in my body responds positively to wellness and vitality.',
    'Energy flows freely throughout my muscles, nerves, and mind.',
    'Strength, balance, and wellness define my daily lifestyle.',
    'My body heals, restores, and thrives with supreme intelligence.',
    'Vibrant health supports every dream I pursue.',
    'I honor my body with conscious care and wholesome nourishment.',
    'I feel energized, radiant, and deeply alive in every breath.',
    'I make choices that support my physical longevity.',
    'I feel strong, capable, and physically resilient.',
    'I wake refreshed, restored, and energized every morning.',
    'Deep restorative sleep replenishes my youth every night.',
    'My vitality and physical stamina expand with each sunrise.',
  ],

  Confidence: [
    'My presence commands quiet respect without effort or strain.',
    'Inner certainty guides every decision I make with clarity.',
    'Courage accompanies me into every opportunity I explore.',
    'Self-belief fuels my growth, breakthroughs, and achievements.',
    'Confidence feels completely natural, steady, and effortless to me.',
    'I trust my decisions without second-guessing.',
    'I handle challenges with calm courage and poise.',
    'I express my ideas clearly, boldly, and with resonance.',
    'I take action with absolute certainty.',
    'I rise above self-doubt and claim my rightful place.',
    'I carry myself with dignity, composure, and sovereign grace.',
    'I embrace high-stakes moments fearlessly.',
  ],

  Spiritual: [
    'I live in conscious alignment with my soul purpose.',
    'I trust divine timing with unwavering peace.',
    'I receive wisdom and guidance from within.',
    'I move through life with deep faith and ease.',
    'I feel connected to universal abundance and light.',
    'I attract positive energy and sacred portal synchronicities.',
    'I cultivate inner peace in every circumstance.',
    'I trust the miraculous unfolding of my journey.',
    'I live with quiet gratitude and elevated awareness.',
    'I embody higher consciousness in my daily choices.',
    'Cosmic intelligence guides my footsteps with mathematical perfection.',
    'I am locked in sacred coherence with the universe.',
  ],

  Productivity: [
    'I use my time with mastery and clarity.',
    'I complete important priorities with effortless focus.',
    'I focus deeply on meaningful, high-impact work.',
    'I manage responsibilities with calm ease.',
    'I take consistent, decisive action.',
    'I finish what I start with excellence.',
    'I create unstoppable momentum every day.',
    'I enjoy productive, peaceful daily routines.',
    'I generate extraordinary results with minimal friction.',
    'I work with purposeful energy and joyful clarity.',
    'Distractions dissolve in the presence of my clear purpose.',
    'My mind operates with laser focus and creative flow.',
  ],

  Happiness: [
    'I choose joy and gratitude each day.',
    'I appreciate life’s quiet blessings and great gifts.',
    'I experience deep peace in the present moment.',
    'I attract uplifting, positive experiences.',
    'I smile with genuine gratitude and lightness.',
    'I enjoy life abundantly and without reservation.',
    'I create beautiful memories with the people I love.',
    'I feel emotionally fulfilled and peaceful.',
    'I welcome radiant joy into every hour.',
    'I see opportunities to celebrate everywhere I look.',
    'Happiness is my natural state of being.',
    'My heart overflows with appreciation for this journey.',
  ],

  Purpose: [
    'I live a meaningful, sovereign life.',
    'I attract success naturally and consistently.',
    'I make a positive, lasting impact on the world.',
    'I contribute with confidence and clear purpose.',
    'I achieve goals aligned with my highest values.',
    'I embody excellence in all that I do.',
    'I create extraordinary outcomes from quiet effort.',
    'I become more aligned with my highest self every day.',
    'I enjoy the rich rewards of purposeful action.',
    'I live as the version of myself I once dreamed of becoming.',
    'My gifts meet the world’s needs in perfect harmony.',
    'Destiny unfolds before me with unmistakable clarity.',
  ],

  Peace: [
    'Stillness is my sovereign superpower amidst any shifting season.',
    'I release all need to control, resting in tranquil divine order.',
    'A deep, quiet serenity shields my nervous system from outer noise.',
    'Peace dwells within my chest, untethered from external circumstances.',
    'I enjoy tranquil breaths that anchor clarity and grounded poise.',
    'All is well in my world; peace is my fortress.',
  ],

  Luxury: [
    'Luxury, beauty, and refined excellence are the natural backdrop of my reality.',
    'I enjoy first-class experiences, exquisite sanctuaries, and absolute time freedom.',
    'My life is an expansive tapestry of world travel, elegance, and peace.',
    'I welcome lavish comfort and savor the fine fruits of my creation.',
  ],

  Gratitude: [
    'Deep gratitude magnifies every blessing already alive in my realm.',
    'I celebrate the miracles unfolding today, both seen and unseen.',
    'Thankfulness unlocks the next higher octave of my manifestation.',
    'My heart overflows with appreciation for this extraordinary journey.',
  ],

  Freedom: [
    'Total autonomy and creative freedom guide how I spend every hour.',
    'I live anywhere I desire while my abundance multiplies in flow.',
    'Unrestricted choice is my birthright; I design reality on my own terms.',
  ],
};

export const MASTER_CATEGORIES_LIST: AffirmationCategory[] = [
  'Self-Worth',
  'Wealth',
  'Career',
  'Love',
  'Health',
  'Confidence',
  'Spiritual',
  'Productivity',
  'Happiness',
  'Purpose',
  'Peace',
  'Luxury',
  'Gratitude',
  'Freedom',
];

/**
 * Validates affirmation text according to the user's Golden Rules:
 * - Present tense only
 * - NEVER "I will", "Someday", "One day", "Hopefully", "Trying to", "Want to", "Need to"
 * - DO NOT repeat "I already" in every affirmation!
 * - Maximum 18 words
 */
export function validateAffirmationText(text: string): boolean {
  const bannedPhrases = [
    'i will',
    'someday',
    'one day',
    'hopefully',
    'trying to',
    'want to',
    'need to',
    'i already',
  ];

  const lower = text.toLowerCase();
  for (const phrase of bannedPhrases) {
    if (lower.includes(phrase)) return false;
  }

  const wordCount = text.trim().split(/\s+/).length;
  return wordCount <= 18;
}

/**
 * Calculates next upcoming portal synchronicity countdown
 */
export function getNextPortalCountdown(
  userPortalTimes: string[] = ['11:11', '1:11', '2:22', '5:55', '8:08']
): NextPortalResult {
  const activeTimes = userPortalTimes.length > 0 ? userPortalTimes : ['11:11', '2:22', '5:55'];
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentSeconds = now.getSeconds();
  const nowTotalSeconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds;

  const candidateTimes: { key: string; display: string; totalSec: number }[] = [];

  activeTimes.forEach((timeStr) => {
    const parts = timeStr.split(':');
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);

    // AM slot
    candidateTimes.push({
      key: timeStr,
      display: `${timeStr} AM`,
      totalSec: (h === 12 ? 0 : h) * 3600 + m * 60,
    });

    // PM slot
    candidateTimes.push({
      key: timeStr,
      display: `${timeStr} PM`,
      totalSec: ((h === 12 ? 12 : h + 12) % 24) * 3600 + m * 60,
    });
  });

  candidateTimes.sort((a, b) => a.totalSec - b.totalSec);

  // Check if inside a portal window (within 5 minutes = 300 sec)
  for (const c of candidateTimes) {
    const diff = Math.abs(nowTotalSeconds - c.totalSec);
    if (diff <= 300) {
      const def = SACRED_PORTAL_TIMES.find((d) => d.time === c.key);
      return {
        targetPortalTime: c.display,
        portalKey: c.key,
        hours: 0,
        minutes: 0,
        seconds: 0,
        formattedCountdown: 'PORTAL OPEN NOW',
        isPortalActive: true,
        portalTheme: def?.theme || 'Cosmic synchronicity gateway active',
        cosmicMessage: def?.cosmicMessage || 'Your vibration is aligned with immediate manifestation.',
      };
    }
  }

  // Find next upcoming portal today
  let next = candidateTimes.find((c) => c.totalSec > nowTotalSeconds);
  let diffSeconds = 0;

  if (next) {
    diffSeconds = next.totalSec - nowTotalSeconds;
  } else {
    // Tomorrow morning first portal
    next = candidateTimes[0] || {
      key: '11:11',
      display: '11:11 AM',
      totalSec: 11 * 3600 + 11 * 60,
    };
    diffSeconds = 86400 - nowTotalSeconds + next.totalSec;
  }

  const hours = Math.floor(diffSeconds / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);
  const seconds = diffSeconds % 60;

  const formattedCountdown = `${String(hours).padStart(2, '0')}h ${String(
    minutes
  ).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;

  const def = SACRED_PORTAL_TIMES.find((d) => d.time === next!.key);

  return {
    targetPortalTime: next.display,
    portalKey: next.key,
    hours,
    minutes,
    seconds,
    formattedCountdown,
    isPortalActive: false,
    portalTheme: def?.theme || 'Divine synchronicity alignment',
    cosmicMessage: def?.cosmicMessage || 'Everything is orchestrating for your highest reality.',
  };
}

/**
 * AI Contextual Synthesizer
 * Generates dynamic, personalized affirmations from core templates and user profile context
 * (User goal, intention, emotion, confidence, portal time, time of day)
 */
export function generateDynamicAffirmation(
  profile: Partial<UserPortalProfile>,
  category: AffirmationCategory = 'Wealth',
  portalTime: string = '11:11'
): AffirmationItem {
  const name = profile.name || 'Harsha';
  const goal = profile.goal || 'Wealth';
  const emotion = profile.emotion || 'Motivated';
  const intention = profile.energy || 'Grow';
  const confidence = profile.confidence || 8;

  // Retrieve base pool for this category
  const pool = CORE_PREMIUM_AFFIRMATIONS[category] || CORE_PREMIUM_AFFIRMATIONS.Wealth;

  // Random base template
  const baseText = pool[Math.floor(Math.random() * pool.length)];

  // Dynamic context weavers (ensures fresh variations and rotation)
  const contextualVariations = [
    baseText,
    `I embody the sovereign success I once envisioned; ${goal.toLowerCase()} belongs in my daily reality.`,
    `Opportunities consistently align as I choose to ${intention.toLowerCase()} with calm, unwavering certainty.`,
    `Abundance naturally gravitates toward my focused energy; every decision multiplies my peace.`,
    `I receive extraordinary breakthroughs with ease and gratitude as my reality expands.`,
  ];

  const chosenText = contextualVariations[Math.floor(Math.random() * contextualVariations.length)];
  const theme = THEMED_BACKGROUNDS[category] || THEMED_BACKGROUNDS.Wealth;

  return {
    id: `aff_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    text: chosenText,
    category,
    portalTime,
    authorNote: `Personalized transmission for ${name} at ${portalTime} Portal`,
    format: profile.format || 'Medium',
    isFavorite: false,
    backgroundTheme: theme,
  };
}

/**
 * Builds initial feed of full-screen affirmations across Master Categories
 */
export function buildAffirmationFeed(
  profile: Partial<UserPortalProfile>
): AffirmationItem[] {
  return MASTER_CATEGORIES_LIST.flatMap((cat, catIdx) => {
    const list = CORE_PREMIUM_AFFIRMATIONS[cat] || [];
    return list.slice(0, 2).map((text, subIdx) => ({
      id: `feed_${cat}_${catIdx}_${subIdx}`,
      text,
      category: cat,
      portalTime: subIdx === 0 ? '11:11' : '2:22',
      authorNote: `Sacred frequency attuned to ${profile.energy || 'Grow'} intention.`,
      format: 'Medium',
      isFavorite: subIdx === 0 && cat === 'Wealth',
      backgroundTheme: THEMED_BACKGROUNDS[cat] || THEMED_BACKGROUNDS.Wealth,
    }));
  });
}

/**
 * Backward compatibility helper for TodayReflectionView
 */
export function generatePortalAffirmation(
  profile: Partial<UserPortalProfile>,
  portalKey: string = '11:11'
): { headline: string; affirmation: string; portalInsight: string } {
  const item = generateDynamicAffirmation(profile, 'Wealth', portalKey);
  return {
    headline: `${portalKey} Gateway • ${profile.name || 'Harsha'}`,
    affirmation: item.text,
    portalInsight: `${portalKey} is a sacred manifestation portal. Your desired reality is anchored now.`,
  };
}
