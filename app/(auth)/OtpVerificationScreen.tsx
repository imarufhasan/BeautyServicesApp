import AppHeader from "@/components/common/AppHeader";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 30;

export default function OtpVerificationScreen() {
  const { email, flow } = useLocalSearchParams<{
    email?: string;
    flow?: string; // "register" | "reset-password"
  }>();

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [verifying, setVerifying] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const otpValue = useMemo(() => digits.join(""), [digits]);
  const isComplete = otpValue.length === OTP_LENGTH;

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleChangeDigit = (text: string, index: number) => {
    const clean = text.replace(/[^0-9]/g, "");
    if (!clean) {
      setDigits((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }

    setDigits((prev) => {
      const next = [...prev];
      next[index] = clean[clean.length - 1];
      return next;
    });

    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: { nativeEvent: { key: string } },
    index: number,
  ) => {
    if (e.nativeEvent.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (cooldown > 0) return;
    // TODO: call real resend-OTP mutation, passing { email }
    setCooldown(RESEND_COOLDOWN_SECONDS);
    setDigits(Array(OTP_LENGTH).fill(""));
    inputRefs.current[0]?.focus();
  };

  const handleVerify = async () => {
    //if (!isComplete || verifying) return;
    setVerifying(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (flow === "reset-password") {
        router.push("/(auth)/LoginScreen");
      } else {
        router.replace("/(customer)/(tabs)/home");
      }
    } finally {
      setVerifying(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FFF8F9]" edges={["top"]}>
      {/* Header */}
      <AppHeader title="OTP Verification" />

      <View className="px-5 items-center mt-4">
        <LinearGradient
          colors={[COLORS.baseColor1, COLORS.baseColor2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: COLORS.baseColor1,
            shadowOpacity: 0.35,
            shadowRadius: 16,
            elevation: 4,
          }}
        >
          <Ionicons name="mail-open" size={26} color="#fff" />
          <View
            className="absolute -bottom-0.5 -right-0.5 items-center justify-center rounded-full bg-white"
            style={{ width: 20, height: 20 }}
          >
            <Ionicons name="checkmark-circle" size={20} color="#3CC26B" />
          </View>
        </LinearGradient>

        <Text className="text-sm text-[#8A8590] text-center mt-5 leading-5 px-6">
          Enter the 6-digit verification code sent to your{" "}
          {email ? email : "Email Address"}.
        </Text>
      </View>

      {/* OTP boxes */}
      <View className="px-5 mt-6">
        <View
          className="bg-white rounded-[22px] py-6 px-3"
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 6 },
            elevation: 2,
          }}
        >
          <View className="flex-row justify-center" style={{ gap: 8 }}>
            {digits.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                value={digit}
                onChangeText={(text) => handleChangeDigit(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                cursorColor={COLORS.baseColor}
                className="text-center text-lg font-extrabold text-[#161119]"
                style={{
                  width: 44,
                  height: 52,
                  borderRadius: 14,
                  backgroundColor: "#F5F2F7",
                  borderWidth: digit ? 1.5 : 1,
                  borderColor: digit ? COLORS.baseColor : "#EFEAF3",
                }}
              />
            ))}
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleResend}
            disabled={cooldown > 0}
            className="items-center mt-5"
          >
            <Text
              className="text-sm font-extrabold"
              style={{ color: cooldown > 0 ? "#B0AAB6" : COLORS.baseColor }}
            >
              {cooldown > 0 ? `Resend Code in ${cooldown}s` : "Resend Code"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          className="items-center mt-4"
        >
          <Text className="text-sm text-[#8A8590]">Change Email Address</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          //disabled={!isComplete || verifying}
          onPress={handleVerify}
          className="rounded-full overflow-hidden mt-6"
          //style={{ opacity: isComplete ? 1 : 0.5 }}
        >
          <LinearGradient
            colors={[COLORS.baseColor1, COLORS.baseColor2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="py-4 items-center rounded-full"
          >
            <View className="flex-row items-center">
              {verifying && (
                <ActivityIndicator
                  size="small"
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
              )}

              <Text className="text-white text-base font-extrabold">
                {verifying ? "Verifying..." : "Verify OTP"}
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
