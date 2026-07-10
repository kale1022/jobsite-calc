/**
 * JobSite Calc palette — charcoal + safety orange, dark-first.
 * Orange = action/brand (hi-vis jobsite vibe), charcoal = surfaces.
 */
export const palette = {
  // charcoal
  gray950: '#111214',
  gray900: '#17181B',
  gray800: '#1F2125',
  gray700: '#2A2D33',
  gray600: '#3A3E46',

  // safety orange
  orange600: '#E85D04',
  orange500: '#F48C06',
  orange400: '#FAA307',
  orange300: '#FFBA3B',

  // neutrals / state
  white: '#FFFFFF',
  black: '#000000',
  green500: '#22C55E',
  danger: '#EF4444',
  warning: '#F59E0B',
};

export const colors = {
  // surfaces
  background: palette.gray950,
  surface: palette.gray900,
  surfaceAlt: palette.gray800,
  border: palette.gray700,

  // brand / action
  primary: palette.orange500,
  primaryStrong: palette.orange600,
  primarySoft: palette.orange300,

  // text
  text: '#F4F4F5',
  textMuted: '#A1A1AA',
  textFaint: '#63636B',
  onPrimary: '#1A1000',

  // state
  success: palette.green500,
  danger: palette.danger,
  warning: palette.warning,

  white: palette.white,
  black: palette.black,
  overlay: 'rgba(0, 0, 0, 0.6)',
};

export type AppColors = typeof colors;
