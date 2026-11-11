/**
 * Portal 11:11 Design System Tokens
 * Cosmic Luxury • Deep Indigo • Midnight Black • Sacred Gold Accents
 */

export const PALETTE = {
  // Cosmic Portal 11:11 Theme
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

  // Sacred Gold Accents
  gold: {
    light: '#FFFBEB',
    radiant: '#FDE68A',
    base: '#F5D061',
    rich: '#E5B842',
    deep: '#D4AF37',
    bronze: '#B45309',
    glow: 'rgba(245, 208, 97, 0.35)',
    border: 'rgba(245, 208, 97, 0.25)',
  },

  // Glassmorphic Surfaces
  glass: {
    card: 'rgba(26, 20, 56, 0.70)',
    cardBorder: 'rgba(245, 208, 97, 0.16)',
    cardBorderHover: 'rgba(245, 208, 97, 0.40)',
    input: 'rgba(11, 8, 25, 0.65)',
    glow: 'rgba(159, 122, 234, 0.12)',
    subtle: 'rgba(255, 255, 255, 0.06)',
  },

  // Brand Pastels & Accents
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

  bronze: {
    subtle: '#F5EFE9',
    tint: '#C4A485',
    base: '#7A5230',
    rich: '#5C3E1E',
    deep: '#3D2714',
    border: 'rgba(122, 82, 48, 0.15)',
    glow: 'rgba(122, 82, 48, 0.10)',
  },

  paper: {
    linen: '#0B0819', // Default dark cosmic backdrop
    warmWhite: '#FFFFFF',
    ivory: '#F4EFEA',
    card: '#161131',
    cardBorder: 'rgba(245, 208, 97, 0.12)',
  },

  velvet: {
    night: '#080612',
    surface: '#120E2E',
    card: '#1C1542',
    border: 'rgba(245, 208, 97, 0.20)',
  },

  ink: {
    charcoal: '#F3F0FB',
    body: '#D1CDDA',
    muted: '#9CA3AF',
    subtle: '#6B7280',
    light: '#FFFFFF',
    lightMuted: '#C4B5FD',
  },
} as const;

export const THEME = {
  dark: {
    background: PALETTE.portal.deepIndigo,
    surface: PALETTE.portal.indigoSurface,
    surfaceSecondary: PALETTE.portal.cosmicPurple,
    card: PALETTE.glass.card,
    border: PALETTE.glass.cardBorder,
    borderStrong: PALETTE.gold.border,
    textPrimary: '#FFFFFF',
    textSecondary: PALETTE.ink.body,
    textMuted: PALETTE.ink.muted,
    accent: PALETTE.gold.base,
    accentSubtle: 'rgba(245, 208, 97, 0.12)',
    tabBarBackground: 'rgba(8, 6, 18, 0.94)',
    tabBarActive: PALETTE.gold.base,
    tabBarInactive: '#8B87A8',
    highlight: PALETTE.gold.base,
  },
  light: {
    background: '#FAF8F5',
    surface: '#FFFFFF',
    surfaceSecondary: '#F4EFEA',
    card: '#FFFFFF',
    border: 'rgba(122, 82, 48, 0.08)',
    borderStrong: PALETTE.bronze.border,
    textPrimary: '#232120',
    textSecondary: '#4A4642',
    textMuted: '#736F6B',
    accent: PALETTE.bronze.base,
    accentSubtle: PALETTE.bronze.subtle,
    tabBarBackground: 'rgba(250, 248, 245, 0.94)',
    tabBarActive: PALETTE.bronze.base,
    tabBarInactive: '#9E9891',
    highlight: PALETTE.prosecco.base,
  },
};

export const FONTS = {
  serif: 'PlayfairDisplay_400Regular',
  serifSemiBold: 'PlayfairDisplay_600SemiBold',
  serifBold: 'PlayfairDisplay_700Bold',
  serifItalic: 'PlayfairDisplay_400Regular_Italic',
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
  sm: 6,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 9999,
};

export const SHADOWS = {
  subtle: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  cosmicGlow: {
    shadowColor: PALETTE.gold.base,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 6,
  },
};
