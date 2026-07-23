// Shape mirrors what `GET /api/mobile/notifications` would return.
// Swap `getNotifications()` for a real fetch() call when the API is ready.

export type NotificationType =
  "booking" | "payment" | "review" | "reschedule" | "promotion" | "withdrawal";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timeAgo: string;
  unread: boolean;
}

const notifications: NotificationItem[] = [
  {
    id: "NOTIF-01",
    type: "booking",
    title: "New Booking",
    message: "Sophia Williams booked Bridal Makeup for Jun 29",
    timeAgo: "2m ago",
    unread: true,
  },
  {
    id: "NOTIF-02",
    type: "payment",
    title: "Payment Received",
    message: "$580 received for Booking BK-20250628-001",
    timeAgo: "1h ago",
    unread: true,
  },
  {
    id: "NOTIF-03",
    type: "review",
    title: "New Review",
    message: "Emma Johnson left a 4-star review for Facial Treatment",
    timeAgo: "3h ago",
    unread: false,
  },
  {
    id: "NOTIF-04",
    type: "reschedule",
    title: "Booking Rescheduled",
    message: "Ava Martinez rescheduled to Jul 2 at 11:00 AM",
    timeAgo: "Yesterday",
    unread: false,
  },
  {
    id: "NOTIF-05",
    type: "promotion",
    title: "Promotion Expired",
    message: "Spring Referral promo code REFER10 has expired",
    timeAgo: "2 days ago",
    unread: false,
  },
  {
    id: "NOTIF-06",
    type: "withdrawal",
    title: "Withdrawal Approved",
    message: "Your withdrawal of $1,200 has been approved",
    timeAgo: "3 days ago",
    unread: false,
  },
];

export function getNotifications(): NotificationItem[] {
  return notifications;
}
