import React, { useState } from 'react';
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
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { PALETTE, FONTS, SPACING, RADII, SHADOWS } from '@/constants/theme';
import { PastelBadge } from '@/components/PastelBadge';

export default function ProfileScreen() {
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  const toggleSwitch = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    val: boolean
  ) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setter(!val);
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
          <Text style={styles.memberName}>Elena Vance</Text>
          <Text style={styles.memberStatus}>
            VERITY INNER CIRCLE
          </Text>

          <View style={styles.membershipPill}>
            <Sparkles size={12} color={PALETTE.bronze.base} />
            <Text style={styles.membershipPillText}>Unlimited Audio Practice</Text>
          </View>
        </View>

        {/* Primary Intention Setting */}
        <View style={[styles.sectionCard, SHADOWS.subtle]}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Current Primary Intention</Text>
            <PastelBadge label="ACTIVE" color="prosecco" active />
          </View>

          <Text style={styles.intentionQuote}>
            “Cultivating quiet confidence and speaking with calm self-possession
            in high-stakes meetings.”
          </Text>

          <Pressable
            style={styles.changeIntentionBtn}
            onPress={() => {
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
            }}
          >
            <Sliders size={13} color={PALETTE.bronze.base} />
            <Text style={styles.changeIntentionText}>Edit Focus & Tone</Text>
          </Pressable>
        </View>

        {/* Audio & Practice Preferences */}
        <View style={[styles.sectionCard, SHADOWS.subtle]}>
          <Text style={styles.sectionTitle}>Practice Customization</Text>

          <View style={styles.settingsList}>
            {/* Preferred Voice */}
            <Pressable style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.iconCircle}>
                  <Volume2 size={16} color={PALETTE.bronze.base} />
                </View>
                <View>
                  <Text style={styles.settingLabel}>Narrator Voice</Text>
                  <Text style={styles.settingValue}>Aura (Calm & Warm)</Text>
                </View>
              </View>
              <ChevronRight size={18} color={PALETTE.ink.subtle} />
            </Pressable>

            {/* Session Duration */}
            <Pressable style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.iconCircle}>
                  <Clock size={16} color={PALETTE.bronze.base} />
                </View>
                <View>
                  <Text style={styles.settingLabel}>Session Length</Text>
                  <Text style={styles.settingValue}>3 Minutes (Morning Anchor)</Text>
                </View>
              </View>
              <ChevronRight size={18} color={PALETTE.ink.subtle} />
            </Pressable>

            {/* Daily Morning Anchor Notification */}
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.iconCircle}>
                  <Bell size={16} color={PALETTE.bronze.base} />
                </View>
                <View>
                  <Text style={styles.settingLabel}>Morning Anchor Reminder</Text>
                  <Text style={styles.settingValue}>Daily at 7:30 AM</Text>
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
                  <Text style={styles.settingLabel}>Haptic Feedback</Text>
                  <Text style={styles.settingValue}>Subtle tactile breath</Text>
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
            Verity is an intentional mindfulness and cognitive framing tool
            designed to nurture conscious clarity and inner stillness.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
    backgroundColor: PALETTE.prosecco.light,
    borderWidth: 1,
    borderColor: PALETTE.prosecco.border,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    marginTop: 10,
  },
  membershipPillText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 11,
    color: PALETTE.bronze.base,
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
