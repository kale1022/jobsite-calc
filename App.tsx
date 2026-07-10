import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { EntitlementProvider } from '@/iap/useEntitlement';
import { ProjectsProvider } from '@/projects/ProjectsContext';
import { RootNavigator } from '@/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <EntitlementProvider>
        <ProjectsProvider>
          <StatusBar style="light" />
          <RootNavigator />
        </ProjectsProvider>
      </EntitlementProvider>
    </SafeAreaProvider>
  );
}
