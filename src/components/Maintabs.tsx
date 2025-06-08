// src/components/Maintabs.tsx
// THIS IS THE NAVIGATION BAR

//This is I think 5th revision of navbar, working and responsive navbar to dark mode though.
import React, { ReactNode } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './HomeScreen';
import PaymentScreen from './PaymentScreen';
import ProfileStack from '../navigation/ProfileStack';
import BookingScreen from './BookingScreen';
import AlertsScreen from './AlertsScreen';

import { useTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();

interface MaintabsProps {
  setLoggedIn: (val: boolean) => void;
  email: string;
}

// LUÍS CHANGES
const TAB_ICONS = [
  { name: 'Home', label: 'Home', icon: (color: string) => <AntDesign name="home" size={24} color={color} /> },
  { name: 'Payment', label: 'Payment', icon: (color: string) => <AntDesign name="wallet" size={24} color={color} /> },
  { name: 'Alerts', label: 'Alerts', icon: (color: string) => <AntDesign name="bells" size={24} color={color} /> },
  { name: 'Profile', label: 'Profile', icon: (color: string) => <Ionicons name="person" size={24} color={color} /> },
];

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { theme } = useTheme();

  // Filter out the hidden Booking tab for the visible tabs
  const visibleRoutes = state.routes.filter(r => r.name !== 'Booking');

  // Map route name to icon and label
  const tabMeta: Record<string, { label: string; icon: (color: string) => ReactNode }> = {
    Home: { label: 'Home', icon: (color: string) => <AntDesign name="home" size={24} color={color} /> },
    Payment: { label: 'Payment', icon: (color: string) => <AntDesign name="wallet" size={24} color={color} /> },
    Alerts: { label: 'Alerts', icon: (color: string) => <AntDesign name="bells" size={24} color={color} /> },
    Profile: { label: 'Profile', icon: (color: string) => <Ionicons name="person" size={24} color={color} /> },
  };

  return (
    <View style={[styles.tabBarContainer, { backgroundColor: theme === 'dark' ? '#232b37' : '#fff' }]}> 
      {visibleRoutes.map((route, idx) => {
        // Find the actual index in state.routes for active state
        const routeIndex = state.routes.findIndex(r => r.key === route.key);
        const isActive = state.index === routeIndex;
        const iconColor = isActive ? '#648CBA' : theme === 'dark' ? '#EDF1F2' : '#415D7C';
        const textColor = isActive ? '#648CBA' : theme === 'dark' ? '#EDF1F2' : '#415D7C';
        const meta = tabMeta[route.name];
        if (!meta) return null;
        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tabButton}
            onPress={() => navigation.navigate(route.name)}
          >
            {meta.icon(iconColor)}
            <Text style={[styles.tabLabel, { color: textColor }]}>{meta.label}</Text>
          </TouchableOpacity>
        );
      })}
      {/* Center button for Booking */}
      <View style={styles.centerButtonWrapper}>
        <TouchableOpacity
          style={[styles.centerButton, { backgroundColor: '#648CBA' }]}
          onPress={() => navigation.navigate('Booking')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="cross-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const Maintabs: React.FC<MaintabsProps> = ({ setLoggedIn, email }) => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
    }}
    tabBar={props => <CustomTabBar {...props} />}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Payment"
      component={PaymentScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="wallet" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Booking"
      component={BookingScreen}
      options={{
        tabBarButton: () => null, // Hide the default tab button
      }}
    />
    <Tab.Screen
      name="Alerts"
      component={AlertsScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="notifications" size={size} color={color} />
        ),
        title: "Alerts",
      }}
    />
    <Tab.Screen
      name="Profile"
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person" size={size} color={color} />
        ),
      }}
    >
      {props => <ProfileStack {...props} setLoggedIn={setLoggedIn} email={email} />}
    </Tab.Screen>
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
    borderTopWidth: 0.5,
    borderTopColor: '#e5e5e5',
    paddingHorizontal: 12,
    position: 'relative',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  centerButtonWrapper: {
    position: 'absolute',
    left: '50%',
    top: -28,
    transform: [{ translateX: -28 }],
    zIndex: 10,
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
});

export default Maintabs;
