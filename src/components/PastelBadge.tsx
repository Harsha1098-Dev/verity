import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { PALETTE, FONTS } from '@/constants/theme';

export type PastelColor =
  | 'berriesCream'
  | 'prosecco'
  | 'deltaMint'
  | 'polarOpposite'
  | 'foggyLove';

interface PastelBadgeProps {
  label: string;
  color?: PastelColor;
  active?: boolean;
  style?: ViewStyle;
}

export const PastelBadge: React.FC<PastelBadgeProps> = ({
  label,
  color = 'prosecco',
  active = false,
  style,
}) => {
  const paletteColor = PALETTE[color];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: active ? paletteColor.base : paletteColor.light,
          borderColor: paletteColor.border,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: active ? '#232120' : PALETTE.ink.charcoal,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: FONTS.sansMedium,
    fontSize: 11,
    letterSpacing: 0.4,
  },
});
