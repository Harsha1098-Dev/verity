import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  UserPortalProfile,
  AffirmationItem,
  JournalEntry,
  VisionBoardItem,
  ACHIEVEMENTS_LIST,
  AchievementItem,
} from '@/types/portal';

const PROFILE_KEY = '@portal1111_user_profile_v2';
const FAVORITES_KEY = '@portal1111_saved_affirmations';
const JOURNAL_KEY = '@portal1111_journal_entries_v2';
const VISION_KEY = '@portal1111_vision_board_v2';
const ACHIEVEMENTS_KEY = '@portal1111_achievements_v2';

export const DEFAULT_PORTAL_PROFILE: UserPortalProfile = {
  name: 'Harsha',
  goal: 'Career Success',
  emotion: 'Motivated',
  transformationArea: 'Career',
  affirmationStyle: 'Spiritual',
  goal90Days: 'Lead high-impact systems, earn ₹5 Lakh monthly, and cultivate serene mastery',
  portalTimes: ['11:11', '1:11', '2:22', '5:55', '8:08'],
  frequency: 'Every Portal Time',
  format: 'Medium',
  energy: 'Grow',
  confidence: 8,
  streakDays: 12,
  weeklyStreak: 2,
  monthlyStreak: 1,
  gratitudeCount: 38,
  manifestationProgress: 84,
  onboardingCompleted: false, // First-time users are prompted for 15 customization questions
  isAuthenticated: false, // First-time users are prompted to sign in with phone
  phoneNumber: '',
  authMethod: 'otp',
  voiceTone: 'Sovereign & Empowering',
  primePortalWindow: 'Midday Alignment 11:11',
  preferred3DAtmosphere: 'Molten Gold & Obsidian Waves',
  manifestationObstacle: 'Doubt & Overthinking',
  commitmentLevel: 'Daily Sacred Devotion',
  isPremium: true,
  preferredVoice: 'Sol Spiritual',
};

type ProfileListener = (profile: UserPortalProfile) => void;
const profileListeners = new Set<ProfileListener>();

export function subscribeToProfile(listener: ProfileListener): () => void {
  profileListeners.add(listener);
  return () => {
    profileListeners.delete(listener);
  };
}

export function notifyProfileListeners(profile: UserPortalProfile) {
  profileListeners.forEach((fn) => {
    try {
      fn(profile);
    } catch (err) {
      console.error('Error in profile listener', err);
    }
  });
}

export const DEFAULT_VISION_BOARD: VisionBoardItem[] = [
  {
    id: 'v1',
    category: 'Dream House',
    title: 'Minimalist Glass Villa in the Hills',
    intention: 'Surrounded by pine trees, floor-to-ceiling glass, and boundless creative stillness.',
    targetDate: 'Dec 2027',
    status: 'In Flow',
    gradientColors: ['#38184C', '#1D0D2A'],
  },
  {
    id: 'v2',
    category: 'Income Goals',
    title: '₹5 Lakh+ Monthly Autonomous Flow',
    intention: 'Money arrives continuously from scalable creations that genuinely serve the world.',
    targetDate: 'Aug 2027',
    status: 'Manifesting',
    gradientColors: ['#2F1F05', '#160E02'],
  },
  {
    id: 'v3',
    category: 'Dream Car',
    title: 'Porsche Taycan Midnight Bronze',
    intention: 'Effortless silent electric power, precision craftsmanship, and joyful travel.',
    targetDate: 'Nov 2027',
    status: 'Manifesting',
    gradientColors: ['#0F213A', '#060F1C'],
  },
  {
    id: 'v4',
    category: 'Dream Vacation',
    title: 'Kyoto Zen & Swiss Alpine Retreat',
    intention: 'Immersing in ancient tea ceremonies, snow-capped peaks, and total rejuvenation.',
    targetDate: 'May 2027',
    status: 'Manifested',
    gradientColors: ['#092A21', '#041510'],
  },
  {
    id: 'v5',
    category: 'Relationship Goals',
    title: 'Conscious Elevating Partnership',
    intention: 'Unconditional loyalty, spiritual synergy, laughter, and expansive adventures.',
    targetDate: 'Continuous',
    status: 'In Flow',
    gradientColors: ['#3B0D28', '#1F0615'],
  },
];

export const DEFAULT_VISION_ITEMS = DEFAULT_VISION_BOARD;

export const DEFAULT_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'j1',
    date: 'Wednesday, Nov 11',
    timestamp: '11:11 AM',
    portalTime: '11:11 AM',
    gratefulFor: 'Clarity of purpose, loving support, and the peace in my chest.',
    abundanceNoticed: 'Received sudden high-value contract interest while walking in morning sun.',
    amazingHappened: 'Realized that doubts from 6 months ago have completely dissolved.',
    futureSelfSaid: 'You have already won. Walk with calm authority and enjoy the process.',
    tags: ['Career', 'Wealth', 'Miracle'],
  },
  {
    id: 'j2',
    date: 'Tuesday, Nov 10',
    timestamp: '2:22 PM',
    portalTime: '2:22 PM',
    gratefulFor: 'The ability to create world-class software that empowers people.',
    abundanceNoticed: 'Connected with visionary collaborators who share my highest values.',
    amazingHappened: 'A solution to an architecture problem appeared in an effortless flash.',
    futureSelfSaid: 'Keep your standards uncompromising; the world is catching up to your vision.',
    tags: ['Clarity', 'Alignment'],
  },
];

export async function loadPortalProfile(): Promise<UserPortalProfile> {
  try {
    const json = await AsyncStorage.getItem(PROFILE_KEY);
    if (json) {
      return { ...DEFAULT_PORTAL_PROFILE, ...JSON.parse(json) };
    }
  } catch (e) {
    console.error('Failed to load profile', e);
  }
  return DEFAULT_PORTAL_PROFILE;
}

export async function savePortalProfile(
  profile: Partial<UserPortalProfile>
): Promise<UserPortalProfile> {
  try {
    const current = await loadPortalProfile();
    const updated = { ...current, ...profile };
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
    notifyProfileListeners(updated);
    return updated;
  } catch (e) {
    console.error('Failed to save profile', e);
    const fallback = { ...DEFAULT_PORTAL_PROFILE, ...profile };
    notifyProfileListeners(fallback);
    return fallback;
  }
}

/**
 * Signs in user with mobile phone credentials (via OTP or Password)
 */
export async function signInWithPhone(
  phoneNumber: string,
  authMethod: 'password' | 'otp',
  name?: string
): Promise<UserPortalProfile> {
  const current = await loadPortalProfile();
  const updated: UserPortalProfile = {
    ...current,
    phoneNumber,
    authMethod,
    isAuthenticated: true,
    name: name || current.name || 'Harsha',
  };
  return await savePortalProfile(updated);
}

/**
 * Signs out current user, triggering auth gating screen
 */
export async function signOutUser(): Promise<UserPortalProfile> {
  const current = await loadPortalProfile();
  const updated: UserPortalProfile = {
    ...current,
    isAuthenticated: false,
  };
  return await savePortalProfile(updated);
}

/**
 * Resets onboarding so user can retake 15 customization questions
 */
export async function resetUserOnboarding(): Promise<UserPortalProfile> {
  const current = await loadPortalProfile();
  const updated: UserPortalProfile = {
    ...current,
    onboardingCompleted: false,
  };
  return await savePortalProfile(updated);
}

export async function loadFavorites(): Promise<AffirmationItem[]> {
  try {
    const json = await AsyncStorage.getItem(FAVORITES_KEY);
    if (json) {
      return JSON.parse(json);
    }
  } catch (e) {
    console.error('Failed to load favorites', e);
  }
  return [];
}

export async function toggleFavoriteAffirmation(
  affirmation: AffirmationItem
): Promise<AffirmationItem[]> {
  try {
    const current = await loadFavorites();
    const exists = current.some((item) => item.id === affirmation.id);
    let updated: AffirmationItem[];
    if (exists) {
      updated = current.filter((item) => item.id !== affirmation.id);
    } else {
      updated = [{ ...affirmation, isFavorite: true }, ...current];
    }
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to toggle favorite', e);
    return [];
  }
}

export async function loadJournalEntries(): Promise<JournalEntry[]> {
  try {
    const json = await AsyncStorage.getItem(JOURNAL_KEY);
    if (json) {
      return JSON.parse(json);
    }
  } catch (e) {
    console.error('Failed to load journal', e);
  }
  return DEFAULT_JOURNAL_ENTRIES;
}

export async function saveJournalEntry(
  entry: Omit<JournalEntry, 'id'>
): Promise<JournalEntry[]> {
  try {
    const current = await loadJournalEntries();
    const newEntry: JournalEntry = {
      ...entry,
      id: `journal_${Date.now()}`,
    };
    const updated = [newEntry, ...current];
    await AsyncStorage.setItem(JOURNAL_KEY, JSON.stringify(updated));

    // Increment gratitude count in profile
    const profile = await loadPortalProfile();
    await savePortalProfile({
      gratitudeCount: profile.gratitudeCount + 1,
    });

    return updated;
  } catch (e) {
    console.error('Failed to save journal entry', e);
    return DEFAULT_JOURNAL_ENTRIES;
  }
}

export async function loadVisionBoard(): Promise<VisionBoardItem[]> {
  try {
    const json = await AsyncStorage.getItem(VISION_KEY);
    if (json) {
      return JSON.parse(json);
    }
  } catch (e) {
    console.error('Failed to load vision board', e);
  }
  return DEFAULT_VISION_BOARD;
}

export async function saveVisionBoardItem(
  item: Omit<VisionBoardItem, 'id'>
): Promise<VisionBoardItem[]> {
  try {
    const current = await loadVisionBoard();
    const newItem: VisionBoardItem = {
      ...item,
      id: `vision_${Date.now()}`,
    };
    const updated = [newItem, ...current];
    await AsyncStorage.setItem(VISION_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save vision item', e);
    return DEFAULT_VISION_BOARD;
  }
}

export async function updateVisionBoardItem(
  id: string,
  updates: Partial<VisionBoardItem>
): Promise<VisionBoardItem[]> {
  try {
    const current = await loadVisionBoard();
    const updated = current.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    await AsyncStorage.setItem(VISION_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to update vision item', e);
    return DEFAULT_VISION_BOARD;
  }
}

export async function loadAchievements(): Promise<AchievementItem[]> {
  try {
    const json = await AsyncStorage.getItem(ACHIEVEMENTS_KEY);
    if (json) {
      return JSON.parse(json);
    }
  } catch (e) {
    console.error('Failed to load achievements', e);
  }
  return ACHIEVEMENTS_LIST;
}
