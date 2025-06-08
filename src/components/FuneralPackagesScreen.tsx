//src/components/FuneralPackagesScreen.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

const FUNERAL_PACKAGES = [
  {
    name: "Package A",
    price: "₱30,000",
    summary: "Basic funeral essentials.",
    details: `• Standard casket or urn
• Basic embalming & body care
• Simple floral arrangement
• 1-day viewing (chapel or home)
• Hearse transport
• Documentation assistance

Ideal for families seeking a simple, dignified farewell.`,
  },
  {
    name: "Package B",
    price: "₱40,000",
    summary: "Enhanced essentials with upgraded amenities.",
    details: `• Upgraded casket or urn options
• Enhanced embalming
• Classic floral decor
• 2-day viewing (chapel or home)
• Transportation for family
• All Package A inclusions

Best for those wanting more time and amenities.`,
  },
  {
    name: "Package C",
    price: "₱50,000",
    summary: "Popular choice with more customization.",
    details: `• Premium casket or urn
• Themed floral arrangements
• 3-day viewing (chapel or home)
• Audio-visual setup for tributes
• Photo slideshow & memory table
• All Package B inclusions

Our most chosen package for added comfort and memories.`,
  },
  {
    name: "Package D",
    price: "₱60,000",
    summary: "Includes additional amenities and family support.",
    details: `• Choice of casket/urn finishes
• Extended viewing (up to 4 days)
• Family lounge with refreshments
• Grief support resources
• All Package C inclusions

For families who want extra time together.`,
  },
  {
    name: "Package E",
    price: "₱70,000",
    summary: "Premium service and memorable tributes.",
    details: `• Live video streaming for distant family
• Floral arch and custom decor
• Professional host/MC for the service
• Catering coordination
• All Package D inclusions

Perfect for larger gatherings and celebrations of life.`,
  },
  {
    name: "Package F",
    price: "₱80,000",
    summary: "All-inclusive with celebration options.",
    details: `• Celebration of life arrangements
• Video and photo tribute production
• Premium catering (choice of menu)
• All Package E inclusions

For heartfelt commemorations and gatherings.`,
  },
  {
    name: "Package G",
    price: "₱90,000",
    summary: "High-end luxury with custom elements.",
    details: `• Luxury casket or imported urn
• High-end floral installations
• Private viewing rooms
• Professional event planner
• All Package F inclusions

For a truly unique and elegant service.`,
  },
  {
    name: "Package H",
    price: "₱100,000",
    summary: "Large family and VIP accommodations.",
    details: `• VIP suite for family
• Extended multi-day viewing
• Exclusive chapel access
• Full transportation fleet
• All Package G inclusions

Designed for large families and VIP needs.`,
  },
  {
    name: "Package I",
    price: "₱120,000",
    summary: "Executive memorial, all services included.",
    details: `• Executive casket/urn collection
• Lasting memorial keepsakes
• On-site grief counselor
• All Package H inclusions

For those who desire a premier memorial experience.`,
  },
  {
    name: "Package J",
    price: "₱250,000",
    summary: "Ultimate luxury, custom everything.",
    details: `• Fully bespoke arrangements
• Choice of international casket/urn
• Custom theme and decor
• Celebrity event services available
• All Package I inclusions

The most exclusive and personalized package.`,
  },
];

const FuneralPackagesScreen = ({ navigation, route }: any) => {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState<number | null>(null);
  const formData = route?.params?.form;
  const deceasedName = formData?.deceasedName;

  return (
    <View className={`flex-1 ${theme === "dark" ? "bg-[#222F3E]" : "bg-[#F8FAFC]"}`}>
      <ScrollView
        className="flex-1 px-5 pt-6"
        contentContainerStyle={{ paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          className={`text-[28px] font-bold ${theme === "dark" ? "text-blue-400" : "text-[#1e293b]"} mb-2`}
        >
          Funeral Packages
        </Text>
        {deceasedName && (
          <Text
            className={`text-[16px] mb-4 ${theme === "dark" ? "text-blue-200" : "text-[#64748b]"}`}
          >
            For: {deceasedName}
          </Text>
        )}
        {FUNERAL_PACKAGES.map((pkg, idx) => (
          <View
            key={pkg.name}
            className={`rounded-2xl mb-5 p-5 shadow ${theme === "dark" ? "bg-[#263043]" : "bg-white"}`}
          >
            <View className="flex-row items-center mb-1">
              <Ionicons name="gift-outline" size={24} color={theme === "dark" ? "#60A5FA" : "#415D7C"} />
              <Text
                className={`text-lg font-bold ml-2 ${theme === "dark" ? "text-blue-100" : "text-[#1e293b]"}`}
              >
                {pkg.name}
              </Text>
              <View className={`rounded ml-2 px-2 py-1 ${theme === "dark" ? "bg-[#374151]" : "bg-[#E5E7EB]"}`}>
                <Text className={`font-bold ${theme === "dark" ? "text-blue-400" : "text-[#415D7C]"}`}>{pkg.price}</Text>
              </View>
            </View>
            <Text
              className={`mb-2 ${theme === "dark" ? "text-blue-100" : "text-[#415D7C]"}`}
            >
              {pkg.summary}
            </Text>
            {expanded === idx && (
              <Text
                className={`mb-2 text-base leading-[22px] ${theme === "dark" ? "text-blue-200" : "text-[#475569]"}`}
              >
                {pkg.details}
              </Text>
            )}
            <View className="flex-row justify-between items-center">
              <TouchableOpacity
                onPress={() => setExpanded(expanded === idx ? null : idx)}
                className="flex-row items-center py-2 px-3"
                activeOpacity={0.7}
              >
                <Text
                  className={`font-bold text-base mr-1 ${theme === "dark" ? "text-blue-400" : "text-[#0369A1]"}`}
                >
                  {expanded === idx ? "View Less" : "View More"}
                </Text>
                <Ionicons name={expanded === idx ? "chevron-up" : "chevron-down"} size={20} color={theme === "dark" ? "#60A5FA" : "#0369A1"} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('PackageDetails', {
                  selectedPackage: pkg,
                  form: formData,
                })}
                className="bg-[#415D7C] rounded px-4 py-2"
                activeOpacity={0.85}
              >
                <Text className="text-white font-bold">Select</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <Text className="text-xs text-center text-[#64748b] mt-4">
          (Selection coming soon. For now, view package details above.)
        </Text>
      </ScrollView>

      <View className="absolute left-0 right-0 bottom-0 px-6 pb-8 pt-2 bg-transparent">
        <TouchableOpacity
          onPress={() => navigation.navigate("MainTabs", { screen: "Home"})}
          className="w-full py-4 rounded-lg items-center justify-center bg-gray-400 active:opacity-80"
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-base">Previous</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FuneralPackagesScreen;