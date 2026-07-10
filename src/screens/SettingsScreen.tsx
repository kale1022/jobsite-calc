import React, { useState } from 'react';
import { Alert, Linking, StyleSheet, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppButton, Card, ScreenContainer } from '@/components';
import { useEntitlement } from '@/iap/useEntitlement';
import { colors, fontSize, fontWeight, spacing } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';

const SUPPORT_EMAIL = 'guymonapps+jobsitecalc@gmail.com';
const SUPPORT_URL = 'https://kale1022.github.io/jobsite-calc/';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export function SettingsScreen({ navigation }: Props) {
  const { isPremium, restore } = useEntitlement();
  const [restoring, setRestoring] = useState(false);

  const handleRestore = async () => {
    setRestoring(true);
    try {
      const owned = await restore();
      Alert.alert(
        owned ? 'Restored' : 'Nothing to restore',
        owned
          ? 'All calculators are unlocked.'
          : 'No previous purchase was found for this Apple ID.',
      );
    } catch {
      Alert.alert('Restore failed', 'Could not reach the App Store. Try again later.');
    } finally {
      setRestoring(false);
    }
  };

  return (
    <ScreenContainer scroll>
      <Card>
        <Text style={styles.cardTitle}>Purchase</Text>
        <Text style={styles.status}>
          {isPremium
            ? 'PRO unlocked — all calculators & projects ✓'
            : 'Free version — 2 of 8 calculators'}
        </Text>
        <AppButton
          title="Restore Purchases"
          variant="ghost"
          onPress={handleRestore}
          loading={restoring}
        />
      </Card>

      <Card>
        <Text style={styles.cardTitle}>About</Text>
        <Text style={styles.body}>
          Every estimate uses standard trade formulas and includes typical waste factors.
          Always confirm quantities against site conditions before ordering.
        </Text>
        <AppButton
          title="Privacy Policy"
          variant="ghost"
          onPress={() => navigation.navigate('Privacy')}
        />
        <AppButton
          title="Contact Support"
          variant="ghost"
          onPress={async () => {
            try {
              await Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=JobSite%20Calc`);
            } catch {
              // No mail app configured — show the address and offer the web page.
              Alert.alert('Contact Support', `Email us at:\n${SUPPORT_EMAIL}`, [
                { text: 'Open Support Page', onPress: () => Linking.openURL(SUPPORT_URL) },
                { text: 'OK', style: 'cancel' },
              ]);
            }
          }}
        />
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  cardTitle: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  status: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    marginBottom: spacing.sm,
  },
  body: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
});
