import { COLORS } from "@/constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export function GradientSwitch({
  value,
  onValueChange,
}: {
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onValueChange(!value)}
      className={`h-7 w-12 rounded-full justify-center px-1 ${
        value ? "" : "bg-gray-200"
      }`}
    >
      {value ? (
        <LinearGradient
          colors={[COLORS.baseColor1, COLORS.baseColor2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="absolute inset-0 rounded-full"
          style={{ borderRadius: 999 }}
        />
      ) : null}

      <View
        className={`h-5 w-5 rounded-full bg-white shadow ${
          value ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </TouchableOpacity>
  );
}

export function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View className="flex-row items-center">
      <View
        className="mr-1.5 h-2 w-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      <Text className="text-[11px] text-gray-500">{label}</Text>
    </View>
  );
}

export function Chip({ label, active }: { label: string; active: boolean }) {
  return (
    <View
      className={`flex-row items-center rounded-full px-3 py-2 ${active ? "bg-emerald-50" : "bg-gray-100"}`}
    >
      <View
        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-gray-400"}`}
      />
      <Text
        className={`text-xs font-medium ${active ? "text-emerald-600" : "text-gray-400"}`}
      >
        {label}
      </Text>
    </View>
  );
}

export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between py-2">
      <Text className="text-[13px] text-gray-500">{label}</Text>
      <Text className="text-[13px] font-semibold text-emerald-500">
        {value}
      </Text>
    </View>
  );
}

// NOTE: kept for parity with the original screen — it was defined there but
// never actually rendered. Wire it up wherever a stat summary is needed, or
// delete it if it turns out to be genuinely dead.
export function SummaryCard({
  color,
  value,
  label,
  valueColor,
}: {
  color: string;
  value: string;
  label: string;
  valueColor: string;
}) {
  return (
    <View className={`mb-3 w-[48%] rounded-2xl ${color} px-4 py-4`}>
      <Text className={`text-2xl font-bold ${valueColor}`}>{value}</Text>
      <Text className="mt-1 text-xs text-gray-500">{label}</Text>
    </View>
  );
}
