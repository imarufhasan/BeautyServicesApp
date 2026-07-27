import { Field, SectionCard } from "@/components/(artist)/FormField";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthBrandHeader from "../AuthBrandHeader";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CreateAccountScreen() {
  const params = useLocalSearchParams();

  const userRole = Array.isArray(params.role) ? params.role[0] : params.role;
  console.log("role 4: ", userRole);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState("");

  const isValid = useMemo(
    () =>
      fullName.trim().length >= 2 &&
      EMAIL_REGEX.test(email.trim()) &&
      password.length >= 8 &&
      password === confirmPassword &&
      acceptedTerms,
    [fullName, email, password, confirmPassword, acceptedTerms],
  );

  const handleCreateAccount = async () => {
    //if (!isValid || loading) return;
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push({
        pathname: "/(auth)/OtpVerificationScreen",
        params: {
          role: userRole,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FFF8F9]" edges={["top"]}>
      <KeyboardAvoidingView contentContainerStyle={{ paddingBottom: 80 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 80 }}
        >
          <View className="pt-4">
            <AuthBrandHeader />
          </View>

          <Text className="text-3xl font-extrabold text-[#161119] mt-6 mb-4">
            Registration
          </Text>

          <SectionCard title="PERSONAL INFORMATION">
            <Field
              label="Full Name"
              placeholder="Jane Smith"
              value={fullName}
              onChangeText={setFullName}
            />
            <Field
              label="Email Address"
              placeholder="jane@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            {/* aaa */}
            <Field
              label="Australian Mobile Number"
              placeholder="04XX XXX XXX"
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
            />
            <Field
              label="Password"
              placeholder="Create a strong password"
              value={password}
              onChangeText={setPassword}
              secure
            />
            <View className="mb-0">
              <Field
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secure
              />
            </View>
          </SectionCard>

          <View
            className="bg-white rounded-[20px] px-5 pb-5 mb-5"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: 2,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setAcceptedTerms((v) => !v)}
              className="flex-row items-start justify-center mt-4"
            >
              {/* <View
                className="items-center  justify-center rounded-full mr-2 mt-0.5"
                style={{
                  width: 18,
                  height: 18,
                  borderWidth: 1.5,
                  borderRadius: 9,
                  borderColor: acceptedTerms ? COLORS.baseColor : "#D9D3E0",
                  backgroundColor: acceptedTerms
                    ? COLORS.baseColor
                    : "transparent",
                }}
              >
                {acceptedTerms && (
                  <Ionicons name="checkmark" size={11} color="#fff" />
                )}
              </View> */}
              <TouchableOpacity
                onPress={() => setAcceptedTerms((v) => !v)}
                className={`w-6 h-6 rounded-[6px] border-2 items-center justify-center mr-3 mt-0.5 ${
                  acceptedTerms
                    ? "bg-[#B57EDC] border-[#B57EDC]"
                    : "border-[#D9D5DE] bg-white"
                }`}
              >
                {acceptedTerms && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </TouchableOpacity>
              <Text className="flex-1 text-sm text-[#6E6875] leading-5">
                I accept the{" "}
                <Text className="font-bold" style={{ color: COLORS.blueColor }}>
                  Terms of Service
                </Text>{" "}
                and{" "}
                <Text className="font-bold" style={{ color: COLORS.blueColor }}>
                  Privacy Policy.
                </Text>{" "}
                <Text className="flex-1 text-sm text-[#6E6875] leading-5">
                  I confirm all information provided is accurate and up to date.
                </Text>
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            //disabled={!isValid || loading}
            onPress={handleCreateAccount}
            className="rounded-2xl overflow-hidden mt-6"
            //style={{ opacity: isValid ? 1 : 0.5 }}
          >
            <LinearGradient
              colors={[COLORS.baseColor1, COLORS.baseColor2]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="py-4 items-center rounded-full"
            >
              <View className="flex-row items-center">
                {loading && (
                  <ActivityIndicator
                    size="small"
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                )}
                <Text className="text-white text-lg font-extrabold">
                  {loading ? "Continue..." : "Continue"}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <View className="flex-row items-center my-5">
            <View className="flex-1 h-[1px] bg-[#F0EEF2]" />
            <Text className="text-base text-[#B0AAB6] mx-3">OR</Text>
            <View className="flex-1 h-[1px] bg-[#F0EEF2]" />
          </View>

          <View className="flex-row items-center justify-center">
            <Text className="text-sm text-[#6E6875]">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: "/(auth)/(artist)/LoginScreen",
                  params: {
                    role: userRole,
                  },
                });
              }}
            >
              <Text
                className="text-sm font-extrabold"
                style={{ color: COLORS.blueColor }}
              >
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
