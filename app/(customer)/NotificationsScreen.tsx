import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ---------------------------------------------
// Types — shape this to match your real API res
// ---------------------------------------------
type NotificationType =
  | "booking_confirmed"
  | "booking_rescheduled"
  | "payment_successful"
  | "booking_cancelled"
  | "special_offer"
  | "refund_processed"
  | "order_complete";

// The 3 states booking-update.tsx knows how to render
type BookingUpdateType = "rescheduled" | "cancelled" | "confirmed";

interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timeAgo: string;
  isUnread: boolean;
  actionLabel?: string; // e.g. "View Booking"
  bookingId?: string; // real booking id used to fetch booking-update details
}

interface NotificationsApiResponse {
  success: boolean;
  data: NotificationItem[];
  page: number;
  hasMore: boolean;
}

// ---------------------------------------------
// Base dummy items (page 1) — matches the screenshot 1:1
// ---------------------------------------------
const BASE_ITEMS: Omit<NotificationItem, "id">[] = [
  {
    type: "booking_rescheduled",
    title: "Booking Reschedule",
    message:
      "Please confirm your rescheduled appointment with Sophie Laurent on Thu, 15 Aug, at 2:00 PM",
    timeAgo: "2m ago",
    isUnread: true,
    actionLabel: "View Booking",
    bookingId: "BK-2024-8821",
  },
  {
    type: "payment_successful",
    title: "Payment Successful",
    message:
      "Payment of $85.00 for Hair Styling session has been received successfully.",
    timeAgo: "1h ago",
    isUnread: true,
  },
  {
    type: "booking_cancelled",
    title: "Booking Cancelled",
    message:
      "Your appointment with Lena Park on 5 Aug has been cancelled. A refund is being processed.",
    timeAgo: "6h ago",
    isUnread: false,
    actionLabel: "View Booking",
    bookingId: "BK-2024-8821",
  },
  {
    type: "special_offer",
    title: "Special Offer 🎉",
    message:
      "Get 20% off your next booking this weekend only. Book before Sunday midnight!",
    timeAgo: "1d ago",
    isUnread: false,
  },
  {
    type: "refund_processed",
    title: "Refund Processed",
    message:
      "Your refund of $45.00 from the cancelled booking has been processed to your wallet.",
    timeAgo: "2d ago",
    isUnread: false,
  },
  {
    type: "order_complete",
    title: "Order complete",
    message: "Give a short review",
    timeAgo: "2d ago",
    isUnread: false,
  },
];

// Extra variety used to keep generating further pages
const EXTRA_ITEMS: Omit<NotificationItem, "id">[] = [
  {
    type: "booking_confirmed",
    title: "Booking Confirmed",
    message:
      "Your appointment with Priya Nair is confirmed for Sat, 17 Aug at 11:00 AM.",
    timeAgo: "3d ago",
    isUnread: false,
    actionLabel: "View Booking",
    bookingId: "BK-2024-8910",
  },
  {
    type: "payment_successful",
    title: "Payment Successful",
    message: "Payment of $60.00 for Manicure session has been received.",
    timeAgo: "5d ago",
    isUnread: false,
  },
  {
    type: "special_offer",
    title: "Weekend Glow Deal 🎉",
    message: "Book any facial this weekend and get a free eyebrow tint.",
    timeAgo: "6d ago",
    isUnread: false,
  },
  {
    type: "refund_processed",
    title: "Refund Processed",
    message: "Your refund of $20.00 has been added to your wallet balance.",
    timeAgo: "1w ago",
    isUnread: false,
  },
  {
    type: "booking_cancelled",
    title: "Booking Cancelled",
    message: "Your appointment with Grace Oh on 3 Aug has been cancelled.",
    timeAgo: "1w ago",
    isUnread: false,
    actionLabel: "View Booking",
    bookingId: "BK-2024-8821",
  },
  {
    type: "order_complete",
    title: "Order complete",
    message: "Give a short review",
    timeAgo: "2w ago",
    isUnread: false,
  },
];

const TOTAL_PAGES = 4; // simulate 4 pages of data from the API

// Simulated paginated API call — swap with useGetNotificationsQuery({ page })
const fetchNotificationsPage = (
  page: number,
): Promise<NotificationsApiResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const source = page === 1 ? BASE_ITEMS : EXTRA_ITEMS;
      const data: NotificationItem[] = source.map((item, idx) => ({
        ...item,
        id: `p${page}-${idx}`,
      }));

      resolve({
        success: true,
        data,
        page,
        hasMore: page < TOTAL_PAGES,
      });
    }, 700); // simulate network latency
  });
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
  booking_rescheduled: {
    bg: "bg-purple-100",
    iconColor: "#A78BFA",
    render: (c) => (
      <Ionicons name="checkmark-circle-outline" size={22} color={c} />
    ),
  },
  payment_successful: {
    bg: "bg-pink-100",
    iconColor: "#EC4899",
    render: (c) => <Feather name="dollar-sign" size={20} color={c} />,
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

// Maps a notification's type -> which booking-update screen state to show.
const NOTIFICATION_TO_BOOKING_UPDATE_TYPE: Partial<
  Record<NotificationType, BookingUpdateType>
> = {
  booking_confirmed: "confirmed",
  booking_cancelled: "cancelled",
  booking_rescheduled: "rescheduled",
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
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadPage = useCallback(
    async (nextPage: number, mode: "initial" | "append") => {
      if (mode === "initial") setIsInitialLoading(true);
      else setIsLoadingMore(true);

      const res = await fetchNotificationsPage(nextPage);

      setNotifications((prev) =>
        mode === "initial" ? res.data : [...prev, ...res.data],
      );
      setHasMore(res.hasMore);
      setPage(res.page);

      if (mode === "initial") setIsInitialLoading(false);
      else setIsLoadingMore(false);
    },
    [],
  );

  // initial load
  React.useEffect(() => {
    loadPage(1, "initial");
  }, [loadPage]);

  const handleLoadMore = () => {
    if (isLoadingMore || isInitialLoading || !hasMore) return;
    loadPage(page + 1, "append");
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
  };

  const handleActionPress = (item: NotificationItem) => {
    const updateType = NOTIFICATION_TO_BOOKING_UPDATE_TYPE[item.type];

    // Only booking_confirmed / booking_cancelled / booking_rescheduled
    // notifications open the booking-update screen — with the matching type.
    if (updateType) {
      router.push({
        pathname: "/booking/booking-update",
        params: { type: updateType, id: item.bookingId },
      });
      return;
    }

    // fallback for any other actionable notification type in future
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
      {isInitialLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="small" color="#EC4899" />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          renderItem={({ item }) => (
            <NotificationCard item={item} onActionPress={handleActionPress} />
          )}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            isLoadingMore ? (
              <View className="py-4">
                <ActivityIndicator size="small" color="#EC4899" />
              </View>
            ) : !hasMore && notifications.length > 0 ? (
              <View className="py-4 items-center">
                <Text className="text-[12px] text-gray-400">
                  You&lsquo;re all caught up
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}
