import GradientActionButton from "@/components/common/GradientActionButton";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

export type RecurringMode = "Weekly" | "Monthly" | "Custom";
export type RecurringPattern =
  "everyMonday" | "everyWeekend" | "weekdaysOnly" | "customDays";

export interface RecurringScheduleConfig {
  mode: RecurringMode;
  pattern: RecurringPattern;
  repeatUntil: string;
}

const PATTERN_OPTIONS: { key: RecurringPattern; label: string }[] = [
  { key: "everyMonday", label: "Every Monday" },
  { key: "everyWeekend", label: "Every Weekend" },
  { key: "weekdaysOnly", label: "Weekdays Only" },
  { key: "customDays", label: "Custom Days" },
];

interface Props {
  visible: boolean;
  onClose: () => void;
  initial: RecurringScheduleConfig;
  onSave: (config: RecurringScheduleConfig) => void;
}

export default function RecurringScheduleModal({
  visible,
  onClose,
  initial,
  onSave,
}: Props) {
  const [mode, setMode] = useState<RecurringMode>(initial.mode);
  const [pattern, setPattern] = useState<RecurringPattern>(initial.pattern);
  const [repeatUntil, setRepeatUntil] = useState(initial.repeatUntil);

  useEffect(() => {
    if (visible) {
      setMode(initial.mode);
      setPattern(initial.pattern);
      setRepeatUntil(initial.repeatUntil);
    }
  }, [visible, initial]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/40">
        <View className="rounded-t-[24px] bg-[#FFF6F8] pt-3 px-5 pb-8">
          <View className="self-center w-10 h-1 rounded-full bg-[#E3E0E6] mb-3" />

          <View className="flex-row items-center justify-between pb-4 mb-4 border-b border-[#F1E4E8]">
            <Text className="text-[19px] font-extrabold text-[#161119]">
              Recurring Schedule
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-[#F1EEF1] items-center justify-center"
              hitSlop={8}
            >
              <Ionicons name="close" size={16} color="#8A8590" />
            </TouchableOpacity>
          </View>

          {/* Mode tabs */}
          <View className="flex-row rounded-full bg-[#F1EEF1] p-1 mb-5">
            {(["Weekly", "Monthly", "Custom"] as RecurringMode[]).map((m) => {
              const active = m === mode;
              return (
                <TouchableOpacity
                  key={m}
                  onPress={() => setMode(m)}
                  className="flex-1 rounded-full overflow-hidden"
                >
                  {active ? (
                    <LinearGradient
                      colors={["#EC4899", "#FB923C"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      className="items-center justify-center py-2.5"
                    >
                      <Text className="text-[13px] font-bold text-white">
                        {m}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View className="items-center justify-center py-2.5">
                      <Text className="text-[13px] font-medium text-[#8A8590]">
                        {m}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <Text className="text-[15px] font-bold text-[#161119] mb-3">
            Pattern
          </Text>
          <View className="mb-5" style={{ gap: 10 }}>
            {PATTERN_OPTIONS.map((opt) => {
              const active = opt.key === pattern;
              return (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => setPattern(opt.key)}
                  className={`flex-row items-center rounded-2xl border px-4 py-3.5 ${
                    active
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-transparent bg-[#F7F5F7]"
                  }`}
                >
                  <View
                    className={`w-5 h-5 rounded-full border-2 items-center justify-center mr-3 ${
                      active ? "border-emerald-500" : "border-[#D9D5DE]"
                    }`}
                  >
                    {active && (
                      <View className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    )}
                  </View>
                  <Text
                    className={`text-[14px] font-medium ${active ? "text-emerald-700" : "text-[#161119]"}`}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text className="text-[15px] font-bold text-[#161119] mb-2">
            Repeat Until
          </Text>
          <TextInput
            value={repeatUntil}
            onChangeText={setRepeatUntil}
            placeholder="Select end date (optional)"
            placeholderTextColor="#B7B2BC"
            className="rounded-[14px] border border-[#ECECEC] bg-white px-4 py-3.5 text-[14px] text-[#161119] mb-6"
          />

          <GradientActionButton
            title="Save Recurring Schedule"
            onPress={() => onSave({ mode, pattern, repeatUntil })}
          />
        </View>
      </View>
    </Modal>
  );
}
