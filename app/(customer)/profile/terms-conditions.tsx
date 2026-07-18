import AppHeader from "@/components/common/AppHeader";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TermSection = {
  id: number;
  title: string;
  body: string;
};

const SECTIONS: TermSection[] = [
  {
    id: 1,
    title: "Acceptance of Terms",
    body: "By creating a Glamr account or using the platform, you agree to be bound by these Terms & Conditions and our Privacy Policy. If you disagree, please discontinue use immediately. We may update these terms from time to time and will notify you via email of material changes.",
  },
  {
    id: 2,
    title: "Service Description",
    body: "Glamr is a marketplace connecting customers with independent beauty artists for makeup, hair, nail, and skincare services. We facilitate bookings and payments but are not the direct provider of the beauty services offered by artists on the platform.",
  },
  {
    id: 3,
    title: "User Responsibilities",
    body: "You must provide accurate account information, be at least 18 years old (or have parental consent), and use the platform only for lawful purposes. You are responsible for maintaining the confidentiality of your account credentials.",
  },
  {
    id: 4,
    title: "Booking & Cancellation Policy",
    body: "Bookings can be rescheduled up to 24 hours before an appointment. Cancellations within 24 hours of the scheduled time may incur a cancellation fee of up to 50% of the service cost. No-shows will be charged the full service amount.",
  },
  {
    id: 5,
    title: "Payment Terms",
    body: "All payments are processed securely through our third-party payment providers. Prices displayed include applicable taxes unless stated otherwise. Refunds, where applicable, are issued to the original payment method within 5–10 business days.",
  },
  {
    id: 6,
    title: "Intellectual Property",
    body: "All content on the Glamr platform, including logos, graphics, and software, is the property of Glamr or its licensors and is protected by intellectual property laws. You may not copy, modify, or distribute this content without permission.",
  },
  {
    id: 7,
    title: "Limitation of Liability",
    body: "Glamr is not liable for any indirect, incidental, or consequential damages arising from your use of the platform or services booked through it, including but not limited to dissatisfaction with a service performed by an independent artist.",
  },
  {
    id: 8,
    title: "Governing Law",
    body: "These Terms & Conditions are governed by the laws of Australia. Any disputes arising from these terms will be subject to the exclusive jurisdiction of the courts located in New South Wales.",
  },
];

const SectionRow = ({
  section,
  expanded,
  onToggle,
}: {
  section: TermSection;
  expanded: boolean;
  onToggle: () => void;
}) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={onToggle}
    className="bg-white rounded-[20px] p-4 mb-3"
    style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
  >
    <View className="flex-row items-start">
      <View
        className="items-center justify-center rounded-full mr-3"
        style={{ width: 26, height: 26, backgroundColor: "#F4E4FF" }}
      >
        <Text className="text-xs font-extrabold" style={{ color: "#B57EDC" }}>
          {section.id}
        </Text>
      </View>
      <View className="flex-1">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-extrabold text-[#161119] flex-1 pr-2">
            {section.title}
          </Text>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={15}
            color={expanded ? "#B57EDC" : "#B0AAB6"}
          />
        </View>
        {expanded && (
          <Text className="text-xs text-[#8A8590] mt-2 leading-5">
            {section.body}
          </Text>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

export default function TermsConditionsScreen({
  effectiveDate = "1 January 2026",
  version = "v3.1",
  intro = "Welcome to memillennial. These terms govern your use of our beauty services marketplace. Please read them carefully.",
  sections = SECTIONS,
}: {
  effectiveDate?: string;
  version?: string;
  intro?: string;
  sections?: TermSection[];
}) {
  const [expandedId, setExpandedId] = useState<number | null>(
    sections[0]?.id ?? null,
  );

  return (
    <SafeAreaView className="flex-1 bg-[#FBF9FC]">
      <AppHeader title="Terms &amp; Conditions" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 6,
          paddingBottom: 30,
        }}
      >
        {/* Meta row */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xs text-[#8A8590]">
            Effective: {effectiveDate}
          </Text>
          <View
            className="rounded-full px-2.5 py-1"
            style={{ backgroundColor: "#EAF0FF" }}
          >
            <Text
              className="text-[11px] font-bold"
              style={{ color: "#2F5FDB" }}
            >
              {version}
            </Text>
          </View>
        </View>

        {/* Intro banner */}
        <View
          className="rounded-2xl p-4 mb-4"
          style={{ backgroundColor: "#FDEDF1" }}
        >
          <Text className="text-xs text-[#6E6875] leading-5">
            Welcome to{" "}
            <Text className="font-extrabold" style={{ color: "#E0405B" }}>
              memillennial
            </Text>
            {intro.replace("memillennial", "").trim()}
          </Text>
        </View>

        {sections.map((section) => (
          <SectionRow
            key={section.id}
            section={section}
            expanded={expandedId === section.id}
            onToggle={() =>
              setExpandedId(expandedId === section.id ? null : section.id)
            }
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
