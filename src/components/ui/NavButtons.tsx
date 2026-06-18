import React from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '../../theme/theme';
import Button from './Button';

interface NavButtonsProps {
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  loading?: boolean;
  nextDisabled?: boolean;
}

export default function NavButtons({
  onBack,
  onNext,
  nextLabel = 'Continue',
  loading = false,
  nextDisabled = false,
}: NavButtonsProps) {
  return (
    <View style={styles.row}>
      <View style={styles.back}>
        <Button label="Back" onPress={onBack} variant="secondary" size="md" icon="arrow-back" />
      </View>
      <View style={styles.next}>
        <Button
          label={nextLabel}
          onPress={onNext}
          variant="primary"
          size="md"
          icon="arrow-forward"
          iconPosition="right"
          loading={loading}
          disabled={nextDisabled}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  back: { flex: 1 },
  next: { flex: 2 },
});