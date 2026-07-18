import AppHeader from "@/components/common/AppHeader";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type MethodOption = {
  id: "apple_pay" | "google_pay" | "paypal" | "card";
  name: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  brandBg: string;
  brandColor: string;
};

const OPTIONS: MethodOption[] = [
  {
    id: "apple_pay",
    name: "Apple Pay",
    subtitle: "Touch ID or Face ID",
    icon: "logo-apple",
    brandBg: "#161119",
    brandColor: "#fff",
  },
  {
    id: "google_pay",
    name: "Google Pay",
    subtitle: "Fast checkout with Google",
    icon: "logo-google",
    brandBg: "#F5F2F7",
    brandColor: "#4285F4",
  },
  {
    id: "paypal",
    name: "PayPal",
    subtitle: "Pay with PayPal balance",
    icon: "logo-paypal",
    brandBg: "#EAF0FF",
    brandColor: "#0F1A4D",
  },
  {
    id: "card",
    name: "Debit / Credit Card",
    subtitle: "Visa, Mastercard, Amex",
    icon: "card",
    brandBg: "#FDEDF1",
    brandColor: "#FC6C8C",
  },
];

const OptionRow = ({
  option,
  selected,
  onPress,
}: {
  option: MethodOption;
  selected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={onPress}
    className="flex-row items-center bg-white rounded-[20px] p-4 mb-3"
    style={{
      borderColor: selected ? "#B57EDC" : "#EFEAF3",
      borderWidth: selected ? 1.5 : 1,
    }}
  >
    <View
      className="items-center justify-center rounded-2xl mr-3"
      style={{ width: 44, height: 44, backgroundColor: option.brandBg }}
    >
      <Ionicons name={option.icon} size={18} color={option.brandColor} />
    </View>
    <View className="flex-1">
      <Text className="text-sm font-extrabold text-[#161119]">
        {option.name}
      </Text>
      <Text className="text-xs text-[#8A8590] mt-0.5">{option.subtitle}</Text>
    </View>
    <View
      className="items-center justify-center rounded-full mr-2"
      style={{
        width: 20,
        height: 20,
        borderWidth: 1.5,
        borderColor: selected ? "#B57EDC" : "#D9D3E0",
        backgroundColor: selected ? "#B57EDC" : "transparent",
      }}
    >
      {selected && <Ionicons name="checkmark" size={12} color="#fff" />}
    </View>
    <Ionicons name="chevron-forward" size={16} color="#D9D3E0" />
  </TouchableOpacity>
);

export default function AddPaymentMethodScreen() {
  const [selected, setSelected] = useState<MethodOption["id"] | null>(null);

  const handleContinue = () => {
    if (!selected) return;
    if (selected === "card") {
      router.push("/profile/add-card");
    } else {
      // TODO API: kick off the native SDK / OAuth flow for the selected method
      console.log("Connect payment method:", selected);
      router.back();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FBF9FC]">
      <AppHeader title="Add Payment Method" />

      <View className="px-5 pt-2 flex-1">
        <Text className="text-sm text-[#8A8590] mb-5">
          Choose how you would like to pay for your beauty services.
        </Text>

        {OPTIONS.map((option) => (
          <OptionRow
            key={option.id}
            option={option}
            selected={selected === option.id}
            onPress={() => setSelected(option.id)}
          />
        ))}
      </View>

      <View className="px-5 pb-5 pt-2">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleContinue}
          disabled={!selected}
          className="rounded-full overflow-hidden"
        >
          <LinearGradient
            colors={[COLORS.baseColor1, COLORS.baseColor2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="py-4 items-center rounded-full"
            style={{ opacity: selected ? 1 : 0.5 }}
          >
            <Text className="text-white text-base font-extrabold">
              Continue
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
