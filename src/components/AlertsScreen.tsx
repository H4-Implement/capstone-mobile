//src/components/AlertsScreen.tsx
import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

const MOCK_ALERTS = [
  {
    type: "booking",
    message: "Your booking for Package C is confirmed.",
    date: "May 29, 2025",
  },
  {
    type: "payment",
    message: "Payment of ₱50,000 received for Package C.",
    date: "May 30, 2025",
  },
];

const AlertsScreen: React.FC = () => {
  const { theme } = useTheme();
  return (
    <ScrollView
      className={`flex-1 px-[18px] pt-9 ${theme === "dark" ? "bg-[#232b37]" : "bg-[#F8FAFC]"}`}
      contentContainerStyle={{}}
    >
      <Text className={`text-[26px] font-bold ${theme === "dark" ? "text-blue-200" : "text-[#1e293b]"} mb-4`}>
        Alerts & Notifications
      </Text>
      {MOCK_ALERTS.map((alert, idx) => (
        <View key={idx}
          className={`rounded-xl mb-3 p-4 flex-row items-center ${theme === "dark" ? "bg-[#263043]" : "bg-white"}`}
        >
          <Ionicons
            name={alert.type === "payment" ? "wallet" : "notifications"}
            size={28}
            color={alert.type === "payment" ? "#12B76A" : "#60A5FA"}
            style={{ marginRight: 12 }}
          />
          <View>
            <Text className={`font-bold ${theme === "dark" ? "text-blue-200" : "text-[#415D7C]"}`}>{alert.message}</Text>
            <Text className="text-[#64748b] text-xs">{alert.date}</Text>
          </View>
        </View>
      ))}
      {MOCK_ALERTS.length === 0 && (
        <Text className={`text-center mt-8 ${theme === "dark" ? "text-[#64748b]" : "text-[#94A3B8]"}`}>
          No alerts yet. Stay tuned for updates.
        </Text>
      )}
    </ScrollView>
  );
};

export default AlertsScreen;