import BottomSheetModal from "@/components/common/BottomSheetModal";
import ModalHeader from "@/components/common/ModalHeader";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import GradientButton from "./GradientButton";
import { fetchServices, ServiceOption } from "./homeSearchApi";

interface ServiceModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (services: ServiceOption[]) => void;
  initialSelected?: ServiceOption[];
}

export default function ServiceModal({
  visible,
  onClose,
  onSelect,
  initialSelected = [],
}: ServiceModalProps) {
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (!visible) return;
    setSelectedIds(initialSelected.map((s) => s.id));
    setLoading(true);
    fetchServices()
      .then(setServices)
      .finally(() => setLoading(false));
  }, [visible]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const selectedServices = services.filter((s) => selectedIds.includes(s.id));

  const handleConfirm = () => {
    onSelect(selectedServices);
    onClose();
  };

  return (
    <BottomSheetModal visible={visible} onClose={onClose}>
      <ModalHeader title="Select Service" onClose={onClose} />

      {/* Selected chips row */}
      {selectedServices.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
          style={{ marginBottom: 6 }}
        >
          {selectedServices.map((s) => (
            <View
              key={s.id}
              className="flex-row items-center rounded-full px-3 py-1.5 mr-2"
              style={{ backgroundColor: "#FDE7EE" }}
            >
              <Text
                className="text-xs font-semibold mr-1.5"
                style={{ color: "#E0507F" }}
              >
                {s.name}
              </Text>
              <TouchableOpacity onPress={() => toggleSelect(s.id)}>
                <Ionicons name="close-circle" size={15} color="#E0507F" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {loading ? (
        <View className="py-10 items-center">
          <ActivityIndicator color={COLORS.baseColor} />
        </View>
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          style={{ maxHeight: 380 }}
          renderItem={({ item }) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => toggleSelect(item.id)}
                className="flex-row items-center justify-between py-3.5 px-3 rounded-2xl mb-1"
                style={{
                  backgroundColor: isSelected ? "#FDE7EE" : "transparent",
                }}
              >
                <Text
                  className="text-sm font-semibold"
                  style={{ color: isSelected ? "#E0507F" : "#161119" }}
                >
                  {item.name}
                </Text>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={18} color="#E0507F" />
                )}
              </TouchableOpacity>
            );
          }}
        />
      )}

      <GradientButton
        label={
          selectedIds.length ? `Confirm (${selectedIds.length})` : "Confirm"
        }
        onPress={handleConfirm}
        disabled={!selectedIds.length}
        style={{ marginTop: 20 }}
      />
    </BottomSheetModal>
  );
}
