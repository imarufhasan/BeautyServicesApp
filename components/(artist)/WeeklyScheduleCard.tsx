import GradientActionButton from "@/components/common/GradientActionButton";
import { DaySchedule } from "@/constants/availability";
import { DayOfWeek } from "@/constants/types";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { GradientSwitch } from "./SharedControls";

interface WeeklyScheduleCardProps {
  schedule: DaySchedule[];
  scheduleToggles: Record<DayOfWeek, boolean>;
  toggleDay: (day: DayOfWeek) => void;
  editingDay: DayOfWeek | null;
  onEditDay: (day: DayOfWeek | null) => void;
  monEveningSession: boolean;
  onToggleEveningSession: (v: boolean) => void;
  onEditAll: () => void;
}

export default function WeeklyScheduleCard({
  schedule,
  scheduleToggles,
  toggleDay,
  editingDay,
  onEditDay,
  monEveningSession,
  onToggleEveningSession,
  onEditAll,
}: WeeklyScheduleCardProps) {
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
            Weekly Schedule
          </Text>
          <Text className="text-xs text-gray-400">
            Tap any day to edit hours
          </Text>
        </View>
        <TouchableOpacity
          onPress={onEditAll}
          className="rounded-full bg-rose-50 px-3 py-1.5"
        >
          <Text className="text-xs font-semibold text-rose-500">
            ✎ Edit All
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mt-3">
        {schedule.map((d) => {
          const isOpen = editingDay === d.day;
          const isOn = scheduleToggles[d.day];
          return (
            <View
              key={d.day}
              className="mb-2 rounded-2xl border border-gray-100 bg-gray-50/60 px-4 py-3"
            >
              <TouchableOpacity
                className="flex-row items-center justify-between"
                onPress={() => onEditDay(isOpen ? null : d.day)}
              >
                <View className="flex-row items-center">
                  <GradientSwitch
                    value={isOn}
                    onValueChange={() => toggleDay(d.day)}
                  />
                  <Text className="ml-3 text-[15px] font-semibold text-gray-800">
                    {d.day}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-[13px] text-gray-500">
                    {isOn && d.startTime
                      ? `${d.startTime} – ${d.endTime}`
                      : "Day off"}
                  </Text>
                  {isOn && (
                    <Feather
                      name={isOpen ? "chevron-up" : "chevron-down"}
                      size={16}
                      color="#9CA3AF"
                      style={{ marginLeft: 6 }}
                    />
                  )}
                </View>
              </TouchableOpacity>

              {isOpen && isOn && (
                <View className="mt-4">
                  <Text className="mb-1 text-[10px] font-semibold tracking-wider text-gray-400">
                    SESSION
                  </Text>
                  <View className="flex-row" style={{ gap: 10 }}>
                    <View className="flex-1">
                      <Text className="mb-1 text-[10px] text-gray-400">
                        START TIME
                      </Text>
                      <TextInput
                        placeholder={d.startTime ?? "09:00 AM"}
                        placeholderTextColor="#C9C4CF"
                        className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="mb-1 text-[10px] text-gray-400">
                        END TIME
                      </Text>
                      <TextInput
                        placeholder={d.endTime ?? "06:00 PM"}
                        placeholderTextColor="#C9C4CF"
                        className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700"
                      />
                    </View>
                  </View>

                  <View className="mt-4 flex-row items-center justify-between mb-1">
                    <Text className="text-[10px] font-semibold tracking-wider text-gray-400">
                      BREAK TIME
                    </Text>
                    <TouchableOpacity className="h-5 w-5 items-center justify-center rounded-full bg-rose-400">
                      <Feather name="plus" size={11} color="#fff" />
                    </TouchableOpacity>
                  </View>
                  <View className="flex-row" style={{ gap: 10 }}>
                    <View className="flex-1">
                      <Text className="mb-1 text-[10px] text-gray-400">
                        FROM
                      </Text>
                      <TextInput
                        placeholder="--:--"
                        placeholderTextColor="#C9C4CF"
                        className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="mb-1 text-[10px] text-gray-400">TO</Text>
                      <TextInput
                        placeholder="--:--"
                        placeholderTextColor="#C9C4CF"
                        className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700"
                      />
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => onToggleEveningSession(!monEveningSession)}
                    className="mt-4 flex-row items-center"
                  >
                    <GradientSwitch
                      value={monEveningSession}
                      onValueChange={onToggleEveningSession}
                    />
                    <Text className="ml-2 text-[13px] text-gray-500">
                      Evening Session
                    </Text>
                  </TouchableOpacity>

                  <View className="mt-4 flex-row" style={{ gap: 10 }}>
                    <View className="flex-1">
                      <GradientActionButton
                        title="Save"
                        onPress={() => onEditDay(null)}
                        height={40}
                      />
                    </View>

                    <TouchableOpacity
                      className="flex-1 h-[40px] items-center justify-center rounded-full border"
                      style={{ borderColor: "#FBCFE8" }}
                      onPress={() => onEditDay(null)}
                    >
                      <Text className="text-sm font-semibold text-rose-400">
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}
