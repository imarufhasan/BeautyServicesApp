import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthBrandHeader from "./AuthBrandHeader";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValid = useMemo(
    () => EMAIL_REGEX.test(email.trim()) && password.length >= 6,
    [email, password],
  );

  const handleSignIn = async () => {
    //if (!isValid || loading) return;
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.replace("/(customer)/(tabs)/home");
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        >
          <View className="pt-6">
            <AuthBrandHeader />
          </View>

          <Text className="text-3xl font-extrabold text-[#161119] mt-6">
            Welcome Back
          </Text>
          <Text className="text-base text-[#8A8590] mt-1">
            Sign in to your account
          </Text>

          <View
            className="bg-white rounded-[15px] p-4 mt-6"
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

            <Text className="text-sm font-bold text-[#161119] mb-2 mt-4">
              Password
            </Text>
            <View
              className="flex-row items-center bg-[#F5F2F7] rounded-[14px] px-4"
              style={{ height: 50 }}
            >
              <Ionicons name="lock-closed-outline" size={18} color="#B0AAB6" />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#B0AAB6"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                className="flex-1 text-base text-[#161119] ml-2"
              />
              <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={17}
                  color="#B0AAB6"
                />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-between mt-4">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setRememberMe((v) => !v)}
                className="flex-row items-center"
              >
                <View
                  className="items-center justify-center rounded-full mr-2"
                  style={{
                    width: 18,
                    height: 18,
                    borderWidth: 1.5,
                    borderColor: rememberMe ? COLORS.baseColor : "#D9D3E0",
                    backgroundColor: rememberMe
                      ? COLORS.baseColor
                      : "transparent",
                  }}
                >
                  {rememberMe && (
                    <Ionicons name="checkmark" size={11} color="#fff" />
                  )}
                </View>
                <Text className="text-sm text-[#6E6875]">Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push("/(auth)/ForgotPasswordScreen")}
              >
                <Text
                  className="text-sm font-bold"
                  style={{ color: COLORS.baseColor }}
                >
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            // disabled={!isValid || loading}
            onPress={handleSignIn}
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
                  {loading ? "Signing In..." : "Sign In"}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <View className="flex-row items-center my-5">
            <View className="flex-1 h-[1px] bg-[#F0EEF2]" />
            <Text className="text-sm text-[#B0AAB6] mx-3">or</Text>
            <View className="flex-1 h-[1px] bg-[#F0EEF2]" />
          </View>

          <View className="flex-row items-center justify-center">
            <Text className="text-sm text-[#6E6875]">
              New to memillennial?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => {
                router.push("/CreateAccountScreen");
              }}
            >
              <Text
                className="text-sm font-extrabold"
                style={{ color: COLORS.baseColor }}
              >
                Create Account
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
