import AppHeader from "@/components/common/AppHeader";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Profile = {
  avatar: string | null;
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  preferences: string[];
};

const MOCK_PROFILE: Profile = {
  avatar: null,
  fullName: "Zara Mitchell",
  email: "zara.mitchell@gmail.com",
  phone: "+61 412 345 678",
  dob: "",
  preferences: [
    "Natural Makeup",
    "Bold Lashes",
    "Gel Nails",
    "Hair Colour",
    "Brow Shaping",
    "Skincare",
  ],
};

const Field = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "email-address" | "phone-pad";
}) => (
  <View className="mb-4">
    <Text className="text-[10px] font-bold text-[#B57EDC] tracking-wide mb-1.5 uppercase">
      {label}
    </Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={keyboardType}
      placeholderTextColor="#C9A9C0"
      className="rounded-2xl px-4 py-3.5 text-sm text-[#161119]"
      style={{ backgroundColor: "#FDEDF1" }}
    />
  </View>
);

export default function EditProfileScreen({
  profile: initialProfile,
  onSave,
}: {
  profile?: Profile;
  onSave?: (profile: Profile) => Promise<void> | void;
}) {
  const [profile, setProfile] = useState<Profile>(
    initialProfile ?? MOCK_PROFILE,
  );
  const [saving, setSaving] = useState(false);

  const patch = (fields: Partial<Profile>) =>
    setProfile((prev) => ({ ...prev, ...fields }));

  const handleChangePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      patch({ avatar: result.assets[0].uri });
    }
  };

  const removePreference = (tag: string) =>
    patch({ preferences: profile.preferences.filter((p) => p !== tag) });

  const handleAddPreference = () => {
    // TODO: open a picker/modal to add a new beauty preference tag
    console.log("Add preference tapped");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (onSave) {
        await onSave(profile);
      } else {
        // TODO API:
        // await updateProfileMutation(profile)
        console.log("Save profile:", profile);
      }
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FBF9FC]">
      <AppHeader title="Edit Profile" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30 }}
      >
        {/* Avatar */}
        <View className="items-center mt-2 mb-6">
          <View style={{ width: 96, height: 96 }}>
            {profile.avatar ? (
              <Image
                source={{ uri: profile.avatar }}
                style={{ width: 96, height: 96, borderRadius: 48 }}
              />
            ) : (
              <View
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 48,
                  backgroundColor: "#F0EEF2",
                }}
              />
            )}
            <TouchableOpacity
              onPress={handleChangePhoto}
              className="absolute rounded-full overflow-hidden"
              style={{ bottom: 0, right: 0 }}
            >
              <LinearGradient
                colors={[COLORS.baseColor1, COLORS.baseColor2]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="camera" size={14} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleChangePhoto} className="mt-2">
            <Text className="text-xs font-bold" style={{ color: "#E17100" }}>
              Change Photo
            </Text>
          </TouchableOpacity>
        </View>

        {/* Personal Information */}
        <View
          className="bg-white rounded-[20px] p-4"
          style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
        >
          <Text className="text-base font-extrabold text-[#161119] mb-4">
            Personal Information
          </Text>
          <Field
            label="Full Name"
            value={profile.fullName}
            onChangeText={(v) => patch({ fullName: v })}
          />
          <Field
            label="Email Address"
            value={profile.email}
            onChangeText={(v) => patch({ email: v })}
            keyboardType="email-address"
          />
          <Field
            label="Phone Number"
            value={profile.phone}
            onChangeText={(v) => patch({ phone: v })}
            keyboardType="phone-pad"
          />
          <Field
            label="Date of Birth"
            value={profile.dob}
            onChangeText={(v) => patch({ dob: v })}
            placeholder="DD/MM/YYYY"
          />
        </View>

        {/* Beauty Preferences */}
        <View className="mt-5">
          <Text className="text-base font-extrabold text-[#161119] mb-3">
            Beauty Preferences
          </Text>
          <View className="flex-row flex-wrap" style={{ gap: 8 }}>
            {profile.preferences.map((tag) => (
              <TouchableOpacity
                key={tag}
                activeOpacity={0.8}
                onLongPress={() => removePreference(tag)}
                className="rounded-full px-4 py-2"
                style={{ backgroundColor: "#F4E4FF" }}
              >
                <Text
                  className="text-xs font-bold"
                  style={{ color: "#7A3FA8" }}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleAddPreference}
              className="flex-row items-center rounded-full px-4 py-2 border"
              style={{ borderColor: "#E9D5F7" }}
            >
              <Ionicons
                name="add"
                size={13}
                color="#B57EDC"
                style={{ marginRight: 3 }}
              />
              <Text className="text-xs font-bold" style={{ color: "#B57EDC" }}>
                Add
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Save button */}
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
                Save Changes
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
