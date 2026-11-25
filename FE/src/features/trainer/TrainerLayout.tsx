import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  Dumbbell,
  LayoutDashboard,
  CalendarDays,
  Users,
  BookOpen,
  LogOut,
  Sparkles,
  Activity,
  PlayCircle,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { cn } from '../../lib/utils';

export const TrainerLayout: React.FC = () => {
  const { user, switchRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as UserRole;
    switchRole(newRole);
    if (newRole === 'MANAGER') navigate('/admin/dashboard');
    else if (newRole === 'MEMBER') navigate('/app');
    else if (newRole === 'TRAINER') navigate('/trainer');
    else if (newRole === 'KIOSK') navigate('/kiosk');
  };

  const navLinks = [
    { label: 'Ca dạy hôm nay', href: '/trainer', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Lịch làm việc tuần', href: '/trainer/schedule', icon: <CalendarDays className="w-4 h-4" /> },
    { label: 'Học viên của tôi', href: '/trainer/members', icon: <Users className="w-4 h-4" /> },
    { label: 'Soạn giáo án bài tập', href: '/trainer/plans', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Top Header */}
      <header className="h-16 bg-surface border-b border-border sticky top-0 z-30 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-darksidebar-bg text-volt flex items-center justify-center font-black shadow-sm shrink-0">
            <Dumbbell className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-text-primary block leading-none">
              Smart<span className="text-volt-dark">Gym</span>
            </span>
            <span className="text-[10px] text-text-secondary uppercase tracking-wider block mt-0.5 font-bold">
              Cổng Huấn Luyện Viên (PT)
            </span>
          </div>
        </div>

        {/* Middle Occupancy */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs text-slate-200">
          <Activity className="w-3.5 h-3.5 text-volt animate-pulse" />
          <span>Mật độ phòng tập: <strong className="text-volt">32/60</strong> (53%)</span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-4">
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

          <div className="flex items-center gap-2 pl-2 border-l border-border">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-volt font-bold text-xs flex items-center justify-center">
              L
            </div>
            <div className="hidden sm:block text-left text-xs">
              <div className="font-bold text-text-primary">Lê Hoàng Long</div>
              <div className="text-[10px] text-text-secondary font-mono">PT-201</div>
            </div>
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

      {/* Navigation Bar */}
      <nav className="bg-darksidebar-bg border-b border-darksidebar-border px-6 flex items-center gap-1 overflow-x-auto">
        {navLinks.map((tab) => (
          <NavLink
            key={tab.href}
            to={tab.href}
            end={tab.href === '/trainer'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 px-4 py-3 text-xs font-semibold transition-colors border-b-2 whitespace-nowrap',
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

      {/* Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};
