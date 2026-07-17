import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { FlatList, Pressable, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ---------------------------------------------
// Types — shape this to match your real API res
// ---------------------------------------------
type NotificationType =
  | "booking_confirmed"
  | "payment_successful"
  | "booking_reminder"
  | "booking_cancelled"
  | "special_offer"
  | "refund_processed"
  | "order_complete";

interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timeAgo: string;
  isUnread: boolean;
  actionLabel?: string; // e.g. "View Booking"
  actionRoute?: string; // route to navigate to on action tap
}

interface NotificationsApiResponse {
  success: boolean;
  data: NotificationItem[];
}

// ---------------------------------------------
// Dummy API response — swap with RTK Query later
// e.g. useGetNotificationsQuery()
// ---------------------------------------------
const DUMMY_API_RESPONSE: NotificationsApiResponse = {
  success: true,
  data: [
    {
      id: "1",
      type: "booking_confirmed",
      title: "Booking Confirmed",
      message:
        "Your appointment with Sophie Laurent is confirmed for Thu 15 Aug at 2:00 PM.",
      timeAgo: "2m ago",
      isUnread: true,
      actionLabel: "View Booking",
      actionRoute: "/bookings/1",
    },
    {
      id: "2",
      type: "payment_successful",
      title: "Payment Successful",
      message:
        "Payment of $85.00 for Hair Styling session has been received successfully.",
      timeAgo: "1h ago",
      isUnread: true,
    },
    {
      id: "3",
      type: "booking_reminder",
      title: "Booking Reminder",
      message:
        "Your makeup session with Mia Chen is tomorrow at 10:30 AM. See you soon!",
      timeAgo: "3h ago",
      isUnread: false,
      actionLabel: "View Booking",
      actionRoute: "/bookings/3",
    },
    {
      id: "4",
      type: "booking_cancelled",
      title: "Booking Cancelled",
      message:
        "Your appointment with Lena Park on 5 Aug has been cancelled. A refund is being processed.",
      timeAgo: "6h ago",
      isUnread: false,
      actionLabel: "View Booking",
      actionRoute: "/bookings/4",
    },
    {
      id: "5",
      type: "special_offer",
      title: "Special Offer 🎉",
      message:
        "Get 20% off your next booking this weekend only. Book before Sunday midnight!",
      timeAgo: "1d ago",
      isUnread: false,
    },
    {
      id: "6",
      type: "refund_processed",
      title: "Refund Processed",
      message:
        "Your refund of $45.00 from the cancelled booking has been processed to your wallet.",
      timeAgo: "2d ago",
      isUnread: false,
    },
    {
      id: "7",
      type: "order_complete",
      title: "Order complete",
      message: "Give a short review",
      timeAgo: "2d ago",
      isUnread: false,
    },
  ],
};

const ICON_CONFIG: Record<
  NotificationType,
  { bg: string; iconColor: string; render: (color: string) => React.ReactNode }
> = {
  booking_confirmed: {
    bg: "bg-purple-100",
    iconColor: "#8B5CF6",
    render: (c) => (
      <Ionicons name="checkmark-circle-outline" size={22} color={c} />
    ),
  },
  payment_successful: {
    bg: "bg-pink-100",
    iconColor: "#EC4899",
    render: (c) => <Feather name="dollar-sign" size={20} color={c} />,
  },
  booking_reminder: {
    bg: "bg-orange-100",
    iconColor: "#F59E0B",
    render: (c) => <Feather name="clock" size={20} color={c} />,
  },
  booking_cancelled: {
    bg: "bg-red-100",
    iconColor: "#EF4444",
    render: (c) => <Ionicons name="close" size={22} color={c} />,
  },
  special_offer: {
    bg: "bg-pink-100",
    iconColor: "#EC4899",
    render: (c) => <Ionicons name="pricetag-outline" size={20} color={c} />,
  },
  refund_processed: {
    bg: "bg-green-100",
    iconColor: "#22C55E",
    render: (c) => <Feather name="refresh-cw" size={19} color={c} />,
  },
  order_complete: {
    bg: "bg-purple-100",
    iconColor: "#A78BFA",
    render: (c) => (
      <MaterialCommunityIcons name="check-circle-outline" size={22} color={c} />
    ),
  },
};

const NotificationCard = ({
  item,
  onActionPress,
}: {
  item: NotificationItem;
  onActionPress: (item: NotificationItem) => void;
}) => {
  const config = ICON_CONFIG[item.type];

  return (
    <View className="bg-white rounded-2xl p-4 mb-3 flex-row shadow-sm shadow-black/5 border border-gray-50">
      {/* Icon */}
      <View
        className={`w-11 h-11 rounded-full items-center justify-center mr-3 ${config.bg}`}
      >
        {config.render(config.iconColor)}
      </View>

      {/* Content */}
      <View className="flex-1">
        <View className="flex-row items-start justify-between">
          <Text className="text-[15px] font-semibold text-gray-900 flex-1 pr-2">
            {item.title}
          </Text>
          <View className="flex-row items-center">
            <Text className="text-[11px] text-gray-400 mr-1.5">
              {item.timeAgo}
            </Text>
            {item.isUnread && (
              <View className="w-2 h-2 rounded-full bg-pink-500" />
            )}
          </View>
        </View>

        <Text className="text-[13px] text-gray-500 mt-1 leading-[18px]">
          {item.message}
        </Text>

        {item.actionLabel && (
          <Pressable
            onPress={() => onActionPress(item)}
            className="self-start mt-3 bg-pink-50 rounded-full px-3.5 py-1.5 flex-row items-center"
          >
            <Text className="text-pink-500 text-[12px] font-medium mr-1">
              {item.actionLabel}
            </Text>
            <Feather name="arrow-right" size={13} color="#EC4899" />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    DUMMY_API_RESPONSE.data,
  );

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
  };

  const handleActionPress = (item: NotificationItem) => {
    if (item.actionRoute) {
      router.push("/booking-details");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-4 pb-4">
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          className="w-9 h-9 items-center justify-center"
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </Pressable>

        <Text className="text-xl font-bold text-gray-900">Notifications</Text>

        <Pressable
          onPress={handleMarkAllRead}
          className="border border-orange-300 rounded-full px-3 py-1.5"
        >
          <Text className="text-orange-400 text-[12px] font-medium">
            Mark All Read
          </Text>
        </Pressable>
      </View>

      {/* List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <NotificationCard item={item} onActionPress={handleActionPress} />
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
