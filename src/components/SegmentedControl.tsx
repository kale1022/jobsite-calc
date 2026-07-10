import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, fontWeight, radius, spacing } from '@/theme';
import type { CalcSelectOption } from '@/types';

interface Props {
  label: string;
  options: CalcSelectOption[];
  value: number;
  onChange: (value: number) => void;
}

export function SegmentedControl({ label, options, value, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => onChange(opt.value)}
              style={[styles.segment, active && styles.segmentActive]}
            >
              <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
  label: { color: colors.textMuted, fontSize: fontSize.sm },
  row: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.xs,
    gap: spacing.xs,
  },
  segment: {
    flex: 1,
    height: 44,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: colors.primary,
  },
  segmentText: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  segmentTextActive: {
    color: colors.onPrimary,
    fontWeight: fontWeight.semibold,
  },
});
