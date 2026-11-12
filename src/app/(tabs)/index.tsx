import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  Sparkles,
  Zap,
  Flame,
  Heart,
  Play,
  Share2,
  Clock,
  ArrowRight,
  Sun,
  Moon,
  Compass,
  Sliders,
  ChevronRight,
  BookMarked,
  Shield,
  Layers,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { PALETTE, FONTS } from '@/constants/theme';
import {
  UserPortalProfile,
  AffirmationItem,
} from '@/types/portal';
import {
  getNextPortalCountdown,
  generateDynamicAffirmation,
  NextPortalResult,
} from '@/utils/portalEngine';
import {
  loadPortalProfile,
  savePortalProfile,
  subscribeToProfile,
  DEFAULT_PORTAL_PROFILE,
  loadAchievements,
} from '@/utils/portalStore';
import { AudioPlayerModal } from '@/components/AudioPlayerModal';
import { PortalOnboardingModal } from '@/components/PortalOnboardingModal';
import { WelcomeAuthModal } from '@/components/WelcomeAuthModal';

export default function HomeScreen() {
  const [profile, setProfile] = useState<UserPortalProfile>(DEFAULT_PORTAL_PROFILE);
  const [countdown, setCountdown] = useState<NextPortalResult>(() =>
    getNextPortalCountdown(DEFAULT_PORTAL_PROFILE.portalTimes)
  );
  const [todayAffirmation, setTodayAffirmation] = useState<AffirmationItem>(() =>
    generateDynamicAffirmation(DEFAULT_PORTAL_PROFILE, 'Wealth', '11:11')
  );

  const [audioModalVisible, setAudioModalVisible] = useState(false);
  const [onboardingModalVisible, setOnboardingModalVisible] = useState(false);
  const [welcomeModalVisible, setWelcomeModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const p = await loadPortalProfile();
      setProfile(p);
      setCountdown(getNextPortalCountdown(p.portalTimes));
      setTodayAffirmation(
        generateDynamicAffirmation(p, p.goal === 'Career Success' ? 'Career' : 'Wealth', '11:11')
      );
    })();

    const unsubscribe = subscribeToProfile((updated) => {
      setProfile(updated);
      setCountdown(getNextPortalCountdown(updated.portalTimes));
      setTodayAffirmation(
        generateDynamicAffirmation(
          updated,
          updated.goal === 'Career Success' ? 'Career' : 'Wealth',
          '11:11'
        )
      );
    });
    return unsubscribe;
  }, []);

  // Live Portal Seconds Ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getNextPortalCountdown(profile.portalTimes));
    }, 1000);
    return () => clearInterval(timer);
  }, [profile.portalTimes]);

  const triggerHaptic = (type: 'light' | 'medium' = 'light') => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(
        type === 'medium'
          ? Haptics.ImpactFeedbackStyle.Medium
          : Haptics.ImpactFeedbackStyle.Light
      );
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ========================================================
            TOP BAR: LOGO + PORTAL BRANDING + TUNE PROFILE
           ======================================================== */}
        <View style={styles.topBar}>
          <View style={styles.brandGroup}>
            <View style={styles.logoRing}>
              <Image
                source={require('../../../assets/images/verity_logo.jpg')}
                style={styles.logoImage}
                resizeMode="cover"
              />
            </View>
            <View>
              <Text style={styles.brandTitle}>PORTAL 11:11</Text>
              <Text style={styles.brandSubtitle}>
                AI MANIFESTATION ENGINE
              </Text>
            </View>
          </View>

          <View style={styles.topActionsRow}>
            <Pressable
              onPress={() => {
                triggerHaptic('light');
                setOnboardingModalVisible(true);
              }}
              style={styles.tunePill}
            >
              <Sliders size={12} color={PALETTE.bronze.base} />
              <Text style={styles.tunePillText}>Tune</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                triggerHaptic('light');
                setWelcomeModalVisible(true);
              }}
              style={styles.authBadgePill}
            >
              <Text style={styles.authBadgeText}>{profile.name[0]}</Text>
            </Pressable>
          </View>
        </View>

        {/* ========================================================
            NEXT PORTAL COUNTDOWN BANNER (LIVE TICKER)
           ======================================================== */}
        <Pressable
          onPress={() => setOnboardingModalVisible(true)}
          style={[
            styles.portalCountdownBar,
            countdown.isPortalActive && styles.portalCountdownBarActive,
          ]}
        >
          <View style={styles.portalBarLeft}>
            <View
              style={[
                styles.portalIconCircle,
                countdown.isPortalActive && styles.portalIconCircleActive,
              ]}
            >
              <Zap
                size={14}
                color={countdown.isPortalActive ? '#FFFFFF' : PALETTE.bronze.base}
              />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.portalTitleRow}>
                <Text style={styles.portalNextLabel}>
                  {countdown.isPortalActive
                    ? `✨ ${countdown.targetPortalTime} PORTAL ACTIVE NOW`
                    : `NEXT PORTAL • ${countdown.targetPortalTime}`}
                </Text>
                <View style={styles.keyTag}>
                  <Text style={styles.keyTagText}>{countdown.portalKey}</Text>
                </View>
              </View>
              <Text style={styles.portalSubText}>{countdown.portalTheme}</Text>
            </View>
          </View>

          <View style={styles.countdownPill}>
            <Text
              style={[
                styles.countdownDigits,
                countdown.isPortalActive && styles.countdownDigitsActive,
              ]}
            >
              {countdown.formattedCountdown}
            </Text>
          </View>
        </Pressable>

        {/* ========================================================
            TODAY'S AFFIRMATION GLASS CARD (HERO)
           ======================================================== */}
        <LinearGradient
          colors={[PALETTE.prosecco.light, '#FFFFFF', PALETTE.paper.linen]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGlassCard}
        >
          <View style={styles.heroHeader}>
            <View style={styles.heroHeaderLeft}>
              <Sparkles size={13} color={PALETTE.bronze.base} />
              <Text style={styles.heroHeaderTag}>
                TODAY'S PORTAL TRANSMISSION • {todayAffirmation.portalTime || '11:11'}
              </Text>
            </View>
            <View style={styles.heroCategoryBadge}>
              <Text style={styles.heroCategoryText}>
                {todayAffirmation.category}
              </Text>
            </View>
          </View>

          <Text style={styles.heroAffirmationText}>
            “{todayAffirmation.text}”
          </Text>

          <Text style={styles.heroNoteText}>
            {todayAffirmation.authorNote}
          </Text>

          {/* Action Row */}
          <View style={styles.heroActionsRow}>
            <Pressable
              onPress={() => {
                triggerHaptic('medium');
                setAudioModalVisible(true);
              }}
              style={styles.heroActionBtn}
            >
              <Play size={12} color="#FFFFFF" fill="#FFFFFF" />
              <Text style={styles.heroActionBtnText}>Listen Voice</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                triggerHaptic('light');
                router.push('/(tabs)/affirmations');
              }}
              style={styles.heroSecondaryActionBtn}
            >
              <Layers size={13} color={PALETTE.bronze.base} />
              <Text style={styles.heroSecondaryActionBtnText}>
                Open Portal Feed
              </Text>
            </Pressable>
          </View>
        </LinearGradient>

        {/* ========================================================
            STREAK, GRATITUDE & MANIFESTATION STATS
           ======================================================== */}
        <View style={styles.statsRow}>
          {/* Current Streak */}
          <View style={styles.statCard}>
            <View style={styles.statCardTop}>
              <Flame size={15} color="#F59E0B" />
              <Text style={styles.statCardValue}>{profile.streakDays}d</Text>
            </View>
            <Text style={styles.statCardLabel}>Active Streak</Text>
            <Text style={styles.statCardSub}>Level 1 Aligned</Text>
          </View>

          {/* Gratitude Counter */}
          <View style={styles.statCard}>
            <View style={styles.statCardTop}>
              <Heart size={15} color="#EC4899" />
              <Text style={styles.statCardValue}>{profile.gratitudeCount}</Text>
            </View>
            <Text style={styles.statCardLabel}>Gratitudes</Text>
            <Text style={styles.statCardSub}>Miracles Anchored</Text>
          </View>

          {/* Manifestation Progress */}
          <View style={styles.statCard}>
            <View style={styles.statCardTop}>
              <Zap size={15} color={PALETTE.gold.base} />
              <Text style={styles.statCardValue}>
                {profile.manifestationProgress}%
              </Text>
            </View>
            <Text style={styles.statCardLabel}>Alignment</Text>
            <Text style={styles.statCardSub}>In Cosmic Flow</Text>
          </View>
        </View>

        {/* ========================================================
            3-PART DAILY ALIGNMENT SCHEDULE
           ======================================================== */}
        <View style={styles.scheduleSection}>
          <Text style={styles.sectionTitle}>DAILY SACRED ANCHORS</Text>

          <View style={styles.scheduleList}>
            {/* Morning Alignment */}
            <Pressable
              onPress={() => {
                triggerHaptic('light');
                router.push('/(tabs)/affirmations');
              }}
              style={styles.scheduleItem}
            >
              <View style={styles.scheduleIconCircle}>
                <Sun size={16} color={PALETTE.gold.base} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.scheduleItemTitle}>Morning Alignment</Text>
                <Text style={styles.scheduleItemSub}>
                  Awakening Sovereign Purpose & Abundance Focus
                </Text>
              </View>
              <ChevronRight size={18} color="#6B7280" />
            </Pressable>

            {/* Midday Reset */}
            <Pressable
              onPress={() => {
                triggerHaptic('light');
                router.push('/(tabs)/journal');
              }}
              style={styles.scheduleItem}
            >
              <View
                style={[
                  styles.scheduleIconCircle,
                  { backgroundColor: 'rgba(56, 189, 248, 0.15)' },
                ]}
              >
                <Compass size={16} color="#38BDF8" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.scheduleItemTitle}>Midday Reset</Text>
                <Text style={styles.scheduleItemSub}>
                  1:11 PM Portal • Dissolving Noise into Stillness
                </Text>
              </View>
              <ChevronRight size={18} color="#6B7280" />
            </Pressable>

            {/* Evening Reflection */}
            <Pressable
              onPress={() => {
                triggerHaptic('light');
                router.push('/(tabs)/journal');
              }}
              style={styles.scheduleItem}
            >
              <View
                style={[
                  styles.scheduleIconCircle,
                  { backgroundColor: 'rgba(192, 132, 252, 0.15)' },
                ]}
              >
                <Moon size={16} color="#C084FC" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.scheduleItemTitle}>Evening Reflection</Text>
                <Text style={styles.scheduleItemSub}>
                  Anchoring Miracles into the Manifestation Journal
                </Text>
              </View>
              <ChevronRight size={18} color="#6B7280" />
            </Pressable>
          </View>
        </View>

        {/* ========================================================
            FULL-SCREEN AFFIRMATIONS SHORTCUT BANNER
           ======================================================== */}
        <Pressable
          onPress={() => {
            triggerHaptic('medium');
            router.push('/(tabs)/affirmations');
          }}
          style={styles.portalReelsBanner}
        >
          <LinearGradient
            colors={[PALETTE.prosecco.light, PALETTE.paper.ivory]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.portalReelsGradient}
          >
            <View style={{ flex: 1 }}>
              <View style={styles.bannerTagRow}>
                <Sparkles size={12} color={PALETTE.bronze.base} />
                <Text style={styles.bannerTag}>IMMERSIVE FEED</Text>
              </View>
              <Text style={styles.bannerTitle}>
                Swipe Full-Screen Affirmations
              </Text>
              <Text style={styles.bannerSub}>
                Portal stream across Wealth, Love, and Sovereign Power.
              </Text>
            </View>
            <View style={styles.bannerArrowCircle}>
              <ArrowRight size={18} color="#FFFFFF" />
            </View>
          </LinearGradient>
        </Pressable>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Voice Narration Audio Player Modal */}
      <AudioPlayerModal
        visible={audioModalVisible}
        onClose={() => setAudioModalVisible(false)}
        title={`${profile.goal} Transmission`}
        category={profile.preferredVoice}
        durationSeconds={180}
      />

      {/* 15-Question Onboarding Questionnaire Modal */}
      <PortalOnboardingModal
        visible={onboardingModalVisible}
        dismissible={true}
        onClose={() => setOnboardingModalVisible(false)}
        onComplete={async (updated) => {
          setProfile(updated);
          await savePortalProfile(updated);
        }}
        currentProfile={profile}
      />

      {/* Welcome & Authentication Modal */}
      <WelcomeAuthModal
        visible={welcomeModalVisible}
        dismissible={true}
        onClose={() => setWelcomeModalVisible(false)}
        onSuccess={async (cred) => {
          setWelcomeModalVisible(false);
          const updated = await savePortalProfile({
            isAuthenticated: true,
            phoneNumber: cred.phoneNumber,
            authMethod: cred.authMethod,
            name: cred.name || profile.name,
          });
          setProfile(updated);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PALETTE.paper.linen,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'web' ? 16 : 8,
    gap: 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoRing: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: PALETTE.bronze.border,
    padding: 1.5,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  brandTitle: {
    fontFamily: FONTS.serifBold,
    fontSize: 18,
    color: PALETTE.ink.charcoal,
    letterSpacing: 2,
  },
  brandSubtitle: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 8.5,
    color: PALETTE.bronze.base,
    letterSpacing: 1.2,
  },
  topActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tunePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: PALETTE.prosecco.light,
    borderWidth: 1,
    borderColor: PALETTE.prosecco.border,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  tunePillText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 11,
    color: PALETTE.bronze.base,
  },
  authBadgePill: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: PALETTE.bronze.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authBadgeText: {
    fontFamily: FONTS.sansBold,
    fontSize: 13,
    color: '#FFFFFF',
  },
  portalCountdownBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.12)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#7A5230',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  portalCountdownBarActive: {
    backgroundColor: PALETTE.prosecco.light,
    borderColor: PALETTE.bronze.base,
  },
  portalBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  portalIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: PALETTE.prosecco.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  portalIconCircleActive: {
    backgroundColor: PALETTE.bronze.base,
  },
  portalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  portalNextLabel: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 11,
    color: PALETTE.ink.charcoal,
    letterSpacing: 0.6,
  },
  keyTag: {
    backgroundColor: PALETTE.prosecco.light,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
  },
  keyTagText: {
    fontFamily: FONTS.sansBold,
    fontSize: 9,
    color: PALETTE.bronze.rich,
  },
  portalSubText: {
    fontFamily: FONTS.sans,
    fontSize: 10,
    color: PALETTE.ink.muted,
    marginTop: 1,
  },
  countdownPill: {
    backgroundColor: PALETTE.paper.linen,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.15)',
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  countdownDigits: {
    fontFamily: FONTS.sansBold,
    fontSize: 11.5,
    color: PALETTE.bronze.base,
    letterSpacing: 0.6,
  },
  countdownDigitsActive: {
    color: PALETTE.deltaMint.dark,
  },
  heroGlassCard: {
    borderRadius: 26,
    borderWidth: 1,
    borderColor: PALETTE.bronze.border,
    padding: 20,
    shadowColor: '#7A5230',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 3,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  heroHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroHeaderTag: {
    fontFamily: FONTS.sansBold,
    fontSize: 9.5,
    color: PALETTE.bronze.base,
    letterSpacing: 1.2,
  },
  heroCategoryBadge: {
    backgroundColor: PALETTE.prosecco.light,
    borderWidth: 1,
    borderColor: PALETTE.prosecco.border,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  heroCategoryText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 9.5,
    color: PALETTE.bronze.rich,
  },
  heroAffirmationText: {
    fontFamily: FONTS.serifBold,
    fontSize: 21,
    lineHeight: 31,
    color: PALETTE.ink.charcoal,
    letterSpacing: 0.2,
  },
  heroNoteText: {
    fontFamily: FONTS.serifItalic,
    fontSize: 12,
    lineHeight: 18,
    color: PALETTE.ink.muted,
    marginTop: 12,
  },
  heroActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  heroActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: PALETTE.bronze.base,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 18,
  },
  heroActionBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 12,
    color: '#FFFFFF',
  },
  heroSecondaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: PALETTE.bronze.border,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 18,
  },
  heroSecondaryActionBtnText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 12,
    color: PALETTE.ink.charcoal,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.12)',
    padding: 12,
    shadowColor: '#7A5230',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  statCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  statCardValue: {
    fontFamily: FONTS.sansBold,
    fontSize: 15,
    color: PALETTE.ink.charcoal,
  },
  statCardLabel: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 10,
    color: PALETTE.bronze.base,
    marginTop: 2,
  },
  statCardSub: {
    fontFamily: FONTS.sans,
    fontSize: 9.5,
    color: PALETTE.ink.muted,
  },
  scheduleSection: {
    gap: 10,
  },
  sectionTitle: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 10,
    letterSpacing: 1.5,
    color: PALETTE.bronze.base,
  },
  scheduleList: {
    gap: 10,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  scheduleIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: PALETTE.prosecco.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleItemTitle: {
    fontFamily: FONTS.serifBold,
    fontSize: 14,
    color: PALETTE.ink.charcoal,
  },
  scheduleItemSub: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: PALETTE.ink.muted,
    marginTop: 2,
  },
  portalReelsBanner: {
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: PALETTE.bronze.border,
    shadowColor: '#7A5230',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  portalReelsGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
  },
  bannerTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  bannerTag: {
    fontFamily: FONTS.sansBold,
    fontSize: 9.5,
    color: PALETTE.bronze.base,
    letterSpacing: 1.2,
  },
  bannerTitle: {
    fontFamily: FONTS.serifBold,
    fontSize: 16,
    color: PALETTE.ink.charcoal,
  },
  bannerSub: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: PALETTE.ink.muted,
    marginTop: 2,
  },
  bannerArrowCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: PALETTE.bronze.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
