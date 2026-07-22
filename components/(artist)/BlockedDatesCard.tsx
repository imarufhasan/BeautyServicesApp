import { BlockedDate } from "@/constants/availability";
import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface BlockedDatesCardProps {
  blockedDates: BlockedDate[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onEdit?: (id: string) => void;
}

export default function BlockedDatesCard({
  blockedDates,
  onAdd,
  onRemove,
  onEdit,
}: BlockedDatesCardProps) {
  return (
    <View
      className="rounded-3xl bg-white p-4 shadow-sm mb-5"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      }}
    >
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-base font-bold text-gray-900">
            Blocked Dates
          </Text>
          <Text className="text-xs text-gray-400">
            {blockedDates.length} dates blocked
          </Text>
        </View>
        <TouchableOpacity
          onPress={onAdd}
          className="flex-row items-center rounded-full bg-rose-50 px-3 py-1.5"
        >
          <Feather name="plus" size={12} color="#FB7185" />
          <Text className="ml-1 text-xs font-semibold text-rose-500">
            Add Date
          </Text>
        </TouchableOpacity>
      </View>
      {blockedDates.map((bd) => (
        <View
          key={bd.id}
          className="mt-3 flex-row items-center justify-between rounded-2xl bg-rose-50/60 px-4 py-3"
        >
          <View className="flex-row items-center flex-1 pr-2">
            <View className="h-8 w-8 items-center justify-center rounded-full bg-rose-100">
              <Ionicons name="ban-outline" size={14} color="#FB7185" />
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-sm font-semibold text-gray-800">
                {bd.label}
              </Text>
              <Text className="text-xs text-gray-400" numberOfLines={1}>
                {bd.reason}
              </Text>
            </View>
          </View>
          <View className="flex-row" style={{ gap: 14 }}>
            <TouchableOpacity onPress={() => onEdit?.(bd.id)}>
              <Feather name="edit-2" size={15} color="#FB923C" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onRemove(bd.id)}>
              <Feather name="trash-2" size={15} color="#FB7185" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}
