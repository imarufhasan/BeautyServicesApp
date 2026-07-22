import AppHeader from "@/components/common/AppHeader";
import GradientActionButton from "@/components/common/GradientActionButton";
import { COLORS } from "@/constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Calendar,
  ChevronRight,
  CreditCard,
  DollarSign,
  Gift,
  Lock,
  LogOut,
  LucideIcon,
  Shield,
  Star,
  Trash2,
  Zap,
} from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function Toggle({
  value,
  onValueChange,
}: {
  value: boolean;
  onValueChange: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onValueChange}
      className={`h-7 w-12 justify-center rounded-full px-0.5 ${
        value ? "" : "bg-gray-200"
      }`}
      style={value ? undefined : undefined}
    >
      {value ? (
        <LinearGradient
          colors={[COLORS.baseColor1, COLORS.baseColor2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="absolute h-7 w-12"
          style={{
            borderRadius: 999,
          }}
        />
      ) : null}
      <View
        className={`h-6 w-6 rounded-full bg-white shadow ${
          value ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </TouchableOpacity>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <Text className="mb-2 px-1 text-[11px] font-semibold tracking-wider text-gray-400">
      {children}
    </Text>
  );
}

function Row({
  Icon,
  iconBg,
  iconColor,
  title,
  subtitle,
  right,
  onPress,
  isLast,
}: {
  Icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle?: string;
  right: React.ReactNode;
  onPress?: () => void;
  isLast?: boolean;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className={`flex-row items-center gap-3 px-4 py-3.5 ${
        !isLast ? "border-b border-gray-100" : ""
      }`}
    >
      <View
        className={`h-10 w-10 items-center justify-center rounded-full ${iconBg}`}
      >
        <Icon size={18} color={iconColor} />
      </View>
      <View className="flex-1">
        <Text className="text-[15px] font-medium text-gray-900">{title}</Text>
        {subtitle ? (
          <Text className="text-xs text-gray-400">{subtitle}</Text>
        ) : null}
      </View>
      {right}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState({
    booking: true,
    requests: true,
    promo: false,
    reviews: true,
  });
  const [privacy, setPrivacy] = useState({
    location: true,
    camera: true,
    photos: true,
    notif: true,
  });
  const [saving, setSaving] = useState(false);

  const toggleNotif = (key: keyof typeof notifications) =>
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  const togglePrivacy = (key: keyof typeof privacy) =>
    setPrivacy((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1200);
  };

  return (
    <SafeAreaView className="flex-1 bg-rose-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <AppHeader title="Settings" />

        <View className="gap-6 px-4">
          {/* Security */}
          <View>
            <SectionLabel>SECURITY</SectionLabel>
            <View className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <Row
                Icon={Lock}
                iconBg="bg-pink-50"
                iconColor="#ec4899"
                title="Change Password"
                subtitle="Last changed 3 months ago"
                right={<ChevronRight size={18} color="#d1d5db" />}
                isLast
              />
            </View>
          </View>

          {/* Notifications */}
          <View>
            <SectionLabel>NOTIFICATIONS</SectionLabel>
            <View className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <Row
                Icon={Gift}
                iconBg="bg-pink-50"
                iconColor="#ec4899"
                title="Booking Updates"
                right={
                  <Toggle
                    value={notifications.booking}
                    onValueChange={() => toggleNotif("booking")}
                  />
                }
              />
              <Row
                Icon={Calendar}
                iconBg="bg-pink-50"
                iconColor="#ec4899"
                title="Booking Requests"
                right={
                  <Toggle
                    value={notifications.requests}
                    onValueChange={() => toggleNotif("requests")}
                  />
                }
              />
              <Row
                Icon={Zap}
                iconBg="bg-pink-50"
                iconColor="#ec4899"
                title="Promotional Updates"
                right={
                  <Toggle
                    value={notifications.promo}
                    onValueChange={() => toggleNotif("promo")}
                  />
                }
              />
              <Row
                Icon={Star}
                iconBg="bg-pink-50"
                iconColor="#ec4899"
                title="Review Notifications"
                right={
                  <Toggle
                    value={notifications.reviews}
                    onValueChange={() => toggleNotif("reviews")}
                  />
                }
                isLast
              />
            </View>
          </View>

          {/* Privacy */}
          <View>
            <SectionLabel>PRIVACY</SectionLabel>
            <View className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <Row
                Icon={Shield}
                iconBg="bg-emerald-50"
                iconColor="#10b981"
                title="Location Permission"
                subtitle="Allow location access"
                right={
                  <Toggle
                    value={privacy.location}
                    onValueChange={() => togglePrivacy("location")}
                  />
                }
              />
              <Row
                Icon={Shield}
                iconBg="bg-emerald-50"
                iconColor="#10b981"
                title="Camera Permission"
                subtitle="Allow camera access"
                right={
                  <Toggle
                    value={privacy.camera}
                    onValueChange={() => togglePrivacy("camera")}
                  />
                }
              />
              <Row
                Icon={Shield}
                iconBg="bg-emerald-50"
                iconColor="#10b981"
                title="Photo Library"
                subtitle="Allow photo access"
                right={
                  <Toggle
                    value={privacy.photos}
                    onValueChange={() => togglePrivacy("photos")}
                  />
                }
              />
              <Row
                Icon={Shield}
                iconBg="bg-emerald-50"
                iconColor="#10b981"
                title="Notification Permission"
                subtitle="Allow notifications"
                right={
                  <Toggle
                    value={privacy.notif}
                    onValueChange={() => togglePrivacy("notif")}
                  />
                }
                isLast
              />
            </View>
          </View>

          {/* Payment */}
          <View>
            <SectionLabel>PAYMENT</SectionLabel>
            <View className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <Row
                Icon={CreditCard}
                iconBg="bg-pink-50"
                iconColor="#ec4899"
                title="Default Payment Method"
                subtitle="Visa •••• 4281"
                right={<ChevronRight size={18} color="#d1d5db" />}
              />
              <Row
                Icon={DollarSign}
                iconBg="bg-emerald-50"
                iconColor="#10b981"
                title="Bank Account"
                subtitle="NAB •••• 7892"
                right={<ChevronRight size={18} color="#d1d5db" />}
                isLast
              />
            </View>
          </View>

          {/* Danger zone */}
          <View>
            <Text className="mb-2 px-1 text-[11px] font-semibold tracking-wider text-rose-400">
              DANGER ZONE
            </Text>
            <View className="overflow-hidden rounded-2xl bg-rose-50">
              <TouchableOpacity className="flex-row items-center gap-3 border-b border-rose-100 px-4 py-3.5">
                <LogOut size={18} color="#f43f5e" />
                <View>
                  <Text className="text-[15px] font-medium text-rose-500">
                    Logout
                  </Text>
                  <Text className="text-xs text-rose-300">
                    Sign out of your account
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center gap-3 px-4 py-3.5">
                <Trash2 size={18} color="#f43f5e" />
                <View>
                  <Text className="text-[15px] font-medium text-rose-500">
                    Delete Account
                  </Text>
                  <Text className="text-xs text-rose-300">
                    Permanently delete all your data
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* <TouchableOpacity activeOpacity={0.85} onPress={handleSave}>
            <LinearGradient
              colors={["#ec4899", "#fb923c"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="items-center rounded-2xl py-4"
              style={{
                borderRadius: 999,
              }}
            >
              <Text className="text-[15px] font-semibold text-white">
                {saving ? "Saving..." : "Save Changes"}
              </Text>
            </LinearGradient>
          </TouchableOpacity> */}

          <GradientActionButton
            title="Save Changes"
            onPress={() => router.back()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
