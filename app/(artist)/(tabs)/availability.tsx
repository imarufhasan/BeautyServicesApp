import BlockDateModal, {
  BlockDateInput,
} from "@/components/(artist)/BlockDateModal";
import QuickBookingModal, {
  QuickBookingConfig,
} from "@/components/(artist)/QuickBookingModal";
import RecurringScheduleModal, {
  RecurringScheduleConfig,
} from "@/components/(artist)/RecurringScheduleModal";
import VacationModeModal, {
  VacationConfig,
} from "@/components/(artist)/VacationModeModal";
import WorkingHoursModal, {
  WorkingHoursDay,
} from "@/components/(artist)/WorkingHoursModal";
import GradientActionButton from "@/components/common/GradientActionButton";
import { COLORS } from "@/constants/colors";
import { availabilityDummyResponse } from "@/constants/dummyData";
import { CalendarDayStatus, DayOfWeek } from "@/constants/types";
import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STATUS_DOT_COLOR: Record<CalendarDayStatus, string> = {
  available: "#34D399",
  booked: "#FB7185",
  blocked: "#9CA3AF",
  vacation: "#F59E0B",
  today: "#FB7185",
  none: "transparent",
};

const WEEK_HEADER = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export default function AvailabilityScreen() {
  interface DaySchedule {
    day: DayOfWeek;
    isActive: boolean;
    startTime: string | null;
    endTime: string | null;
  }

  const weeklyScheduleDummy: DaySchedule[] = [
    { day: "Monday", isActive: true, startTime: "9:00 AM", endTime: "6:00 PM" },
    {
      day: "Tuesday",
      isActive: true,
      startTime: "9:00 AM",
      endTime: "6:00 PM",
    },
    {
      day: "Wednesday",
      isActive: true,
      startTime: "10:00 AM",
      endTime: "5:00 PM",
    },
    {
      day: "Thursday",
      isActive: true,
      startTime: "9:00 AM",
      endTime: "6:00 PM",
    },
    { day: "Friday", isActive: true, startTime: "9:00 AM", endTime: "4:00 PM" },
    {
      day: "Saturday",
      isActive: true,
      startTime: "10:00 AM",
      endTime: "3:00 PM",
    },
    { day: "Sunday", isActive: false, startTime: null, endTime: null },
  ];

  type CalendarDayStatus =
    "available" | "booked" | "blocked" | "vacation" | "today" | "none";
  const STATUS_DOT_COLOR: Record<CalendarDayStatus, string> = {
    available: "#34D399",
    booked: "#FB7185",
    blocked: "#9CA3AF",
    vacation: "#F59E0B",
    today: "#FB7185",
    none: "transparent",
  };
  const WEEK_HEADER = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const calendarDaysDummy: { day: number; status: CalendarDayStatus }[] = [
    { day: 1, status: "none" },
    { day: 2, status: "today" },
    { day: 3, status: "booked" },
    { day: 4, status: "booked" },
    { day: 5, status: "none" },
    { day: 6, status: "available" },
    { day: 7, status: "available" },
    { day: 8, status: "available" },
    { day: 9, status: "booked" },
    { day: 10, status: "blocked" },
    { day: 11, status: "blocked" },
    { day: 12, status: "available" },
    { day: 13, status: "available" },
    { day: 14, status: "available" },
    { day: 15, status: "booked" },
    { day: 16, status: "available" },
    { day: 17, status: "booked" },
    { day: 18, status: "available" },
    { day: 19, status: "available" },
    { day: 20, status: "available" },
    { day: 21, status: "available" },
    { day: 22, status: "booked" },
    { day: 23, status: "available" },
    { day: 24, status: "available" },
    { day: 25, status: "booked" },
    { day: 26, status: "available" },
    { day: 27, status: "available" },
    { day: 28, status: "available" },
    { day: 29, status: "available" },
    { day: 30, status: "available" },
    { day: 31, status: "available" },
  ];

  interface BlockedDate {
    id: string;
    label: string;
    reason: string;
  }
  const initialBlockedDates: BlockedDate[] = [
    { id: "bd_1", label: "Fri, Jul 10", reason: "Personal Work · Client sch" },
    { id: "bd_2", label: "Sat, Jul 11", reason: "Holiday" },
  ];

  const initialRecurringConfig: RecurringScheduleConfig = {
    mode: "Weekly",
    pattern: "weekdaysOnly",
    repeatUntil: "",
  };

  const initialQuickBookingConfig: QuickBookingConfig = {
    enabled: true,
    minimumNoticeHours: 2,
    bookingBufferMinutes: 30,
    maxPerDay: 8,
  };

  const initialVacationConfig: VacationConfig = {
    enabled: false,
    startDate: "",
    endDate: "",
    message: "",
  };

  const [monEveningSession, setMonEveningSession] = useState(false);
  const [workingHoursOpen, setWorkingHoursOpen] = useState(false);

  // ---- Dynamic state driven by the 4 new modals ----
  const [blockedDates, setBlockedDates] =
    useState<BlockedDate[]>(initialBlockedDates);
  const [recurringConfig, setRecurringConfig] =
    useState<RecurringScheduleConfig>(initialRecurringConfig);
  const [quickBookingConfig, setQuickBookingConfig] =
    useState<QuickBookingConfig>(initialQuickBookingConfig);
  const [vacationConfig, setVacationConfig] = useState<VacationConfig>(
    initialVacationConfig,
  );

  const [blockDateModalOpen, setBlockDateModalOpen] = useState(false);
  const [recurringModalOpen, setRecurringModalOpen] = useState(false);
  const [quickBookingModalOpen, setQuickBookingModalOpen] = useState(false);
  const [vacationModalOpen, setVacationModalOpen] = useState(false);

  const handleSaveWorkingHours = (_days: WorkingHoursDay[]) => {
    // TODO: send `_days` to the API, then update weeklyScheduleDummy/local state.
    setWorkingHoursOpen(false);
  };

  const REASON_LABELS: Record<BlockDateInput["reason"], string> = {
    Holiday: "Holiday",
    "Personal Work": "Personal Work",
    "Medical Leave": "Medical Leave",
    "Private Event": "Private Event",
    Other: "Other",
  };

  const handleSaveBlockDate = (data: BlockDateInput) => {
    setBlockedDates((prev) => [
      ...prev,
      {
        id: `bd_${Date.now()}`,
        label: data.date,
        reason: data.notes
          ? `${REASON_LABELS[data.reason]} · ${data.notes}`
          : REASON_LABELS[data.reason],
      },
    ]);
    setBlockDateModalOpen(false);
  };

  const removeBlockedDate = (id: string) =>
    setBlockedDates((prev) => prev.filter((bd) => bd.id !== id));

  const handleSaveRecurring = (config: RecurringScheduleConfig) => {
    setRecurringConfig(config);
    setRecurringModalOpen(false);
  };

  const handleSaveQuickBooking = (config: QuickBookingConfig) => {
    setQuickBookingConfig(config);
    setQuickBookingModalOpen(false);
  };

  const handleSaveVacation = (config: VacationConfig) => {
    setVacationConfig(config);
    setVacationModalOpen(false);
  };

  const handleSaveAvailability = () => {
    // TODO: PATCH/PUT all availability state (weeklySchedule, blockedDates,
    // recurringConfig, quickBookingConfig, vacationConfig) to the API here.
    router.replace("/(artist)/(tabs)/profile");
  };

  // API call e eventually replace hobe:
  const availability = availabilityDummyResponse.data;
  const [isAvailableToday, setIsAvailableToday] = useState(
    availability.todayStatus.isAvailableToday,
  );
  const [editingDay, setEditingDay] = useState<DayOfWeek | null>("Monday");
  const [vacationEnabled, setVacationEnabled] = useState(
    availability.vacationMode.enabled,
  );
  const [instantBookingEnabled, setInstantBookingEnabled] = useState(
    availability.instantBooking.enabled,
  );
  const [scheduleToggles, setScheduleToggles] = useState<
    Record<DayOfWeek, boolean>
  >(
    availability.weeklySchedule.reduce(
      (acc, d) => ({ ...acc, [d.day]: d.isActive }),
      {} as Record<DayOfWeek, boolean>,
    ),
  );

  const toggleDay = (day: DayOfWeek) => {
    setScheduleToggles((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const leadingBlankCells = 2;

  const [eveningSessionToggles, setEveningSessionToggles] = useState<
    Record<DayOfWeek, boolean>
  >(
    availability.weeklySchedule.reduce(
      (acc, d) => ({
        ...acc,
        [d.day]: d.hasEveningSession,
      }),
      {} as Record<DayOfWeek, boolean>,
    ),
  );

  const toggleEveningSession = (day: DayOfWeek) => {
    setEveningSessionToggles((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  interface DaySchedule {
    day: DayOfWeek;
    isActive: boolean;
    startTime: string | null;
    endTime: string | null;
  }

  interface BlockedDate {
    id: string;
    label: string;
    reason: string;
  }

  return (
    <LinearGradient
      colors={["#FDEFF4", "#FFFFFF", "#EAF6F5"]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4 px-2 pt-4 pb-2">
            <View>
              <Text className="text-2xl font-bold text-gray-900">
                Availability
              </Text>
              <Text className="mt-1 text-sm text-gray-500">
                Manage your working hours and let clients know{"\n"}when
                you&apos;re available.
              </Text>
            </View>
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
              <Feather name="bell" size={18} color="#374151" />
            </TouchableOpacity>
          </View>

          {/* Today status gradient card */}
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
              <Text className="mt-1 text-xl font-bold text-white">
                Thursday, July 2
              </Text>
              <View className="mt-3 flex-row items-center">
                <Feather name="clock" size={13} color="#fff" />
                <Text className="ml-1.5 text-[13px] text-white/90">
                  9:00 AM – 6:00 PM
                </Text>
                <Text className="mx-2 text-white/60">·</Text>
                <Feather name="calendar" size={13} color="#fff" />
                <Text className="ml-1.5 text-[13px] text-white/90">
                  Next: 2:00 PM
                </Text>
              </View>
              <View className="mt-4 flex-row items-center justify-between border-t border-white/10 px-4 py-3">
                <Text className="text-sm font-medium text-white">
                  Available Today
                </Text>
                <GradientSwitch
                  value={isAvailableToday}
                  onValueChange={setIsAvailableToday}
                />
              </View>
            </LinearGradient>
          </View>

          {/* Weekly schedule */}
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
                onPress={() => setWorkingHoursOpen(true)}
                className="rounded-full bg-rose-50 px-3 py-1.5"
              >
                <Text className="text-xs font-semibold text-rose-500">
                  ✎ Edit All
                </Text>
              </TouchableOpacity>
            </View>

            <View className="mt-3">
              {weeklyScheduleDummy.map((d) => {
                const isOpen = editingDay === d.day;
                const isOn = scheduleToggles[d.day];
                return (
                  <View
                    key={d.day}
                    className="mb-2 rounded-2xl border border-gray-100 bg-gray-50/60 px-4 py-3"
                  >
                    <TouchableOpacity
                      className="flex-row items-center justify-between"
                      onPress={() => setEditingDay(isOpen ? null : d.day)}
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
                            <Text className="mb-1 text-[10px] text-gray-400">
                              TO
                            </Text>
                            <TextInput
                              placeholder="--:--"
                              placeholderTextColor="#C9C4CF"
                              className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700"
                            />
                          </View>
                        </View>

                        <TouchableOpacity
                          onPress={() => setMonEveningSession((v) => !v)}
                          className="mt-4 flex-row items-center"
                        >
                          <GradientSwitch
                            value={monEveningSession}
                            onValueChange={setMonEveningSession}
                          />
                          <Text className="ml-2 text-[13px] text-gray-500">
                            Evening Session
                          </Text>
                        </TouchableOpacity>

                        <View className="mt-4 flex-row" style={{ gap: 10 }}>
                          <View className="flex-1">
                            <GradientActionButton
                              title="Save"
                              onPress={() => setEditingDay(null)}
                            />
                          </View>
                          <TouchableOpacity
                            className="flex-1 items-center justify-center rounded-full border py-2.5"
                            style={{ borderColor: "#FBCFE8" }}
                            onPress={() => setEditingDay(null)}
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

          {/* Calendar */}
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
            <View className="flex-row items-center justify-between px-1">
              <TouchableOpacity className="h-8 w-8 items-center justify-center rounded-full bg-gray-50">
                <Feather name="chevron-left" size={16} color="#6B7280" />
              </TouchableOpacity>
              <Text className="text-base font-bold text-gray-900">
                July 2026
              </Text>
              <TouchableOpacity className="h-8 w-8 items-center justify-center rounded-full bg-gray-50">
                <Feather name="chevron-right" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View className="mt-3 flex-row justify-between">
              {WEEK_HEADER.map((w) => (
                <Text
                  key={w}
                  className="w-9 text-center text-[11px] font-medium text-gray-400"
                >
                  {w}
                </Text>
              ))}
            </View>

            <View className="mt-1 flex-row flex-wrap">
              {Array.from({ length: leadingBlankCells }).map((_, i) => (
                <View
                  key={`blank-${i}`}
                  style={{ width: "14.28%" }}
                  className="items-center py-2"
                />
              ))}
              {calendarDaysDummy.map((d) => (
                <View
                  key={d.day}
                  style={{ width: "14.28%" }}
                  className="items-center py-2"
                >
                  <View
                    className={`h-8 w-8 items-center justify-center rounded-full ${d.status === "today" ? "bg-rose-100" : ""}`}
                  >
                    <Text
                      className={`text-[13px] ${d.status === "today" ? "font-bold text-rose-500" : "text-gray-700"}`}
                    >
                      {d.day}
                    </Text>
                  </View>
                  {d.status !== "none" && (
                    <View
                      className="mt-0.5 h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: STATUS_DOT_COLOR[d.status] }}
                    />
                  )}
                </View>
              ))}
            </View>

            <View
              className="mt-3 flex-row flex-wrap items-center"
              style={{ gap: 14 }}
            >
              <LegendDot color="#34D399" label="Available" />
              <LegendDot color="#FB7185" label="Booked" />
              <LegendDot color="#9CA3AF" label="Blocked" />
              <LegendDot color="#F59E0B" label="Vacation" />
              <LegendDot color="#FB7185" label="Today" />
            </View>
          </View>

          {/* Blocked dates */}
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
                  Blocked Dates
                </Text>
                <Text className="text-xs text-gray-400">
                  {blockedDates.length} dates blocked
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setBlockDateModalOpen(true)}
                className="flex-row items-center rounded-full bg-rose-50 px-3 py-1.5"
              >
                <Feather name="plus" size={12} color="#FB7185" />
                <Text className="ml-1 text-xs font-semibold text-rose-500">
                  Add Date
                </Text>
              </TouchableOpacity>
            </View>
            {blockedDates.map((bd) => (
              <View
                key={bd.id}
                className="mt-3 flex-row items-center justify-between rounded-2xl bg-rose-50/60 px-4 py-3"
              >
                <View className="flex-row items-center flex-1 pr-2">
                  <View className="h-8 w-8 items-center justify-center rounded-full bg-rose-100">
                    <Ionicons name="ban-outline" size={14} color="#FB7185" />
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="text-sm font-semibold text-gray-800">
                      {bd.label}
                    </Text>
                    <Text className="text-xs text-gray-400" numberOfLines={1}>
                      {bd.reason}
                    </Text>
                  </View>
                </View>
                <View className="flex-row" style={{ gap: 14 }}>
                  <Feather name="edit-2" size={15} color="#FB923C" />
                  <TouchableOpacity onPress={() => removeBlockedDate(bd.id)}>
                    <Feather name="trash-2" size={15} color="#FB7185" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* Vacation mode */}
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
                onValueChange={(v) =>
                  setVacationConfig((prev) => ({ ...prev, enabled: v }))
                }
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
              <TouchableOpacity
                onPress={() => setVacationModalOpen(true)}
                className="mt-1"
              >
                <Text className="text-sm font-semibold text-orange-400">
                  Set Vacation Dates
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recurring schedule */}
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
                onPress={() => setRecurringModalOpen(true)}
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

          {/* Quick Booking */}
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
                  Quick Booking
                </Text>
                <Text className="text-xs text-gray-400">
                  Auto-confirm client bookings
                </Text>
              </View>
              <GradientSwitch
                value={quickBookingConfig.enabled}
                onValueChange={(v) =>
                  setQuickBookingConfig((prev) => ({ ...prev, enabled: v }))
                }
              />
            </View>
            <View className="mt-3 rounded-2xl bg-emerald-50 px-4 py-3">
              <Text className="text-[13px] text-emerald-700">
                Clients can Quickly confirm bookings without manual approval
                from you.
              </Text>
            </View>
            <View className="mt-3">
              <InfoRow
                label="Minimum Notice"
                value={`${quickBookingConfig.minimumNoticeHours}h`}
              />
              <InfoRow
                label="Booking Buffer"
                value={`${quickBookingConfig.bookingBufferMinutes} min`}
              />
              <InfoRow
                label="Max / Day"
                value={`${quickBookingConfig.maxPerDay} bookings`}
              />
            </View>
            <TouchableOpacity
              onPress={() => setQuickBookingModalOpen(true)}
              className="mt-2 items-center"
            >
              <Text className="text-sm font-semibold text-rose-400">
                ✎ Edit Settings
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bottom buttons */}
          <View className="flex-row" style={{ gap: 12 }}>
            <TouchableOpacity
              style={{ borderColor: COLORS.baseColor, borderWidth: 1 }}
              className="flex-1 h-[45px] items-center justify-center rounded-full border py-3.5"
            >
              <Text
                style={{ color: COLORS.baseColor }}
                className="text-base font-semibold"
              >
                Reset Changes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 overflow-hidden rounded-full"
              onPress={handleSaveAvailability}
            >
              <LinearGradient
                colors={[COLORS.baseColor1, COLORS.baseColor2]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="items-center h-[45px] justify-center py-3.5"
              >
                <Text className="text-base font-semibold text-white">
                  Save Availability
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      <WorkingHoursModal
        visible={workingHoursOpen}
        onClose={() => setWorkingHoursOpen(false)}
        onSave={handleSaveWorkingHours}
      />
      <BlockDateModal
        visible={blockDateModalOpen}
        onClose={() => setBlockDateModalOpen(false)}
        onSave={handleSaveBlockDate}
      />
      <RecurringScheduleModal
        visible={recurringModalOpen}
        onClose={() => setRecurringModalOpen(false)}
        initial={recurringConfig}
        onSave={handleSaveRecurring}
      />
      <QuickBookingModal
        visible={quickBookingModalOpen}
        onClose={() => setQuickBookingModalOpen(false)}
        initial={quickBookingConfig}
        onSave={handleSaveQuickBooking}
      />
      <VacationModeModal
        visible={vacationModalOpen}
        onClose={() => setVacationModalOpen(false)}
        initial={vacationConfig}
        onSave={handleSaveVacation}
      />
    </LinearGradient>
  );
}

function SummaryCard({
  color,
  value,
  label,
  valueColor,
}: {
  color: string;
  value: string;
  label: string;
  valueColor: string;
}) {
  return (
    <View className={`mb-3 w-[48%] rounded-2xl ${color} px-4 py-4`}>
      <Text className={`text-2xl font-bold ${valueColor}`}>{value}</Text>
      <Text className="mt-1 text-xs text-gray-500">{label}</Text>
    </View>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View className="flex-row items-center">
      <View
        className="mr-1.5 h-2 w-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      <Text className="text-[11px] text-gray-500">{label}</Text>
    </View>
  );
}

function Chip({ label, active }: { label: string; active: boolean }) {
  return (
    <View
      className={`flex-row items-center rounded-full px-3 py-2 ${active ? "bg-emerald-50" : "bg-gray-100"}`}
    >
      <View
        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-gray-400"}`}
      />
      <Text
        className={`text-xs font-medium ${active ? "text-emerald-600" : "text-gray-400"}`}
      >
        {label}
      </Text>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between py-2">
      <Text className="text-[13px] text-gray-500">{label}</Text>
      <Text className="text-[13px] font-semibold text-emerald-500">
        {value}
      </Text>
    </View>
  );
}

function GradientSwitch({
  value,
  onValueChange,
}: {
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onValueChange(!value)}
      className={`h-7 w-12 rounded-full justify-center px-1 ${
        value ? "" : "bg-gray-200"
      }`}
    >
      {value ? (
        <LinearGradient
          colors={[COLORS.baseColor1, COLORS.baseColor2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="absolute inset-0 rounded-full"
          style={{ borderRadius: 999 }}
        />
      ) : null}

      <View
        className={`h-5 w-5 rounded-full bg-white shadow ${
          value ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </TouchableOpacity>
  );
}
