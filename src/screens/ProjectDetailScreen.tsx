import React, { useEffect } from 'react';
import { Alert, Share, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppButton, Card, ScreenContainer } from '@/components';
import {
  aggregateShoppingList,
  shoppingListText,
  useProjects,
} from '@/projects/ProjectsContext';
import { colors, fontSize, fontWeight, spacing } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ProjectDetail'>;

export function ProjectDetailScreen({ navigation, route }: Props) {
  const { projects, removeItem } = useProjects();
  const project = projects.find((p) => p.id === route.params.projectId);

  useEffect(() => {
    if (project) navigation.setOptions({ title: project.name });
  }, [navigation, project]);

  if (!project) return <ScreenContainer><View /></ScreenContainer>;

  const shopping = aggregateShoppingList(project.items);

  const share = () => {
    Share.share({ message: shoppingListText(project.name, shopping) }).catch(() => {});
  };

  const confirmRemove = (itemId: string, title: string) => {
    Alert.alert('Remove estimate', `Remove "${title}" from this project?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeItem(project.id, itemId) },
    ]);
  };

  return (
    <ScreenContainer scroll>
      {shopping.length > 0 && (
        <Card style={styles.shoppingCard}>
          <Text style={styles.sectionLabel}>SHOPPING LIST</Text>
          {shopping.map((line, i) => (
            <View key={i} style={styles.shopRow}>
              <MaterialCommunityIcons name="cart-outline" size={16} color={colors.primary} />
              <Text style={styles.shopLabel}>{line.label}</Text>
              <Text style={styles.shopQty}>
                {line.approx ? '~' : ''}
                {line.unit === 'USD'
                  ? `$${parseFloat(line.qty.toFixed(2))}`
                  : `${parseFloat(line.qty.toFixed(2))}${line.unit ? ` ${line.unit}` : ''}`}
              </Text>
            </View>
          ))}
          <AppButton title="Share List" variant="ghost" onPress={share} />
        </Card>
      )}

      <Text style={styles.sectionLabel}>SAVED ESTIMATES</Text>
      {project.items.length === 0 && (
        <Text style={styles.empty}>
          Nothing saved yet. Run any calculator, then tap “Save to Project”.
        </Text>
      )}
      {project.items.map((item) => (
        <Card key={item.id} style={styles.itemCard}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>{item.calcTitle}</Text>
            <MaterialCommunityIcons
              name="close"
              size={18}
              color={colors.textFaint}
              onPress={() => confirmRemove(item.id, item.calcTitle)}
              suppressHighlighting
            />
          </View>
          {item.results.map((line, i) => (
            <View key={i} style={styles.resultRow}>
              <Text style={styles.resultLabel}>{line.label}</Text>
              <Text style={[styles.resultValue, line.emphasis && styles.resultEmphasis]}>
                {line.value}
              </Text>
            </View>
          ))}
        </Card>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    color: colors.textFaint,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    letterSpacing: 1.2,
  },
  shoppingCard: { borderColor: colors.primary },
  shopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  shopLabel: { flex: 1, color: colors.text, fontSize: fontSize.md },
  shopQty: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    fontVariant: ['tabular-nums'],
  },
  empty: {
    color: colors.textFaint,
    fontSize: fontSize.sm,
    textAlign: 'center',
    marginVertical: spacing.lg,
    lineHeight: 20,
  },
  itemCard: { gap: spacing.xs },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  itemTitle: { color: colors.text, fontSize: fontSize.md, fontWeight: fontWeight.semibold },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between' },
  resultLabel: { color: colors.textMuted, fontSize: fontSize.sm },
  resultValue: { color: colors.text, fontSize: fontSize.sm, fontVariant: ['tabular-nums'] },
  resultEmphasis: { color: colors.primary, fontWeight: fontWeight.semibold },
});
