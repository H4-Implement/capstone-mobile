//src/components/PaymentScreen.tsx
import React from "react";
import { Text, ScrollView, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

const MOCK_TRANSACTIONS = [
  {
    desc: "Payment for Package C",
    amount: 50000,
    date: "May 30, 2025",
    status: "Paid",
  },
  {
    desc: "Booking for Package C",
    amount: 0,
    date: "May 29, 2025",
    status: "Booked",
  },
];

const PaymentScreen = () => {
  const { theme } = useTheme();
  const bg = theme === "dark" ? "bg-[#232b37]" : "bg-[#F8FAFC]";
  const cardBg = theme === "dark" ? "bg-[#263043]" : "bg-white";
  const titleColor = theme === "dark" ? "text-blue-200" : "text-slate-800";
  const descColor = theme === "dark" ? "text-blue-200" : "text-[#415D7C]";
  const secondaryText = "text-slate-400";
  const amountColor = "text-green-500";
  const mutedAmountColor = "text-slate-400";

  return (
    <ScrollView className={`flex-1 ${bg} px-4 pt-9`}>
      <Text className={`text-2xl font-extrabold mb-4 ${titleColor}`}>
        Payment & Transactions
      </Text>
      {MOCK_TRANSACTIONS.map((trx, idx) => (
        <View
          key={idx}
          className={`flex-row items-center ${cardBg} rounded-xl px-4 py-3 mb-4`}
        >
          <Ionicons
            name="wallet"
            size={28}
            color="#12B76A"
            style={{ marginRight: 12 }}
          />
          <View className="flex-1">
            <Text className={`font-bold ${descColor}`}>{trx.desc}</Text>
            <Text className={secondaryText}>{trx.date}</Text>
          </View>
          <Text
            className={`font-bold text-base ${
              trx.amount > 0 ? amountColor : mutedAmountColor
            }`}
          >
            {trx.amount > 0
              ? `₱${trx.amount.toLocaleString()}`
              : trx.status}
          </Text>
        </View>
      ))}
      {MOCK_TRANSACTIONS.length === 0 && (
        <Text
          className={`${
            theme === "dark" ? "text-slate-400" : "text-slate-400"
          } text-center mt-6`}
        >
          No transactions yet.
        </Text>
      )}
    </ScrollView>
  );
};

export default PaymentScreen;