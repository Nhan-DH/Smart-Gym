import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Lock, Mail, ShieldAlert, Dumbbell, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@smartgym.vn');
  const [password, setPassword] = useState('12345678');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Vui lòng nhập địa chỉ email');
      return;
    }
    setError(null);
    try {
      await login(email);
      // Route accurately based on role
      const lower = email.toLowerCase().trim();
      if (lower.includes('pt') || lower.includes('trainer') || lower.includes('long.pt')) {
        navigate('/trainer');
      } else if (lower.includes('kiosk')) {
        navigate('/kiosk');
      } else if (lower.includes('member') || lower.includes('an.nguyen')) {
        navigate('/app');
      } else {
        navigate('/admin/dashboard');
      }
    } catch {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    }
  };

  const handleQuickSelect = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('12345678');
    setError(null);
  };

  return (
    <div className="w-full max-w-[440px] bg-surface border border-border rounded-xl shadow-lg p-6 sm:p-8">
      {/* Brand Header */}
      <div className="mb-6 text-center space-y-2">
        <div className="w-12 h-12 rounded-lg bg-darksidebar-bg text-volt flex items-center justify-center font-black shadow-volt mx-auto">
          <Dumbbell className="w-6 h-6 stroke-[2.5]" />
        </div>
        <h1 className="text-2xl font-black text-text-primary tracking-tight">
          Smart<span className="text-volt-dark">Gym</span>
        </h1>
        <p className="text-xs text-text-secondary">
          Hệ thống Quản lý Phòng Gym Thông Minh & Điểm Danh Sinh Trắc Học
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Địa chỉ Email *"
          type="email"
          placeholder="email@smartgym.vn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
          required
        />

        <Input
          label="Mật khẩu *"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
          required
        />

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 text-text-secondary cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded border-border accent-volt text-darksidebar-bg" />
            <span>Ghi nhớ đăng nhập</span>
          </label>
          <span className="text-volt-dark hover:underline font-semibold cursor-pointer">
            Quên mật khẩu?
          </span>
        </div>

        <Button type="submit" variant="volt" className="w-full font-bold h-11" isLoading={isLoading}>
          Đăng nhập hệ thống
        </Button>

        {/* Centralized Provisioning Notice */}
        <div className="text-center text-[11px] text-text-secondary pt-2 leading-relaxed bg-slate-50 p-2.5 rounded-md border border-slate-200">
          Chưa có tài khoản hội viên?{' '}
          <span className="font-semibold text-text-primary">
            Vui lòng đến quầy lễ tân SmartGym để đăng ký gói tập và nhận tài khoản kích hoạt.
          </span>
        </div>
      </form>

      {/* Quick Account Switcher for Defense & Demo */}
      <div className="mt-6 pt-5 border-t border-border">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-volt-dark" />
          <span>Chọn nhanh tài khoản Demo</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleQuickSelect('admin@smartgym.vn')}
            className={`p-2.5 text-left rounded-md border transition-all ${email === 'admin@smartgym.vn'
              ? 'border-volt bg-slate-900 text-white'
              : 'border-border hover:bg-slate-50 text-text-primary'
              }`}
          >
            <div className="font-bold text-xs">Quản lý (Manager)</div>
            <div className="text-[10px] text-slate-400 truncate mt-0.5">admin@smartgym.vn</div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickSelect('an.nguyen@smartgym.vn')}
            className={`p-2.5 text-left rounded-md border transition-all ${email === 'an.nguyen@smartgym.vn'
              ? 'border-volt bg-slate-900 text-white'
              : 'border-border hover:bg-slate-50 text-text-primary'
              }`}
          >
            <div className="font-bold text-xs">Hội viên (Member)</div>
            <div className="text-[10px] text-slate-400 truncate mt-0.5">an.nguyen@smartgym.vn</div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickSelect('long.pt@smartgym.vn')}
            className={`p-2.5 text-left rounded-md border transition-all ${email === 'long.pt@smartgym.vn'
              ? 'border-volt bg-slate-900 text-white'
              : 'border-border hover:bg-slate-50 text-text-primary'
              }`}
          >
            <div className="font-bold text-xs">Huấn luyện viên</div>
            <div className="text-[10px] text-slate-400 truncate mt-0.5">long.pt@smartgym.vn</div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickSelect('kiosk1@smartgym.vn')}
            className={`p-2.5 text-left rounded-md border transition-all ${email === 'kiosk1@smartgym.vn'
              ? 'border-volt bg-slate-900 text-white'
              : 'border-border hover:bg-slate-50 text-text-primary'
              }`}
          >
            <div className="font-bold text-xs">Kiosk Check-in</div>
            <div className="text-[10px] text-slate-400 truncate mt-0.5">kiosk1@smartgym.vn</div>
          </button>
        </div>
      </div>
    </div>
  );
};
