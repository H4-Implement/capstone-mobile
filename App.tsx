import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking';
import {NavigationContainer,DefaultTheme,DarkTheme,NavigationContainerRef,} from '@react-navigation/native';
import Maintabs from './src/components/Maintabs';
import LoginScreen from './src/components/LoginScreen';
import RegisterScreen from './src/components/RegisterScreen';
import ForgotPasswordScreen from './src/components/ForgotPasswordScreen';
import ResetPasswordScreen from './src/components/ResetPasswordScreen';
import FuneralPackagesScreen from './src/components/FuneralPackagesScreen';
import PackageDetailsScreen from './src/components/PackageDetailsScreen';
import './global.css';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PeaceyChatbot from "./src/components/PeaceyChatbot";
import { EternalpEASEAiProvider } from "./src/context/EternalpEASEAiContext";

type RootStackParamList = {
  Login: { confirmation_token?: string } | undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
  MainTabs: undefined;
  FuneralPackages: { form?: any } | undefined;
  PackageDetails: { selectedPackage: any; form: any } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking = {
  prefixes: [
    'eternalpease://',
    'exp://192.168.1.14:8081', // Add your expo dev url here!
    'eternalpease://login',
    'eternalpease://reset-password',
  ],
  config: {
    screens: {
      Login: 'login',
      Register: 'register',
      ForgotPassword: 'forgot-password',
      ResetPassword: 'reset-password',
      MainTabs: 'main',
      FuneralPackages: 'funeral-packages',
      PackageDetails: 'package-details', // <-- add this
    },
  },
};

function AppBody({
  loggedIn,
  setLoggedIn,
  showRegister,
  setShowRegister,
  showForgotPassword,
  setShowForgotPassword,
  email,
  setEmail,
}: {
  loggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
  showRegister: boolean;
  setShowRegister: (value: boolean) => void;
  showForgotPassword: boolean;
  setShowForgotPassword: (value: boolean) => void;
  email: string;
  setEmail: (email: string) => void;
}) {
  const { theme, loadUserTheme } = useTheme();
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    return () => {
      if (subscription?.remove) {
        subscription.remove();
      }
    };
  }, []);

  useEffect(() => {
    loadUserTheme();
  }, [loggedIn]);

  function handleDeepLink(url: string) {
    const { path, queryParams } = Linking.parse(url);
    let token: string | undefined;
    if (Array.isArray(queryParams?.confirmation_token)) {
      token = queryParams.confirmation_token[0];
    } else if (typeof queryParams?.confirmation_token === 'string') {
      token = queryParams.confirmation_token;
    }

    if (path === 'login' && token) {
      navigationRef.current?.navigate('Login', { confirmation_token: token });
    } else if (path === 'login') {
      navigationRef.current?.navigate('Login');
    } else if (path === 'reset-password') {
      navigationRef.current?.navigate('ResetPassword');
    } else if (path === 'funeral-packages') {
      navigationRef.current?.navigate('FuneralPackages');
    } else if (path === 'package-details') {
      navigationRef.current?.navigate('PackageDetails');
    }
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      theme={theme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {loggedIn ? (
          <>
            <Stack.Screen name="MainTabs">
              {() => <Maintabs setLoggedIn={setLoggedIn} email={email} />}
            </Stack.Screen>
            <Stack.Screen name="FuneralPackages" component={FuneralPackagesScreen} />
            <Stack.Screen name="PackageDetails" component={PackageDetailsScreen} />
          </>
        ) : showRegister ? (
          <Stack.Screen name="Register">
            {() => (
              <RegisterScreen
                setLoggedIn={setLoggedIn}
                setShowRegister={setShowRegister}
                setEmail={setEmail}
              />
            )}
          </Stack.Screen>
        ) : showForgotPassword ? (
          <Stack.Screen name="ForgotPassword">
            {() => (
              <ForgotPasswordScreen
                setShowForgotPassword={setShowForgotPassword}
                setShowRegister={setShowRegister}
              />
            )}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Login">
              {(props) => (
                <LoginScreen
                  {...props}
                  setLoggedIn={setLoggedIn}
                  setShowRegister={setShowRegister}
                  setShowForgotPassword={setShowForgotPassword}
                  setEmail={setEmail}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
            <Stack.Screen name="FuneralPackages" component={FuneralPackagesScreen} />
            <Stack.Screen name="PackageDetails" component={PackageDetailsScreen} />
          </>
        )}
      </Stack.Navigator>
      {loggedIn && <PeaceyChatbot />}
    </NavigationContainer>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  return (
    <ThemeProvider>
      <EternalpEASEAiProvider>
        <AppBody
          loggedIn={loggedIn}
          setLoggedIn={setLoggedIn}
          showRegister={showRegister}
          setShowRegister={setShowRegister}
          showForgotPassword={showForgotPassword}
          setShowForgotPassword={setShowForgotPassword}
          email={email}
          setEmail={setEmail}
        />
      </EternalpEASEAiProvider>
    </ThemeProvider>
  );
}