import React, { useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppButton, ScreenContainer, TextField } from '@/components';
import { useProjects } from '@/projects/ProjectsContext';
import { colors, fontSize, fontWeight, radius, spacing } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Projects'>;

export function ProjectsScreen({ navigation }: Props) {
  const { projects, createProject, deleteProject } = useProjects();
  const [newName, setNewName] = useState('');

  const handleCreate = () => {
    const name = newName.trim();
    if (!name) return;
    createProject(name);
    setNewName('');
  };

  const confirmDelete = (id: string, name: string) => {
    Alert.alert('Delete project', `Delete "${name}" and all its saved estimates?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteProject(id) },
    ]);
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
        <AppButton title="Add" onPress={handleCreate} style={styles.addButton} />
      </View>

      <FlatList
        data={projects}
        keyExtractor={(p) => p.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No projects yet. Create one, then save estimates to it from any calculator.
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('ProjectDetail', { projectId: item.id })}
            onLongPress={() => confirmDelete(item.id, item.name)}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          >
            <View style={styles.iconTile}>
              <MaterialCommunityIcons name="clipboard-list-outline" size={22} color={colors.primary} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>{item.name}</Text>
              <Text style={styles.rowSubtitle}>
                {item.items.length} saved estimate{item.items.length === 1 ? '' : 's'}
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textFaint} />
          </Pressable>
        )}
      />
      <Text style={styles.hint}>Long-press a project to delete it.</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  newRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm },
  newField: { flex: 1 },
  addButton: { width: 80, height: 54 },
  list: { gap: spacing.sm, paddingTop: spacing.sm },
  empty: {
    color: colors.textFaint,
    fontSize: fontSize.sm,
    textAlign: 'center',
    marginTop: spacing.xxl,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  pressed: { backgroundColor: colors.surfaceAlt },
  iconTile: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { flex: 1 },
  rowTitle: { color: colors.text, fontSize: fontSize.md, fontWeight: fontWeight.semibold },
  rowSubtitle: { color: colors.textMuted, fontSize: fontSize.sm, marginTop: 1 },
  hint: {
    color: colors.textFaint,
    fontSize: fontSize.xs,
    textAlign: 'center',
  },
});
