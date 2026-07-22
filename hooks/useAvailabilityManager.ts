import { BlockDateInput } from "@/components/(artist)/BlockDateModal";
import { QuickBookingConfig } from "@/components/(artist)/QuickBookingModal";
import { RecurringScheduleConfig } from "@/components/(artist)/RecurringScheduleModal";
import { VacationConfig } from "@/components/(artist)/VacationModeModal";
import { WorkingHoursDay } from "@/components/(artist)/WorkingHoursModal";
import {
    BlockedDate,
    DaySchedule,
    REASON_LABELS,
    initialBlockedDates,
    initialQuickBookingConfig,
    initialRecurringConfig,
    initialVacationConfig,
    weeklyScheduleDummy,
} from "@/constants/availability";
import { DayOfWeek } from "@/constants/types";
import { router } from "expo-router";
import { useState } from "react";

/**
 * All state + handlers for the Availability flow live here so
 * AvailabilityScreen and AvailabilitySetupScreen (which only differ in
 * header/layout) share one implementation instead of two copies that can
 * silently drift apart.
 */
export function useAvailabilityManager(
  schedule: DaySchedule[] = weeklyScheduleDummy,
) {
  // ---- Today / weekly schedule ----
  const [isAvailableToday, setIsAvailableToday] = useState(true);
  const [editingDay, setEditingDay] = useState<DayOfWeek | null>("Monday");
  const [monEveningSession, setMonEveningSession] = useState(false);
  const [workingHoursOpen, setWorkingHoursOpen] = useState(false);
  const [scheduleToggles, setScheduleToggles] = useState<
    Record<DayOfWeek, boolean>
  >(
    schedule.reduce(
      (acc, d) => ({ ...acc, [d.day]: d.isActive }),
      {} as Record<DayOfWeek, boolean>,
    ),
  );

  const toggleDay = (day: DayOfWeek) =>
    setScheduleToggles((prev) => ({ ...prev, [day]: !prev[day] }));

  const handleSaveWorkingHours = (_days: WorkingHoursDay[]) => {
    // TODO: send `_days` to the API, then update weeklyScheduleDummy/local state.
    setWorkingHoursOpen(false);
  };

  // ---- Blocked dates ----
  const [blockedDates, setBlockedDates] =
    useState<BlockedDate[]>(initialBlockedDates);
  const [blockDateModalOpen, setBlockDateModalOpen] = useState(false);

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

  // ---- Recurring schedule ----
  const [recurringConfig, setRecurringConfig] =
    useState<RecurringScheduleConfig>(initialRecurringConfig);
  const [recurringModalOpen, setRecurringModalOpen] = useState(false);

  const handleSaveRecurring = (config: RecurringScheduleConfig) => {
    setRecurringConfig(config);
    setRecurringModalOpen(false);
  };

  // ---- Quick booking ----
  const [quickBookingConfig, setQuickBookingConfig] =
    useState<QuickBookingConfig>(initialQuickBookingConfig);
  const [quickBookingModalOpen, setQuickBookingModalOpen] = useState(false);

  const handleSaveQuickBooking = (config: QuickBookingConfig) => {
    setQuickBookingConfig(config);
    setQuickBookingModalOpen(false);
  };

  // ---- Vacation mode ----
  const [vacationConfig, setVacationConfig] = useState<VacationConfig>(
    initialVacationConfig,
  );
  const [vacationModalOpen, setVacationModalOpen] = useState(false);

  const handleSaveVacation = (config: VacationConfig) => {
    setVacationConfig(config);
    setVacationModalOpen(false);
  };

  // ---- Save all ----
  const handleSaveAvailability = () => {
    // TODO: PATCH/PUT all availability state (weeklySchedule, blockedDates,
    // recurringConfig, quickBookingConfig, vacationConfig) to the API here.
    router.replace("/(artist)/(tabs)/profile");
  };

  return {
    // today / weekly schedule
    isAvailableToday,
    setIsAvailableToday,
    editingDay,
    setEditingDay,
    monEveningSession,
    setMonEveningSession,
    workingHoursOpen,
    setWorkingHoursOpen,
    scheduleToggles,
    toggleDay,
    handleSaveWorkingHours,

    // blocked dates
    blockedDates,
    blockDateModalOpen,
    setBlockDateModalOpen,
    handleSaveBlockDate,
    removeBlockedDate,

    // recurring
    recurringConfig,
    recurringModalOpen,
    setRecurringModalOpen,
    handleSaveRecurring,

    // quick booking
    quickBookingConfig,
    setQuickBookingConfig,
    quickBookingModalOpen,
    setQuickBookingModalOpen,
    handleSaveQuickBooking,

    // vacation
    vacationConfig,
    setVacationConfig,
    vacationModalOpen,
    setVacationModalOpen,
    handleSaveVacation,

    // save
    handleSaveAvailability,
  };
}

export type AvailabilityManager = ReturnType<typeof useAvailabilityManager>;
