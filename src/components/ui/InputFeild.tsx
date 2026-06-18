import React, { useState } from 'react';
import {
    NativeSyntheticEvent,
    StyleSheet,
    Text,
    TextInput,
    TextInputFocusEventData,
    TextInputProps,
    View,
} from 'react-native';
import { colors, radius, spacing, typography } from '../../theme/theme';

export interface InputFieldProps extends TextInputProps {
  label: string;
  optional?: boolean;
  error?: string;
  helperText?: string;
}

/**
 * Label sits above the field permanently (a "static floating" label) —
 * this reads faster than an animated float for one-handed outdoor use,
 * and never overlaps the value once filled in.
 */
export default function InputField({
  label,
  optional,
  error,
  helperText,
  onFocus,
  onBlur,
  style,
  multiline,
  ...rest
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);

  const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setFocused(true);
    onFocus?.(e);
  };
  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setFocused(false);
    onBlur?.(e);
  };

  const borderColor = error ? colors.error : focused ? colors.primary : colors.border;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {optional && <Text style={styles.optional}>Optional</Text>}
      </View>
      <TextInput
        {...rest}
        multiline={multiline}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholderTextColor={colors.textTertiary}
        style={[
          styles.input,
          { borderColor, borderWidth: focused || error ? 1.5 : 1 },
          multiline ? styles.multiline : null,
          style as any,
        ]}
      />
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.lg },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  label: { ...typography.label, color: colors.textPrimary },
  optional: { ...typography.caption, color: colors.textTertiary },
  input: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...typography.bodyMedium,
    color: colors.textPrimary,
    minHeight: 48,
  },
  multiline: { minHeight: 100, textAlignVertical: 'top' },
  errorText: { ...typography.caption, color: colors.error, marginTop: spacing.xs },
  helperText: { ...typography.caption, color: colors.textTertiary, marginTop: spacing.xs },
});