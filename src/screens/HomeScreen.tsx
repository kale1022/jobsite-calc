import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { CALCULATORS } from '@/calculators';
import { useEntitlement } from '@/iap/useEntitlement';
import { colors, fontSize, fontWeight, radius, spacing } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';
import type { CalculatorDef } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

function CalcRow({
  calc,
  locked,
  onPress,
}: {
  calc: CalculatorDef;
  locked: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.iconTile}>
        <MaterialCommunityIcons name={calc.icon as IconName} size={22} color={colors.primary} />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{calc.title}</Text>
        <Text style={styles.rowSubtitle} numberOfLines={1}>
          {calc.subtitle}
        </Text>
      </View>
      <MaterialCommunityIcons
        name={locked ? 'lock' : 'chevron-right'}
        size={locked ? 16 : 22}
        color={locked ? colors.primary : colors.textFaint}
      />
    </Pressable>
  );
}

export function HomeScreen({ navigation }: Props) {
  const { isPremium } = useEntitlement();

  const free = CALCULATORS.filter((c) => !c.premium);
  const pro = CALCULATORS.filter((c) => c.premium);

  const openCalculator = (calc: CalculatorDef) => {
    if (calc.premium && !isPremium) {
      navigation.navigate('Paywall');
    } else {
      navigation.navigate('Calculator', { calculatorId: calc.id });
    }
  };

  const renderGroup = (items: CalculatorDef[]) => (
    <View style={styles.group}>
      {items.map((calc, i) => (
        <View key={calc.id}>
          {i > 0 && <View style={styles.divider} />}
          <CalcRow
            calc={calc}
            locked={calc.premium && !isPremium}
            onPress={() => openCalculator(calc)}
          />
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>JobSite Calc</Text>
          <Text style={styles.subtitle}>Material estimates in seconds</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            onPress={() => (isPremium ? navigation.navigate('Projects') : navigation.navigate('Paywall'))}
            hitSlop={12}
          >
            <MaterialCommunityIcons name="clipboard-list-outline" size={24} color={colors.textMuted} />
          </Pressable>
          <Pressable onPress={() => navigation.navigate('Settings')} hitSlop={12}>
            <MaterialCommunityIcons name="cog-outline" size={24} color={colors.textMuted} />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        <Text style={styles.sectionLabel}>ESSENTIALS</Text>
        {renderGroup(free)}

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>PRO TOOLKIT</Text>
          {!isPremium && (
            <Pressable onPress={() => navigation.navigate('Paywall')} hitSlop={8}>
              <Text style={styles.unlockLink}>UNLOCK</Text>
            </Pressable>
          )}
        </View>
        {renderGroup(pro)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerActions: { flexDirection: 'row', gap: spacing.lg },
  title: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  list: { padding: spacing.lg, paddingTop: spacing.sm, gap: spacing.sm },
  sectionLabel: {
    color: colors.textFaint,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    letterSpacing: 1.2,
    marginTop: spacing.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  unlockLink: {
    color: colors.primary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    letterSpacing: 1.2,
    marginTop: spacing.sm,
  },
  group: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  pressed: { backgroundColor: colors.surfaceAlt },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginLeft: spacing.md + 40 + spacing.md,
  },
  iconTile: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { flex: 1 },
  rowTitle: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  rowSubtitle: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginTop: 1,
  },
});
