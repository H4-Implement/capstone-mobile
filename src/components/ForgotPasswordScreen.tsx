//src/components/ForgotPasswordScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';
import { Ionicons } from '@expo/vector-icons';

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const ForgotPasswordScreen = ({ setShowForgotPassword, setShowRegister }: any) => {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | null }>({ text: '', type: null });

  const handleSendReset = async () => {
    if (!isValidEmail(email)) {
      setMessage({ text: 'Please enter a valid email address.', type: 'error' });
      return;
    }
    setSending(true);
    setMessage({ text: '', type: null });
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setSending(false);
    if (error) {
      setMessage({ text: error.message, type: 'error' });
    } else {
      setMessage({ text: 'Reset link sent. Please check your email.', type: 'success' });
      setTimeout(() => {
        setShowForgotPassword(false);
      }, 500);
    }
  };

  return (
    <View className="flex-1 px-8 bg-[#f6f8fc] justify-center">
      <View className="items-center mb-8">
        <Ionicons name="mail" size={48} color="#415D7C" />
        <Text className="text-2xl font-bold text-[#415D7C] mt-4 mb-2">Forgot Password?</Text>
        <Text className="text-base text-[#6B7280] text-center mb-4">
          Enter your email address and we'll send you a link to reset your password.
        </Text>
      </View>
      <Text className="text-[#415D7C] font-bold mb-1">Email</Text>
      <TextInput
        className="h-12 px-4 rounded-lg border border-[#BAC8D3] mb-1 bg-white text-black"
        placeholder="user@gmail.com"
        placeholderTextColor="#B0B7C3"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={setEmail}
      />
      {message.text ? (
        <Text className={`mb-4 text-center font-bold ${message.type === 'success' ? 'text-[#12B76A]' : 'text-[#FF4646]'}`}>
          {message.text}
        </Text>
      ) : null}
      <TouchableOpacity
        className={`bg-[#415D7C] py-4 rounded-2xl items-center mb-4 ${sending ? 'opacity-70' : ''}`}
        onPress={handleSendReset}
        disabled={sending}
        activeOpacity={0.85}
      >
        {sending ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-lg">Send Reset Link</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setShowForgotPassword(false)}>
        <Text className="text-[#415D7C] font-bold text-center">Back to Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { setShowForgotPassword(false); setShowRegister(true); }}>
        <Text className="text-[#415D7C] font-bold mt-2 text-center">Create New Account</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPasswordScreen;