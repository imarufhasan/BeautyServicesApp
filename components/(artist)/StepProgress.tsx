// components/registration/StepProgress.tsx

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const SEGMENT_COLORS = ["#FF5FA2", "#FFA35C", "#B57EDC"];

export const StepHeader = ({
  title,
  step,
  showBack = true,
}: {
  title: string;
  step: 1 | 2 | 3;
  showBack?: boolean;
}) => (
  <View className="flex-row items-center justify-between mt-6 mb-6">
    <View className="flex-row items-center">
      {showBack && (
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-white items-center justify-center mr-3"
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            elevation: 1,
          }}
        >
          <Ionicons name="arrow-back" size={18} color="#161119" />
        </TouchableOpacity>
      )}
      <Text className="text-[19px] font-extrabold text-[#161119]">{title}</Text>
    </View>
    <View className="rounded-full bg-[#F4E9FB] px-3 py-1">
      <Text className="text-xs font-bold text-[#B57EDC]">Step {step} of 3</Text>
    </View>
  </View>
);

export const StepProgressBar = ({ step }: { step: 1 | 2 | 3 }) => (
  <View className="flex-row items-center mb-6" style={{ gap: 8 }}>
    {[1, 2, 3].map((s) =>
      s <= step ? (
        <LinearGradient
          key={s}
          colors={[
            SEGMENT_COLORS[s - 1],
            s < 3 ? SEGMENT_COLORS[s] : SEGMENT_COLORS[s - 1],
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="h-1.5 flex-1 rounded-full"
        />
      ) : (
        <View key={s} className="h-1.5 flex-1 rounded-full bg-[#ECECEC]" />
      ),
    )}
  </View>
);
