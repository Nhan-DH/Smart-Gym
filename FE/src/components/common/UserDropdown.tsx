import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ChevronDown,
  ChevronRight,
  User,
  QrCode,
  Calendar,
  Package,
  BookOpen,
  KeyRound,
  LogOut,
  HelpCircle,
  ShieldCheck,
  Dumbbell,
  Clock,
  Sparkles,
} from 'lucide-react';

interface UserDropdownProps {
  onOpenQr?: () => void;
  className?: string;
}

export const UserDropdown: React.FC<UserDropdownProps> = ({ onOpenQr, className = '' }) => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate('/auth/login');
  };

  const getRoleLabel = () => {
    switch (role) {
      case 'MEMBER':
        return 'Hội viên SmartGym';
      case 'TRAINER':
        return 'Huấn luyện viên (PT)';
      case 'MANAGER':
        return 'Quản trị viên phòng tập';
      case 'KIOSK':
        return 'Thiết bị Kiosk sảnh';
      default:
        return 'Người dùng';
    }
  };

  const getProfileLink = () => {
    if (role === 'MEMBER') return '/app/profile';
    if (role === 'TRAINER') return '/trainer';
    return '/admin/settings';
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button: Avatar + Chevron badge (Facebook Style) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-100 transition-all focus:outline-none focus:ring-2 focus:ring-volt-dark"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Tài khoản cá nhân & Cài đặt"
      >
        <div className="relative">
          {/* Avatar Circle */}
          <div className="w-9 h-9 rounded-full bg-slate-900 text-volt font-black text-sm flex items-center justify-center border-2 border-slate-700 shadow-sm shrink-0">
            {user.name.charAt(0)}
          </div>
          {/* Bottom-right chevron badge like Facebook */}
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-slate-200 border border-white text-slate-700 flex items-center justify-center shadow-xs">
            <ChevronDown className={`w-2.5 h-2.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </button>

      {/* Floating Dropdown Menu (Facebook Style Card) */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[340px] sm:w-[360px] bg-surface rounded-2xl shadow-2xl border border-border p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* 1. Header Card: Profile preview with click-through */}
          <div
            onClick={() => {
              setIsOpen(false);
              navigate(getProfileLink());
            }}
            className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer border border-slate-200 flex items-center gap-3 group"
          >
            <div className="w-12 h-12 rounded-full bg-slate-900 text-volt font-black text-base flex items-center justify-center border border-slate-700 shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-text-primary truncate group-hover:text-volt-dark transition-colors">
                {user.name}
              </div>
              <div className="text-[11px] text-text-secondary truncate mt-0.5 font-medium flex items-center gap-1">
                <span>{getRoleLabel()}</span>
                <span>•</span>
                <span className="font-mono text-[10px] text-slate-500">{user.id}</span>
              </div>
              <div className="text-[10px] text-volt-dark font-semibold mt-1 flex items-center gap-0.5">
                <span>Xem trang cá nhân</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

          <div className="h-px bg-border my-2.5" />

          {/* 2. Action Items depending on Role */}
          <div className="space-y-1">
            {/* MEMBER SPECIFIC ITEMS */}
            {role === 'MEMBER' && (
              <>
                {onOpenQr && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      onOpenQr();
                    }}
                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                  >
                    <div className="w-9 h-9 rounded-full bg-volt/20 text-darksidebar-bg flex items-center justify-center shrink-0 group-hover:bg-volt group-hover:text-darksidebar-bg transition-colors">
                      <QrCode className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-text-primary">Mã QR Check-in Sảnh</div>
                      <div className="text-[10px] text-text-secondary truncate">Mở mã Dynamic QR để quét tại cổng Kiosk</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/app/schedule');
                  }}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                >
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-slate-200 transition-colors">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-text-primary">Lịch tập & Ca PT của tôi</div>
                    <div className="text-[10px] text-text-secondary truncate">Xem ca tập sắp tới, đổi hoặc hủy lịch</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/app/plans');
                  }}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                >
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-slate-200 transition-colors">
                    <Package className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-text-primary">Gói tập & Đăng ký thêm</div>
                    <div className="text-[10px] text-text-secondary truncate">Xem số buổi PT còn lại và gia hạn gói</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/app/workouts');
                  }}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                >
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-slate-200 transition-colors">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-text-primary">Giáo án rèn luyện</div>
                    <div className="text-[10px] text-text-secondary truncate">Xem bài tập và hướng dẫn do PT giao</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>
              </>
            )}

            {/* TRAINER SPECIFIC ITEMS */}
            {role === 'TRAINER' && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/trainer/schedule');
                  }}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                >
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-slate-200 transition-colors">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-text-primary">Lịch ca trực tuần & Nghỉ phép</div>
                    <div className="text-[10px] text-text-secondary truncate">Quản lý ca trực cố định và gửi đơn xin nghỉ</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/trainer/members');
                  }}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                >
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-slate-200 transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-text-primary">Học viên phụ trách (1 kèm 1)</div>
                    <div className="text-[10px] text-text-secondary truncate">Danh sách học viên và lịch sử tập luyện</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/trainer/plans');
                  }}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                >
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-slate-200 transition-colors">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-text-primary">Soạn giáo án bài tập</div>
                    <div className="text-[10px] text-text-secondary truncate">Tạo giáo án, sets, reps và gán cho học viên</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>
              </>
            )}

            {/* MANAGER SPECIFIC ITEMS */}
            {role === 'MANAGER' && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/admin/members');
                  }}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                >
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-slate-200 transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-text-primary">Cấp tài khoản & Quản lý hội viên</div>
                    <div className="text-[10px] text-text-secondary truncate">Cấp thẻ mới tại quầy, khóa/mở tài khoản</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/admin/reports');
                  }}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                >
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-slate-200 transition-colors">
                    <Sparkles className="w-4 h-4 text-volt-dark" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-text-primary">Báo cáo doanh thu & Vận hành</div>
                    <div className="text-[10px] text-text-secondary truncate">Doanh thu tuần, ca tập và mật độ phòng</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>
              </>
            )}

            {/* Settings & Password Item for All */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate(getProfileLink());
              }}
              className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors text-left group"
            >
              <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-slate-200 transition-colors">
                <KeyRound className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-text-primary">Cài đặt bảo mật & Đổi mật khẩu</div>
                <div className="text-[10px] text-text-secondary truncate">Đổi mật khẩu riêng và quản lý dữ liệu cá nhân</div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </button>
          </div>

          <div className="h-px bg-border my-2.5" />

          {/* 3. Bottom Items: Help & Log Out (Facebook Style) */}
          <div className="space-y-1">
            <div className="px-2 py-1.5 text-[11px] text-slate-500 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" /> Hỗ trợ lễ tân:
              </span>
              <strong className="text-text-primary font-mono">1900 6868</strong>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-rose-50 transition-colors text-left group text-rose-600"
            >
              <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 group-hover:bg-rose-200 transition-colors">
                <LogOut className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-rose-700">Đăng xuất tài khoản</div>
                <div className="text-[10px] text-rose-500 truncate">Đăng xuất khỏi phiên làm việc hiện tại</div>
              </div>
              <ChevronRight className="w-4 h-4 text-rose-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
