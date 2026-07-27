import AppHeader from "@/components/common/AppHeader";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const TIME_SLOTS: { label: string; times: string[] }[] = [
  { label: "Morning", times: ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM"] },
  {
    label: "Afternoon",
    times: ["12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"],
  },
  { label: "Evening", times: ["5:00 PM", "6:00 PM", "7:00 PM"] },
];

type CalendarCell = { date: Date | null; key: string };

function buildCalendar(year: number, month: number): CalendarCell[] {
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: CalendarCell[] = [];
  for (let i = 0; i < startOffset; i++) {
    cells.push({ date: null, key: `blank-${i}` });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), key: `day-${d}` });
  }
  return cells;
}

function isSameDay(a: Date | null, b: Date | null) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfDay(d: Date) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <Text
    className="text-[11px] font-extrabold tracking-wide"
    style={{ color: "#E0407C" }}
  >
    {children}
  </Text>
);

export default function RescheduleBookingScreen() {
  const params = useLocalSearchParams<{
    bookingId?: string;
    artistName?: string;
    bookingDate?: string;
    bookingTime?: string;
    serviceName?: string;
  }>();

  const today = useMemo(() => startOfDay(new Date()), []);
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const calendarCells = useMemo(
    () => buildCalendar(currentMonth.getFullYear(), currentMonth.getMonth()),
    [currentMonth],
  );

  const canSubmit =
    !!selectedDate && !!selectedTime && reason.trim().length > 0;

  const goToPrevMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  };

  const handleSubmit = () => {
    setShowSuccessModal(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FBF9FC]">
      {/* Header */}

      <AppHeader title="Reschedule Booking" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
      >
        {/* Current booking card */}
        <View
          className="bg-white rounded-[20px] p-4 mt-1"
          style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
        >
          <SectionLabel>CURRENT BOOKING</SectionLabel>

          <View className="flex-row flex-wrap mt-3" style={{ gap: 10 }}>
            <View
              className="rounded-[14px] p-3"
              style={{ backgroundColor: "#FDEEF2", width: "47%" }}
            >
              <View className="flex-row items-center mb-1">
                <Ionicons name="calendar-outline" size={12} color="#FC6C8C" />
                <Text
                  className="text-[10px] font-bold ml-1"
                  style={{ color: "#FC6C8C" }}
                >
                  Date
                </Text>
              </View>
              <Text className="text-sm font-extrabold text-[#161119]">
                {params.bookingDate ?? "Jul 12, 2025"}
              </Text>
            </View>

            <View
              className="rounded-[14px] p-3"
              style={{ backgroundColor: "#FDEEF2", width: "47%" }}
            >
              <View className="flex-row items-center mb-1">
                <Ionicons name="time-outline" size={12} color="#FC6C8C" />
                <Text
                  className="text-[10px] font-bold ml-1"
                  style={{ color: "#FC6C8C" }}
                >
                  Time
                </Text>
              </View>
              <Text className="text-sm font-extrabold text-[#161119]">
                {params.bookingTime ?? "9:00 AM"}
              </Text>
            </View>

            <View
              className="rounded-[14px] p-3"
              style={{ backgroundColor: "#FDEEF2", width: "47%" }}
            >
              <View className="flex-row items-center mb-1">
                <Ionicons name="star-outline" size={12} color="#FC6C8C" />
                <Text
                  className="text-[10px] font-bold ml-1"
                  style={{ color: "#FC6C8C" }}
                >
                  Service
                </Text>
              </View>
              <Text className="text-sm font-extrabold text-[#161119]">
                {params.serviceName ?? "Bridal MUA"}
              </Text>
            </View>

            <View
              className="rounded-[14px] p-3"
              style={{ backgroundColor: "#FDEEF2", width: "47%" }}
            >
              <View className="flex-row items-center mb-1">
                <Ionicons name="person-outline" size={12} color="#FC6C8C" />
                <Text
                  className="text-[10px] font-bold ml-1"
                  style={{ color: "#FC6C8C" }}
                >
                  Client
                </Text>
              </View>
              <Text className="text-sm font-extrabold text-[#161119]">
                {params.artistName ?? "Sophia L."}
              </Text>
            </View>
          </View>
        </View>

        {/* Select new date card */}
        <View
          className="bg-white rounded-[20px] p-4 mt-4"
          style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
        >
          <View className="flex-row items-center justify-between mb-3">
            <SectionLabel>SELECT NEW DATE</SectionLabel>
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={goToPrevMonth}
                className="w-7 h-7 rounded-full items-center justify-center"
                style={{ backgroundColor: "#F5F2F7" }}
              >
                <Ionicons name="chevron-back" size={14} color="#161119" />
              </TouchableOpacity>
              <Text className="text-sm font-extrabold text-[#161119] mx-3">
                {MONTH_NAMES[currentMonth.getMonth()]}{" "}
                {currentMonth.getFullYear()}
              </Text>
              <TouchableOpacity
                onPress={goToNextMonth}
                className="w-7 h-7 rounded-full items-center justify-center"
                style={{ backgroundColor: "#F5F2F7" }}
              >
                <Ionicons name="chevron-forward" size={14} color="#161119" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Weekday header */}
          <View className="flex-row">
            {WEEKDAYS.map((wd) => (
              <View
                key={wd}
                style={{ width: `${100 / 7}%` }}
                className="items-center"
              >
                <Text className="text-[11px] font-bold text-[#B0AAB6]">
                  {wd}
                </Text>
              </View>
            ))}
          </View>

          {/* Day grid */}
          <View className="flex-row flex-wrap mt-2">
            {calendarCells.map((cell) => {
              if (!cell.date) {
                return (
                  <View
                    key={cell.key}
                    style={{ width: `${100 / 7}%`, aspectRatio: 1 }}
                  />
                );
              }

              const isPast = cell.date.getTime() < today.getTime();
              const isToday = isSameDay(cell.date, today);
              const isSelected = isSameDay(cell.date, selectedDate);

              return (
                <TouchableOpacity
                  key={cell.key}
                  disabled={isPast}
                  onPress={() => setSelectedDate(cell.date)}
                  style={{
                    width: `${100 / 7}%`,
                    aspectRatio: 1,
                    borderRadius: 999,
                  }}
                  className="items-center justify-center"
                >
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: isSelected
                        ? COLORS.blueColor
                        : isToday
                          ? COLORS.blueColor2
                          : "transparent",
                    }}
                  >
                    <Text
                      className="text-sm"
                      style={{
                        fontWeight: isSelected || isToday ? "800" : "500",
                        color: isSelected
                          ? "#fff"
                          : isPast
                            ? "#D9D3E0"
                            : isToday
                              ? COLORS.blueColor
                              : "#161119",
                      }}
                    >
                      {cell.date.getDate()}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Select new time card */}
        <View
          className="bg-white rounded-[20px] p-4 mt-4"
          style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
        >
          <SectionLabel>SELECT NEW TIME</SectionLabel>

          {TIME_SLOTS.map((group) => (
            <View key={group.label} className="mt-3">
              <Text className="text-xs font-bold text-[#B0AAB6] mb-2">
                {group.label}
              </Text>
              <View className="flex-row flex-wrap" style={{ gap: 8 }}>
                {group.times.map((t) => {
                  const isSelected = selectedTime === t;
                  return (
                    <TouchableOpacity
                      key={t}
                      activeOpacity={0.85}
                      onPress={() => setSelectedTime(t)}
                      style={{ borderRadius: 100, overflow: "hidden" }}
                    >
                      {isSelected ? (
                        <LinearGradient
                          colors={[COLORS.baseColor1, COLORS.baseColor2]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={{ paddingVertical: 9, paddingHorizontal: 16 }}
                        >
                          <Text className="text-xs font-bold text-white">
                            {t}
                          </Text>
                        </LinearGradient>
                      ) : (
                        <View
                          style={{
                            paddingVertical: 9,
                            paddingHorizontal: 16,
                            backgroundColor: "#F5F2F7",
                          }}
                        >
                          <Text className="text-xs font-bold text-[#161119]">
                            {t}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        {/* Reason for reschedule card */}
        <View
          className="bg-white rounded-[20px] p-4 mt-4"
          style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
        >
          <SectionLabel>REASON FOR RESCHEDULE</SectionLabel>
          <TextInput
            value={reason}
            onChangeText={setReason}
            placeholder="e.g. Schedule conflict"
            placeholderTextColor="#B0AAB6"
            className="text-sm text-[#161119] mt-3"
            style={{
              backgroundColor: "#F5F2F7",
              borderRadius: 14,
              paddingVertical: 12,
              paddingHorizontal: 14,
            }}
          />
        </View>

        {/* Message to artist card */}
        <View
          className="bg-white rounded-[20px] p-4 mt-4"
          style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
        >
          <SectionLabel>MESSAGE TO ARTIST</SectionLabel>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Explain why you're requesting a new schedule..."
            placeholderTextColor="#B0AAB6"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="text-sm text-[#161119] mt-3"
            style={{
              backgroundColor: "#F5F2F7",
              borderRadius: 14,
              paddingVertical: 12,
              paddingHorizontal: 14,
              minHeight: 100,
            }}
          />
        </View>

        {/* Helper text */}
        <Text className="text-xs text-[#B0AAB6] text-center mt-5">
          {canSubmit
            ? "You're all set — send when ready."
            : "Select a date, time, and reason to continue"}
        </Text>

        {/* Submit button */}
        <TouchableOpacity
          activeOpacity={canSubmit ? 0.85 : 1}
          onPress={handleSubmit}
          //disabled={!canSubmit}
          className="rounded-full overflow-hidden mt-3"
        >
          <LinearGradient
            colors={[COLORS.baseColor1, COLORS.baseColor2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="py-4 items-center rounded-full"
            // style={{ opacity: canSubmit ? 1 : 0.45 }}
          >
            <Text className="text-white text-base font-extrabold">
              Send Reschedule Request
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/40 px-5">
          <View className="w-full rounded-[32px] bg-white px-6 pb-8 pt-8">
            {/* Icon */}
            <View className="items-center mb-5">
              <LinearGradient
                colors={[COLORS.baseColor1, COLORS.baseColor2]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: COLORS.baseColor1,
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  shadowOffset: {
                    width: 0,
                    height: 6,
                  },
                  elevation: 4,
                }}
              >
                <Ionicons name="calendar" size={30} color="#fff" />
              </LinearGradient>
            </View>

            <Text className="text-xl font-extrabold text-[#161119] text-center">
              Reschedule Request Sent
            </Text>

            <Text className="mt-2 px-4 text-center text-sm leading-5 text-[#8A8590]">
              Client will receive a notification and can approve or suggest
              another time.
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                setShowSuccessModal(false);
                router.replace({
                  pathname: "/(artist)/(tabs)/bookings",
                  params: {
                    filter: "Pending",
                  },
                });
              }}
              className="mt-7 overflow-hidden rounded-full"
            >
              <LinearGradient
                colors={[COLORS.baseColor1, COLORS.baseColor2]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="items-center rounded-full py-4"
              >
                <Text className="text-base font-extrabold text-white">
                  View Pending Requests
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                setShowSuccessModal(false);
                router.replace("/(artist)/(tabs)/availability");
              }}
              className="mt-3 items-center rounded-full py-4"
              style={{
                backgroundColor: "#F5F2F7",
              }}
            >
              <Text className="text-base font-bold text-[#161119]">
                Back to Dashboard
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
