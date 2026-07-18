import AppHeader from "@/components/common/AppHeader";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type SavedAddress = {
  id: string;
  type: "home" | "work" | "other";
  label: string;
  line: string;
  isDefault: boolean;
};

const TYPE_ICON: Record<SavedAddress["type"], keyof typeof Ionicons.glyphMap> =
  {
    home: "home",
    work: "briefcase",
    other: "location",
  };

const MOCK_ADDRESSES: SavedAddress[] = [
  {
    id: "addr-1",
    type: "home",
    label: "Home",
    line: "42 Bondi Road, Bondi Beach NSW 2026",
    isDefault: true,
  },
  {
    id: "addr-2",
    type: "work",
    label: "Work",
    line: "Level 8, 1 Market Street, Sydney CBD NSW 2000",
    isDefault: false,
  },
  {
    id: "addr-3",
    type: "other",
    label: "Mum's Place",
    line: "15 Chapel Street, South Yarra VIC 3141",
    isDefault: false,
  },
];

const AddressCard = ({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: {
  address: SavedAddress;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}) => (
  <View
    className="flex-row bg-white rounded-[20px] p-4 mb-4"
    style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
  >
    <View
      className="items-center justify-center rounded-2xl mr-3"
      style={{ width: 44, height: 44, backgroundColor: "#FDEDF1" }}
    >
      <Ionicons name={TYPE_ICON[address.type]} size={18} color="#FC6C8C" />
    </View>
    <View className="flex-1">
      <View className="flex-row items-center">
        <Text className="text-sm font-extrabold text-[#161119]">
          {address.label}
        </Text>
        {address.isDefault && (
          <View
            className="rounded-full px-2 py-0.5 ml-2 overflow-hidden"
            style={{ backgroundColor: "#FC6C8C" }}
          >
            <Text className="text-[10px] font-bold text-white">Default</Text>
          </View>
        )}
      </View>
      <Text
        className="text-xs text-[#8A8590] mt-1 leading-4"
        style={{ maxWidth: "90%" }}
      >
        {address.line}
      </Text>
      {!address.isDefault && (
        <TouchableOpacity onPress={onSetDefault} className="mt-1.5">
          <Text className="text-[11px] font-bold" style={{ color: "#FC6C8C" }}>
            Set as default
          </Text>
        </TouchableOpacity>
      )}
    </View>
    <View className="items-center justify-center" style={{ gap: 8 }}>
      <TouchableOpacity
        onPress={onEdit}
        className="items-center justify-center rounded-full"
        style={{ width: 32, height: 32, backgroundColor: "#FDEDF1" }}
      >
        <Ionicons name="pencil" size={13} color="#FC6C8C" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onDelete}
        className="items-center justify-center rounded-full"
        style={{ width: 32, height: 32, backgroundColor: "#FDEDF1" }}
      >
        <Ionicons name="trash" size={13} color="#FC6C8C" />
      </TouchableOpacity>
    </View>
  </View>
);

export default function SavedAddressesScreen({
  addresses: initial = MOCK_ADDRESSES,
  onDelete,
  onSetDefault,
}: {
  addresses?: SavedAddress[];
  onDelete?: (id: string) => Promise<void> | void;
  onSetDefault?: (id: string) => Promise<void> | void;
}) {
  const [addresses, setAddresses] = useState(initial);
  const [deleteTarget, setDeleteTarget] = useState<SavedAddress | null>(null);

  const handleEdit = (address: SavedAddress) => {
    router.push({
      pathname: "/profile/add-address",
      params: { addressData: JSON.stringify(address) },
    });
  };

  const handleSetDefault = async (address: SavedAddress) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === address.id })),
    );
    if (onSetDefault) await onSetDefault(address.id);
    // TODO API: await setDefaultAddressMutation(address.id)
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setAddresses((prev) => prev.filter((a) => a.id !== deleteTarget.id));
    if (onDelete) await onDelete(deleteTarget.id);
    // TODO API: await deleteAddressMutation(deleteTarget.id)
    setDeleteTarget(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FBF9FC]">
      <AppHeader title="Saved Addresses" />

      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: 30,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <AddressCard
            address={item}
            onEdit={() => handleEdit(item)}
            onDelete={() => setDeleteTarget(item)}
            onSetDefault={() => handleSetDefault(item)}
          />
        )}
        ListEmptyComponent={
          <View className="items-center justify-center mt-20">
            <Ionicons name="location-outline" size={36} color="#D9D3E0" />
            <Text className="text-sm text-[#8A8590] mt-3">
              No saved addresses yet.
            </Text>
          </View>
        }
      />

      <View className="px-5 pb-5">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push("/profile/add-address")}
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
              Add New Address
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ConfirmationModal
        visible={!!deleteTarget}
        title="Delete Address?"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.label}"? This can't be undone.`
            : ""
        }
        confirmText="Yes, Delete"
        cancelText="Keep It"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </SafeAreaView>
  );
}
