import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  TextInput,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  X,
  Compass,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { PALETTE, FONTS } from '@/constants/theme';

interface WelcomeAuthModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (email?: string) => void;
}

export const WelcomeAuthModal: React.FC<WelcomeAuthModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'welcome' | 'login' | 'signup'>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleAction = () => {
    triggerHaptic();
    onSuccess(email || 'harsha@portal1111.space');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Close button */}
          <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={12}>
            <X size={20} color={PALETTE.ink.charcoal} />
          </Pressable>

          {/* Logo Mark with Bronze Sacred Ring */}
          <View style={styles.logoRing}>
            <Image
              source={require('../../assets/images/verity_logo.jpg')}
              style={styles.logoImage}
              resizeMode="cover"
            />
          </View>

          {/* Title & Cosmic Branding */}
          <Text style={styles.appTitle}>PORTAL 11:11</Text>
          <Text style={styles.appSub}>AI-POWERED MANIFESTATION ENGINE</Text>

          <Text style={styles.quoteText}>
            “The reality you desire is not something you chase; it is the frequency you embody right now.”
          </Text>

          {mode === 'welcome' && (
            <View style={styles.buttonGroup}>
              {/* Continue with Apple */}
              <Pressable
                onPress={handleAction}
                style={[styles.socialBtn, styles.appleBtn]}
              >
                <Text style={styles.appleBtnText}> Continue with Apple</Text>
              </Pressable>

              {/* Continue with Google */}
              <Pressable
                onPress={handleAction}
                style={[styles.socialBtn, styles.googleBtn]}
              >
                <Text style={styles.googleBtnText}>Continue with Google</Text>
              </Pressable>

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Email Options */}
              <View style={styles.rowBtns}>
                <Pressable
                  onPress={() => setMode('signup')}
                  style={styles.primaryAuthBtn}
                >
                  <Text style={styles.primaryAuthBtnText}>Create Account</Text>
                </Pressable>
                <Pressable
                  onPress={() => setMode('login')}
                  style={styles.secondaryAuthBtn}
                >
                  <Text style={styles.secondaryAuthBtnText}>Login</Text>
                </Pressable>
              </View>
            </View>
          )}

          {(mode === 'login' || mode === 'signup') && (
            <View style={styles.formGroup}>
              <View style={styles.inputWrapper}>
                <Mail size={16} color={PALETTE.bronze.base} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your sacred email..."
                  placeholderTextColor={PALETTE.ink.muted}
                  style={styles.input}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputWrapper}>
                <Lock size={16} color={PALETTE.bronze.base} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  placeholderTextColor={PALETTE.ink.muted}
                  secureTextEntry
                  style={styles.input}
                />
              </View>

              <Pressable onPress={handleAction} style={styles.submitBtn}>
                <Text style={styles.submitBtnText}>
                  {mode === 'signup' ? 'Open Your Portal' : 'Enter Portal'}
                </Text>
                <ArrowRight size={16} color="#FFFFFF" />
              </Pressable>

              <Pressable
                onPress={() => setMode('welcome')}
                style={styles.backLink}
              >
                <Text style={styles.backLinkText}>← Back to all options</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(35, 33, 32, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 390,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.15)',
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 28,
    alignItems: 'center',
    shadowColor: '#7A5230',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 28,
    elevation: 8,
  },
  closeBtn: {
    position: 'absolute',
    top: 18,
    right: 18,
    padding: 6,
  },
  logoRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: PALETTE.bronze.border,
    padding: 2,
    backgroundColor: '#FFFFFF',
    marginBottom: 14,
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 38,
  },
  appTitle: {
    fontFamily: FONTS.serifBold,
    fontSize: 24,
    color: PALETTE.ink.charcoal,
    letterSpacing: 2,
  },
  appSub: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 9.5,
    color: PALETTE.bronze.base,
    letterSpacing: 1.5,
    marginTop: 4,
  },
  quoteText: {
    fontFamily: FONTS.serifItalic,
    fontSize: 13,
    lineHeight: 20,
    color: PALETTE.ink.muted,
    textAlign: 'center',
    marginTop: 14,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  buttonGroup: {
    width: '100%',
    gap: 10,
  },
  socialBtn: {
    width: '100%',
    paddingVertical: 13,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appleBtn: {
    backgroundColor: '#232120',
  },
  appleBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 13.5,
    color: '#FFFFFF',
  },
  googleBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.15)',
  },
  googleBtnText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 13,
    color: PALETTE.ink.charcoal,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(122, 82, 48, 0.12)',
  },
  dividerText: {
    fontFamily: FONTS.sans,
    fontSize: 10,
    color: PALETTE.ink.muted,
    paddingHorizontal: 10,
  },
  rowBtns: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryAuthBtn: {
    flex: 1,
    backgroundColor: PALETTE.bronze.base,
    paddingVertical: 12,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryAuthBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 12.5,
    color: '#FFFFFF',
  },
  secondaryAuthBtn: {
    flex: 1,
    backgroundColor: PALETTE.prosecco.light,
    borderWidth: 1,
    borderColor: PALETTE.prosecco.border,
    paddingVertical: 12,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryAuthBtnText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 12.5,
    color: PALETTE.bronze.rich,
  },
  formGroup: {
    width: '100%',
    gap: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: PALETTE.paper.linen,
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.15)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: PALETTE.ink.charcoal,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: PALETTE.bronze.base,
    paddingVertical: 13,
    borderRadius: 20,
    marginTop: 4,
  },
  submitBtnText: {
    fontFamily: FONTS.sansBold,
    fontSize: 13.5,
    color: '#FFFFFF',
  },
  backLink: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  backLinkText: {
    fontFamily: FONTS.sans,
    fontSize: 11.5,
    color: PALETTE.ink.muted,
  },
});
