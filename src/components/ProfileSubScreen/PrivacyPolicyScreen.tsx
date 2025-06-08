//src/components/ProfileSubScreen/PrivacyPolicyScreen.tsx
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';

const PrivacyPolicyScreen = () => {
  const { theme } = useTheme();

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      className={`flex-1 ${theme === 'dark' ? 'bg-[#222F3E]' : 'bg-[#F8FAFC]'}`}
    >
      <ScrollView className="p-4">
        <Text className={`text-2xl font-semibold mb-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-900'}`}>
          Privacy Policy
        </Text>
        <View className="mb-5">
          <Text className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-900'}`}>
            Information We Collect
          </Text>
          <Text className={`text-lg leading-6 ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}>
            We collect information you provide directly to us, such as when you create an account,
            customize funeral services, or contact us for support.
          </Text>
        </View>
        <View className="mb-5">
          <Text className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-900'}`}>
             How We Use Your Information
          </Text>
          <Text className={`text-lg leading-6 ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}>
            We use the information we collect to provide, maintain, and improve our services,
            process transactions, and communicate with you about your account and our services.
          </Text>
        </View>
        <View className="mb-5">
          <Text className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-900'}`}>
            Information Sharing
          </Text>
          <Text className={`text-lg leading-6 ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}>
            We do not sell, trade, or otherwise transfer your personal information to outside parties
            without your consent, except as described in this privacy policy.
          </Text>
        </View>
        <View className="mb-5">
          <Text className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-900'}`}>
             Data Security
          </Text>
          <Text className={`text-lg leading-6 ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}>
            We implement appropriate security measures to protect your personal information against
            unauthorized access, alteration, disclosure, or destruction.
          </Text>
        </View>
        <View className="mb-5">
          <Text className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-900'}`}>
             Your Rights & Choices
          </Text>
          <Text className={`text-lg leading-6 ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}>
            You may request to review, correct, or delete your personal information at any time by contacting us.
          </Text>
        </View>
        <View className="mb-5">
          <Text className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-900'}`}>
             Policy Updates
          </Text>
          <Text className={`text-lg leading-6 ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}>
            We may update this policy from time to time. We will notify you of any changes by updating the date below.
          </Text>
        </View>
        <Text className={`mt-8 text-sm italic ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>
          Last updated: May 2025
        </Text>
      </ScrollView>
    </Animated.View>
  );
};

export default PrivacyPolicyScreen;