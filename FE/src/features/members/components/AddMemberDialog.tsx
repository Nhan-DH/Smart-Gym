import React, { useState } from 'react';
import { Dialog, DialogContent } from '../../../components/common/Dialog';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { memberService } from '../../../mocks/services';
import { MOCK_PLANS } from '../../../mocks/mockData';

interface AddMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddMemberDialog: React.FC<AddMemberDialogProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState(MOCK_PLANS[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const plan = MOCK_PLANS.find((p) => p.id === selectedPlanId);
      await memberService.addMember({
        name,
        email,
        phone,
        status: 'ACTIVE',
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
      setError('Có lỗi xảy ra khi tạo hội viên');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent title="Thêm Hội Viên Mới" description="Tạo hồ sơ và gán gói tập ban đầu cho hội viên">
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error && <div className="text-xs text-status-danger bg-rose-50 p-2 rounded">{error}</div>}

          <Input
            label="Họ và tên *"
            placeholder="Nguyễn Văn A"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Địa chỉ Email *"
            type="email"
            placeholder="nguyenvana@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Số điện thoại *"
            placeholder="0912 345 678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-primary">Gói tập ban đầu</label>
            <select
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              className="w-full h-10 rounded-md bg-surface border border-border px-3 text-sm text-text-primary focus:outline-none focus:border-primary"
            >
              {MOCK_PLANS.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} ({plan.durationDays} ngày)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border mt-6">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
              Hủy bỏ
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Tạo hội viên
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
