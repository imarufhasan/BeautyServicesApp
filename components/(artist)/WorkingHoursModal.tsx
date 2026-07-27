import { COLORS } from "@/constants/colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  PanResponder,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GradientSwitch } from "./SharedControls";

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface BreakTimeSlot {
  id: string;
  from: string;
  to: string;
}

export interface WorkingHoursDay {
  day: DayOfWeek;
  isActive: boolean;
  startTime: string;
  endTime: string;
  breakTimes: BreakTimeSlot[];
  hasEveningSession: boolean;
  eveningStart: string;
  eveningEnd: string;
}

const makeBreakSlot = (day: DayOfWeek, index: number): BreakTimeSlot => ({
  id: `${day}-brk-${index}`,
  from: "",
  to: "",
});

const DEFAULT_DAYS: WorkingHoursDay[] = [
  {
    day: "Monday",
    isActive: true,
    startTime: "",
    endTime: "",
    breakTimes: [makeBreakSlot("Monday", 1)],
    hasEveningSession: false,
    eveningStart: "",
    eveningEnd: "",
  },
  {
    day: "Tuesday",
    isActive: true,
    startTime: "",
    endTime: "",
    breakTimes: [makeBreakSlot("Tuesday", 1)],
    hasEveningSession: false,
    eveningStart: "",
    eveningEnd: "",
  },
  {
    day: "Wednesday",
    isActive: true,
    startTime: "",
    endTime: "",
    breakTimes: [makeBreakSlot("Wednesday", 1)],
    hasEveningSession: true,
    eveningStart: "",
    eveningEnd: "",
  },
  {
    day: "Thursday",
    isActive: true,
    startTime: "",
    endTime: "",
    breakTimes: [makeBreakSlot("Thursday", 1)],
    hasEveningSession: false,
    eveningStart: "",
    eveningEnd: "",
  },
  {
    day: "Friday",
    isActive: true,
    startTime: "",
    endTime: "",
    breakTimes: [makeBreakSlot("Friday", 1)],
    hasEveningSession: false,
    eveningStart: "",
    eveningEnd: "",
  },
  {
    day: "Saturday",
    isActive: true,
    startTime: "",
    endTime: "",
    breakTimes: [makeBreakSlot("Saturday", 1)],
    hasEveningSession: false,
    eveningStart: "",
    eveningEnd: "",
  },
  {
    day: "Sunday",
    isActive: false,
    startTime: "",
    endTime: "",
    breakTimes: [makeBreakSlot("Sunday", 1)],
    hasEveningSession: false,
    eveningStart: "",
    eveningEnd: "",
  },
];

const DAY_SUMMARY: Partial<Record<DayOfWeek, string>> = {
  Monday: "9:00 AM – 6:00 PM",
  Tuesday: "9:00 AM – 6:00 PM",
  Wednesday: "10:00 AM – 5:00 PM",
  Thursday: "9:00 AM – 6:00 PM",
  Friday: "9:00 AM – 4:00 PM",
  Saturday: "10:00 AM – 3:00 PM",
};

const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 0.8;

/** Parse "hh:mm AM/PM" -> Date (today's date, that time) */
const parseTimeString = (timeStr: string): Date => {
  const date = new Date();
  date.setSeconds(0, 0);
  if (!timeStr) return date;
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return date;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  date.setHours(hours, minutes, 0, 0);
  return date;
};

/** Format Date -> "hh:mm AM/PM" */
const formatTimeString = (date: Date): string => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${hours}:${minutesStr} ${period}`;
};

interface TimeInputFieldProps {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

function TimeInputField({
  label,
  value,
  placeholder,
  onChange,
}: TimeInputFieldProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (event: any, selectedDate?: Date) => {
    // Android fires "dismissed" on cancel; iOS keeps picker open until user confirms
    if (event.type === "dismissed") {
      setShowPicker(false);
      return;
    }
    if (selectedDate) {
      onChange(formatTimeString(selectedDate));
    }
    if (event.type === "set") {
      setShowPicker(false);
    }
  };

  return (
    <View className="flex-1">
      <Text className="mb-1 text-[10px] text-[#B7B2BC]">{label}</Text>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setShowPicker(true)}
        className="rounded-[12px] border border-[#F1D9E1] bg-white px-3 py-3"
      >
        <Text
          className="text-sm"
          style={{ color: value ? "#161119" : "#C9C4CF" }}
        >
          {value || placeholder}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={parseTimeString(value)}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={handleChange}
        />
      )}
    </View>
  );
}

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

  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      translateY.setValue(0);
    }
  }, [visible, translateY]);

  const closeWithDrag = () => {
    Animated.timing(translateY, {
      toValue: 800,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      onClose();
      translateY.setValue(0);
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        gestureState.dy > 6 &&
        Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
      onPanResponderMove: (_, gestureState) => {
        translateY.setValue(Math.max(0, gestureState.dy));
      },
      onPanResponderRelease: (_, gestureState) => {
        if (
          gestureState.dy > DISMISS_DISTANCE ||
          gestureState.vy > DISMISS_VELOCITY
        ) {
          closeWithDrag();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 6,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 6,
        }).start();
      },
    }),
  ).current;

  const update = (day: DayOfWeek, patch: Partial<WorkingHoursDay>) => {
    setDays((prev) =>
      prev.map((d) => (d.day === day ? { ...d, ...patch } : d)),
    );
  };

  const addBreakTime = (day: DayOfWeek) => {
    setDays((prev) =>
      prev.map((d) =>
        d.day === day
          ? {
              ...d,
              breakTimes: [
                ...d.breakTimes,
                { id: `${day}-brk-${Date.now()}`, from: "", to: "" },
              ],
            }
          : d,
      ),
    );
  };

  const removeBreakTime = (day: DayOfWeek, id: string) => {
    setDays((prev) =>
      prev.map((d) =>
        d.day === day
          ? { ...d, breakTimes: d.breakTimes.filter((b) => b.id !== id) }
          : d,
      ),
    );
  };

  const updateBreakTime = (
    day: DayOfWeek,
    id: string,
    key: "from" | "to",
    value: string,
  ) => {
    setDays((prev) =>
      prev.map((d) =>
        d.day === day
          ? {
              ...d,
              breakTimes: d.breakTimes.map((b) =>
                b.id === id ? { ...b, [key]: value } : b,
              ),
            }
          : d,
      ),
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
        <Animated.View
          className="rounded-t-[24px] bg-[#FFF6F8] pt-2 pb-10"
          style={{ maxHeight: "92%", transform: [{ translateY }] }}
        >
          <View {...panResponder.panHandlers}>
            <View className="w-full">
              <View className="self-center w-10 h-1 rounded-full bg-[#E3E0E6] mb-3 mt-2" />
            </View>

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
                    <GradientSwitch
                      value={d.isActive}
                      onValueChange={(v) => update(d.day, { isActive: v })}
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
                      <TimeInputField
                        label="START"
                        value={d.startTime}
                        placeholder="09:00 AM"
                        onChange={(v) => update(d.day, { startTime: v })}
                      />
                      <TimeInputField
                        label="END"
                        value={d.endTime}
                        placeholder="06:00 PM"
                        onChange={(v) => update(d.day, { endTime: v })}
                      />
                    </View>

                    <View className="mt-4 flex-row items-center justify-between mb-2">
                      <Text className="text-[10px] font-bold tracking-wider text-[#B7B2BC]">
                        BREAK TIME
                      </Text>
                      <TouchableOpacity
                        onPress={() => addBreakTime(d.day)}
                        style={{ backgroundColor: COLORS.blueColor }}
                        className="h-5 w-5 items-center justify-center rounded-full"
                      >
                        <Feather name="plus" size={11} color="#fff" />
                      </TouchableOpacity>
                    </View>

                    {d.breakTimes.map((breakItem) => (
                      <View
                        key={breakItem.id}
                        className="mb-3 flex-row items-end"
                        style={{ gap: 10 }}
                      >
                        <TimeInputField
                          label="FROM"
                          value={breakItem.from}
                          placeholder="--:--"
                          onChange={(v) =>
                            updateBreakTime(d.day, breakItem.id, "from", v)
                          }
                        />
                        <TimeInputField
                          label="TO"
                          value={breakItem.to}
                          placeholder="--:--"
                          onChange={(v) =>
                            updateBreakTime(d.day, breakItem.id, "to", v)
                          }
                        />

                        {d.breakTimes.length > 1 && (
                          <TouchableOpacity
                            onPress={() => removeBreakTime(d.day, breakItem.id)}
                            hitSlop={8}
                            className="h-6 w-6 items-center justify-center rounded-full bg-[#F1D9E1] mb-3"
                          >
                            <Ionicons name="close" size={13} color="#8A8590" />
                          </TouchableOpacity>
                        )}
                      </View>
                    ))}

                    {/* <TouchableOpacity
                      onPress={() =>
                        update(d.day, {
                          hasEveningSession: !d.hasEveningSession,
                        })
                      }
                      className="mt-4 flex-row items-center"
                    >
                      <GradientSwitch
                        value={d.hasEveningSession}
                        onValueChange={(v) =>
                          update(d.day, { hasEveningSession: v })
                        }
                      />
                      <Text className="ml-2 text-[12px] font-semibold text-[#8A8590]">
                        EVENING SESSION
                      </Text>
                    </TouchableOpacity> */}

                    {d.hasEveningSession && (
                      <View className="mt-3 flex-row" style={{ gap: 10 }}>
                        <TimeInputField
                          label="START"
                          value={d.eveningStart}
                          placeholder="06:00 PM"
                          onChange={(v) => update(d.day, { eveningStart: v })}
                        />
                        <TimeInputField
                          label="END"
                          value={d.eveningEnd}
                          placeholder="09:00 PM"
                          onChange={(v) => update(d.day, { eveningEnd: v })}
                        />
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
              className="overflow-hidden rounded-2xl"
            >
              <LinearGradient
                colors={[COLORS.baseColor1, COLORS.baseColor2]}
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
        </Animated.View>
      </View>
    </Modal>
  );
}
