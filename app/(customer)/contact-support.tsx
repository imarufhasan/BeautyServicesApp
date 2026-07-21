import AppHeader from "@/components/common/AppHeader";
import GradientActionButton from "@/components/common/GradientActionButton";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
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

const SUPPORT_INFO = {
  responseTime: "under 2 hours",
  timezone: "AEST",
  hours: [
    { days: "Monday – Friday", time: "8:00 AM – 8:00 PM" },
    { days: "Saturday – Sunday", time: "9:00 AM – 5:00 PM" },
  ],
};

export default function ContactSupportScreen() {
  // If arriving from a specific booking/cancellation flow, prefill context
  const params = useLocalSearchParams<{ bookingId?: string }>();

  const [subject, setSubject] = useState(
    params.bookingId ? `Booking ${params.bookingId}` : "",
  );
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const [attachedFileUri, setAttachedFileUri] = useState<string | null>(null);

  const handleAttachFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "image/*",
          "application/pdf",
          "text/plain",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled) {
        const file = result.assets[0];

        setAttachedFile(file.name);

        console.log("Selected file:", {
          name: file.name,
          size: file.size,
          uri: file.uri,
          mimeType: file.mimeType,
        });
        setAttachedFile(file.name);
        setAttachedFileUri(file.uri);
      }
    } catch (error) {
      console.log("File picker error:", error);
    }
  };

  const handleSubmit = () => {
    //if (!subject.trim() || !message.trim()) return;
    setSubmitting(true);
    // TODO: call support-ticket creation API with { subject, message, attachedFile, bookingId: params.bookingId }
    setTimeout(() => {
      setSubmitting(false);
      //router.push("/(customer)/(tabs)/bookings");
      router.back();
    }, 600);
  };

  const canSubmit = subject.trim().length > 0 && message.trim().length > 0;

  return (
    <SafeAreaView className="flex-1 bg-[#FBF9FC]">
      {/* Header */}

      <AppHeader title="Contact Support" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={10}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 60 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Hero card */}
          <View
            className="items-center rounded-[20px] px-6 py-7 mt-1"
            style={{ backgroundColor: "#FCEEF3" }}
          >
            <LinearGradient
              colors={[COLORS.baseColor1, COLORS.baseColor2]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 56,
                height: 56,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 14,
              }}
            >
              <Ionicons name="chatbubble-ellipses" size={26} color="#fff" />
            </LinearGradient>

            <Text className="text-lg font-extrabold text-[#161119]">
              We&apos;re Here to Help
            </Text>
            <Text className="text-xs text-[#8A8590] mt-1.5">
              Average response time: {SUPPORT_INFO.responseTime}
            </Text>
          </View>

          {/* Support hours card */}
          <View
            className="bg-white rounded-[20px] p-4 mt-4"
            style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
          >
            <Text
              className="text-[11px] font-bold tracking-wide mb-3"
              style={{ color: COLORS.baseColor }}
            >
              SUPPORT HOURS ({SUPPORT_INFO.timezone})
            </Text>

            {SUPPORT_INFO.hours.map((row, idx) => (
              <View
                key={row.days}
                className={`flex-row items-center justify-between ${
                  idx === 0 ? "pb-2.5" : "pt-2.5"
                }`}
              >
                <Text className="text-sm font-bold text-[#161119]">
                  {row.days}
                </Text>
                <Text className="text-sm text-[#6E6875]">{row.time}</Text>
              </View>
            ))}
          </View>

          {/* Send a Message card */}
          <View className="mt-6">
            <Text className="text-lg font-extrabold text-[#161119] mb-4">
              Send a Message
            </Text>

            <Text className="text-[11px] font-bold tracking-wide text-[#9A94A0] mb-2">
              SUBJECT
            </Text>
            <TextInput
              value={subject}
              onChangeText={setSubject}
              placeholder="How can we help?"
              placeholderTextColor="#D9A9BC"
              className="rounded-[14px] px-4 py-3.5 text-sm text-[#161119] mb-5"
              style={{ backgroundColor: "#FCEEF3" }}
            />

            <Text className="text-[11px] font-bold tracking-wide text-[#9A94A0] mb-2">
              MESSAGE
            </Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Describe your issue in detail..."
              placeholderTextColor="#D9A9BC"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              className="rounded-[14px] px-4 py-3.5 text-sm text-[#161119]"
              style={{ backgroundColor: "#FCEEF3", minHeight: 120 }}
            />

            <TouchableOpacity
              onPress={handleAttachFile}
              activeOpacity={0.7}
              className="flex-row items-center mt-4"
            >
              <Ionicons
                name="attach"
                size={16}
                color={COLORS.baseColor}
                style={{ marginRight: 6 }}
              />

              <Text
                className="text-sm font-bold flex-1"
                style={{ color: COLORS.baseColor }}
                numberOfLines={1}
              >
                {attachedFile ?? "Attach a file"}
              </Text>

              {attachedFile && (
                <TouchableOpacity
                  onPress={() => setAttachedFile(null)}
                  className="ml-3"
                >
                  <Ionicons name="close-circle" size={18} color="#999" />
                </TouchableOpacity>
              )}
            </TouchableOpacity>

            {/* <TouchableOpacity
              activeOpacity={0.85}
              disabled={!canSubmit || submitting}
              onPress={handleSubmit}
              className="rounded-full overflow-hidden mt-6"
              style={{ opacity: canSubmit ? 1 : 0.5 }}
            >
              <LinearGradient
                colors={[COLORS.baseColor1, COLORS.baseColor2]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="py-4 flex-row items-center justify-center rounded-full"
              >
                {submitting ? (
                  <>
                    <ActivityIndicator
                      size="small"
                      color="#fff"
                      style={{ marginRight: 8 }}
                    />
                    <Text className="text-white text-base font-extrabold">
                      Sending...
                    </Text>
                  </>
                ) : (
                  <>
                    <Ionicons
                      name="send"
                      size={15}
                      color="#fff"
                      style={{ marginRight: 8 }}
                    />
                    <Text className="text-white text-base font-extrabold">
                      Submit
                    </Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity> */}
          </View>
        </ScrollView>
        <View className="my-4 mx-4">
          <GradientActionButton
            title="Submit"
            onPress={handleSubmit}
            loading={submitting}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
