import AppHeader from "@/components/common/AppHeader";
import GradientActionButton from "@/components/common/GradientActionButton";
import Stars from "@/components/common/Stars";
import { COLORS } from "@/constants/colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ---------------------------------------------
// Types
// ---------------------------------------------
type BookingUpdateType = "rescheduled" | "cancelled" | "confirmed";
type ScheduleAction = "accept" | "decline";

interface BookingUpdateApiResponse {
  bookingId: string;
  artist: {
    name: string;
    avatar: string;
    rating: number;
    reviews: number;
    verified: boolean;
  };
  service: string;
  date: string;
  time: string;
  location: string;
  visitType: string;
  duration: string;
  paymentMethod: string;
  totalAmount: string;
  updatedAgo: string;

  // reschedule-only
  previousDate?: string;
  previousTime?: string;
  newDate?: string;
  newTime?: string;
  reason?: string;
  optionalMessage?: string;

  // artist message (reschedule + cancelled)
  artistMessage?: string;

  // payment info (cancelled + confirmed)
  payment?: {
    cardLabel: string;
    status: "Paid" | "Refunded" | "Pending";
    refundStatus?: string;
    walletCredit?: string;
    estRefundDate?: string;
    transactionId: string;
  };

  // timeline (cancelled)
  timeline?: {
    label: string;
    date: string;
    state: "done" | "cancelled" | "pending";
    badge?: string;
  }[];
}

// ---------------------------------------------
// Dummy API response — swap with RTK Query later
// e.g. useGetBookingUpdateQuery(id)
// ---------------------------------------------
const DUMMY_DATA: BookingUpdateApiResponse = {
  bookingId: "BK-2024-8821",
  artist: {
    name: "Sophia Laurent",
    avatar: "https://i.pravatar.cc/150?img=47",
    rating: 4.97,
    reviews: 312,
    verified: true,
  },
  service: "Bridal Glam Makeup",
  date: "Saturday, 14 Dec 2024",
  time: "10:00 AM",
  location: "23 Rosewood Ave, Chelsea",
  visitType: "Home Visit",
  duration: "3 Hours",
  paymentMethod: "Visa •••• 4291",
  totalAmount: "$185.00",
  updatedAgo: "2 minutes ago",

  previousDate: "Saturday, 14 Dec 2024",
  previousTime: "10:00 AM",
  newDate: "Sunday, 15 Dec 2024",
  newTime: "12:00 PM",
  reason: "Schedule Conflict",
  optionalMessage:
    "Artist has a prior commitment overlap on the original date.",

  artistMessage:
    "I'm truly sorry for the inconvenience. I have an unexpected schedule conflict and would love to keep your appointment — I've proposed a new time that works perfectly for the look we planned. Thank you so much for your patience!",

  payment: {
    cardLabel: "Visa •••• 4291",
    status: "Paid",
    refundStatus: "Initiated",
    walletCredit: "$15.00",
    estRefundDate: "Dec 18, 2024",
    transactionId: "TXN-7731-FFCC-0029",
  },

  timeline: [
    {
      label: "Booking Requested",
      date: "Dec 10, 2024 · 9:42 AM",
      state: "done",
    },
    {
      label: "Artist Accepted",
      date: "Dec 10, 2024 · 11:15 AM",
      state: "done",
    },
    {
      label: "Artist Cancelled",
      date: "Dec 13, 2024 · 2:10 PM",
      state: "cancelled",
      badge: "Update",
    },
    {
      label: "Awaiting Your Next Action",
      date: "",
      state: "pending",
      badge: "Awaiting Response",
    },
  ],
};

const CANCELLED_ARTIST_MESSAGE =
  "I sincerely apologize for having to cancel your appointment. A personal emergency has come up and I am unable to make it. I've ensured your refund is processed immediately. I hope we can work together in the future. 💗";

// ---------------------------------------------
// Status configuration per type
// NOTE: badgeBg is a raw HEX color (used via `style`, NOT `className`).
// Passing hex strings into a NativeWind `className` string does nothing —
// that was the bug in the last version (rescheduled/confirmed badges had
// no visible background). Keeping it as a plain hex value + style prop
// fixes it and stays consistent with cardGradient/iconGradient below.
// ---------------------------------------------
const STATUS_CONFIG: Record<
  BookingUpdateType,
  {
    badgeLabel: string;
    badgeDotColor: string;
    badgeBg: string; // hex
    badgeText: string; // tailwind text color class — fine, text-* classes work normally
    cardGradient: [string, string];
    iconGradient: [string, string];
    icon: React.ReactNode;
    title: string;
    description: string;
  }
> = {
  rescheduled: {
    badgeLabel: "Rescheduled",
    badgeDotColor: "#F59E0B",
    badgeBg: "#FFE4C8",
    badgeText: "text-orange-500",
    cardGradient: ["#FFE4C8", "#FFFEFE"],
    iconGradient: ["#FB923C", "#F59E0B"],
    icon: <Feather name="calendar" size={24} color="#FFFFFF" />,
    title: "Artist Rescheduled Your Booking",
    description:
      "Sophia has proposed a new date and time for your appointment. Please review the changes below and respond at your earliest convenience.",
  },
  cancelled: {
    badgeLabel: "Cancelled",
    badgeDotColor: "#EF4444",
    badgeBg: "#FEE2E2",
    badgeText: "text-red-500",
    cardGradient: ["#FDCDD5", "#FFFEFE"],
    iconGradient: ["#F472B6", "#FB923C"],
    icon: <Feather name="alert-triangle" size={24} color="#FFFFFF" />,
    title: "Artist Cancelled Your Booking",
    description:
      "We're sorry to inform you that Sophia has cancelled your appointment. You're entitled to a full refund and we'll help you find an alternative.",
  },
  confirmed: {
    badgeLabel: "Confirmed",
    badgeDotColor: "#22C55E",
    badgeBg: "#DCFCE7",
    badgeText: "text-green-600",
    cardGradient: ["#D3DDD2", "#FFFEFE"],
    iconGradient: ["#89C08B", "#89C08B"],
    icon: <Ionicons name="checkmark" size={26} color="#FFFFFF" />,
    title: "Your Appointment is Confirmed",
    description:
      "Your booking has been confirmed successfully. The artist is looking forward to seeing you at your scheduled date and time.",
  },
};

// ---------------------------------------------
// Confirmation modal config per action
// ---------------------------------------------
const SCHEDULE_ACTION_CONFIG: Record<
  ScheduleAction,
  {
    iconGradient: [string, string];
    icon: React.ReactNode;
    title: string;
    message: string;
    confirmLabel: string;
    confirmIsGradient: boolean;
    confirmColor?: string;
  }
> = {
  accept: {
    iconGradient: [COLORS.baseColor1, COLORS.baseColor2],
    icon: <Ionicons name="checkmark" size={24} color="#FFFFFF" />,
    title: "Accept New Schedule?",
    message:
      "You're about to confirm the new date and time proposed by Sophia. This will update your booking.",
    confirmLabel: "Yes, Accept",
    confirmIsGradient: true,
  },
  decline: {
    iconGradient: [COLORS.baseColor1, COLORS.baseColor2],
    icon: <Feather name="x" size={22} color="#FFFFFF" />,
    title: "Decline New Schedule?",
    message:
      "This will decline the proposed reschedule. Your original booking may be cancelled — this can't be undone.",
    confirmLabel: "Yes, Decline",
    confirmIsGradient: false,
  },
};

// ---------------------------------------------
// Small shared UI pieces
// ---------------------------------------------
const SectionLabel = ({ children }: { children: string }) => (
  <Text className="text-[11px] font-semibold text-gray-400 tracking-wider mb-2 ml-1">
    {children.toUpperCase()}
  </Text>
);

const InfoRow = ({
  label,
  value,
  valueClassName,
  last,
}: {
  label: string;
  value: string;
  valueClassName?: string;
  last?: boolean;
}) => (
  <View
    className={`flex-row items-center justify-between py-3 ${
      last ? "" : "border-b border-gray-100"
    }`}
  >
    <Text className="text-[13px] text-gray-400">{label}</Text>
    <Text
      className={`text-[13px] font-medium text-gray-900 text-right ml-4 flex-shrink ${
        valueClassName ?? ""
      }`}
    >
      {value}
    </Text>
  </View>
);

const OutlineButton = ({
  label,
  onPress,
  color = "#EC4899",
}: {
  label: string;
  onPress: () => void;
  color?: string;
}) => (
  <Pressable
    onPress={onPress}
    style={{ borderColor: color }}
    className="items-center justify-center py-4 px-6 rounded-full border mt-3"
  >
    <Text style={{ color }} className="font-semibold text-[15px]">
      {label}
    </Text>
  </Pressable>
);

// ---------------------------------------------
// Confirmation Modal (used by Accept / Decline)
// ---------------------------------------------
const ScheduleConfirmationModal = ({
  action,
  visible,
  onCancel,
  onConfirm,
}: {
  action: ScheduleAction | null;
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) => {
  if (!action) return null;
  const config = SCHEDULE_ACTION_CONFIG[action];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <View className="flex-1 bg-black/40 items-center justify-center px-6">
        <View className="w-full bg-white rounded-3xl p-6 items-center">
          <LinearGradient
            colors={config.iconGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 999 }}
            className="w-14 h-14 items-center justify-center mb-4"
          >
            {config.icon}
          </LinearGradient>

          <Text className="text-[17px] font-bold text-gray-900 text-center">
            {config.title}
          </Text>

          <Text className="text-[13px] text-gray-500 text-center leading-[19px] mt-2">
            {config.message}
          </Text>

          <View className="w-full mt-6">
            {/* {config.confirmIsGradient ? (
              <GradientActionButton
                title={config.confirmLabel}
                icon={<Ionicons name="checkmark" size={17} color="#FFFFFF" />}
                onPress={onConfirm}
              />
            ) : (
              <Pressable
                onPress={onConfirm}
                style={{ backgroundColor: config.confirmColor }}
                className="items-center justify-center py-4 px-6 rounded-full"
              >
                <Text className="text-white font-semibold text-[15px]">
                  {config.confirmLabel}
                </Text>
              </Pressable>
            )} */}
            <GradientActionButton
              title={config.confirmLabel}
              icon={<Ionicons name="checkmark" size={17} color="#FFFFFF" />}
              onPress={onConfirm}
            />

            <Pressable
              onPress={onCancel}
              className="items-center justify-center py-4 px-6 rounded-full border border-gray-200 mt-3"
            >
              <Text className="text-gray-500 font-semibold text-[15px]">
                Go Back
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ---------------------------------------------
// Status Card (top hero card)
// ---------------------------------------------
const StatusCard = ({
  type,
  updatedAgo,
}: {
  type: BookingUpdateType;
  updatedAgo: string;
}) => {
  const config = STATUS_CONFIG[type];

  return (
    <LinearGradient
      colors={config.cardGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ borderRadius: 24, borderColor: "white", borderWidth: 2 }}
      className="p-5 mb-5"
    >
      <View className="flex-row items-start">
        <LinearGradient
          colors={config.iconGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 16 }}
          className="w-14 h-14 items-center justify-center mr-3"
        >
          {config.icon}
        </LinearGradient>

        <View className="flex-1">
          <View
            style={{ backgroundColor: config.badgeBg }}
            className="self-start flex-row items-center px-2.5 py-1 rounded-full"
          >
            <View
              style={{ backgroundColor: config.badgeDotColor }}
              className="w-1.5 h-1.5 rounded-full mr-1.5"
            />
            <Text className={`text-[11px] font-semibold ${config.badgeText}`}>
              {config.badgeLabel}
            </Text>
          </View>

          <Text className="text-[17px] font-bold text-gray-900 mt-2 leading-[22px]">
            {config.title}
          </Text>

          <View className="flex-row items-center mt-1">
            <Feather name="clock" size={11} color="#9CA3AF" />
            <Text className="text-[11px] text-gray-400 ml-1">
              Updated {updatedAgo}
            </Text>
          </View>
        </View>
      </View>

      <Text className="text-[13px] text-gray-600 leading-[19px] mt-3">
        {config.description}
      </Text>
    </LinearGradient>
  );
};

// ---------------------------------------------
// Booking Summary
// ---------------------------------------------
const BookingSummary = ({ data }: { data: BookingUpdateApiResponse }) => (
  <View className="mb-5">
    <SectionLabel>Booking Summary</SectionLabel>
    <View className="bg-white rounded-2xl p-4 shadow-sm shadow-black/5 border border-gray-100">
      <View className="flex-row items-center justify-between pb-3 border-b border-gray-100">
        <View className="flex-row items-center flex-1">
          <View>
            <Image
              source={{ uri: data.artist.avatar }}
              className="w-11 h-11 rounded-full"
            />
            {data.artist.verified && (
              <View className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white" />
            )}
          </View>

          <View className="ml-3 flex-1">
            <View className="flex-row items-center">
              <Text className="text-[14px] font-semibold text-gray-900">
                {data.artist.name}
              </Text>
              <Ionicons
                name="shield-checkmark"
                size={13}
                color="#EC4899"
                style={{ marginLeft: 4 }}
              />
            </View>
            <View className="flex-row items-center mt-0.5">
              <Stars rating={data.artist.rating} size={10} />
              <Text className="text-[11px] text-gray-500 ml-1">
                ({data.artist.reviews} reviews)
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-green-50 rounded-full px-2.5 py-1">
          <Text className="text-[11px] font-medium text-green-600">
            Verified
          </Text>
        </View>
      </View>

      <InfoRow
        label="Booking ID"
        value={data.bookingId}
        valueClassName="text-pink-500 font-semibold"
      />
      <InfoRow label="Service" value={data.service} />
      <InfoRow label="Date" value={data.date} />
      <InfoRow label="Time" value={data.time} />
      <InfoRow label="Location" value={data.location} />
      <InfoRow label="Visit Type" value={data.visitType} />
      <InfoRow label="Duration" value={data.duration} />
      <InfoRow label="Payment Method" value={data.paymentMethod} />
      <InfoRow
        label="Total Amount"
        value={data.totalAmount}
        valueClassName="text-[15px] font-bold"
        last
      />
    </View>
  </View>
);

// ---------------------------------------------
// Update Details (reschedule only)
// ---------------------------------------------
const UpdateDetails = ({ data }: { data: BookingUpdateApiResponse }) => (
  <View className="mb-5">
    <SectionLabel>Update Details</SectionLabel>
    <View className="bg-white rounded-2xl p-4 shadow-sm shadow-black/5 border border-gray-100">
      <View className="flex-row" style={{ gap: 10 }}>
        <View className="flex-1 bg-red-50 rounded-xl p-3">
          <Text className="text-[10px] font-semibold text-red-400 tracking-wide">
            PREVIOUS
          </Text>
          <Text className="text-lg font-bold text-gray-900 mt-1">
            {data.previousDate}
          </Text>
          <Text className="text-[12px] text-gray-500 mt-0.5">
            {data.previousTime}
          </Text>
        </View>

        <View className="flex-1 bg-green-50 rounded-xl p-3">
          <Text className="text-[10px] font-semibold text-green-500 tracking-wide">
            NEW DATE
          </Text>
          <Text className="text-lg font-bold text-gray-900 mt-1">
            {data.newDate}
          </Text>
          <Text className="text-[12px] text-gray-500 mt-0.5">
            {data.newTime}
          </Text>
        </View>
      </View>

      <View className="items-center my-3">
        <LinearGradient
          colors={[COLORS.baseColor1, COLORS.baseColor2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 999 }}
          className="w-9 h-9 items-center justify-center"
        >
          <Feather name="arrow-down" size={16} color="#FFFFFF" />
        </LinearGradient>
      </View>

      <InfoRow label="Reason Provided" value={data.reason ?? ""} last />

      <Text className="text-[11px] text-gray-400 mt-3 mb-1.5">
        Optional Message
      </Text>
      <View className="bg-purple-50 rounded-xl p-3">
        <Text className="text-[13px] text-gray-600 leading-[18px]">
          {data.optionalMessage}
        </Text>
      </View>
    </View>
  </View>
);

// ---------------------------------------------
// Message From Artist (reschedule + cancelled)
// ---------------------------------------------
const MessageFromArtist = ({
  name,
  avatar,
  message,
}: {
  name: string;
  avatar: string;
  message: string;
}) => (
  <View className="mb-5">
    <SectionLabel>Message From Artist</SectionLabel>
    <View className="bg-white rounded-2xl p-4 shadow-sm shadow-black/5 border border-gray-100">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <Image source={{ uri: avatar }} className="w-9 h-9 rounded-full" />
          <View className="ml-2.5">
            <Text className="text-[13px] font-semibold text-gray-900">
              {name}
            </Text>
            <Text className="text-[11px] text-gray-400">
              Beauty Artist · Verified
            </Text>
          </View>
        </View>
        <Ionicons name="shield-checkmark-outline" size={16} color="#EC4899" />
      </View>

      <View className="bg-gray-50 rounded-xl p-3">
        <Text className="text-[13px] text-gray-600 leading-[19px]">
          {message}
        </Text>
      </View>

      <Pressable className="flex-row items-center justify-center mt-3">
        <Feather name="message-circle" size={14} color="#6B7280" />
        <Text className="text-[12px] font-medium text-gray-500 ml-1.5">
          Reply to Artist
        </Text>
      </Pressable>
    </View>
  </View>
);

// ---------------------------------------------
// Payment Information (cancelled + confirmed)
// ---------------------------------------------
const PaymentInformation = ({
  payment,
}: {
  payment: NonNullable<BookingUpdateApiResponse["payment"]>;
}) => (
  <View className="mb-5">
    <SectionLabel>Payment Information</SectionLabel>
    <View className="bg-white rounded-2xl p-4 shadow-sm shadow-black/5 border border-gray-100">
      <View className="flex-row items-center justify-between pb-3 border-b border-gray-100">
        <View className="flex-row items-center flex-1">
          <LinearGradient
            colors={["#F472B6", "#FB923C"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 12 }}
            className="w-10 h-10 items-center justify-center mr-3"
          >
            <Feather name="credit-card" size={16} color="#FFFFFF" />
          </LinearGradient>
          <View>
            <Text className="text-[13px] font-semibold text-gray-900">
              {payment.cardLabel}
            </Text>
            <Text className="text-[11px] text-gray-400">
              Original payment method
            </Text>
          </View>
        </View>
        <View className="bg-green-50 rounded-full px-2.5 py-1">
          <Text className="text-[11px] font-medium text-green-600">
            {payment.status}
          </Text>
        </View>
      </View>

      <InfoRow
        label="Payment Status"
        value={payment.status}
        valueClassName="text-green-600 font-semibold"
      />
      {payment.refundStatus && (
        <InfoRow
          label="Refund Status"
          value={payment.refundStatus}
          valueClassName="text-orange-500 font-semibold"
        />
      )}
      {payment.walletCredit && (
        <InfoRow label="Wallet Credit" value={payment.walletCredit} />
      )}
      {payment.estRefundDate && (
        <InfoRow label="Est. Refund Date" value={payment.estRefundDate} />
      )}
      <InfoRow label="Transaction ID" value={payment.transactionId} last />

      <Pressable className="flex-row items-center justify-center mt-3 py-3.5 rounded-full border border-pink-200">
        <Feather name="file-text" size={14} color="#EC4899" />
        <Text className="text-[13px] font-medium text-pink-500 ml-2 mr-1">
          View Receipt
        </Text>
        <Feather name="chevron-right" size={14} color="#EC4899" />
      </Pressable>
    </View>
  </View>
);

// ---------------------------------------------
// Booking Timeline (cancelled only)
// ---------------------------------------------
const TIMELINE_ICON: Record<
  string,
  { gradient: [string, string]; icon: React.ReactNode }
> = {
  done_1: {
    gradient: [COLORS.baseColor1, COLORS.baseColor2],
    icon: <Feather name="calendar" size={14} color="#FFFFFF" />,
  },

  done_2: {
    gradient: [COLORS.baseColor1, COLORS.baseColor2],
    icon: <Ionicons name="checkmark" size={15} color="#FFFFFF" />,
  },

  cancelled: {
    gradient: [COLORS.baseColor1, COLORS.baseColor2],
    icon: <Ionicons name="close" size={15} color="#FFFFFF" />,
  },

  pending: {
    gradient: ["#E5E7EB", "#E5E7EB"],
    icon: <Feather name="clock" size={13} color="#FFFFFF" />,
  },
};

const BookingTimeline = ({
  items,
}: {
  items: NonNullable<BookingUpdateApiResponse["timeline"]>;
}) => (
  <View className="mb-5">
    <SectionLabel>Booking Timeline</SectionLabel>
    <View className="bg-white rounded-2xl p-4 shadow-sm shadow-black/5 border border-gray-100">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const key =
          item.state === "done"
            ? index === 0
              ? "done_1"
              : "done_2"
            : item.state;
        const cfg = TIMELINE_ICON[key];
        const isPending = item.state === "pending";

        return (
          <View key={item.label} className="flex-row">
            <View className="items-center mr-3" style={{ width: 28 }}>
              <LinearGradient
                colors={cfg.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 999 }}
                className="w-7 h-7 items-center justify-center"
              >
                {cfg.icon}
              </LinearGradient>
              {!isLast && (
                <View
                  style={{
                    backgroundColor:
                      item.state === "cancelled" ? "#E5E7EB" : "#86EFAC",
                  }}
                  className="w-0.5 flex-1 my-1"
                />
              )}
            </View>

            <View className={`flex-1 ${isLast ? "" : "pb-4"}`}>
              <Text
                className={`text-[13px] font-semibold ${
                  item.state === "cancelled"
                    ? "text-red-500"
                    : isPending
                      ? "text-gray-400"
                      : "text-gray-900"
                }`}
              >
                {item.label}
              </Text>
              {!!item.date && (
                <Text className="text-[11px] text-gray-400 mt-0.5">
                  {item.date}
                </Text>
              )}
              {item.badge && (
                <View
                  className={`self-start rounded-full px-2 py-0.5 mt-1.5 ${
                    item.state === "cancelled" ? "bg-pink-100" : "bg-orange-100"
                  }`}
                >
                  <Text
                    className={`text-[10px] font-medium ${
                      item.state === "cancelled"
                        ? "text-pink-500"
                        : "text-orange-500"
                    }`}
                  >
                    {item.badge}
                  </Text>
                </View>
              )}
            </View>
          </View>
        );
      })}
    </View>
  </View>
);

// ---------------------------------------------
// Available Actions (varies by type)
// ---------------------------------------------
const AvailableActions = ({ type }: { type: BookingUpdateType }) => {
  // holds which action is pending confirmation ("accept" | "decline" | null)
  const [pendingAction, setPendingAction] = useState<ScheduleAction | null>(
    null,
  );

  const handleConfirm = () => {
    if (pendingAction === "accept") {
      console.log("accept new schedule — confirmed");
      // TODO: call acceptRescheduleMutation(bookingId)
    } else if (pendingAction === "decline") {
      console.log("decline new schedule — confirmed");
      // TODO: call declineRescheduleMutation(bookingId)
    }
    setPendingAction(null);
  };

  if (type === "rescheduled") {
    return (
      <>
        <View className="mb-6">
          <SectionLabel>Available Actions</SectionLabel>
          <GradientActionButton
            title="Accept New Schedule"
            icon={<Ionicons name="checkmark" size={17} color="#FFFFFF" />}
            onPress={() => {
              setPendingAction("accept");
              router.back();
            }}
          />
          <OutlineButton
            label="Decline"
            onPress={() => {
              setPendingAction("decline");
              router.back();
            }}
          />
        </View>

        <ScheduleConfirmationModal
          action={pendingAction}
          visible={pendingAction !== null}
          onCancel={() => setPendingAction(null)}
          onConfirm={handleConfirm}
        />
      </>
    );
  }

  if (type === "cancelled") {
    return (
      <View className="mb-6">
        <SectionLabel>Available Actions</SectionLabel>
        <GradientActionButton
          title="Find Similar Artists"
          icon={<Feather name="search" size={16} color="#FFFFFF" />}
          onPress={() => console.log("find similar artists")}
        />
        <Pressable
          className="flex-row items-center justify-center mt-4"
          onPress={() => {
            router.push({
              pathname: "/(customer)/contact-support",
              params: { bookingId: "A123" },
            });
          }}
        >
          <Feather name="headphones" size={14} color="#6B7280" />
          <Text className="text-[13px] font-medium text-gray-500 ml-2">
            Contact Support
          </Text>
        </Pressable>
      </View>
    );
  }

  // confirmed — no extra action buttons in this flow
  return null;
};

// ---------------------------------------------
// Main Screen
// ---------------------------------------------
export default function BookingUpdateScreen() {
  const params = useLocalSearchParams<{ type?: string; id?: string }>();
  const type: BookingUpdateType =
    (params.type as BookingUpdateType) &&
    ["rescheduled", "cancelled", "confirmed"].includes(params.type as string)
      ? (params.type as BookingUpdateType)
      : "confirmed";

  const data = DUMMY_DATA; // swap with useGetBookingUpdateQuery(params.id)

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />

      <AppHeader title="Booking Update" />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <StatusCard type={type} updatedAgo={data.updatedAgo} />

        <BookingSummary data={data} />

        {type === "rescheduled" && <UpdateDetails data={data} />}

        {type === "rescheduled" && (
          <MessageFromArtist
            name={data.artist.name}
            avatar={data.artist.avatar}
            message={data.artistMessage ?? ""}
          />
        )}

        {type === "cancelled" && (
          <MessageFromArtist
            name={data.artist.name}
            avatar={data.artist.avatar}
            message={CANCELLED_ARTIST_MESSAGE}
          />
        )}

        {(type === "cancelled" || type === "confirmed") && data.payment && (
          <PaymentInformation payment={data.payment} />
        )}

        {type === "cancelled" && data.timeline && (
          <BookingTimeline items={data.timeline} />
        )}

        <AvailableActions type={type} />
      </ScrollView>
    </SafeAreaView>
  );
}
