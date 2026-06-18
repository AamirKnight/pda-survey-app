import { colors } from '../theme/theme';

/**
 * Centralizes the "what color means what" logic so Dashboard, History,
 * and SurveyList never drift out of sync with each other.
 */
export type SurveyStatusKey =
  | 'Verified'
  | 'Data Mismatch'
  | 'Unauthorized Construction'
  | 'Unauthorized Property'
  | 'New Property Identified'
  | 'Active'
  | 'Under Review'
  | 'Pending'
  | 'No Action Required'
  | 'Warning Recommended'
  | 'Challan Recommended';

interface StatusStyle {
  color: string;
  tint: string;
  icon: string;
}

const STATUS_MAP: Record<string, StatusStyle> = {
  Verified: { color: colors.success, tint: colors.successTint, icon: 'checkmark-circle' },
  Active: { color: colors.success, tint: colors.successTint, icon: 'checkmark-circle' },
  'No Action Required': { color: colors.success, tint: colors.successTint, icon: 'checkmark-circle' },

  'Data Mismatch': { color: colors.warning, tint: colors.warningTint, icon: 'alert-circle' },
  'Under Review': { color: colors.warning, tint: colors.warningTint, icon: 'time' },
  Pending: { color: colors.warning, tint: colors.warningTint, icon: 'time' },
  'Warning Recommended': { color: colors.warning, tint: colors.warningTint, icon: 'alert-circle' },

  'Unauthorized Construction': { color: colors.error, tint: colors.errorTint, icon: 'close-circle' },
  'Unauthorized Property': { color: colors.error, tint: colors.errorTint, icon: 'close-circle' },
  'Challan Recommended': { color: colors.error, tint: colors.errorTint, icon: 'close-circle' },

  'New Property Identified': { color: colors.info, tint: colors.infoTint, icon: 'add-circle' },
};

const FALLBACK: StatusStyle = { color: colors.textSecondary, tint: colors.divider, icon: 'ellipse' };

export function getStatusStyle(status?: string | null): StatusStyle {
  if (!status) return FALLBACK;
  return STATUS_MAP[status] ?? FALLBACK;
}