/**
 * Portal 11:11 Manifestation & Affirmation Types
 */

export type ManifestationGoal =
  | 'Financial Abundance'
  | 'Career Growth'
  | 'Love & Relationships'
  | 'Marriage'
  | 'Self Confidence'
  | 'Physical Health'
  | 'Emotional Healing'
  | 'Spiritual Growth'
  | 'Business Success'
  | 'Inner Peace';

export type EmotionalState =
  | 'Anxious'
  | 'Overwhelmed'
  | 'Motivated'
  | 'Confident'
  | 'Lonely'
  | 'Stressed'
  | 'Grateful'
  | 'Hopeful';

export type HealingArea =
  | 'Self-worth'
  | 'Family'
  | 'Career'
  | 'Relationships'
  | 'Past Trauma'
  | 'Health'
  | 'Finances';

export type AffirmationType =
  | 'Spiritual'
  | 'Scientific / Mindset'
  | 'Abundance'
  | 'Motivational'
  | 'Self-love'
  | 'Law of Attraction'
  | 'Christian'
  | 'Hindu Spirituality'
  | 'Universal Energy';

export type EnergyIntention =
  | 'Attract'
  | 'Heal'
  | 'Grow'
  | 'Release'
  | 'Transform';

export interface PortalTimeDefinition {
  time: string; // '11:11', '2:22', etc.
  display: string;
  name: string;
  theme: string;
  isRecommended: boolean;
}

export const PORTAL_DEFINITIONS: PortalTimeDefinition[] = [
  { time: '11:11', display: '11:11', name: 'Awakening Portal', theme: 'Divine alignment & high synchronicity', isRecommended: true },
  { time: '12:12', display: '12:12', name: 'Order & Clarity', theme: 'Divine order & conscious creation', isRecommended: false },
  { time: '1:11', display: '1:11', name: 'Intuition Portal', theme: 'Fresh beginnings & mental clarity', isRecommended: false },
  { time: '2:22', display: '2:22', name: 'Harmony Portal', theme: 'Balance, trust & divine timing', isRecommended: true },
  { time: '3:33', display: '3:33', name: 'Trinity Portal', theme: 'Mind, body & soul wholeness', isRecommended: false },
  { time: '4:44', display: '4:44', name: 'Protection Portal', theme: 'Angelic grounding & peace', isRecommended: false },
  { time: '5:55', display: '5:55', name: 'Transformation Portal', theme: 'Quantum leaps & bold breakthroughs', isRecommended: true },
  { time: '6:06', display: '6:06', name: 'Material Harmony', theme: 'Financial peace & earthly balance', isRecommended: false },
  { time: '7:07', display: '7:07', name: 'Spiritual Luck', theme: 'Deep wisdom & mystic grace', isRecommended: false },
  { time: '8:08', display: '8:08', name: 'Abundance Portal', theme: 'Infinite wealth & expansion', isRecommended: false },
  { time: '9:09', display: '9:09', name: 'Soul Purpose', theme: 'Destiny completion & elevated self', isRecommended: false },
];

export interface UserPortalProfile {
  name: string;
  manifestationGoal: ManifestationGoal;
  emotionalState: EmotionalState;
  healingArea: HealingArea;
  affirmationStyle: AffirmationType;
  goal90Days: string;
  portalTimes: string[]; // ['11:11', '2:22', '5:55']
  frequency: string;
  preferredVoice: string;
  messageLength: 'Short (1 line)' | 'Medium (3 lines)' | 'Deep Guided Messages';
  personalizedAI: boolean;
  relationshipStatus: string;
  ageGroup: string;
  energyIntention: EnergyIntention;
  incomeGoal?: string;
  confidenceLevel: number; // 1 to 10
  streakDays: number;
  onboardingCompleted: boolean;
}

export interface ManifestationJournalEntry {
  id: string;
  date: string;
  miracleToday: string;
  gratefulFor: string;
  futureSelfMessage: string;
  portalTime: string;
}

export interface VisionBoardItem {
  id: string;
  category: 'Career' | 'Wealth' | 'Love' | 'Home' | 'Travel';
  title: string;
  intention: string;
  gradient: [string, string];
}
