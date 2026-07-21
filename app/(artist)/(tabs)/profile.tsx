import AppTabBar from "@/components/common/AppTabBar";
import { profileDummyResponse } from "@/constants/dummyData";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const p = profileDummyResponse.data;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView
        className="flex-1 bg-rose-50/30"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Top bar */}
        <View className="flex-row items-center justify-between px-5 pt-4">
          <Image
            source={{ uri: p.coverAvatarUrl }}
            className="h-9 w-9 rounded-full"
          />
          <TouchableOpacity className="h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm">
            <Feather name="settings" size={16} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Profile card */}
        <View className="mx-5 mt-3 items-center rounded-3xl bg-white p-5 shadow-sm">
          <View className="relative">
            <Image
              source={{ uri: p.avatarUrl }}
              className="h-24 w-24 rounded-full"
            />
            <View className="absolute bottom-0 right-0 h-7 w-7 items-center justify-center rounded-full border-2 border-white">
              <LinearGradient
                colors={["#EC4899", "#FB923C"]}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 14,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather name="camera" size={12} color="#fff" />
              </LinearGradient>
            </View>
          </View>

          {p.isVerified && (
            <View className="mt-3 flex-row items-center rounded-full bg-emerald-50 px-3 py-1">
              <Feather name="check" size={11} color="#10B981" />
              <Text className="ml-1 text-xs font-semibold text-emerald-500">
                Verified Artist
              </Text>
            </View>
          )}

          <Text className="mt-2 text-xl font-bold text-gray-900">{p.name}</Text>
          <Text className="text-[13px] text-gray-400">{p.role}</Text>
          <View className="mt-1 flex-row items-center">
            <Text className="text-[13px] font-medium text-gray-600">
              {p.businessInfo.businessName}
            </Text>
            <View className="ml-2 flex-row items-center rounded-full bg-amber-50 px-2 py-0.5">
              <Feather name="check" size={9} color="#F59E0B" />
              <Text className="ml-0.5 text-[10px] font-semibold text-amber-500">
                ABN Verified
              </Text>
            </View>
          </View>

          <View className="mt-4 w-full flex-row items-center justify-around">
            <StatItem value={`${p.experienceYears} yrs`} label="Experience" />
            <View className="h-8 w-px bg-gray-100" />
            <StatItem value={p.rating.toFixed(1)} label="Rating" star />
            <View className="h-8 w-px bg-gray-100" />
            <StatItem value={String(p.reviewsCount)} label="Reviews" />
          </View>

          <View className="mt-4 w-full">
            <View className="flex-row items-center justify-between">
              <Text className="text-xs text-gray-400">Profile Completion</Text>
              <Text className="text-xs font-semibold text-emerald-500">
                {p.profileCompletionPercent}% Complete
              </Text>
            </View>
            <View className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <View
                className="h-full rounded-full bg-emerald-400"
                style={{ width: `${p.profileCompletionPercent}%` }}
              />
            </View>
          </View>

          <TouchableOpacity className="mt-4 w-full overflow-hidden rounded-full">
            <LinearGradient
              colors={["#EC4899", "#FB923C"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="items-center justify-center py-3.5"
            >
              <Text className="text-sm font-semibold text-white">
                Edit Profile
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Portfolio */}
        <View className="mx-5 mt-6 flex-row items-center justify-between">
          <Text className="text-base font-bold text-gray-900">Portfolio</Text>
          <TouchableOpacity>
            <Text className="text-xs font-semibold text-rose-400">
              View All
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-3 pl-5"
        >
          <View className="flex-row" style={{ gap: 10 }}>
            {p.portfolio.map((item) => (
              <Image
                key={item.id}
                source={{ uri: item.imageUrl }}
                className="h-28 w-24 rounded-2xl"
              />
            ))}
          </View>
        </ScrollView>

        {/* Services */}
        <View className="mx-5 mt-6 rounded-3xl bg-white p-4 shadow-sm">
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-bold text-gray-900">Services</Text>
            <TouchableOpacity>
              <Text className="text-xs font-semibold text-rose-400">
                Manage
              </Text>
            </TouchableOpacity>
          </View>
          {p.services.map((s, idx) => (
            <View
              key={s.id}
              className={`flex-row items-center justify-between py-3 ${
                idx !== p.services.length - 1 ? "border-b border-gray-50" : ""
              }`}
            >
              <View>
                <Text className="text-sm font-semibold text-gray-800">
                  {s.name}
                </Text>
                <Text className="text-xs text-gray-400">
                  {s.durationMinutes} min
                </Text>
              </View>
              <View className="flex-row items-center" style={{ gap: 10 }}>
                <Text className="text-sm font-bold text-gray-900">
                  ${s.price}
                </Text>
                <View className="h-7 w-7 items-center justify-center rounded-full bg-rose-50">
                  <Feather name="edit-2" size={12} color="#FB7185" />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Business Info */}
        <Text className="mx-5 mt-6 text-base font-bold text-gray-900">
          Business Information
        </Text>
        <View className="mx-5 mt-3 rounded-3xl bg-white p-4 shadow-sm">
          <BizRow
            icon="briefcase"
            label="Business Name"
            value={p.businessInfo.businessName}
          />
          <BizRow
            icon="file-text"
            label="ABN Number"
            value={p.businessInfo.abnNumber}
          />
          <BizRow
            icon="map-pin"
            label="Business Address"
            value={p.businessInfo.address}
          />
          <BizRow
            icon="clock"
            label="Working Hours"
            value={p.businessInfo.workingHours}
          />
          <BizRow
            icon="globe"
            label="Travel Radius"
            value={`${p.businessInfo.travelRadiusKm} km from home base`}
          />
          <BizRow
            icon="message-circle"
            label="Languages"
            value={p.businessInfo.languages.join(", ")}
          />
          <BizRow
            icon="award"
            label="Member Since"
            value={p.businessInfo.memberSince}
            last
          />
        </View>

        {/* Features */}
        <Text className="mx-5 mt-6 text-base font-bold text-gray-900">
          Features
        </Text>
        <View className="mx-5 mt-3 rounded-3xl bg-white p-2 shadow-sm">
          <MenuRow
            icon="shield"
            iconBg="bg-emerald-50"
            iconColor="#10B981"
            label="Reviews"
          />
          <MenuRow
            icon="gift"
            iconBg="bg-violet-50"
            iconColor="#8B5CF6"
            label="Promotions"
          />
          <MenuRow
            icon="file-text"
            iconBg="bg-blue-50"
            iconColor="#3B82F6"
            label="Certificates"
          />
          <MenuRow
            icon="bar-chart-2"
            iconBg="bg-amber-50"
            iconColor="#F59E0B"
            label="Analytics"
            last
          />
        </View>

        {/* Account */}
        <Text className="mx-5 mt-6 text-base font-bold text-gray-900">
          Account
        </Text>
        <View className="mx-5 mt-3 mb-2 rounded-3xl bg-white p-2 shadow-sm">
          <MenuRow
            icon="shield"
            iconBg="bg-emerald-50"
            iconColor="#10B981"
            label="Privacy Settings"
          />
          <MenuRow
            icon="help-circle"
            iconBg="bg-violet-50"
            iconColor="#8B5CF6"
            label="Support"
          />
          <MenuRow
            icon="info"
            iconBg="bg-amber-50"
            iconColor="#F59E0B"
            label="Help Center"
          />
          <MenuRow
            icon="settings"
            iconBg="bg-gray-100"
            iconColor="#6B7280"
            label="Settings"
          />
          <MenuRow
            icon="log-out"
            iconBg="bg-rose-50"
            iconColor="#FB7185"
            label="Logout"
            labelColor="text-rose-400"
            last
          />
        </View>
      </ScrollView>

      <AppTabBar active="Profile" />
    </SafeAreaView>
  );
}

function StatItem({
  value,
  label,
  star,
}: {
  value: string;
  label: string;
  star?: boolean;
}) {
  return (
    <View className="items-center">
      <View className="flex-row items-center">
        {star && (
          <Feather
            name="star"
            size={13}
            color="#FBBF24"
            style={{ marginRight: 3 }}
          />
        )}
        <Text className="text-base font-bold text-gray-900">{value}</Text>
      </View>
      <Text className="text-[11px] text-gray-400">{label}</Text>
    </View>
  );
}

function BizRow({
  icon,
  label,
  value,
  last,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View
      className={`flex-row items-start py-3 ${last ? "" : "border-b border-gray-50"}`}
    >
      <View className="mt-0.5 h-8 w-8 items-center justify-center rounded-full bg-rose-50">
        <Feather name={icon} size={13} color="#FB7185" />
      </View>
      <View className="ml-3 flex-1">
        <Text className="text-[11px] text-gray-400">{label}</Text>
        <Text className="mt-0.5 text-sm font-semibold text-gray-800">
          {value}
        </Text>
      </View>
    </View>
  );
}

function MenuRow({
  icon,
  iconBg,
  iconColor,
  label,
  labelColor = "text-gray-800",
  last,
}: {
  icon: keyof typeof Feather.glyphMap;
  iconBg: string;
  iconColor: string;
  label: string;
  labelColor?: string;
  last?: boolean;
}) {
  return (
    <TouchableOpacity
      className={`flex-row items-center justify-between px-3 py-3.5 ${last ? "" : "border-b border-gray-50"}`}
    >
      <View className="flex-row items-center">
        <View
          className={`h-9 w-9 items-center justify-center rounded-full ${iconBg}`}
        >
          <Feather name={icon} size={15} color={iconColor} />
        </View>
        <Text className={`ml-3 text-sm font-semibold ${labelColor}`}>
          {label}
        </Text>
      </View>
      <Feather name="chevron-right" size={16} color="#D1D5DB" />
    </TouchableOpacity>
  );
}
