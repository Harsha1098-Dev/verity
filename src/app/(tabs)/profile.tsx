import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  Switch,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
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
  Crown,
  Flame,
  Award,
  Check,
  X,
  Lock,
  LogOut,
  Phone,
  ShieldCheck,
  RefreshCw,
  Building2,
  CreditCard,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { PALETTE, FONTS, SHADOWS } from '@/constants/theme';
import { UserPortalProfile, SACRED_PORTAL_TIMES, ACHIEVEMENTS_LIST } from '@/types/portal';
import {
  loadPortalProfile,
  savePortalProfile,
  subscribeToProfile,
  signOutUser,
  resetUserOnboarding,
  DEFAULT_PORTAL_PROFILE,
} from '@/utils/portalStore';
import { PortalOnboardingModal } from '@/components/PortalOnboardingModal';
import { WelcomeAuthModal } from '@/components/WelcomeAuthModal';
import { PaymentGatewayModal } from '@/components/PaymentGatewayModal';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserPortalProfile>(DEFAULT_PORTAL_PROFILE);
  const [onboardingVisible, setOnboardingVisible] = useState(false);
  const [authVisible, setAuthVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentModalTab, setPaymentModalTab] = useState<'checkout' | 'banking'>('checkout');

  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  useEffect(() => {
    (async () => {
      const p = await loadPortalProfile();
      setProfile(p);
    })();

    const unsubscribe = subscribeToProfile((updated) => {
      setProfile(updated);
    });
    return unsubscribe;
  }, []);

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  };

  const handleProfileUpdated = async (updated: UserPortalProfile) => {
    setProfile(updated);
    await savePortalProfile(updated);
  };

  const togglePortalTime = async (time: string) => {
    triggerHaptic();
    const exists = profile.portalTimes.includes(time);
    const updatedTimes = exists
      ? profile.portalTimes.filter((t) => t !== time)
      : [...profile.portalTimes, time];
    const newProfile = {
      ...profile,
      portalTimes: updatedTimes.length > 0 ? updatedTimes : [time],
    };
    setProfile(newProfile);
    await savePortalProfile(newProfile);
  };

  const handleSignOut = async () => {
    triggerHaptic();
    await signOutUser();
  };

  const handleRetakeOnboarding = async () => {
    triggerHaptic();
    await resetUserOnboarding();
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Pressable onPress={() => setAuthVisible(true)} style={styles.logoRing}>
            <Image
              source={require('../../../assets/images/verity_logo.jpg')}
              style={styles.logoImage}
              resizeMode="cover"
            />
          </Pressable>
          <Text style={styles.memberName}>{profile.name}</Text>
          <Text style={styles.memberStatus}>
            PORTAL 11:11 SOVEREIGN CIRCLE • {profile.energy.toUpperCase()}
          </Text>

          {/* Premium Membership Badge */}
          <Pressable
            onPress={() => {
              triggerHaptic();
              setPaymentModalTab('checkout');
              setPaymentModalVisible(true);
            }}
            style={styles.membershipPill}
          >
            <Crown size={13} color={PALETTE.bronze.base} />
            <Text style={styles.membershipPillText}>
              Portal 11:11 VIP • Payment Gateway & Direct Bank
            </Text>
          </Pressable>
        </View>

        {/* 90-Day Vision & Current Intention */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>90-Day Manifestation Reality</Text>
            <View style={styles.tagBadge}>
              <Text style={styles.tagBadgeText}>{profile.goal.toUpperCase()}</Text>
            </View>
          </View>

          <Text style={styles.intentionQuote}>“{profile.goal90Days}”</Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>
              Emotional Baseline: <Text style={{ color: PALETTE.ink.charcoal }}>{profile.emotion}</Text> • Confidence:{' '}
              <Text style={{ color: PALETTE.bronze.base }}>{profile.confidence}/10</Text>
            </Text>
          </View>

          <Pressable
            style={styles.retuneBtn}
            onPress={() => {
              triggerHaptic();
              setOnboardingVisible(true);
            }}
          >
            <Sliders size={13} color="#FFFFFF" />
            <Text style={styles.retuneBtnText}>Retune 10-Step Profile</Text>
          </Pressable>
        </View>

        {/* Active Portal Times Manager */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Active Portal Times (10 Gateways)</Text>
            <Zap size={15} color={PALETTE.bronze.base} />
          </View>
          <Text style={styles.cardSub}>
            Tap to toggle synchronicity alert times:
          </Text>

          <View style={styles.portalChipsGrid}>
            {SACRED_PORTAL_TIMES.map((portal) => {
              const isActive = profile.portalTimes.includes(portal.time);
              return (
                <Pressable
                  key={portal.time}
                  onPress={() => togglePortalTime(portal.time)}
                  style={[
                    styles.portalChip,
                    isActive && styles.portalChipActive,
                  ]}
                >
                  <Clock
                    size={11}
                    color={isActive ? '#FFFFFF' : PALETTE.bronze.base}
                  />
                  <Text
                    style={[
                      styles.portalChipText,
                      isActive && styles.portalChipTextActive,
                    ]}
                  >
                    {portal.display}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Gamification Achievements Shelf */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Manifestation Milestones</Text>
            <Award size={15} color={PALETTE.bronze.base} />
          </View>

          <View style={styles.achievementsList}>
            {ACHIEVEMENTS_LIST.map((ach) => {
              const isUnlocked = profile.streakDays >= ach.requiredStreak;
              return (
                <View
                  key={ach.id}
                  style={[
                    styles.achievementItem,
                    isUnlocked && styles.achievementItemUnlocked,
                  ]}
                >
                  <Text style={styles.achievementIcon}>{ach.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.achievementTitle,
                        isUnlocked && styles.achievementTitleUnlocked,
                      ]}
                    >
                      {ach.title}
                    </Text>
                    <Text style={styles.achievementDesc}>{ach.description}</Text>
                  </View>
                  <View
                    style={[
                      styles.lockBadge,
                      isUnlocked && styles.lockBadgeUnlocked,
                    ]}
                  >
                    <Text
                      style={[
                        styles.lockBadgeText,
                        isUnlocked && styles.lockBadgeTextUnlocked,
                      ]}
                    >
                      {isUnlocked ? 'UNLOCKED' : `${ach.requiredStreak}d`}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Practice Preferences */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Practice & Sensory Settings</Text>

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
              <ChevronRight size={18} color={PALETTE.ink.muted} />
            </Pressable>

            {/* Notification Toggle */}
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.iconCircle}>
                  <Bell size={16} color={PALETTE.bronze.base} />
                </View>
                <View>
                  <Text style={styles.settingLabel}>Portal Push Alerts</Text>
                  <Text style={styles.settingValue}>Delivered at chosen portal times</Text>
                </View>
              </View>
              <Switch
                value={remindersEnabled}
                onValueChange={(val) => {
                  triggerHaptic();
                  setRemindersEnabled(val);
                }}
                trackColor={{
                  false: '#E5E7EB',
                  true: PALETTE.bronze.base,
                }}
                thumbColor="#FFFFFF"
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
                  <Text style={styles.settingValue}>Tactile wave on affirmation delivery</Text>
                </View>
              </View>
              <Switch
                value={hapticsEnabled}
                onValueChange={(val) => {
                  triggerHaptic();
                  setHapticsEnabled(val);
                }}
                trackColor={{
                  false: '#E5E7EB',
                  true: PALETTE.bronze.base,
                }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* Account & Sacred Security */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Account & Sacred Access</Text>
          <View style={styles.accountInfoRow}>
            <View style={styles.accountIconBox}>
              <Phone size={18} color={PALETTE.bronze.base} />
            </View>
            <View style={styles.accountTextCol}>
              <View style={styles.phoneVerifiedRow}>
                <Text style={styles.accountPhoneText}>
                  {profile.phoneNumber || '+1 555-019-1111'}
                </Text>
                <View style={styles.verifiedBadge}>
                  <ShieldCheck size={11} color="#059669" />
                  <Text style={styles.verifiedBadgeText}>VERIFIED</Text>
                </View>
              </View>
              <Text style={styles.accountSubText}>
                Authenticated via {profile.authMethod === 'password' ? 'Password' : 'Sacred OTP'}
              </Text>
            </View>
          </View>

          <View style={styles.accountActionsRow}>
            {/* Retake 15 Questions */}
            <Pressable
              onPress={handleRetakeOnboarding}
              style={styles.retakeBtn}
            >
              <RefreshCw size={14} color={PALETTE.bronze.base} />
              <Text style={styles.retakeBtnText}>Retake 15 Questions</Text>
            </Pressable>

            {/* Sign Out */}
            <Pressable
              onPress={handleSignOut}
              style={styles.signOutBtn}
            >
              <LogOut size={14} color="#DC2626" />
              <Text style={styles.signOutBtnText}>Sign Out</Text>
            </Pressable>
          </View>
        </View>

        {/* Direct Merchant Banking & Settlement */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Merchant Banking & Settlements</Text>
            <View style={styles.verifiedBadge}>
              <ShieldCheck size={11} color="#059669" />
              <Text style={styles.verifiedBadgeText}>DIRECT BANK CONNECTED</Text>
            </View>
          </View>

          <Text style={styles.bankSectionDesc}>
            All user payments via Razorpay UPI, cards, and membership subscriptions settle directly into this verified account.
          </Text>

          <View style={styles.bankQuickCard}>
            <View style={styles.bankQuickRow}>
              <Building2 size={20} color={PALETTE.bronze.base} />
              <View style={{ flex: 1 }}>
                <Text style={styles.bankQuickName}>HDFC Bank Ltd • Current A/C</Text>
                <Text style={styles.bankQuickAcc}>••••••••••1478 (IFSC: HDFC0000060)</Text>
              </View>
              <View style={styles.settlePill}>
                <Text style={styles.settlePillText}>T+1 Payouts</Text>
              </View>
            </View>
          </View>

          <View style={styles.bankActionsRow}>
            <Pressable
              onPress={() => {
                triggerHaptic();
                setPaymentModalTab('banking');
                setPaymentModalVisible(true);
              }}
              style={styles.manageBankBtn}
            >
              <Building2 size={14} color={PALETTE.bronze.base} />
              <Text style={styles.manageBankBtnText}>Connect / Manage Bank</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                triggerHaptic();
                setPaymentModalTab('checkout');
                setPaymentModalVisible(true);
              }}
              style={styles.viewGateBtn}
            >
              <Crown size={14} color="#FFFFFF" />
              <Text style={styles.viewGateBtnText}>Payment Gateway</Text>
            </Pressable>
          </View>
        </View>

        {/* Ethical Statement */}
        <View style={styles.ethicsContainer}>
          <Shield size={14} color={PALETTE.bronze.base} />
          <Text style={styles.ethicsText}>
            Portal 11:11 operates on conscious neuroscience and manifestation psychology, creating emotional certainty that transforms your reality.
          </Text>
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Onboarding Modal */}
      <PortalOnboardingModal
        visible={onboardingVisible}
        dismissible={true}
        onClose={() => setOnboardingVisible(false)}
        onComplete={handleProfileUpdated}
        currentProfile={profile}
      />

      {/* Welcome / Auth Modal */}
      <WelcomeAuthModal
        visible={authVisible}
        dismissible={true}
        onClose={() => setAuthVisible(false)}
        onSuccess={async (cred) => {
          setAuthVisible(false);
          const updated = await savePortalProfile({
            isAuthenticated: true,
            phoneNumber: cred.phoneNumber,
            authMethod: cred.authMethod,
            name: cred.name || profile.name,
          });
          setProfile(updated);
        }}
      />

      {/* Payment Gateway & Direct Bank Modal */}
      <PaymentGatewayModal
        visible={paymentModalVisible}
        initialTab={paymentModalTab}
        onClose={() => setPaymentModalVisible(false)}
        onSuccess={async (tier) => {
          triggerHaptic();
          const updated = await savePortalProfile({
            isVIP: true,
            isPremium: true,
            membershipTier: tier.id,
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
    paddingTop: 12,
    gap: 14,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  logoRing: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    borderColor: PALETTE.bronze.border,
    padding: 2,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  memberName: {
    fontFamily: FONTS.serifBold,
    fontSize: 22,
    color: PALETTE.ink.charcoal,
    letterSpacing: 0.5,
  },
  memberStatus: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 9.5,
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
    fontFamily: FONTS.sansSemiBold,
    fontSize: 11,
    color: PALETTE.bronze.rich,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.12)',
    shadowColor: '#7A5230',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
    gap: 8,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: FONTS.serifBold,
    fontSize: 15,
    color: PALETTE.ink.charcoal,
  },
  tagBadge: {
    backgroundColor: PALETTE.prosecco.light,
    borderWidth: 1,
    borderColor: PALETTE.prosecco.border,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagBadgeText: {
    fontFamily: FONTS.sansBold,
    fontSize: 9,
    color: PALETTE.bronze.rich,
    letterSpacing: 0.8,
  },
  intentionQuote: {
    fontFamily: FONTS.serifItalic,
    fontSize: 13.5,
    lineHeight: 20,
    color: PALETTE.ink.charcoal,
  },
  metaRow: {
    marginTop: 2,
  },
  metaText: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: PALETTE.ink.muted,
  },
  retuneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: PALETTE.bronze.base,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginTop: 6,
  },
  retuneBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 11,
    color: '#FFFFFF',
  },
  cardSub: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: PALETTE.ink.muted,
  },
  portalChipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  portalChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: PALETTE.paper.linen,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  portalChipActive: {
    backgroundColor: PALETTE.bronze.base,
    borderColor: PALETTE.bronze.base,
  },
  portalChipText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 11.5,
    color: PALETTE.ink.body,
  },
  portalChipTextActive: {
    color: '#FFFFFF',
  },
  achievementsList: {
    gap: 10,
    marginTop: 4,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: PALETTE.paper.linen,
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.1)',
    opacity: 0.6,
  },
  achievementItemUnlocked: {
    backgroundColor: PALETTE.prosecco.light,
    borderColor: PALETTE.bronze.border,
    opacity: 1,
  },
  achievementIcon: {
    fontSize: 20,
  },
  achievementTitle: {
    fontFamily: FONTS.serifBold,
    fontSize: 13,
    color: PALETTE.ink.muted,
  },
  achievementTitleUnlocked: {
    color: PALETTE.ink.charcoal,
  },
  achievementDesc: {
    fontFamily: FONTS.sans,
    fontSize: 10,
    color: PALETTE.ink.muted,
  },
  lockBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  lockBadgeUnlocked: {
    backgroundColor: PALETTE.bronze.base,
  },
  lockBadgeText: {
    fontFamily: FONTS.sansBold,
    fontSize: 9,
    color: PALETTE.ink.muted,
  },
  lockBadgeTextUnlocked: {
    color: '#FFFFFF',
  },
  settingsList: {
    gap: 12,
    marginTop: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: PALETTE.prosecco.light,
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
    fontSize: 10.5,
    color: PALETTE.ink.muted,
    marginTop: 1,
  },
  ethicsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  ethicsText: {
    flex: 1,
    fontFamily: FONTS.sans,
    fontSize: 10.5,
    lineHeight: 16,
    color: PALETTE.ink.muted,
  },
  bankSectionDesc: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: PALETTE.ink.muted,
    lineHeight: 18,
    marginTop: 2,
    marginBottom: 8,
  },
  bankQuickCard: {
    backgroundColor: 'rgba(122, 82, 48, 0.05)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.14)',
    padding: 12,
    marginVertical: 4,
  },
  bankQuickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bankQuickName: {
    fontFamily: FONTS.sansBold,
    fontSize: 13,
    color: PALETTE.ink.charcoal,
  },
  bankQuickAcc: {
    fontFamily: FONTS.sans,
    fontSize: 11.5,
    color: PALETTE.ink.muted,
    marginTop: 1,
  },
  settlePill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  settlePillText: {
    fontFamily: FONTS.sansBold,
    fontSize: 9.5,
    color: '#059669',
  },
  bankActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  manageBankBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(122, 82, 48, 0.08)',
    borderRadius: 14,
    paddingVertical: 10,
  },
  manageBankBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 11.5,
    color: PALETTE.bronze.base,
  },
  viewGateBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: PALETTE.bronze.base,
    borderRadius: 14,
    paddingVertical: 10,
  },
  viewGateBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 11.5,
    color: '#FFFFFF',
  },
  accountInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  accountIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(122, 82, 48, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountTextCol: {
    flex: 1,
    gap: 3,
  },
  phoneVerifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accountPhoneText: {
    fontFamily: FONTS.sansBold,
    fontSize: 14,
    color: PALETTE.ink.charcoal,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  verifiedBadgeText: {
    fontFamily: FONTS.sansBold,
    fontSize: 9,
    color: '#059669',
    letterSpacing: 0.5,
  },
  accountSubText: {
    fontFamily: FONTS.sans,
    fontSize: 11.5,
    color: PALETTE.ink.muted,
  },
  accountActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  retakeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(122, 82, 48, 0.08)',
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.15)',
  },
  retakeBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 11.5,
    color: PALETTE.bronze.base,
  },
  signOutBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  signOutBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 11.5,
    color: '#DC2626',
  },
});
