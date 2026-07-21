// components/registration/FormField.tsx
// Shared building blocks for the 3-step registration flow.
// Reuses the same pattern already in your ProfessionalRegistrationScreen.tsx.

import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

// ---------- Basic text field ----------
type FieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  secure?: boolean;
  keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
  multiline?: boolean;
  maxLength?: number;
};

export const Field = ({
  label,
  placeholder,
  value,
  onChangeText,
  secure,
  keyboardType = "default",
  multiline,
  maxLength,
}: FieldProps) => {
  const [hidden, setHidden] = useState(!!secure);

  return (
    <View className="mb-5">
      <Text className="text-[15px] font-bold text-[#161119] mb-2">{label}</Text>
      <View className="relative justify-center">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#B7B2BC"
          keyboardType={keyboardType}
          secureTextEntry={secure ? hidden : false}
          multiline={multiline}
          maxLength={maxLength}
          textAlignVertical={multiline ? "top" : "center"}
          className="rounded-[14px] border border-[#ECECEC] px-4 py-3.5 text-[15px] text-[#161119]"
          style={multiline ? { minHeight: 100 } : undefined}
        />
        {secure && (
          <TouchableOpacity
            onPress={() => setHidden((h) => !h)}
            className="absolute right-4"
            hitSlop={10}
          >
            <Ionicons
              name={hidden ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#8A8590"
            />
          </TouchableOpacity>
        )}
      </View>
      {maxLength && (
        <Text className="mt-1 text-right text-xs text-[#B7B2BC]">
          {value.length}/{maxLength}
        </Text>
      )}
    </View>
  );
};

// ---------- Field that shows a purple "validated" border + check icon once filled ----------
type ValidatedFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: "default" | "email-address" | "phone-pad" | "numeric" | "url";
  leftIcon?: keyof typeof Ionicons.glyphMap;
};

export const ValidatedField = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  leftIcon,
}: ValidatedFieldProps) => {
  const isValid = value.trim().length > 0;

  return (
    <View className="mb-4 flex-1">
      <Text className="text-[13px] font-bold text-[#161119] mb-2">{label}</Text>
      <View
        className="flex-row items-center rounded-[14px] border px-4 py-3"
        style={{
          borderColor: isValid ? "#B57EDC" : "#ECECEC",
          borderWidth: isValid ? 1.5 : 1,
        }}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={16}
            color="#8A8590"
            style={{ marginRight: 8 }}
          />
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#B7B2BC"
          keyboardType={keyboardType}
          className="flex-1 text-[14px] text-[#161119]"
        />
        {isValid && (
          <Ionicons name="checkmark-circle-outline" size={18} color="#B57EDC" />
        )}
      </View>
    </View>
  );
};

// ---------- Dropdown-styled pressable (opens external picker/sheet in real app) ----------
type DropdownFieldProps = {
  label: string;
  value: string;
  onPress?: () => void;
  className?: string;
};

export const DropdownField = ({
  label,
  value,
  onPress,
  className,
}: DropdownFieldProps) => (
  <View className={`mb-4 flex-1 ${className ?? ""}`}>
    <Text className="text-[13px] font-bold text-[#161119] mb-2">{label}</Text>
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between rounded-[14px] border border-[#ECECEC] px-4 py-3.5"
    >
      <Text
        className={
          value ? "text-[14px] text-[#161119]" : "text-[14px] text-[#B7B2BC]"
        }
      >
        {value || "Select"}
      </Text>
      <Ionicons name="chevron-down" size={16} color="#8A8590" />
    </TouchableOpacity>
  </View>
);

// ---------- Section card wrapper ----------
export const SectionCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View
    className="bg-white rounded-[20px] p-5 mb-5"
    style={{
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    }}
  >
    <Text className="text-xs font-bold tracking-[1.5px] text-[#9A94A0] mb-4">
      {title}
    </Text>
    {children}
  </View>
);

// ---------- Plain card (no eyebrow title) ----------
export const PlainCard = ({ children }: { children: React.ReactNode }) => (
  <View
    className="bg-white rounded-[20px] p-5 mb-5"
    style={{
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    }}
  >
    {children}
  </View>
);
