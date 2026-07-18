import AppHeader from "@/components/common/AppHeader";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type PaymentMethod = {
  id: string;
  kind: "apple_pay" | "google_pay" | "paypal" | "card";
  name: string;
  subtitle: string;
  isDefault: boolean;
  brandColor: string;
  brandBg: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const MOCK_METHODS: PaymentMethod[] = [
  {
    id: "pm-1",
    kind: "apple_pay",
    name: "Apple Pay",
    subtitle: "Connected",
    isDefault: true,
    brandColor: "#fff",
    brandBg: "#161119",
    icon: "logo-apple",
  },
  {
    id: "pm-2",
    kind: "google_pay",
    name: "Google Pay",
    subtitle: "Connected",
    isDefault: false,
    brandColor: "#fff",
    brandBg: "#161119",
    icon: "logo-google",
  },
  {
    id: "pm-3",
    kind: "paypal",
    name: "PayPal",
    subtitle: "zara.mitchell@gmail.com",
    isDefault: false,
    brandColor: "#fff",
    brandBg: "#0F1A4D",
    icon: "logo-paypal",
  },
  {
    id: "pm-4",
    kind: "card",
    name: "Visa",
    subtitle: "•••• •••• •••• 4242 · Expires 09/28",
    isDefault: false,
    brandColor: "#fff",
    brandBg: "#1434CB",
    icon: "card",
  },
  {
    id: "pm-5",
    kind: "card",
    name: "Mastercard",
    subtitle: "•••• •••• •••• 8888 · Expires 03/27",
    isDefault: false,
    brandColor: "#fff",
    brandBg: "#161119",
    icon: "card",
  },
];

const MethodCard = ({
  method,
  onSetDefault,
  onEdit,
  onDelete,
}: {
  method: PaymentMethod;
  onSetDefault: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <View
    className="flex-row items-center bg-white rounded-[20px] p-4 mb-4"
    style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
  >
    <View
      className="items-center justify-center rounded-2xl mr-3"
      style={{ width: 44, height: 44, backgroundColor: method.brandBg }}
    >
      <Ionicons name={method.icon} size={18} color={method.brandColor} />
    </View>
    <View className="flex-1">
      <View className="flex-row items-center">
        <Text className="text-sm font-extrabold text-[#161119]">
          {method.name}
        </Text>
        {method.isDefault && (
          <View
            className="rounded-full px-2 py-0.5 ml-2"
            style={{ backgroundColor: "#FC6C8C" }}
          >
            <Text className="text-[10px] font-bold text-white">Default</Text>
          </View>
        )}
      </View>
      <Text className="text-xs text-[#8A8590] mt-0.5">{method.subtitle}</Text>
    </View>
    <View className="flex-row" style={{ gap: 6 }}>
      {!method.isDefault && (
        <TouchableOpacity
          onPress={onSetDefault}
          className="items-center justify-center rounded-full"
          style={{ width: 30, height: 30, backgroundColor: "#EAF7F3" }}
        >
          <Ionicons name="checkmark" size={14} color="#1A8073" />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={onEdit}
        className="items-center justify-center rounded-full"
        style={{ width: 30, height: 30, backgroundColor: "#FDEDF1" }}
      >
        <Ionicons name="pencil" size={13} color="#FC6C8C" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onDelete}
        className="items-center justify-center rounded-full"
        style={{ width: 30, height: 30, backgroundColor: "#FDEDF1" }}
      >
        <Ionicons name="trash" size={13} color="#FC6C8C" />
      </TouchableOpacity>
    </View>
  </View>
);

export default function PaymentMethodsScreen({
  methods: initial = MOCK_METHODS,
  onSetDefault,
  onDelete,
}: {
  methods?: PaymentMethod[];
  onSetDefault?: (id: string) => Promise<void> | void;
  onDelete?: (id: string) => Promise<void> | void;
}) {
  const [methods, setMethods] = useState(initial);
  const [deleteTarget, setDeleteTarget] = useState<PaymentMethod | null>(null);

  const handleSetDefault = async (method: PaymentMethod) => {
    setMethods((prev) =>
      prev.map((m) => ({ ...m, isDefault: m.id === method.id })),
    );
    if (onSetDefault) await onSetDefault(method.id);
    // TODO API: await setDefaultPaymentMethodMutation(method.id)
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setMethods((prev) => prev.filter((m) => m.id !== deleteTarget.id));
    if (onDelete) await onDelete(deleteTarget.id);
    // TODO API: await deletePaymentMethodMutation(deleteTarget.id)
    setDeleteTarget(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FBF9FC]">
      <AppHeader title="Payment Methods" />

      <FlatList
        data={methods}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: 30,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <MethodCard
            method={item}
            onSetDefault={() => handleSetDefault(item)}
            onEdit={() =>
              router.push({
                pathname: "/profile/add-card",
                params: { cardData: JSON.stringify(item) },
              })
            }
            onDelete={() => setDeleteTarget(item)}
          />
        )}
      />

      <View className="px-5 pb-5">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push("/profile/add-payment-method")}
          className="rounded-full overflow-hidden"
        >
          <LinearGradient
            colors={[COLORS.baseColor1, COLORS.baseColor2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="flex-row items-center justify-center py-4 rounded-full"
          >
            <Ionicons
              name="add"
              size={18}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text className="text-white text-base font-extrabold">
              Add Payment Method
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ConfirmationModal
        visible={!!deleteTarget}
        title="Remove Payment Method?"
        message={
          deleteTarget
            ? `Are you sure you want to remove "${deleteTarget.name}"? This can't be undone.`
            : ""
        }
        confirmText="Yes, Remove"
        cancelText="Keep It"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </SafeAreaView>
  );
}
