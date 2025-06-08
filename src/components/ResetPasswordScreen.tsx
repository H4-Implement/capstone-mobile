//src/components/ResetPasswordScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';
import { useRoute } from '@react-navigation/native';

const ResetPasswordScreen: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [sessionReady, setSessionReady] = useState(false);
  const [tokenError, setTokenError] = useState('');
  const route = useRoute();

  useEffect(() => {
    let token: string | undefined;

    // @ts-ignore
    if (route.params?.access_token) {
      // @ts-ignore
      token = route.params.access_token;
    }

    (async () => {
      if (!token) {
        const initialUrl = await import('expo-linking').then(L => L.getInitialURL());
        if (initialUrl) {
          const urlObj = await import('expo-linking').then(L => L.parse(initialUrl));
          const raw = urlObj.queryParams?.access_token || urlObj.queryParams?.token;
          token = Array.isArray(raw) ? raw[0] : raw;
        }
      }
      if (token && typeof token === 'string') {
        setLoading(true);
        const { error } = await supabase.auth.exchangeCodeForSession(token);
        setLoading(false);
        if (error) {
          setTokenError('Invalid or expired reset link. Please request a new one.');
        } else {
          setSessionReady(true);
        }
      } else {
        setTokenError('Missing reset token. Please request a new link.');
      }
    })();
  }, []);

  const handleUpdatePassword = async () => {
    setMessage('');
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Password has been reset! You can now log in.');
    }
  };

  if (tokenError) {
    return (
      <View className="flex-1 px-6 justify-center bg-[#f6f8fc]">
        <Text className="text-xl text-[#FF4646] font-bold mb-4">{tokenError}</Text>
      </View>
    );
  }

  if (!sessionReady) {
    return (
      <View className="flex-1 px-6 justify-center bg-[#f6f8fc] items-center">
        <ActivityIndicator size="large" color="#415D7C" />
        <Text className="mt-4 text-[#415D7C]">Preparing password reset...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 px-6 justify-center bg-[#f6f8fc]">
      <Text className="text-[28px] font-bold mb-4 text-[#415D7C]">Set New Password</Text>
      <TextInput
        placeholder="New password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        className="border border-[#888] mb-3 rounded-lg px-4 py-3 bg-white text-black"
        placeholderTextColor="#94A3B8"
      />
      <TextInput
        placeholder="Confirm new password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        className="border border-[#888] mb-3 rounded-lg px-4 py-3 bg-white text-black"
        placeholderTextColor="#94A3B8"
      />
      {message ? (
        <Text className={`mb-4 ${message.includes('reset') ? 'text-[#12B76A]' : 'text-[#FF4646]'}`}>{message}</Text>
      ) : null}
      <TouchableOpacity
        className={`bg-[#415D7C] py-4 rounded-xl items-center ${loading ? 'opacity-70' : ''}`}
        onPress={handleUpdatePassword}
        disabled={loading}
        activeOpacity={0.85}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold text-lg">Reset Password</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ResetPasswordScreen;