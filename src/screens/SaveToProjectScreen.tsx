import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppButton, ScreenContainer, TextField } from '@/components';
import { useProjects } from '@/projects/ProjectsContext';
import { colors, fontSize, fontWeight, radius, spacing } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'SaveToProject'>;

export function SaveToProjectScreen({ navigation, route }: Props) {
  const { calcId, calcTitle, values, results } = route.params;
  const { projects, createProject, addItem } = useProjects();
  const [newName, setNewName] = useState('');

  const saveTo = (projectId: string) => {
    addItem(projectId, { calcId, calcTitle, values, results });
    navigation.goBack();
  };

  const handleCreateAndSave = () => {
    const name = newName.trim();
    if (!name) return;
    const project = createProject(name);
    saveTo(project.id);
  };

  return (
    <ScreenContainer>
      <View style={styles.newRow}>
        <TextField
          value={newName}
          onChangeText={setNewName}
          label="New project"
          placeholder="e.g. Garage remodel"
          style={styles.newField}
        />
        <AppButton title="Save" onPress={handleCreateAndSave} style={styles.addButton} />
      </View>

      {projects.length > 0 && <Text style={styles.sectionLabel}>OR ADD TO EXISTING</Text>}
      <FlatList
        data={projects}
        keyExtractor={(p) => p.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => saveTo(item.id)}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          >
            <MaterialCommunityIcons name="clipboard-list-outline" size={20} color={colors.primary} />
            <Text style={styles.rowTitle}>{item.name}</Text>
            <MaterialCommunityIcons name="plus" size={20} color={colors.textFaint} />
          </Pressable>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  newRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm },
  newField: { flex: 1 },
  addButton: { width: 90, height: 54 },
  sectionLabel: {
    color: colors.textFaint,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    letterSpacing: 1.2,
    marginTop: spacing.md,
  },
  list: { gap: spacing.sm, paddingTop: spacing.xs },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  pressed: { backgroundColor: colors.surfaceAlt },
  rowTitle: { flex: 1, color: colors.text, fontSize: fontSize.md },
});
