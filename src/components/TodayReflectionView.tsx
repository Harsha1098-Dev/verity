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
  Heart,
  Clock,
  Compass,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { PALETTE, FONTS } from '@/constants/theme';
import { AudioPlayerModal } from './AudioPlayerModal';
import { Play } from 'lucide-react-native';

export interface TodayReflectionViewProps {
  onSave?: (reflection: { text: string; tags: string[]; date: string }) => void;
  onNavigateTab?: (tab: 'today' | 'history' | 'insights' | 'profile') => void;
  initialText?: string;
  activeTab?: 'today' | 'history' | 'insights' | 'profile';
  showBottomNav?: boolean;
}

interface DayItem {
  dayName: string; // 'M', 'T', 'W' etc.
  dayNumber: number; // 9, 10, 11
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
  showBottomNav = true,
}) => {
  const [reflectionText, setReflectionText] = useState<string>(initialText);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(2); // Today (Wednesday)
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(['1', '2']);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [audioModalVisible, setAudioModalVisible] = useState<boolean>(false);

  // 7-day rolling calendar strip (centred around today)
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

    // Reset saved state confirmation after 3 seconds
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
    <SafeAreaView
      edges={['top']}
      className="flex-1 bg-linen-100"
      style={{ backgroundColor: PALETTE.paper.linen }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: showBottomNav ? 100 : 32 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ========================================================
              1. HEADER: BRAND LOGO + HORIZONTAL DATE PICKER SCROLL
             ======================================================== */}
          <View className="pt-2 pb-4 px-5">
            {/* Top Bar: Emblem & VERITY Title */}
            <View className="flex-row items-center justify-between pb-3">
              <View className="flex-row items-center space-x-3 gap-3">
                <Image
                  source={require('../../assets/images/verity_logo.jpg')}
                  className="w-9 h-9 rounded-full border border-bronze/20"
                  style={styles.logoImage}
                  resizeMode="contain"
                />
                <View>
                  <Text
                    className="text-charcoal text-xl tracking-[3px] font-serif-bold"
                    style={styles.brandTitle}
                  >
                    VERITY
                  </Text>
                  <Text
                    className="text-bronze text-[9px] tracking-[1.5px] font-sans-medium"
                    style={styles.brandSub}
                  >
                    MIND & INTENTION
                  </Text>
                </View>
              </View>

              {/* Status / Streak Badge */}
              <View
                className="flex-row items-center px-3 py-1.5 rounded-full border border-prosecco-border bg-prosecco-light"
                style={styles.streakBadge}
              >
                <Sparkles size={13} color={PALETTE.bronze.base} />
                <Text
                  className="ml-1.5 text-xs text-bronze font-sans-semibold tracking-wide"
                  style={styles.streakText}
                >
                  Day 12
                </Text>
              </View>
            </View>

            {/* Horizontal Date Picker Strip */}
            <View className="mt-2">
              <View className="flex-row justify-between items-center mb-2 px-1">
                <Text
                  className="text-xs text-charcoal-muted font-sans-medium tracking-wide uppercase"
                  style={styles.monthLabel}
                >
                  November 2026
                </Text>
                <Text
                  className="text-[11px] text-bronze font-serif-italic"
                  style={styles.todayIndicator}
                >
                  Today • Wed 10
                </Text>
              </View>

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
            </View>

            {/* Interactive Mobile Daily Audio Practice Banner */}
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
                <View>
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
          <View className="px-5 mt-2">
            <View
              className="bg-white rounded-3xl p-6 border border-bronze/15 shadow-sm"
              style={styles.reflectionCard}
            >
              {/* Card Header & Category Badge */}
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center space-x-2 gap-2">
                  <View
                    className="w-7 h-7 rounded-full items-center justify-center bg-deltaMint-light border border-deltaMint-border"
                    style={styles.categoryIconCircle}
                  >
                    <Feather size={14} color={PALETTE.bronze.rich} />
                  </View>
                  <Text
                    className="text-xs font-sans-semibold tracking-[1px] text-bronze uppercase"
                    style={styles.sectionHeaderBadge}
                  >
                    Daily Reflection
                  </Text>
                </View>

                {/* Gentle prompt timestamp */}
                <View className="flex-row items-center gap-1">
                  <Clock size={12} color={PALETTE.ink.subtle} />
                  <Text
                    className="text-[11px] text-charcoal-muted font-sans"
                    style={styles.timePrompt}
                  >
                    Evening Anchor
                  </Text>
                </View>
              </View>

              {/* Reflection Prompt Text */}
              <View className="mb-5">
                <Text
                  className="text-2xl font-serif leading-8 text-charcoal tracking-normal"
                  style={styles.promptHeadline}
                >
                  “Look back at the last 24 hours. Where did you choose truth or
                  a deeper path...?”
                </Text>
                <Text
                  className="text-xs font-serif-italic text-charcoal-muted mt-2 leading-relaxed"
                  style={styles.promptSubtext}
                >
                  Notice the quiet moments when you honored your values rather than
                  acting out of fear, habit, or pleasing others.
                </Text>
              </View>

              {/* Multi-line TextInput Container */}
              <View
                className={`bg-linen-50 rounded-2xl p-4 border ${
                  isFocused ? 'border-bronze bg-white' : 'border-bronze/15'
                }`}
                style={[
                  styles.inputWrapper,
                  isFocused && styles.inputWrapperFocused,
                ]}
              >
                <TextInput
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                  placeholder="Share your thoughts here..."
                  placeholderTextColor={PALETTE.ink.subtle}
                  value={reflectionText}
                  onChangeText={setReflectionText}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  style={styles.textInput}
                />

                {/* Character count & subtle status */}
                <View className="flex-row justify-between items-center pt-2 mt-2 border-t border-bronze/10">
                  <Text
                    className="text-[10px] text-charcoal-muted font-sans"
                    style={styles.charCountText}
                  >
                    {reflectionText.length > 0
                      ? `${reflectionText.length} characters written`
                      : 'Encrypted & stored privately on your device'}
                  </Text>
                  {reflectionText.length > 0 && (
                    <Text
                      className="text-[10px] text-bronze font-sans-medium"
                      style={styles.autoSavedText}
                    >
                      Draft saved
                    </Text>
                  )}
                </View>
              </View>

              {/* ========================================================
                  3. SECONDARY TAG BUTTONS: PROSECCO & FOGGY LOVE
                 ======================================================== */}
              <View className="mt-5">
                <Text
                  className="text-xs font-sans-medium text-charcoal-muted mb-2 tracking-wide uppercase"
                  style={styles.tagsLabel}
                >
                  Anchor Themes:
                </Text>

                <View className="flex-row flex-wrap gap-2">
                  {DEFAULT_TAGS.map((tag) => {
                    const isSelected = selectedTagIds.includes(tag.id);
                    const isProsecco = tag.palette === 'prosecco';

                    // Prosecco theme vs FoggyLove theme styling
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
              <View className="mt-6">
                <Pressable
                  onPress={handleSave}
                  style={[
                    styles.primaryButton,
                    isSaved && styles.primaryButtonSaved,
                  ]}
                  android_ripple={{ color: PALETTE.polarOpposite.dark }}
                >
                  <View className="flex-row items-center justify-center space-x-2 gap-2">
                    {isSaved ? (
                      <>
                        <Check size={18} color="#FFFFFF" strokeWidth={2.5} />
                        <Text style={styles.primaryButtonTextSaved}>
                          Reflection Saved to Verity
                        </Text>
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} color="#FFFFFF" strokeWidth={2} />
                        <Text style={styles.primaryButtonText}>
                          Save Reflection
                        </Text>
                      </>
                    )}
                  </View>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Inspirational Quote Footer */}
          <View className="px-7 mt-6 items-center">
            <Text
              className="text-center text-xs font-serif-italic text-charcoal-muted leading-relaxed"
              style={styles.closingQuote}
            >
              “Truth is not an arrival, but the quiet courage to see yourself
              clearly, again and again.”
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ========================================================
          4. BOTTOM NAVIGATION BAR: FIXED ICONS
         ======================================================== */}
      {showBottomNav && (
        <View style={styles.bottomBarContainer}>
          <View style={styles.bottomBarInner}>
            {/* Tab 1: Today */}
            <Pressable
              style={styles.tabItem}
              onPress={() => handleTabPress('today')}
            >
              <View
                style={[
                  styles.tabIconWrapper,
                  activeTab === 'today' && styles.tabIconWrapperActive,
                ]}
              >
                <Sparkles
                  size={20}
                  color={
                    activeTab === 'today'
                      ? PALETTE.bronze.base
                      : PALETTE.ink.subtle
                  }
                  strokeWidth={activeTab === 'today' ? 2.3 : 1.7}
                />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === 'today' && styles.tabLabelActive,
                ]}
              >
                Today
              </Text>
            </Pressable>

            {/* Tab 2: History */}
            <Pressable
              style={styles.tabItem}
              onPress={() => handleTabPress('history')}
            >
              <View
                style={[
                  styles.tabIconWrapper,
                  activeTab === 'history' && styles.tabIconWrapperActive,
                ]}
              >
                <BookOpen
                  size={20}
                  color={
                    activeTab === 'history'
                      ? PALETTE.bronze.base
                      : PALETTE.ink.subtle
                  }
                  strokeWidth={activeTab === 'history' ? 2.3 : 1.7}
                />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === 'history' && styles.tabLabelActive,
                ]}
              >
                History
              </Text>
            </Pressable>

            {/* Tab 3: Insights */}
            <Pressable
              style={styles.tabItem}
              onPress={() => handleTabPress('insights')}
            >
              <View
                style={[
                  styles.tabIconWrapper,
                  activeTab === 'insights' && styles.tabIconWrapperActive,
                ]}
              >
                <BarChart3
                  size={20}
                  color={
                    activeTab === 'insights'
                      ? PALETTE.bronze.base
                      : PALETTE.ink.subtle
                  }
                  strokeWidth={activeTab === 'insights' ? 2.3 : 1.7}
                />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === 'insights' && styles.tabLabelActive,
                ]}
              >
                Insights
              </Text>
            </Pressable>

            {/* Tab 4: Profile */}
            <Pressable
              style={styles.tabItem}
              onPress={() => handleTabPress('profile')}
            >
              <View
                style={[
                  styles.tabIconWrapper,
                  activeTab === 'profile' && styles.tabIconWrapperActive,
                ]}
              >
                <User
                  size={20}
                  color={
                    activeTab === 'profile'
                      ? PALETTE.bronze.base
                      : PALETTE.ink.subtle
                  }
                  strokeWidth={activeTab === 'profile' ? 2.3 : 1.7}
                />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === 'profile' && styles.tabLabelActive,
                ]}
              >
                Profile
              </Text>
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
  logoImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: PALETTE.bronze.border,
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
    backgroundColor: PALETTE.prosecco.light,
    borderColor: PALETTE.prosecco.border,
  },
  streakText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 12,
    color: PALETTE.bronze.base,
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
    gap: 8,
  },
  datePill: {
    width: 48,
    paddingVertical: 8,
    borderRadius: 24,
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
    fontSize: 10,
    color: PALETTE.ink.muted,
    letterSpacing: 0.5,
  },
  dateDayNameActive: {
    fontFamily: FONTS.sansSemiBold,
    color: PALETTE.bronze.deep,
  },
  dateNumberCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  dateNumberCircleActive: {
    backgroundColor: '#FFFFFF',
  },
  dateNumberText: {
    fontFamily: FONTS.serifBold,
    fontSize: 14,
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
    marginTop: 4,
  },
  reflectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.12)',
    shadowColor: '#7A5230',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 3,
  },
  categoryIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: PALETTE.deltaMint.light,
    borderColor: PALETTE.deltaMint.border,
  },
  sectionHeaderBadge: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 11,
    color: PALETTE.bronze.base,
    letterSpacing: 1,
  },
  timePrompt: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: PALETTE.ink.muted,
  },
  promptHeadline: {
    fontFamily: FONTS.serif,
    fontSize: 21,
    lineHeight: 30,
    color: PALETTE.ink.charcoal,
    letterSpacing: 0.2,
  },
  promptSubtext: {
    fontFamily: FONTS.serifItalic,
    fontSize: 13,
    lineHeight: 20,
    color: PALETTE.ink.muted,
  },
  inputWrapper: {
    borderRadius: 18,
    minHeight: 140,
    backgroundColor: PALETTE.paper.linen,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.12)',
  },
  inputWrapperFocused: {
    backgroundColor: '#FFFFFF',
    borderColor: PALETTE.bronze.base,
  },
  textInput: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    lineHeight: 22,
    color: PALETTE.ink.charcoal,
    minHeight: 90,
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
  tagsLabel: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 11,
    color: PALETTE.ink.muted,
    letterSpacing: 0.8,
  },
  tagButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
  },
  tagButtonText: {
    fontSize: 11,
    letterSpacing: 0.3,
  },
  primaryButton: {
    backgroundColor: PALETTE.polarOpposite.base,
    borderRadius: 9999,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PALETTE.polarOpposite.dark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: PALETTE.polarOpposite.border,
  },
  primaryButtonSaved: {
    backgroundColor: PALETTE.deltaMint.dark,
    borderColor: PALETTE.deltaMint.dark,
  },
  primaryButtonText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 14,
    color: PALETTE.ink.charcoal,
    letterSpacing: 0.5,
  },
  primaryButtonTextSaved: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  closingQuote: {
    fontFamily: FONTS.serifItalic,
    fontSize: 12,
    color: PALETTE.ink.muted,
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
    shadowColor: '#7A5230',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
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
    paddingVertical: 2,
    flex: 1,
  },
  tabIconWrapper: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 2,
  },
  tabIconWrapperActive: {
    backgroundColor: PALETTE.prosecco.light,
  },
  tabLabel: {
    fontFamily: FONTS.sansMedium,
    fontSize: 10,
    color: PALETTE.ink.subtle,
    letterSpacing: 0.3,
  },
  tabLabelActive: {
    fontFamily: FONTS.sansSemiBold,
    color: PALETTE.bronze.base,
  },
  audioPracticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.12)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 10,
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
});
