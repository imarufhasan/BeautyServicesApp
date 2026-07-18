import LogoutModal from "@/components/profile/LogoutModal";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type UserProfile = {
  name: string;
  email: string;
  phone: string;
  avatar: ImageSourcePropType;
  memberSince: string; // e.g. "Jan 2023"
};

type SettingsRow = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  route?: string;
  danger?: boolean;
};

// ---------------------------------------------------------------------------
// Mock data — replace with real API data (auth/user endpoint)
// ---------------------------------------------------------------------------
const AVATAR = require("../../../assets/images/home/pic1.png");

const MOCK_USER: UserProfile = {
  name: "Isabelle Chen",
  email: "isabelle.chen@gmail.com",
  phone: "+61 412 345 678",
  avatar: AVATAR,
  memberSince: "Jan 2023",
};

const ACCOUNT_ROWS: SettingsRow[] = [
  {
    id: "edit-profile",
    label: "Edit Profile",
    icon: "create-outline",
    iconBg: "#F4E4FF",
    iconColor: "#B57EDC",
    route: "/profile/edit-profile",
  },
  {
    id: "saved-artist",
    label: "Saved Artist",
    icon: "heart-outline",
    iconBg: "#FDEDF1",
    iconColor: "#FC6C8C",
    route: "/profile/saved-addresses",
  },
  {
    id: "saved-addresses",
    label: "Saved Addresses",
    icon: "location-outline",
    iconBg: "#F4E4FF",
    iconColor: "#B57EDC",
    route: "/profile/add-address",
  },
  {
    id: "transaction-history",
    label: "Transaction History",
    icon: "cash-outline",
    iconBg: "#EAF7F3",
    iconColor: "#1A5A52",
    route: "/profile/transaction-history",
  },
];

const PAYMENT_ROWS: SettingsRow[] = [
  {
    id: "payment-methods",
    label: "Payment Methods",
    icon: "card-outline",
    iconBg: "#EAF0FF",
    iconColor: "#2F5FDB",
    route: "/profile/payment-methods",
  },
];

const SUPPORT_ROWS: SettingsRow[] = [
  {
    id: "faq",
    label: "FAQ",
    icon: "help-circle-outline",
    iconBg: "#F4E4FF",
    iconColor: "#B57EDC",
    route: "/profile/faq",
  },
  {
    id: "contact-support",
    label: "Contact Support",
    icon: "chatbubble-ellipses-outline",
    iconBg: "#EAF7F3",
    iconColor: "#1A5A52",
    route: "/contact-support",
  },
  {
    id: "report-issue",
    label: "Report an Issue",
    icon: "alert-circle-outline",
    iconBg: "#FFF3E0",
    iconColor: "#E17100",
    route: "/profile/report-issue",
  },
];

const LEGAL_ROWS: SettingsRow[] = [
  {
    id: "privacy-policy",
    label: "Privacy Policy",
    icon: "shield-checkmark-outline",
    iconBg: "#F4E4FF",
    iconColor: "#B57EDC",
    route: "/profile/privacy-policy",
  },
  {
    id: "terms",
    label: "Terms & Conditions",
    icon: "document-text-outline",
    iconBg: "#EAF7F3",
    iconColor: "#1A5A52",
    route: "/profile/terms-conditions",
  },
];

const LOGOUT_ROW: SettingsRow = {
  id: "logout",
  label: "Log Out",
  icon: "log-out-outline",
  iconBg: "#FFF3E0",
  iconColor: "#E17100",
  danger: true,
};

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <Text className="text-[11px] font-bold text-[#9A94A0] tracking-wide mb-2 mt-5">
    {children}
  </Text>
);

const Row = ({
  row,
  onPress,
  isLast,
}: {
  row: SettingsRow;
  onPress: (row: SettingsRow) => void;
  isLast?: boolean;
}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={() => onPress(row)}
    className="flex-row items-center py-3.5"
    style={
      !isLast
        ? { borderBottomWidth: 1, borderBottomColor: "#F3EFF5" }
        : undefined
    }
  >
    <View
      className="items-center justify-center rounded-full mr-3"
      style={{ width: 36, height: 36, backgroundColor: row.iconBg }}
    >
      <Ionicons name={row.icon} size={16} color={row.iconColor} />
    </View>
    <Text
      className="flex-1 text-sm font-bold"
      style={{ color: row.danger ? "#E17100" : "#161119" }}
    >
      {row.label}
    </Text>
    {!row.danger && (
      <Ionicons name="chevron-forward" size={16} color="#C7C1CD" />
    )}
  </TouchableOpacity>
);

const RowCard = ({
  rows,
  onPress,
}: {
  rows: SettingsRow[];
  onPress: (row: SettingsRow) => void;
}) => (
  <View
    className="bg-white rounded-[18px] px-4"
    style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
  >
    {rows.map((row, idx) => (
      <Row
        key={row.id}
        row={row}
        onPress={onPress}
        isLast={idx === rows.length - 1}
      />
    ))}
  </View>
);

export default function ProfileScreen({
  user = MOCK_USER,
}: {
  user?: UserProfile;
}) {
  const handleRowPress = (row: SettingsRow) => {
    if (row.danger) {
      setShowLogoutModal(true);
      return;
    }
    if (row.route) {
      router.push(row.route as any);
    }
  };

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(false);

    // Clear token/session here
    // dispatch(logout());

    router.replace("/(auth)/LoginScreen");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FBF9FC]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between pt-3 pb-2">
          <Text className="text-2xl font-extrabold text-[#161119]">
            Profile
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/profile/settings")}
            className="w-9 h-9 rounded-full bg-white items-center justify-center"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.06,
              shadowRadius: 6,
              elevation: 1,
            }}
          >
            <Ionicons name="settings-outline" size={17} color="#161119" />
          </TouchableOpacity>
        </View>

        {/* Profile summary card */}
        <View
          className="bg-white rounded-[20px] items-center py-6 mt-3"
          style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
        >
          <View>
            <Image
              source={user.avatar}
              style={{ width: 84, height: 84, borderRadius: 42 }}
              resizeMode="cover"
            />
            <TouchableOpacity
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full items-center justify-center bg-[#FC6C8C]"
              style={{ borderWidth: 2, borderColor: "#fff" }}
            >
              <Ionicons name="camera" size={13} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text className="text-base font-extrabold text-[#161119] mt-3">
            {user.name}
          </Text>
          <Text className="text-xs text-[#8A8590] mt-1">{user.email}</Text>
          <Text className="text-xs text-[#8A8590] mt-0.5">{user.phone}</Text>

          <View className="bg-[#FDEDF1] rounded-full px-3 py-1 mt-3">
            <Text
              className="text-[10px] font-bold"
              style={{ color: "#E0405B" }}
            >
              Member since {user.memberSince}
            </Text>
          </View>
        </View>

        {/* Account */}
        <SectionLabel>ACCOUNT</SectionLabel>
        <RowCard rows={ACCOUNT_ROWS} onPress={handleRowPress} />

        {/* Payments */}
        <SectionLabel>PAYMENTS</SectionLabel>
        <RowCard rows={PAYMENT_ROWS} onPress={handleRowPress} />

        {/* Support */}
        <SectionLabel>SUPPORT</SectionLabel>
        <RowCard rows={SUPPORT_ROWS} onPress={handleRowPress} />

        {/* Legal */}
        <SectionLabel>LEGAL</SectionLabel>
        <RowCard rows={LEGAL_ROWS} onPress={handleRowPress} />

        {/* Log Out */}
        <View className="mt-5">
          <RowCard rows={[LOGOUT_ROW]} onPress={handleRowPress} />
        </View>
      </ScrollView>
      <LogoutModal
        visible={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </SafeAreaView>
  );
}
