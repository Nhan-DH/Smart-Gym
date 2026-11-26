import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  CreditCard,
  UserCheck,
  CalendarDays,
  Clock,
  BarChart3,
  Settings,
  Dumbbell,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Tổng quan', href: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Hội viên', href: '/admin/members', icon: <Users className="w-4 h-4" /> },
  { label: 'Gói tập', href: '/admin/plans', icon: <Package className="w-4 h-4" /> },
  { label: 'Đơn hàng & Tiền', href: '/admin/orders', icon: <CreditCard className="w-4 h-4" /> },
  { label: 'Huấn luyện viên', href: '/admin/trainers', icon: <UserCheck className="w-4 h-4" /> },
  { label: 'Lịch toàn phòng', href: '/admin/bookings', icon: <CalendarDays className="w-4 h-4" /> },
  { label: 'Điểm danh Kiosk', href: '/admin/attendance', icon: <Clock className="w-4 h-4" /> },
  { label: 'Báo cáo doanh thu', href: '/admin/reports', icon: <BarChart3 className="w-4 h-4" /> },
  { label: 'Cấu hình hệ thống', href: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-[240px] shrink-0 h-screen bg-darksidebar-bg border-r border-darksidebar-border flex flex-col fixed left-0 top-0 z-30 select-none">
      {/* Brand Logo - Hybrid Athletic with Volt Accent */}
      <div className="h-16 flex items-center px-5 border-b border-darksidebar-border gap-3">
        <div className="w-9 h-9 rounded-md bg-volt flex items-center justify-center text-darksidebar-bg shadow-volt shrink-0 font-black">
          <Dumbbell className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <span className="font-extrabold text-base tracking-tight text-white block leading-none">
            Smart<span className="text-volt">Gym</span>
          </span>
          <span className="text-[10px] text-darksidebar-text uppercase tracking-wider block mt-1 font-semibold">
            Gym Management
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto dark-scroll">
        <div className="text-[10px] font-bold text-slate-500 px-3 mb-2.5 uppercase tracking-wider">
          Quản trị phòng tập
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all group',
                isActive
                  ? 'bg-darksidebar-activeBg text-volt border-l-2 border-volt font-semibold shadow-sm'
                  : 'text-darksidebar-text hover:text-white hover:bg-darksidebar-hover'
              )
            }
          >
            <span className="shrink-0 transition-transform group-hover:scale-105">{item.icon}</span>
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
