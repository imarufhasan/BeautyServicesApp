import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordScreen() {
  const { role } = useLocalSearchParams();
  console.log("role 3: ", role);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const isValid = useMemo(() => EMAIL_REGEX.test(email.trim()), [email]);

  const handleSendResetCode = async () => {
    //if (!isValid || loading) return;
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push({
        pathname: "/OtpVerificationScreen",
        params: { email, flow: "reset-password", role: role },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FFF8F9]" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View className="px-5 pt-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-12 h-12 rounded-full bg-white items-center justify-center"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.06,
              shadowRadius: 6,
              elevation: 1,
            }}
          >
            <Ionicons name="chevron-back" size={22} color="#161119" />
          </TouchableOpacity>
        </View>

        <View className="px-5 items-center mt-2">
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
            <Ionicons name="lock-closed" size={28} color="#fff" />
          </LinearGradient>

          <Text className="text-2xl font-extrabold text-[#161119] mt-5">
            Forgot Password?
          </Text>
          <Text className="text-sm text-[#8A8590] text-center mt-2 leading-5">
            Enter your email Address{"\n"}to receive a reset code.
          </Text>
        </View>

        <View className="px-5 mt-6">
          <View
            className="bg-white rounded-[22px] p-4"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 6 },
              elevation: 2,
            }}
          >
            <Text className="text-sm font-bold text-[#161119] mb-2">
              Email Address
            </Text>
            <View
              className="flex-row items-center bg-[#F5F2F7] rounded-[14px] px-4"
              style={{ height: 50 }}
            >
              <Ionicons name="mail-outline" size={18} color="#B0AAB6" />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="sophie@example.com"
                placeholderTextColor="#B0AAB6"
                autoCapitalize="none"
                keyboardType="email-address"
                className="flex-1 text-base text-[#161119] ml-2"
              />
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            //disabled={!isValid || loading}
            onPress={handleSendResetCode}
            className="rounded-full overflow-hidden mt-6"
            //style={{ opacity: isValid ? 1 : 0.5 }}
          >
            <LinearGradient
              colors={[COLORS.baseColor1, COLORS.baseColor2]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="py-4 items-center rounded-full"
            >
              {/* <Text className="text-white text-lg font-extrabold">
                {loading ? "Sending..." : "Send Reset Code"}
              </Text> */}
              <View className="flex-row items-center">
                {loading && (
                  <ActivityIndicator
                    size="small"
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                )}

                <Text className="text-white text-lg font-extrabold">
                  {loading ? "Sending..." : "Send Reset Code"}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            className="items-center mt-4 flex-row justify-center"
          >
            <Ionicons
              name="arrow-back"
              size={13}
              color={COLORS.baseColor}
              style={{ marginRight: 5 }}
            />
            <Text
              className="text-base font-bold"
              style={{ color: COLORS.baseColor }}
            >
              Back to Login
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
