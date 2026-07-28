import { BlockDateInput } from "@/components/(artist)/BlockDateModal";
import { QuickBookingConfig } from "@/components/(artist)/QuickBookingModal";
import { RecurringScheduleConfig } from "@/components/(artist)/RecurringScheduleModal";
import { VacationConfig } from "@/components/(artist)/VacationCard";
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

export function useAvailabilityManager(
  schedule: DaySchedule[] = weeklyScheduleDummy,
) {
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
    setWorkingHoursOpen(false);
  };

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

  const updateBlockedDate = (id: string, data: Partial<BlockedDate>) => {
    setBlockedDates((prev) =>
      prev.map((bd) =>
        bd.id === id
          ? {
              ...bd,
              ...data,
            }
          : bd,
      ),
    );
  };

  const removeBlockedDate = (id: string) =>
    setBlockedDates((prev) => prev.filter((bd) => bd.id !== id));

  const [recurringConfig, setRecurringConfig] =
    useState<RecurringScheduleConfig>(initialRecurringConfig);
  const [recurringModalOpen, setRecurringModalOpen] = useState(false);

  const handleSaveRecurring = (config: RecurringScheduleConfig) => {
    setRecurringConfig(config);
    setRecurringModalOpen(false);
  };

  const [quickBookingConfig, setQuickBookingConfig] =
    useState<QuickBookingConfig>(initialQuickBookingConfig);
  const [quickBookingModalOpen, setQuickBookingModalOpen] = useState(false);

  const handleSaveQuickBooking = (config: QuickBookingConfig) => {
    setQuickBookingConfig(config);
    setQuickBookingModalOpen(false);
  };

  const [vacationConfig, setVacationConfig] = useState<VacationConfig>(
    initialVacationConfig,
  );
  const [vacationModalOpen, setVacationModalOpen] = useState(false);

  const handleSaveVacation = (config: VacationConfig) => {
    setVacationConfig(config);
    setVacationModalOpen(false);
  };

  const handleSaveAvailability = () => {
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
    updateBlockedDate,

    // recurring
    recurringConfig,
    recurringModalOpen,
    setRecurringModalOpen,
    setRecurringConfig,
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
