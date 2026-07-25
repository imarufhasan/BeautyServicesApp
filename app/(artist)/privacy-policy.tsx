import AppHeader from "@/components/common/AppHeader";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type PolicySection = {
  id: number;
  title: string;
  body: string;
};

const SECTIONS: PolicySection[] = [
  {
    id: 1,
    title: "Information We Collect",
    body: "We collect information you provide directly when registering or using Glamr: your name, email, phone number, date of birth, profile photo, and payment details. We also collect usage data including bookings made, services viewed, and interaction patterns to improve your experience.",
  },
  {
    id: 2,
    title: "How We Use Your Information",
    body: "Your information is used to facilitate and confirm bookings, process payments, send appointment reminders, personalise your experience, and improve our platform. Aggregated, anonymised data may be used for analytics and platform improvements.",
  },
  {
    id: 3,
    title: "Information Sharing",
    body: "We share your name and contact details with your booked artist so they can prepare and communicate with you. We do not sell your personal data. Trusted service providers operating under strict confidentiality agreements may access limited data to operate the platform.",
  },
  {
    id: 4,
    title: "Data Security",
    body: "We implement industry-standard safeguards including 256-bit TLS encryption in transit, AES-256 encryption at rest, two-factor authentication, and regular third-party security audits to protect your information from unauthorised access.",
  },
  {
    id: 5,
    title: "Your Rights",
    body: "You can access, update, or delete your personal information at any time from your account settings. You may also request a copy of the data we hold about you, or ask us to restrict certain processing, by contacting our support team.",
  },
  {
    id: 6,
    title: "Cookies & Tracking",
    body: "We use cookies and similar technologies to keep you signed in, remember your preferences, and understand how you use the app. You can manage cookie preferences from your device or browser settings at any time.",
  },
  {
    id: 7,
    title: "Children's Privacy",
    body: "Glamr is not intended for users under the age of 16. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal data, we will delete it promptly.",
  },
  {
    id: 8,
    title: "Changes to This Policy",
    body: "We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We'll notify you of material changes via email or an in-app notice before they take effect.",
  },
];

const SectionCard = ({ section }: { section: PolicySection }) => (
  <View
    className="bg-white rounded-[20px] p-4 mb-4"
    style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
  >
    <View className="flex-row items-start">
      <View
        className="items-center justify-center rounded-full mr-3"
        style={{ width: 26, height: 26, backgroundColor: "#FC6C8C" }}
      >
        <Text className="text-white text-xs font-extrabold">{section.id}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-sm font-extrabold text-[#161119]">
          {section.title}
        </Text>
        <Text className="text-xs text-[#8A8590] mt-2 leading-5">
          {section.body}
        </Text>
      </View>
    </View>
  </View>
);

export default function PrivacyPolicyScreen({
  lastUpdated = "1 June 2026",
  version = "v2.4",
  sections = SECTIONS,
}: {
  lastUpdated?: string;
  version?: string;
  sections?: PolicySection[];
}) {
  return (
    <SafeAreaView className="flex-1 bg-[#FBF9FC]">
      <AppHeader title="Privacy Policy" />

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
            Last updated: {lastUpdated}
          </Text>
          <View
            className="rounded-full px-2.5 py-1"
            style={{ backgroundColor: "#EAF7F3" }}
          >
            <Text
              className="text-[11px] font-bold"
              style={{ color: "#1A8073" }}
            >
              {version}
            </Text>
          </View>
        </View>

        {sections.map((section) => (
          <SectionCard key={section.id} section={section} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
