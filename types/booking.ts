import { ImageSourcePropType } from "react-native";

export type BookingStatus = "upcoming" | "completed" | "cancelled" | "pending";

export type BookingListItem = {
  id: string;
  bookingNumber: string;

  artist: {
    id: string;
    name: string;
    avatar: ImageSourcePropType;
    specialty: string;
    rating: number;
    totalReviews: number;
  };

  service: {
    id: string;
    name: string;
    duration: string;
    price: number;
  };

  schedule: {
    date: string;
    startTime: string;
    endTime: string;
  };

  location: {
    type: "mobile" | "studio";
    address?: string;
  };

  payment: {
    subtotal: number;
    serviceFee: number;
    tax: number;
    total: number;
    currency: string;
  };

  status: BookingStatus;

  createdAt: string;
};
