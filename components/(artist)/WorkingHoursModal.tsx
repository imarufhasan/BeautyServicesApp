import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
    Modal,
    ScrollView,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface WorkingHoursDay {
  day: DayOfWeek;
  isActive: boolean;
  startTime: string;
  endTime: string;
  breakFrom: string;
  breakTo: string;
  hasEveningSession: boolean;
  eveningStart: string;
  eveningEnd: string;
}

const DEFAULT_DAYS: WorkingHoursDay[] = [
  {
    day: "Monday",
    isActive: true,
    startTime: "",
    endTime: "",
    breakFrom: "",
    breakTo: "",
    hasEveningSession: false,
    eveningStart: "",
    eveningEnd: "",
  },
  {
    day: "Tuesday",
    isActive: true,
    startTime: "",
    endTime: "",
    breakFrom: "",
    breakTo: "",
    hasEveningSession: false,
    eveningStart: "",
    eveningEnd: "",
  },
  {
    day: "Wednesday",
    isActive: true,
    startTime: "",
    endTime: "",
    breakFrom: "",
    breakTo: "",
    hasEveningSession: true,
    eveningStart: "",
    eveningEnd: "",
  },
  {
    day: "Thursday",
    isActive: true,
    startTime: "",
    endTime: "",
    breakFrom: "",
    breakTo: "",
    hasEveningSession: false,
    eveningStart: "",
    eveningEnd: "",
  },
  {
    day: "Friday",
    isActive: true,
    startTime: "",
    endTime: "",
    breakFrom: "",
    breakTo: "",
    hasEveningSession: false,
    eveningStart: "",
    eveningEnd: "",
  },
  {
    day: "Saturday",
    isActive: true,
    startTime: "",
    endTime: "",
    breakFrom: "",
    breakTo: "",
    hasEveningSession: false,
    eveningStart: "",
    eveningEnd: "",
  },
  {
    day: "Sunday",
    isActive: false,
    startTime: "",
    endTime: "",
    breakFrom: "",
    breakTo: "",
    hasEveningSession: false,
    eveningStart: "",
    eveningEnd: "",
  },
];

// Display-only summary shown at the top-right of each collapsed/active day row.
const DAY_SUMMARY: Partial<Record<DayOfWeek, string>> = {
  Monday: "9:00 AM – 6:00 PM",
  Tuesday: "9:00 AM – 6:00 PM",
  Wednesday: "10:00 AM – 5:00 PM",
  Thursday: "9:00 AM – 6:00 PM",
  Friday: "9:00 AM – 4:00 PM",
  Saturday: "10:00 AM – 3:00 PM",
};

interface Props {
  visible: boolean;
  onClose: () => void;
  initialDays?: WorkingHoursDay[];
  onSave: (days: WorkingHoursDay[]) => void;
}

export default function WorkingHoursModal({
  visible,
  onClose,
  initialDays,
  onSave,
}: Props) {
  const [days, setDays] = useState<WorkingHoursDay[]>(
    initialDays ?? DEFAULT_DAYS,
  );

  const update = (day: DayOfWeek, patch: Partial<WorkingHoursDay>) => {
    setDays((prev) =>
      prev.map((d) => (d.day === day ? { ...d, ...patch } : d)),
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/40">
        <View
          className="rounded-t-[24px] bg-[#FFF6F8] pt-2 pb-10"
          style={{ maxHeight: "92%" }}
        >
          <View className="self-center w-10 h-1 rounded-full bg-[#E3E0E6] mb-3" />

          <View className="flex-row items-center justify-between px-5 pb-3 border-b border-[#F1E4E8]">
            <Text className="text-[19px] font-extrabold text-[#161119]">
              Working Hours
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-white items-center justify-center"
              hitSlop={8}
            >
              <Ionicons name="close" size={16} color="#8A8590" />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="px-5 pt-4"
            contentContainerStyle={{ paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}
          >
            {days.map((d) => (
              <View
                key={d.day}
                className={`rounded-[20px] px-4 py-4 mb-4 ${d.isActive ? "bg-[#FDEFF3]" : "bg-[#F3F1F4]"}`}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Switch
                      value={d.isActive}
                      onValueChange={(v) => update(d.day, { isActive: v })}
                      trackColor={{ true: "#FB7185", false: "#E5E7EB" }}
                      thumbColor="#fff"
                    />
                    <Text className="ml-3 text-[15px] font-bold text-[#161119]">
                      {d.day}
                    </Text>
                  </View>
                  <Text className="text-[13px] text-[#8A8590]">
                    {d.isActive ? (DAY_SUMMARY[d.day] ?? "") : "Off"}
                  </Text>
                </View>

                {d.isActive && (
                  <View className="mt-4">
                    <Text className="text-[10px] font-bold tracking-wider text-[#B7B2BC] mb-2">
                      MORNING SESSION
                    </Text>
                    <View className="flex-row" style={{ gap: 10 }}>
                      <View className="flex-1">
                        <Text className="mb-1 text-[10px] text-[#B7B2BC]">
                          START
                        </Text>
                        <TextInput
                          value={d.startTime}
                          onChangeText={(v) => update(d.day, { startTime: v })}
                          placeholder="09:00 AM"
                          placeholderTextColor="#C9C4CF"
                          className="rounded-[12px] border border-[#F1D9E1] bg-white px-3 py-3 text-sm text-[#161119]"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="mb-1 text-[10px] text-[#B7B2BC]">
                          END
                        </Text>
                        <TextInput
                          value={d.endTime}
                          onChangeText={(v) => update(d.day, { endTime: v })}
                          placeholder="06:00 PM"
                          placeholderTextColor="#C9C4CF"
                          className="rounded-[12px] border border-[#F1D9E1] bg-white px-3 py-3 text-sm text-[#161119]"
                        />
                      </View>
                    </View>

                    <View className="mt-4 flex-row items-center justify-between mb-2">
                      <Text className="text-[10px] font-bold tracking-wider text-[#B7B2BC]">
                        BREAK TIME
                      </Text>
                      <TouchableOpacity className="h-5 w-5 items-center justify-center rounded-full bg-[#FB7185]">
                        <Ionicons name="add" size={12} color="#fff" />
                      </TouchableOpacity>
                    </View>
                    <View className="flex-row" style={{ gap: 10 }}>
                      <View className="flex-1">
                        <Text className="mb-1 text-[10px] text-[#B7B2BC]">
                          FROM
                        </Text>
                        <TextInput
                          value={d.breakFrom}
                          onChangeText={(v) => update(d.day, { breakFrom: v })}
                          placeholder="--:--"
                          placeholderTextColor="#C9C4CF"
                          className="rounded-[12px] border border-[#F1D9E1] bg-white px-3 py-3 text-sm text-[#161119]"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="mb-1 text-[10px] text-[#B7B2BC]">
                          TO
                        </Text>
                        <TextInput
                          value={d.breakTo}
                          onChangeText={(v) => update(d.day, { breakTo: v })}
                          placeholder="--:--"
                          placeholderTextColor="#C9C4CF"
                          className="rounded-[12px] border border-[#F1D9E1] bg-white px-3 py-3 text-sm text-[#161119]"
                        />
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() =>
                        update(d.day, {
                          hasEveningSession: !d.hasEveningSession,
                        })
                      }
                      className="mt-4 flex-row items-center"
                    >
                      <Switch
                        value={d.hasEveningSession}
                        onValueChange={(v) =>
                          update(d.day, { hasEveningSession: v })
                        }
                        trackColor={{ true: "#FB7185", false: "#E5E7EB" }}
                        thumbColor="#fff"
                      />
                      <Text className="ml-2 text-[12px] font-semibold text-[#8A8590]">
                        EVENING SESSION
                      </Text>
                    </TouchableOpacity>

                    {d.hasEveningSession && (
                      <View className="mt-3 flex-row" style={{ gap: 10 }}>
                        <View className="flex-1">
                          <Text className="mb-1 text-[10px] text-[#B7B2BC]">
                            START
                          </Text>
                          <TextInput
                            value={d.eveningStart}
                            onChangeText={(v) =>
                              update(d.day, { eveningStart: v })
                            }
                            placeholder="06:00 PM"
                            placeholderTextColor="#C9C4CF"
                            className="rounded-[12px] border border-[#F1D9E1] bg-white px-3 py-3 text-sm text-[#161119]"
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="mb-1 text-[10px] text-[#B7B2BC]">
                            END
                          </Text>
                          <TextInput
                            value={d.eveningEnd}
                            onChangeText={(v) =>
                              update(d.day, { eveningEnd: v })
                            }
                            placeholder="09:00 PM"
                            placeholderTextColor="#C9C4CF"
                            className="rounded-[12px] border border-[#F1D9E1] bg-white px-3 py-3 text-sm text-[#161119]"
                          />
                        </View>
                      </View>
                    )}
                  </View>
                )}
              </View>
            ))}
          </ScrollView>

          <View className="px-5 pb-8 pt-2 bg-[#FFF6F8]">
            <TouchableOpacity
              onPress={() => onSave(days)}
              className="overflow-hidden rounded-full"
            >
              <LinearGradient
                colors={["#EC4899", "#FB923C"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="items-center justify-center py-4"
              >
                <Text className="text-[15px] font-bold text-white">
                  Save Working Hours
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
