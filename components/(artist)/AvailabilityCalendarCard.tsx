import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { LegendDot } from "./SharedControls";

type DayStatus =
  "available" | "booked" | "blocked" | "vacation" | "today" | "none";

interface CalendarDay {
  day: number;
  status: DayStatus;
}

interface Props {
  onSelectDate?: (date: Date) => void;
}

const WEEK_HEADER = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const STATUS_DOT_COLOR = {
  available: "#34D399",
  booked: "#FB7185",
  blocked: "#9CA3AF",
  vacation: "#F59E0B",
  today: "#FB7185",
};

const generateMonthData = (date: Date): CalendarDay[] => {
  const year = date.getFullYear();
  const month = date.getMonth();

  const totalDays = new Date(year, month + 1, 0).getDate();

  const today = new Date();

  const bookedDays = [3, 7, 12, 18, 24];
  const blockedDays = [5, 15, 22];
  const vacationDays = [10, 11, 20];

  return Array.from({ length: totalDays }).map((_, index) => {
    const day = index + 1;

    let status: DayStatus = "available";

    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      status = "today";
    } else if (bookedDays.includes(day)) {
      status = "booked";
    } else if (blockedDays.includes(day)) {
      status = "blocked";
    } else if (vacationDays.includes(day)) {
      status = "vacation";
    }

    return {
      day,
      status,
    };
  });
};

export default function AvailabilityCalendarCard({ onSelectDate }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthLabel = useMemo(() => {
    return currentDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }, [currentDate]);

  const days = useMemo(() => {
    return generateMonthData(currentDate);
  }, [currentDate]);

  const leadingBlankCells = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  ).getDay();

  const changeMonth = (value: number) => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      next.setMonth(prev.getMonth() + value);
      return next;
    });
  };

  return (
    <View
      className="rounded-3xl bg-white p-4 shadow-sm mb-5"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        elevation: 2,
      }}
    >
      {/* Header */}

      <View className="flex-row items-center justify-between px-1">
        <TouchableOpacity
          onPress={() => changeMonth(-1)}
          className="h-8 w-8 items-center justify-center rounded-full bg-gray-50"
        >
          <Feather name="chevron-left" size={16} color="#6B7280" />
        </TouchableOpacity>

        <Text className="text-base font-bold text-gray-900">{monthLabel}</Text>

        <TouchableOpacity
          onPress={() => changeMonth(1)}
          className="h-8 w-8 items-center justify-center rounded-full bg-gray-50"
        >
          <Feather name="chevron-right" size={16} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Week */}

      <View className="mt-3 flex-row justify-between">
        {WEEK_HEADER.map((day) => (
          <Text
            key={day}
            className="w-9 text-center text-[11px] font-medium text-gray-400"
          >
            {day}
          </Text>
        ))}
      </View>

      {/* Calendar */}

      <View className="mt-1 flex-row flex-wrap">
        {Array.from({
          length: leadingBlankCells,
        }).map((_, i) => (
          <View
            key={`blank-${i}`}
            style={{
              width: "14.28%",
            }}
            className="items-center py-2"
          />
        ))}

        {days.map((item) => (
          <TouchableOpacity
            key={item.day}
            activeOpacity={0.7}
            onPress={() => {
              const selected = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                item.day,
              );

              onSelectDate?.(selected);
            }}
            style={{
              width: "14.28%",
            }}
            className="items-center py-2"
          >
            <View
              className={`
    h-8 w-8 items-center justify-center rounded-full
    ${item.status === "today" ? "border-2 border-rose-400" : ""}
  `}
            >
              <Text
                className={`
      text-[13px]
      ${item.status === "today" ? "font-bold text-rose-500" : "text-gray-700"}
    `}
              >
                {item.day}
              </Text>
            </View>

            {item.status !== "none" && item.status !== "today" && (
              <View
                className="mt-0.5 h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor: STATUS_DOT_COLOR[item.status],
                }}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Legend */}
      <View className="w-full bg-gray-100 h-[1px] mx-4 mt-2" />
      <View
        className="mt-2 mx-4  flex-row flex-wrap items-center"
        style={{
          gap: 14,
        }}
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
