import BottomSheetModal from "@/components/common/BottomSheetModal";
import ModalHeader from "@/components/common/ModalHeader";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import GradientButton from "./GradientButton";
import { fetchAvailableMonth } from "./homeSearchApi";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface DateModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (dateISO: string, label: string) => void;
  initialDateISO?: string | null;
}

export default function DateModal({
  visible,
  onClose,
  onSelect,
  initialDateISO,
}: DateModalProps) {
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });
  const [loading, setLoading] = useState(true);
  const [minDateISO, setMinDateISO] = useState<string | undefined>(undefined);
  const [selected, setSelected] = useState<string | null>(
    initialDateISO ?? null,
  );

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    fetchAvailableMonth(cursor.year, cursor.month)
      .then((res) => setMinDateISO(res.disabledBefore))
      .finally(() => setLoading(false));
  }, [visible, cursor.year, cursor.month]);

  const days = useMemo(() => {
    const firstOfMonth = new Date(cursor.year, cursor.month, 1);
    const startOffset = firstOfMonth.getDay();
    const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();
    const cells: (number | null)[] = Array(startOffset).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [cursor]);

  const isoFor = (day: number) => {
    const m = String(cursor.month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${cursor.year}-${m}-${d}`;
  };

  const isPast = (iso: string) => (minDateISO ? iso < minDateISO : false);
  const isToday = (iso: string) => iso === today.toISOString().slice(0, 10);

  const goMonth = (delta: number) => {
    setCursor((prev) => {
      const next = new Date(prev.year, prev.month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  };

  const handleConfirm = () => {
    if (!selected) return;
    const d = new Date(`${selected}T00:00:00`);
    const label = `${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}`;
    onSelect(selected, label);
    onClose();
  };

  return (
    <BottomSheetModal visible={visible} onClose={onClose}>
      <ModalHeader title="Select Date" onClose={onClose} />

      <View className="flex-row items-center justify-between mb-4">
        <TouchableOpacity
          onPress={() => goMonth(-1)}
          className="w-8 h-8 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={18} color="#161119" />
        </TouchableOpacity>
        <Text className="text-base font-bold text-[#161119]">
          {MONTH_NAMES[cursor.month]} {cursor.year}
        </Text>
        <TouchableOpacity
          onPress={() => goMonth(1)}
          className="w-8 h-8 items-center justify-center"
        >
          <Ionicons name="chevron-forward" size={18} color="#161119" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="py-10 items-center">
          <ActivityIndicator color={COLORS.baseColor} />
        </View>
      ) : (
        <>
          <View className="flex-row mb-2">
            {WEEKDAYS.map((w, i) => (
              <View
                key={`${w}-${i}`}
                style={{ width: `${100 / 7}%` }}
                className="items-center"
              >
                <Text className="text-xs font-bold text-[#B7B2BC]">{w}</Text>
              </View>
            ))}
          </View>

          <View className="flex-row flex-wrap">
            {days.map((day, idx) => {
              if (day === null) {
                return (
                  <View
                    key={`empty-${idx}`}
                    style={{ width: `${100 / 7}%` }}
                    className="h-11"
                  />
                );
              }
              const iso = isoFor(day);
              const disabled = isPast(iso);
              const isSelected = selected === iso;
              return (
                <View
                  key={iso}
                  style={{ width: `${100 / 7}%` }}
                  className="h-11 items-center justify-center"
                >
                  <TouchableOpacity
                    disabled={disabled}
                    onPress={() => setSelected(iso)}
                    activeOpacity={0.7}
                    className="w-9 h-9 rounded-full items-center justify-center"
                    style={{
                      backgroundColor: isSelected
                        ? COLORS.baseColor
                        : "transparent",
                      borderWidth: isToday(iso) && !isSelected ? 1 : 0,
                      borderColor: COLORS.baseColor,
                    }}
                  >
                    <Text
                      className="text-sm"
                      style={{
                        color: disabled
                          ? "#D8D4DC"
                          : isSelected
                            ? "#FFFFFF"
                            : "#161119",
                        fontWeight: isSelected ? "700" : "400",
                      }}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </>
      )}

      <GradientButton
        label="Confirm"
        onPress={handleConfirm}
        disabled={!selected}
        style={{ marginTop: 20 }}
      />
    </BottomSheetModal>
  );
}
