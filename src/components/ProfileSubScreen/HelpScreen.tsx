//src/components/ProfileSubScreen/HelpScreen.tsx
import React from 'react';
import { View, Text, ScrollView, Linking, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';

const HelpScreen = () => {
  const { theme } = useTheme();

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      className={`flex-1 ${theme === 'dark' ? 'bg-[#222F3E]' : 'bg-[#F8FAFC]'}`}
    >
      <ScrollView className="px-5 pt-9 pb-6">
        <Text className={`text-[26px] font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-[#1e293b]'} mb-4`}>
          Help & Support
        </Text>
        <Text className={`text-base ${theme === 'dark' ? 'text-slate-100' : 'text-slate-500'} mb-7 leading-6`}>
          If you have any questions or need assistance, please check our FAQ or contact our support team.
        </Text>

        <Text className={`text-xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-[#0369A1]'} mb-2`}>
          Contact Us
        </Text>
        <TouchableOpacity onPress={() => Linking.openURL('mailto:support@eternalpease.com')}>
          <Text className={`text-base ${theme === 'dark' ? 'text-[#88A4D4]' : 'text-[#415D7C]'} underline mb-6`}>
            support@eternalpease.com
          </Text>
        </TouchableOpacity>

        <Text className={`text-xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-[#0369A1]'} mb-2`}>
          Frequently Asked Questions
        </Text>

        <View className="mb-7">
          <Text className={`text-base font-medium ${theme === 'dark' ? 'text-blue-100' : 'text-[#1e293b]'} mb-1`}>
            Q: How do I reset my password?
          </Text>
          <Text className={`text-base ${theme === 'dark' ? 'text-slate-100' : 'text-slate-500'} mb-3 leading-6`}>
            A: Go to the login screen and tap "Forgot Password?" to receive reset instructions.
          </Text>
          <Text className={`text-base font-medium ${theme === 'dark' ? 'text-blue-100' : 'text-[#1e293b]'} mb-1`}>
            Q: How do I contact support?
          </Text>
          <Text className={`text-base ${theme === 'dark' ? 'text-slate-100' : 'text-slate-500'} leading-6`}>
            A: Email us at <Text className={`${theme === 'dark' ? 'text-[#88A4D4]' : 'text-[#415D7C]'} underline`}>support@eternalpease.com</Text>
          </Text>
        </View>

        <Text className={`text-xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-[#0369A1]'} mb-2`}>
          More Resources
        </Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://eternalpease.com/help')}>
          <Text className={`text-base ${theme === 'dark' ? 'text-[#88A4D4]' : 'text-[#415D7C]'} underline mb-2`}>
            View Full Help Center
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('tel:+6321234567')}>
          <Text className={`text-base ${theme === 'dark' ? 'text-[#88A4D4]' : 'text-[#415D7C]'} underline`}>
            Call Support: +63 2 123 4567
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );
};

export default HelpScreen;