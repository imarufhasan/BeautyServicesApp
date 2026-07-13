import BottomSheetModal from "@/components/common/BottomSheetModal";
import ModalHeader from "@/components/common/ModalHeader";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import GradientButton from "./GradientButton";
import { fetchServices, ServiceOption } from "./homeSearchApi";

interface ServiceModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (service: ServiceOption) => void;
}

export default function ServiceModal({
  visible,
  onClose,
  onSelect,
}: ServiceModalProps) {
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    fetchServices()
      .then(setServices)
      .finally(() => setLoading(false));
  }, [visible]);

  const handleConfirm = () => {
    const service = services.find((s) => s.id === selectedId);
    if (!service) return;
    onSelect(service);
    onClose();
  };

  return (
    <BottomSheetModal visible={visible} onClose={onClose}>
      <ModalHeader title="Select Service" onClose={onClose} />

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
            const isSelected = selectedId === item.id;
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setSelectedId(item.id)}
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

      {/* <ConfirmButton
        label="Confirm"
        onPress={handleConfirm}
        disabled={!selectedId}
      /> */}
      <GradientButton
        label="Confirm"
        onPress={handleConfirm}
        disabled={!selectedId}
        style={{ marginTop: 20 }}
      />
    </BottomSheetModal>
  );
}
