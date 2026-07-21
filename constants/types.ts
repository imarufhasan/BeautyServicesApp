// types.ts
// NOTE: These types mirror how the real API responses will look.
// Jokhon API ready hobe, shudhu dummyData.ts file ta remove kore
// RTK Query hook diye replace korle UI/component kono change lagbe na.

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface DaySchedule {
  day: DayOfWeek;
  isActive: boolean;
  startTime: string | null; // e.g. "09:00 AM"
  endTime: string | null; // e.g. "06:00 PM"
  hasBreak: boolean;
  breakFrom?: string;
  breakTo?: string;
  hasEveningSession: boolean;
}

export interface BlockedDate {
  id: string;
  date: string; // "2026-07-10"
  label: string; // "Fri, Jul 10"
  reason: string;
}

export type CalendarDayStatus =
  "available" | "booked" | "blocked" | "vacation" | "today" | "none";

export interface CalendarDay {
  date: string; // "2026-07-02"
  day: number;
  status: CalendarDayStatus;
}

export interface AvailabilityApiResponse {
  success: boolean;
  data: {
    todayStatus: {
      date: string; // "Thursday, July 2"
      isAvailableToday: boolean;
      workingHours: string; // "9:00 AM – 6:00 PM"
      nextBooking: string; // "2:00 PM"
    };
    bookingSummary: {
      todaysBookings: number;
      availableHours: number;
      blockedDates: number;
      vacationDays: number;
    };
    weeklySchedule: DaySchedule[];
    calendar: {
      month: string; // "July 2026"
      days: CalendarDay[];
    };
    blockedDates: BlockedDate[];
    vacationMode: {
      enabled: boolean;
    };
    recurringSchedule: {
      weeklyRepeat: boolean;
      monthlyRepeat: boolean;
      weekdaysOnly: boolean;
      customDays: boolean;
    };
    instantBooking: {
      enabled: boolean;
      minimumNoticeHours: number;
      bookingBufferMinutes: number;
      maxPerDay: number;
    };
  };
}

export type BookingStatus =
  "new" | "pending" | "accepted" | "completed" | "declined";

export interface Booking {
  id: string;
  bookingRefId: string;
  client: {
    name: string;
    avatarUrl: string;
    isVerified: boolean;
  };
  service: string;
  status: BookingStatus;
  requestedAt: string; // "10 min ago"
  date: string; // "Today, Jul 2"
  time: string; // "2:00 PM"
  durationMinutes: number;
  visitType: "Home Visit" | "Studio Visit";
  location: string;
  amount: number;
  review?: {
    rating: number;
    comment: string;
  };
}

export interface BookingInboxApiResponse {
  success: boolean;
  data: {
    summary: {
      requests: number;
      pending: number;
      accepted: number;
      earnings: number;
    };
    bookings: Booking[];
  };
}

export interface ChatMessage {
  id: string;
  clientName: string;
  clientInitials: string;
  bookingRefId: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  status: "Booking Active" | "Completed";
  isOnline: boolean;
  avatarColor: string;
}

export interface MessagesApiResponse {
  success: boolean;
  data: {
    chats: ChatMessage[];
  };
}

export interface PortfolioItem {
  id: string;
  imageUrl: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
}

export interface ProfileApiResponse {
  success: boolean;
  data: {
    name: string;
    role: string;
    isVerified: boolean;
    avatarUrl: string;
    coverAvatarUrl: string;
    experienceYears: number;
    rating: number;
    reviewsCount: number;
    profileCompletionPercent: number;
    portfolio: PortfolioItem[];
    services: ServiceItem[];
    businessInfo: {
      businessName: string;
      abnNumber: string;
      abnVerified: boolean;
      address: string;
      workingHours: string;
      travelRadiusKm: number;
      languages: string[];
      memberSince: string;
    };
  };
}
