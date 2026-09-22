import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import ScanScreen from '../screens/ScanScreen';
import ResultScreen from '../screens/ResultScreen';
import RegisterScreen from '../screens/RegisterScreen';

// Import context
import { useUserProfile } from '../services/UserProfileContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack navigator for the Home flow
const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
    </Stack.Navigator>
  );
};

// Stack navigator for the scanning flow
const ScanStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ScanMain" component={ScanScreen} />
    </Stack.Navigator>
  );
};

// Tab navigator contained within the main stack
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Scan') {
            iconName = focused ? 'scan' : 'scan-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Scan" component={ScanStack} />
    </Tab.Navigator>
  );
};

// Main app navigator with conditional initial route based on user profile
const AppNavigator = () => {
  const { hasProfile, isLoadingProfile } = useUserProfile();

  if (isLoadingProfile) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={hasProfile ? 'Tabs' : 'Register'}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="Result" component={ResultScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
