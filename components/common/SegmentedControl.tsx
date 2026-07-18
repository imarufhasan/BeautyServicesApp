import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Option<T extends string> = {
  value: T;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View className="flex-row" style={{ gap: 8 }}>
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <TouchableOpacity
            key={opt.value}
            activeOpacity={0.85}
            onPress={() => onChange(opt.value)}
            className="flex-1 rounded-full overflow-hidden"
          >
            {selected ? (
              <LinearGradient
                colors={[COLORS.baseColor1, COLORS.baseColor2]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="flex-row items-center justify-center rounded-full py-2.5"
              >
                <Ionicons
                  name={opt.icon}
                  size={14}
                  color="#fff"
                  style={{ marginRight: 5 }}
                />
                <Text className="text-xs font-bold text-white">
                  {opt.label}
                </Text>
              </LinearGradient>
            ) : (
              <View
                className="flex-row items-center justify-center rounded-full py-2.5 border"
                style={{ borderColor: "#EFEAF3", backgroundColor: "#fff" }}
              >
                <Ionicons
                  name={opt.icon}
                  size={14}
                  color="#8A8590"
                  style={{ marginRight: 5 }}
                />
                <Text className="text-xs font-bold text-[#8A8590]">
                  {opt.label}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
