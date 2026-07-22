import { todayStatusDummy } from "@/constants/availability";
import { COLORS } from "@/constants/colors";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";
import { GradientSwitch } from "./SharedControls";

interface TodayStatusCardProps {
  isAvailableToday: boolean;
  onToggle: (v: boolean) => void;
  dateLabel?: string;
  timeRangeLabel?: string;
  nextLabel?: string;
}

export default function TodayStatusCard({
  isAvailableToday,
  onToggle,
  dateLabel = todayStatusDummy.dateLabel,
  timeRangeLabel = todayStatusDummy.timeRangeLabel,
  nextLabel = todayStatusDummy.nextLabel,
}: TodayStatusCardProps) {
  return (
    <View className="overflow-hidden rounded-3xl mb-5">
      <LinearGradient
        colors={[COLORS.baseColor1, COLORS.baseColor2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="p-5"
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-semibold tracking-wider text-white/80">
            TODAY
          </Text>
          <View className="flex-row items-center rounded-full bg-white/20 px-3 py-1">
            <View className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green-400" />
            <Text className="text-xs font-medium text-white">
              Available Today
            </Text>
          </View>
        </View>
        <Text className="mt-1 text-xl font-bold text-white">{dateLabel}</Text>
        <View className="mt-3 flex-row items-center">
          <Feather name="clock" size={13} color="#fff" />
          <Text className="ml-1.5 text-[13px] text-white/90">
            {timeRangeLabel}
          </Text>
          <Text className="mx-2 text-white/60">·</Text>
          <Feather name="calendar" size={13} color="#fff" />
          <Text className="ml-1.5 text-[13px] text-white/90">{nextLabel}</Text>
        </View>
        <View className="mt-4 flex-row items-center justify-between border-t border-white/10 px-4 py-3">
          <Text className="text-sm font-medium text-white">
            Available Today
          </Text>
          <GradientSwitch value={isAvailableToday} onValueChange={onToggle} />
        </View>
      </LinearGradient>
    </View>
  );
}
