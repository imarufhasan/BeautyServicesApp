// Shape mirrors what `GET /api/mobile/analytics` would return.
// Swap `getAnalyticsOverview()` for a real fetch() call when the API is ready.

export type RevenuePeriod = "Day" | "Week" | "Month" | "Year";

export interface RevenuePoint {
  label: string;
  value: number;
}

export interface BookingStatusSlice {
  label: string;
  percent: number;
  color: string;
}

export interface PopularService {
  rank: number;
  name: string;
  trend: { direction: "up" | "down"; value: string };
  bookings: number;
  revenue: number;
}

export interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export interface AnalyticsOverview {
  month: string;
  monthlyRevenue: { amount: number; trend: string };
  metrics: {
    totalBookings: { value: number; sublabel: string };
    completedJobs: { value: number; sublabel: string };
    pendingJobs: { value: number; sublabel: string };
    customerRetention: { value: number; sublabel: string };
    repeatClients: { value: number; sublabel: string };
    averageRating: { value: number };
  };
  revenueSeries: Record<RevenuePeriod, RevenuePoint[]>;
  bookingStatus: BookingStatusSlice[];
  popularServices: PopularService[];
  retentionCards: {
    repeatPct: number;
    returningPct: string;
    lifetimeValue: number;
  };
  notificationSettings: NotificationSetting[];
}

const daySeries: RevenuePoint[] = [
  { label: "Mon", value: 420 },
  { label: "Tue", value: 380 },
  { label: "Wed", value: 460 },
  { label: "Thu", value: 850 },
  { label: "Fri", value: 1180 },
  { label: "Sat", value: 1520 },
  { label: "Sun", value: 900 },
];

const weekSeries: RevenuePoint[] = [
  { label: "W1", value: 3200 },
  { label: "W2", value: 3800 },
  { label: "W3", value: 4100 },
  { label: "W4", value: 4300 },
];

const monthSeries: RevenuePoint[] = [
  { label: "Jan", value: 9800 },
  { label: "Feb", value: 10400 },
  { label: "Mar", value: 11200 },
  { label: "Apr", value: 12600 },
  { label: "May", value: 13900 },
  { label: "Jun", value: 15400 },
];

const yearSeries: RevenuePoint[] = [
  { label: "2022", value: 92000 },
  { label: "2023", value: 118000 },
  { label: "2024", value: 146000 },
  { label: "2025", value: 92400 },
];

export function getAnalyticsOverview(): AnalyticsOverview {
  return {
    month: "Jun 2025",
    monthlyRevenue: { amount: 15400, trend: "+13.2% from last month" },
    metrics: {
      totalBookings: { value: 142, sublabel: "This month" },
      completedJobs: { value: 128, sublabel: "90.1%" },
      pendingJobs: { value: 14, sublabel: "9.9%" },
      customerRetention: { value: 68, sublabel: "Repeat clients" },
      repeatClients: { value: 89, sublabel: "of 142 total" },
      averageRating: { value: 4.8 },
    },
    revenueSeries: {
      Day: daySeries,
      Week: weekSeries,
      Month: monthSeries,
      Year: yearSeries,
    },
    bookingStatus: [
      { label: "Completed", percent: 68, color: "#34d399" },
      { label: "Pending", percent: 18, color: "#fb923c" },
      { label: "Cancelled", percent: 8, color: "#f43f5e" },
      { label: "Rescheduled", percent: 6, color: "#a78bfa" },
    ],
    popularServices: [
      {
        rank: 1,
        name: "Bridal Makeup",
        trend: { direction: "up", value: "+24%" },
        bookings: 34,
        revenue: 8160,
      },
      {
        rank: 2,
        name: "Full Makeover",
        trend: { direction: "up", value: "+18%" },
        bookings: 28,
        revenue: 5040,
      },
      {
        rank: 3,
        name: "Facial Treatment",
        trend: { direction: "up", value: "+12%" },
        bookings: 22,
        revenue: 3080,
      },
      {
        rank: 4,
        name: "Hair Styling",
        trend: { direction: "down", value: "-3%" },
        bookings: 19,
        revenue: 2280,
      },
      {
        rank: 5,
        name: "Nail Art",
        trend: { direction: "up", value: "+8%" },
        bookings: 15,
        revenue: 1200,
      },
    ],
    retentionCards: { repeatPct: 68, returningPct: "+12%", lifetimeValue: 420 },
    notificationSettings: [
      {
        id: "push",
        label: "Push Notifications",
        description: "Enable all push notifications",
        enabled: true,
      },
      {
        id: "booking",
        label: "Booking Alerts",
        description: "New and cancelled bookings",
        enabled: true,
      },
      {
        id: "payment",
        label: "Payment Alerts",
        description: "Payments and withdrawals",
        enabled: true,
      },
      {
        id: "review",
        label: "Review Alerts",
        description: "New reviews and responses",
        enabled: false,
      },
      {
        id: "promotion",
        label: "Promotion Alerts",
        description: "Promotion status updates",
        enabled: true,
      },
      {
        id: "system",
        label: "System Notifications",
        description: "App updates and announcements",
        enabled: false,
      },
    ],
  };
}
