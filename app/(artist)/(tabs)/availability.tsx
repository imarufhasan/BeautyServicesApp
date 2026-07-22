import {
  AvailabilityCalendarCard,
  AvailabilityFooterActions,
  BlockedDatesCard,
  QuickBookingCard,
  RecurringScheduleCard,
  TodayStatusCard,
  VacationModeCard,
  WeeklyScheduleCard,
} from "@/components/(artist)";
import BlockDateModal from "@/components/(artist)/BlockDateModal";
import QuickBookingModal from "@/components/(artist)/QuickBookingModal";
import RecurringScheduleModal from "@/components/(artist)/RecurringScheduleModal";
import VacationModeModal from "@/components/(artist)/VacationModeModal";
import WorkingHoursModal from "@/components/(artist)/WorkingHoursModal";
import {
  calendarDaysDummy,
  weeklyScheduleDummy,
} from "@/constants/availability";
import { useAvailabilityManager } from "@/hooks/useAvailabilityManager";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AvailabilityScreen() {
  const a = useAvailabilityManager(weeklyScheduleDummy);

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

          <TodayStatusCard
            isAvailableToday={a.isAvailableToday}
            onToggle={a.setIsAvailableToday}
          />

          <WeeklyScheduleCard
            schedule={weeklyScheduleDummy}
            scheduleToggles={a.scheduleToggles}
            toggleDay={a.toggleDay}
            editingDay={a.editingDay}
            onEditDay={a.setEditingDay}
            monEveningSession={a.monEveningSession}
            onToggleEveningSession={a.setMonEveningSession}
            onEditAll={() => a.setWorkingHoursOpen(true)}
          />

          <AvailabilityCalendarCard
            monthLabel="July 2026"
            days={calendarDaysDummy}
          />

          <BlockedDatesCard
            blockedDates={a.blockedDates}
            onAdd={() => a.setBlockDateModalOpen(true)}
            onRemove={a.removeBlockedDate}
          />

          <VacationModeCard
            vacationConfig={a.vacationConfig}
            onToggleEnabled={(v) =>
              a.setVacationConfig((prev) => ({ ...prev, enabled: v }))
            }
            onOpenModal={() => a.setVacationModalOpen(true)}
          />

          <RecurringScheduleCard
            recurringConfig={a.recurringConfig}
            onOpenModal={() => a.setRecurringModalOpen(true)}
          />

          <QuickBookingCard
            quickBookingConfig={a.quickBookingConfig}
            onToggleEnabled={(v) =>
              a.setQuickBookingConfig((prev) => ({ ...prev, enabled: v }))
            }
            onOpenModal={() => a.setQuickBookingModalOpen(true)}
          />

          <AvailabilityFooterActions onSave={a.handleSaveAvailability} />
        </ScrollView>
      </SafeAreaView>

      <WorkingHoursModal
        visible={a.workingHoursOpen}
        onClose={() => a.setWorkingHoursOpen(false)}
        onSave={a.handleSaveWorkingHours}
      />
      <BlockDateModal
        visible={a.blockDateModalOpen}
        onClose={() => a.setBlockDateModalOpen(false)}
        onSave={a.handleSaveBlockDate}
      />
      <RecurringScheduleModal
        visible={a.recurringModalOpen}
        onClose={() => a.setRecurringModalOpen(false)}
        initial={a.recurringConfig}
        onSave={a.handleSaveRecurring}
      />
      <QuickBookingModal
        visible={a.quickBookingModalOpen}
        onClose={() => a.setQuickBookingModalOpen(false)}
        initial={a.quickBookingConfig}
        onSave={a.handleSaveQuickBooking}
      />
      <VacationModeModal
        visible={a.vacationModalOpen}
        onClose={() => a.setVacationModalOpen(false)}
        initial={a.vacationConfig}
        onSave={a.handleSaveVacation}
      />
    </LinearGradient>
  );
}
