import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Bell, Activity, LogOut, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';

export const Header: React.FC = () => {
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

  return (
    <header className="h-16 bg-surface border-b border-border fixed top-0 right-0 left-[240px] z-20 px-6 flex items-center justify-between">
      {/* Live Occupancy Status - Athletic Hybrid indicator */}
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs font-medium text-slate-200">
          <Activity className="w-3.5 h-3.5 text-volt animate-pulse" />
          <span>
            Mật độ phòng tập: <strong className="font-bold text-volt">32/60</strong> (53%) • Ổn định
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Quick Role Switcher for Demo & Defense */}
        <div className="flex items-center gap-2 text-xs bg-slate-50 border border-border px-2.5 py-1 rounded-md">
          <Sparkles className="w-3.5 h-3.5 text-volt-dark" />
          <span className="text-text-secondary font-medium hidden md:inline">Vai trò demo:</span>
          <select
            value={user.role}
            onChange={handleRoleChange}
            aria-label="Chọn vai trò demo"
            className="h-7 px-2 rounded bg-surface border border-border text-xs font-bold text-text-primary focus:outline-none focus:border-volt-dark cursor-pointer"
          >
            <option value="MANAGER">Quản lý (Manager)</option>
            <option value="MEMBER">Hội viên (Member)</option>
            <option value="TRAINER">Huấn luyện viên (PT)</option>
            <option value="KIOSK">Kiosk sảnh (Kiosk)</option>
          </select>
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          aria-label="Thông báo hệ thống"
          className="relative p-2 text-text-secondary hover:text-text-primary rounded-md hover:bg-surface-hover transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-status-danger ring-2 ring-white" />
        </button>

        {/* User Info & Logout */}
        <div className="flex items-center gap-3 pl-2 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-volt font-bold text-xs flex items-center justify-center shrink-0 border border-slate-700">
            {user.name.charAt(0)}
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold text-text-primary leading-tight">{user.name}</div>
            <div className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">
              {user.role}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            title="Đăng xuất"
            className="p-1.5 h-8 w-8 text-text-secondary hover:text-status-danger"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
