import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { ScanHistoryProvider } from './src/services/ScanHistoryContext';
import { UserRatingsProvider } from './src/services/UserRatingsContext';

export default function App() {
  return (
    <NavigationContainer>
      <ScanHistoryProvider>
        <UserRatingsProvider>
          <SafeAreaProvider>
            <AppNavigator />
            <StatusBar style="auto" />
          </SafeAreaProvider>
        </UserRatingsProvider>
      </ScanHistoryProvider>
    </NavigationContainer>
  );
}
