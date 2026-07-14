import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type ChatMessage = {
  id: string;
  text: string;
  fromMe: boolean;
  timestamp: string; // e.g. "2:10 PM"
  dateGroup: string; // e.g. "Yesterday", "Today"
  seen?: boolean; // only relevant for fromMe messages
};

export type ChatParams = {
  conversationId: string;
  name: string;
  avatar: ImageSourcePropType;
  online: boolean;
  linkedBookingId?: string; // e.g. "BK-4821"
  linkedBookingTitle?: string; // e.g. "Full Glam Makeup"
};

// ---------------------------------------------------------------------------
// Mock data — replace with real API/socket data
// ---------------------------------------------------------------------------
const AVATAR = require("../../assets/images/home/pic2.png");
const MY_AVATAR = require("../../assets/images/home/pic1.png");

const DUMMY_PARAMS: ChatParams = {
  conversationId: "c2",
  name: "Sophie Laurent",
  avatar: AVATAR,
  online: true,
  linkedBookingId: "BK-4821",
  linkedBookingTitle: "Full Glam Makeup",
};

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: "m1",
    text: "Your look is going to be absolutely stunning \u2728",
    fromMe: false,
    timestamp: "2:10 PM",
    dateGroup: "Yesterday",
  },
  {
    id: "m2",
    text: "I loved your editorial portfolio! I'm thinking soft glam with a dewy finish?",
    fromMe: true,
    timestamp: "2:15 PM",
    dateGroup: "Yesterday",
    seen: true,
  },
  {
    id: "m3",
    text: "That's my specialty! I'll prepare some mood boards for our appointment \u{1F484}",
    fromMe: false,
    timestamp: "2:18 PM",
    dateGroup: "Yesterday",
  },
  {
    id: "m4",
    text: "Hi Jessica! \u{1F484} I'm confirming your appointment for tomorrow at 10:30 AM \u2014 can't wait to create your look!",
    fromMe: false,
    timestamp: "9:15 AM",
    dateGroup: "Today",
  },
  {
    id: "m5",
    text: "Thank you Sophie! I'm so excited. Do I need to bring anything?",
    fromMe: true,
    timestamp: "9:20 AM",
    dateGroup: "Today",
    seen: true,
  },
  {
    id: "m6",
    text: "Just come with a freshly cleansed face \u2014 I'll bring everything else!",
    fromMe: false,
    timestamp: "9:22 AM",
    dateGroup: "Today",
  },
];

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------
const DateSeparator = ({ label }: { label: string }) => (
  <View className="items-center my-4">
    <Text className="text-[11px] font-bold text-[#B0AAB6]">{label}</Text>
  </View>
);

const MessageBubble = ({
  message,
  avatar,
}: {
  message: ChatMessage;
  avatar: ImageSourcePropType;
}) => {
  if (message.fromMe) {
    return (
      <View className="items-end mb-3">
        <LinearGradient
          colors={[COLORS.baseColor1, COLORS.baseColor2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 18,
            borderBottomRightRadius: 4,
            paddingHorizontal: 14,
            paddingVertical: 10,
            maxWidth: "78%",
          }}
        >
          <Text className="text-sm text-white leading-5">{message.text}</Text>
        </LinearGradient>
        <View className="flex-row items-center mt-1">
          {message.seen && (
            <Ionicons
              name="checkmark-done"
              size={12}
              color="#48B9A8"
              style={{ marginRight: 4 }}
            />
          )}
          <Text className="text-[10px] text-[#B0AAB6]">
            {message.timestamp}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-row items-end mb-3" style={{ maxWidth: "82%" }}>
      <Image
        source={avatar}
        style={{ width: 26, height: 26, borderRadius: 13, marginRight: 8 }}
        resizeMode="cover"
      />
      <View>
        <View
          className="bg-white rounded-[18px] px-3.5 py-2.5"
          style={{
            borderBottomLeftRadius: 4,
            borderColor: "#F0EEF2",
            borderWidth: 1,
          }}
        >
          <Text className="text-sm text-[#161119] leading-5">
            {message.text}
          </Text>
        </View>
        <Text className="text-[10px] text-[#B0AAB6] mt-1 ml-1">
          {message.timestamp}
        </Text>
      </View>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------
export default function ChatScreen({
  params = DUMMY_PARAMS,
  messages: initialMessages = MOCK_MESSAGES,
}: {
  params?: ChatParams;
  messages?: ChatMessage[];
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");

  // Group messages by dateGroup while preserving order
  const groupedEntries: { dateGroup: string; items: ChatMessage[] }[] = [];
  for (const msg of messages) {
    const lastGroup = groupedEntries[groupedEntries.length - 1];
    if (lastGroup && lastGroup.dateGroup === msg.dateGroup) {
      lastGroup.items.push(msg);
    } else {
      groupedEntries.push({ dateGroup: msg.dateGroup, items: [msg] });
    }
  }

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;

    const newMessage: ChatMessage = {
      id: `local-${Date.now()}`,
      text,
      fromMe: true,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      dateGroup: "Today",
      seen: false,
    };

    setMessages((prev) => [...prev, newMessage]);
    setDraft("");
    // TODO: emit via Socket.IO to actually send the message
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FBF9FC]">
      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-2xl bg-white items-center justify-center mr-3"
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowRadius: 6,
            elevation: 1,
          }}
        >
          <Ionicons name="arrow-back" size={18} color="#161119" />
        </TouchableOpacity>

        <Image
          source={params.avatar}
          style={{ width: 36, height: 36, borderRadius: 18 }}
          resizeMode="cover"
        />

        <View className="flex-1 ml-2.5">
          <Text className="text-sm font-extrabold text-[#161119]">
            {params.name}
          </Text>
          {params.online && (
            <View className="flex-row items-center mt-0.5">
              <View
                className="rounded-full mr-1"
                style={{ width: 7, height: 7, backgroundColor: "#3CC26B" }}
              />
              <Text className="text-[11px] text-[#3CC26B] font-bold">
                Online now
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity className="w-9 h-9 items-center justify-center">
          <Ionicons name="ellipsis-vertical" size={18} color="#161119" />
        </TouchableOpacity>
      </View>

      {/* Linked booking banner */}
      {params.linkedBookingId && (
        <View className="px-5 mb-2">
          <View
            className="flex-row items-center justify-between bg-white rounded-[16px] px-4 py-3"
            style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
          >
            <View className="flex-1 pr-2">
              <Text className="text-[10px] text-[#8A8590]">Linked Booking</Text>
              <Text
                className="text-xs font-bold text-[#161119] mt-0.5"
                numberOfLines={1}
              >
                #{params.linkedBookingId} · {params.linkedBookingTitle}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                // router.push({
                //   pathname: "/booking-details/[id]",
                //   params: { id: params.linkedBookingId },
                // })
                {}
              }
              className="rounded-full px-3 py-1.5 border"
              style={{ borderColor: "#FFA230" }}
            >
              <Text
                className="text-[11px] font-bold"
                style={{ color: "#FFA230" }}
              >
                View Booking
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Message list */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 12 }}
      >
        {groupedEntries.map((group) => (
          <View key={group.dateGroup}>
            <DateSeparator label={group.dateGroup} />
            {group.items.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                avatar={params.avatar}
              />
            ))}
          </View>
        ))}
      </ScrollView>

      {/* Input bar */}
      <View
        className="flex-row items-center px-4 py-3"
        style={{ borderTopWidth: 1, borderTopColor: "#EFEAF3" }}
      >
        <TouchableOpacity className="w-9 h-9 items-center justify-center">
          <Ionicons name="happy-outline" size={20} color="#B0AAB6" />
        </TouchableOpacity>

        <View
          className="flex-1 flex-row items-center bg-[#F5F2F7] rounded-full px-4 mx-2"
          style={{ height: 44 }}
        >
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Type a message..."
            placeholderTextColor="#B0AAB6"
            className="flex-1 text-sm text-[#161119]"
            multiline
          />
        </View>

        <TouchableOpacity className="w-9 h-9 items-center justify-center mr-1">
          <Ionicons name="attach-outline" size={20} color="#B0AAB6" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSend}
          className="w-10 h-10 rounded-full items-center justify-center bg-[#EFEAF3]"
        >
          <Ionicons name="send" size={16} color="#8A8590" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
