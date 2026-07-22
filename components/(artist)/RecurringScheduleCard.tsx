import { RecurringScheduleConfig } from "@/components/(artist)/RecurringScheduleModal";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Chip } from "./SharedControls";

interface RecurringScheduleCardProps {
  recurringConfig: RecurringScheduleConfig;
  onOpenModal: () => void;
}

export default function RecurringScheduleCard({
  recurringConfig,
  onOpenModal,
}: RecurringScheduleCardProps) {
  return (
    <View
      className="rounded-3xl bg-white p-4 shadow-sm mb-5"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      }}
    >
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-base font-bold text-gray-900">
            Recurring Schedule
          </Text>
          <Text className="text-xs text-gray-400">
            Repeat availability patterns
          </Text>
        </View>
        <TouchableOpacity
          onPress={onOpenModal}
          className="flex-row items-center rounded-full bg-emerald-50 px-3 py-1.5"
        >
          <Feather name="repeat" size={12} color="#10B981" />
          <Text className="ml-1 text-xs font-semibold text-emerald-500">
            Configure
          </Text>
        </TouchableOpacity>
      </View>
      <View className="mt-3 flex-row flex-wrap" style={{ gap: 10 }}>
        <Chip
          label="Weekly Repeat"
          active={recurringConfig.mode === "Weekly"}
        />
        <Chip
          label="Monthly Repeat"
          active={recurringConfig.mode === "Monthly"}
        />
        <Chip
          label="Weekdays Only"
          active={recurringConfig.pattern === "weekdaysOnly"}
        />
        <Chip
          label="Custom Days"
          active={recurringConfig.pattern === "customDays"}
        />
      </View>
    </View>
  );
}
