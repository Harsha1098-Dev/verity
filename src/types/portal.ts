/**
 * Portal 11:11 Manifestation & Affirmation Architecture Types
 */

export type ManifestationGoal =
  | 'Wealth'
  | 'Financial Freedom'
  | 'Career Success'
  | 'Business Growth'
  | 'Dream Job'
  | 'Love'
  | 'Marriage'
  | 'Relationships'
  | 'Self Confidence'
  | 'Health'
  | 'Weight Loss'
  | 'Healing'
  | 'Happiness'
  | 'Spiritual Growth'
  | 'Purpose'
  | 'Peace'
  | 'Luxury Lifestyle'
  | 'Freedom';

export type EmotionalState =
  | 'Anxious'
  | 'Stressed'
  | 'Overwhelmed'
  | 'Lonely'
  | 'Hopeful'
  | 'Motivated'
  | 'Excited'
  | 'Confident';

export type TransformationArea =
  | 'Money'
  | 'Career'
  | 'Business'
  | 'Relationships'
  | 'Health'
  | 'Family'
  | 'Confidence'
  | 'Emotional Healing'
  | 'Spiritual Growth';

export type AffirmationStyle =
  | 'Spiritual'
  | 'Abundance'
  | 'Self Love'
  | 'Motivational'
  | 'Scientific Mindset'
  | 'Law of Attraction'
  | 'Universal Energy';

export type EnergyIntention =
  | 'Attract'
  | 'Heal'
  | 'Grow'
  | 'Release'
  | 'Transform'
  | 'Expand';

export type AffirmationFormat = 'Short' | 'Medium' | 'Deep';

export type NotificationFrequency =
  | 'Once Daily'
  | 'Twice Daily'
  | 'Three Times Daily'
  | 'Every Portal Time';

export interface PortalTimeDefinition {
  time: string; // '11:11', '1:11', '2:22', '3:33', '4:44', '5:55', '7:07', '8:08', '9:09', '12:12'
  display: string;
  name: string;
  theme: string;
  cosmicMessage: string;
  isRecommended: boolean;
}

export const SACRED_PORTAL_TIMES: PortalTimeDefinition[] = [
  {
    time: '11:11',
    display: '11:11',
    name: 'Master Awakening Gateway',
    theme: 'Divine synchronicity, cosmic alignment & conscious creation',
    cosmicMessage: 'Everything aligns beautifully with the vision you hold for your life.',
    isRecommended: true,
  },
  {
    time: '1:11',
    display: '1:11',
    name: 'Intuitive Clarity Portal',
    theme: 'Fresh manifestation cycles & crystal clear thought power',
    cosmicMessage: 'Your thoughts are magnetic seeds; sow only what elevates your reality.',
    isRecommended: false,
  },
  {
    time: '2:22',
    display: '2:22',
    name: 'Harmony & Trust Gateway',
    theme: 'Divine timing, unbreakable faith & cooperative universal forces',
    cosmicMessage: 'Support, abundance, and opportunity surround every step you take.',
    isRecommended: true,
  },
  {
    time: '3:33',
    display: '3:33',
    name: 'Trinity Mastery Portal',
    theme: 'Mind-body-soul coherence, ascendant wisdom & sovereign power',
    cosmicMessage: 'Your body, heart, and spirit are aligned in unstoppable momentum.',
    isRecommended: false,
  },
  {
    time: '4:44',
    display: '4:44',
    name: 'Angelic Protection & Grounding',
    theme: 'Unshakable foundations, safe expansion & universal shelter',
    cosmicMessage: 'You are protected, guided, and rooted in unconditional safety.',
    isRecommended: false,
  },
  {
    time: '5:55',
    display: '5:55',
    name: 'Quantum Transformation Gateway',
    theme: 'Rapid evolution, bold liberation & quantum leaps of abundance',
    cosmicMessage: 'Positive transformation flows effortlessly into every area of your world.',
    isRecommended: true,
  },
  {
    time: '7:07',
    display: '7:07',
    name: 'Mystic Grace & Deep Wisdom',
    theme: 'Spiritual mastery, psychic intuition & serene transcendence',
    cosmicMessage: 'Inner knowing guides you directly to the rooms you prayed for.',
    isRecommended: false,
  },
  {
    time: '8:08',
    display: '8:08',
    name: 'Infinite Abundance Loop',
    theme: 'Limitless wealth, sovereign flow & multiplied prosperity',
    cosmicMessage: 'Money and wealth flow continuously to you through multiplying channels.',
    isRecommended: true,
  },
  {
    time: '9:09',
    display: '9:09',
    name: 'Soul Purpose & Destiny Portal',
    theme: 'Closure of lack, step into highest destiny & radiant leadership',
    cosmicMessage: 'You embody your highest self now; the old limits no longer apply.',
    isRecommended: false,
  },
  {
    time: '12:12',
    display: '12:12',
    name: 'Cosmic Order & Completion',
    theme: 'Sacred sacred geometric balance & manifestation fruition',
    cosmicMessage: 'Divine order governs your path; the harvest of your belief is here.',
    isRecommended: false,
  },
];

export interface UserPortalProfile {
  name: string;
  goal: ManifestationGoal;
  emotion: EmotionalState;
  transformationArea: TransformationArea;
  affirmationStyle: AffirmationStyle;
  goal90Days: string;
  portalTimes: string[]; // ['11:11', '2:22', '5:55', '8:08']
  frequency: NotificationFrequency;
  format: AffirmationFormat;
  energy: EnergyIntention;
  confidence: number; // 1 to 10
  streakDays: number;
  weeklyStreak: number;
  monthlyStreak: number;
  gratitudeCount: number;
  manifestationProgress: number; // 0 to 100%
  onboardingCompleted: boolean;
  isPremium: boolean;
  preferredVoice: 'Aura Calm' | 'Sol Spiritual' | 'Orion Deep' | 'Mystic Nature';

  // Authentication Credentials
  phoneNumber?: string;
  authMethod?: 'password' | 'otp';
  isAuthenticated?: boolean;

  // Membership & Direct Bank Settlement
  membershipTier?: 'free' | 'sacred_monthly' | 'sovereign_annual' | 'divine_lifetime';
  isVIP?: boolean;

  // 15-Question Customization Profile Additions
  voiceTone?: string;
  primePortalWindow?: string;
  preferred3DAtmosphere?: string;
  manifestationObstacle?: string;
  commitmentLevel?: string;

  // Backward-compatibility aliases
  manifestationGoal?: ManifestationGoal;
  emotionalState?: EmotionalState;
  healingArea?: TransformationArea;
  energyIntention?: EnergyIntention;
  messageLength?: string;
  confidenceLevel?: number;
  incomeGoal?: string;
  relationshipStatus?: string;
  careerStage?: string;
  currentChallenge?: string;
}

export type AffirmationCategory =
  | 'Self-Worth'
  | 'Wealth'
  | 'Career'
  | 'Love'
  | 'Health'
  | 'Confidence'
  | 'Spiritual'
  | 'Productivity'
  | 'Happiness'
  | 'Purpose'
  | 'Peace'
  | 'Luxury'
  | 'Gratitude'
  | 'Freedom';

export type AffirmationPatternType =
  | 'Identity-Based'
  | 'Ownership-Based'
  | 'Reality-Based'
  | 'Gratitude-Based'
  | 'Embodiment-Based'
  | 'Receiving-Based'
  | 'Certainty-Based'
  | 'Magnetic-Based'
  | 'Expansion-Based'
  | 'Completion-Based';

export interface AI3DSceneDefinition {
  id: string;
  name: string;
  category: AffirmationCategory;
  style: string;
  localAssetKey?: string;
  imageUrl: string;
  gradientOverlay: [string, string, string];
  particleColor: string;
  accentGlow: string;
  vibeDescription: string;
}

export interface AffirmationItem {
  id: string;
  text: string;
  category: AffirmationCategory;
  patternType?: AffirmationPatternType;
  portalTime?: string;
  authorNote: string;
  format: AffirmationFormat;
  isFavorite: boolean;
  backgroundTheme: {
    gradient: [string, string, string];
    particleColor: string;
    atmosphereName: string;
    iconName: string;
    accentGlow: string;
    aiSceneUrl?: string;
    ai3dStyle?: string;
    localAssetKey?: string;
    sceneId?: string;
  };
}

export interface JournalEntry {
  id: string;
  date: string;
  timestamp?: string;
  portalTime: string;
  gratefulFor: string;
  abundanceNoticed?: string;
  amazingHappened?: string;
  futureSelfSaid?: string;
  miracleToday?: string;
  futureSelfMessage?: string;
  tags?: string[];
}

export type ManifestationJournalEntry = JournalEntry;

export interface VisionBoardItem {
  id: string;
  category: 'Dream House' | 'Dream Car' | 'Dream Vacation' | 'Income Goals' | 'Health Goals' | 'Relationship Goals';
  title: string;
  intention: string;
  targetDate?: string;
  status: 'Manifesting' | 'In Flow' | 'Manifested';
  imageUrl?: string;
  gradientColors: [string, string];
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  requiredStreak: number;
  icon: string;
  unlocked: boolean;
}

export const ACHIEVEMENTS_LIST: AchievementItem[] = [
  {
    id: 'align_7',
    title: '7 Day Alignment',
    description: 'Anchor sacred focus for 7 continuous days.',
    requiredStreak: 7,
    icon: '🔥',
    unlocked: true,
  },
  {
    id: 'manifest_21',
    title: '21 Day Manifestation',
    description: 'Rewrite subconscious reality pathways.',
    requiredStreak: 21,
    icon: '⚡',
    unlocked: false,
  },
  {
    id: 'master_111',
    title: '111 Day Portal Master',
    description: 'Master cosmic synchronicity across 111 cycles.',
    requiredStreak: 111,
    icon: '✨',
    unlocked: false,
  },
  {
    id: 'creator_222',
    title: '222 Day Reality Creator',
    description: 'Sovereign manifestation authority achieved.',
    requiredStreak: 222,
    icon: '👑',
    unlocked: false,
  },
  {
    id: 'champion_555',
    title: '555 Day Transformation Champion',
    description: 'Complete metamorphosis into your highest identity.',
    requiredStreak: 555,
    icon: '🌟',
    unlocked: false,
  },
];
