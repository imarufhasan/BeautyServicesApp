import { VacationConfig } from "@/components/(artist)/VacationModeModal";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { GradientSwitch } from "./SharedControls";

interface VacationModeCardProps {
  vacationConfig: VacationConfig;
  onToggleEnabled: (v: boolean) => void;
  onOpenModal: () => void;
}

export default function VacationModeCard({
  vacationConfig,
  onToggleEnabled,
  onOpenModal,
}: VacationModeCardProps) {
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
            Vacation Mode
          </Text>
          <Text className="text-xs text-gray-400">
            Hide profile from new bookings
          </Text>
        </View>
        <GradientSwitch
          value={vacationConfig.enabled}
          onValueChange={onToggleEnabled}
        />
      </View>
      <View className="mt-4 items-center py-4">
        <Text style={{ fontSize: 28 }}>☂️</Text>
        <Text className="mt-2 text-[13px] text-gray-400">
          {vacationConfig.enabled &&
          vacationConfig.startDate &&
          vacationConfig.endDate
            ? `Away ${vacationConfig.startDate} – ${vacationConfig.endDate}`
            : "Vacation mode is currently disabled."}
        </Text>
        <TouchableOpacity onPress={onOpenModal} className="mt-1">
          <Text className="text-sm font-semibold text-orange-400">
            Set Vacation Dates
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
