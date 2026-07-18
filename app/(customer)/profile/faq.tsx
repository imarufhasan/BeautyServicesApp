import AppHeader from "@/components/common/AppHeader";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type FAQItem = { id: string; question: string; answer: string };

const MOCK_FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "How do I reschedule a booking?",
    answer:
      "You can reschedule a booking up to 24 hours before your appointment. Go to Booking History, select the booking and tap 'Reschedule'. Rescheduling within 24 hours may incur a $15 fee.",
  },
  {
    id: "faq-2",
    question: "What happens if my artist is late?",
    answer:
      "If your artist is running late, you'll get a notification with an updated arrival time. If they're more than 30 minutes late without notice, you're eligible for a partial refund or free rebooking.",
  },
  {
    id: "faq-3",
    question: "Can I book multiple services at once?",
    answer:
      "Yes! When booking, tap 'Add Another Service' to bundle multiple treatments into a single appointment, subject to the artist's availability.",
  },
];

const FAQRow = ({
  item,
  expanded,
  onToggle,
}: {
  item: FAQItem;
  expanded: boolean;
  onToggle: () => void;
}) => (
  <View>
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onToggle}
      className="flex-row items-center justify-between py-4"
    >
      <Text className="text-sm font-extrabold text-[#161119] flex-1 pr-3">
        {item.question}
      </Text>
      <Ionicons
        name={expanded ? "chevron-up" : "chevron-down"}
        size={16}
        color={expanded ? "#FC6C8C" : "#B0AAB6"}
      />
    </TouchableOpacity>
    {expanded && (
      <View className="pb-4">
        <View
          className="rounded-2xl p-3.5"
          style={{ backgroundColor: "#FDEDF1" }}
        >
          <Text className="text-xs text-[#6E6875] leading-5">
            {item.answer}
          </Text>
        </View>
      </View>
    )}
    <View className="h-[1px] bg-[#F0EEF2]" />
  </View>
);

export default function FAQScreen({ faqs = MOCK_FAQS }: { faqs?: FAQItem[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(
    faqs[0]?.id ?? null,
  );

  return (
    <SafeAreaView className="flex-1 bg-[#FBF9FC]">
      <AppHeader title="FAQ" />
      <View className="px-5 pt-3">
        <View
          className="bg-white rounded-[20px] px-4"
          style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
        >
          {faqs.map((item, idx) => (
            <FAQRow
              key={item.id}
              item={item}
              expanded={expandedId === item.id}
              onToggle={() =>
                setExpandedId(expandedId === item.id ? null : item.id)
              }
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
