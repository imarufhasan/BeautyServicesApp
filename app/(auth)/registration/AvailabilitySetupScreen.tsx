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
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AvailabilitySetupScreen() {
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
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header — this is the only real difference from AvailabilityScreen */}
          <View className="flex-row items-center mt-4 mb-2">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-white items-center justify-center mr-3"
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.06,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 2 },
                elevation: 1,
              }}
            >
              <Ionicons name="arrow-back" size={18} color="#161119" />
            </TouchableOpacity>
            <Text className="flex-1 text-center text-[19px] font-extrabold text-[#161119] mr-10">
              Availability
            </Text>
          </View>
          <Text className="text-center text-[13px] text-[#8A8590] mb-5">
            Manage your working hours and let clients know{"\n"}when you&apos;re
            available.
          </Text>

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
