import {
  MOCK_USERS,
  MOCK_MEMBERS,
  MOCK_ORDERS,
  MOCK_OCCUPANCY_STATS,
  MOCK_ACTIVE_ATTENDANCE,
  MOCK_PLANS,
  MOCK_TRAINERS,
  MOCK_TRAINER_SHIFTS,
  MOCK_LEAVE_REQUESTS,
  MOCK_BOOKINGS,
  MOCK_WORKOUT_PLANS,
  MOCK_GYM_SETTINGS,
  DetailedMember,
} from './mockData';
import {
  User,
  UserRole,
  Order,
  OccupancyStats,
  AttendanceSession,
  Plan,
  TrainerProfile,
  TrainerShift,
  LeaveRequest,
  Booking,
  WorkoutPlan,
  GymSettings,
  SmartBookingPlan,
} from '../types';

// In-memory state for runtime updates
let membersState: DetailedMember[] = [...MOCK_MEMBERS];
let ordersState: Order[] = [...MOCK_ORDERS];
let plansState: Plan[] = [...MOCK_PLANS];
let trainersState: TrainerProfile[] = [...MOCK_TRAINERS];
let shiftsState: TrainerShift[] = [...MOCK_TRAINER_SHIFTS];
let leaveRequestsState: LeaveRequest[] = [...MOCK_LEAVE_REQUESTS];
let bookingsState: Booking[] = [...MOCK_BOOKINGS];
let attendanceState: AttendanceSession[] = [...MOCK_ACTIVE_ATTENDANCE];
let workoutPlansState: WorkoutPlan[] = [...MOCK_WORKOUT_PLANS];
let settingsState: GymSettings = { ...MOCK_GYM_SETTINGS };
let occupancyState: OccupancyStats = { ...MOCK_OCCUPANCY_STATS };

// AUTH SERVICE
export const authService = {
  getCurrentUser: (): User => {
    const saved = localStorage.getItem('smartgym_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return MOCK_USERS.manager;
  },

  switchUser: (role: UserRole): User => {
    let user: User;
    switch (role) {
      case 'MANAGER':
        user = MOCK_USERS.manager;
        break;
      case 'MEMBER':
        user = MOCK_USERS.member;
        break;
      case 'TRAINER':
        user = MOCK_USERS.trainer;
        break;
      case 'KIOSK':
        user = MOCK_USERS.kiosk;
        break;
      default:
        user = MOCK_USERS.manager;
    }
    localStorage.setItem('smartgym_user', JSON.stringify(user));
    return user;
  },

  login: async (email: string): Promise<User> => {
    await new Promise((r) => setTimeout(r, 300));
    const normalized = email.toLowerCase().trim();
    if (normalized.includes('admin') || normalized.includes('manager')) {
      return authService.switchUser('MANAGER');
    }
    if (normalized.includes('pt') || normalized.includes('trainer') || normalized.includes('long.pt')) {
      return authService.switchUser('TRAINER');
    }
    if (normalized.includes('kiosk')) {
      return authService.switchUser('KIOSK');
    }
    return authService.switchUser('MEMBER');
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('smartgym_user');
  },
};

// MEMBER SERVICE
export const memberService = {
  getMembers: async (query?: string, status?: string): Promise<DetailedMember[]> => {
    await new Promise((r) => setTimeout(r, 150));
    let list = [...membersState];
    if (status && status !== 'ALL') {
      list = list.filter((m) => m.status === status);
    }
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.phone.includes(q) ||
          m.id.toLowerCase().includes(q)
      );
    }
    return list;
  },

  getMemberById: async (id: string): Promise<DetailedMember | null> => {
    await new Promise((r) => setTimeout(r, 100));
    return membersState.find((m) => m.id === id) || null;
  },

  addMember: async (
    data: Omit<DetailedMember, 'id' | 'joinedAt' | 'role' | 'faceRegistered'>
  ): Promise<DetailedMember> => {
    await new Promise((r) => setTimeout(r, 200));
    const newId = `MB-${1000 + membersState.length + 1}`;
    const newMember: DetailedMember = {
      ...data,
      id: newId,
      role: 'MEMBER',
      joinedAt: new Date().toISOString().split('T')[0],
      faceRegistered: false,
    };
    membersState = [newMember, ...membersState];
    return newMember;
  },

  toggleMemberStatus: async (
    id: string,
    reason?: string
  ): Promise<{ member: DetailedMember; message: string }> => {
    await new Promise((r) => setTimeout(r, 200));
    const index = membersState.findIndex((m) => m.id === id);
    if (index === -1) throw new Error('Không tìm thấy hội viên');

    const current = membersState[index];
    const newStatus = current.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
    const updated: DetailedMember = { ...current, status: newStatus };
    membersState[index] = updated;

    return {
      member: updated,
      message:
        newStatus === 'LOCKED'
          ? `Đã khóa tài khoản của ${updated.name}. Toàn bộ phiên đăng nhập đã bị thu hồi. Lý do: ${
              reason || 'Quản trị viên khóa thủ công'
            }`
          : `Đã mở khóa tài khoản cho ${updated.name}.`,
    };
  },

  deleteFaceTemplate: async (memberId: string): Promise<void> => {
    await new Promise((r) => setTimeout(r, 200));
    const idx = membersState.findIndex((m) => m.id === memberId);
    if (idx !== -1) {
      membersState[idx] = {
        ...membersState[idx],
        faceRegistered: false,
        faceSampleCount: 0,
        consentAt: undefined,
      };
    }
  },
};

// PLAN SERVICE
export const planService = {
  getPlans: async (): Promise<Plan[]> => {
    await new Promise((r) => setTimeout(r, 100));
    return [...plansState];
  },

  createPlan: async (planData: Omit<Plan, 'id'>): Promise<Plan> => {
    await new Promise((r) => setTimeout(r, 200));
    const newPlan: Plan = {
      ...planData,
      id: `plan-${plansState.length + 1}`,
    };
    plansState = [newPlan, ...plansState];
    return newPlan;
  },

  togglePlanStatus: async (id: string): Promise<Plan> => {
    await new Promise((r) => setTimeout(r, 150));
    const index = plansState.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Không tìm thấy gói tập');
    const updated: Plan = {
      ...plansState[index],
      status: plansState[index].status === 'ACTIVE' ? 'DISCONTINUED' : 'ACTIVE',
    };
    plansState[index] = updated;
    return updated;
  },
};

// ORDER SERVICE
export const orderService = {
  getOrders: async (): Promise<Order[]> => {
    await new Promise((r) => setTimeout(r, 100));
    return [...ordersState];
  },

  createOrder: async (memberId: string, planId: string, method: 'CASH' | 'TRANSFER'): Promise<Order> => {
    await new Promise((r) => setTimeout(r, 250));
    const plan = plansState.find((p) => p.id === planId);
    const member = membersState.find((m) => m.id === memberId);
    if (!plan || !member) throw new Error('Thông tin không hợp lệ');

    const newOrder: Order = {
      id: `ORD-${8900 + ordersState.length + 1}`,
      memberId,
      memberName: member.name,
      memberEmail: member.email,
      planId,
      planName: plan.name,
      amountVnd: plan.priceVnd,
      method,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    ordersState = [newOrder, ...ordersState];
    return newOrder;
  },

  confirmOrder: async (orderId: string): Promise<Order> => {
    await new Promise((r) => setTimeout(r, 200));
    const index = ordersState.findIndex((o) => o.id === orderId);
    if (index === -1) throw new Error('Không tìm thấy đơn hàng');

    const order = ordersState[index];
    if (order.status === 'CONFIRMED') {
      return order; // Idempotent
    }

    const updated: Order = {
      ...order,
      status: 'CONFIRMED',
      confirmedBy: 'Trần Văn Quản Lý',
      confirmedAt: new Date().toISOString(),
    };
    ordersState[index] = updated;

    // Kích hoạt Membership cho hội viên
    const memberIdx = membersState.findIndex((m) => m.id === order.memberId);
    const plan = plansState.find((p) => p.id === order.planId);
    if (memberIdx !== -1 && plan) {
      const now = new Date();
      const end = new Date(now.getTime() + plan.durationDays * 86400000);
      membersState[memberIdx].membership = {
        id: `ms-${Date.now()}`,
        memberId: order.memberId,
        planId: plan.id,
        planName: plan.name,
        startsAt: now.toISOString().split('T')[0],
        endsAt: end.toISOString().split('T')[0],
        totalPt: plan.ptSessions,
        usedPt: 0,
        reservedPt: 0,
        gymAccess: plan.gymAccess,
        status: 'ACTIVE',
      };
    }

    occupancyState.revenueTodayVnd += updated.amountVnd;
    return updated;
  },

  rejectOrder: async (orderId: string, reason: string): Promise<Order> => {
    await new Promise((r) => setTimeout(r, 200));
    const index = ordersState.findIndex((o) => o.id === orderId);
    if (index === -1) throw new Error('Không tìm thấy đơn hàng');

    const updated: Order = {
      ...ordersState[index],
      status: 'REJECTED',
      rejectionReason: reason,
    };
    ordersState[index] = updated;
    return updated;
  },
};

// TRAINER SERVICE
export const trainerService = {
  getTrainers: async (): Promise<TrainerProfile[]> => {
    await new Promise((r) => setTimeout(r, 100));
    return [...trainersState];
  },

  getShifts: async (trainerId?: string): Promise<TrainerShift[]> => {
    await new Promise((r) => setTimeout(r, 100));
    if (trainerId) return shiftsState.filter((s) => s.trainerId === trainerId);
    return [...shiftsState];
  },

  getLeaveRequests: async (): Promise<LeaveRequest[]> => {
    await new Promise((r) => setTimeout(r, 100));
    return [...leaveRequestsState];
  },

  submitLeaveRequest: async (data: Omit<LeaveRequest, 'id' | 'status'>): Promise<LeaveRequest> => {
    await new Promise((r) => setTimeout(r, 200));
    const newReq: LeaveRequest = {
      ...data,
      id: `lr-${leaveRequestsState.length + 1}`,
      status: 'PENDING',
      affectedBookingsCount: 1,
    };
    leaveRequestsState = [newReq, ...leaveRequestsState];
    return newReq;
  },

  approveLeaveRequest: async (leaveId: string): Promise<void> => {
    await new Promise((r) => setTimeout(r, 250));
    const idx = leaveRequestsState.findIndex((l) => l.id === leaveId);
    if (idx !== -1) {
      leaveRequestsState[idx].status = 'APPROVED';
      // T07: Chuyển các booking bị ảnh hưởng sang NEEDS_RESCHEDULE, bảo lưu lượt
      bookingsState = bookingsState.map((b) => {
        if (b.trainerId === leaveRequestsState[idx].trainerId) {
          return {
            ...b,
            status: 'NEEDS_RESCHEDULE',
            cancellationReason: 'PT nghỉ phép có việc đột xuất. Số lượt tập được bảo lưu trọn vẹn.',
          };
        }
        return b;
      });
    }
  },
};

// BOOKING SERVICE (Includes CP-SAT Simulation)
export const bookingService = {
  getBookings: async (): Promise<Booking[]> => {
    await new Promise((r) => setTimeout(r, 100));
    return [...bookingsState];
  },

  getMemberBookings: async (memberId: string): Promise<Booking[]> => {
    await new Promise((r) => setTimeout(r, 100));
    return bookingsState.filter((b) => b.memberId === memberId);
  },

  getTrainerBookings: async (trainerId: string): Promise<Booking[]> => {
    await new Promise((r) => setTimeout(r, 100));
    return bookingsState.filter((b) => b.trainerId === trainerId);
  },

  createBooking: async (data: Omit<Booking, 'id' | 'status'>): Promise<Booking> => {
    await new Promise((r) => setTimeout(r, 200));
    // Check concurrency overlap
    const conflict = bookingsState.find(
      (b) =>
        b.trainerId === data.trainerId &&
        b.startsAt === data.startsAt &&
        b.status === 'CONFIRMED'
    );
    if (conflict) {
      throw new Error('409: Slot thời gian này vừa bị người khác đặt trước!');
    }

    const newBooking: Booking = {
      ...data,
      id: `bk-${bookingsState.length + 1}`,
      status: 'CONFIRMED',
    };
    bookingsState = [newBooking, ...bookingsState];

    // Cập nhật reserved_pt + 1
    const mIdx = membersState.findIndex((m) => m.id === data.memberId);
    if (mIdx !== -1 && membersState[mIdx].membership) {
      membersState[mIdx].membership!.reservedPt += 1;
    }

    return newBooking;
  },

  cancelBooking: async (bookingId: string): Promise<{ refunded: boolean; message: string }> => {
    await new Promise((r) => setTimeout(r, 200));
    const idx = bookingsState.findIndex((b) => b.id === bookingId);
    if (idx === -1) throw new Error('Không tìm thấy lịch đặt');

    const booking = bookingsState[idx];
    const hoursBefore = (new Date(booking.startsAt).getTime() - Date.now()) / (1000 * 3600);

    const mIdx = membersState.findIndex((m) => m.id === booking.memberId);
    const membership = mIdx !== -1 ? membersState[mIdx].membership : null;

    if (hoursBefore >= 12) {
      // Hủy trước ít nhất 12h: Hoàn lượt (reservedPt - 1)
      bookingsState[idx].status = 'CANCELLED';
      bookingsState[idx].cancellationReason = 'Hội viên hủy trước 12h (Được hoàn lượt)';
      if (membership) {
        membership.reservedPt = Math.max(0, membership.reservedPt - 1);
      }
      return { refunded: true, message: 'Đã hủy lịch thành công. Số lượt tập của bạn đã được hoàn lại đầy đủ!' };
    } else {
      // Hủy muộn dưới 12h: Trừ lượt (reservedPt - 1, usedPt + 1)
      bookingsState[idx].status = 'CANCELLED';
      bookingsState[idx].cancellationReason = 'Hội viên hủy muộn dưới 12h (Tính lượt tập)';
      if (membership) {
        membership.reservedPt = Math.max(0, membership.reservedPt - 1);
        membership.usedPt += 1;
      }
      return { refunded: false, message: 'Hủy lịch muộn (dưới 12 giờ trước buổi tập). Theo quy định, buổi tập này được tính vào lượt đã dùng.' };
    }
  },

  completeBooking: async (bookingId: string): Promise<void> => {
    await new Promise((r) => setTimeout(r, 200));
    const idx = bookingsState.findIndex((b) => b.id === bookingId);
    if (idx !== -1) {
      bookingsState[idx].status = 'COMPLETED';
      const mIdx = membersState.findIndex((m) => m.id === bookingsState[idx].memberId);
      if (mIdx !== -1 && membersState[mIdx].membership) {
        membersState[mIdx].membership!.reservedPt = Math.max(0, membersState[mIdx].membership!.reservedPt - 1);
        membersState[mIdx].membership!.usedPt += 1;
      }
      occupancyState.completedPtToday += 1;
    }
  },

  // OR-Tools CP-SAT Simulation: generate 3 optimal distinct schedules
  generateSmartPlans: async (_params: {
    sessionsPerWeek: number;
    preferredDays: number[];
    preferredTimeRange: string;
    preferredTrainerId?: string;
  }): Promise<SmartBookingPlan[]> => {
    await new Promise((r) => setTimeout(r, 600)); // simulate solver execution time (p95 < 2.5s)
    return [
      {
        planId: 'plan-opt-1',
        title: 'Phương án 1 (Khuyến nghị tối ưu nhất)',
        matchScore: 98,
        description: 'Khớp 100% khung giờ rảnh, đúng PT ưu tiên Lê Hoàng Long, giãn cách 48h giữa các buổi tập.',
        slots: [
          { dayName: 'Thứ 2', date: '2026-11-30', startTime: '18:00', endTime: '19:00', trainerId: 'PT-201', trainerName: 'Lê Hoàng Long', focus: 'Ngực & Tay sau' },
          { dayName: 'Thứ 4', date: '2026-12-02', startTime: '18:00', endTime: '19:00', trainerId: 'PT-201', trainerName: 'Lê Hoàng Long', focus: 'Lưng xô & Tay trước' },
          { dayName: 'Thứ 6', date: '2026-12-04', startTime: '17:00', endTime: '18:00', trainerId: 'PT-202', trainerName: 'Vũ Tuấn Anh', focus: 'Chân & Thể lực Cardio' },
        ],
      },
      {
        planId: 'plan-opt-2',
        title: 'Phương án 2 (Tập trung giờ vắng người)',
        matchScore: 92,
        description: 'Khung giờ phòng tập có mật độ dưới 35%, trang thiết bị tạ thoáng đãng nhất.',
        slots: [
          { dayName: 'Thứ 2', date: '2026-11-30', startTime: '14:00', endTime: '15:00', trainerId: 'PT-201', trainerName: 'Lê Hoàng Long', focus: 'Toàn thân Bodyweight' },
          { dayName: 'Thứ 4', date: '2026-12-02', startTime: '14:00', endTime: '15:00', trainerId: 'PT-201', trainerName: 'Lê Hoàng Long', focus: 'Thân trên & Ngực' },
          { dayName: 'Thứ 6', date: '2026-12-04', startTime: '15:00', endTime: '16:00', trainerId: 'PT-201', trainerName: 'Lê Hoàng Long', focus: 'Thân dưới & Bụng' },
        ],
      },
      {
        planId: 'plan-opt-3',
        title: 'Phương án 3 (Tối ưu cuối tuần)',
        matchScore: 85,
        description: 'Dồn 1 buổi vào Thứ 7 để giảm áp lực ngày làm việc trong tuần.',
        slots: [
          { dayName: 'Thứ 3', date: '2026-12-01', startTime: '18:00', endTime: '19:00', trainerId: 'PT-202', trainerName: 'Vũ Tuấn Anh', focus: 'Sức bền & Core' },
          { dayName: 'Thứ 5', date: '2026-12-03', startTime: '18:00', endTime: '19:00', trainerId: 'PT-201', trainerName: 'Lê Hoàng Long', focus: 'Lưng & Vai' },
          { dayName: 'Thứ 7', date: '2026-12-05', startTime: '09:00', endTime: '10:00', trainerId: 'PT-201', trainerName: 'Lê Hoàng Long', focus: 'Chân & Phục hồi' },
        ],
      },
    ];
  },

  confirmSmartPlan: async (memberId: string, plan: SmartBookingPlan): Promise<void> => {
    await new Promise((r) => setTimeout(r, 400));
    // Atomic confirmation in 1 simulated transaction
    for (const slot of plan.slots) {
      const newBooking: Booking = {
        id: `bk-${bookingsState.length + 1}`,
        memberId,
        memberName: 'Nguyễn Văn An',
        trainerId: slot.trainerId,
        trainerName: slot.trainerName,
        membershipId: 'ms-1',
        startsAt: `${slot.date}T${slot.startTime}:00Z`,
        endsAt: `${slot.date}T${slot.endTime}:00Z`,
        status: 'CONFIRMED',
        workoutTitle: slot.focus,
      };
      bookingsState = [newBooking, ...bookingsState];
    }
    const mIdx = membersState.findIndex((m) => m.id === memberId);
    if (mIdx !== -1 && membersState[mIdx].membership) {
      membersState[mIdx].membership!.reservedPt += plan.slots.length;
    }
  },
};

// WORKOUT SERVICE
export const workoutService = {
  getMemberWorkoutPlans: async (memberId: string): Promise<WorkoutPlan[]> => {
    await new Promise((r) => setTimeout(r, 100));
    return workoutPlansState.filter((wp) => wp.memberId === memberId);
  },

  getTrainerWorkoutPlans: async (trainerId: string): Promise<WorkoutPlan[]> => {
    await new Promise((r) => setTimeout(r, 100));
    return workoutPlansState.filter((wp) => wp.trainerId === trainerId);
  },
};

// ATTENDANCE & KIOSK SERVICE
export const attendanceService = {
  getSessions: async (): Promise<AttendanceSession[]> => {
    await new Promise((r) => setTimeout(r, 100));
    return [...attendanceState];
  },

  correctSession: async (sessionId: string, checkOutAt: string, reason: string): Promise<void> => {
    await new Promise((r) => setTimeout(r, 200));
    const idx = attendanceState.findIndex((s) => s.id === sessionId);
    if (idx !== -1) {
      attendanceState[idx].checkOutAt = checkOutAt;
      attendanceState[idx].correctionReason = reason;
      occupancyState.current = Math.max(0, occupancyState.current - 1);
    }
  },

  // Kiosk check-in simulation
  checkInMember: async (
    memberId: string,
    method: 'FACE' | 'QR'
  ): Promise<{ success: boolean; message: string; memberName: string; remainingDays: number; availablePt: number }> => {
    await new Promise((r) => setTimeout(r, 300));
    const member = membersState.find((m) => m.id === memberId);
    if (!member) throw new Error('Hội viên không tồn tại');

    if (member.status === 'LOCKED') {
      throw new Error('Tài khoản của bạn đang bị khóa. Vui lòng liên hệ quầy lễ tân!');
    }

    if (occupancyState.current >= settingsState.memberCapacity) {
      throw new Error('Phòng tập đã đạt giới hạn sức chứa tối đa (60/60). Vui lòng đợi trong giây lát!');
    }

    // Check if already open session
    const existing = attendanceState.find((s) => s.memberId === memberId && !s.checkOutAt);
    if (existing) {
      return {
        success: true,
        message: 'Bạn đã check-in trước đó và phiên tập đang mở!',
        memberName: member.name,
        remainingDays: 45,
        availablePt: 18,
      };
    }

    const newSession: AttendanceSession = {
      id: `att-${Date.now()}`,
      memberId: member.id,
      memberName: member.name,
      checkInAt: new Date().toISOString(),
      method,
    };
    attendanceState = [newSession, ...attendanceState];
    occupancyState.current += 1;

    return {
      success: true,
      message: 'Check-in thành công! Chúc bạn có buổi tập tràn đầy năng lượng!',
      memberName: member.name,
      remainingDays: 45,
      availablePt: 18,
    };
  },

  checkOutMember: async (memberId: string): Promise<{ success: boolean; message: string; memberName: string }> => {
    await new Promise((r) => setTimeout(r, 300));
    const member = membersState.find((m) => m.id === memberId);
    const sessionIdx = attendanceState.findIndex((s) => s.memberId === memberId && !s.checkOutAt);

    if (sessionIdx !== -1) {
      attendanceState[sessionIdx].checkOutAt = new Date().toISOString();
      occupancyState.current = Math.max(0, occupancyState.current - 1);
    }

    return {
      success: true,
      message: 'Check-out thành công. Hẹn gặp lại bạn!',
      memberName: member ? member.name : 'Hội viên',
    };
  },
};

// OCCUPANCY SERVICE
export const occupancyService = {
  getStats: async (): Promise<OccupancyStats> => {
    await new Promise((r) => setTimeout(r, 100));
    return { ...occupancyState };
  },

  getActiveSessions: async (): Promise<AttendanceSession[]> => {
    await new Promise((r) => setTimeout(r, 100));
    return attendanceState.filter((s) => !s.checkOutAt);
  },
};

// SETTINGS SERVICE
export const settingsService = {
  getSettings: async (): Promise<GymSettings> => {
    await new Promise((r) => setTimeout(r, 100));
    return { ...settingsState };
  },

  updateSettings: async (newSettings: Partial<GymSettings>): Promise<GymSettings> => {
    await new Promise((r) => setTimeout(r, 200));
    settingsState = { ...settingsState, ...newSettings };
    occupancyState.capacity = settingsState.memberCapacity;
    return { ...settingsState };
  },
};
