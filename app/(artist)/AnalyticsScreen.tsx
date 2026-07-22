import { LinearGradient } from "expo-linear-gradient";
import {
    ArrowDownRight,
    ArrowUpRight,
    Calendar,
    DollarSign,
} from "lucide-react-native";
import React, { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Svg, {
    Circle,
    Defs,
    Line,
    Path,
    Stop,
    LinearGradient as SvgLinearGradient,
    Text as SvgText,
} from "react-native-svg";

type Range = "Day" | "Week" | "Month" | "Year";

const dataByRange: Record<Range, number[]> = {
  Day: [400, 200, 300, 800, 1100, 1500, 700],
  Week: [900, 1200, 1000, 1400, 1800, 2000, 1600],
  Month: [4000, 4200, 3900, 4700, 5100, 5400, 5000],
  Year: [40000, 42000, 39000, 47000, 51000, 54000, 50000],
};
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const donutData = [
  { label: "Completed", value: 68, color: "#10b981" },
  { label: "Pending", value: 18, color: "#f59e0b" },
  { label: "Cancelled", value: 8, color: "#ef4444" },
  { label: "Rescheduled", value: 6, color: "#a78bfa" },
];

const services = [
  { name: "Bridal Makeup", change: 24, bookings: 34, revenue: 8160, pct: 100 },
  { name: "Full Makeover", change: 18, bookings: 28, revenue: 5040, pct: 82 },
  {
    name: "Facial Treatment",
    change: 12,
    bookings: 22,
    revenue: 3080,
    pct: 65,
  },
  { name: "Hair Styling", change: -3, bookings: 19, revenue: 2280, pct: 55 },
  { name: "Nail Art", change: 8, bookings: 15, revenue: 1200, pct: 44 },
];

function KPI({
  label,
  value,
  sub,
  valueColor,
}: {
  label: string;
  value: string;
  sub: string;
  valueColor: string;
}) {
  return (
    <View className="w-[47%] rounded-2xl bg-white p-4 shadow-sm">
      <Text className="text-xs text-gray-400">{label}</Text>
      <Text className="mt-1 text-2xl font-bold" style={{ color: valueColor }}>
        {value}
      </Text>
      <Text className="mt-0.5 text-[11px] text-gray-400">{sub}</Text>
    </View>
  );
}

function LineChart({ values }: { values: number[] }) {
  const w = 300;
  const h = 150;
  const max = Math.max(...Object.values(dataByRange).flat());
  const stepX = w / (values.length - 1);
  const points = values.map((v, i) => [i * stepX, h - (v / max) * h]);
  const path = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`)
    .join(" ");
  const area = `${path} L${w},${h} L0,${h} Z`;

  return (
    <Svg width="100%" height={h + 24} viewBox={`0 0 ${w} ${h + 24}`}>
      <Defs>
        <SvgLinearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#f43f5e" stopOpacity={0.25} />
          <Stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
        </SvgLinearGradient>
      </Defs>
      {[0, 0.25, 0.5, 0.75, 1].map((f) => (
        <Line
          key={f}
          x1={0}
          x2={w}
          y1={h * f}
          y2={h * f}
          stroke="#f1f1f4"
          strokeWidth={1}
        />
      ))}
      <Path d={area} fill="url(#fill)" />
      <Path d={path} fill="none" stroke="#f43f5e" strokeWidth={2.5} />
      {points.map(([x, y], i) => (
        <Circle
          key={i}
          cx={x}
          cy={y}
          r={4}
          fill="white"
          stroke="#f43f5e"
          strokeWidth={2}
        />
      ))}
      {days.map((d, i) => (
        <SvgText
          key={d}
          x={i * stepX}
          y={h + 18}
          fontSize={10}
          fill="#9ca3af"
          textAnchor="middle"
        >
          {d}
        </SvgText>
      ))}
    </Svg>
  );
}

function Donut({ data }: { data: typeof donutData }) {
  const size = 130;
  const r = 50;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  let offsetAcc = 0;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {data.map((d) => {
        const dash = (d.value / 100) * circumference;
        const el = (
          <Circle
            key={d.label}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={d.color}
            strokeWidth={15}
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-offsetAcc}
            originX={cx}
            originY={cy}
            rotation={-90}
          />
        );
        offsetAcc += dash;
        return el;
      })}
    </Svg>
  );
}

function NotifRow({
  title,
  sub,
  value,
  onValueChange,
  isLast,
}: {
  title: string;
  sub: string;
  value: boolean;
  onValueChange: () => void;
  isLast?: boolean;
}) {
  return (
    <View
      className={`flex-row items-center justify-between py-3 ${
        !isLast ? "border-b border-gray-100" : ""
      }`}
    >
      <View className="flex-1 pr-3">
        <Text className="text-sm font-medium text-gray-900">{title}</Text>
        <Text className="text-xs text-gray-400">{sub}</Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onValueChange}
        className={`h-7 w-12 justify-center rounded-full px-0.5 ${value ? "" : "bg-gray-200"}`}
      >
        {value ? (
          <LinearGradient
            colors={["#ec4899", "#fb923c"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="absolute h-7 w-12 rounded-full"
          />
        ) : null}
        <View
          className={`h-6 w-6 rounded-full bg-white shadow ${value ? "translate-x-5" : "translate-x-0"}`}
        />
      </TouchableOpacity>
    </View>
  );
}

export default function AnalyticsScreen() {
  const [range, setRange] = useState<Range>("Day");
  const [notifs, setNotifs] = useState({
    push: true,
    booking: true,
    payment: true,
    review: false,
    promo: true,
    system: false,
  });

  const toggleNotif = (key: keyof typeof notifs) =>
    setNotifs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pb-4 pt-4">
          <Text className="text-xl font-bold text-gray-900">Analytics</Text>
          <TouchableOpacity className="flex-row items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm">
            <Calendar size={13} color="#4b5563" />
            <Text className="text-xs font-medium text-gray-600">Jun 2025</Text>
          </TouchableOpacity>
        </View>

        <View className="gap-4 px-4">
          {/* Revenue hero */}
          <View className="flex-row items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
            <View>
              <Text className="text-xs text-gray-400">Monthly Revenue</Text>
              <Text className="mt-1 text-3xl font-bold text-gray-900">
                $15,400
              </Text>
              <View className="mt-1 flex-row items-center gap-1">
                <ArrowUpRight size={13} color="#10b981" />
                <Text className="text-xs font-medium text-emerald-500">
                  +13.2% from last month
                </Text>
              </View>
            </View>
            <View className="h-11 w-11 items-center justify-center rounded-full bg-pink-50">
              <DollarSign size={20} color="#ec4899" />
            </View>
          </View>

          {/* KPI grid */}
          <View className="flex-row flex-wrap justify-between gap-y-3">
            <KPI
              label="Total Bookings"
              value="142"
              sub="This month"
              valueColor="#f43f5e"
            />
            <KPI
              label="Completed Jobs"
              value="128"
              sub="90.1%"
              valueColor="#10b981"
            />
            <KPI
              label="Pending Jobs"
              value="14"
              sub="9.9%"
              valueColor="#f59e0b"
            />
            <KPI
              label="Customer Retention"
              value="68%"
              sub="Repeat clients"
              valueColor="#8b5cf6"
            />
            <KPI
              label="Repeat Clients"
              value="89"
              sub="of 142 total"
              valueColor="#f43f5e"
            />
            <KPI
              label="Average Rating"
              value="4.8"
              sub="★★★★★"
              valueColor="#f59e0b"
            />
          </View>

          {/* Revenue analytics */}
          <View className="rounded-2xl bg-white p-4 shadow-sm">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-sm font-bold text-gray-900">
                Revenue Analytics
              </Text>
              <View className="flex-row gap-1 rounded-full bg-gray-100 p-1">
                {(Object.keys(dataByRange) as Range[]).map((r) => (
                  <TouchableOpacity key={r} onPress={() => setRange(r)}>
                    {range === r ? (
                      <LinearGradient
                        colors={["#ec4899", "#fb923c"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        className="rounded-full px-2.5 py-1"
                      >
                        <Text className="text-[11px] font-medium text-white">
                          {r.slice(0, 3)}
                        </Text>
                      </LinearGradient>
                    ) : (
                      <View className="rounded-full px-2.5 py-1">
                        <Text className="text-[11px] font-medium text-gray-500">
                          {r.slice(0, 3)}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <LineChart values={dataByRange[range]} />
          </View>

          {/* Booking statistics */}
          <View className="rounded-2xl bg-white p-4 shadow-sm">
            <Text className="mb-3 text-sm font-bold text-gray-900">
              Booking Statistics
            </Text>
            <View className="flex-row items-center gap-6">
              <Donut data={donutData} />
              <View className="flex-1 gap-2">
                {donutData.map((d) => (
                  <View
                    key={d.label}
                    className="flex-row items-center justify-between"
                  >
                    <View className="flex-row items-center gap-2">
                      <View
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: d.color }}
                      />
                      <Text className="text-xs text-gray-600">{d.label}</Text>
                    </View>
                    <Text className="text-xs font-semibold text-gray-900">
                      {d.value}%
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Popular services */}
          <View className="rounded-2xl bg-white p-4 shadow-sm">
            <Text className="mb-3 text-sm font-bold text-gray-900">
              Popular Services
            </Text>
            <View className="gap-3">
              {services.map((s, i) => (
                <View key={s.name}>
                  <View className="mb-1 flex-row items-center justify-between">
                    <View className="flex-1 flex-row items-center gap-2">
                      <Text className="text-xs font-semibold text-gray-300">
                        #{i + 1}
                      </Text>
                      <Text className="text-sm text-gray-800">{s.name}</Text>
                      <View className="flex-row items-center gap-0.5">
                        {s.change >= 0 ? (
                          <ArrowUpRight size={12} color="#10b981" />
                        ) : (
                          <ArrowDownRight size={12} color="#f43f5e" />
                        )}
                        <Text
                          className="text-xs font-medium"
                          style={{
                            color: s.change >= 0 ? "#10b981" : "#f43f5e",
                          }}
                        >
                          {Math.abs(s.change)}%
                        </Text>
                      </View>
                    </View>
                    <View className="items-end">
                      <Text className="text-xs text-gray-400">
                        {s.bookings} bk
                      </Text>
                      <Text className="text-xs text-gray-500">
                        ${s.revenue.toLocaleString()}
                      </Text>
                    </View>
                  </View>
                  <View className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                    <LinearGradient
                      colors={["#ec4899", "#fb923c"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{
                        width: `${s.pct}%`,
                        height: "100%",
                        borderRadius: 999,
                      }}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Customer retention */}
          <View className="rounded-2xl bg-white p-4 shadow-sm">
            <Text className="mb-3 text-sm font-bold text-gray-900">
              Customer Retention
            </Text>
            <View className="flex-row gap-2">
              <View className="flex-1 items-center rounded-xl bg-emerald-50 p-3">
                <Text className="text-[10px] text-gray-400">Repeat %</Text>
                <Text className="text-lg font-bold text-emerald-500">68%</Text>
              </View>
              <View className="flex-1 items-center rounded-xl bg-rose-50 p-3">
                <Text className="text-[10px] text-gray-400">Returning</Text>
                <Text className="text-lg font-bold text-rose-500">+12%</Text>
              </View>
              <View className="flex-1 items-center rounded-xl bg-amber-50 p-3">
                <Text className="text-[10px] text-gray-400">Lifetime Val</Text>
                <Text className="text-lg font-bold text-amber-500">$420</Text>
              </View>
            </View>
          </View>

          {/* Notification settings */}
          <View className="rounded-2xl bg-white p-4 shadow-sm">
            <Text className="mb-1 text-sm font-bold text-gray-900">
              Notification Settings
            </Text>
            <NotifRow
              title="Push Notifications"
              sub="Enable all push notifications"
              value={notifs.push}
              onValueChange={() => toggleNotif("push")}
            />
            <NotifRow
              title="Booking Alerts"
              sub="New and cancelled bookings"
              value={notifs.booking}
              onValueChange={() => toggleNotif("booking")}
            />
            <NotifRow
              title="Payment Alerts"
              sub="Payments and withdrawals"
              value={notifs.payment}
              onValueChange={() => toggleNotif("payment")}
            />
            <NotifRow
              title="Review Alerts"
              sub="New reviews and responses"
              value={notifs.review}
              onValueChange={() => toggleNotif("review")}
            />
            <NotifRow
              title="Promotion Alerts"
              sub="Promotion status updates"
              value={notifs.promo}
              onValueChange={() => toggleNotif("promo")}
            />
            <NotifRow
              title="System Notifications"
              sub="App updates and announcements"
              value={notifs.system}
              onValueChange={() => toggleNotif("system")}
              isLast
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
