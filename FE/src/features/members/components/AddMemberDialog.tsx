import React, { useState } from 'react';
import { Dialog, DialogContent } from '../../../components/common/Dialog';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { memberService } from '../../../mocks/services';
import { MOCK_PLANS } from '../../../mocks/mockData';
import { KeyRound, ShieldCheck, CreditCard, Banknote } from 'lucide-react';

interface AddMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddMemberDialog: React.FC<AddMemberDialogProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [goal, setGoal] = useState('Giảm cân & Đốt mỡ thừa');
  const [selectedPlanId, setSelectedPlanId] = useState(MOCK_PLANS[0].id);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'TRANSFER'>('TRANSFER');
  const [defaultPassword] = useState('SmartGym@123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('Vui lòng điền đầy đủ các trường thông tin bắt buộc (*)');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const plan = MOCK_PLANS.find((p) => p.id === selectedPlanId);
      await memberService.addMember({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        status: 'ACTIVE',
        goal,
        membership: plan
          ? {
              id: `ms-${Date.now()}`,
              memberId: 'temp',
              planId: plan.id,
              planName: plan.name,
              startsAt: new Date().toISOString().split('T')[0],
              endsAt: new Date(Date.now() + plan.durationDays * 86400000).toISOString().split('T')[0],
              totalPt: plan.ptSessions,
              usedPt: 0,
              reservedPt: 0,
              gymAccess: plan.gymAccess,
              status: 'ACTIVE',
            }
          : undefined,
      });
      onSuccess();
      onClose();
    } catch {
      setError('Có lỗi xảy ra khi cấp phát tài khoản hội viên');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        title="Cấp Phát Tài Khoản Hội Viên Tại Quầy"
        description="Định danh hội viên, kích hoạt gói tập ban đầu và cấp tài khoản đăng nhập Cổng Member"
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-1 max-h-[80vh] overflow-y-auto pr-1">
          {error && <div className="text-xs text-status-danger bg-rose-50 p-2.5 rounded border border-rose-200">{error}</div>}

          <div className="p-3 bg-slate-50 border border-border rounded-md text-xs text-text-secondary flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              Tài khoản được cấp sẽ có trạng thái <strong>ACTIVE</strong> và kích hoạt quyền vào phòng ngay. Hội viên có thể đăng nhập đổi mật khẩu cá nhân tại Cổng Member.
            </div>
          </div>

          <Input
            label="Họ và tên hội viên *"
            placeholder="Ví dụ: Trần Quốc Toản"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Địa chỉ Email (Tên đăng nhập) *"
              type="email"
              placeholder="toan.tran@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Số điện thoại liên hệ *"
              placeholder="0912 345 678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-primary">Mục tiêu rèn luyện ban đầu</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full h-10 rounded-md bg-surface border border-border px-3 text-xs text-text-primary focus:outline-none focus:border-primary"
            >
              <option value="Giảm cân & Đốt mỡ thừa">Giảm cân & Đốt mỡ thừa</option>
              <option value="Tăng cơ bắp & Thể hình">Tăng cơ bắp & Thể hình</option>
              <option value="Rèn luyện sức bền tim mạch">Rèn luyện sức bền tim mạch</option>
              <option value="Cải thiện sức khỏe tổng quát">Cải thiện sức khỏe tổng quát</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-text-primary">Gói tập kích hoạt *</label>
              <select
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                className="w-full h-10 rounded-md bg-surface border border-border px-3 text-xs font-bold text-text-primary focus:outline-none focus:border-primary"
              >
                {MOCK_PLANS.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} ({plan.durationDays} ngày - {plan.priceVnd.toLocaleString('vi-VN')} đ)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-text-primary">Hình thức thu tiền *</label>
              <div className="grid grid-cols-2 gap-2 h-10">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('TRANSFER')}
                  className={`flex items-center justify-center gap-1.5 text-xs font-bold rounded-md border transition-all ${
                    paymentMethod === 'TRANSFER'
                      ? 'border-primary bg-primary-light text-primary'
                      : 'border-border bg-surface text-text-secondary hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" /> Chuyển khoản
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CASH')}
                  className={`flex items-center justify-center gap-1.5 text-xs font-bold rounded-md border transition-all ${
                    paymentMethod === 'CASH'
                      ? 'border-primary bg-primary-light text-primary'
                      : 'border-border bg-surface text-text-secondary hover:bg-slate-50'
                  }`}
                >
                  <Banknote className="w-3.5 h-3.5" /> Tiền mặt
                </button>
              </div>
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-md space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-amber-900 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-700" /> Mật khẩu khởi tạo:
              </span>
              <span className="font-mono font-bold text-amber-950 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                {defaultPassword}
              </span>
            </div>
            <p className="text-[11px] text-amber-800 leading-tight">
              Cung cấp mật khẩu này cho hội viên để đăng nhập lần đầu vào Cổng Member (`/app`).
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border mt-4">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
              Hủy bỏ
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Cấp tài khoản & Thu tiền
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
