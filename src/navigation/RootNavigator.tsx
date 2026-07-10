import React from 'react';
import {
  createNavigationContainerRef,
  DarkTheme,
  LinkingOptions,
  NavigationContainer,
  Theme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { colors, fontWeight } from '@/theme';
import type { RootStackParamList } from './types';

import { HomeScreen } from '@/screens/HomeScreen';
import { CalculatorScreen } from '@/screens/CalculatorScreen';
import { PaywallScreen } from '@/screens/PaywallScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { PrivacyScreen } from '@/screens/PrivacyScreen';
import { ProjectsScreen } from '@/screens/ProjectsScreen';
import { ProjectDetailScreen } from '@/screens/ProjectDetailScreen';
import { SaveToProjectScreen } from '@/screens/SaveToProjectScreen';

const navTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.surface,
    border: colors.border,
    primary: colors.primary,
    text: colors.text,
    notification: colors.primary,
  },
};

const screenOptions = {
  headerStyle: { backgroundColor: colors.background },
  headerShadowVisible: false,
  headerTintColor: colors.primary,
  headerTitleStyle: { fontWeight: fontWeight.bold as '700', color: colors.text },
  headerBackButtonDisplayMode: 'minimal' as const,
  contentStyle: { backgroundColor: colors.background },
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['jobsitecalc://'],
  config: {
    screens: {
      Home: '',
      Calculator: {
        path: 'calculator/:calculatorId',
        parse: { calculatorId: String },
      },
      Paywall: 'paywall',
      Settings: 'settings',
      Privacy: 'privacy',
      Projects: 'projects',
      ProjectDetail: 'project/:projectId',
    },
  },
};

const navRef = createNavigationContainerRef<RootStackParamList>();

/** One-shot startup route from storage — used by dev tooling/screenshot runs. */
function consumeDevRoute() {
  AsyncStorage.getItem('jobsitecalc.devRoute')
    .then((raw) => {
      if (!raw) return;
      AsyncStorage.removeItem('jobsitecalc.devRoute');
      const { name, params } = JSON.parse(raw);
      if (navRef.isReady()) {
        navRef.navigate(name, params);
      }
    })
    .catch(() => {});
}

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme} linking={linking} ref={navRef} onReady={consumeDevRoute}>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Calculator" component={CalculatorScreen} />
        <Stack.Screen
          name="Paywall"
          component={PaywallScreen}
          options={{ title: 'Unlock All', presentation: 'modal' }}
        />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
        <Stack.Screen name="Privacy" component={PrivacyScreen} options={{ title: 'Privacy' }} />
        <Stack.Screen name="Projects" component={ProjectsScreen} options={{ title: 'Projects' }} />
        <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} options={{ title: 'Project' }} />
        <Stack.Screen
          name="SaveToProject"
          component={SaveToProjectScreen}
          options={{ title: 'Save to Project', presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
