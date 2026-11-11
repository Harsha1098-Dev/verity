import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  UserPortalProfile,
  ManifestationJournalEntry,
  VisionBoardItem,
} from '@/types/portal';

const PROFILE_KEY = '@portal_1111_user_profile';
const JOURNAL_KEY = '@portal_1111_journal_entries';
const VISION_KEY = '@portal_1111_vision_board';

export const DEFAULT_PORTAL_PROFILE: UserPortalProfile = {
  name: 'Harsha',
  manifestationGoal: 'Career Growth',
  emotionalState: 'Overwhelmed',
  healingArea: 'Career',
  affirmationStyle: 'Spiritual',
  goal90Days: 'I want a remote software job with ₹1 lakh monthly income',
  portalTimes: ['11:11', '2:22', '5:55'],
  frequency: 'Three times daily',
  preferredVoice: 'Female Spiritual Voice',
  messageLength: 'Medium (3 lines)',
  personalizedAI: true,
  relationshipStatus: 'Single',
  ageGroup: '25-34',
  energyIntention: 'Grow',
  incomeGoal: '₹1 Lakh/month',
  confidenceLevel: 6,
  streakDays: 12,
  onboardingCompleted: true,
};

export const DEFAULT_VISION_ITEMS: VisionBoardItem[] = [
  {
    id: '1',
    category: 'Career',
    title: 'Remote Software Architect',
    intention: 'Building world-class systems with autonomy and mastery.',
    gradient: ['#D8C6EB', '#8EBCE4'],
  },
  {
    id: '2',
    category: 'Wealth',
    title: '₹1 Lakh+ Monthly Flow',
    intention: 'Effortless abundance, freedom, and generous living.',
    gradient: ['#F6D6A7', '#DCAB68'],
  },
  {
    id: '3',
    category: 'Travel',
    title: 'Serene Himalayan Retreat',
    intention: 'Deep meditative peace, fresh air, and spiritual clarity.',
    gradient: ['#CAE7D3', '#96CEA7'],
  },
];

export const DEFAULT_JOURNAL_ENTRIES: ManifestationJournalEntry[] = [
  {
    id: '1',
    date: 'Tuesday, Nov 10',
    portalTime: '11:11 AM',
    miracleToday: 'Received unexpected positive outreach about an engineering opportunity.',
    gratefulFor: 'Clarity of mind, supportive family, and my growing self-confidence.',
    futureSelfMessage: 'Keep moving with quiet poise. You are already in the room you prayed for.',
  },
];

export async function loadPortalProfile(): Promise<UserPortalProfile> {
  try {
    const json = await AsyncStorage.getItem(PROFILE_KEY);
    if (json) {
      return { ...DEFAULT_PORTAL_PROFILE, ...JSON.parse(json) };
    }
  } catch (e) {
    console.error('Failed to load portal profile', e);
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
    return updated;
  } catch (e) {
    console.error('Failed to save portal profile', e);
    return { ...DEFAULT_PORTAL_PROFILE, ...profile };
  }
}

export async function loadJournalEntries(): Promise<ManifestationJournalEntry[]> {
  try {
    const json = await AsyncStorage.getItem(JOURNAL_KEY);
    if (json) {
      return JSON.parse(json);
    }
  } catch (e) {
    console.error('Failed to load journal entries', e);
  }
  return DEFAULT_JOURNAL_ENTRIES;
}

export async function saveJournalEntry(
  entry: Omit<ManifestationJournalEntry, 'id'>
): Promise<ManifestationJournalEntry[]> {
  try {
    const current = await loadJournalEntries();
    const newEntry: ManifestationJournalEntry = {
      ...entry,
      id: Date.now().toString(),
    };
    const updated = [newEntry, ...current];
    await AsyncStorage.setItem(JOURNAL_KEY, JSON.stringify(updated));
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
  return DEFAULT_VISION_ITEMS;
}
