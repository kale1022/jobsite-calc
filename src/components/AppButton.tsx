import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, fontSize, fontWeight, radius, spacing } from '@/theme';

type Variant = 'primary' | 'ghost';

interface Props {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

const BG: Record<Variant, string> = {
  primary: colors.primary,
  ghost: 'transparent',
};

const FG: Record<Variant, string> = {
  primary: colors.onPrimary,
  ghost: colors.text,
};

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}: Props) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: BG[variant] },
        variant === 'ghost' && styles.ghost,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={FG[variant]} />
      ) : (
        <Text style={[styles.label, { color: FG[variant] }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  ghost: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
  label: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
});
