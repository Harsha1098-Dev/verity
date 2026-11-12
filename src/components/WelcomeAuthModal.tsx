import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  TextInput,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {
  Sparkles,
  Lock,
  Phone,
  ArrowRight,
  X,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  User,
  Zap,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { PALETTE, FONTS } from '@/constants/theme';
import { signInWithPhone } from '@/utils/portalStore';

interface WelcomeAuthModalProps {
  visible: boolean;
  dismissible?: boolean;
  onClose?: () => void;
  onSuccess: (credentials: {
    phoneNumber: string;
    authMethod: 'password' | 'otp';
    name?: string;
    isNewUser?: boolean;
  }) => void;
}

const COUNTRY_CODES = [
  { code: '+1', flag: '🇺🇸', label: 'US/CA' },
  { code: '+91', flag: '🇮🇳', label: 'IN' },
  { code: '+44', flag: '🇬🇧', label: 'UK' },
  { code: '+61', flag: '🇦🇺', label: 'AU' },
  { code: '+971', flag: '🇦🇪', label: 'UAE' },
];

export const WelcomeAuthModal: React.FC<WelcomeAuthModalProps> = ({
  visible,
  dismissible = false,
  onClose,
  onSuccess,
}) => {
  // Mode: Default to 'signin', or toggle to 'signup'
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  // Signin method: 'password' vs 'otp'
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('otp');

  // Form states
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');

  // OTP state
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [generatedOtp, setGeneratedOtp] = useState('111111');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // OTP countdown timer
  useEffect(() => {
    let timer: any;
    if (otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpCountdown]);

  const triggerHaptic = (type: 'light' | 'medium' | 'success' | 'error' = 'light') => {
    if (Platform.OS !== 'web') {
      if (type === 'success') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (type === 'error') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else {
        Haptics.impactAsync(
          type === 'medium'
            ? Haptics.ImpactFeedbackStyle.Medium
            : Haptics.ImpactFeedbackStyle.Light
        );
      }
    }
  };

  const handleSendOtp = () => {
    if (!phoneNumber || phoneNumber.trim().length < 6) {
      setErrorMessage('Please enter a valid phone number');
      triggerHaptic('error');
      return;
    }
    setErrorMessage(null);
    triggerHaptic('medium');

    // Generate 6-digit sacred OTP
    const code = '111111'; // Sacred portal code
    setGeneratedOtp(code);
    setOtpSent(true);
    setOtpCountdown(30);
  };

  const handleSignInWithPassword = async () => {
    if (!phoneNumber || phoneNumber.trim().length < 6) {
      setErrorMessage('Please enter your registered phone number');
      triggerHaptic('error');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMessage('Password must be at least 4 characters');
      triggerHaptic('error');
      return;
    }
    setErrorMessage(null);
    triggerHaptic('success');

    const fullPhone = `${countryCode} ${phoneNumber.trim()}`;
    await signInWithPhone(fullPhone, 'password');
    onSuccess({
      phoneNumber: fullPhone,
      authMethod: 'password',
      isNewUser: false,
    });
  };

  const handleSignInWithOtp = async () => {
    if (!phoneNumber || phoneNumber.trim().length < 6) {
      setErrorMessage('Please enter your phone number');
      triggerHaptic('error');
      return;
    }
    if (!otpSent) {
      handleSendOtp();
      return;
    }
    if (otpCode.trim() !== generatedOtp && otpCode.trim() !== '111111' && otpCode.trim() !== '123456') {
      setErrorMessage(`Invalid sacred code. Use ${generatedOtp} or tap Resend.`);
      triggerHaptic('error');
      return;
    }
    setErrorMessage(null);
    triggerHaptic('success');

    const fullPhone = `${countryCode} ${phoneNumber.trim()}`;
    await signInWithPhone(fullPhone, 'otp');
    onSuccess({
      phoneNumber: fullPhone,
      authMethod: 'otp',
      isNewUser: false,
    });
  };

  const handleSignUp = async () => {
    if (!name || name.trim().length < 2) {
      setErrorMessage('Please enter your name');
      triggerHaptic('error');
      return;
    }
    if (!phoneNumber || phoneNumber.trim().length < 6) {
      setErrorMessage('Please enter a valid phone number');
      triggerHaptic('error');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMessage('Please create a password (at least 4 characters)');
      triggerHaptic('error');
      return;
    }
    if (!otpSent) {
      handleSendOtp();
      return;
    }
    if (otpCode.trim() !== generatedOtp && otpCode.trim() !== '111111' && otpCode.trim() !== '123456') {
      setErrorMessage(`Invalid verification code. Use ${generatedOtp}.`);
      triggerHaptic('error');
      return;
    }
    setErrorMessage(null);
    triggerHaptic('success');

    const fullPhone = `${countryCode} ${phoneNumber.trim()}`;
    await signInWithPhone(fullPhone, 'otp', name.trim());
    onSuccess({
      phoneNumber: fullPhone,
      authMethod: 'otp',
      name: name.trim(),
      isNewUser: true,
    });
  };

  const handleQuickDemoBypass = async () => {
    triggerHaptic('success');
    const demoPhone = '+1 555-019-1111';
    await signInWithPhone(demoPhone, 'otp', 'Harsha');
    onSuccess({
      phoneNumber: demoPhone,
      authMethod: 'otp',
      name: 'Harsha',
      isNewUser: false,
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={dismissible ? onClose : () => {}}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <View style={styles.modalCard}>
            {/* Optional Close Button (only if dismissible) */}
            {dismissible && onClose && (
              <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={12}>
                <X size={20} color={PALETTE.ink.charcoal} />
              </Pressable>
            )}

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollInside}
            >
              {/* Brand Logo & Cosmic Emblem */}
              <View style={styles.logoRing}>
                <Image
                  source={require('../../assets/images/verity_logo.jpg')}
                  style={styles.logoImage}
                  resizeMode="cover"
                />
              </View>

              <Text style={styles.appTitle}>PORTAL 11:11</Text>
              <Text style={styles.appSub}>AI-POWERED MANIFESTATION ENGINE</Text>

              {/* Header Mode Title */}
              <Text style={styles.authModeTitle}>
                {mode === 'signin' ? 'Sign In to Your Reality' : 'Create Sacred Account'}
              </Text>
              <Text style={styles.authModeSub}>
                {mode === 'signin'
                  ? 'Access your personalized affirmations and sacred portal synchronicity.'
                  : 'Step through the threshold into sovereign abundance and self-belief.'}
              </Text>

              {/* Error Banner */}
              {errorMessage && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              )}

              {/* ========================================================
                  MODE: SIGN IN
                 ======================================================== */}
              {mode === 'signin' && (
                <View style={styles.formContainer}>
                  {/* Toggle: Login via OTP vs Password */}
                  <View style={styles.methodToggleRow}>
                    <Pressable
                      onPress={() => {
                        triggerHaptic('light');
                        setLoginMethod('otp');
                        setErrorMessage(null);
                      }}
                      style={[
                        styles.methodToggleBtn,
                        loginMethod === 'otp' && styles.methodToggleBtnActive,
                      ]}
                    >
                      <Zap
                        size={14}
                        color={loginMethod === 'otp' ? PALETTE.bronze.base : PALETTE.ink.muted}
                      />
                      <Text
                        style={[
                          styles.methodToggleText,
                          loginMethod === 'otp' && styles.methodToggleTextActive,
                        ]}
                      >
                        Login via OTP
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() => {
                        triggerHaptic('light');
                        setLoginMethod('password');
                        setErrorMessage(null);
                      }}
                      style={[
                        styles.methodToggleBtn,
                        loginMethod === 'password' && styles.methodToggleBtnActive,
                      ]}
                    >
                      <Lock
                        size={14}
                        color={loginMethod === 'password' ? PALETTE.bronze.base : PALETTE.ink.muted}
                      />
                      <Text
                        style={[
                          styles.methodToggleText,
                          loginMethod === 'password' && styles.methodToggleTextActive,
                        ]}
                      >
                        Login via Password
                      </Text>
                    </Pressable>
                  </View>

                  {/* Phone Number Input with Country Code */}
                  <View style={styles.inputLabelRow}>
                    <Text style={styles.inputLabel}>Mobile Phone Number</Text>
                  </View>
                  <View style={styles.phoneInputRow}>
                    {/* Country Code Picker Pill */}
                    <View style={styles.countryCodeBadge}>
                      <Text style={styles.countryCodeText}>{countryCode}</Text>
                    </View>
                    <View style={styles.phoneFieldWrapper}>
                      <Phone size={16} color={PALETTE.bronze.base} />
                      <TextInput
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        placeholder="Enter mobile number"
                        placeholderTextColor={PALETTE.ink.muted}
                        keyboardType="phone-pad"
                        style={styles.textInput}
                      />
                    </View>
                  </View>

                  {/* Password Input (if loginMethod === 'password') */}
                  {loginMethod === 'password' && (
                    <View style={styles.fieldSection}>
                      <Text style={styles.inputLabel}>Portal Password</Text>
                      <View style={styles.inputWrapper}>
                        <Lock size={16} color={PALETTE.bronze.base} />
                        <TextInput
                          value={password}
                          onChangeText={setPassword}
                          placeholder="Enter your password"
                          placeholderTextColor={PALETTE.ink.muted}
                          secureTextEntry={!showPassword}
                          style={styles.textInput}
                        />
                        <Pressable
                          onPress={() => setShowPassword(!showPassword)}
                          style={{ padding: 4 }}
                        >
                          {showPassword ? (
                            <EyeOff size={16} color={PALETTE.ink.muted} />
                          ) : (
                            <Eye size={16} color={PALETTE.ink.muted} />
                          )}
                        </Pressable>
                      </View>

                      <Pressable
                        onPress={handleSignInWithPassword}
                        style={styles.primaryActionBtn}
                      >
                        <Text style={styles.primaryActionBtnText}>Sign In to Portal</Text>
                        <ArrowRight size={16} color="#FFFFFF" />
                      </Pressable>
                    </View>
                  )}

                  {/* OTP Input & Flow (if loginMethod === 'otp') */}
                  {loginMethod === 'otp' && (
                    <View style={styles.fieldSection}>
                      {!otpSent ? (
                        <Pressable
                          onPress={handleSendOtp}
                          style={styles.primaryActionBtn}
                        >
                          <Zap size={16} color="#FFFFFF" />
                          <Text style={styles.primaryActionBtnText}>Send Sacred OTP</Text>
                        </Pressable>
                      ) : (
                        <View style={styles.otpActiveSection}>
                          <View style={styles.otpSentBanner}>
                            <ShieldCheck size={14} color={PALETTE.bronze.base} />
                            <Text style={styles.otpSentBannerText}>
                              Sacred code sent to {countryCode} {phoneNumber} (Dev code: <Text style={{ fontFamily: FONTS.sansBold }}>111111</Text>)
                            </Text>
                          </View>

                          <Text style={styles.inputLabel}>Enter 6-Digit OTP</Text>
                          <View style={styles.inputWrapper}>
                            <KeyRound size={16} color={PALETTE.bronze.base} />
                            <TextInput
                              value={otpCode}
                              onChangeText={setOtpCode}
                              placeholder="111111"
                              placeholderTextColor={PALETTE.ink.muted}
                              keyboardType="number-pad"
                              maxLength={6}
                              style={[styles.textInput, styles.otpTextInput]}
                            />
                          </View>

                          <Pressable
                            onPress={handleSignInWithOtp}
                            style={styles.primaryActionBtn}
                          >
                            <Text style={styles.primaryActionBtnText}>Verify OTP & Enter</Text>
                            <ArrowRight size={16} color="#FFFFFF" />
                          </Pressable>

                          <View style={styles.resendRow}>
                            {otpCountdown > 0 ? (
                              <Text style={styles.resendTimerText}>
                                Resend code in {otpCountdown}s
                              </Text>
                            ) : (
                              <Pressable onPress={handleSendOtp}>
                                <Text style={styles.resendBtnText}>Resend Sacred Code</Text>
                              </Pressable>
                            )}
                          </View>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Divider & Switch to Sign Up */}
                  <View style={styles.switchAuthRow}>
                    <Text style={styles.switchAuthLabel}>Don't have an account?</Text>
                    <Pressable
                      onPress={() => {
                        triggerHaptic('light');
                        setMode('signup');
                        setOtpSent(false);
                        setErrorMessage(null);
                      }}
                      hitSlop={8}
                    >
                      <Text style={styles.switchAuthAction}>Sign Up</Text>
                    </Pressable>
                  </View>
                </View>
              )}

              {/* ========================================================
                  MODE: SIGN UP
                 ======================================================== */}
              {mode === 'signup' && (
                <View style={styles.formContainer}>
                  {/* Name Input */}
                  <Text style={styles.inputLabel}>Your Sacred Name</Text>
                  <View style={styles.inputWrapper}>
                    <User size={16} color={PALETTE.bronze.base} />
                    <TextInput
                      value={name}
                      onChangeText={setName}
                      placeholder="Enter your name"
                      placeholderTextColor={PALETTE.ink.muted}
                      style={styles.textInput}
                    />
                  </View>

                  {/* Phone Number Input */}
                  <Text style={styles.inputLabel}>Mobile Phone Number</Text>
                  <View style={styles.phoneInputRow}>
                    <View style={styles.countryCodeBadge}>
                      <Text style={styles.countryCodeText}>{countryCode}</Text>
                    </View>
                    <View style={styles.phoneFieldWrapper}>
                      <Phone size={16} color={PALETTE.bronze.base} />
                      <TextInput
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        placeholder="Enter mobile number"
                        placeholderTextColor={PALETTE.ink.muted}
                        keyboardType="phone-pad"
                        style={styles.textInput}
                      />
                    </View>
                  </View>

                  {/* Password Input */}
                  <Text style={styles.inputLabel}>Create Password</Text>
                  <View style={styles.inputWrapper}>
                    <Lock size={16} color={PALETTE.bronze.base} />
                    <TextInput
                      value={password}
                      onChangeText={setPassword}
                      placeholder="At least 4 characters"
                      placeholderTextColor={PALETTE.ink.muted}
                      secureTextEntry={!showPassword}
                      style={styles.textInput}
                    />
                    <Pressable
                      onPress={() => setShowPassword(!showPassword)}
                      style={{ padding: 4 }}
                    >
                      {showPassword ? (
                        <EyeOff size={16} color={PALETTE.ink.muted} />
                      ) : (
                        <Eye size={16} color={PALETTE.ink.muted} />
                      )}
                    </Pressable>
                  </View>

                  {/* OTP Verification for Sign Up */}
                  {!otpSent ? (
                    <Pressable
                      onPress={handleSendOtp}
                      style={styles.primaryActionBtn}
                    >
                      <Zap size={16} color="#FFFFFF" />
                      <Text style={styles.primaryActionBtnText}>Send Verification OTP</Text>
                    </Pressable>
                  ) : (
                    <View style={styles.otpActiveSection}>
                      <View style={styles.otpSentBanner}>
                        <ShieldCheck size={14} color={PALETTE.bronze.base} />
                        <Text style={styles.otpSentBannerText}>
                          Verification code sent to {countryCode} {phoneNumber} (Dev code: <Text style={{ fontFamily: FONTS.sansBold }}>111111</Text>)
                        </Text>
                      </View>

                      <Text style={styles.inputLabel}>Enter 6-Digit Verification Code</Text>
                      <View style={styles.inputWrapper}>
                        <KeyRound size={16} color={PALETTE.bronze.base} />
                        <TextInput
                          value={otpCode}
                          onChangeText={setOtpCode}
                          placeholder="111111"
                          placeholderTextColor={PALETTE.ink.muted}
                          keyboardType="number-pad"
                          maxLength={6}
                          style={[styles.textInput, styles.otpTextInput]}
                        />
                      </View>

                      <Pressable
                        onPress={handleSignUp}
                        style={styles.primaryActionBtn}
                      >
                        <Text style={styles.primaryActionBtnText}>
                          Create Account & Begin
                        </Text>
                        <ArrowRight size={16} color="#FFFFFF" />
                      </Pressable>
                    </View>
                  )}

                  {/* Switch to Sign In */}
                  <View style={styles.switchAuthRow}>
                    <Text style={styles.switchAuthLabel}>Already have an account?</Text>
                    <Pressable
                      onPress={() => {
                        triggerHaptic('light');
                        setMode('signin');
                        setOtpSent(false);
                        setErrorMessage(null);
                      }}
                      hitSlop={8}
                    >
                      <Text style={styles.switchAuthAction}>Sign In</Text>
                    </Pressable>
                  </View>
                </View>
              )}

              {/* Quick Evaluation / One-Tap Access for User */}
              <Pressable
                onPress={handleQuickDemoBypass}
                style={styles.quickDemoLink}
                hitSlop={6}
              >
                <Sparkles size={13} color={PALETTE.bronze.base} />
                <Text style={styles.quickDemoText}>Quick Test: Sign In as Harsha</Text>
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 22, 20, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  keyboardView: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
  },
  modalCard: {
    width: '100%',
    maxHeight: '92%',
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.16)',
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 24,
    shadowColor: '#7A5230',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 10,
  },
  scrollInside: {
    alignItems: 'center',
    paddingBottom: 12,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 6,
  },
  logoRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
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
    borderRadius: 34,
  },
  appTitle: {
    fontFamily: FONTS.serifBold,
    fontSize: 22,
    color: PALETTE.ink.charcoal,
    letterSpacing: 2,
  },
  appSub: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 9,
    color: PALETTE.bronze.base,
    letterSpacing: 1.5,
    marginTop: 3,
  },
  authModeTitle: {
    fontFamily: FONTS.serifBold,
    fontSize: 18,
    color: PALETTE.ink.charcoal,
    marginTop: 18,
    textAlign: 'center',
  },
  authModeSub: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: PALETTE.ink.muted,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 4,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  errorBox: {
    width: '100%',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginBottom: 14,
  },
  errorText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 11.5,
    color: '#DC2626',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    gap: 12,
  },
  methodToggleRow: {
    flexDirection: 'row',
    backgroundColor: PALETTE.paper.linen,
    borderRadius: 16,
    padding: 4,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.12)',
  },
  methodToggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 12,
  },
  methodToggleBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#7A5230',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  methodToggleText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 12,
    color: PALETTE.ink.muted,
  },
  methodToggleTextActive: {
    fontFamily: FONTS.sansBold,
    color: PALETTE.ink.charcoal,
  },
  inputLabelRow: {
    marginTop: 4,
  },
  inputLabel: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 11.5,
    color: PALETTE.ink.charcoal,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  phoneInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  countryCodeBadge: {
    backgroundColor: PALETTE.paper.linen,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.16)',
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countryCodeText: {
    fontFamily: FONTS.sansBold,
    fontSize: 13,
    color: PALETTE.ink.charcoal,
  },
  phoneFieldWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: PALETTE.paper.linen,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.16)',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  fieldSection: {
    gap: 12,
    marginTop: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: PALETTE.paper.linen,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.16)',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  textInput: {
    flex: 1,
    fontFamily: FONTS.sansMedium,
    fontSize: 13,
    color: PALETTE.ink.charcoal,
    padding: 0,
  },
  otpTextInput: {
    letterSpacing: 6,
    fontSize: 16,
    fontFamily: FONTS.sansBold,
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: PALETTE.bronze.base,
    borderRadius: 18,
    paddingVertical: 14,
    marginTop: 4,
    shadowColor: '#7A5230',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 3,
  },
  primaryActionBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 13.5,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  otpActiveSection: {
    gap: 10,
  },
  otpSentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(122, 82, 48, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.18)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  otpSentBannerText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 11,
    color: PALETTE.ink.charcoal,
    flex: 1,
    lineHeight: 16,
  },
  resendRow: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  resendTimerText: {
    fontFamily: FONTS.sans,
    fontSize: 11.5,
    color: PALETTE.ink.muted,
  },
  resendBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 12,
    color: PALETTE.bronze.base,
  },
  switchAuthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
  },
  switchAuthLabel: {
    fontFamily: FONTS.sans,
    fontSize: 12.5,
    color: PALETTE.ink.muted,
  },
  switchAuthAction: {
    fontFamily: FONTS.sansBold,
    fontSize: 12.5,
    color: PALETTE.bronze.base,
    textDecorationLine: 'underline',
  },
  quickDemoLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(122, 82, 48, 0.06)',
  },
  quickDemoText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 11,
    color: PALETTE.bronze.base,
  },
});
