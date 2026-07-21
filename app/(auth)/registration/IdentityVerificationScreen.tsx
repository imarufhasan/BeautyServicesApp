import GradientButton from "@/components/common/GradientButton";
import { StepHeader, StepProgressBar } from "@/components/StepProgress";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type UploadKey = "front" | "back" | "selfie";

const UploadBox = ({
  label,
  hint,
  uri,
  onPress,
}: {
  label: string;
  hint: string;
  uri: string | null;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="rounded-[18px] border border-dashed border-[#E3DFE8] bg-white items-center justify-center py-8 px-4 mb-2"
  >
    {uri ? (
      <Image
        source={{ uri }}
        className="w-full h-32 rounded-[12px]"
        resizeMode="cover"
      />
    ) : (
      <>
        <View className="w-11 h-11 rounded-full bg-[#F4F2F6] items-center justify-center mb-3">
          <Ionicons name="image-outline" size={20} color="#8A8590" />
        </View>
        <Text className="text-[15px] font-bold text-[#161119]">{label}</Text>
        <Text className="mt-1 text-xs text-[#B7B2BC]">{hint}</Text>
      </>
    )}
  </TouchableOpacity>
);

export default function IdentityVerificationScreen() {
  const [uploads, setUploads] = useState<Record<UploadKey, string | null>>({
    front: null,
    back: null,
    selfie: null,
  });

  const pick = async (key: UploadKey) => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!res.canceled && res.assets?.[0]?.uri) {
      setUploads((prev) => ({ ...prev, [key]: res.assets[0].uri }));
    }
  };

  const allUploaded = uploads.front && uploads.back && uploads.selfie;

  const handleSubmit = () => {
    //if (!canContinue) return;
    router.push({
      pathname: "/registration/ProfileSetupScreen",
      params: { data: "data" },
    });
  };

  return (
    <LinearGradient
      colors={["#FDEFF4", "#FFFFFF", "#EAF6F5"]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            className="flex-1 px-5"
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          >
            <StepHeader title="Identity Verification" step={2} />
            <StepProgressBar step={2} />

            <Text className="text-[15px] text-[#8A8590] mb-5">
              Verify your identity to activate your professional account.
            </Text>

            {/* Info banner */}
            <View className="flex-row items-start rounded-[16px] bg-[#F4E9FB] border border-[#E9D9F5] px-4 py-4 mb-6">
              <Ionicons
                name="shield-checkmark-outline"
                size={18}
                color="#B57EDC"
                style={{ marginTop: 2, marginRight: 10 }}
              />
              <View className="flex-1">
                <Text className="text-[14px] font-bold text-[#161119]">
                  Driver Licence Required
                </Text>
                <Text className="mt-1 text-[13px] leading-5 text-[#8A8590]">
                  Only visible to administrators. Your personal documents are
                  encrypted and securely stored.
                </Text>
              </View>
            </View>

            <Text className="text-[14px] font-bold text-[#161119] mb-2">
              Front Side
            </Text>
            <UploadBox
              label="Upload Driver Licence Front"
              hint="Tap to upload · JPG, PNG, PDF"
              uri={uploads.front}
              onPress={() => pick("front")}
            />

            <Text className="text-[14px] font-bold text-[#161119] mb-2 mt-4">
              Rear Side
            </Text>
            <UploadBox
              label="Upload Driver Licence Back"
              hint="Tap to upload · JPG, PNG, PDF"
              uri={uploads.back}
              onPress={() => pick("back")}
            />

            <Text className="text-[14px] font-bold text-[#161119] mb-2 mt-4">
              Selfie
            </Text>
            <UploadBox
              label="Upload a Selfie with Driver Licence"
              hint="Tap to upload · JPG, PNG, PDF"
              uri={uploads.selfie}
              onPress={() => pick("selfie")}
            />

            <View className="self-start rounded-full bg-[#FFEFDB] px-4 py-2 mt-4 mb-4 flex-row items-center">
              <View className="w-1.5 h-1.5 rounded-full bg-[#F5A623] mr-2" />
              <Text className="text-xs font-bold text-[#B4791E]">
                Pending Verification
              </Text>
            </View>

            <View className="flex-row items-start rounded-[16px] bg-[#F7F6F8] px-4 py-4 mb-6">
              <Ionicons
                name="shield-outline"
                size={16}
                color="#8A8590"
                style={{ marginTop: 2, marginRight: 10 }}
              />
              <Text className="flex-1 text-[12px] leading-5 text-[#8A8590]">
                Only administrators can access uploaded documents. All data is
                encrypted with AES-256 and stored in compliance with the
                Australian Privacy Act 1988.
              </Text>
            </View>

            <GradientButton
              label="Submit Verification"
              onPress={handleSubmit}
              // disabled={!allUploaded}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
