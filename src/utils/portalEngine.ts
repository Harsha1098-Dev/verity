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
 * 10 Multi-Pattern Affirmation Structure Pools:
 * - Identity-Based
 * - Ownership-Based
 * - Reality-Based
 * - Gratitude-Based
 * - Embodiment-Based
 * - Receiving-Based
 * - Certainty-Based
 * - Magnetic-Based
 * - Expansion-Based
 * - Completion-Based
 */
export const MULTI_PATTERN_AFFIRMATION_BANK: Record<
  AffirmationPatternType,
  Record<AffirmationCategory, string[]>
> = {
  'Identity-Based': {
    Wealth: [
      'I am a magnetic force for abundance and financial freedom.',
      'I am the kind of person extraordinary wealth opportunities seek out.',
      'I am naturally aligned with limitless prosperity and wise stewardship.',
      'I am sovereign, generous, and comfortable holding massive financial flow.',
    ],
    Career: [
      'I am the kind of professional leaders trust with visionary missions.',
      'I am naturally aligned with high-impact success and fulfilling mastery.',
      'I am an indispensable architect of remarkable value in the marketplace.',
    ],
    Love: [
      'I am deeply deserving of devoted, loyal, and transcendent love.',
      'I am the steady anchor of warmth, emotional safety, and joy.',
    ],
    Confidence: [
      'I am sovereign, grounded, and unapologetically at peace in my power.',
      'I am unshakable in my self-worth; outer opinions do not sway me.',
    ],
    Health: [
      'I am radiant life force in motion; every cell vibrates with health.',
      'I am strong, resilient, and deeply tuned to my body’s vitality.',
    ],
    Spiritual: [
      'I am a conscious conduit of universal intelligence and divine order.',
      'I am at one with the infinite wisdom orchestrating the cosmos.',
    ],
    Peace: [
      'I am the tranquil sanctuary amidst any shifting season of life.',
      'I am rooted in stillness that nothing outer can disturb.',
    ],
    Luxury: [
      'I am naturally at home surrounded by exquisite beauty and comfort.',
      'I am worthy of experiencing the finest fruits of this world.',
    ],
    Gratitude: [
      'I am a vessel of perpetual thanksgiving and humble celebration.',
    ],
    Freedom: [
      'I am entirely sovereign, designing my hours on my own terms.',
    ],
  },

  'Ownership-Based': {
    Wealth: [
      'Financial freedom belongs in my life as my permanent reality.',
      'Prosperity flows through every part of my daily world.',
      'Wealth and multiplying resources belong naturally in my hands.',
    ],
    Career: [
      'Prominent success, deep recognition, and sovereign influence belong to my work.',
      'High-level leadership and meaningful impact are my rightful domain.',
    ],
    Love: [
      'Deep, meaningful love surrounds me and enriches every moment.',
      'A conscious, loyal partnership belongs naturally in my life.',
    ],
    Confidence: [
      'Unshakable self-possession belongs to my character without exception.',
      'Quiet authority and respect follow my every intentional step.',
    ],
    Health: [
      'Vibrant wellness, stamina, and youthful energy belong to my body.',
      'Effortless recovery and restorative sleep define my physical reality.',
    ],
    Spiritual: [
      'Sacred synchronicity belongs to my daily walk with truth.',
      'Divine protection and grace accompany every path I choose.',
    ],
    Peace: [
      'Serenity belongs to my mind; anxious noise finds no harbor here.',
    ],
    Luxury: [
      'Lavish ease, first-class comfort, and refined atmospheres belong to me.',
    ],
    Gratitude: [
      'A grateful heart belongs at the center of my being.',
    ],
    Freedom: [
      'Total time sovereignty belongs to my lifestyle and schedule.',
    ],
  },

  'Reality-Based': {
    Wealth: [
      'Wealth is flowing into my life from expected and unexpected sources.',
      'Money flows effortlessly through channels that honor my gifts.',
      'Abundance appears wherever my conscious attention goes.',
      'Financial freedom reflects my daily, undeniable reality.',
    ],
    Career: [
      'My dream career is unfolding in perfect, mathematically sound ways.',
      'Professional success reflects my dedication, mastery, and integrity.',
      'Exciting breakthroughs arrive at the most opportune moments.',
    ],
    Love: [
      'Loving relationships enrich every part of my life.',
      'Genuine affection and supportive connections arrive daily.',
      'Meaningful relationships thrive naturally around my calm energy.',
    ],
    Confidence: [
      'Confidence feels completely natural, steady, and effortless to me.',
      'Inner certainty guides every decision I make with clarity.',
    ],
    Health: [
      'Every cell in my body responds positively to wellness and vitality.',
      'Energy flows freely throughout my muscles, nerves, and mind.',
    ],
    Spiritual: [
      'Divine synchronicity shapes my hours with miraculous precision.',
      'The cosmic gateway delivers the answers I sought in meditation.',
    ],
    Peace: [
      'Peace fills my mind and guides my decisions with grace.',
      'Stillness reigns supreme across my nervous system today.',
    ],
    Luxury: [
      'Exquisite travel, peaceful sanctuaries, and luxury surround my days.',
    ],
    Gratitude: [
      'Abundant blessings reveal themselves everywhere I gaze.',
    ],
    Freedom: [
      'Boundless creative autonomy defines how I spend my time.',
    ],
  },

  'Gratitude-Based': {
    Wealth: [
      'I am grateful for the abundance that enriches my days.',
      'Thank you for the financial opportunities arriving effortlessly.',
      'I appreciate the steady stream of prosperity multiplying in my care.',
    ],
    Career: [
      'Thank you for the visionary doors opening to receive my work.',
      'I am grateful for the chance to create extraordinary value.',
    ],
    Love: [
      'Thank you for the unconditional love that enriches my life.',
      'I am deeply grateful for companions who honor and elevate me.',
    ],
    Confidence: [
      'Thank you for the quiet courage that anchors my every step.',
    ],
    Health: [
      'I am grateful for this body that heals, breathes, and thrives.',
    ],
    Spiritual: [
      'Thank you for the unseen guidance steering me away from lack.',
    ],
    Peace: [
      'I am grateful for this quiet sanctuary within my own chest.',
    ],
    Luxury: [
      'Thank you for the elegance, comfort, and beauty I experience.',
    ],
    Gratitude: [
      'Gratitude unlocks the next higher octave of my manifestation.',
    ],
    Freedom: [
      'Thank you for the freedom to build reality on my terms.',
    ],
  },

  'Embodiment-Based': {
    Confidence: [
      'Confidence radiates through every word I speak.',
      'My presence commands quiet respect without effort or strain.',
      'Courage accompanies me into every room I enter.',
    ],
    Career: [
      'Success reflects in everything I create and deliver.',
      'Leadership and poise shine through my daily actions.',
    ],
    Wealth: [
      'I embody the frequency of sovereign prosperity and calm abundance.',
      'Prosperity accompanies every decision I make.',
    ],
    Love: [
      'I embody pure, magnetic love that invites deep emotional truth.',
      'My heart remains open, brave, and joyfully receptive to romance.',
    ],
    Health: [
      'Strength, balance, and wellness define my daily lifestyle.',
      'I embody vibrant youthfulness, flexibility, and boundless stamina.',
    ],
    Spiritual: [
      'I embody cosmic peace; fear dissolves in my presence.',
    ],
    Peace: [
      'I embody stillness that calms every storm around me.',
    ],
    Luxury: [
      'I embody the poise of someone who enjoys timeless elegance.',
    ],
    Gratitude: [
      'I embody thankfulness with every conscious breath I take.',
    ],
    Freedom: [
      'I embody unbridled freedom and bold creative sovereignty.',
    ],
  },

  'Receiving-Based': {
    Wealth: [
      'I receive wealth with ease, poise, and genuine gratitude.',
      'I welcome multiplying income streams into my accounts.',
      'I allow massive prosperity to find me without resistance.',
    ],
    Love: [
      'I welcome loving, conscious relationships into my world.',
      'I receive deep affection, emotional support, and devotion.',
    ],
    Career: [
      'I allow extraordinary opportunities and high rewards to find me.',
      'I receive the praise and compensation my excellence deserves.',
    ],
    Confidence: [
      'I receive praise and respect with calm, grounded grace.',
    ],
    Health: [
      'I receive healing vitality from every wholesome meal and breath.',
    ],
    Spiritual: [
      'I receive divine transmissions with crystal clarity.',
    ],
    Peace: [
      'I welcome deep serenity into every corner of my mind.',
    ],
    Luxury: [
      'I receive first-class treatment wherever my travels take me.',
    ],
    Gratitude: [
      'I receive daily blessings with an open, humbled heart.',
    ],
    Freedom: [
      'I welcome limitless autonomy into my daily schedule.',
    ],
  },

  'Certainty-Based': {
    Wealth: [
      'Everything is working in my favor for lasting wealth.',
      'The universe supports every financial step I take.',
      'My abundance is becoming a tangible, permanent reality.',
    ],
    Career: [
      'The universe conspires to elevate my career and purpose.',
      'My goals are fully supported by divine timing and allies.',
    ],
    Love: [
      'The love meant for me is already seeking me.',
      'My heart knows with certainty that true devotion is here.',
    ],
    Confidence: [
      'Self-belief fuels my growth; failure is merely useful feedback.',
    ],
    Health: [
      'My body thrives under my loving, conscious care.',
    ],
    Spiritual: [
      'Divine order governs my footsteps; I walk without anxiety.',
    ],
    Peace: [
      'All is well in my world; peace is my fortress.',
    ],
    Luxury: [
      'A life of beauty and ease is my natural destiny.',
    ],
    Gratitude: [
      'Every experience is working together for my highest good.',
    ],
    Freedom: [
      'My sovereign freedom is protected by universal law.',
    ],
  },

  'Magnetic-Based': {
    Wealth: [
      'Abundance naturally gravitates toward my calm, focused energy.',
      'I attract people, partnerships, and ideas that multiply my wealth.',
      'Success recognizes my value and rewards it generously.',
    ],
    Career: [
      'I attract visionary mentors, collaborators, and clients who honor me.',
      'High-impact career doors open wide at my approach.',
    ],
    Love: [
      'My warmth draws loyal, genuine, and inspiring souls to me.',
      'I attract romantic devotion that matches my own depth.',
    ],
    Confidence: [
      'My aura magnetically inspires confidence in everyone I meet.',
    ],
    Health: [
      'My cellular vibration attracts restorative, rejuvenating health.',
    ],
    Spiritual: [
      'My frequency attracts sacred miracles and portal synchronicities.',
    ],
    Peace: [
      'My gentle presence diffuses tension wherever I step.',
    ],
    Luxury: [
      'Elegance and world-class environments gravitate to my life.',
    ],
    Gratitude: [
      'Appreciation acts as a magnet for multiplied blessings.',
    ],
    Freedom: [
      'Autonomous opportunities seek me out relentlessly.',
    ],
  },

  'Expansion-Based': {
    Wealth: [
      'My income continues to expand far beyond past expectations.',
      'New financial streams reveal themselves to me daily.',
      'My capacity to generate and hold wealth grows constantly.',
    ],
    Career: [
      'My influence grows with every meaningful contribution I make.',
      'My career horizon expands into global authority and acclaim.',
    ],
    Love: [
      'My capacity for love, passion, and intimacy deepens daily.',
    ],
    Confidence: [
      'My courage expands every time I embrace an unknown horizon.',
    ],
    Health: [
      'My vitality and physical stamina expand with each morning sunrise.',
    ],
    Spiritual: [
      'My spiritual consciousness broadens into boundless universal love.',
    ],
    Peace: [
      'Serenity spreads throughout my home and workday with ease.',
    ],
    Luxury: [
      'My world expands to include breathtaking destinations and sanctuaries.',
    ],
    Gratitude: [
      'My thankfulness expands as I notice life’s quiet wonders.',
    ],
    Freedom: [
      'My sovereign options multiply in every direction.',
    ],
  },

  'Completion-Based': {
    Wealth: [
      'The financial reality I envisioned is becoming my normal life.',
      'My wealth goals are fully materialized and sustained.',
      'I live inside the abundance I once only imagined.',
    ],
    Career: [
      'My success story unfolds beautifully and with sovereign dignity.',
      'The milestones I dreamed of are now my daily backdrop.',
    ],
    Love: [
      'The harmonious love I prayed for surrounds me in peace.',
    ],
    Confidence: [
      'I have arrived at unbreakable peace with who I am.',
    ],
    Health: [
      'Vibrant wellness is my steady, established baseline of living.',
    ],
    Spiritual: [
      'My alignment with the cosmos is complete, steady, and joyful.',
    ],
    Peace: [
      'Tranquility is my permanent anchor; the struggle is over.',
    ],
    Luxury: [
      'Elegance and freedom have become the natural texture of life.',
    ],
    Gratitude: [
      'My heart is full; I rest in divine sufficiency.',
    ],
    Freedom: [
      'I walk as a free, sovereign creator in my own realm.',
    ],
  },
};

export const PATTERN_LIST: AffirmationPatternType[] = [
  'Identity-Based',
  'Ownership-Based',
  'Reality-Based',
  'Gratitude-Based',
  'Embodiment-Based',
  'Receiving-Based',
  'Certainty-Based',
  'Magnetic-Based',
  'Expansion-Based',
  'Completion-Based',
];

/**
 * Validates affirmation text according to the user's Golden Rules:
 * - Present tense only
 * - NEVER "I will", "Someday", "One day", "Hopefully", "Trying to", "Want to", "Need to", "I already"
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
 * Rotates between the 10 pattern structures and generates a fresh, non-repetitive affirmation
 */
let lastPatternIndex = 0;

export function generateDynamicAffirmation(
  profile: Partial<UserPortalProfile>,
  category: AffirmationCategory = 'Wealth',
  portalTime: string = '11:11',
  requestedPattern?: AffirmationPatternType
): AffirmationItem {
  const name = profile.name || 'Harsha';

  // Cycle through patterns so consecutive affirmations never share the same structure
  let pattern: AffirmationPatternType;
  if (requestedPattern) {
    pattern = requestedPattern;
  } else {
    lastPatternIndex = (lastPatternIndex + 1) % PATTERN_LIST.length;
    pattern = PATTERN_LIST[lastPatternIndex];
  }

  const bank = MULTI_PATTERN_AFFIRMATION_BANK[pattern];
  const statements = bank[category] || bank.Wealth;

  const chosenText =
    statements[Math.floor(Math.random() * statements.length)] ||
    'Abundance feels natural, peaceful, and permanently anchored in my life.';

  const theme = THEMED_BACKGROUNDS[category] || THEMED_BACKGROUNDS.Wealth;

  return {
    id: `aff_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    text: chosenText,
    category,
    patternType: pattern,
    portalTime,
    authorNote: `${pattern} Transmission for ${name} at ${portalTime} Portal`,
    format: profile.format || 'Medium',
    isFavorite: false,
    backgroundTheme: theme,
  };
}

/**
 * Builds initial diverse feed rotating across all 10 patterns and categories
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

  return categories.flatMap((cat, catIdx) => {
    // Pick 2 distinct patterns for each category to ensure maximum structural variety
    const patternA = PATTERN_LIST[catIdx % PATTERN_LIST.length];
    const patternB = PATTERN_LIST[(catIdx + 5) % PATTERN_LIST.length];

    const affA = generateDynamicAffirmation(profile, cat, '11:11', patternA);
    const affB = generateDynamicAffirmation(profile, cat, '2:22', patternB);

    return [
      {
        ...affA,
        id: `feed_${cat}_${catIdx}_a`,
        isFavorite: cat === 'Wealth',
      },
      {
        ...affB,
        id: `feed_${cat}_${catIdx}_b`,
      },
    ];
  });
}

/**
 * Backward compatibility helper for TodayReflectionView
 */
export function generatePortalAffirmation(
  profile: Partial<UserPortalProfile>,
  portalKey: string = '11:11'
): { headline: string; affirmation: string; portalInsight: string } {
  const item = generateDynamicAffirmation(profile, 'Wealth', portalKey, 'Reality-Based');
  return {
    headline: `${portalKey} Gateway • ${profile.name || 'Harsha'}`,
    affirmation: item.text,
    portalInsight: `${portalKey} is a sacred manifestation portal. Your desired reality is anchored now.`,
  };
}
