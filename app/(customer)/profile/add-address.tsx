import AppHeader from "@/components/common/AppHeader";
import SegmentedControl from "@/components/common/SegmentedControl";
import Toggle from "@/components/common/Toggle";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type AddressType = "home" | "work" | "other";

export type AddressForm = {
  id?: string;
  type: AddressType;
  fullName: string;
  phone: string;
  street: string;
  apartment: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

const EMPTY_FORM: AddressForm = {
  type: "home",
  fullName: "",
  phone: "",
  street: "",
  apartment: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  isDefault: false,
};

const Field = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}) => (
  <View className="mb-4">
    <Text className="text-[10px] font-bold text-[#8A8590] tracking-wide mb-1.5 uppercase">
      {label}
    </Text>
    <View
      className="flex-row items-center rounded-2xl px-4"
      style={{
        borderColor: "#EFEAF3",
        borderWidth: 1,
        backgroundColor: "#fff",
      }}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={15}
          color="#B0AAB6"
          style={{ marginRight: 8 }}
        />
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#C4BFC9"
        className="flex-1 py-3.5 text-sm text-[#161119]"
      />
    </View>
  </View>
);

export default function AddAddressScreen({
  onSave,
}: {
  onSave?: (form: AddressForm) => Promise<void> | void;
}) {
  const params = useLocalSearchParams<{ addressData?: string }>();

  const initial: AddressForm = useMemo(() => {
    if (!params.addressData) return EMPTY_FORM;
    try {
      const parsed = JSON.parse(params.addressData);
      return { ...EMPTY_FORM, ...parsed };
    } catch {
      return EMPTY_FORM;
    }
  }, [params.addressData]);

  const [form, setForm] = useState<AddressForm>(initial);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);

  const patch = (fields: Partial<AddressForm>) =>
    setForm((prev) => ({ ...prev, ...fields }));

  const handleUseCurrentLocation = async () => {
    setLocating(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) return;
      const position = await Location.getCurrentPositionAsync({});
      const [place] = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      if (place) {
        patch({
          street: [place.streetNumber, place.street].filter(Boolean).join(" "),
          city: place.city ?? "",
          state: place.region ?? "",
          postalCode: place.postalCode ?? "",
          country: place.country ?? "",
        });
      }
    } catch (err) {
      console.warn("Failed to get current location:", err);
    } finally {
      setLocating(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (onSave) {
        await onSave(form);
      } else {
        // TODO API:
        // form.id ? await updateAddressMutation(form) : await createAddressMutation(form)
        console.log("Save address:", form);
      }
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FBF9FC]">
      <AppHeader title="Add New Address" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: 30,
        }}
      >
        <SegmentedControl
          value={form.type}
          onChange={(type: AddressType) => patch({ type })}
          options={[
            { value: "home", label: "Home", icon: "home" },
            { value: "work", label: "Work", icon: "briefcase" },
            { value: "other", label: "Other", icon: "location" },
          ]}
        />

        <View className="mt-5">
          <Field
            label="Full Name"
            value={form.fullName}
            onChangeText={(v) => patch({ fullName: v })}
            placeholder="Sophie Williams"
          />
          <Field
            label="Phone Number"
            value={form.phone}
            onChangeText={(v) => patch({ phone: v })}
            placeholder="+61 412 345 678"
          />
          <Field
            label="Street Address"
            value={form.street}
            onChangeText={(v) => patch({ street: v })}
            placeholder="42 Harbour Bridge Rd"
            icon="location-outline"
          />
          <Field
            label="Apartment / Unit"
            value={form.apartment}
            onChangeText={(v) => patch({ apartment: v })}
            placeholder="Unit 8B (optional)"
          />

          <View className="flex-row" style={{ gap: 12 }}>
            <View className="flex-1">
              <Field
                label="City"
                value={form.city}
                onChangeText={(v) => patch({ city: v })}
                placeholder="Sydney"
              />
            </View>
            <View className="flex-1">
              <Field
                label="State"
                value={form.state}
                onChangeText={(v) => patch({ state: v })}
                placeholder="NSW"
              />
            </View>
          </View>

          <View className="flex-row" style={{ gap: 12 }}>
            <View className="flex-1">
              <Field
                label="Postal Code"
                value={form.postalCode}
                onChangeText={(v) => patch({ postalCode: v })}
                placeholder="2000"
              />
            </View>
            <View className="flex-1">
              <Field
                label="Country"
                value={form.country}
                onChangeText={(v) => patch({ country: v })}
                placeholder="Australia"
              />
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleUseCurrentLocation}
            disabled={locating}
            className="flex-row items-center justify-center rounded-2xl py-3.5 mb-4"
            style={{ backgroundColor: "#EAF7F3" }}
          >
            {locating ? (
              <ActivityIndicator color="#1A8073" />
            ) : (
              <>
                <Ionicons
                  name="navigate"
                  size={14}
                  color="#1A8073"
                  style={{ marginRight: 6 }}
                />
                <Text
                  className="text-sm font-bold"
                  style={{ color: "#1A8073" }}
                >
                  Use Current Location
                </Text>
              </>
            )}
          </TouchableOpacity>

          <View
            className="flex-row items-center justify-between rounded-2xl px-4 py-3.5 mb-2"
            style={{
              borderColor: "#EFEAF3",
              borderWidth: 1,
              backgroundColor: "#fff",
            }}
          >
            <Text className="text-sm text-[#161119]">
              Set as Default Address
            </Text>
            <Toggle
              value={form.isDefault}
              onChange={(v) => patch({ isDefault: v })}
            />
          </View>
        </View>
      </ScrollView>

      <View className="px-5 pb-5 pt-2">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSave}
          disabled={saving}
          className="rounded-full overflow-hidden"
        >
          <LinearGradient
            colors={[COLORS.baseColor1, COLORS.baseColor2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="py-4 items-center rounded-full"
            style={{ opacity: saving ? 0.7 : 1 }}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-base font-extrabold">
                Save Address
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
