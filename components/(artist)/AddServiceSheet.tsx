import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { DropdownField } from "./FormField";

export type NewServiceInput = {
  category: string;
  description: string;
  duration: string;
  price: string;
  travelFee: string;
  discount: string;
};

export default function AddServiceSheet({
  visible,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (service: NewServiceInput) => void;
}) {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [travelFee, setTravelFee] = useState("");
  const [discount, setDiscount] = useState("");

  const canSubmit = category && description && duration && price;

  const reset = () => {
    setCategory("");
    setDescription("");
    setDuration("");
    setPrice("");
    setTravelFee("");
    setDiscount("");
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ category, description, duration, price, travelFee, discount });
    reset();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/40">
        <View className="rounded-t-[24px] bg-white px-5 pt-3 pb-8">
          {/* Drag handle */}
          <View className="self-center w-10 h-1 rounded-full bg-[#E3E0E6] mb-4" />

          <View className="flex-row items-center justify-between mb-5">
            <Text className="text-[18px] font-extrabold text-[#161119]">
              Add New Service
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={22} color="#8A8590" />
            </TouchableOpacity>
          </View>

          <DropdownField
            label="Category"
            value={category}
            onPress={() => setCategory("Bridal")}
          />

          <Text className="text-[13px] font-bold text-[#161119] mb-2">
            Description
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Describe this service for potential clients..."
            placeholderTextColor="#B7B2BC"
            multiline
            textAlignVertical="top"
            className="rounded-[14px] border border-[#ECECEC] px-4 py-3.5 text-[14px] text-[#161119] mb-4"
            style={{ minHeight: 90 }}
          />

          <View className="flex-row" style={{ gap: 12 }}>
            <DropdownField
              label="Duration"
              value={duration}
              onPress={() => setDuration("60 min")}
            />
            <View className="mb-4 flex-1">
              <Text className="text-[13px] font-bold text-[#161119] mb-2">
                Price
              </Text>
              <TextInput
                value={price}
                onChangeText={setPrice}
                placeholder="$0"
                placeholderTextColor="#B7B2BC"
                keyboardType="numeric"
                className="rounded-[14px] border border-[#ECECEC] px-4 py-3.5 text-[14px] text-[#161119]"
              />
            </View>
          </View>

          <View className="flex-row" style={{ gap: 12 }}>
            <View className="mb-2 flex-1">
              <Text className="text-[13px] font-bold text-[#161119] mb-2">
                Travel Fee
              </Text>
              <TextInput
                value={travelFee}
                onChangeText={setTravelFee}
                placeholder="$0"
                placeholderTextColor="#B7B2BC"
                keyboardType="numeric"
                className="rounded-[14px] border border-[#ECECEC] px-4 py-3.5 text-[14px] text-[#161119]"
              />
            </View>
            <View className="mb-2 flex-1">
              <Text className="text-[13px] font-bold text-[#161119] mb-2">
                Discount{" "}
                <Text className="text-[#B7B2BC] font-normal">(Optional)</Text>
              </Text>
              <TextInput
                value={discount}
                onChangeText={setDiscount}
                placeholder="e.g. 10% off"
                placeholderTextColor="#B7B2BC"
                className="rounded-[14px] border border-[#ECECEC] px-4 py-3.5 text-[14px] text-[#161119]"
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!canSubmit}
            className={`mt-3 flex-row items-center justify-center rounded-full py-4 ${
              canSubmit ? "bg-[#FB7185]" : "bg-[#EDEBEF]"
            }`}
          >
            <Ionicons
              name="add"
              size={16}
              color={canSubmit ? "#fff" : "#B7B2BC"}
            />
            <Text
              className={`ml-1.5 text-[15px] font-bold ${canSubmit ? "text-white" : "text-[#B7B2BC]"}`}
            >
              Add Service
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
