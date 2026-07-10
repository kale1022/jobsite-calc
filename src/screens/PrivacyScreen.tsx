import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { Card, ScreenContainer } from '@/components';
import { colors, fontSize, fontWeight, spacing } from '@/theme';

export function PrivacyScreen() {
  return (
    <ScreenContainer scroll>
      <Card>
        <Text style={styles.heading}>Privacy Policy</Text>
        <Text style={styles.date}>Effective July 10, 2026</Text>
        <Text style={styles.body}>
          JobSite Calc does not collect, store, or transmit any personal data. There are no
          accounts, no analytics, no advertising, and no network requests made by the app.
        </Text>
        <Text style={styles.body}>
          <Text style={styles.bold}>Calculations</Text> happen entirely on your device.
        </Text>
        <Text style={styles.body}>
          <Text style={styles.bold}>Projects</Text> you save are stored only on this device. They
          are never uploaded anywhere and are deleted when you delete the app.
        </Text>
        <Text style={styles.body}>
          <Text style={styles.bold}>Purchases</Text> are processed by Apple through your Apple ID.
          We never see your payment information. Purchase state is stored only on your device and
          in your Apple account.
        </Text>
        <Text style={styles.body}>
          Because the app collects nothing, there is nothing to delete, sell, or share. If this
          policy ever changes, the update will be posted here before taking effect.
        </Text>
      </Card>
      <Card>
        <Text style={styles.heading}>Disclaimer</Text>
        <Text style={styles.body}>
          Estimates use standard trade formulas and typical waste factors. Always verify
          quantities against actual site conditions before ordering materials.
        </Text>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heading: { color: colors.text, fontSize: fontSize.lg, fontWeight: fontWeight.semibold },
  date: { color: colors.textFaint, fontSize: fontSize.xs },
  body: { color: colors.textMuted, fontSize: fontSize.sm, lineHeight: 20 },
  bold: { color: colors.text, fontWeight: fontWeight.semibold },
});
