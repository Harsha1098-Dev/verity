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
            <Plus size={16} color="#07040E" strokeWidth={2.5} />
            <Text style={styles.newEntryBtnText}>Anchor Today</Text>
          </Pressable>
        </View>

        {/* Gratitude & Streak Banner */}
        <View style={styles.statBanner}>
          <View style={styles.statBox}>
            <View style={styles.statIconCircle}>
              <Heart size={14} color={PALETTE.gold.base} />
            </View>
            <View>
              <Text style={styles.statNumber}>{profile.gratitudeCount}</Text>
              <Text style={styles.statLabel}>Miracles Anchored</Text>
            </View>
          </View>

          <View style={styles.dividerVertical} />

          <View style={styles.statBox}>
            <View style={[styles.statIconCircle, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
              <Flame size={14} color="#F59E0B" />
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
                  <Calendar size={12} color={PALETTE.gold.base} />
                  <Text style={styles.dateText}>{entry.date}</Text>
                </View>
                <View style={styles.portalTag}>
                  <Clock size={11} color={PALETTE.gold.base} />
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
                  <Sparkles size={13} color={PALETTE.gold.base} />
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
          <LinearGradient
            colors={['#0F0824', '#0A0518', '#05030C']}
            style={styles.modalContainer}
          >
            <View style={styles.modalHeader}>
              <Pressable onPress={() => setIsModalVisible(false)} style={{ padding: 6 }}>
                <X size={20} color="#D1CDDA" />
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
                  <Heart size={14} color={PALETTE.gold.base} />
                  <Text style={styles.inputCardLabel}>PROMPT 1</Text>
                </View>
                <Text style={styles.inputTitle}>What am I grateful for today?</Text>
                <TextInput
                  value={gratefulFor}
                  onChangeText={setGratefulFor}
                  placeholder="Lock your nervous system into gratitude..."
                  placeholderTextColor="#6B7280"
                  multiline
                  style={styles.textInputArea}
                />
              </View>

              {/* Prompt 2 */}
              <View style={styles.inputCard}>
                <View style={styles.inputCardHeader}>
                  <Eye size={14} color={PALETTE.gold.base} />
                  <Text style={styles.inputCardLabel}>PROMPT 2</Text>
                </View>
                <Text style={styles.inputTitle}>What abundance did I notice today?</Text>
                <TextInput
                  value={abundanceNoticed}
                  onChangeText={setAbundanceNoticed}
                  placeholder="Record syncs, gifts, financial flows, open doors..."
                  placeholderTextColor="#6B7280"
                  multiline
                  style={styles.textInputArea}
                />
              </View>

              {/* Prompt 3 */}
              <View style={styles.inputCard}>
                <View style={styles.inputCardHeader}>
                  <Sun size={14} color={PALETTE.gold.base} />
                  <Text style={styles.inputCardLabel}>PROMPT 3</Text>
                </View>
                <Text style={styles.inputTitle}>What amazing thing happened today?</Text>
                <TextInput
                  value={amazingHappened}
                  onChangeText={setAmazingHappened}
                  placeholder="Celebrate your wins, however quiet or massive..."
                  placeholderTextColor="#6B7280"
                  multiline
                  style={styles.textInputArea}
                />
              </View>

              {/* Prompt 4 */}
              <View style={styles.inputCard}>
                <View style={styles.inputCardHeader}>
                  <Sparkles size={14} color={PALETTE.gold.base} />
                  <Text style={styles.inputCardLabel}>PROMPT 4</Text>
                </View>
                <Text style={styles.inputTitle}>What would my future self say right now?</Text>
                <TextInput
                  value={futureSelfSaid}
                  onChangeText={setFutureSelfSaid}
                  placeholder="Transmission from the version of you who already lives it..."
                  placeholderTextColor="#6B7280"
                  multiline
                  style={styles.textInputArea}
                />
              </View>

              {/* Submit Button */}
              <Pressable onPress={handleSaveEntry} style={styles.sealEntryBtn}>
                <Check size={18} color="#07040E" strokeWidth={2.5} />
                <Text style={styles.sealEntryBtnText}>Seal Into Reality</Text>
              </Pressable>
            </ScrollView>
          </LinearGradient>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#05040A',
  },
  container: {
    flex: 1,
    backgroundColor: '#05040A',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(245, 208, 97, 0.12)',
  },
  headerTitle: {
    fontFamily: FONTS.serifBold,
    fontSize: 18,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: PALETTE.gold.base,
    marginTop: 2,
  },
  newEntryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: PALETTE.gold.base,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
  },
  newEntryBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 11.5,
    color: '#07040E',
  },
  statBanner: {
    flexDirection: 'row',
    marginHorizontal: 18,
    marginTop: 14,
    marginBottom: 10,
    backgroundColor: 'rgba(26, 20, 56, 0.6)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 208, 97, 0.18)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
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
    backgroundColor: 'rgba(245, 208, 97, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    fontFamily: FONTS.sansBold,
    fontSize: 15,
    color: '#FFFFFF',
  },
  statLabel: {
    fontFamily: FONTS.sans,
    fontSize: 10,
    color: '#9CA3AF',
  },
  dividerVertical: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginHorizontal: 12,
  },
  timelineScroll: {
    paddingHorizontal: 18,
    paddingTop: 8,
    gap: 16,
  },
  journalCard: {
    backgroundColor: 'rgba(26, 20, 56, 0.75)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(245, 208, 97, 0.18)',
    padding: 18,
    gap: 12,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  dateTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 12,
    color: '#FFFFFF',
  },
  portalTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 208, 97, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  portalTagText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 10,
    color: PALETTE.gold.base,
  },
  qaBlock: {
    gap: 3,
  },
  promptLabel: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 9.5,
    letterSpacing: 1,
    color: PALETTE.gold.base,
  },
  answerText: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    lineHeight: 19,
    color: '#D1CDDA',
  },
  futureSelfBox: {
    backgroundColor: 'rgba(10, 6, 26, 0.65)',
    borderRadius: 14,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: PALETTE.gold.base,
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
    color: PALETTE.gold.base,
  },
  futureSelfText: {
    fontFamily: FONTS.serifItalic,
    fontSize: 13,
    lineHeight: 19,
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 24 : 16,
    paddingHorizontal: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(245, 208, 97, 0.15)',
  },
  modalTitle: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 12,
    letterSpacing: 1.5,
    color: PALETTE.gold.base,
  },
  modalScroll: {
    paddingTop: 16,
    paddingBottom: 40,
    gap: 14,
  },
  inputCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(245, 208, 97, 0.15)',
    padding: 14,
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
    color: PALETTE.gold.base,
  },
  inputTitle: {
    fontFamily: FONTS.serifBold,
    fontSize: 15,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  textInputArea: {
    backgroundColor: 'rgba(7, 4, 14, 0.7)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: '#FFFFFF',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  sealEntryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: PALETTE.gold.base,
    paddingVertical: 14,
    borderRadius: 24,
    marginTop: 8,
  },
  sealEntryBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 14,
    color: '#07040E',
    letterSpacing: 0.5,
  },
});
