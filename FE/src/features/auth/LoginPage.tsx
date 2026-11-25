import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Lock, Mail, ShieldAlert } from 'lucide-react';

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
      // Route based on role
      if (email.includes('pt') || email.includes('trainer')) {
        navigate('/trainer/schedule');
      } else if (email.includes('kiosk')) {
        navigate('/kiosk');
      } else if (email.includes('member') || email.includes('an.nguyen')) {
        navigate('/app/home');
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
    <div className="w-full max-w-[420px] bg-surface border border-border rounded-lg shadow-sm p-6 sm:p-8">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-text-primary tracking-tight">Đăng nhập hệ thống</h2>
        <p className="text-xs text-text-secondary mt-1">
          Nhập tài khoản để truy cập hệ thống quản lý phòng gym
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-md bg-status-danger-bg border border-rose-200 flex items-center gap-2 text-xs text-status-danger">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Địa chỉ Email"
          type="email"
          placeholder="email@smartgym.vn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="w-4 h-4" />}
          required
        />

        <Input
          label="Mật khẩu"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="w-4 h-4" />}
          required
        />

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-text-secondary cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded border-border text-primary focus:ring-primary" />
            <span>Ghi nhớ đăng nhập</span>
          </label>
          <a href="#forgot" className="text-primary hover:underline font-medium">
            Quên mật khẩu?
          </a>
        </div>

        <Button type="submit" variant="primary" className="w-full font-semibold" isLoading={isLoading}>
          Đăng nhập hệ thống
        </Button>
      </form>

      {/* Quick Account Switcher for Demo */}
      <div className="mt-6 pt-5 border-t border-border/80">
        <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2 text-center">
          Tài khoản kiểm thử nhanh (Demo)
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleQuickSelect('admin@smartgym.vn')}
            className="p-2 text-left rounded border border-border hover:bg-surface-hover transition-colors"
          >
            <div className="font-semibold text-text-primary">Quản lý (Admin)</div>
            <div className="text-[10px] text-text-secondary truncate">admin@smartgym.vn</div>
          </button>
          <button
            type="button"
            onClick={() => handleQuickSelect('an.nguyen@smartgym.vn')}
            className="p-2 text-left rounded border border-border hover:bg-surface-hover transition-colors"
          >
            <div className="font-semibold text-text-primary">Hội viên (Member)</div>
            <div className="text-[10px] text-text-secondary truncate">an.nguyen@smartgym.vn</div>
          </button>
          <button
            type="button"
            onClick={() => handleQuickSelect('long.pt@smartgym.vn')}
            className="p-2 text-left rounded border border-border hover:bg-surface-hover transition-colors"
          >
            <div className="font-semibold text-text-primary">Huấn luyện viên</div>
            <div className="text-[10px] text-text-secondary truncate">long.pt@smartgym.vn</div>
          </button>
          <button
            type="button"
            onClick={() => handleQuickSelect('kiosk1@smartgym.vn')}
            className="p-2 text-left rounded border border-border hover:bg-surface-hover transition-colors"
          >
            <div className="font-semibold text-text-primary">Kiosk Cổng</div>
            <div className="text-[10px] text-text-secondary truncate">kiosk1@smartgym.vn</div>
          </button>
        </div>
      </div>
    </div>
  );
};
