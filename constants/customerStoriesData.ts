// Shared dummy "API" data for Customer Stories (list) + Customer Story (details)
// Replace this whole module with a real endpoint later, e.g.:
//   const { data } = useGetCustomerStoriesQuery();
// Keep the shape the same so both screens keep working untouched.

export const STORY_IMAGES = [
  require("../assets/images/home/pic2.png"),
  require("../assets/images/home/pic3.png"),
  require("../assets/images/home/pic4.png"),
  require("../assets/images/home/pic1.png"),
];

export interface CustomerStory {
  id: string;
  image: any;
  rating: number;
  quote: string; // short quote used on the list card
  name: string;
  location: string; // "Sydney, NSW · Bridal Makeup" (list card subtitle)
  category: string; // "Bridal Makeup" (detail screen subtitle)
  date: string; // "March 16, 2025"
  verifiedBooking: boolean;
  // Detail-screen-only fields
  fullStory: string[]; // paragraphs
  beforeImage: any;
  afterImage: any;
  gallery: any[];
}

export const STORIES: CustomerStory[] = [
  {
    id: "story_001",
    image: STORY_IMAGES[0],
    rating: 5,
    quote:
      "Emma transformed me for my wedding day — I felt like absolute royalty. Every single guest was asking about my makeup. Cannot recommend this platform enough.",
    name: "Priya Patel",
    location: "Sydney, NSW · Bridal Makeup",
    category: "Bridal Makeup",
    date: "March 16, 2025",
    verifiedBooking: true,
    fullStory: [
      "I was nervous about finding the right artist for my wedding day. A friend recommended memillennial and it completely changed my experience. Priya arrived exactly on time with a full professional kit.",
      "She carefully listened to my vision, showed me references, and executed the look flawlessly. The bridal makeup lasted beautifully through 8 hours of celebrations. I felt like a queen all day long.",
      "I highly recommend memillennial to every bride-to-be. The quality, punctuality, and genuine care they bring make it worth every single rupee.",
    ],
    beforeImage: STORY_IMAGES[0],
    afterImage: STORY_IMAGES[3],
    gallery: [
      STORY_IMAGES[0],
      STORY_IMAGES[1],
      STORY_IMAGES[2],
      STORY_IMAGES[3],
    ],
  },
  {
    id: "story_002",
    image: STORY_IMAGES[1],
    rating: 5,
    quote:
      "Booked Aria for my formal and she was beyond professional. My hair lasted through hours of dancing. Already re-booked her for my birthday party.",
    name: "Priya Sharma",
    location: "Melbourne, VIC · Hair Styling",
    category: "Hair Styling",
    date: "February 2, 2025",
    verifiedBooking: true,
    fullStory: [
      "Aria was recommended by a close friend and she absolutely delivered. From the consultation to the final look, everything felt effortless and professional.",
      "My hair held up through hours of dancing at my formal without a single pin falling out. I felt confident and beautiful the entire night.",
      "I've already re-booked her for my birthday party and I'm telling everyone I know to try memillennial.",
    ],
    beforeImage: STORY_IMAGES[1],
    afterImage: STORY_IMAGES[2],
    gallery: [
      STORY_IMAGES[1],
      STORY_IMAGES[0],
      STORY_IMAGES[3],
      STORY_IMAGES[2],
    ],
  },
  {
    id: "story_003",
    image: STORY_IMAGES[2],
    rating: 5,
    quote:
      "The artist was incredible and made me feel confident throughout the entire experience.",
    name: "Sophia Williams",
    location: "Brisbane, QLD · Makeup",
    category: "Makeup",
    date: "January 20, 2025",
    verifiedBooking: true,
    fullStory: [
      "From the moment I booked, the whole process felt easy and reassuring. The artist made me feel confident and comfortable throughout.",
      "The final look was exactly what I asked for, and the products used didn't irritate my sensitive skin at all.",
      "Booking through memillennial was one of the best decisions I made for my event.",
    ],
    beforeImage: STORY_IMAGES[2],
    afterImage: STORY_IMAGES[0],
    gallery: [
      STORY_IMAGES[2],
      STORY_IMAGES[3],
      STORY_IMAGES[1],
      STORY_IMAGES[0],
    ],
  },
  {
    id: "story_004",
    image: STORY_IMAGES[3],
    rating: 4.8,
    quote:
      "Amazing service from start to finish. The booking process was simple and the result was beautiful.",
    name: "Amelia Brown",
    location: "Perth, WA · Beauty Styling",
    category: "Beauty Styling",
    date: "December 8, 2024",
    verifiedBooking: false,
    fullStory: [
      "Amazing service from start to finish. The booking process was simple, the artist arrived on time, and communication was clear throughout.",
      "The result was beautiful and lasted the whole event without needing any touch-ups.",
      "Will definitely be booking through memillennial again for future events.",
    ],
    beforeImage: STORY_IMAGES[3],
    afterImage: STORY_IMAGES[1],
    gallery: [
      STORY_IMAGES[3],
      STORY_IMAGES[2],
      STORY_IMAGES[0],
      STORY_IMAGES[1],
    ],
  },
];

export const getStoryById = (id?: string) =>
  STORIES.find((s) => s.id === id) ?? STORIES[0];

export const getRelatedStories = (id: string, limit = 3) =>
  STORIES.filter((s) => s.id !== id).slice(0, limit);
