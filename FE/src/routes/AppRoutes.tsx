import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from '../components/layout/AuthLayout';
import { ManagerLayout } from '../components/layout/ManagerLayout';
import { LoginPage } from '../features/auth/LoginPage';

// Manager Screens
import { ManagerDashboardPage } from '../features/dashboard/ManagerDashboardPage';
import { MemberListPage } from '../features/members/MemberListPage';
import { PlansPage } from '../features/plans/PlansPage';
import { OrdersPage } from '../features/orders/OrdersPage';
import { TrainersPage } from '../features/trainers/TrainersPage';
import { BookingsPage } from '../features/bookings/BookingsPage';
import { AttendancePage } from '../features/attendance/AttendancePage';
import { ReportsPage } from '../features/reports/ReportsPage';
import { SettingsPage } from '../features/settings/SettingsPage';

// Member Portal Screens
import { MemberLayout } from '../features/member/MemberLayout';
import { MemberHomePage } from '../features/member/MemberHomePage';
import { MemberSchedulePage } from '../features/member/MemberSchedulePage';
import { MemberManualBookingPage } from '../features/member/MemberManualBookingPage';
import { MemberSmartBookingPage } from '../features/member/MemberSmartBookingPage';
import { MemberPlansPage } from '../features/member/MemberPlansPage';
import { MemberWorkoutsPage } from '../features/member/MemberWorkoutsPage';
import { MemberProfilePage } from '../features/member/MemberProfilePage';

// PT (Trainer) Screens
import { TrainerLayout } from '../features/trainer/TrainerLayout';
import { TrainerDashboardPage } from '../features/trainer/TrainerDashboardPage';
import { TrainerSchedulePage } from '../features/trainer/TrainerSchedulePage';
import { TrainerMembersPage } from '../features/trainer/TrainerMembersPage';
import { TrainerSessionPage } from '../features/trainer/TrainerSessionPage';
import { TrainerWorkoutPlansPage } from '../features/trainer/TrainerWorkoutPlansPage';

// Kiosk Screen
import { KioskPage } from '../features/kiosk/KioskPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/auth/login" element={<LoginPage />} />
      </Route>

      {/* 1. Manager Admin Portal Routes */}
      <Route path="/admin" element={<ManagerLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<ManagerDashboardPage />} />
        <Route path="members" element={<MemberListPage />} />
        <Route path="plans" element={<PlansPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="trainers" element={<TrainersPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* 2. Member Portal Routes */}
      <Route path="/app" element={<MemberLayout />}>
        <Route index element={<MemberHomePage />} />
        <Route path="schedule" element={<MemberSchedulePage />} />
        <Route path="booking/manual" element={<MemberManualBookingPage />} />
        <Route path="booking/smart" element={<MemberSmartBookingPage />} />
        <Route path="plans" element={<MemberPlansPage />} />
        <Route path="workouts" element={<MemberWorkoutsPage />} />
        <Route path="profile" element={<MemberProfilePage />} />
      </Route>

      {/* 3. PT (Trainer) Portal Routes */}
      <Route path="/trainer" element={<TrainerLayout />}>
        <Route index element={<TrainerDashboardPage />} />
        <Route path="schedule" element={<TrainerSchedulePage />} />
        <Route path="members" element={<TrainerMembersPage />} />
        <Route path="sessions/:id" element={<TrainerSessionPage />} />
        <Route path="plans" element={<TrainerWorkoutPlansPage />} />
      </Route>

      {/* 4. Fullscreen Entrance Kiosk Route */}
      <Route path="/kiosk" element={<KioskPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};
