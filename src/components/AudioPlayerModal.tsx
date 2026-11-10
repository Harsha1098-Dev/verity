import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  X,
  Volume2,
  Sparkles,
  CloudRain,
  Music,
  Wind,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { PALETTE, FONTS, SPACING, RADII, SHADOWS } from '@/constants/theme';

interface AudioPlayerModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  category?: string;
  durationSeconds?: number;
}

export const AudioPlayerModal: React.FC<AudioPlayerModalProps> = ({
  visible,
  onClose,
  title = 'Rooted Presence & Inner Stillness',
  category = 'Quiet Confidence',
  durationSeconds = 180,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(24);
  const [ambientSound, setAmbientSound] = useState<string>('rain');
  const [playbackSpeed, setPlaybackSpeed] = useState<'1.0x' | '1.2x'>('1.0x');

  // Simulated timer
  useEffect(() => {
    let interval: any;
    if (visible && isPlaying && secondsElapsed < durationSeconds) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [visible, isPlaying, secondsElapsed, durationSeconds]);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const togglePlay = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setIsPlaying(!isPlaying);
  };

  const skipSeconds = (sec: number) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setSecondsElapsed((prev) =>
      Math.max(0, Math.min(durationSeconds, prev + sec))
    );
  };

  const progressPercent = (secondsElapsed / durationSeconds) * 100;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <LinearGradient
        colors={[PALETTE.prosecco.light, '#FFFFFF', PALETTE.paper.linen]}
        style={styles.modalContainer}
      >
        {/* Top Header */}
        <View style={styles.topRow}>
          <Pressable
            onPress={onClose}
            hitSlop={14}
            style={styles.closeButton}
          >
            <X size={22} color={PALETTE.ink.charcoal} />
          </Pressable>

          <View style={styles.headerCenter}>
            <Text style={styles.headerCategory}>{category.toUpperCase()}</Text>
            <Text style={styles.headerTitle}>Verity Guided Practice</Text>
          </View>

          <Pressable
            style={styles.speedPill}
            onPress={() =>
              setPlaybackSpeed(playbackSpeed === '1.0x' ? '1.2x' : '1.0x')
            }
          >
            <Text style={styles.speedText}>{playbackSpeed}</Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Breathing Animated Circle */}
          <View style={styles.breathingZone}>
            <View style={styles.outerGlowRing}>
              <View style={styles.middleMintRing}>
                <View style={styles.centerOrb}>
                  <Sparkles size={28} color={PALETTE.bronze.base} />
                  <Text style={styles.breathingText}>
                    {isPlaying ? 'Listen & Breathe' : 'Paused'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Practice Title & Quote */}
          <View style={styles.titleSection}>
            <Text style={styles.sessionTitle}>{title}</Text>
            <Text style={styles.sessionSubtitle}>
              “I breathe into my stillness. I release whatever does not belong to
              this moment.”
            </Text>
          </View>

          {/* Progress Bar & Timers */}
          <View style={styles.progressSection}>
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { width: `${progressPercent}%` }]}
              />
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.timeText}>{formatTime(secondsElapsed)}</Text>
              <Text style={styles.timeText}>
                -{formatTime(durationSeconds - secondsElapsed)}
              </Text>
            </View>
          </View>

          {/* Main Controls Row */}
          <View style={styles.controlsRow}>
            {/* Rewind 15s */}
            <Pressable
              onPress={() => skipSeconds(-15)}
              style={styles.skipButton}
            >
              <RotateCcw size={22} color={PALETTE.ink.charcoal} />
              <Text style={styles.skipText}>15</Text>
            </Pressable>

            {/* Play / Pause Primary Button */}
            <Pressable
              onPress={togglePlay}
              style={[styles.playButton, SHADOWS.card]}
            >
              {isPlaying ? (
                <Pause size={28} color="#FFFFFF" fill="#FFFFFF" />
              ) : (
                <Play size={28} color="#FFFFFF" fill="#FFFFFF" style={{ marginLeft: 3 }} />
              )}
            </Pressable>

            {/* Forward 15s */}
            <Pressable
              onPress={() => skipSeconds(15)}
              style={styles.skipButton}
            >
              <RotateCw size={22} color={PALETTE.ink.charcoal} />
              <Text style={styles.skipText}>15</Text>
            </Pressable>
          </View>

          {/* Ambient Background Audio Switcher */}
          <View style={styles.ambientSection}>
            <Text style={styles.ambientLabel}>AMBIENT BACKDROP</Text>
            <View style={styles.ambientRow}>
              {[
                { id: 'rain', label: 'Linen Rain', icon: CloudRain },
                { id: 'piano', label: 'Soft Piano', icon: Music },
                { id: 'wind', label: 'Breeze', icon: Wind },
              ].map((amb) => {
                const IconComponent = amb.icon;
                const active = ambientSound === amb.id;
                return (
                  <Pressable
                    key={amb.id}
                    onPress={() => {
                      if (Platform.OS !== 'web') Haptics.selectionAsync();
                      setAmbientSound(amb.id);
                    }}
                    style={[
                      styles.ambientPill,
                      active && styles.ambientPillActive,
                    ]}
                  >
                    <IconComponent
                      size={14}
                      color={
                        active ? PALETTE.bronze.base : PALETTE.ink.subtle
                      }
                    />
                    <Text
                      style={[
                        styles.ambientText,
                        active && styles.ambientTextActive,
                      ]}
                    >
                      {amb.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 24 : 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  closeButton: {
    padding: 8,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerCategory: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 10,
    color: PALETTE.bronze.base,
    letterSpacing: 1.5,
  },
  headerTitle: {
    fontFamily: FONTS.serifSemiBold,
    fontSize: 14,
    color: PALETTE.ink.charcoal,
    marginTop: 2,
  },
  speedPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: PALETTE.bronze.border,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  speedText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 11,
    color: PALETTE.bronze.base,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 40,
    alignItems: 'center',
  },
  breathingZone: {
    marginVertical: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerGlowRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(246, 214, 167, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  middleMintRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(202, 231, 211, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerOrb: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7A5230',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  breathingText: {
    fontFamily: FONTS.serifItalic,
    fontSize: 12,
    color: PALETTE.bronze.base,
    marginTop: 6,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  sessionTitle: {
    fontFamily: FONTS.serifBold,
    fontSize: 22,
    color: PALETTE.ink.charcoal,
    textAlign: 'center',
    lineHeight: 28,
  },
  sessionSubtitle: {
    fontFamily: FONTS.serifItalic,
    fontSize: 14,
    color: PALETTE.ink.muted,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: SPACING.sm,
  },
  progressSection: {
    width: '100%',
    marginBottom: SPACING.xl,
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(122, 82, 48, 0.12)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: PALETTE.bronze.base,
    borderRadius: 3,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  timeText: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: PALETTE.ink.muted,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
    marginBottom: SPACING.xxl,
  },
  skipButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  },
  skipText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 9,
    color: PALETTE.ink.charcoal,
    marginTop: -4,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: PALETTE.bronze.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ambientSection: {
    width: '100%',
    alignItems: 'center',
  },
  ambientLabel: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 10,
    letterSpacing: 1.2,
    color: PALETTE.ink.muted,
    marginBottom: SPACING.sm,
  },
  ambientRow: {
    flexDirection: 'row',
    gap: 8,
  },
  ambientPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(122, 82, 48, 0.12)',
  },
  ambientPillActive: {
    backgroundColor: PALETTE.prosecco.light,
    borderColor: PALETTE.prosecco.border,
  },
  ambientText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 11,
    color: PALETTE.ink.muted,
  },
  ambientTextActive: {
    color: PALETTE.bronze.rich,
    fontFamily: FONTS.sansSemiBold,
  },
});
