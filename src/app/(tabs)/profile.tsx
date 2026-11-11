import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  Switch,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Sparkles,
  Volume2,
  Clock,
  Bell,
  Vibrate,
  Shield,
  ChevronRight,
  Sliders,
  Zap,
  Target,
  Flame,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { PALETTE, FONTS, SPACING, RADII, SHADOWS } from '@/constants/theme';
import { PastelBadge } from '@/components/PastelBadge';
import { PortalOnboardingModal } from '@/components/PortalOnboardingModal';
import { loadPortalProfile, savePortalProfile, DEFAULT_PORTAL_PROFILE } from '@/utils/portalStore';
import { UserPortalProfile } from '@/types/portal';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserPortalProfile>(DEFAULT_PORTAL_PROFILE);
  const [onboardingVisible, setOnboardingVisible] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  useEffect(() => {
    (async () => {
      const p = await loadPortalProfile();
      setProfile(p);
    })();
  }, []);

  const toggleSwitch = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    val: boolean
  ) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setter(!val);
  };

  const handleProfileUpdated = async (updated: UserPortalProfile) => {
    setProfile(updated);
    await savePortalProfile(updated);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header & Logo Mark */}
        <View style={styles.profileHeader}>
          <View style={styles.logoRing}>
            <Image
              source={require('../../../assets/images/verity_logo.jpg')}
              style={styles.logoImage}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.memberName}>{profile.name}</Text>
          <Text style={styles.memberStatus}>
            PORTAL 11:11 INNER CIRCLE • {profile.energyIntention.toUpperCase()}
          </Text>

          <View style={styles.membershipPill}>
            <Sparkles size={12} color={PALETTE.bronze.base} />
            <Text style={styles.membershipPillText}>
              🔥 {profile.streakDays} Day Synchronicity Streak
            </Text>
          </View>
        </View>

        {/* 90-Day Manifestation Intention */}
        <View style={[styles.sectionCard, SHADOWS.subtle]}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>90-Day Manifestation Goal</Text>
            <PastelBadge label={profile.manifestationGoal.toUpperCase()} color="prosecco" active />
          </View>

          <Text style={styles.intentionQuote}>
            “{profile.goal90Days}”
          </Text>

          <View style={styles.intentMetaRow}>
            <Text style={styles.intentMetaText}>
              Emotional State: <Text style={{ fontFamily: FONTS.sansSemiBold }}>{profile.emotionalState}</Text> • Income Goal: <Text style={{ fontFamily: FONTS.sansSemiBold }}>{profile.incomeGoal || '₹1 Lakh/mo'}</Text>
            </Text>
          </View>

          <Pressable
            style={styles.changeIntentionBtn}
            onPress={() => {
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              setOnboardingVisible(true);
            }}
          >
            <Sliders size={13} color={PALETTE.bronze.base} />
            <Text style={styles.changeIntentionText}>Retune 15-Question Profile</Text>
          </Pressable>
        </View>

        {/* Active Portal Synchronicity Times */}
        <View style={[styles.sectionCard, SHADOWS.subtle]}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Active Portal Times</Text>
            <Zap size={14} color="#D97706" />
          </View>

          <Text style={styles.portalTimesSub}>
            Affirmations are AI-synthesized and delivered at these celestial portals:
          </Text>

          <View style={styles.portalChipsRow}>
            {profile.portalTimes.map((time) => (
              <View key={time} style={styles.portalChip}>
                <Clock size={11} color={PALETTE.bronze.rich} />
                <Text style={styles.portalChipText}>{time}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Practice Preferences */}
        <View style={[styles.sectionCard, SHADOWS.subtle]}>
          <Text style={styles.sectionTitle}>Practice & Notification Customization</Text>

          <View style={styles.settingsList}>
            {/* Preferred Voice */}
            <Pressable
              style={styles.settingItem}
              onPress={() => setOnboardingVisible(true)}
            >
              <View style={styles.settingLeft}>
                <View style={styles.iconCircle}>
                  <Volume2 size={16} color={PALETTE.bronze.base} />
                </View>
                <View>
                  <Text style={styles.settingLabel}>Narrator Voice</Text>
                  <Text style={styles.settingValue}>{profile.preferredVoice}</Text>
                </View>
              </View>
              <ChevronRight size={18} color={PALETTE.ink.subtle} />
            </Pressable>

            {/* Affirmation Style */}
            <Pressable
              style={styles.settingItem}
              onPress={() => setOnboardingVisible(true)}
            >
              <View style={styles.settingLeft}>
                <View style={styles.iconCircle}>
                  <Clock size={16} color={PALETTE.bronze.base} />
                </View>
                <View>
                  <Text style={styles.settingLabel}>Affirmation Style & Length</Text>
                  <Text style={styles.settingValue}>
                    {profile.affirmationStyle} • {profile.messageLength}
                  </Text>
                </View>
              </View>
              <ChevronRight size={18} color={PALETTE.ink.subtle} />
            </Pressable>

            {/* Portal Notifications */}
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.iconCircle}>
                  <Bell size={16} color={PALETTE.bronze.base} />
                </View>
                <View>
                  <Text style={styles.settingLabel}>Portal Synchronicity Alerts</Text>
                  <Text style={styles.settingValue}>Push at 11:11, 2:22, 5:55</Text>
                </View>
              </View>
              <Switch
                value={remindersEnabled}
                onValueChange={() =>
                  toggleSwitch(setRemindersEnabled, remindersEnabled)
                }
                trackColor={{
                  false: PALETTE.paper.linen,
                  true: PALETTE.deltaMint.base,
                }}
                thumbColor={remindersEnabled ? PALETTE.bronze.base : '#FFFFFF'}
              />
            </View>

            {/* Haptics */}
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.iconCircle}>
                  <Vibrate size={16} color={PALETTE.bronze.base} />
                </View>
                <View>
                  <Text style={styles.settingLabel}>Haptic Sacred Breath</Text>
                  <Text style={styles.settingValue}>Subtle tactile vibration on unlock</Text>
                </View>
              </View>
              <Switch
                value={hapticsEnabled}
                onValueChange={() =>
                  toggleSwitch(setHapticsEnabled, hapticsEnabled)
                }
                trackColor={{
                  false: PALETTE.paper.linen,
                  true: PALETTE.prosecco.base,
                }}
                thumbColor={hapticsEnabled ? PALETTE.bronze.base : '#FFFFFF'}
              />
            </View>
          </View>
        </View>

        {/* Ethical Mindset Statement */}
        <View style={styles.ethicsContainer}>
          <Shield size={14} color={PALETTE.bronze.tint} />
          <Text style={styles.ethicsText}>
            Portal 11:11 by Verity is an AI-powered manifestation engine designed to align conscious intention, emotional grounding, and synchronicity.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* 15-Question Onboarding / Personalization Modal */}
      <PortalOnboardingModal
        visible={onboardingVisible}
        onClose={() => setOnboardingVisible(false)}
        onComplete={handleProfileUpdated}
        currentProfile={profile}
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
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: 90,
    gap: 16,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  logoRing: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 2,
    borderColor: PALETTE.bronze.base,
    padding: 2,
    backgroundColor: '#FFFFFF',
    marginBottom: SPACING.md,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7A5230',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
  },
  logoImage: {
    width: 84,
    height: 84,
    borderRadius: 42,
  },
  memberName: {
    fontFamily: FONTS.serifBold,
    fontSize: 24,
    color: PALETTE.ink.charcoal,
    letterSpacing: 0.5,
  },
  memberStatus: {
    fontFamily: FONTS.sansMedium,
    fontSize: 10,
    color: PALETTE.bronze.base,
    letterSpacing: 1.5,
    marginTop: 4,
  },
  membershipPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FCD34D',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    marginTop: 10,
  },
  membershipPillText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 11,
    color: '#B45309',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADII.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.08)',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontFamily: FONTS.serifSemiBold,
    fontSize: 17,
    color: PALETTE.ink.charcoal,
  },
  intentionQuote: {
    fontFamily: FONTS.serifItalic,
    fontSize: 14,
    lineHeight: 22,
    color: PALETTE.ink.body,
    marginVertical: SPACING.sm,
  },
  intentMetaRow: {
    marginBottom: 8,
  },
  intentMetaText: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: PALETTE.ink.muted,
  },
  changeIntentionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: PALETTE.bronze.subtle,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginTop: 6,
  },
  changeIntentionText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 11,
    color: PALETTE.bronze.base,
  },
  portalTimesSub: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: PALETTE.ink.muted,
    marginBottom: 10,
  },
  portalChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  portalChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: PALETTE.prosecco.light,
    borderWidth: 1,
    borderColor: PALETTE.prosecco.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  portalChipText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 12,
    color: PALETTE.bronze.rich,
  },
  settingsList: {
    marginTop: SPACING.md,
    gap: 14,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: PALETTE.paper.linen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    fontFamily: FONTS.sansMedium,
    fontSize: 13,
    color: PALETTE.ink.charcoal,
  },
  settingValue: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: PALETTE.ink.muted,
    marginTop: 1,
  },
  ethicsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  ethicsText: {
    flex: 1,
    fontFamily: FONTS.sans,
    fontSize: 11,
    lineHeight: 16,
    color: PALETTE.ink.muted,
  },
});
