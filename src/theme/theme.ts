
import { Platform } from 'react-native';

// ---------------------------------------------------------------------------
// Color
// ---------------------------------------------------------------------------
export const colors = {
  // Brand — premium Bhagwa/saffron, used as an accent, not a wash
  primary: '#F57C00',
  primaryDark: '#C25E00',
  primaryDarker: '#8F4400',
  primaryLight: '#FFB74D',
  primaryTint: '#FFF3E0', // for soft backgrounds/badges

  secondary: '#FFFFFF',

  // Neutrals
  surface: '#FAFAFA',
  background: '#F5F5F5',
  card: '#FFFFFF',
  border: '#E6E6E6',
  divider: '#EFEFEF',

  // Text
  textPrimary: '#1A1A1A',
  textSecondary: '#666666',
  textTertiary: '#9B9B9B',
  textOnPrimary: '#FFFFFF',

  // Semantic
  success: '#2E7D32',
  successTint: '#E8F5E9',
  warning: '#ED6C02',
  warningTint: '#FFF4E5',
  error: '#D32F2F',
  errorTint: '#FDECEA',
  info: '#0277BD',
  infoTint: '#E3F2FD',

  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(20,20,20,0.55)',
  skeleton: '#E9E9E9',
  skeletonHighlight: '#F6F6F6',
};

// ---------------------------------------------------------------------------
// Spacing — 4px base unit
// ---------------------------------------------------------------------------
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
};

// ---------------------------------------------------------------------------
// Radius
// ---------------------------------------------------------------------------
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
};

// ---------------------------------------------------------------------------
// Typography — sized for outdoor legibility (slightly larger body sizes,
// strong weight contrast so hierarchy reads at a glance in bright sunlight)
// ---------------------------------------------------------------------------
const fontFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

export const typography = {
  fontFamily,
  display: { fontSize: 30, fontWeight: '800' as const, lineHeight: 36, letterSpacing: -0.3 },
  h1: { fontSize: 24, fontWeight: '800' as const, lineHeight: 30 },
  h2: { fontSize: 20, fontWeight: '700' as const, lineHeight: 26 },
  h3: { fontSize: 17, fontWeight: '700' as const, lineHeight: 22 },
  titleLarge: { fontSize: 16, fontWeight: '700' as const, lineHeight: 22 },
  titleMedium: { fontSize: 15, fontWeight: '600' as const, lineHeight: 20 },
  bodyLarge: { fontSize: 16, fontWeight: '400' as const, lineHeight: 23 },
  bodyMedium: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  bodySmall: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
  label: { fontSize: 13, fontWeight: '600' as const, lineHeight: 18 },
  caption: { fontSize: 12, fontWeight: '500' as const, lineHeight: 16 },
  overline: { fontSize: 11, fontWeight: '700' as const, lineHeight: 14, letterSpacing: 1.2 },
};

// ---------------------------------------------------------------------------
// Elevation — paired iOS shadow + Android elevation presets
// ---------------------------------------------------------------------------
export const elevation = {
  none: {},
  xs: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOpacity: 0.04,
      shadowRadius: 2,
      shadowOffset: { width: 0, height: 1 },
    },
    android: { elevation: 1 },
    default: {},
  }),
  sm: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
    },
    android: { elevation: 3 },
    default: {},
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
    },
    android: { elevation: 6 },
    default: {},
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOpacity: 0.12,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 8 },
    },
    android: { elevation: 12 },
    default: {},
  }),
};

// ---------------------------------------------------------------------------
// Motion — shared timing/easing so animations feel consistent app-wide
// ---------------------------------------------------------------------------
export const motion = {
  fast: 120,
  base: 200,
  slow: 320,
};

// ---------------------------------------------------------------------------
// Touch targets (accessibility)
// ---------------------------------------------------------------------------
export const minTouchTarget = 44;

// Approx. height of the floating bottom tab bar + its outer margin.
// Scrollable screens add this as bottom padding so content never sits
// underneath the floating nav (or the home indicator behind it).
export const tabBarClearance = 96;

export const theme = { colors, spacing, radius, typography, elevation, motion, minTouchTarget, tabBarClearance };

export type Theme = typeof theme;
export default theme;