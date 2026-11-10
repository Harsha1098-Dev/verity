import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Sparkles,
  BookOpen,
  BarChart3,
  User,
  Check,
  Feather,
  Clock,
  Play,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { PALETTE, FONTS, SHADOWS } from '@/constants/theme';
import { AudioPlayerModal } from './AudioPlayerModal';

export interface TodayReflectionViewProps {
  onSave?: (reflection: { text: string; tags: string[]; date: string }) => void;
  onNavigateTab?: (tab: 'today' | 'history' | 'insights' | 'profile') => void;
  initialText?: string;
  activeTab?: 'today' | 'history' | 'insights' | 'profile';
  showBottomNav?: boolean;
}

interface DayItem {
  dayName: string;
  dayNumber: number;
  fullDate: string;
  isToday: boolean;
}

interface TagItem {
  id: string;
  label: string;
  palette: 'prosecco' | 'foggyLove';
}

const DEFAULT_TAGS: TagItem[] = [
  { id: '1', label: '#SpeakingTruth', palette: 'prosecco' },
  { id: '2', label: '#SelfCompassion', palette: 'foggyLove' },
  { id: '3', label: '#InnerAlignment', palette: 'prosecco' },
  { id: '4', label: '#DeepPresence', palette: 'foggyLove' },
  { id: '5', label: '#QuietClarity', palette: 'prosecco' },
  { id: '6', label: '#ReleaseExpectation', palette: 'foggyLove' },
];

export const TodayReflectionView: React.FC<TodayReflectionViewProps> = ({
  onSave,
  onNavigateTab,
  initialText = '',
  activeTab = 'today',
  showBottomNav = false,
}) => {
  const [reflectionText, setReflectionText] = useState<string>(initialText);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(2); // Wednesday (Today)
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(['1', '2']);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [audioModalVisible, setAudioModalVisible] = useState<boolean>(false);

  const weekDays: DayItem[] = [
    { dayName: 'MON', dayNumber: 8, fullDate: '2026-11-08', isToday: false },
    { dayName: 'TUE', dayNumber: 9, fullDate: '2026-11-09', isToday: false },
    { dayName: 'WED', dayNumber: 10, fullDate: '2026-11-10', isToday: true },
    { dayName: 'THU', dayNumber: 11, fullDate: '2026-11-11', isToday: false },
    { dayName: 'FRI', dayNumber: 12, fullDate: '2026-11-12', isToday: false },
    { dayName: 'SAT', dayNumber: 13, fullDate: '2026-11-13', isToday: false },
    { dayName: 'SUN', dayNumber: 14, fullDate: '2026-11-14', isToday: false },
  ];

  const handleSelectDay = (index: number) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setSelectedDayIndex(index);
  };

  const handleToggleTag = (tagId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSave = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setIsSaved(true);
    onSave?.({
      text: reflectionText,
      tags: selectedTagIds,
      date: weekDays[selectedDayIndex].fullDate,
    });

    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  const handleTabPress = (tab: 'today' | 'history' | 'insights' | 'profile') => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onNavigateTab?.(tab);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={{
            paddingBottom: showBottomNav ? 120 : 50,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ========================================================
              1. HEADER: BRAND LOGO + HORIZONTAL DATE PICKER SCROLL
             ======================================================== */}
          <View style={styles.headerSection}>
            {/* Top Bar: Always Single Row with explicit flex-direction */}
            <View style={styles.headerRow}>
              <View style={styles.brandRow}>
                <Image
                  source={require('../../assets/images/verity_logo.jpg')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
                <View style={styles.brandTextGroup}>
                  <Text style={styles.brandTitle}>VERITY</Text>
                  <Text style={styles.brandSub}>MIND & INTENTION</Text>
                </View>
              </View>

              {/* Day Streak Badge */}
              <View style={styles.streakBadge}>
                <Sparkles size={13} color={PALETTE.bronze.base} />
                <Text style={styles.streakText}>Day 12</Text>
              </View>
            </View>

            {/* Date Header: Month and Today indicator */}
            <View style={styles.monthHeaderRow}>
              <Text style={styles.monthLabel}>NOVEMBER 2026</Text>
              <Text style={styles.todayIndicator}>Today • Wed 10</Text>
            </View>

            {/* Horizontal Date Picker Strip */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dateScrollContainer}
            >
              {weekDays.map((item, idx) => {
                const isSelected = selectedDayIndex === idx;

                return (
                  <Pressable
                    key={item.fullDate}
                    onPress={() => handleSelectDay(idx)}
                    style={[
                      styles.datePill,
                      isSelected && styles.datePillActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dateDayName,
                        isSelected && styles.dateDayNameActive,
                      ]}
                    >
                      {item.dayName}
                    </Text>
                    <View
                      style={[
                        styles.dateNumberCircle,
                        isSelected && styles.dateNumberCircleActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dateNumberText,
                          isSelected && styles.dateNumberTextActive,
                        ]}
                      >
                        {item.dayNumber}
                      </Text>
                    </View>
                    {item.isToday && (
                      <View
                        style={[
                          styles.todayDot,
                          isSelected && { backgroundColor: PALETTE.bronze.base },
                        ]}
                      />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Interactive Daily Audio Practice Banner */}
            <Pressable
              onPress={() => {
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                setAudioModalVisible(true);
              }}
              style={styles.audioPracticeBanner}
            >
              <View style={styles.audioBannerLeft}>
                <View style={styles.audioPlayCircle}>
                  <Play size={12} color="#FFFFFF" fill="#FFFFFF" style={{ marginLeft: 2 }} />
                </View>
                <View style={styles.audioBannerTextGroup}>
                  <Text style={styles.audioBannerTitle}>Today’s Audio Practice</Text>
                  <Text style={styles.audioBannerSub}>3 min guided • Rooted Presence</Text>
                </View>
              </View>
              <View style={styles.listenPill}>
                <Text style={styles.listenPillText}>Listen</Text>
              </View>
            </Pressable>
          </View>

          {/* ========================================================
              2. CARD CONTAINER: SOFT DAILY REFLECTION CARD
             ======================================================== */}
          <View style={styles.cardContainer}>
            {/* Card Header & Category Badge */}
            <View style={styles.cardHeaderRow}>
              <View style={styles.categoryLeftGroup}>
                <View style={styles.categoryIconCircle}>
                  <Feather size={13} color={PALETTE.bronze.rich} />
                </View>
                <Text style={styles.sectionHeaderBadge}>DAILY REFLECTION</Text>
              </View>

              <View style={styles.timePromptGroup}>
                <Clock size={12} color={PALETTE.ink.subtle} />
                <Text style={styles.timePrompt}>Evening Anchor</Text>
              </View>
            </View>

            {/* Reflection Prompt Text */}
            <View style={styles.promptSection}>
              <Text style={styles.promptHeadline}>
                “Look back at the last 24 hours. Where did you choose truth or a deeper path...?”
              </Text>
              <Text style={styles.promptSubtext}>
                Notice the quiet moments when you honored your values rather than acting out of fear, habit, or pleasing others.
              </Text>
            </View>

            {/* Multi-line TextInput Box */}
            <View
              style={[
                styles.inputWrapper,
                isFocused && styles.inputWrapperFocused,
              ]}
            >
              <TextInput
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholder="Share your thoughts here..."
                placeholderTextColor={PALETTE.ink.subtle}
                value={reflectionText}
                onChangeText={setReflectionText}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                style={styles.textInput}
              />

              <View style={styles.inputFooterRow}>
                <Text style={styles.charCountText}>
                  {reflectionText.length > 0
                    ? `${reflectionText.length} characters written`
                    : 'Encrypted & stored privately on your device'}
                </Text>
                {reflectionText.length > 0 && (
                  <Text style={styles.autoSavedText}>Draft saved</Text>
                )}
              </View>
            </View>

            {/* ========================================================
                3. SECONDARY TAG BUTTONS: PROSECCO & FOGGY LOVE
               ======================================================== */}
            <View style={styles.tagsSection}>
              <Text style={styles.tagsLabel}>ANCHOR THEMES:</Text>

              {/* Tag Chips wrap horizontally with explicit chip layout */}
              <View style={styles.tagsContainer}>
                {DEFAULT_TAGS.map((tag) => {
                  const isSelected = selectedTagIds.includes(tag.id);
                  const isProsecco = tag.palette === 'prosecco';

                  const bgStyle = isSelected
                    ? isProsecco
                      ? { backgroundColor: PALETTE.prosecco.base, borderColor: PALETTE.prosecco.dark }
                      : { backgroundColor: PALETTE.foggyLove.base, borderColor: PALETTE.foggyLove.dark }
                    : isProsecco
                    ? { backgroundColor: PALETTE.prosecco.light, borderColor: PALETTE.prosecco.border }
                    : { backgroundColor: PALETTE.foggyLove.light, borderColor: PALETTE.foggyLove.border };

                  const textStyle = isSelected
                    ? { color: PALETTE.ink.charcoal, fontFamily: FONTS.sansSemiBold }
                    : { color: PALETTE.ink.body, fontFamily: FONTS.sansMedium };

                  return (
                    <Pressable
                      key={tag.id}
                      onPress={() => handleToggleTag(tag.id)}
                      style={[styles.tagButton, bgStyle]}
                    >
                      <Text style={[styles.tagButtonText, textStyle]}>
                        {tag.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* ========================================================
                ACTION BUTTON: PRIMARY "SAVE REFLECTION" IN POLAR OPPOSITE
               ======================================================== */}
            <Pressable
              onPress={handleSave}
              style={[
                styles.primaryButton,
                isSaved && styles.primaryButtonSaved,
              ]}
              android_ripple={{ color: PALETTE.polarOpposite.dark }}
            >
              <View style={styles.primaryButtonContent}>
                {isSaved ? (
                  <>
                    <Check size={18} color="#FFFFFF" strokeWidth={2.5} />
                    <Text style={styles.primaryButtonTextSaved}>
                      Reflection Saved to Verity
                    </Text>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} color={PALETTE.bronze.base} strokeWidth={2} />
                    <Text style={styles.primaryButtonText}>
                      Save Reflection
                    </Text>
                  </>
                )}
              </View>
            </Pressable>
          </View>

          {/* Inspirational Footer Quote */}
          <View style={styles.quoteFooter}>
            <Text style={styles.closingQuote}>
              “Truth is not an arrival, but the quiet courage to see yourself clearly, again and again.”
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Standalone Bottom Bar (if showBottomNav is true) */}
      {showBottomNav && (
        <View style={styles.bottomBarContainer}>
          <View style={styles.bottomBarInner}>
            <Pressable style={styles.tabItem} onPress={() => handleTabPress('today')}>
              <View style={[styles.tabIconWrapper, activeTab === 'today' && styles.tabIconWrapperActive]}>
                <Sparkles size={19} color={activeTab === 'today' ? PALETTE.bronze.base : PALETTE.ink.subtle} strokeWidth={activeTab === 'today' ? 2.3 : 1.7} />
              </View>
              <Text style={[styles.tabLabel, activeTab === 'today' && styles.tabLabelActive]}>Today</Text>
            </Pressable>

            <Pressable style={styles.tabItem} onPress={() => handleTabPress('history')}>
              <View style={[styles.tabIconWrapper, activeTab === 'history' && styles.tabIconWrapperActive]}>
                <BookOpen size={19} color={activeTab === 'history' ? PALETTE.bronze.base : PALETTE.ink.subtle} strokeWidth={activeTab === 'history' ? 2.3 : 1.7} />
              </View>
              <Text style={[styles.tabLabel, activeTab === 'history' && styles.tabLabelActive]}>History</Text>
            </Pressable>

            <Pressable style={styles.tabItem} onPress={() => handleTabPress('insights')}>
              <View style={[styles.tabIconWrapper, activeTab === 'insights' && styles.tabIconWrapperActive]}>
                <BarChart3 size={19} color={activeTab === 'insights' ? PALETTE.bronze.base : PALETTE.ink.subtle} strokeWidth={activeTab === 'insights' ? 2.3 : 1.7} />
              </View>
              <Text style={[styles.tabLabel, activeTab === 'insights' && styles.tabLabelActive]}>Insights</Text>
            </Pressable>

            <Pressable style={styles.tabItem} onPress={() => handleTabPress('profile')}>
              <View style={[styles.tabIconWrapper, activeTab === 'profile' && styles.tabIconWrapperActive]}>
                <User size={19} color={activeTab === 'profile' ? PALETTE.bronze.base : PALETTE.ink.subtle} strokeWidth={activeTab === 'profile' ? 2.3 : 1.7} />
              </View>
              <Text style={[styles.tabLabel, activeTab === 'profile' && styles.tabLabelActive]}>Profile</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Interactive Mobile Audio Player Modal */}
      <AudioPlayerModal
        visible={audioModalVisible}
        onClose={() => setAudioModalVisible(false)}
        title="Rooted Presence & Inner Stillness"
        category="Quiet Confidence"
        durationSeconds={180}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PALETTE.paper.linen,
  },
  container: {
    flex: 1,
  },
  headerSection: {
    paddingTop: Platform.OS === 'web' ? 18 : 8,
    paddingHorizontal: 18,
    paddingBottom: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: 4,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: PALETTE.bronze.border,
  },
  brandTextGroup: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  brandTitle: {
    fontFamily: FONTS.serifBold,
    fontSize: 20,
    color: PALETTE.ink.charcoal,
    letterSpacing: 2.5,
  },
  brandSub: {
    fontFamily: FONTS.sansMedium,
    fontSize: 9,
    color: PALETTE.bronze.base,
    letterSpacing: 1.5,
    marginTop: 1,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: PALETTE.prosecco.light,
    borderColor: PALETTE.prosecco.border,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  streakText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 12,
    color: PALETTE.bronze.base,
  },
  monthHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 14,
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  monthLabel: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 11,
    color: PALETTE.ink.muted,
    letterSpacing: 0.8,
  },
  todayIndicator: {
    fontFamily: FONTS.serifItalic,
    fontSize: 12,
    color: PALETTE.bronze.base,
  },
  dateScrollContainer: {
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  datePill: {
    width: 44,
    paddingVertical: 7,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.1)',
  },
  datePillActive: {
    backgroundColor: PALETTE.prosecco.base,
    borderColor: PALETTE.bronze.base,
    shadowColor: PALETTE.bronze.base,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  dateDayName: {
    fontFamily: FONTS.sansMedium,
    fontSize: 9,
    color: PALETTE.ink.muted,
    letterSpacing: 0.5,
  },
  dateDayNameActive: {
    fontFamily: FONTS.sansSemiBold,
    color: PALETTE.bronze.deep,
  },
  dateNumberCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  dateNumberCircleActive: {
    backgroundColor: '#FFFFFF',
  },
  dateNumberText: {
    fontFamily: FONTS.serifBold,
    fontSize: 13,
    color: PALETTE.ink.charcoal,
  },
  dateNumberTextActive: {
    color: PALETTE.bronze.rich,
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: PALETTE.deltaMint.dark,
    marginTop: 3,
  },
  audioPracticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.12)',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 12,
    shadowColor: '#7A5230',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  audioBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  audioPlayCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: PALETTE.bronze.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioBannerTextGroup: {
    flexDirection: 'column',
  },
  audioBannerTitle: {
    fontFamily: FONTS.serifSemiBold,
    fontSize: 13,
    color: PALETTE.ink.charcoal,
  },
  audioBannerSub: {
    fontFamily: FONTS.sans,
    fontSize: 10,
    color: PALETTE.ink.muted,
    marginTop: 1,
  },
  listenPill: {
    backgroundColor: PALETTE.prosecco.light,
    borderWidth: 1,
    borderColor: PALETTE.prosecco.border,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  listenPillText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 11,
    color: PALETTE.bronze.base,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.12)',
    shadowColor: '#7A5230',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 3,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  categoryLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: PALETTE.deltaMint.light,
    borderColor: PALETTE.deltaMint.border,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderBadge: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 10,
    color: PALETTE.bronze.base,
    letterSpacing: 1,
  },
  timePromptGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timePrompt: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: PALETTE.ink.muted,
  },
  promptSection: {
    marginBottom: 14,
  },
  promptHeadline: {
    fontFamily: FONTS.serif,
    fontSize: 18,
    lineHeight: 26,
    color: PALETTE.ink.charcoal,
    letterSpacing: 0.2,
  },
  promptSubtext: {
    fontFamily: FONTS.serifItalic,
    fontSize: 12,
    lineHeight: 18,
    color: PALETTE.ink.muted,
    marginTop: 4,
  },
  inputWrapper: {
    borderRadius: 16,
    backgroundColor: PALETTE.paper.linen,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.12)',
    padding: 12,
  },
  inputWrapperFocused: {
    backgroundColor: '#FFFFFF',
    borderColor: PALETTE.bronze.base,
  },
  textInput: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    lineHeight: 20,
    color: PALETTE.ink.charcoal,
    minHeight: 70,
  },
  inputFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingTop: 6,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(122, 82, 48, 0.08)',
  },
  charCountText: {
    fontFamily: FONTS.sans,
    fontSize: 10,
    color: PALETTE.ink.muted,
  },
  autoSavedText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 10,
    color: PALETTE.bronze.base,
  },
  tagsSection: {
    marginTop: 14,
  },
  tagsLabel: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 10,
    color: PALETTE.ink.muted,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
    width: '100%',
  },
  tagButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
  },
  tagButtonText: {
    fontSize: 11,
    letterSpacing: 0.2,
  },
  primaryButton: {
    backgroundColor: PALETTE.polarOpposite.base,
    borderRadius: 9999,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: PALETTE.polarOpposite.border,
    marginTop: 16,
    shadowColor: PALETTE.polarOpposite.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  primaryButtonSaved: {
    backgroundColor: PALETTE.deltaMint.dark,
    borderColor: PALETTE.deltaMint.dark,
  },
  primaryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 14,
    color: PALETTE.ink.charcoal,
    letterSpacing: 0.4,
  },
  primaryButtonTextSaved: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  quoteFooter: {
    paddingHorizontal: 28,
    marginTop: 18,
    alignItems: 'center',
  },
  closingQuote: {
    fontFamily: FONTS.serifItalic,
    fontSize: 11,
    lineHeight: 18,
    color: PALETTE.ink.muted,
    textAlign: 'center',
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(250, 248, 245, 0.98)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(122, 82, 48, 0.12)',
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    paddingTop: 8,
  },
  bottomBarInner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabIconWrapper: {
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 14,
    marginBottom: 2,
  },
  tabIconWrapperActive: {
    backgroundColor: PALETTE.prosecco.light,
  },
  tabLabel: {
    fontFamily: FONTS.sansMedium,
    fontSize: 10,
    color: PALETTE.ink.subtle,
  },
  tabLabelActive: {
    fontFamily: FONTS.sansSemiBold,
    color: PALETTE.bronze.base,
  },
});
