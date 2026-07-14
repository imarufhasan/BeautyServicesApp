import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  ImageSourcePropType,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type Conversation = {
  id: string;
  name: string;
  avatar: ImageSourcePropType;
  verified: boolean;
  online: boolean;
  lastMessage: string;
  isTyping?: boolean;
  timestamp: string; // e.g. "2m ago", "Yesterday", "Mon"
  refCode: string; // e.g. "BK-2826-001"
  unreadCount?: number;
};

// ---------------------------------------------------------------------------
// Mock data — replace with real API data (Socket.IO / RTK Query) per user
// ---------------------------------------------------------------------------
const AVATAR_1 = require("../../../assets/images/home/pic1.png");
const AVATAR_2 = require("../../../assets/images/home/pic2.png");
const AVATAR_3 = require("../../../assets/images/home/pic3.png");
const AVATAR_4 = require("../../../assets/images/home/pic4.png");
const AVATAR_5 = require("../../../assets/images/home/pic1.png");

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    name: "Emma Chen",
    avatar: AVATAR_1,
    verified: true,
    online: true,
    lastMessage: "See you tomorrow at 10:00 AM! \u{1F44D}",
    timestamp: "2m ago",
    refCode: "BK-2826-001",
    unreadCount: 2,
  },
  {
    id: "c2",
    name: "Sophie Williams",
    avatar: AVATAR_2,
    verified: true,
    online: true,
    lastMessage: "Typing...",
    isTyping: true,
    timestamp: "Yesterday",
    refCode: "BK-2826-002",
  },
  {
    id: "c3",
    name: "Charlotte Davis",
    avatar: AVATAR_3,
    verified: true,
    online: false,
    lastMessage: "Booking confirmed \u2713 Can't wait!",
    timestamp: "Mon",
    refCode: "BK-2826-003",
  },
  {
    id: "c4",
    name: "Olivia Brown",
    avatar: AVATAR_4,
    verified: true,
    online: false,
    lastMessage: "Hi, can we reschedule to next Thursday?",
    timestamp: "Sun",
    refCode: "BK-2826-004",
    unreadCount: 1,
  },
  {
    id: "c5",
    name: "Isla Thompson",
    avatar: AVATAR_5,
    verified: true,
    online: false,
    lastMessage: "Your appointment is confirmed for 20 Jul",
    timestamp: "Sat",
    refCode: "BK-2826-005",
  },
];

// ---------------------------------------------------------------------------
// Conversation row
// ---------------------------------------------------------------------------
const ConversationRow = ({ conversation }: { conversation: Conversation }) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={() =>
      router.push({
        pathname: "/ChatScreen",
        params: { id: conversation.id },
      })
    }
    className="flex-row items-start py-3"
  >
    <View>
      <Image
        source={conversation.avatar}
        style={{ width: 48, height: 48, borderRadius: 24 }}
        resizeMode="cover"
      />
      {conversation.online && (
        <View
          className="absolute bottom-0 left-0 rounded-full border-2 border-white"
          style={{ width: 12, height: 12, backgroundColor: "#3CC26B" }}
        />
      )}
    </View>

    <View className="flex-1 ml-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1 pr-2">
          <Text
            className="text-sm font-extrabold text-[#161119]"
            numberOfLines={1}
          >
            {conversation.name}
          </Text>
          {conversation.verified && (
            <Ionicons
              name="checkmark-circle"
              size={13}
              color="#48B9A8"
              style={{ marginLeft: 4 }}
            />
          )}
        </View>
        <Text className="text-[10px] text-[#B0AAB6]">
          {conversation.timestamp}
        </Text>
      </View>

      <Text
        numberOfLines={1}
        className="text-xs mt-1"
        style={{
          color: conversation.isTyping ? "#FC6C8C" : "#6E6875",
          fontStyle: conversation.isTyping ? "italic" : "normal",
        }}
      >
        {conversation.lastMessage}
      </Text>

      <Text className="text-[10px] text-[#B0AAB6] mt-1">
        Ref: {conversation.refCode}
      </Text>
    </View>

    {!!conversation.unreadCount && (
      <View
        className="items-center justify-center rounded-full ml-2"
        style={{
          minWidth: 20,
          height: 20,
          paddingHorizontal: 5,
          backgroundColor: "#FC6C8C",
        }}
      >
        <Text className="text-[10px] font-bold text-white">
          {conversation.unreadCount}
        </Text>
      </View>
    )}
  </TouchableOpacity>
);

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------
export default function MessagesScreen({
  conversations = MOCK_CONVERSATIONS,
}: {
  conversations?: Conversation[];
}) {
  const [search, setSearch] = useState("");

  const totalUnread = useMemo(
    () => conversations.reduce((sum, c) => sum + (c.unreadCount ?? 0), 0),
    [conversations],
  );

  const filteredConversations = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((c) => c.name.toLowerCase().includes(q));
  }, [conversations, search]);

  return (
    <SafeAreaView className="flex-1 bg-[#FBF9FC]" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center justify-center px-5 pt-3 pb-2">
        <Text className="text-lg font-extrabold text-[#161119]">Messages</Text>
        {totalUnread > 0 && (
          <View
            className="items-center justify-center rounded-full ml-2"
            style={{
              minWidth: 20,
              height: 20,
              paddingHorizontal: 5,
              backgroundColor: "#E0405B",
            }}
          >
            <Text className="text-[10px] font-bold text-white">
              {totalUnread}
            </Text>
          </View>
        )}
      </View>

      {/* Search */}
      <View className="px-5 mt-1 mb-2">
        <View
          className="flex-row items-center bg-white rounded-full px-4"
          style={{ borderColor: "#EFEAF3", borderWidth: 1, height: 44 }}
        >
          <Ionicons name="search-outline" size={16} color="#B0AAB6" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search messages..."
            placeholderTextColor="#B0AAB6"
            className="flex-1 text-xs text-[#161119] ml-2"
          />
        </View>
      </View>

      {/* Conversation list */}
      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View className="h-[1px] bg-[#F0EEF2]" />}
        renderItem={({ item }) => <ConversationRow conversation={item} />}
        ListFooterComponent={
          <View
            className="rounded-[16px] px-4 py-3 mt-5"
            style={{
              backgroundColor: "#FBF6E9",
              borderColor: "#EAD9A0",
              borderWidth: 1,
            }}
          >
            <Text className="text-[11px] text-[#8A7A3D] leading-4 text-center">
              Chats are monitored to ensure quality assurance, security, and
              regulatory compliance.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View className="items-center justify-center mt-20">
            <Ionicons name="chatbubble-outline" size={36} color="#D9D3E0" />
            <Text className="text-sm text-[#8A8590] mt-3">
              No conversations found.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
