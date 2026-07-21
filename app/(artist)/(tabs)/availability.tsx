import AppTabBar from "@/components/common/AppTabBar";
import { COLORS } from "@/constants/colors";
import { availabilityDummyResponse } from "@/constants/dummyData";
import { CalendarDayStatus, DayOfWeek } from "@/constants/types";
import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ScrollView,
  Switch,
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

  // Simple padding so July 1 lands on the right weekday column (2026-07-01 = Wednesday)
  const leadingBlankCells = 2;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView
        className="flex-1 bg-rose-50/30"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
          <View>
            <Text className="text-3xl font-bold text-gray-900">
              Availability
            </Text>
            <Text className="mt-1 text-[13px] text-gray-500">
              Manage your working hours and let clients know{"\n"}when
              you&apos;re available.
            </Text>
          </View>
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
            <Feather name="bell" size={18} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Today status gradient card */}
        <View className="mx-5 mt-3 overflow-hidden rounded-3xl">
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
                <View className="mr-1.5 h-1.5 w-1.5 rounded-full bg-white" />
                <Text className="text-xs font-medium text-white">
                  Available Today
                </Text>
              </View>
            </View>
            <Text className="mt-1 text-xl font-bold text-white">
              {availability.todayStatus.date}
            </Text>

            <View className="mt-3 flex-row items-center">
              <Feather name="clock" size={13} color="#fff" />
              <Text className="ml-1.5 text-[13px] text-white/90">
                {availability.todayStatus.workingHours}
              </Text>
              <Text className="mx-2 text-white/60">·</Text>
              <Feather name="calendar" size={13} color="#fff" />
              <Text className="ml-1.5 text-[13px] text-white/90">
                Next: {availability.todayStatus.nextBooking}
              </Text>
            </View>

            <View className="mt-4 flex-row items-center justify-between rounded-2xl bg-white/15 px-4 py-3">
              <Text className="text-sm font-medium text-white">
                Available Today
              </Text>
              <Switch
                value={isAvailableToday}
                onValueChange={setIsAvailableToday}
                trackColor={{ true: "#ffffff80", false: "#ffffff40" }}
                thumbColor="#ffffff"
              />
            </View>
          </LinearGradient>
        </View>

        {/* Booking summary grid */}
        <View className="mx-5 mt-4 flex-row flex-wrap justify-between">
          <SummaryCard
            color="bg-rose-50"
            value={String(availability.bookingSummary.todaysBookings)}
            label="Today's Bookings"
            valueColor="text-rose-500"
          />
          <SummaryCard
            color="bg-emerald-50"
            value={`${availability.bookingSummary.availableHours}h`}
            label="Available Hours"
            valueColor="text-emerald-500"
          />
          <SummaryCard
            color="bg-amber-50"
            value={String(availability.bookingSummary.blockedDates)}
            label="Blocked Dates"
            valueColor="text-amber-500"
          />
          <SummaryCard
            color="bg-violet-50"
            value={
              availability.bookingSummary.vacationDays
                ? String(availability.bookingSummary.vacationDays)
                : "—"
            }
            label="Vacation Days"
            valueColor="text-violet-500"
          />
        </View>

        {/* Weekly schedule */}
        <View className="mx-5 mt-6 rounded-3xl bg-white p-4 shadow-sm">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-base font-bold text-gray-900">
                Weekly Schedule
              </Text>
              <Text className="text-xs text-gray-400">
                Tap any day to edit hours
              </Text>
            </View>
            <TouchableOpacity className="rounded-full bg-rose-50 px-3 py-1.5">
              <Text className="text-xs font-semibold text-rose-500">
                ✎ Edit All
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-3">
            {availability.weeklySchedule.map((d) => {
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
                      <Switch
                        value={isOn}
                        onValueChange={() => toggleDay(d.day)}
                        trackColor={{ true: "#FB7185", false: "#E5E7EB" }}
                        thumbColor="#fff"
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
                        MORNING SESSION
                      </Text>
                      <View className="flex-row" style={{ gap: 10 }}>
                        <View className="flex-1">
                          <Text className="mb-1 text-[10px] text-gray-400">
                            START TIME
                          </Text>
                          <TextInput
                            placeholder={d.startTime ?? "09:00 AM"}
                            className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700"
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="mb-1 text-[10px] text-gray-400">
                            END TIME
                          </Text>
                          <TextInput
                            placeholder={d.endTime ?? "06:00 PM"}
                            className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700"
                          />
                        </View>
                      </View>

                      <Text className="mb-1 mt-4 text-[10px] font-semibold tracking-wider text-gray-400">
                        BREAK TIME
                      </Text>
                      <View className="flex-row" style={{ gap: 10 }}>
                        <View className="flex-1">
                          <Text className="mb-1 text-[10px] text-gray-400">
                            FROM
                          </Text>
                          <TextInput
                            placeholder={d.breakFrom ?? "--:--"}
                            className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700"
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="mb-1 text-[10px] text-gray-400">
                            TO
                          </Text>
                          <TextInput
                            placeholder={d.breakTo ?? "--:--"}
                            className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700"
                          />
                        </View>
                      </View>

                      <View className="mt-4 flex-row items-center justify-between">
                        <Text className="text-[13px] text-gray-500">
                          Evening Session
                        </Text>
                        <Switch
                          value={d.hasEveningSession}
                          trackColor={{ true: "#FB7185", false: "#E5E7EB" }}
                          thumbColor="#fff"
                        />
                      </View>

                      <View className="mt-4 flex-row" style={{ gap: 10 }}>
                        <TouchableOpacity
                          className="flex-1 flex-row items-center justify-center rounded-full py-2.5"
                          style={{ backgroundColor: "#FB7185" }}
                        >
                          <Feather name="check" size={14} color="#fff" />
                          <Text className="ml-1.5 text-sm font-semibold text-white">
                            Save
                          </Text>
                        </TouchableOpacity>
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
        <View className="mx-5 mt-6 rounded-3xl bg-white p-4 shadow-sm">
          <View className="flex-row items-center justify-between px-1">
            <TouchableOpacity className="h-8 w-8 items-center justify-center rounded-full bg-gray-50">
              <Feather name="chevron-left" size={16} color="#6B7280" />
            </TouchableOpacity>
            <Text className="text-base font-bold text-gray-900">
              {availability.calendar.month}
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
            {availability.calendar.days.map((d) => (
              <View
                key={d.date}
                style={{ width: "14.28%" }}
                className="items-center py-2"
              >
                <View
                  className={`h-8 w-8 items-center justify-center rounded-full ${
                    d.status === "today" ? "bg-rose-100" : ""
                  }`}
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
        <View className="mx-5 mt-6 rounded-3xl bg-white p-4 shadow-sm">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-base font-bold text-gray-900">
                Blocked Dates
              </Text>
              <Text className="text-xs text-gray-400">
                {availability.blockedDates.length} dates blocked
              </Text>
            </View>
            <TouchableOpacity className="flex-row items-center rounded-full bg-rose-50 px-3 py-1.5">
              <Feather name="plus" size={12} color="#FB7185" />
              <Text className="ml-1 text-xs font-semibold text-rose-500">
                Add Date
              </Text>
            </TouchableOpacity>
          </View>

          {availability.blockedDates.map((bd) => (
            <View
              key={bd.id}
              className="mt-3 flex-row items-center justify-between rounded-2xl bg-rose-50/60 px-4 py-3"
            >
              <View className="flex-row items-center">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-rose-100">
                  <Ionicons name="ban-outline" size={14} color="#FB7185" />
                </View>
                <View className="ml-3">
                  <Text className="text-sm font-semibold text-gray-800">
                    {bd.label}
                  </Text>
                  <Text className="text-xs text-gray-400">{bd.reason}</Text>
                </View>
              </View>
              <View className="flex-row" style={{ gap: 14 }}>
                <Feather name="edit-2" size={15} color="#FB923C" />
                <Feather name="trash-2" size={15} color="#FB7185" />
              </View>
            </View>
          ))}
        </View>

        {/* Vacation mode */}
        <View className="mx-5 mt-6 rounded-3xl bg-white p-4 shadow-sm">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-base font-bold text-gray-900">
                Vacation Mode
              </Text>
              <Text className="text-xs text-gray-400">
                Hide profile from new bookings
              </Text>
            </View>
            <Switch
              value={vacationEnabled}
              onValueChange={setVacationEnabled}
              trackColor={{ true: "#FB7185", false: "#E5E7EB" }}
              thumbColor="#fff"
            />
          </View>
          <View className="mt-4 items-center py-4">
            <Text style={{ fontSize: 28 }}>☂️</Text>
            <Text className="mt-2 text-[13px] text-gray-400">
              Vacation mode is currently disabled.
            </Text>
            <TouchableOpacity className="mt-1">
              <Text className="text-sm font-semibold text-orange-400">
                Set Vacation Dates
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recurring schedule */}
        <View className="mx-5 mt-6 rounded-3xl bg-white p-4 shadow-sm">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-base font-bold text-gray-900">
                Recurring Schedule
              </Text>
              <Text className="text-xs text-gray-400">
                Repeat availability patterns
              </Text>
            </View>
            <TouchableOpacity className="flex-row items-center rounded-full bg-emerald-50 px-3 py-1.5">
              <Feather name="repeat" size={12} color="#10B981" />
              <Text className="ml-1 text-xs font-semibold text-emerald-500">
                Configure
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-3 flex-row flex-wrap" style={{ gap: 10 }}>
            <Chip
              label="Weekly Repeat"
              active={availability.recurringSchedule.weeklyRepeat}
            />
            <Chip
              label="Monthly Repeat"
              active={availability.recurringSchedule.monthlyRepeat}
            />
            <Chip
              label="Weekdays Only"
              active={availability.recurringSchedule.weekdaysOnly}
            />
            <Chip
              label="Custom Days"
              active={availability.recurringSchedule.customDays}
            />
          </View>
        </View>

        {/* Instant booking */}
        <View className="mx-5 mt-6 rounded-3xl bg-white p-4 shadow-sm">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-base font-bold text-gray-900">
                Instant Booking
              </Text>
              <Text className="text-xs text-gray-400">
                Auto-confirm client bookings
              </Text>
            </View>
            <Switch
              value={instantBookingEnabled}
              onValueChange={setInstantBookingEnabled}
              trackColor={{ true: "#FB7185", false: "#E5E7EB" }}
              thumbColor="#fff"
            />
          </View>

          <View className="mt-3 rounded-2xl bg-emerald-50 px-4 py-3">
            <Text className="text-[13px] text-emerald-700">
              Clients can instantly confirm bookings without manual approval
              from you.
            </Text>
          </View>

          <View className="mt-3">
            <InfoRow
              label="Minimum Notice"
              value={`${availability.instantBooking.minimumNoticeHours}h`}
            />
            <InfoRow
              label="Booking Buffer"
              value={`${availability.instantBooking.bookingBufferMinutes} min`}
            />
            <InfoRow
              label="Max / Day"
              value={`${availability.instantBooking.maxPerDay} bookings`}
            />
          </View>

          <TouchableOpacity className="mt-2 items-center">
            <Text className="text-sm font-semibold text-rose-400">
              ✎ Edit Settings
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom buttons */}
        <View className="mx-5 mt-6 flex-row" style={{ gap: 12 }}>
          <TouchableOpacity className="flex-1 items-center justify-center rounded-full border border-rose-200 py-3.5">
            <Text className="text-sm font-semibold text-rose-400">
              Reset Changes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 overflow-hidden rounded-full">
            <LinearGradient
              colors={[COLORS.baseColor1, COLORS.baseColor2]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="items-center justify-center py-3.5"
            >
              <Text className="text-sm font-semibold text-white">
                Save Availability
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <AppTabBar active="Availability" />
    </SafeAreaView>
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
