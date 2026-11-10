import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { PALETTE, FONTS, SPACING } from '@/constants/theme';
import { Sparkles } from 'lucide-react-native';

interface VerityHeaderProps {
  title?: string;
  subtitle?: string;
  streakDays?: number;
  showLogo?: boolean;
  onStreakPress?: () => void;
}

export const VerityHeader: React.FC<VerityHeaderProps> = ({
  title = 'VERITY',
  subtitle,
  streakDays,
  showLogo = true,
  onStreakPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        {showLogo && (
          <Image
            source={require('../../assets/images/verity_logo.jpg')}
            style={styles.logo}
            resizeMode="cover"
          />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.brandTitle}>{title}</Text>
          {subtitle ? (
            <Text style={styles.subtitle}>{subtitle}</Text>
          ) : (
            <Text style={styles.tagline}>MIND & INTENTION</Text>
          )}
        </View>
      </View>

      {streakDays !== undefined && (
        <Pressable
          style={styles.streakPill}
          onPress={onStreakPress}
          android_ripple={{ color: PALETTE.prosecco.light }}
        >
          <Sparkles size={14} color={PALETTE.bronze.base} />
          <Text style={styles.streakText}>{streakDays} Days</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  logo: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: PALETTE.bronze.border,
  },
  textContainer: {
    justifyContent: 'center',
  },
  brandTitle: {
    fontFamily: FONTS.serifBold,
    fontSize: 20,
    color: PALETTE.ink.charcoal,
    letterSpacing: 2,
  },
  tagline: {
    fontFamily: FONTS.sansMedium,
    fontSize: 9,
    color: PALETTE.bronze.base,
    letterSpacing: 1.5,
    marginTop: 1,
  },
  subtitle: {
    fontFamily: FONTS.serifItalic,
    fontSize: 12,
    color: PALETTE.ink.muted,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: PALETTE.prosecco.light,
    borderWidth: 1,
    borderColor: PALETTE.prosecco.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  streakText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 12,
    color: PALETTE.bronze.base,
    letterSpacing: 0.3,
  },
});
