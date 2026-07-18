import AppHeader from "@/components/common/AppHeader";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import Toggle from "@/components/common/Toggle";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type NotificationKey =
  "bookingUpdates" | "bookingRequests" | "promotional" | "reviews";

const NOTIFICATION_ROWS: {
  key: NotificationKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    key: "bookingUpdates",
    label: "Booking Updates",
    icon: "briefcase-outline",
  },
  {
    key: "bookingRequests",
    label: "Booking Requests",
    icon: "calendar-outline",
  },
  { key: "promotional", label: "Promotional Updates", icon: "flash-outline" },
  { key: "reviews", label: "Review Notifications", icon: "star-outline" },
];

export default function SettingsScreen({
  onDeleteAccount,
}: {
  onDeleteAccount?: () => Promise<void> | void;
}) {
  const [notifications, setNotifications] = useState<
    Record<NotificationKey, boolean>
  >({
    bookingUpdates: true,
    bookingRequests: true,
    promotional: false,
    reviews: true,
  });
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const toggleNotification = (key: NotificationKey) => {
    setNotifications((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      // TODO API: await updateNotificationPrefsMutation(next)
      return next;
    });
  };

  const confirmDeleteAccount = async () => {
    if (onDeleteAccount) await onDeleteAccount();
    // TODO API: await deleteAccountMutation()
    setDeleteModalVisible(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FBF9FC]">
      <AppHeader title="Settings" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: 30,
        }}
      >
        <Text className="text-[11px] font-bold text-[#9A94A0] tracking-wide mb-2 uppercase">
          Security
        </Text>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push("/profile/change-password")}
          className="flex-row items-center bg-white rounded-[20px] p-4 mb-6"
          style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
        >
          <View
            className="items-center justify-center rounded-2xl mr-3"
            style={{ width: 40, height: 40, backgroundColor: "#FDEDF1" }}
          >
            <Ionicons name="lock-closed" size={16} color="#FC6C8C" />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-extrabold text-[#161119]">
              Change Password
            </Text>
            <Text className="text-xs text-[#8A8590] mt-0.5">
              Last changed 3 months ago
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#D9D3E0" />
        </TouchableOpacity>

        <Text className="text-[11px] font-bold text-[#9A94A0] tracking-wide mb-2 uppercase">
          Notifications
        </Text>
        <View
          className="bg-white rounded-[20px] px-4 mb-6"
          style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
        >
          {NOTIFICATION_ROWS.map((row, idx) => (
            <View key={row.key}>
              <View className="flex-row items-center justify-between py-3.5">
                <View className="flex-row items-center">
                  <View
                    className="items-center justify-center rounded-full mr-3"
                    style={{
                      width: 30,
                      height: 30,
                      backgroundColor: "#F4E4FF",
                    }}
                  >
                    <Ionicons name={row.icon} size={14} color="#B57EDC" />
                  </View>
                  <Text className="text-sm text-[#161119]">{row.label}</Text>
                </View>
                <Toggle
                  value={notifications[row.key]}
                  onChange={() => toggleNotification(row.key)}
                />
              </View>
              {idx < NOTIFICATION_ROWS.length - 1 && (
                <View className="h-[1px] bg-[#F0EEF2]" />
              )}
            </View>
          ))}
        </View>

        <Text className="text-[11px] font-bold text-[#E0405B] tracking-wide mb-2 uppercase">
          Danger Zone
        </Text>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setDeleteModalVisible(true)}
          className="flex-row items-center rounded-[20px] p-4"
          style={{ backgroundColor: "#FDEDF1" }}
        >
          <View
            className="items-center justify-center rounded-2xl mr-3"
            style={{ width: 40, height: 40, backgroundColor: "#FCD9E1" }}
          >
            <Ionicons name="trash" size={16} color="#E0405B" />
          </View>
          <View className="flex-1">
            <Text
              className="text-sm font-extrabold"
              style={{ color: "#E0405B" }}
            >
              Delete Account
            </Text>
            <Text className="text-xs mt-0.5" style={{ color: "#C97D8A" }}>
              Permanently delete all your data
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <ConfirmationModal
        visible={deleteModalVisible}
        title="Delete Account?"
        message="This will permanently delete your account and all associated data. This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteAccount}
        onCancel={() => setDeleteModalVisible(false)}
      />
    </SafeAreaView>
  );
}
