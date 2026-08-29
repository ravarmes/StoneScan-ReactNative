import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { ScanHistoryProvider } from './src/services/ScanHistoryContext';
import { UserRatingsProvider } from './src/services/UserRatingsContext';
import { warmupFirestore, syncPendingFeedbacks } from './src/services/firebase';

export default function App() {
  useEffect(() => {
    const initFirebase = async () => {
      await warmupFirestore();
      await syncPendingFeedbacks();
    };
    initFirebase();
  }, []);

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