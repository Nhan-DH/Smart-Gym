import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  Dumbbell,
  Home,
  Calendar,
  Package,
  BookOpen,
  User,
  QrCode,
  Sparkles,
  LogOut,
  Activity,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { MemberQrModal } from './components/MemberQrModal';
import { cn } from '../../lib/utils';

export const MemberLayout: React.FC = () => {
  const { user, switchRole, logout } = useAuth();
  const navigate = useNavigate();
  const [isQrOpen, setIsQrOpen] = useState(false);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as UserRole;
    switchRole(newRole);
    if (newRole === 'MANAGER') navigate('/admin/dashboard');
    else if (newRole === 'MEMBER') navigate('/app');
    else if (newRole === 'TRAINER') navigate('/trainer');
    else if (newRole === 'KIOSK') navigate('/kiosk');
  };

  const navLinks = [
    { label: 'Trang chủ', href: '/app', icon: <Home className="w-4 h-4" /> },
    { label: 'Lịch tập của tôi', href: '/app/schedule', icon: <Calendar className="w-4 h-4" /> },
    { label: 'Gói tập & Mua gói', href: '/app/plans', icon: <Package className="w-4 h-4" /> },
    { label: 'Giáo án bài tập', href: '/app/workouts', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Tài khoản & Sinh trắc', href: '/app/profile', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans pb-16 md:pb-0">
      {/* Top Header */}
      <header className="h-16 bg-surface border-b border-border sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between shadow-sm">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-darksidebar-bg text-volt flex items-center justify-center font-black shadow-sm shrink-0">
            <Dumbbell className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-text-primary block leading-none">
              Smart<span className="text-volt-dark">Gym</span>
            </span>
            <span className="text-[10px] text-text-secondary uppercase tracking-wider block mt-0.5 font-bold">
              Cổng Hội Viên (Member)
            </span>
          </div>
        </div>

        {/* Live gym occupancy meter (pill) */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs text-slate-200">
          <Activity className="w-3.5 h-3.5 text-volt animate-pulse" />
          <span>Mật độ phòng tập: <strong className="text-volt">32/60</strong> (53%)</span>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Dynamic QR Trigger Button */}
          <Button
            variant="volt"
            size="sm"
            onClick={() => setIsQrOpen(true)}
            icon={<QrCode className="w-4 h-4 stroke-[2.5]" />}
            className="hidden sm:inline-flex shadow-sm"
          >
            Mã QR Check-in
          </Button>

          {/* Role switcher for demo defense */}
          <div className="flex items-center gap-1.5 text-xs bg-slate-50 border border-border px-2 py-1 rounded-md">
            <Sparkles className="w-3.5 h-3.5 text-volt-dark" />
            <select
              value={user.role}
              onChange={handleRoleChange}
              aria-label="Chọn vai trò demo"
              className="h-7 px-1.5 rounded bg-surface border border-border text-xs font-bold text-text-primary cursor-pointer"
            >
              <option value="MANAGER">Quản lý</option>
              <option value="MEMBER">Hội viên</option>
              <option value="TRAINER">PT</option>
              <option value="KIOSK">Kiosk</option>
            </select>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            title="Đăng xuất"
            className="p-1.5 h-8 w-8 text-text-secondary hover:text-red-600"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Desktop Navigation Subheader */}
      <nav className="bg-darksidebar-bg border-b border-darksidebar-border px-4 sm:px-6 hidden md:flex items-center gap-1 overflow-x-auto">
        {navLinks.map((tab) => (
          <NavLink
            key={tab.href}
            to={tab.href}
            end={tab.href === '/app'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 px-4 py-3 text-xs font-semibold transition-colors border-b-2',
                isActive
                  ? 'border-volt text-volt bg-darksidebar-surface/60'
                  : 'border-transparent text-slate-400 hover:text-white hover:bg-darksidebar-surface/30'
              )
            }
          >
            {tab.icon}
            <span>{tab.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-darksidebar-bg border-t border-darksidebar-border flex items-center justify-around py-2 z-40 text-[10px]">
        {navLinks.map((tab) => (
          <NavLink
            key={tab.href}
            to={tab.href}
            end={tab.href === '/app'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 py-1 px-2 rounded font-medium transition-colors',
                isActive ? 'text-volt font-bold' : 'text-slate-400 hover:text-white'
              )
            }
          >
            {tab.icon}
            <span>{tab.label}</span>
          </NavLink>
        ))}
        {/* Floating Mobile QR Trigger */}
        <button
          onClick={() => setIsQrOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-2 text-volt font-bold"
        >
          <QrCode className="w-4 h-4 stroke-[2.5]" />
          <span>Mã QR</span>
        </button>
      </nav>

      {/* Dynamic QR Modal */}
      <MemberQrModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        memberName={user.name}
        memberId="MB-1001"
      />
    </div>
  );
};
