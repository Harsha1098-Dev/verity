import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Bookmark, Sparkles } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { PALETTE, FONTS, SPACING, RADII, SHADOWS } from '@/constants/theme';
import { PastelBadge, PastelColor } from './PastelBadge';

interface AffirmationCardProps {
  affirmation: string;
  category: string;
  themeColor?: PastelColor;
  audioDuration?: string;
  onPlayPress?: () => void;
  onSavePress?: () => void;
  isSaved?: boolean;
}

export const AffirmationCard: React.FC<AffirmationCardProps> = ({
  affirmation,
  category,
  themeColor = 'prosecco',
  audioDuration = '3 min practice',
  onPlayPress,
  onSavePress,
  isSaved = false,
}) => {
  const currentPalette = PALETTE[themeColor];

  const handlePlay = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPlayPress?.();
  };

  const handleSave = () => {
    Haptics.selectionAsync();
    onSavePress?.();
  };

  return (
    <View style={[styles.container, SHADOWS.card]}>
      <LinearGradient
        colors={[currentPalette.light, '#FFFFFF', PALETTE.paper.linen]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Top Badges */}
        <View style={styles.topRow}>
          <PastelBadge label={category.toUpperCase()} color={themeColor} />
          <Pressable
            onPress={handleSave}
            hitSlop={12}
            style={styles.iconButton}
          >
            <Bookmark
              size={18}
              color={isSaved ? PALETTE.bronze.base : PALETTE.ink.muted}
              fill={isSaved ? PALETTE.bronze.base : 'none'}
            />
          </Pressable>
        </View>

        {/* Decorative Quote Mark */}
        <Text style={styles.quoteMark}>“</Text>

        {/* Affirmation Text */}
        <Text style={styles.affirmationText}>{affirmation}</Text>

        {/* Bottom Audio Action */}
        <View style={styles.footerRow}>
          <Pressable
            style={[styles.audioPill, { borderColor: currentPalette.border }]}
            onPress={handlePlay}
            android_ripple={{ color: currentPalette.light }}
          >
            <View
              style={[
                styles.playIconCircle,
                { backgroundColor: PALETTE.bronze.base },
              ]}
            >
              <Play size={11} color="#FFFFFF" fill="#FFFFFF" />
            </View>
            <Text style={styles.audioDurationText}>{audioDuration}</Text>
          </Pressable>

          <View style={styles.sparkleRow}>
            <Sparkles size={13} color={currentPalette.dark} />
            <Text style={styles.dailyTag}>TODAY’S ANCHOR</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: RADII.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: PALETTE.bronze.border,
    marginVertical: SPACING.md,
  },
  gradient: {
    padding: SPACING.xl,
    minHeight: 220,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    padding: 6,
  },
  quoteMark: {
    fontFamily: FONTS.serifBold,
    fontSize: 48,
    color: PALETTE.bronze.tint,
    lineHeight: 48,
    marginTop: 4,
    opacity: 0.45,
  },
  affirmationText: {
    fontFamily: FONTS.serif,
    fontSize: 22,
    lineHeight: 32,
    color: PALETTE.ink.charcoal,
    letterSpacing: 0.2,
    marginTop: -16,
    marginBottom: SPACING.lg,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(122, 82, 48, 0.08)',
  },
  audioPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 24,
    borderWidth: 1,
  },
  playIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 1,
  },
  audioDurationText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 12,
    color: PALETTE.ink.charcoal,
  },
  sparkleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dailyTag: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 10,
    letterSpacing: 1,
    color: PALETTE.bronze.base,
  },
});
