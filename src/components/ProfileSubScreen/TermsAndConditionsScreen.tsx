//src/components/ProfileSubScreen/TermsAndConditionsScreen.tsx
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';

const TermsAndConditionScreen = () => {
  const { theme } = useTheme();

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      className={`flex-1 ${theme === 'dark' ? 'bg-[#222F3E]' : 'bg-[#F8FAFC]'}`}
    >
      <ScrollView className="p-4">
        <Text className={`text-2xl font-semibold mb-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-900'}`}>
          Terms & Conditions
        </Text>
        <View className="mb-5">
          <Text className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-900'}`}>
            Acceptance of Terms
          </Text>
          <Text className={`text-lg leading-6 ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}>
            By accessing or using EternalpEASE, you agree to be bound by these terms and conditions.
          </Text>
        </View>
        <View className="mb-5">
          <Text className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-900'}`}>
            User Responsibilities
          </Text>
          <Text className={`text-lg leading-6 ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}>
            You are responsible for maintaining the confidentiality of your account and password and for restricting access to your device.
          </Text>
        </View>
        <View className="mb-5">
          <Text className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-900'}`}>
            Limitation of Liability
          </Text>
          <Text className={`text-lg leading-6 ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}>
            EternalpEASE is not liable for any damages resulting from the use or inability to use the service.
          </Text>
        </View>
        <View className="mb-5">
          <Text className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-900'}`}>
            Changes to Terms
          </Text>
          <Text className={`text-lg leading-6 ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}>
            We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of the new terms.
          </Text>
        </View>
        <Text className="mt-8 text-sm italic text-gray-400 dark:text-gray-400">
          Last updated: May 2025
        </Text>
      </ScrollView>
    </Animated.View>
  );
};

export default TermsAndConditionScreen;