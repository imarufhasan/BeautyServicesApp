import {
    CalendarDay,
    LEADING_BLANK_CELLS,
    STATUS_DOT_COLOR,
    WEEK_HEADER,
} from "@/constants/availability";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { LegendDot } from "./SharedControls";

interface AvailabilityCalendarCardProps {
  monthLabel: string;
  days: CalendarDay[];
  leadingBlankCells?: number;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
}

export default function AvailabilityCalendarCard({
  monthLabel,
  days,
  leadingBlankCells = LEADING_BLANK_CELLS,
  onPrevMonth,
  onNextMonth,
}: AvailabilityCalendarCardProps) {
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
      <View className="flex-row items-center justify-between px-1">
        <TouchableOpacity
          onPress={onPrevMonth}
          className="h-8 w-8 items-center justify-center rounded-full bg-gray-50"
        >
          <Feather name="chevron-left" size={16} color="#6B7280" />
        </TouchableOpacity>
        <Text className="text-base font-bold text-gray-900">{monthLabel}</Text>
        <TouchableOpacity
          onPress={onNextMonth}
          className="h-8 w-8 items-center justify-center rounded-full bg-gray-50"
        >
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
        {days.map((d) => (
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
  );
}
