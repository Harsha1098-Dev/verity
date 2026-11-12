import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  BookMarked,
  Sparkles,
  Heart,
  Sun,
  Eye,
  Plus,
  X,
  Check,
  Calendar,
  Clock,
  Flame,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { PALETTE, FONTS, SHADOWS } from '@/constants/theme';
import { JournalEntry, UserPortalProfile } from '@/types/portal';
import {
  loadJournalEntries,
  saveJournalEntry,
  loadPortalProfile,
  DEFAULT_JOURNAL_ENTRIES,
  DEFAULT_PORTAL_PROFILE,
} from '@/utils/portalStore';

export default function JournalScreen() {
  const [profile, setProfile] = useState<UserPortalProfile>(DEFAULT_PORTAL_PROFILE);
  const [entries, setEntries] = useState<JournalEntry[]>(DEFAULT_JOURNAL_ENTRIES);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Modal prompt inputs
  const [gratefulFor, setGratefulFor] = useState('');
  const [abundanceNoticed, setAbundanceNoticed] = useState('');
  const [amazingHappened, setAmazingHappened] = useState('');
  const [futureSelfSaid, setFutureSelfSaid] = useState('');
  const [selectedTag, setSelectedTag] = useState('Career');

  useEffect(() => {
    (async () => {
      const p = await loadPortalProfile();
      const j = await loadJournalEntries();
      setProfile(p);
      setEntries(j);
    })();
  }, []);

  const triggerHaptic = (type: 'light' | 'success' = 'light') => {
    if (Platform.OS !== 'web') {
      if (type === 'success') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };

  const handleSaveEntry = async () => {
    triggerHaptic('success');
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
    const timeStr = today.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const updated = await saveJournalEntry({
      date: dateStr,
      timestamp: timeStr,
      portalTime: '11:11 AM',
      gratefulFor: gratefulFor || 'Stillness, health, and expanding creative capacity.',
      abundanceNoticed: abundanceNoticed || 'Unseen opportunities synchronizing behind the scenes.',
      amazingHappened: amazingHappened || 'Honored my sovereign truth without apology.',
      futureSelfSaid: futureSelfSaid || 'You are already in the room you prayed for. Walk tall.',
      tags: [selectedTag, 'Alignment'],
    });

    setEntries(updated);
    setProfile((prev) => ({
      ...prev,
      gratitudeCount: prev.gratitudeCount + 1,
    }));

    // Reset inputs
    setGratefulFor('');
    setAbundanceNoticed('');
    setAmazingHappened('');
    setFutureSelfSaid('');
    setIsModalVisible(false);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>MANIFESTATION JOURNAL</Text>
            <Text style={styles.headerSubtitle}>
              4 Sacred Daily Reality Prompts
            </Text>
          </View>

          <Pressable
            onPress={() => {
              triggerHaptic('light');
              setIsModalVisible(true);
            }}
            style={styles.newEntryBtn}
          >
            <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.newEntryBtnText}>Anchor Today</Text>
          </Pressable>
        </View>

        {/* Gratitude & Streak Banner */}
        <View style={styles.statBanner}>
          <View style={styles.statBox}>
            <View style={styles.statIconCircle}>
              <Heart size={14} color={PALETTE.bronze.base} />
            </View>
            <View>
              <Text style={styles.statNumber}>{profile.gratitudeCount}</Text>
              <Text style={styles.statLabel}>Miracles Anchored</Text>
            </View>
          </View>

          <View style={styles.dividerVertical} />

          <View style={styles.statBox}>
            <View style={[styles.statIconCircle, { backgroundColor: PALETTE.prosecco.light }]}>
              <Flame size={14} color={PALETTE.bronze.base} />
            </View>
            <View>
              <Text style={styles.statNumber}>{profile.streakDays} Days</Text>
              <Text style={styles.statLabel}>Alignment Streak</Text>
            </View>
          </View>
        </View>

        {/* Entries Timeline */}
        <ScrollView
          contentContainerStyle={styles.timelineScroll}
          showsVerticalScrollIndicator={false}
        >
          {entries.map((entry) => (
            <View key={entry.id} style={styles.journalCard}>
              <View style={styles.cardTopRow}>
                <View style={styles.dateTag}>
                  <Calendar size={12} color={PALETTE.bronze.base} />
                  <Text style={styles.dateText}>{entry.date}</Text>
                </View>
                <View style={styles.portalTag}>
                  <Clock size={11} color={PALETTE.bronze.base} />
                  <Text style={styles.portalTagText}>{entry.portalTime}</Text>
                </View>
              </View>

              {/* Prompt 1 */}
              <View style={styles.qaBlock}>
                <Text style={styles.promptLabel}>1. WHAT AM I GRATEFUL FOR TODAY?</Text>
                <Text style={styles.answerText}>{entry.gratefulFor}</Text>
              </View>

              {/* Prompt 2 */}
              <View style={styles.qaBlock}>
                <Text style={styles.promptLabel}>2. WHAT ABUNDANCE DID I NOTICE?</Text>
                <Text style={styles.answerText}>{entry.abundanceNoticed}</Text>
              </View>

              {/* Prompt 3 */}
              <View style={styles.qaBlock}>
                <Text style={styles.promptLabel}>3. WHAT AMAZING THING HAPPENED?</Text>
                <Text style={styles.answerText}>{entry.amazingHappened}</Text>
              </View>

              {/* Prompt 4 */}
              <View style={[styles.qaBlock, styles.futureSelfBox]}>
                <View style={styles.futureSelfHeader}>
                  <Sparkles size={13} color={PALETTE.bronze.base} />
                  <Text style={styles.futureSelfLabel}>FUTURE SELF TRANSMISSION</Text>
                </View>
                <Text style={styles.futureSelfText}>“{entry.futureSelfSaid}”</Text>
              </View>
            </View>
          ))}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Modal: Add New 4-Prompt Journal Entry */}
        <Modal
          visible={isModalVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Pressable onPress={() => setIsModalVisible(false)} style={{ padding: 6 }}>
                <X size={20} color={PALETTE.ink.charcoal} />
              </Pressable>
              <Text style={styles.modalTitle}>ANCHOR REALITY TRANSMISSION</Text>
              <View style={{ width: 32 }} />
            </View>

            <ScrollView
              contentContainerStyle={styles.modalScroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Prompt 1 */}
              <View style={styles.inputCard}>
                <View style={styles.inputCardHeader}>
                  <Heart size={14} color={PALETTE.bronze.base} />
                  <Text style={styles.inputCardLabel}>PROMPT 1</Text>
                </View>
                <Text style={styles.inputTitle}>What am I grateful for today?</Text>
                <TextInput
                  value={gratefulFor}
                  onChangeText={setGratefulFor}
                  placeholder="Lock your nervous system into gratitude..."
                  placeholderTextColor={PALETTE.ink.muted}
                  multiline
                  style={styles.textInputArea}
                />
              </View>

              {/* Prompt 2 */}
              <View style={styles.inputCard}>
                <View style={styles.inputCardHeader}>
                  <Eye size={14} color={PALETTE.bronze.base} />
                  <Text style={styles.inputCardLabel}>PROMPT 2</Text>
                </View>
                <Text style={styles.inputTitle}>What abundance did I notice today?</Text>
                <TextInput
                  value={abundanceNoticed}
                  onChangeText={setAbundanceNoticed}
                  placeholder="Record syncs, gifts, financial flows, open doors..."
                  placeholderTextColor={PALETTE.ink.muted}
                  multiline
                  style={styles.textInputArea}
                />
              </View>

              {/* Prompt 3 */}
              <View style={styles.inputCard}>
                <View style={styles.inputCardHeader}>
                  <Sun size={14} color={PALETTE.bronze.base} />
                  <Text style={styles.inputCardLabel}>PROMPT 3</Text>
                </View>
                <Text style={styles.inputTitle}>What amazing thing happened today?</Text>
                <TextInput
                  value={amazingHappened}
                  onChangeText={setAmazingHappened}
                  placeholder="Celebrate your wins, however quiet or massive..."
                  placeholderTextColor={PALETTE.ink.muted}
                  multiline
                  style={styles.textInputArea}
                />
              </View>

              {/* Prompt 4 */}
              <View style={styles.inputCard}>
                <View style={styles.inputCardHeader}>
                  <Sparkles size={14} color={PALETTE.bronze.base} />
                  <Text style={styles.inputCardLabel}>PROMPT 4</Text>
                </View>
                <Text style={styles.inputTitle}>What would my future self say right now?</Text>
                <TextInput
                  value={futureSelfSaid}
                  onChangeText={setFutureSelfSaid}
                  placeholder="Transmission from the version of you who already lives it..."
                  placeholderTextColor={PALETTE.ink.muted}
                  multiline
                  style={styles.textInputArea}
                />
              </View>

              {/* Submit Button */}
              <Pressable onPress={handleSaveEntry} style={styles.sealEntryBtn}>
                <Check size={18} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={styles.sealEntryBtnText}>Seal Into Reality</Text>
              </Pressable>
            </ScrollView>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PALETTE.paper.linen,
  },
  container: {
    flex: 1,
    backgroundColor: PALETTE.paper.linen,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(122, 82, 48, 0.12)',
  },
  headerTitle: {
    fontFamily: FONTS.serifBold,
    fontSize: 18,
    color: PALETTE.ink.charcoal,
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: PALETTE.bronze.base,
    marginTop: 2,
  },
  newEntryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: PALETTE.bronze.base,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
  },
  newEntryBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 11.5,
    color: '#FFFFFF',
  },
  statBanner: {
    flexDirection: 'row',
    marginHorizontal: 18,
    marginTop: 14,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.12)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#7A5230',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  statBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: PALETTE.prosecco.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    fontFamily: FONTS.sansBold,
    fontSize: 15,
    color: PALETTE.ink.charcoal,
  },
  statLabel: {
    fontFamily: FONTS.sans,
    fontSize: 10,
    color: PALETTE.ink.muted,
  },
  dividerVertical: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(122, 82, 48, 0.12)',
    marginHorizontal: 12,
  },
  timelineScroll: {
    paddingHorizontal: 18,
    paddingTop: 8,
    gap: 16,
  },
  journalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.12)',
    padding: 18,
    gap: 12,
    shadowColor: '#7A5230',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(122, 82, 48, 0.08)',
  },
  dateTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 12,
    color: PALETTE.ink.charcoal,
  },
  portalTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: PALETTE.prosecco.light,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  portalTagText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 10,
    color: PALETTE.bronze.rich,
  },
  qaBlock: {
    gap: 3,
  },
  promptLabel: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 9.5,
    letterSpacing: 1,
    color: PALETTE.bronze.base,
  },
  answerText: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    lineHeight: 19,
    color: PALETTE.ink.charcoal,
  },
  futureSelfBox: {
    backgroundColor: PALETTE.paper.linen,
    borderRadius: 14,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: PALETTE.bronze.base,
    marginTop: 4,
  },
  futureSelfHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  futureSelfLabel: {
    fontFamily: FONTS.sansBold,
    fontSize: 9.5,
    letterSpacing: 1.2,
    color: PALETTE.bronze.base,
  },
  futureSelfText: {
    fontFamily: FONTS.serifItalic,
    fontSize: 13,
    lineHeight: 19,
    color: PALETTE.ink.charcoal,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: PALETTE.paper.linen,
    paddingTop: Platform.OS === 'ios' ? 24 : 16,
    paddingHorizontal: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(122, 82, 48, 0.12)',
  },
  modalTitle: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 12,
    letterSpacing: 1.5,
    color: PALETTE.bronze.base,
  },
  modalScroll: {
    paddingTop: 16,
    paddingBottom: 40,
    gap: 14,
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.12)',
    padding: 14,
    shadowColor: '#7A5230',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  inputCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  inputCardLabel: {
    fontFamily: FONTS.sansBold,
    fontSize: 9.5,
    letterSpacing: 1,
    color: PALETTE.bronze.base,
  },
  inputTitle: {
    fontFamily: FONTS.serifBold,
    fontSize: 15,
    color: PALETTE.ink.charcoal,
    marginBottom: 8,
  },
  textInputArea: {
    backgroundColor: PALETTE.paper.linen,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.15)',
    padding: 10,
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: PALETTE.ink.charcoal,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  sealEntryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: PALETTE.bronze.base,
    paddingVertical: 14,
    borderRadius: 24,
    marginTop: 8,
  },
  sealEntryBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
