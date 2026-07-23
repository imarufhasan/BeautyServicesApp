import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { GradientSwitch } from "./SharedControls";

export interface VacationConfig {
  enabled: boolean;
  startDate: string;
  endDate: string;
  message: string;
}

interface VacationModeCardProps {
  vacationConfig: VacationConfig;
  onToggleEnabled: (v: boolean) => void;
  onOpenModal: () => void;
}

export default function VacationCard({
  vacationConfig,
  onToggleEnabled,
  onOpenModal,
}: VacationModeCardProps) {
  const hasDates = vacationConfig.startDate && vacationConfig.endDate;

  return (
    <View
      className="rounded-3xl bg-white p-4 mb-5"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      }}
    >
      {/* Header */}
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

      {/* Content */}
      <View className="mt-5 rounded-2xl bg-orange-50 px-4 py-4 items-center">
        <Text className="text-[30px]">☂️</Text>

        {vacationConfig.enabled && hasDates ? (
          <>
            <Text className="mt-2 text-sm font-bold text-gray-800">
              Away {vacationConfig.startDate}
              {" - "}
              {vacationConfig.endDate}
            </Text>

            {vacationConfig.message ? (
              <Text
                className="mt-1 text-xs text-gray-500 text-center"
                numberOfLines={2}
              >
                {vacationConfig.message}
              </Text>
            ) : null}
          </>
        ) : (
          <Text className="mt-2 text-sm text-gray-400 text-center">
            Vacation mode is currently disabled.
          </Text>
        )}

        <TouchableOpacity
          onPress={onOpenModal}
          className="mt-3 rounded-full bg-white px-5 py-2"
        >
          <Text className="text-sm font-semibold text-orange-500">
            {hasDates ? "Edit Vacation" : "Set Vacation Dates"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
