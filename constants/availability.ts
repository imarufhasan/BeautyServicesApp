import { BlockDateInput } from "@/components/(artist)/BlockDateModal";
import { QuickBookingConfig } from "@/components/(artist)/QuickBookingModal";
import { RecurringScheduleConfig } from "@/components/(artist)/RecurringScheduleModal";
import { VacationConfig } from "@/components/(artist)/VacationModeModal";
import { DayOfWeek } from "@/constants/types";

/**
 * Everything below used to be copy-pasted between AvailabilityScreen.tsx
 * and AvailabilitySetupScreen.tsx. Pulled out here so there's exactly one
 * place to update dummy data / labels / mock shapes as the real API lands.
 */

// ---------- Calendar ----------
export type CalendarDayStatus =
  "available" | "booked" | "blocked" | "vacation" | "today" | "none";

export const STATUS_DOT_COLOR: Record<CalendarDayStatus, string> = {
  available: "#34D399",
  booked: "#FB7185",
  blocked: "#9CA3AF",
  vacation: "#F59E0B",
  today: "#FB7185",
  none: "transparent",
};

export const WEEK_HEADER = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export interface CalendarDay {
  day: number;
  status: CalendarDayStatus;
}

// July 2026 starts on a Wednesday -> 2 leading blank cells for a Mon-first grid.
export const LEADING_BLANK_CELLS = 2;

export const calendarDaysDummy: CalendarDay[] = [
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

// ---------- Weekly schedule ----------
export interface DaySchedule {
  day: DayOfWeek;
  isActive: boolean;
  startTime: string | null;
  endTime: string | null;
}

// Shaped so it drops straight into useGetAvailabilityQuery() later.
export const weeklyScheduleDummy: DaySchedule[] = [
  { day: "Monday", isActive: true, startTime: "9:00 AM", endTime: "6:00 PM" },
  { day: "Tuesday", isActive: true, startTime: "9:00 AM", endTime: "6:00 PM" },
  {
    day: "Wednesday",
    isActive: true,
    startTime: "10:00 AM",
    endTime: "5:00 PM",
  },
  { day: "Thursday", isActive: true, startTime: "9:00 AM", endTime: "6:00 PM" },
  { day: "Friday", isActive: true, startTime: "9:00 AM", endTime: "4:00 PM" },
  {
    day: "Saturday",
    isActive: true,
    startTime: "10:00 AM",
    endTime: "3:00 PM",
  },
  { day: "Sunday", isActive: false, startTime: null, endTime: null },
];

// ---------- Blocked dates ----------
export interface BlockedDate {
  id: string;
  label: string;
  reason: string;
}

export const initialBlockedDates: BlockedDate[] = [
  { id: "bd_1", label: "Fri, Jul 10", reason: "Personal Work · Client sch" },
  { id: "bd_2", label: "Sat, Jul 11", reason: "Holiday" },
];

export const REASON_LABELS: Record<BlockDateInput["reason"], string> = {
  Holiday: "Holiday",
  "Personal Work": "Personal Work",
  "Medical Leave": "Medical Leave",
  "Private Event": "Private Event",
  Other: "Other",
};

// ---------- Recurring / Quick booking / Vacation ----------
export const initialRecurringConfig: RecurringScheduleConfig = {
  mode: "Weekly",
  pattern: "weekdaysOnly",
  repeatUntil: "",
};

export const initialQuickBookingConfig: QuickBookingConfig = {
  enabled: true,
  minimumNoticeHours: 2,
  bookingBufferMinutes: 30,
  maxPerDay: 8,
};

export const initialVacationConfig: VacationConfig = {
  enabled: false,
  startDate: "",
  endDate: "",
  message: "",
};

// ---------- Today card dummy ----------
export const todayStatusDummy = {
  dateLabel: "Thursday, July 2",
  timeRangeLabel: "9:00 AM – 6:00 PM",
  nextLabel: "Next: 2:00 PM",
};
