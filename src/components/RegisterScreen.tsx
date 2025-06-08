//src/components/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { supabase } from '../lib/supabase';

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

interface RegisterScreenProps {
  setLoggedIn: (loggedIn: boolean) => void;
  setShowRegister: (show: boolean) => void;
  setEmail: (email: string) => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({
  setLoggedIn,
  setShowRegister,
  setEmail,
}) => {
  const [Name, setName] = useState('');
  const [emailLocal, setEmailLocalState] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const { theme } = useTheme();
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' | null }>({
    text: '',
    type: null,
  });
  const [showEmailSentModal, setShowEmailSentModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleRegister = async () => {
    let newErrors: typeof errors = {};

    if (!Name) newErrors.name = 'Please provide your name';
    if (!emailLocal) newErrors.email = 'Please provide your email';
    else if (!isValidEmail(emailLocal)) newErrors.email = 'Please enter a valid email';

    if (!password) newErrors.password = 'Please provide a password';
    else if (password.length < 6) newErrors.password = 'Password should be at least 6 characters long.';

    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', emailLocal)
      .single();

    if (existingUser) {
      const errorMsg = 'This email is already registered. Please use a different email.';
      setErrors(prev => ({ ...prev, email: errorMsg }));
      setModalMessage(errorMsg);
      setModalVisible(true);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: emailLocal,
        password,
        options: {
          data: {
            full_name: Name,
          },
        },
      });

      if (error) {
        setMessage({ text: error.message, type: 'error' });
        return;
      }

      if (!data.user) {
        setMessage({ text: 'No user data returned', type: 'error' });
        return;
      }

      await supabase.from('users').upsert([
        {
          auth_uid: data.user.id,
          name: Name,
          email: emailLocal,
          avatar_url: null,
          is_active: true,
        },
      ]);

      setShowEmailSentModal(true);
      setEmail(emailLocal);
      setErrors({});
      setMessage({ text: '', type: null });
    } catch (err: any) {
      setMessage({ text: 'An unexpected error occurred', type: 'error' });
    }
  };

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      className="flex-1 px-8 bg-[#f6f8fc]"
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
            <Text className="text-[32px] font-bold text-[#415D7C] text-center mb-2">
              Create Account
            </Text>
            <Text className="text-[20px] text-[#88A4D4] text-center mb-6">
              Register to get started
            </Text>

            {message.text ? (
              <Text
                className={`text-center font-bold mb-4 ${message.type === 'error' ? 'text-[#FF4646]' : 'text-[#12B76A]'}`}
              >
                {message.text}
              </Text>
            ) : null}

            <View>
              <Text className="text-[#415D7C] font-bold mb-1">Full Name</Text>
              <TextInput
                className={`bg-white h-12 px-4 text-black rounded-lg border mb-1 ${errors.name ? 'border-[#FF4646]' : 'border-[#BAC8D3]'}`}
                placeholder="Your Name"
                placeholderTextColor="#B0B7C3"
                value={Name}
                onChangeText={val => {
                  setName(val);
                  if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                }}
              />
              {errors.name && <Text className="text-[#FF4646] text-xs mb-2">{errors.name}</Text>}

              <Text className="text-[#415D7C] font-bold mb-1">Email</Text>
              <TextInput
                className={`bg-white h-12 px-4 text-black rounded-lg border mb-1 ${errors.email ? 'border-[#FF4646]' : 'border-[#BAC8D3]'}`}
                placeholder="user@gmail.com"
                placeholderTextColor="#B0B7C3"
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
              {errors.email && <Text className="text-[#FF4646] text-xs mb-2">{errors.email}</Text>}

              <Text className="text-[#415D7C] font-bold mb-1">Password</Text>
              <View className="mb-1 relative">
                <TextInput
                  className={`bg-white h-12 px-4 pr-10 text-black rounded-lg border ${errors.password ? 'border-[#FF4646]' : 'border-[#BAC8D3]'}`}
                  placeholder="••••••••"
                  placeholderTextColor="#B0B7C3"
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
                  className="absolute right-2 top-3 p-0.5"
                  activeOpacity={0.7}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={24}
                    color="#B0B7C3"
                  />
                </TouchableOpacity>
              </View>
              {errors.password && <Text className="text-[#FF4646] text-xs mb-2">{errors.password}</Text>}

              <Text className="text-[#415D7C] font-bold mb-1">Confirm Password</Text>
              <View className="mb-1 relative">
                <TextInput
                  className={`bg-white h-12 px-4 pr-10 text-black rounded-lg border ${errors.confirmPassword ? 'border-[#FF4646]' : 'border-[#BAC8D3]'}`}
                  placeholder="••••••••"
                  placeholderTextColor="#B0B7C3"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={val => {
                    setConfirmPassword(val);
                    if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  className="absolute right-2 top-3 p-0.5"
                  activeOpacity={0.7}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye' : 'eye-off'}
                    size={24}
                    color="#B0B7C3"
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text className="text-[#FF4646] text-xs mb-2">{errors.confirmPassword}</Text>
              )}
            </View>

            <TouchableOpacity
              className="bg-[#415D7C] py-4 rounded-2xl mt-8 items-center"
              onPress={handleRegister}
            >
              <Text className="text-white font-bold text-lg">Register</Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-6">
              <TouchableOpacity onPress={() => setShowRegister(false)}>
                <Text className="text-[#415D7C] font-bold ml-1">
                  Already have an account? Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <Modal
          visible={showEmailSentModal}
          transparent
          animationType="fade"
          onRequestClose={() => {
            setShowEmailSentModal(false);
            setShowRegister(false);
          }}
        >
          <View className="flex-1 bg-black/40 justify-center items-center">
            <View className="bg-white p-8 rounded-2xl items-center w-80">
              <Ionicons name="mail-open-outline" size={48} color="#415D7C" style={{ marginBottom: 16 }} />
              <Text className="text-xl font-bold text-[#415D7C] mb-2">
                Verify Your Email
              </Text>
              <Text className="text-[#415D7C] text-center mb-6">
                A verification link has been sent to your email. Please check your inbox and follow the instructions.
              </Text>
              <TouchableOpacity
                className="bg-[#415D7C] py-3 px-8 rounded-lg mt-2"
                onPress={() => {
                  setShowEmailSentModal(false);
                  setShowRegister(false); // Go to login
                }}
              >
                <Text className="text-white font-bold text-base">OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 bg-black/40 justify-center items-center">
            <View className="bg-white p-6 rounded-xl items-center w-72">
              <Ionicons name="alert-circle-outline" size={40} color="#FF4646" style={{ marginBottom: 12 }} />
              <Text className="text-[#FF4646] font-bold text-lg mb-2">
                Error
              </Text>
              <Text className="text-[#415D7C] text-center mb-4">
                {modalMessage}
              </Text>
              <TouchableOpacity
                className="bg-[#415D7C] py-2 px-7 rounded-lg"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-white font-bold text-base">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

export default RegisterScreen;