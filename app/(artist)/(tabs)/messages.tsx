import AppTabBar from "@/components/common/AppTabBar";
import { messagesDummyResponse } from "@/constants/dummyData";
import { ChatMessage } from "@/constants/types";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type FilterKey = "All Chats" | "Unread" | "Today" | "Booking";
const FILTERS: FilterKey[] = ["All Chats", "Unread", "Today", "Booking"];

export default function MessagesScreen() {
  const { chats } = messagesDummyResponse.data;
  const [activeFilter, setActiveFilter] = useState<FilterKey>("All Chats");
  const [search, setSearch] = useState("");

  const filtered = chats.filter((c) => {
    const matchesSearch =
      !search || c.clientName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      activeFilter === "All Chats" ||
      (activeFilter === "Unread" && c.unreadCount > 0) ||
      (activeFilter === "Today" &&
        (c.timestamp.includes("m ago") || c.timestamp.includes("h ago"))) ||
      (activeFilter === "Booking" && c.status === "Booking Active");
    return matchesSearch && matchesFilter;
  });

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFA]" edges={["top"]}>
      <Text className="px-5 mb-2 pt-4 text-2xl font-bold text-gray-900">
        Message
      </Text>

      <View
        className="mx-5 h-12 flex-row items-center rounded-2xl bg-white px-4 shadow-sm"
        style={{
          elevation: 2,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.08,
          shadowRadius: 4,
        }}
      >
        <Feather name="search" size={15} color="red" />

        <TextInput
          value={search}
          onChangeText={(text) => setSearch(text)}
          placeholder="Search"
          placeholderTextColor="#9CA3AF"
          className="ml-2 flex-1 text-sm text-gray-700"
        />

        {search.trim().length > 0 && (
          <TouchableOpacity
            onPress={() => setSearch("")}
            activeOpacity={0.7}
            className="ml-2 h-6 w-6 items-center justify-center rounded-full bg-gray-200"
          >
            <Feather name="x" size={14} color="red" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-4 pl-5"
        style={{ flexGrow: 0 }}
      >
        <View className="flex-row" style={{ gap: 8 }}>
          {FILTERS.map((f) => {
            const active = f === activeFilter;
            return (
              <TouchableOpacity
                key={f}
                onPress={() => setActiveFilter(f)}
                className={`rounded-full px-4 py-2 ${active ? "bg-rose-400" : "bg-white"}`}
                style={
                  !active
                    ? { borderWidth: 1, borderColor: "#F3F4F6" }
                    : undefined
                }
              >
                <Text
                  className={`text-xs font-semibold ${active ? "text-white" : "text-gray-500"}`}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* <ScrollView
        className="mt-4 flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 12 }}
      >
        {filtered.map((c) => (
          <ChatRow key={c.id} chat={c} />
        ))}
        {filtered.length === 0 && (
          <Text className="mt-8 text-center text-sm text-gray-400">
            No conversations found.
          </Text>
        )}

        <View className="mt-2 rounded-2xl border border-amber-100 bg-amber-50 mb-2 px-4 py-3">
          <Text className="text-center text-[12px] text-amber-700">
            Chats are monitored to ensure quality assurance, security, and
            regulatory compliance
          </Text>
        </View>
      </ScrollView> */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        className="mt-4 px-5 flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
        renderItem={({ item }) => <ChatRow chat={item} />}
        ListEmptyComponent={() => (
          <Text className="mt-8 text-center text-sm text-gray-400">
            No conversations found.
          </Text>
        )}
        ListFooterComponent={() => (
          <View className="mt-2 mb-2 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
            <Text className="text-center text-[12px] text-amber-700">
              Chats are monitored to ensure quality assurance, security, and
              regulatory compliance
            </Text>
          </View>
        )}
        removeClippedSubviews
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />

      <AppTabBar active="Messages" />
    </SafeAreaView>
  );
}

function ChatRow({ chat }: { chat: ChatMessage }) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() =>
        router.push({
          pathname: "/(common)/chatScreen",
          params: {
            id: chat.id,
          },
        })
      }
      className="mb-3 flex-row items-center rounded-3xl bg-white p-3 shadow-sm"
    >
      <View className="relative">
        <View
          className="h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: chat.avatarColor }}
        >
          <Text className="text-sm font-bold text-gray-700">
            {chat.clientInitials}
          </Text>
        </View>
        {chat.isOnline && (
          <View className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
        )}
      </View>

      <View className="ml-3 flex-1">
        <View className="flex-row items-center justify-between">
          <Text className="text-[15px] font-bold text-gray-900">
            {chat.clientName}
          </Text>
          <Text className="text-[11px] text-gray-400">{chat.timestamp}</Text>
        </View>
        <Text className="text-[11px] text-gray-400">{chat.bookingRefId}</Text>
        <View className="mt-1 flex-row items-center justify-between">
          <Text className="flex-1 text-[13px] text-gray-500" numberOfLines={1}>
            {chat.lastMessage}
          </Text>
          {chat.unreadCount > 0 && (
            <View className="ml-2 h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-400 px-1.5">
              <Text className="text-[11px] font-bold text-white">
                {chat.unreadCount}
              </Text>
            </View>
          )}
        </View>
        <View
          className={`mt-1.5 self-start rounded-full px-2.5 py-0.5 ${
            chat.status === "Booking Active" ? "bg-emerald-50" : "bg-gray-100"
          }`}
        >
          <Text
            className={`text-[10px] font-semibold ${
              chat.status === "Booking Active"
                ? "text-emerald-500"
                : "text-gray-400"
            }`}
          >
            {chat.status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
