// components/AppTabBar.tsx
// Shared bottom tab bar. Jodi expo-router file-based tabs use koro,
// tahole ei component ta lagbe na — app/(tabs)/_layout.tsx e
// Tabs.Screen options diye direct kore nite paro. Eta standalone
// version, jate individual screen preview korte convenient hoy.

import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export type TabKey = "Availability" | "Bookings" | "Messages" | "Profile";

interface Props {
  active: TabKey;
  onChange?: (tab: TabKey) => void;
}

const TABS: {
  key: TabKey;
  label: string;
  icon: keyof typeof Feather.glyphMap;
}[] = [
  { key: "Availability", label: "Availability", icon: "calendar" },
  { key: "Bookings", label: "Bookings", icon: "book-open" },
  { key: "Messages", label: "Messages", icon: "message-square" },
  { key: "Profile", label: "Profile", icon: "user" },
];

export default function AppTabBar({ active, onChange }: Props) {
  return (
    <View className="flex-row items-center justify-around border-t border-gray-100 bg-white px-2 pb-6 pt-2">
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onChange?.(tab.key)}
            className="items-center justify-center px-3 py-1"
          >
            {isActive ? (
              <LinearGradient
                colors={["#F472B6", "#FB923C"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather name={tab.icon} size={18} color="#fff" />
              </LinearGradient>
            ) : (
              <Feather name={tab.icon} size={20} color="#9CA3AF" />
            )}
            <Text
              className={`mt-1 text-[11px] ${isActive ? "font-semibold text-rose-500" : "text-gray-400"}`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
