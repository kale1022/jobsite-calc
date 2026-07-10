import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from './Card';
import { colors, fontSize, fontWeight, spacing } from '@/theme';
import type { ResultLine } from '@/types';

interface Props {
  results: ResultLine[];
  note?: string;
}

export function ResultCard({ results, note }: Props) {
  return (
    <Card style={styles.card}>
      {results.map((line, i) => (
        <View key={i}>
          {i > 0 && <View style={styles.divider} />}
          <View style={styles.row}>
            <Text style={styles.label}>{line.label}</Text>
            <Text style={[styles.value, line.emphasis && styles.valueEmphasis]}>
              {line.value}
            </Text>
          </View>
        </View>
      ))}
      {note ? <Text style={styles.note}>{note}</Text> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { borderColor: colors.primary },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  label: { color: colors.textMuted, fontSize: fontSize.md },
  value: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    fontVariant: ['tabular-nums'],
  },
  valueEmphasis: {
    color: colors.primary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  note: {
    color: colors.textFaint,
    fontSize: fontSize.xs,
    marginTop: spacing.sm,
    lineHeight: 16,
  },
});
