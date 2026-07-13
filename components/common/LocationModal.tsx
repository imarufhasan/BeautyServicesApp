import BottomSheetModal from "@/components/common/BottomSheetModal";
import ModalHeader from "@/components/common/ModalHeader";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchLocations, LocationOption } from "./homeSearchApi";

interface LocationModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (location: LocationOption) => void;
}

export default function LocationModal({
  visible,
  onClose,
  onSelect,
}: LocationModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    // small debounce so we don't fire on every keystroke
    const timeout = setTimeout(() => {
      fetchLocations(query)
        .then(setResults)
        .finally(() => setLoading(false));
    }, 200);
    return () => clearTimeout(timeout);
  }, [visible, query]);

  return (
    <BottomSheetModal visible={visible} onClose={onClose}>
      <ModalHeader title="Choose Location" onClose={onClose} />

      <View className="flex-row items-center bg-[#F4F2F6] rounded-full px-4 h-11 mb-3">
        <Ionicons name="search" size={16} color="#9A94A0" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search city or suburb..."
          placeholderTextColor="#9A94A0"
          className="flex-1 ml-2 text-sm text-[#161119]"
        />
      </View>

      <Text className="text-[11px] font-bold tracking-[1px] text-[#9A94A0] mb-1 mt-1">
        POPULAR LOCATIONS
      </Text>

      {loading ? (
        <View className="py-10 items-center">
          <ActivityIndicator color={COLORS.baseColor} />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          style={{ maxHeight: 320 }}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <Text className="text-sm text-[#8A8590] py-6 text-center">
              No locations found.
            </Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                onSelect(item);
                onClose();
              }}
              className="flex-row items-center py-3 border-b border-[#F1EFF3]"
            >
              <View className="w-9 h-9 rounded-full bg-[#F4E9FC] items-center justify-center mr-3">
                <Ionicons name="location-outline" size={16} color="#B57EDC" />
              </View>
              <View>
                <Text className="text-sm font-semibold text-[#161119]">
                  {item.name}
                </Text>
                <Text className="text-xs text-[#8A8590]">{item.region}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </BottomSheetModal>
  );
}
