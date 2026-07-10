import React from 'react';
import { StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native';
import { colors, fontSize, radius, spacing } from '@/theme';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  label: string;
  unit?: string;
  placeholder?: string;
  style?: ViewStyle;
}

/** Numeric input with a fixed unit suffix, sized for gloved thumbs. */
export function TextField({ value, onChangeText, label, unit, placeholder, style }: Props) {
  return (
    <View style={[styles.wrap, style]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textFaint}
          keyboardType="decimal-pad"
          style={styles.input}
        />
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
  label: { color: colors.textMuted, fontSize: fontSize.sm },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 54,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: fontSize.lg,
    height: '100%',
  },
  unit: {
    color: colors.textFaint,
    fontSize: fontSize.md,
    marginLeft: spacing.sm,
  },
});
