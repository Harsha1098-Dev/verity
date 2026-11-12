/**
 * Verity Mindfulness & Manifestation Design System
 * Luxury Editorial Paper & Bronze Design System Tokens
 */

export const PALETTE = {
  // Brand Pastels
  berriesCream: {
    light: '#FDF2F5',
    base: '#F2BAC7',
    dark: '#D88A9F',
    border: '#E99FAF',
    glass: 'rgba(242, 186, 199, 0.25)',
  },
  prosecco: {
    light: '#FCF5EA',
    base: '#F6D6A7',
    dark: '#DCAB68',
    border: '#E8BF82',
    glass: 'rgba(246, 214, 167, 0.25)',
  },
  deltaMint: {
    light: '#EFF8F3',
    base: '#CAE7D3',
    dark: '#96CEA7',
    border: '#B2DEC0',
    glass: 'rgba(202, 231, 211, 0.25)',
  },
  polarOpposite: {
    light: '#EFF5FC',
    base: '#C0D8F2',
    dark: '#8EBCE4',
    border: '#A6C7EB',
    glass: 'rgba(192, 216, 242, 0.25)',
  },
  foggyLove: {
    light: '#F5EFFB',
    base: '#D8C6EB',
    dark: '#AF92D5',
    border: '#C7AFE2',
    glass: 'rgba(216, 198, 235, 0.25)',
  },

  // Primary Accent & Line Art (Matches Verity Emblem)
  bronze: {
    subtle: '#F5EFE9',
    tint: '#C4A485',
    base: '#7A5230',
    rich: '#5C3E1E',
    deep: '#3D2714',
    border: 'rgba(122, 82, 48, 0.15)',
    glow: 'rgba(122, 82, 48, 0.10)',
  },

  // Gold Accents
  gold: {
    light: '#FCF5EA',
    radiant: '#F6D6A7',
    base: '#D4AF37',
    rich: '#B48A28',
    deep: '#7A5230',
    bronze: '#7A5230',
    glow: 'rgba(212, 175, 55, 0.25)',
    border: 'rgba(122, 82, 48, 0.18)',
  },

  // Editorial Paper & Atmosphere
  paper: {
    linen: '#FAF8F5',
    warmWhite: '#FFFFFF',
    ivory: '#F4EFEA',
    card: '#FFFFFF',
    cardBorder: 'rgba(122, 82, 48, 0.08)',
  },

  // Dark Velvet Atmosphere
  velvet: {
    night: '#121118',
    surface: '#1A1822',
    card: '#221F2C',
    border: 'rgba(246, 214, 167, 0.12)',
  },

  // Monochromes & Typography
  ink: {
    charcoal: '#232120',
    body: '#4A4642',
    muted: '#736F6B',
    subtle: '#A8A29D',
    light: '#FFFFFF',
    lightMuted: '#B8B3CE',
  },

  portal: {
    midnight: '#05040A',
    deepIndigo: '#0B0819',
    indigoSurface: '#120E2E',
    cosmicPurple: '#2A164D',
    vibrantPurple: '#431B75',
    royalViolet: '#6B21A8',
    starlightGlow: '#9F7AEA',
    auroraCyan: '#38BDF8',
    emeraldLife: '#10B981',
  },
} as const;

export const THEME = {
  light: {
    background: PALETTE.paper.linen,
    surface: PALETTE.paper.warmWhite,
    surfaceSecondary: PALETTE.paper.ivory,
    card: PALETTE.paper.card,
    border: PALETTE.paper.cardBorder,
    borderStrong: PALETTE.bronze.border,
    textPrimary: PALETTE.ink.charcoal,
    textSecondary: PALETTE.ink.body,
    textMuted: PALETTE.ink.muted,
    accent: PALETTE.bronze.base,
    accentSubtle: PALETTE.bronze.subtle,
    tabBarBackground: 'rgba(250, 248, 245, 0.94)',
    tabBarActive: PALETTE.bronze.base,
    tabBarInactive: '#9E9891',
    highlight: PALETTE.prosecco.base,
  },
  dark: {
    background: PALETTE.velvet.night,
    surface: PALETTE.velvet.surface,
    surfaceSecondary: PALETTE.velvet.card,
    card: PALETTE.velvet.card,
    border: PALETTE.velvet.border,
    borderStrong: 'rgba(246, 214, 167, 0.25)',
    textPrimary: '#F7F5F2',
    textSecondary: '#D1CDDA',
    textMuted: PALETTE.ink.lightMuted,
    accent: PALETTE.prosecco.base,
    accentSubtle: 'rgba(246, 214, 167, 0.15)',
    tabBarBackground: 'rgba(18, 17, 24, 0.94)',
    tabBarActive: PALETTE.prosecco.base,
    tabBarInactive: '#7C778B',
    highlight: PALETTE.berriesCream.base,
  },
};

export const FONTS = {
  // Editorial Serif Headers (Playfair Display)
  serif: 'PlayfairDisplay_400Regular',
  serifSemiBold: 'PlayfairDisplay_600SemiBold',
  serifBold: 'PlayfairDisplay_700Bold',
  serifItalic: 'PlayfairDisplay_400Regular_Italic',

  // Modern Clean Sans Body (Inter)
  sansLight: 'Inter_300Light',
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemiBold: 'Inter_600SemiBold',
  sansBold: 'Inter_700Bold',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const RADII = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  full: 9999,
  pill: 9999,
};

export const SHADOWS = {
  subtle: {
    shadowColor: '#7A5230',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  card: {
    shadowColor: '#7A5230',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  float: {
    shadowColor: '#5C3E1E',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8,
  },
  cosmicGlow: {
    shadowColor: '#7A5230',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
};
