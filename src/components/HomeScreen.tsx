//src/components/HomeScreen.tsx
import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import PeaceyChatbot from "./PeaceyChatbot";

const HomeScreen = ({ navigation }: any) => {
  const { theme } = useTheme();

  return (
    <View className={`flex-1 ${theme === "dark" ? "bg-[#232b37]" : "bg-[#F8FAFC]"}`}>
      <ScrollView
        className="flex-1 px-[18px] pt-[44px]"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className={`text-[28px] font-bold ${theme === "dark" ? "text-blue-400" : "text-[#415D7C]"} mb-[14px]`}>
          Welcome to EternalpEASE
        </Text>
        <Text className={`text-[18px] ${theme === "dark" ? "text-blue-100" : "text-[#415D7C]"} mb-[18px]`}>
          Your one-stop app for funeral arrangements, support, and peace of mind.
        </Text>

        {/* Quick Actions */}
        <View className="flex-row justify-between mb-6">
          <TouchableOpacity
            className={`bg-white dark:bg-[#263043] rounded-2xl flex-1 mr-2 items-center p-4 shadow-sm`}
            onPress={() => navigation.navigate("Booking")}
            activeOpacity={0.85}
          >
            <Ionicons name="calendar-outline" size={28} color="#60A5FA" />
            <Text className="text-[#60A5FA] font-bold mt-1">Book</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`bg-white dark:bg-[#263043] rounded-2xl flex-1 mx-1 items-center p-4 shadow-sm`}
            onPress={() => navigation.navigate("FuneralPackages")}
            activeOpacity={0.85}
          >
            <Ionicons name="gift-outline" size={28} color="#415D7C" />
            <Text className="text-[#415D7C] font-bold mt-1">Packages</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`bg-white dark:bg-[#263043] rounded-2xl flex-1 ml-2 items-center p-4 shadow-sm`}
            onPress={() => navigation.navigate("Alerts")}
            activeOpacity={0.85}
          >
            <Ionicons name="notifications-outline" size={28} color="#f59e42" />
            <Text className="text-[#f59e42] font-bold mt-1">Alerts</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity / Alerts */}
        <Text className={`text-[18px] font-bold ${theme === "dark" ? "text-blue-100" : "text-[#415D7C]"} mb-2`}>
          Recent Activity
        </Text>
        <View className={`rounded-xl mb-3 p-3 shadow-sm ${theme === "dark" ? "bg-[#263043]" : "bg-white"}`}>
          <View className="flex-row items-center">
            <Ionicons name="wallet" size={18} color="#12B76A" />
            <Text className="ml-2 font-bold text-[#12B76A]">Payment</Text>
            <Text className={`ml-1 ${theme === "dark" ? "text-white" : "text-[#415D7C]"}`}>₱50,000 paid - Package C</Text>
          </View>
          <Text className="text-[#64748b] mt-1 text-xs">May 30, 2025</Text>
        </View>
        <View className={`rounded-xl mb-3 p-3 shadow-sm ${theme === "dark" ? "bg-[#263043]" : "bg-white"}`}>
          <View className="flex-row items-center">
            <Ionicons name="notifications" size={18} color="#f59e42" />
            <Text className="ml-2 font-bold text-[#f59e42]">Alert</Text>
            <Text className={`ml-1 ${theme === "dark" ? "text-white" : "text-[#415D7C]"}`}>Booking confirmed for June 3</Text>
          </View>
          <Text className="text-[#64748b] mt-1 text-xs">May 29, 2025</Text>
        </View>
      </ScrollView>

      <View className="absolute bottom-7 right-6 z-50">
        <PeaceyChatbot showFloating />
      </View>
    </View>
  );
};

export default HomeScreen;
