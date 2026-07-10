import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { CALCULATORS } from '@/calculators';
import { AppButton, Card, ScreenContainer } from '@/components';
import { useEntitlement } from '@/iap/useEntitlement';
import { colors, fontSize, fontWeight, spacing } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Paywall'>;

export function PaywallScreen({ navigation }: Props) {
  const { isPremium, price, purchasing, purchase, restore } = useEntitlement();
  const [restoring, setRestoring] = useState(false);

  const premiumCalcs = CALCULATORS.filter((c) => c.premium);

  // Purchase completed while this screen is open — close it.
  React.useEffect(() => {
    if (isPremium) navigation.goBack();
  }, [isPremium, navigation]);

  const handleRestore = async () => {
    setRestoring(true);
    try {
      const owned = await restore();
      if (!owned) {
        Alert.alert('Nothing to restore', 'No previous purchase was found for this Apple ID.');
      }
    } catch {
      Alert.alert('Restore failed', 'Could not reach the App Store. Try again later.');
    } finally {
      setRestoring(false);
    }
  };

  return (
    <ScreenContainer scroll contentStyle={styles.content}>
      <Text style={styles.headline}>Unlock every calculator</Text>
      <Text style={styles.sub}>
        One-time purchase. No subscription, no account, works fully offline.
      </Text>

      <Card style={styles.listCard}>
        <View style={styles.row}>
          <MaterialCommunityIcons name="clipboard-list-outline" size={20} color={colors.primary} />
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Projects & Shopping Lists</Text>
            <Text style={styles.rowSubtitle}>
              Save estimates per job, get one combined materials list to share
            </Text>
          </View>
          <MaterialCommunityIcons name="check" size={18} color={colors.success} />
        </View>
        {premiumCalcs.map((c) => (
          <View key={c.id} style={styles.row}>
            <MaterialCommunityIcons
              name={c.icon as keyof typeof MaterialCommunityIcons.glyphMap}
              size={20}
              color={colors.primary}
            />
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>{c.title}</Text>
              <Text style={styles.rowSubtitle}>{c.subtitle}</Text>
            </View>
            <MaterialCommunityIcons name="check" size={18} color={colors.success} />
          </View>
        ))}
      </Card>

      <AppButton
        title={price ? `Unlock All — ${price}` : 'Unlock All'}
        onPress={() => {
          if (!price) {
            Alert.alert(
              'Store not available',
              'The product has not loaded from the App Store. During development this only works when the app is launched from Xcode (which applies the local StoreKit test configuration).',
            );
            return;
          }
          purchase();
        }}
        loading={purchasing}
      />
      <AppButton title="Restore Purchases" variant="ghost" onPress={handleRestore} loading={restoring} />
      <Text style={styles.fine}>
        Payment is charged to your Apple ID. The unlock is tied to your Apple ID and can be
        restored on any device.
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.xl },
  headline: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    textAlign: 'center',
  },
  sub: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  listCard: { gap: spacing.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
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
  },
  fine: {
    color: colors.textFaint,
    fontSize: fontSize.xs,
    textAlign: 'center',
    lineHeight: 16,
    marginTop: spacing.sm,
  },
});
