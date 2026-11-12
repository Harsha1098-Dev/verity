import React, { useState, useEffect, useRef } from 'react';
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
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Sparkles,
  Lock,
  Phone,
  ArrowRight,
  X,
  ShieldCheck,
  Eye,
  EyeOff,
  User,
  Zap,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { PALETTE, FONTS } from '@/constants/theme';
import { signInWithPhone } from '@/utils/portalStore';
import {
  validateIndianMobileNumber,
  sendPhoneOTP,
  resendPhoneOTP,
  verifyPhoneOTP,
} from '@/services/phoneAuthService';

interface WelcomeAuthModalProps {
  visible: boolean;
  dismissible?: boolean;
  onClose?: () => void;
  onSuccess: (credentials: {
    phoneNumber: string;
    authMethod: 'password' | 'otp';
    name?: string;
    isNewUser?: boolean;
    redirectUrl?: string;
  }) => void;
}

export const WelcomeAuthModal: React.FC<WelcomeAuthModalProps> = ({
  visible,
  dismissible = false,
  onClose,
  onSuccess,
}) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isMobileScreen = windowWidth < 520;
  const isCompact = windowHeight < 740;
  const isNarrow = windowWidth < 380;
  const isVeryNarrow = windowWidth < 340;

  // Mode: Default to 'signin', toggle to 'signup'
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  // Login method: 'otp' vs 'password'
  const [loginMethod, setLoginMethod] = useState<'otp' | 'password'>('otp');

  // Phone number (Indian 10-digit)
  const [phoneDigits, setPhoneDigits] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP flow state
  const [otpSent, setOtpSent] = useState(false);
  const [otpArray, setOtpArray] = useState<string[]>(['', '', '', '', '', '']);
  const [otpCountdown, setOtpCountdown] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // 6-box OTP input refs
  const otpInputRefs = useRef<any[]>([]);

  // 30-Second Resend Countdown Timer
  useEffect(() => {
    let timer: any;
    if (otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown((prev) => (prev > 0 ? prev - 1 : 0));
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

  // Format 10 digits as user types: "98765 43210"
  const handlePhoneChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 10);
    setPhoneDigits(cleaned);
    if (errorMessage) setErrorMessage(null);
  };

  const formattedDisplayPhone =
    phoneDigits.length > 5
      ? `${phoneDigits.slice(0, 5)} ${phoneDigits.slice(5)}`
      : phoneDigits;

  // Send OTP handler
  const handleSendOtp = async () => {
    const validation = validateIndianMobileNumber(phoneDigits);
    if (!validation.isValid) {
      setErrorMessage(validation.error || 'Please enter a valid 10-digit Indian mobile number');
      triggerHaptic('error');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);
    triggerHaptic('medium');

    const result = await sendPhoneOTP(phoneDigits);
    setIsLoading(false);

    if (result.success) {
      setOtpSent(true);
      setOtpCountdown(result.cooldownSeconds || 30);
      setSuccessNotice(`Sacred OTP sent to +91 ${validation.cleaned10Digit.slice(0, 5)} ${validation.cleaned10Digit.slice(5)}`);
      triggerHaptic('success');
      // Focus first OTP box
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 200);
    } else {
      setErrorMessage(result.error || 'Failed to send verification code');
      triggerHaptic('error');
    }
  };

  // Resend OTP handler (enforces 30s cooldown)
  const handleResendOtp = async () => {
    if (otpCountdown > 0) return;
    setErrorMessage(null);
    setIsLoading(true);
    triggerHaptic('medium');

    const result = await resendPhoneOTP(phoneDigits);
    setIsLoading(false);

    if (result.success) {
      setOtpCountdown(result.cooldownSeconds || 30);
      setSuccessNotice('New sacred code dispatched successfully');
      setOtpArray(['', '', '', '', '', '']);
      triggerHaptic('success');
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    } else {
      setErrorMessage(result.error || 'Please wait before requesting a new OTP');
      if (result.cooldownSeconds) setOtpCountdown(result.cooldownSeconds);
      triggerHaptic('error');
    }
  };

  // Handle individual OTP digit box changes
  const handleOtpDigitChange = (value: string, index: number) => {
    // Handle paste of 6 digits
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 6) {
      const newArray = cleaned.slice(0, 6).split('');
      setOtpArray(newArray);
      otpInputRefs.current[5]?.focus();
      triggerHaptic('light');
      handleVerifyCode(newArray.join(''));
      return;
    }

    const digit = cleaned.slice(-1);
    const updated = [...otpArray];
    updated[index] = digit;
    setOtpArray(updated);

    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto submit if all 6 boxes filled
    if (digit && index === 5) {
      const fullCode = updated.join('');
      if (fullCode.length === 6) {
        handleVerifyCode(fullCode);
      }
    }
  };

  // Backspace key handling in OTP boxes
  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otpArray[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP submission
  const handleVerifyCode = async (codeToVerify?: string) => {
    const code = codeToVerify || otpArray.join('');
    if (code.length !== 6) {
      setErrorMessage('Please enter all 6 digits of the verification code');
      triggerHaptic('error');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);
    triggerHaptic('medium');

    const result = await verifyPhoneOTP(
      phoneDigits,
      code,
      name.trim() || undefined
    );
    setIsLoading(false);

    if (result.success && result.user) {
      triggerHaptic('success');
      const fullPhone = result.user.displayNumber || `+91 ${phoneDigits}`;

      // Update local profile state
      await signInWithPhone(
        fullPhone,
        'otp',
        result.user.displayName || name || 'Harsha'
      );

      // Trigger root gate navigation (Dashboard / Onboarding)
      onSuccess({
        phoneNumber: fullPhone,
        authMethod: 'otp',
        name: result.user.displayName,
        isNewUser: result.isNewUser ?? false,
        redirectUrl: result.redirectUrl,
      });
    } else {
      setErrorMessage(result.error || 'Invalid verification code. Please check and retry.');
      triggerHaptic('error');
    }
  };

  // Sign In with Password handler
  const handleSignInWithPassword = async () => {
    const validation = validateIndianMobileNumber(phoneDigits);
    if (!validation.isValid) {
      setErrorMessage(validation.error || 'Please enter a valid 10-digit Indian phone number');
      triggerHaptic('error');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMessage('Password must be at least 4 characters');
      triggerHaptic('error');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);
    triggerHaptic('success');

    const fullPhone = validation.displayFormatted;
    await signInWithPhone(fullPhone, 'password', name.trim() || 'Harsha');
    setIsLoading(false);

    onSuccess({
      phoneNumber: fullPhone,
      authMethod: 'password',
      isNewUser: false,
      redirectUrl: '/home',
    });
  };

  // Sign Up with Password + OTP flow
  const handleSignUpStart = async () => {
    if (!name || name.trim().length < 2) {
      setErrorMessage('Please enter your sacred name');
      triggerHaptic('error');
      return;
    }
    const validation = validateIndianMobileNumber(phoneDigits);
    if (!validation.isValid) {
      setErrorMessage(validation.error || 'Please enter a valid 10-digit Indian phone number');
      triggerHaptic('error');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMessage('Please create a password with at least 4 characters');
      triggerHaptic('error');
      return;
    }

    // Trigger OTP for verification
    await handleSendOtp();
  };

  // Quick Demo Bypass
  const handleQuickDemoBypass = async () => {
    triggerHaptic('success');
    const demoPhone = '+91 98765 43210';
    await signInWithPhone(demoPhone, 'otp', 'Harsha');
    onSuccess({
      phoneNumber: demoPhone,
      authMethod: 'otp',
      name: 'Harsha',
      isNewUser: false,
      redirectUrl: '/home',
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={!isMobileScreen}
      onRequestClose={dismissible && onClose ? onClose : () => {}}
    >
      <View style={isMobileScreen ? styles.mobileContainer : styles.desktopOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <View
            style={[
              isMobileScreen ? styles.mobileCard : styles.desktopCard,
              {
                paddingTop: isMobileScreen ? Math.max(insets.top, 10) : 24,
                paddingBottom: isMobileScreen ? Math.max(insets.bottom, 14) : 20,
              },
            ]}
          >
            {/* Optional Close Button (only if dismissible) */}
            {dismissible && onClose && (
              <Pressable
                onPress={onClose}
                style={[
                  styles.closeBtn,
                  isMobileScreen && { top: Math.max(insets.top + 6, 14), right: 16 },
                ]}
                hitSlop={12}
              >
                <X size={20} color={PALETTE.ink.charcoal} />
              </Pressable>
            )}

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                styles.scrollInside,
                {
                  flexGrow: 1,
                  justifyContent: isCompact ? 'flex-start' : 'center',
                  paddingHorizontal: isVeryNarrow ? 14 : isNarrow ? 18 : 24,
                },
              ]}
              keyboardShouldPersistTaps="handled"
            >
              {/* Brand Logo & Glowing Ring */}
              <View
                style={[
                  styles.logoRing,
                  isCompact && {
                    width: 54,
                    height: 54,
                    borderRadius: 27,
                    marginBottom: 8,
                  },
                ]}
              >
                <Image
                  source={require('../../assets/images/verity_logo.jpg')}
                  style={styles.logoImage}
                  resizeMode="cover"
                />
              </View>

              <Text style={[styles.appTitle, isCompact && { fontSize: 20 }]}>
                PORTAL 11:11
              </Text>
              <Text style={[styles.appSub, isCompact && { fontSize: 8.5, letterSpacing: 1.2 }]}>
                FIREBASE MOBILE OTP AUTHENTICATION
              </Text>

              {/* Header Mode Title */}
              <Text
                style={[
                  styles.authModeTitle,
                  isCompact && { fontSize: 16, marginTop: 10 },
                ]}
              >
                {otpSent
                  ? 'Verify Sacred Code'
                  : mode === 'signin'
                  ? 'Sign In to Your Reality'
                  : 'Create Sacred Account'}
              </Text>
              <Text
                style={[
                  styles.authModeSub,
                  isCompact && { fontSize: 11.5, marginTop: 3, marginBottom: 12, lineHeight: 16 },
                ]}
              >
                {otpSent
                  ? `Enter the 6-digit OTP delivered to +91 ${formattedDisplayPhone}`
                  : mode === 'signin'
                  ? 'Enter your Indian mobile number to access your portal affirmations.'
                  : 'Register with your Indian mobile number for personalized manifestation synchronicity.'}
              </Text>

              {/* Error Notice */}
              {errorMessage && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              )}

              {/* Success Notice */}
              {successNotice && !errorMessage && (
                <View style={styles.successBox}>
                  <CheckCircle2 size={13} color="#059669" />
                  <Text style={styles.successText}>{successNotice}</Text>
                </View>
              )}

              {/* ========================================================
                  STEP A: ENTER INDIAN PHONE NUMBER & CHOOSE METHOD
                 ======================================================== */}
              {!otpSent && (
                <View style={styles.formContainer}>
                  {/* Method Toggle: OTP vs Password */}
                  {mode === 'signin' && (
                    <View style={[styles.methodToggleRow, isCompact && { marginBottom: 2 }]}>
                      <Pressable
                        onPress={() => {
                          triggerHaptic('light');
                          setLoginMethod('otp');
                          setErrorMessage(null);
                        }}
                        style={[
                          styles.methodToggleBtn,
                          isCompact && { paddingVertical: 7 },
                          loginMethod === 'otp' && styles.methodToggleBtnActive,
                        ]}
                      >
                        <Zap
                          size={isNarrow ? 12 : 14}
                          color={loginMethod === 'otp' ? PALETTE.bronze.base : PALETTE.ink.muted}
                        />
                        <Text
                          style={[
                            styles.methodToggleText,
                            isNarrow && { fontSize: 11 },
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
                          isCompact && { paddingVertical: 7 },
                          loginMethod === 'password' && styles.methodToggleBtnActive,
                        ]}
                      >
                        <Lock
                          size={isNarrow ? 12 : 14}
                          color={loginMethod === 'password' ? PALETTE.bronze.base : PALETTE.ink.muted}
                        />
                        <Text
                          style={[
                            styles.methodToggleText,
                            isNarrow && { fontSize: 11 },
                            loginMethod === 'password' && styles.methodToggleTextActive,
                          ]}
                        >
                          Login via Password
                        </Text>
                      </Pressable>
                    </View>
                  )}

                  {/* Name Input (Sign Up mode) */}
                  {mode === 'signup' && (
                    <View style={styles.fieldSection}>
                      <Text style={styles.inputLabel}>Your Sacred Name</Text>
                      <View style={[styles.inputWrapper, isCompact && { height: 46 }]}>
                        <User size={16} color={PALETTE.bronze.base} />
                        <TextInput
                          value={name}
                          onChangeText={setName}
                          placeholder="e.g. Harsha Vardhan"
                          placeholderTextColor={PALETTE.ink.muted}
                          style={[styles.textInput, isNarrow && { fontSize: 13 }]}
                        />
                      </View>
                    </View>
                  )}

                  {/* Indian Mobile Number Input */}
                  <View style={styles.fieldSection}>
                    <Text style={styles.inputLabel}>Indian Mobile Number</Text>
                    <View style={[styles.phoneInputRow, isNarrow && { gap: 6 }]}>
                      {/* Flag & Country Code Badge */}
                      <View
                        style={[
                          styles.countryCodeBadge,
                          isCompact && { height: 46 },
                          isNarrow && { paddingHorizontal: 8, gap: 4 },
                        ]}
                      >
                        <Text style={styles.countryFlagText}>🇮🇳</Text>
                        <Text style={[styles.countryCodeText, isNarrow && { fontSize: 12.5 }]}>
                          +91
                        </Text>
                      </View>

                      {/* 10-digit number input */}
                      <View
                        style={[
                          styles.phoneFieldWrapper,
                          isCompact && { height: 46 },
                          isNarrow && { paddingHorizontal: 10, gap: 6 },
                        ]}
                      >
                        <Phone size={isNarrow ? 14 : 16} color={PALETTE.bronze.base} />
                        <TextInput
                          value={formattedDisplayPhone}
                          onChangeText={handlePhoneChange}
                          placeholder="98765 43210"
                          placeholderTextColor={PALETTE.ink.muted}
                          keyboardType="phone-pad"
                          maxLength={11} // 10 digits + 1 space
                          style={[styles.textInput, isNarrow && { fontSize: 13 }]}
                        />
                      </View>
                    </View>
                  </View>

                  {/* Password Input (if Password method or Sign Up) */}
                  {(loginMethod === 'password' || mode === 'signup') && (
                    <View style={styles.fieldSection}>
                      <Text style={styles.inputLabel}>
                        {mode === 'signup' ? 'Create Portal Password' : 'Password'}
                      </Text>
                      <View style={[styles.inputWrapper, isCompact && { height: 46 }]}>
                        <Lock size={16} color={PALETTE.bronze.base} />
                        <TextInput
                          value={password}
                          onChangeText={setPassword}
                          placeholder="At least 4 characters"
                          placeholderTextColor={PALETTE.ink.muted}
                          secureTextEntry={!showPassword}
                          style={[styles.textInput, isNarrow && { fontSize: 13 }]}
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
                    </View>
                  )}

                  {/* Primary Action Button */}
                  <Pressable
                    onPress={
                      mode === 'signup'
                        ? handleSignUpStart
                        : loginMethod === 'otp'
                        ? handleSendOtp
                        : handleSignInWithPassword
                    }
                    disabled={isLoading}
                    style={[
                      styles.primaryActionBtn,
                      isCompact && { paddingVertical: 12 },
                      isLoading && styles.btnDisabled,
                    ]}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <>
                        <Zap size={16} color="#FFFFFF" />
                        <Text style={[styles.primaryActionBtnText, isNarrow && { fontSize: 12.5 }]}>
                          {mode === 'signup'
                            ? 'Send Verification OTP'
                            : loginMethod === 'otp'
                            ? 'Send Sacred OTP'
                            : 'Sign In to Portal'}
                        </Text>
                        <ArrowRight size={16} color="#FFFFFF" />
                      </>
                    )}
                  </Pressable>

                  {/* Switch between Sign In and Sign Up */}
                  <View style={[styles.switchAuthRow, isCompact && { marginTop: 4 }]}>
                    <Text style={[styles.switchAuthLabel, isNarrow && { fontSize: 11.5 }]}>
                      {mode === 'signin' ? "Don't have an account?" : 'Already registered?'}
                    </Text>
                    <Pressable
                      onPress={() => {
                        triggerHaptic('light');
                        setMode(mode === 'signin' ? 'signup' : 'signin');
                        setErrorMessage(null);
                        setSuccessNotice(null);
                      }}
                      hitSlop={8}
                    >
                      <Text style={[styles.switchAuthAction, isNarrow && { fontSize: 11.5 }]}>
                        {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}

              {/* ========================================================
                  STEP B: 6-BOX OTP VERIFICATION & 30S RESEND
                 ======================================================== */}
              {otpSent && (
                <View style={styles.otpVerifyContainer}>
                  {/* Phone Pill Header */}
                  <View style={styles.verifyPhonePill}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                      <ShieldCheck size={14} color={PALETTE.bronze.base} />
                      <Text
                        style={[styles.verifyPhoneText, isNarrow && { fontSize: 11 }]}
                        numberOfLines={1}
                      >
                        +91 {formattedDisplayPhone}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => {
                        triggerHaptic('light');
                        setOtpSent(false);
                        setOtpArray(['', '', '', '', '', '']);
                      }}
                      hitSlop={8}
                    >
                      <Text style={styles.editPhoneLink}>Change</Text>
                    </Pressable>
                  </View>

                  {/* 6 Individual OTP Digit Input Boxes */}
                  <Text style={styles.inputLabelCenter}>Enter 6-Digit Sacred OTP</Text>
                  <View
                    style={[
                      styles.otpBoxesRow,
                      { gap: isVeryNarrow ? 4 : isNarrow ? 6 : 8 },
                    ]}
                  >
                    {otpArray.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={(ref) => {
                          otpInputRefs.current[index] = ref;
                        }}
                        value={digit}
                        onChangeText={(val) => handleOtpDigitChange(val, index)}
                        onKeyPress={(e) => handleOtpKeyPress(e, index)}
                        keyboardType="number-pad"
                        maxLength={index === 0 ? 6 : 1}
                        selectTextOnFocus
                        style={[
                          styles.otpDigitBox,
                          isCompact && { height: 44 },
                          isNarrow && { maxWidth: 44, fontSize: 18 },
                          digit ? styles.otpDigitBoxFilled : null,
                        ]}
                      />
                    ))}
                  </View>

                  {/* Verify Code Button */}
                  <Pressable
                    onPress={() => handleVerifyCode()}
                    disabled={isLoading}
                    style={[
                      styles.primaryActionBtn,
                      isCompact && { paddingVertical: 12 },
                      isLoading && styles.btnDisabled,
                    ]}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <>
                        <Text style={[styles.primaryActionBtnText, isNarrow && { fontSize: 12.5 }]}>
                          Verify OTP & Enter
                        </Text>
                        <ArrowRight size={16} color="#FFFFFF" />
                      </>
                    )}
                  </Pressable>

                  {/* 30-Second Resend Countdown Section */}
                  <View style={styles.resendSection}>
                    {otpCountdown > 0 ? (
                      <View style={styles.resendCountdownRow}>
                        <RotateCcw size={13} color={PALETTE.ink.muted} />
                        <Text style={[styles.resendCountdownText, isNarrow && { fontSize: 11.5 }]}>
                          Resend sacred OTP in{' '}
                          <Text style={{ fontFamily: FONTS.sansBold, color: PALETTE.bronze.base }}>
                            {otpCountdown}s
                          </Text>
                        </Text>
                      </View>
                    ) : (
                      <Pressable
                        onPress={handleResendOtp}
                        disabled={isLoading}
                        style={styles.resendActiveBtn}
                      >
                        <RotateCcw size={14} color={PALETTE.bronze.base} />
                        <Text style={[styles.resendActiveBtnText, isNarrow && { fontSize: 12 }]}>
                          Resend Sacred Code
                        </Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              )}

              {/* Quick Evaluation / Demo Bypass Button */}
              <Pressable
                onPress={handleQuickDemoBypass}
                style={[
                  styles.quickDemoLink,
                  isCompact && { marginTop: 12, paddingVertical: 6 },
                ]}
                hitSlop={6}
              >
                <Sparkles size={12} color={PALETTE.bronze.base} />
                <Text style={[styles.quickDemoText, isNarrow && { fontSize: 10 }]}>
                  🧪 Quick Demo: Instant Login (+91 98765 43210)
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  mobileContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  desktopOverlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 22, 20, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  keyboardView: {
    flex: 1,
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },
  mobileCard: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  desktopCard: {
    width: '100%',
    maxHeight: '94%',
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.16)',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    shadowColor: '#7A5230',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 10,
  },
  scrollInside: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 6,
  },
  logoRing: {
    width: 66,
    height: 66,
    borderRadius: 33,
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
    borderRadius: 31,
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
    marginTop: 14,
    textAlign: 'center',
  },
  authModeSub: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: PALETTE.ink.muted,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 4,
    marginBottom: 14,
    paddingHorizontal: 10,
  },
  errorBox: {
    width: '100%',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginBottom: 12,
  },
  errorText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 11.5,
    color: '#DC2626',
    textAlign: 'center',
  },
  successBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginBottom: 12,
  },
  successText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 11.5,
    color: '#059669',
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
  fieldSection: {
    gap: 6,
  },
  inputLabel: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 11.5,
    color: PALETTE.ink.charcoal,
    letterSpacing: 0.3,
  },
  inputLabelCenter: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 12,
    color: PALETTE.ink.charcoal,
    textAlign: 'center',
    marginBottom: 4,
  },
  phoneInputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  countryCodeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: PALETTE.paper.linen,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.16)',
    paddingHorizontal: 12,
    height: 50,
    justifyContent: 'center',
  },
  countryFlagText: {
    fontSize: 16,
  },
  countryCodeText: {
    fontFamily: FONTS.sansBold,
    fontSize: 13.5,
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
    height: 50,
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
    height: 50,
  },
  textInput: {
    flex: 1,
    fontFamily: FONTS.sansMedium,
    fontSize: 13.5,
    color: PALETTE.ink.charcoal,
    padding: 0,
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: PALETTE.bronze.base,
    borderRadius: 16,
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
  btnDisabled: {
    opacity: 0.65,
  },
  switchAuthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 6,
  },
  switchAuthLabel: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: PALETTE.ink.muted,
  },
  switchAuthAction: {
    fontFamily: FONTS.sansBold,
    fontSize: 12,
    color: PALETTE.bronze.base,
    textDecorationLine: 'underline',
  },
  otpVerifyContainer: {
    width: '100%',
    gap: 12,
  },
  verifyPhonePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(122, 82, 48, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.18)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  verifyPhoneText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 12,
    color: PALETTE.ink.charcoal,
  },
  editPhoneLink: {
    fontFamily: FONTS.sansBold,
    fontSize: 11.5,
    color: PALETTE.bronze.base,
    textDecorationLine: 'underline',
    paddingLeft: 8,
  },
  otpBoxesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 4,
  },
  otpDigitBox: {
    flex: 1,
    maxWidth: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: PALETTE.paper.linen,
    borderWidth: 1.5,
    borderColor: 'rgba(122, 82, 48, 0.18)',
    textAlign: 'center',
    fontFamily: FONTS.sansBold,
    fontSize: 20,
    color: PALETTE.ink.charcoal,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  otpDigitBoxFilled: {
    borderColor: PALETTE.bronze.base,
    backgroundColor: '#FFFFFF',
    shadowColor: '#7A5230',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resendSection: {
    alignItems: 'center',
    paddingVertical: 2,
  },
  resendCountdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  resendCountdownText: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: PALETTE.ink.muted,
  },
  resendActiveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  resendActiveBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 12.5,
    color: PALETTE.bronze.base,
  },
  quickDemoLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: 'rgba(122, 82, 48, 0.06)',
  },
  quickDemoText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 11,
    color: PALETTE.bronze.base,
  },
});
