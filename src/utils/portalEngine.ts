import {
  UserPortalProfile,
  AffirmationCategory,
  AffirmationItem,
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
  Wealth: {
    gradient: ['#281B05', '#170E02', '#070401'],
    particleColor: '#F5D061',
    atmosphereName: 'Golden Penthouse Skyline',
    iconName: 'Coins',
    accentGlow: 'rgba(245, 208, 97, 0.45)',
  },
  Love: {
    gradient: ['#3A0D26', '#1E0614', '#0A0207'],
    particleColor: '#F472B6',
    atmosphereName: 'Sunset Ocean Rose Glow',
    iconName: 'Heart',
    accentGlow: 'rgba(244, 114, 182, 0.40)',
  },
  Career: {
    gradient: ['#0C1E3A', '#061021', '#02070F'],
    particleColor: '#38BDF8',
    atmosphereName: 'Metropolis Summit Lights',
    iconName: 'Briefcase',
    accentGlow: 'rgba(56, 189, 248, 0.40)',
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
 * Rich Affirmation Content Library adhering strictly to rules:
 * - Present tense only
 * - No "I will", "Someday", "Hopefully", "Trying", "Want", "Need"
 * - No repeating "I already"
 * - Max 20 words
 * - Varied starter anchors: "I am", "I choose", "I embody", "I attract", "I receive", "I welcome", "I trust", "I celebrate", "I enjoy", reality statements, ownership statements
 */
export const INITIAL_AFFIRMATION_LIBRARY: Record<AffirmationCategory, string[]> = {
  Wealth: [
    'Money flows effortlessly through channels that honor and multiply my gifts.',
    'Prosperity accompanies every conscious decision I make.',
    'I embody the frequency of financial freedom and sovereign wealth.',
    'Abundance feels natural, peaceful, and permanently anchored in my life.',
    'I receive wealth with open arms and manage it with absolute poise.',
    'Multiplying income streams arrive with divine ease and speed.',
    'I welcome infinite prosperity; money loves residing in my care.',
    'Financial miracles happen around me daily with unquestioned regularity.',
  ],
  Love: [
    'My relationships are founded on unconditional devotion, trust, and mutual adoration.',
    'I embody pure, magnetic love that attracts genuine soul connection.',
    'I welcome deep emotional safety, passion, and enduring intimacy into my life.',
    'The love I give returns to me multiplied through beautiful hearts.',
    'I celebrate the presence of a loyal, conscious, and elevating partner.',
    'Harmonious love surrounds me and nurtures my highest evolution.',
  ],
  Career: [
    'My work attracts high recognition, sovereign respect, and generous financial rewards.',
    'Opportunities consistently align with my unique genius and life purpose.',
    'I lead with calm mastery and inspire excellence wherever I step.',
    'Prominent rooms open wide to welcome my perspective and talent.',
    'I attract career breakthroughs that elevate my income and influence.',
    'Success and peaceful balance coexist effortlessly throughout my workday.',
  ],
  Health: [
    'Vibrant vitality surges through every cell, organ, and thought I possess.',
    'I embody radiant health, deep physical strength, and boundless daily energy.',
    'My body heals, restores, and balances itself with supernatural intelligence.',
    'I choose foods, thoughts, and habits that fuel my highest vitality.',
    'Peaceful restorative sleep replenishes my youth and mental clarity every night.',
  ],
  Confidence: [
    'Unshakable confidence radiates from every word and quiet presence I bring.',
    'I trust my inner authority; doubt has no residence within my mind.',
    'I stand sovereign, grounded, and unapologetically aligned with my truth.',
    'My voice carries weight, clarity, and magnetic resonance.',
    'I embody courage that turns every challenge into sacred victory.',
  ],
  Spiritual: [
    'Cosmic intelligence guides my path with absolute mathematical precision.',
    'I am locked in sacred coherence with universal abundance and grace.',
    'Divine timing governs my life; what is meant for me is already mine.',
    'My intuition is sharp, luminous, and always in sync with truth.',
    'I surrender fear and receive the limitless blessings orchestrating for me.',
  ],
  Peace: [
    'Stillness is my sovereign superpower amidst any shifting season.',
    'I release all need to control, resting in tranquil divine order.',
    'A deep, quiet serenity shields my nervous system from outer noise.',
    'Peace dwells within my chest, untethered from external circumstances.',
    'I enjoy tranquil breaths that anchor clarity and grounded poise.',
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
 * Dynamic AI Affirmation Synthesizer
 * Generates non-repetitive present-tense affirmations tailored to user profile
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

  const categoryAffirmations =
    INITIAL_AFFIRMATION_LIBRARY[category] || INITIAL_AFFIRMATION_LIBRARY.Wealth;

  // Pick a random base statement or synthesize dynamic one
  const randomIndex = Math.floor(Math.random() * categoryAffirmations.length);
  const baseText = categoryAffirmations[randomIndex];

  const dynamicTemplates = [
    `${baseText}`,
    `I embody sovereign certainty; ${goal.toLowerCase()} unfolds through my every conscious breath.`,
    `Opportunities for ${goal.toLowerCase()} align naturally as I choose to ${intention.toLowerCase()} and thrive.`,
    `I welcome rapid breakthroughs in my life; abundance feels peaceful and native to who I am.`,
    `My energy dissolves doubt; prosperity and recognition meet me at every turn.`,
  ];

  const chosenText = dynamicTemplates[Math.floor(Math.random() * dynamicTemplates.length)];

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
 * Builds initial feed of full-screen affirmations across all categories
 */
export function buildAffirmationFeed(
  profile: Partial<UserPortalProfile>
): AffirmationItem[] {
  const categories: AffirmationCategory[] = [
    'Wealth',
    'Career',
    'Confidence',
    'Spiritual',
    'Luxury',
    'Love',
    'Health',
    'Peace',
    'Gratitude',
    'Freedom',
  ];

  return categories.flatMap((cat, idx) => {
    const list = INITIAL_AFFIRMATION_LIBRARY[cat] || [];
    return list.slice(0, 2).map((text, subIdx) => ({
      id: `feed_${cat}_${idx}_${subIdx}`,
      text,
      category: cat,
      portalTime: subIdx === 0 ? '11:11' : '2:22',
      authorNote: `Sacred frequency attuned to ${profile.energy || 'Grow'} intention.`,
      format: 'Medium',
      isFavorite: subIdx === 0 && cat === 'Wealth',
      backgroundTheme: THEMED_BACKGROUNDS[cat],
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
