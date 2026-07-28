import { RecurringScheduleConfig } from "@/components/(artist)/RecurringScheduleModal";
import React from "react";
import { Text, View } from "react-native";
import { Chip } from "./SharedControls";

interface RecurringScheduleCardProps {
  recurringConfig: RecurringScheduleConfig;
  onOpenModal: () => void;
  onSelectMode: (mode: RecurringScheduleConfig["mode"]) => void;
}

export default function RecurringScheduleCard({
  recurringConfig,
  onOpenModal,
  onSelectMode,
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
      </View>
      <View className="mt-3 flex-row flex-wrap" style={{ gap: 10 }}>
        <Chip
          label="Weekly Repeat"
          active={recurringConfig.mode === "Weekly"}
          onPress={() => onSelectMode("Weekly")}
        />
        <Chip
          label="Monthly Repeat"
          active={recurringConfig.mode === "Monthly"}
          onPress={() => onSelectMode("Monthly")}
        />
      </View>
    </View>
  );
}
