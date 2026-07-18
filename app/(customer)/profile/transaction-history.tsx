import AppHeader from "@/components/common/AppHeader";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type Transaction = {
  id: string;
  title: string;
  subtitle: string;
  amount: number; // negative = charge, positive = credit
  date: string;
  txnId: string;
  kind: "charge" | "topup" | "refund" | "redeem";
};

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "t1",
    title: "Bridal Makeup — Emma Chen",
    subtitle: "Visa •••• 4242",
    amount: -185,
    date: "15 Jul 2026",
    txnId: "TXN-8821",
    kind: "charge",
  },
  {
    id: "t2",
    title: "Wallet Top Up",
    subtitle: "Apple Pay",
    amount: 100,
    date: "10 Jul 2026",
    txnId: "TXN-8820",
    kind: "topup",
  },
  {
    id: "t3",
    title: "Refund — Hair Styling",
    subtitle: "Original Payment Method",
    amount: 95,
    date: "20 Jun 2026",
    txnId: "TXN-8819",
    kind: "refund",
  },
  {
    id: "t4",
    title: "Lash Extensions — Sophie Williams",
    subtitle: "Mastercard •••• 8888",
    amount: -120,
    date: "28 Jun 2026",
    txnId: "TXN-8818",
    kind: "charge",
  },
  {
    id: "t5",
    title: "Reward Points Redeemed",
    subtitle: "Wallet",
    amount: -20,
    date: "22 Jun 2026",
    txnId: "TXN-8817",
    kind: "redeem",
  },
  {
    id: "t6",
    title: "Gel Nail Art — Charlotte Davis",
    subtitle: "Visa •••• 4242",
    amount: -65,
    date: "22 Jun 2026",
    txnId: "TXN-8816",
    kind: "charge",
  },
];

const KIND_STYLE: Record<
  Transaction["kind"],
  { bg: string; color: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  charge: { bg: "#FDEDF1", color: "#FC6C8C", icon: "arrow-up-outline" },
  topup: { bg: "#EAF7F3", color: "#1A8073", icon: "arrow-down-outline" },
  refund: { bg: "#EAF7F3", color: "#1A8073", icon: "refresh-outline" },
  redeem: { bg: "#FDEDF1", color: "#FC6C8C", icon: "arrow-up-outline" },
};

const TransactionRow = ({
  txn,
  onDownloadReceipt,
}: {
  txn: Transaction;
  onDownloadReceipt: () => void;
}) => {
  const style = KIND_STYLE[txn.kind];
  const isCredit = txn.amount > 0;
  return (
    <View
      className="flex-row bg-white rounded-[20px] p-4 mb-4"
      style={{ borderColor: "#EFEAF3", borderWidth: 1 }}
    >
      <View
        className="items-center justify-center rounded-2xl mr-3"
        style={{ width: 40, height: 40, backgroundColor: style.bg }}
      >
        <Ionicons name={style.icon} size={16} color={style.color} />
      </View>
      <View className="flex-1">
        <Text
          className="text-sm font-extrabold text-[#161119]"
          numberOfLines={1}
        >
          {txn.title}
        </Text>
        <Text className="text-xs text-[#8A8590] mt-0.5">{txn.subtitle}</Text>
        <View className="flex-row items-center mt-1.5" style={{ gap: 8 }}>
          <Text className="text-[11px] text-[#B0AAB6]">{txn.date}</Text>
          <View
            className="rounded-full px-2 py-0.5"
            style={{ backgroundColor: "#F5F2F7" }}
          >
            <Text className="text-[10px] font-bold text-[#8A8590]">
              {txn.txnId}
            </Text>
          </View>
        </View>
      </View>
      <View className="items-end justify-between">
        <Text
          className="text-sm font-extrabold"
          style={{ color: isCredit ? "#1A9C5A" : "#FC6C8C" }}
        >
          {isCredit ? "+" : "-"}${Math.abs(txn.amount).toFixed(2)}
        </Text>
        <TouchableOpacity
          onPress={onDownloadReceipt}
          className="flex-row items-center mt-1"
        >
          <Ionicons
            name="download-outline"
            size={11}
            color="#FC6C8C"
            style={{ marginRight: 3 }}
          />
          <Text className="text-[11px] font-bold" style={{ color: "#FC6C8C" }}>
            Receipt
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function TransactionHistoryScreen({
  transactions = MOCK_TRANSACTIONS,
  onDownloadReceipt,
}: {
  transactions?: Transaction[];
  onDownloadReceipt?: (id: string) => Promise<void> | void;
}) {
  return (
    <SafeAreaView className="flex-1 bg-[#FBF9FC]">
      <AppHeader title="Transaction History" />
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: 30,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TransactionRow
            txn={item}
            onDownloadReceipt={() => {
              if (onDownloadReceipt) return onDownloadReceipt(item.id);
              // TODO API: await downloadReceiptMutation(item.id)
              console.log("Download receipt:", item.txnId);
            }}
          />
        )}
        ListEmptyComponent={
          <View className="items-center justify-center mt-20">
            <Ionicons name="receipt-outline" size={36} color="#D9D3E0" />
            <Text className="text-sm text-[#8A8590] mt-3">
              No transactions yet.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
