import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ---------- Reusable field ----------
type FieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  secure?: boolean;
  keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
};

const Field = ({
  label,
  placeholder,
  value,
  onChangeText,
  secure,
  keyboardType = "default",
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
          className="rounded-[14px] border border-[#ECECEC] px-4 py-3.5 text-[15px] text-[#161119]"
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
    </View>
  );
};

// ---------- Section card wrapper ----------
const SectionCard = ({
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

export default function ProfessionalRegistrationScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [abn, setAbn] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [experience, setExperience] = useState("");
  const [accepted, setAccepted] = useState(false);

  const canContinue = accepted;

  const handleContinue = () => {
    if (!canContinue) return;
    // router.push({
    //   pathname: "/(auth)/professional-registration-step-2",
    //   params: { fullName, email, mobile, businessName },
    // });
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
            {/* Logo */}
            <View className="flex-row items-center mt-6 mb-6">
              <LinearGradient
                colors={["#FF5FA2", "#FFA35C"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="w-9 h-9 rounded-full items-center justify-center mr-2.5"
              >
                <Ionicons name="sparkles" size={16} color="#FFFFFF" />
              </LinearGradient>
              <Text
                style={{ color: COLORS.baseColor }}
                className="text-lg font-bold"
              >
                memillennial
              </Text>
            </View>

            {/* Heading */}
            <Text className="text-[28px] font-extrabold text-[#161119]">
              Professional Registration
            </Text>
            <Text className="mt-2 text-[15px] text-[#8A8590]">
              Create your professional beauty profile.
            </Text>

            {/* Progress bar */}
            <View className="flex-row items-center mt-6 mb-7">
              <LinearGradient
                colors={["#FF5FA2", "#FFA35C"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="h-1.5 flex-1 rounded-full mr-2"
              />
              <View className="h-1.5 flex-1 rounded-full bg-[#ECECEC] mr-2" />
              <View className="h-1.5 flex-1 rounded-full bg-[#ECECEC] mr-3" />
              <Text
                style={{ color: COLORS.baseColor }}
                className="text-xs font-bold"
              >
                Step 1 of 3
              </Text>
            </View>

            {/* Personal Information */}
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

            {/* Business Information */}
            <SectionCard title="BUSINESS INFORMATION">
              <Field
                label="Business Name"
                placeholder="Jane's Beauty Studio"
                value={businessName}
                onChangeText={setBusinessName}
              />
              <Field
                label="ABN (Australian Business Number)"
                placeholder="XX XXX XXX XXX"
                value={abn}
                onChangeText={setAbn}
                keyboardType="numeric"
              />
              <Field
                label="Business Address"
                placeholder="123 Beauty St, Melbourne VIC 3000"
                value={businessAddress}
                onChangeText={setBusinessAddress}
              />
              <View className="mb-0">
                <Field
                  label="Years of Experience"
                  placeholder="e.g. 5"
                  value={experience}
                  onChangeText={setExperience}
                  keyboardType="numeric"
                />
              </View>
            </SectionCard>

            {/* Terms */}
            <View
              className="bg-white rounded-[20px] p-5 mb-6 flex-row items-start"
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
                elevation: 2,
              }}
            >
              <TouchableOpacity
                onPress={() => setAccepted((a) => !a)}
                className={`w-6 h-6 rounded-[6px] border-2 items-center justify-center mr-3 mt-0.5 ${
                  accepted
                    ? "bg-[#B57EDC] border-[#B57EDC]"
                    : "border-[#D9D5DE] bg-white"
                }`}
              >
                {accepted && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </TouchableOpacity>
              <Text className="flex-1 text-sm leading-5 text-[#161119]">
                I accept the{" "}
                <Text className="text-[#B57EDC] font-semibold">
                  Terms & Conditions
                </Text>{" "}
                and{" "}
                <Text className="text-[#B57EDC] font-semibold">
                  Privacy Policy
                </Text>
                . I confirm all information provided is accurate and up to date.
              </Text>
            </View>

            {/* Continue button */}
            <TouchableOpacity
              activeOpacity={0.85}
              disabled={!canContinue}
              onPress={handleContinue}
              style={{ opacity: canContinue ? 1 : 0.5 }}
            >
              <LinearGradient
                colors={["#FF5FA2", "#FFA35C"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="rounded-full py-4 items-center"
              >
                <Text className="text-white text-base font-bold">Continue</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Login link */}
            <TouchableOpacity
              onPress={() => router.push("/(auth)/login")}
              className="mt-4 items-center"
            >
              <Text className="text-sm text-[#8A8590]">
                Already have an account?{" "}
                <Text className="text-[#B57EDC] font-semibold">Login</Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
