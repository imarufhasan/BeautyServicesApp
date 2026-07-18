import { BookingListItem } from "@/types/booking";

const AVATAR = require("../assets/images/home/pic1.png");
const AVATAR_2 = require("../assets/images/home/pic2.png");
const AVATAR_3 = require("../assets/images/home/pic3.png");
const AVATAR_4 = require("../assets/images/home/pic4.png");

export const MOCK_BOOKINGS: BookingListItem[] = [
  {
    id: "booking_001",
    bookingNumber: "BK-2025-07124",

    artist: {
      id: "artist_101",
      name: "Sofia Laurent",
      avatar: AVATAR,
      specialty: "Bridal Makeup",
      rating: 4.8,
      totalReviews: 126,
    },

    service: {
      id: "service_001",
      name: "Luxury Bridal Makeup",
      duration: "2 hours",
      price: 250,
    },

    schedule: {
      date: "2025-07-12",
      startTime: "10:00 AM",
      endTime: "12:00 PM",
    },

    location: {
      type: "mobile",
      address: "Sydney NSW",
    },

    payment: {
      subtotal: 250,
      serviceFee: 15,
      tax: 20.4,
      total: 285.4,
      currency: "USD",
    },

    status: "upcoming",

    createdAt: "2025-07-01T10:30:00Z",
  },

  {
    id: "booking_002",
    bookingNumber: "BK-2025-06981",

    artist: {
      id: "artist_102",
      name: "Amara Osei",
      avatar: AVATAR_2,
      specialty: "Hair Styling",
      rating: 4.5,
      totalReviews: 89,
    },

    service: {
      id: "service_002",
      name: "Premium Hair Styling",
      duration: "90 minutes",
      price: 120,
    },

    schedule: {
      date: "2025-07-18",
      startTime: "2:00 PM",
      endTime: "3:30 PM",
    },

    location: {
      type: "studio",
      address: "Downtown Beauty Studio",
    },

    payment: {
      subtotal: 120,
      serviceFee: 10,
      tax: 0,
      total: 130,
      currency: "USD",
    },

    status: "pending",

    createdAt: "2025-07-10T08:20:00Z",
  },

  {
    id: "booking_003",
    bookingNumber: "BK-2025-05320",

    artist: {
      id: "artist_103",
      name: "Leila Farouk",
      avatar: AVATAR_3,
      specialty: "Cut & Colour",
      rating: 5,
      totalReviews: 210,
    },

    service: {
      id: "service_003",
      name: "Hair Colour Treatment",
      duration: "3 hours",
      price: 95,
    },

    schedule: {
      date: "2025-06-30",
      startTime: "11:30 AM",
      endTime: "2:30 PM",
    },

    location: {
      type: "studio",
      address: "Beauty Lounge",
    },

    payment: {
      subtotal: 95,
      serviceFee: 8,
      tax: 10,
      total: 113,
      currency: "USD",
    },

    status: "completed",

    createdAt: "2025-06-20T12:00:00Z",
  },

  {
    id: "booking_004",
    bookingNumber: "BK-2025-04117",

    artist: {
      id: "artist_104",
      name: "Isabelle Renaud",
      avatar: AVATAR_4,
      specialty: "Facial Treatment",
      rating: 4.2,
      totalReviews: 64,
    },

    service: {
      id: "service_004",
      name: "Glow Facial Therapy",
      duration: "60 minutes",
      price: 150,
    },

    schedule: {
      date: "2025-06-20",
      startTime: "9:00 AM",
      endTime: "10:00 AM",
    },

    location: {
      type: "mobile",
      address: "Melbourne VIC",
    },

    payment: {
      subtotal: 150,
      serviceFee: 12,
      tax: 14,
      total: 176,
      currency: "USD",
    },

    status: "cancelled",

    createdAt: "2025-06-10T09:15:00Z",
  },

  {
    id: "booking_005",
    bookingNumber: "BK-2025-07201",

    artist: {
      id: "artist_105",
      name: "Emma Williams",
      avatar: AVATAR,
      specialty: "Party Makeup",
      rating: 4.7,
      totalReviews: 154,
    },

    service: {
      id: "service_005",
      name: "Evening Party Makeup",
      duration: "90 minutes",
      price: 180,
    },

    schedule: {
      date: "2025-08-02",
      startTime: "6:00 PM",
      endTime: "7:30 PM",
    },

    location: {
      type: "mobile",
      address: "Brisbane QLD",
    },

    payment: {
      subtotal: 180,
      serviceFee: 15,
      tax: 18,
      total: 213,
      currency: "USD",
    },

    status: "upcoming",

    createdAt: "2025-07-15T14:10:00Z",
  },

  {
    id: "booking_006",
    bookingNumber: "BK-2025-07315",

    artist: {
      id: "artist_106",
      name: "Maya Anderson",
      avatar: AVATAR_2,
      specialty: "Nail Art",
      rating: 4.9,
      totalReviews: 320,
    },

    service: {
      id: "service_006",
      name: "Luxury Nail Extension",
      duration: "2 hours",
      price: 110,
    },

    schedule: {
      date: "2025-08-05",
      startTime: "1:00 PM",
      endTime: "3:00 PM",
    },

    location: {
      type: "studio",
      address: "Central Beauty Hub",
    },

    payment: {
      subtotal: 110,
      serviceFee: 9,
      tax: 12,
      total: 131,
      currency: "USD",
    },

    status: "pending",

    createdAt: "2025-07-18T06:45:00Z",
  },

  {
    id: "booking_007",
    bookingNumber: "BK-2025-03888",

    artist: {
      id: "artist_107",
      name: "Charlotte Brown",
      avatar: AVATAR_3,
      specialty: "Wedding Hair",
      rating: 4.6,
      totalReviews: 98,
    },

    service: {
      id: "service_007",
      name: "Wedding Hair Styling",
      duration: "2.5 hours",
      price: 220,
    },

    schedule: {
      date: "2025-05-15",
      startTime: "7:30 AM",
      endTime: "10:00 AM",
    },

    location: {
      type: "mobile",
      address: "Perth WA",
    },

    payment: {
      subtotal: 220,
      serviceFee: 20,
      tax: 22,
      total: 262,
      currency: "USD",
    },

    status: "completed",

    createdAt: "2025-05-01T11:30:00Z",
  },

  {
    id: "booking_008",
    bookingNumber: "BK-2025-04455",

    artist: {
      id: "artist_108",
      name: "Olivia Martin",
      avatar: AVATAR_4,
      specialty: "Skin Care",
      rating: 3.9,
      totalReviews: 45,
    },

    service: {
      id: "service_008",
      name: "Deep Skin Care Treatment",
      duration: "75 minutes",
      price: 85,
    },

    schedule: {
      date: "2025-06-05",
      startTime: "4:00 PM",
      endTime: "5:15 PM",
    },

    location: {
      type: "studio",
      address: "Sydney Beauty Clinic",
    },

    payment: {
      subtotal: 85,
      serviceFee: 5,
      tax: 9,
      total: 99,
      currency: "USD",
    },

    status: "cancelled",

    createdAt: "2025-05-25T15:00:00Z",
  },
];
