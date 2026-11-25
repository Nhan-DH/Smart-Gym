// Common Roles according to design.md
export type UserRole = 'MANAGER' | 'MEMBER' | 'TRAINER' | 'KIOSK';

export type UserStatus = 'ACTIVE' | 'LOCKED' | 'PENDING';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
}

// Trainer Profile & Shifts
export interface TrainerProfile {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  specialties: string[];
  dailyLimitMinutes?: number;
  avatarUrl?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  assignedMembersCount?: number;
  completedSessionsCount?: number;
}

export interface TrainerShift {
  id: string;
  trainerId: string;
  trainerName: string;
  dayOfWeek: number; // 0 to 6
  startTime: string; // "06:00"
  endTime: string;   // "14:00"
  shiftName?: string;
}

export interface LeaveRequest {
  id: string;
  trainerId: string;
  trainerName: string;
  startDate?: string;
  endDate?: string;
  startsAt?: string;
  endsAt?: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  affectedBookingsCount?: number;
}

// Plan & Membership Types
export interface Plan {
  id: string;
  name: string;
  priceVnd: number;
  durationDays: number;
  ptSessions: number;
  gymAccess: boolean;
  status: 'ACTIVE' | 'DISCONTINUED';
  description?: string;
  tier?: 'TIER_GYM_ONLY' | 'TIER_PT' | 'TIER_COMBO';
  highlight?: boolean;
}

// Detailed Member Profile
export interface DetailedMember extends User {
  joinedAt: string;
  faceRegistered?: boolean;
  faceSampleCount?: number;
  consentAt?: string;
  membership?: Membership;
}

export type MembershipStatus = 'SCHEDULED' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED';

export interface Membership {
  id: string;
  memberId: string;
  planId: string;
  planName: string;
  startsAt: string;
  endsAt: string;
  totalPt: number;
  usedPt: number;
  reservedPt: number;
  gymAccess: boolean;
  status: MembershipStatus;
}

// Order & Payment Types
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED';
export type PaymentMethod = 'CASH' | 'TRANSFER';

export interface Order {
  id: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  planId: string;
  planName: string;
  amountVnd: number;
  method: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  confirmedBy?: string;
  confirmedAt?: string;
  rejectionReason?: string;
}

// Booking Types
export type BookingStatus =
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW'
  | 'NEEDS_RESCHEDULE';

export interface Booking {
  id: string;
  memberId: string;
  memberName: string;
  trainerId: string;
  trainerName: string;
  membershipId: string;
  startsAt: string;
  endsAt: string;
  status: BookingStatus;
  cancellationReason?: string;
  workoutTitle?: string;
}

// Workout Plan Types
export interface WorkoutExercise {
  name: string;
  muscleGroup: string;
  sets: number;
  reps: number;
  weightKg: number;
  restSeconds: number;
  notes?: string;
}

export interface WorkoutItem {
  id: string;
  workoutPlanId: string;
  exercise: string;
  muscleGroup: string;
  sets: number;
  reps: number;
  weightKg: number;
  restSeconds: number;
}

export interface WorkoutPlan {
  id: string;
  memberId: string;
  memberName: string;
  trainerId: string;
  trainerName: string;
  version: number;
  status: 'ACTIVE' | 'ARCHIVED';
  title: string;
  items?: WorkoutItem[];
  exercises: WorkoutExercise[];
  updatedAt?: string;
  createdAt?: string;
}

export interface WorkoutResult {
  id: string;
  bookingId: string;
  itemId: string;
  exercise: string;
  actualSets: number;
  actualReps: number;
  actualWeightKg: number;
  notes?: string;
}

// Attendance Types
export interface AttendanceSession {
  id: string;
  memberId: string;
  memberName: string;
  checkInAt: string;
  checkOutAt?: string | null;
  method: 'FACE' | 'QR' | 'MANUAL';
  correctionReason?: string;
}

// Occupancy Stats
export interface OccupancyStats {
  current: number;
  capacity: number;
  percentage: number;
  activeMembers: number;
  revenueTodayVnd: number;
  completedPtToday: number;
  hourlyData: { hour: string; actual: number; baseline: number }[];
}

// Gym Settings
export interface GymSettings {
  id: string;
  timezone: string;
  openingTime: string;
  closingTime: string;
  memberCapacity: number;
  cancelHours: number; // 12
  maxParallelPt: number;
}

// Smart Booking Suggestion (OR-Tools CP-SAT output)
export interface SmartBookingPlan {
  planId: string;
  title: string;
  matchScore: number;
  description: string;
  slots: {
    dayName: string;
    date: string;
    startTime: string;
    endTime: string;
    trainerId: string;
    trainerName: string;
    focus: string;
  }[];
}
