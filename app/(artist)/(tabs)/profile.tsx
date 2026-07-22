import AppTabBar from "@/components/common/AppTabBar";
import GradientActionButton from "@/components/common/GradientActionButton";
import { COLORS } from "@/constants/colors";
import { profileDummyResponse } from "@/constants/dummyData";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  iconBg: string;
  iconColor: string;
  label: string;
  labelColor?: string;
  last?: boolean;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center justify-between px-3 py-3.5 ${
        last ? "" : "border-b border-gray-50"
      }`}
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

export default function ProfileScreen() {
  const p = profileDummyResponse.data;

  const [profileImage, setProfileImage] = useState(p.avatarUrl);

  const [logoutModal, setLogoutModal] = useState(false);

  const handleLogout = () => {
    setLogoutModal(false);
    router.replace("/(auth)/LoginScreen");
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert("Permission required to select image");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <LinearGradient
      colors={["#FFF0F4", "#FAFAFA", "#F0FAF8"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          {/* Top bar */}
          <View className="relative flex-row items-center justify-center px-5 pt-4">
            <Text className="text-xl font-semibold text-black">Profile</Text>

            <TouchableOpacity
              onPress={() => router.push("/(artist)/SettingsScreen")}
              className="absolute right-5 h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm"
            >
              <Feather name="settings" size={16} color="#374151" />
            </TouchableOpacity>
          </View>

          {/* Profile card */}
          <View className="mx-5 mt-3 items-center rounded-3xl border-gray-100 border-0 bg-white p-5 shadow-sm">
            <View className="relative">
              <Image
                source={{ uri: profileImage }}
                className="h-24 w-24 rounded-full"
              />
              <TouchableOpacity
                onPress={pickImage}
                className="absolute bottom-0 right-0 h-7 w-7 items-center justify-center rounded-full border-2 border-white"
              >
                <LinearGradient
                  colors={[COLORS.baseColor1, COLORS.baseColor2]}
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
              </TouchableOpacity>
            </View>

            {p.isVerified && (
              <View className="mt-3 flex-row items-center rounded-full bg-[##BAF1E4] px-3 py-1">
                <Feather name="check" size={11} color="#10B981" />
                <Text className="ml-1 text-xs font-semibold text-emerald-500">
                  Verified Artist
                </Text>
              </View>
            )}

            <Text className="mt-2 text-xl font-bold text-gray-900">
              {p.name}
            </Text>
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
                <Text className="text-xs text-gray-400">
                  Profile Completion
                </Text>
                <Text className="text-xs font-semibold text-emerald-500">
                  {p.profileCompletionPercent}% Complete
                </Text>
              </View>
              <View className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <LinearGradient
                  colors={["#BAF1E4", "#48B9A8"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    width: `${p.profileCompletionPercent}%`,
                    height: "100%",
                    borderRadius: 999,
                  }}
                />
              </View>
            </View>

            <View className="flex-1 w-full mt-4">
              <GradientActionButton
                title="Edit Profile"
                loading={false}
                onPress={() => router.push("/(artist)/EditProfileScreen")}
              />
            </View>
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
              <Text className="text-base font-bold text-gray-900">
                Services
              </Text>
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
              onPress={() => {
                router.push("/(artist)/ReviewsScreen");
              }}
            />
            <MenuRow
              icon="gift"
              iconBg="bg-violet-50"
              iconColor="#8B5CF6"
              label="Promotions"
              onPress={() => {
                router.push("/(artist)/PromotionsScreen");
              }}
            />
            <MenuRow
              icon="file-text"
              iconBg="bg-blue-50"
              iconColor="#3B82F6"
              label="Certificates"
              onPress={() => {
                router.push("/(artist)/PromotionsScreen");
              }}
            />
            <MenuRow
              icon="bar-chart-2"
              iconBg="bg-amber-50"
              iconColor="#F59E0B"
              label="Analytics"
              onPress={() => {
                router.push("/(artist)/AnalyticsScreen");
              }}
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
              onPress={() => setLogoutModal(true)}
            />
          </View>
        </ScrollView>

        <Modal
          visible={logoutModal}
          transparent
          animationType="fade"
          onRequestClose={() => setLogoutModal(false)}
        >
          <View className="flex-1 items-center justify-center bg-black/40 px-5">
            <View className="w-full rounded-3xl bg-white p-6">
              <View className="mx-auto h-14 w-14 items-center justify-center rounded-full bg-rose-50">
                <Feather name="log-out" size={24} color="#FB7185" />
              </View>

              <Text className="mt-4 text-center text-lg font-bold text-gray-900">
                Logout
              </Text>

              <Text className="mt-2 text-center text-sm text-gray-500">
                Are you sure you want to logout from your account?
              </Text>

              <View className="mt-6 flex-row gap-3">
                <TouchableOpacity
                  onPress={() => setLogoutModal(false)}
                  className="flex-1 rounded-full bg-gray-100 py-3 items-center"
                >
                  <Text className="font-semibold text-gray-600">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleLogout}
                  className="flex-1 rounded-full bg-rose-400 py-3 items-center"
                >
                  <Text className="font-semibold text-white">Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <AppTabBar active="Profile" />
      </SafeAreaView>
    </LinearGradient>
  );
}
