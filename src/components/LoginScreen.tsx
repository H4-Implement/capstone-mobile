//src/components/LoginScreen.tsx
import React from 'react';
import {View, Text, TextInput, TouchableOpacity, Modal, Pressable, Platform, KeyboardAvoidingView, ScrollView} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { supabase } from '../lib/supabase';

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const LoginScreen = ({ setLoggedIn, setShowRegister, setShowForgotPassword, setEmail }: any) => {
  const [emailLocal, setEmailLocalState] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({});
  const [message, setMessage] = React.useState<{ text: string, type: 'error' | 'success' | null }>({ text: '', type: null });

  const [modalError, setModalError] = React.useState<string>('');
  const [modalVisible, setModalVisible] = React.useState(false);

  const COLORS = {
    background: '#f6f8fc',
    primary: '#415D7C',
    accent: '#88A4D4',
    border: '#BAC8D3',
    error: '#FF4646',
    placeholder: '#B0B7C3',
    inputBg: 'white',
    label: '#415D7C',
    modalBg: 'white',
    modalShadow: '#415D7C',
    modalError: '#E9446A',
    modalOverlay: 'rgba(0,0,0,0.2)',
    success: '#12B76A',
    text: '#222',
  };

  const handleLogin = async () => {
    let newErrors: { email?: string; password?: string } = {};
    if (!isValidEmail(emailLocal)) newErrors.email = 'Please enter a valid email';
    if (!password) newErrors.password = 'Please enter your password';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailLocal,
        password,
      });

      if (error) {
        setModalError(error.message || 'Invalid email or password');
        setModalVisible(true);
        return;
      }

      if (!data.user) {
        setModalError('No user data returned');
        setModalVisible(true);
        return;
      }

      if (!data.user.email_confirmed_at) {
        setModalError('Please verify your email before logging in.');
        setModalVisible(true);
        return;
      }

      setEmail(emailLocal);
      setLoggedIn(true);
      setErrors({});
      setMessage({ text: 'Login successful!', type: 'success' });
    } catch (err) {
      setModalError('An unexpected error occurred');
      setModalVisible(true);
    }
  };

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      className="flex-1 px-8"
      style={{ backgroundColor: COLORS.background }}
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center">
            <View className="items-center mb-8">
              <Ionicons name="cloud" size={64} color={COLORS.accent} />
              <Text className="text-[32px] font-bold mt-4" style={{ color: COLORS.primary }}>
                EternalpEASE
              </Text>
              <Text className="text-[20px] mt-2" style={{ color: COLORS.accent }}>
                Login to your account
              </Text>
            </View>

            {message.text && message.type === 'success' ? (
              <Text className="text-center font-bold mb-4" style={{ color: COLORS.success }}>
                {message.text}
              </Text>
            ) : null}

            <Text className="font-bold mb-1" style={{ color: COLORS.label }}>
              Email
            </Text>
            <TextInput
              className="h-12 px-4 rounded-lg border mb-1"
              style={{
                backgroundColor: COLORS.inputBg,
                color: COLORS.text,
                borderColor: errors.email ? COLORS.error : COLORS.border,
              }}
              placeholder="user@gmail.com"
              placeholderTextColor={COLORS.placeholder}
              keyboardType="email-address"
              value={emailLocal}
              onChangeText={val => {
                setEmailLocalState(val);
                if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
              }}
              onBlur={() => {
                if (emailLocal && !isValidEmail(emailLocal)) {
                  setErrors(prev => ({
                    ...prev,
                    email: 'Email should contain @ and a valid domain',
                  }));
                }
              }}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.email && (
              <Text className="text-xs mb-2" style={{ color: COLORS.error }}>
                {errors.email}
              </Text>
            )}

            <Text className="font-bold mb-1" style={{ color: COLORS.label }}>
              Password
            </Text>
            <View className="mb-1 relative">
              <TextInput
                className="h-12 px-4 rounded-lg border pr-10"
                style={{
                  backgroundColor: COLORS.inputBg,
                  color: COLORS.text,
                  borderColor: errors.password ? COLORS.error : COLORS.border,
                }}
                placeholder="••••••••"
                placeholderTextColor={COLORS.placeholder}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={val => {
                  setPassword(val);
                  if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                }}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={{ position: 'absolute', right: 8, top: 12, padding: 2 }}
                activeOpacity={0.7}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={24}
                  color={COLORS.placeholder}
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text className="text-xs mb-2" style={{ color: COLORS.error }}>
                {errors.password}
              </Text>
            )}

            <TouchableOpacity
              className="py-4 rounded-2xl mt-6 items-center shadow"
              style={{ backgroundColor: COLORS.primary }}
              onPress={handleLogin}
            >
              <Text className="font-bold text-lg text-white">
                Login
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-between mt-6">
              <TouchableOpacity onPress={() => setShowForgotPassword(true)}>
                <Text style={{ color: COLORS.primary }}>Forgot Password?</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowRegister(true)}>
                <Text style={{ color: COLORS.primary }}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center" style={{ backgroundColor: COLORS.modalOverlay }}>
          <View className="rounded-2xl p-7 items-center w-4/5 shadow"
            style={{
              backgroundColor: COLORS.modalBg,
              shadowColor: COLORS.modalShadow,
            }}
          >
            <Ionicons name="alert-circle" size={40} color={COLORS.modalError} style={{ marginBottom: 8 }} />
            <Text className="font-bold text-xl mb-3 text-center" style={{ color: COLORS.modalError }}>
              Error
            </Text>
            <Text className="text-base text-center mb-5" style={{ color: COLORS.text }}>
              {modalError}
            </Text>
            <Pressable
              className="rounded-lg py-2 px-8"
              style={{ backgroundColor: COLORS.modalError }}
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-white font-bold text-base">
                OK
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
};

export default LoginScreen;