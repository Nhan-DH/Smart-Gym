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
  Sparkles,
} from 'lucide-react';
import { UserDropdown } from '../../components/common/UserDropdown';
import { cn } from '../../lib/utils';

export const TrainerLayout: React.FC = () => {
  const { user, switchRole } = useAuth();
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
    <div className="min-h-screen bg-background flex flex-col font-sans pb-16 md:pb-0">
      {/* Top Header */}
      <header className="h-16 bg-surface border-b border-border sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between shadow-sm">
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

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs bg-surface-subtle border border-border px-2 py-1 rounded-md">
            <Sparkles className="w-3.5 h-3.5 text-volt-dark dark:text-volt" />
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

          {/* Facebook-style User Avatar & Dropdown */}
          <UserDropdown className="ml-1" />
        </div>
      </header>

      {/* Desktop Navigation Subheader - Full-bleed dark strip with inner content aligned to cards below */}
      <div className="hidden md:block w-full bg-darksidebar-bg border-b border-darksidebar-border shadow-sm">
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <nav className="flex items-center gap-1.5 overflow-x-auto">
            {navLinks.map((tab) => (
              <NavLink
                key={tab.href}
                to={tab.href}
                end={tab.href === '/trainer'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap',
                    isActive
                      ? 'bg-volt text-darksidebar-bg font-bold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  )
                }
              >
                {tab.icon}
                <span>{tab.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-darksidebar-bg border-t border-darksidebar-border flex items-center justify-around py-2 z-40 text-[10px]">
        {navLinks.map((tab) => (
          <NavLink
            key={tab.href}
            to={tab.href}
            end={tab.href === '/trainer'}
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
      </nav>
    </div>
  );
};
