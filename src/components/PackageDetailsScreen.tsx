//src/componentss/PackageDetailsScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

const PackageDetailsScreen = ({ navigation, route }: any) => {
  const { theme } = useTheme();
  const { selectedPackage, form } = route.params;

  const [specialRequest, setSpecialRequest] = useState('');
  const [note, setNote] = useState('');

  const handleNext = () => {
    alert('Next pressed!\n\n' +
      `Special Request: ${specialRequest}\n` +
      `Note: ${note}\n\n` +
      'Pass this info to your next screen.');
  };

  return (
    <View className={`flex-1 ${theme === "dark" ? "bg-[#222F3E]" : "bg-[#F8FAFC]"}`}>
      <ScrollView className="flex-1 px-5 pt-6" contentContainerStyle={{ paddingBottom: 80 }}>
        <Text className={`text-[28px] font-bold mb-2 ${theme === "dark" ? "text-blue-400" : "text-[#1e293b]"}`}>
          Package Details
        </Text>
        <View className={`rounded-2xl mb-5 p-5 shadow ${theme === "dark" ? "bg-[#263043]" : "bg-white"}`}>
          <View className="flex-row items-center mb-1">
            <Ionicons name="gift-outline" size={24} color={theme === "dark" ? "#60A5FA" : "#415D7C"} />
            <Text className={`text-lg font-bold ml-2 ${theme === "dark" ? "text-blue-100" : "text-[#1e293b]"}`}>
              {selectedPackage.name}
            </Text>
            <View className={`rounded ml-2 px-2 py-1 ${theme === "dark" ? "bg-[#374151]" : "bg-[#E5E7EB]"}`}>
              <Text className={`font-bold ${theme === "dark" ? "text-blue-400" : "text-[#415D7C]"}`}>{selectedPackage.price}</Text>
            </View>
          </View>
          <Text className={`mb-2 ${theme === "dark" ? "text-blue-100" : "text-[#415D7C]"}`}>
            {selectedPackage.summary}
          </Text>
          <Text className={`text-base leading-[22px] ${theme === "dark" ? "text-blue-200" : "text-[#475569]"}`}>
            {selectedPackage.details}
          </Text>
        </View>

        <Text className={`text-lg font-bold mb-2 ${theme === "dark" ? "text-blue-400" : "text-[#1e293b]"}`}>Special Requests</Text>
        <TextInput
          value={specialRequest}
          onChangeText={setSpecialRequest}
          placeholder="e.g. Preferred flower, message, etc."
          multiline
          className={`border rounded-xl px-4 py-3 text-base mb-5 ${theme === "dark" ? "border-blue-900 bg-[#232b37] text-white" : "border-gray-300 bg-white text-black"}`}
          placeholderTextColor={theme === "dark" ? "#64748b" : "#A0AEC0"}
        />

        <Text className={`text-lg font-bold mb-2 ${theme === "dark" ? "text-blue-400" : "text-[#1e293b]"}`}>Additional Notes</Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Any additional notes for the team?"
          multiline
          className={`border rounded-xl px-4 py-3 text-base mb-8 ${theme === "dark" ? "border-blue-900 bg-[#232b37] text-white" : "border-gray-300 bg-white text-black"}`}
          placeholderTextColor={theme === "dark" ? "#64748b" : "#A0AEC0"}
        />

      </ScrollView>
      <View className="absolute left-0 right-0 bottom-0 px-6 pb-8 pt-2 bg-transparent">
        <View className="flex-row space-x-3">
          <TouchableOpacity
            onPress={() => navigation.navigate('FuneralPackages')}
            className="flex-1 py-4 rounded-lg items-center justify-center bg-gray-500 active:opacity-80"
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-base">Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNext}
            className="flex-1 py-4 rounded-lg items-center justify-center bg-[#415D7C] active:opacity-80"
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-base">Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PackageDetailsScreen;