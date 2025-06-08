// src/navigation/ProfileStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../components/ProfileScreen';
import SettingsScreen from '../components/ProfileSubScreen/SettingsScreen';
import HelpScreen from '../components/ProfileSubScreen/HelpScreen';
import TermsAndConditionScreen from '../components/ProfileSubScreen/TermsAndConditionsScreen';
import TransactionHistoryScreen from '../components/ProfileSubScreen/TransactionHistoryScreen';
import PrivacyPolicyScreen from '../components/ProfileSubScreen/PrivacyPolicyScreen';

export type ProfileStackParamList = {
  ProfileMain: undefined;
  Settings: undefined;
  Help: undefined;
  Terms: undefined;
  Transactions: undefined;
  PrivacyPolicy: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

interface ProfileStackProps {
  setLoggedIn: (value: boolean) => void;
  email: string;
}

const ProfileStack: React.FC<ProfileStackProps> = ({ setLoggedIn, email }) => (
  <Stack.Navigator>
    <Stack.Screen
      name="ProfileMain"
      options={{ title: 'Profile', headerShown: false }}
    >
      {props => (
        <ProfileScreen
          {...props}
          setLoggedIn={setLoggedIn}
          email={email}
        />
      )}
    </Stack.Screen>
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Help" component={HelpScreen} />
    <Stack.Screen name="Terms" 
    component={TermsAndConditionScreen} 
    options={{ title: 'Terms and Conditions' }}
    />
    <Stack.Screen name="Transactions"
    component={TransactionHistoryScreen} 
    options={{ title: 'Transaction History' }} 
    />
    <Stack.Screen
      name="PrivacyPolicy"
      component={PrivacyPolicyScreen}
      options={{ title: 'Privacy Policy' }}  
    />
  </Stack.Navigator>
);

export default ProfileStack;