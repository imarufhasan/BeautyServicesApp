import { COLORS } from "@/constants/colors";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
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

        <View className="flex-row items-center gap-2">
          {vacationConfig.enabled && hasDates && (
            <View
              className="rounded-full px-3 py-1"
              style={{ backgroundColor: COLORS.blueColor2 }}
            >
              <Text
                className="font-semibold text-sm"
                style={{ color: COLORS.blueColor }}
              >
                Active
              </Text>
            </View>
          )}

          <GradientSwitch
            value={vacationConfig.enabled}
            onValueChange={onToggleEnabled}
          />
        </View>
      </View>

      {/* Content */}
      <View className="mt-5 rounded-2xl  py-4 items-center">
        {vacationConfig.enabled && hasDates ? (
          <>
            {/* <Text className="mt-2 text-sm font-bold text-gray-800">
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
            ) : null} */}

            <View
              style={{
                borderWidth: 1,
                borderRadius: 20,
                borderColor: COLORS.blueColor,
                backgroundColor: COLORS.blueColor2,
              }}
              className="p-5 w-full"
            >
              <View className="flex-row items-center">
                <Ionicons
                  name="umbrella-outline"
                  size={18}
                  color="#F97316"

                  style={{ marginRight: 6 }}
                />
                <Text className="text-[14px] font-bold text-[#161119]">
                  Away: {vacationConfig.endDate}
                </Text>
              </View>
              <Text className="mt-1 text-[13px] text-[#4B5563]">
                Taking a break. Back soon!
              </Text>
            </View>
          </>
        ) : (
          <>
            <Ionicons name="umbrella-outline" size={36} color="#F97316" />
            <Text className="mt-2 text-sm text-gray-400 text-center">
              Vacation mode is currently disabled.
            </Text>
          </>
        )}

        <TouchableOpacity
          onPress={onOpenModal}
          className="mt-3 rounded-full bg-white px-5 py-2 flex-row gap-2"
        >
          <FontAwesome name="pencil" size={14} color={"#f97316"} />
          <Text className="text-sm font-semibold text-orange-500">
            {hasDates ? "Edit Vacation Dates" : "Set Vacation Dates"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
