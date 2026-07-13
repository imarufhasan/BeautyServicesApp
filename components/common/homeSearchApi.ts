// ---------------------------------------------------------------------------
// Mock API layer for the "Find My Artist" search flow (Location, Date, Time,
// Service, People). Every function here simulates a network call (delay +
// resolved promise) and returns data shaped exactly like what the real
// backend is expected to return.
//
// TO SWAP IN THE REAL API: replace the body of each function with an actual
// fetch()/axios call to your endpoint. Keep the same function signature and
// return type and NOTHING in the UI layer (the modals) needs to change.
// ---------------------------------------------------------------------------

export interface LocationOption {
  id: string;
  name: string;
  region: string;
}

export interface TimeSlot {
  id: string;
  label: string;
  available: boolean;
}

export interface ServiceOption {
  id: string;
  name: string;
  popular?: boolean;
}

export interface CalendarMonth {
  year: number;
  month: number; // 0-indexed
  /** ISO date string (YYYY-MM-DD). Any date before this is disabled. */
  disabledBefore: string;
}

export interface PeopleConfig {
  min: number;
  max: number;
  default: number;
}

const NETWORK_DELAY = 450;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ---------------------------------------------------------------------------
// Locations
// ---------------------------------------------------------------------------
const MOCK_LOCATIONS: LocationOption[] = [
  { id: "syd", name: "Sydney", region: "NSW" },
  { id: "mel", name: "Melbourne", region: "VIC" },
  { id: "bri", name: "Brisbane", region: "QLD" },
  { id: "per", name: "Perth", region: "WA" },
  { id: "ade", name: "Adelaide", region: "SA" },
  { id: "gc", name: "Gold Coast", region: "QLD" },
  { id: "can", name: "Canberra", region: "ACT" },
  { id: "dar", name: "Darwin", region: "NT" },
  { id: "hob", name: "Hobart", region: "TAS" },
  { id: "new", name: "Newcastle", region: "NSW" },
];

export async function fetchLocations(query = ""): Promise<LocationOption[]> {
  await wait(NETWORK_DELAY);
  if (!query.trim()) return MOCK_LOCATIONS;
  const q = query.toLowerCase();
  return MOCK_LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(q) || loc.region.toLowerCase().includes(q)
  );
}

// ---------------------------------------------------------------------------
// Dates
// ---------------------------------------------------------------------------
export async function fetchAvailableMonth(
  year: number,
  month: number
): Promise<CalendarMonth> {
  await wait(NETWORK_DELAY);
  const today = new Date();
  return {
    year,
    month,
    disabledBefore: today.toISOString().slice(0, 10),
  };
}

// ---------------------------------------------------------------------------
// Time slots
// ---------------------------------------------------------------------------
const MOCK_TIME_SLOTS: TimeSlot[] = [
  { id: "t1", label: "8:00 AM", available: true },
  { id: "t2", label: "8:30 AM", available: true },
  { id: "t3", label: "9:00 AM", available: false },
  { id: "t4", label: "9:30 AM", available: true },
  { id: "t5", label: "10:00 AM", available: true },
  { id: "t6", label: "10:30 AM", available: true },
  { id: "t7", label: "11:00 AM", available: true },
  { id: "t8", label: "11:30 AM", available: false },
  { id: "t9", label: "12:00 PM", available: true },
  { id: "t10", label: "12:30 PM", available: true },
  { id: "t11", label: "1:00 PM", available: true },
  { id: "t12", label: "1:30 PM", available: true },
  { id: "t13", label: "2:00 PM", available: true },
  { id: "t14", label: "2:30 PM", available: true },
  { id: "t15", label: "3:00 PM", available: true },
  { id: "t16", label: "3:30 PM", available: true },
  { id: "t17", label: "4:00 PM", available: true },
  { id: "t18", label: "4:30 PM", available: true },
  { id: "t19", label: "5:00 PM", available: true },
  { id: "t20", label: "5:30 PM", available: true },
  { id: "t21", label: "6:00 PM", available: true },
  { id: "t22", label: "6:30 PM", available: true },
  { id: "t23", label: "7:00 PM", available: true },
  { id: "t24", label: "7:30 PM", available: true },
  { id: "t25", label: "8:00 PM", available: true },
  { id: "t26", label: "8:30 PM", available: true },
];

export async function fetchTimeSlots(dateISO: string): Promise<TimeSlot[]> {
  await wait(NETWORK_DELAY);
  // In the real API this would depend on `dateISO` + artist availability.
  return MOCK_TIME_SLOTS;
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------
const MOCK_SERVICES: ServiceOption[] = [
  { id: "s1", name: "Hair Styling", popular: true },
  { id: "s2", name: "Hair Color" },
  { id: "s3", name: "Facial" },
  { id: "s4", name: "Brow Shaping" },
  { id: "s5", name: "Massage" },
  { id: "s6", name: "Bridal Make Up", popular: true },
  { id: "s7", name: "Nails" },
  { id: "s8", name: "Skin Care" },
  { id: "s9", name: "Eyelash Extensions" },
  { id: "s10", name: "Airbrush Makeup" },
];

export async function fetchServices(): Promise<ServiceOption[]> {
  await wait(NETWORK_DELAY);
  return MOCK_SERVICES;
}

// ---------------------------------------------------------------------------
// People
// ---------------------------------------------------------------------------
export async function fetchPeopleConfig(): Promise<PeopleConfig> {
  await wait(200);
  return { min: 1, max: 10, default: 1 };
}
